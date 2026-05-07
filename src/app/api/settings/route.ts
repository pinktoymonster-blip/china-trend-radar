import { NextResponse } from "next/server";
import { defaultSettings, type RadarSettings } from "@/lib/settings";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase-rest";
import type { Platform } from "@/lib/trends";

export const dynamic = "force-dynamic";

type SourceRow = {
  source_id: string;
  platform: Platform;
  name: string;
  interval_minutes: number;
  enabled: boolean;
  sort_order: number;
};

type WeightRow = {
  weight_key: string;
  label: string;
  weight_value: number;
  note: string;
  sort_order: number;
};

type CategoryRow = {
  category_key: string;
  label: string;
  enabled: boolean;
  sort_order: number;
};

type RiskRuleRow = {
  rule_key: string;
  label: string;
  action: "downrank" | "exclude" | "review";
  enabled: boolean;
  sort_order: number;
};

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ...defaultSettings,
      error: "Supabase is not configured. Add environment variables to enable saving.",
    });
  }

  try {
    const [sourceRows, weightRows, categoryRows, riskRuleRows] = await Promise.all([
      supabaseRest<SourceRow[]>("collection_sources?select=*&order=sort_order.asc"),
      supabaseRest<WeightRow[]>("scoring_weights?select=*&order=sort_order.asc"),
      supabaseRest<CategoryRow[]>("monitoring_categories?select=*&order=sort_order.asc"),
      supabaseRest<RiskRuleRow[]>("risk_rules?select=*&order=sort_order.asc"),
    ]);

    const settings: RadarSettings = {
      configured: true,
      sources: sourceRows.length
        ? sourceRows.map((row) => ({
            id: row.source_id,
            platform: row.platform,
            name: row.name,
            intervalMinutes: row.interval_minutes,
            enabled: row.enabled,
            sortOrder: row.sort_order,
          }))
        : defaultSettings.sources,
      scoringWeights: weightRows.length
        ? weightRows.map((row) => ({
            key: row.weight_key,
            label: row.label,
            value: row.weight_value,
            note: row.note,
            sortOrder: row.sort_order,
          }))
        : defaultSettings.scoringWeights,
      categories: categoryRows.length
        ? categoryRows.map((row) => ({
            key: row.category_key,
            label: row.label,
            enabled: row.enabled,
            sortOrder: row.sort_order,
          }))
        : defaultSettings.categories,
      riskRules: riskRuleRows.length
        ? riskRuleRows.map((row) => ({
            key: row.rule_key,
            label: row.label,
            action: row.action,
            enabled: row.enabled,
            sortOrder: row.sort_order,
          }))
        : defaultSettings.riskRules,
    };

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({
      ...defaultSettings,
      configured: false,
      error: error instanceof Error ? error.message : "Unable to load settings.",
    });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Settings cannot be saved yet." },
      { status: 503 },
    );
  }

  const body = await request.json();

  try {
    if (body.resource === "source") {
      await supabaseRest(`collection_sources?source_id=eq.${encodeURIComponent(body.id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          enabled: body.changes.enabled,
          interval_minutes: body.changes.intervalMinutes,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (body.resource === "weight") {
      await supabaseRest(`scoring_weights?weight_key=eq.${encodeURIComponent(body.id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          weight_value: body.changes.value,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (body.resource === "category") {
      await supabaseRest(`monitoring_categories?category_key=eq.${encodeURIComponent(body.id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          enabled: body.changes.enabled,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (body.resource === "riskRule") {
      await supabaseRest(`risk_rules?rule_key=eq.${encodeURIComponent(body.id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          enabled: body.changes.enabled,
          action: body.changes.action,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save settings." },
      { status: 500 },
    );
  }
}
