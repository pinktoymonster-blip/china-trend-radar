import { NextResponse } from "next/server";
import { analyzeTrendWithOpenAI, type TrendAnalysis } from "@/lib/openai-analysis";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase-rest";
import { getTrendBySlug } from "@/lib/trend-store";

export const dynamic = "force-dynamic";

type EnrichmentRow = {
  trend_slug: string;
  summary: string;
  why_trending: string;
  audience: string;
  spread_path: string;
  brand_fit: string;
  risk_level: "low" | "medium" | "high";
  risk_reason: string;
  content_angles: string[];
  keywords: string[];
  confidence: number;
  model: string;
  analyzed_at: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      enrichment: null,
      error: "Supabase is not configured.",
    });
  }

  try {
    const rows = await supabaseRest<EnrichmentRow[]>(
      `trend_enrichments?trend_slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    );

    return NextResponse.json({
      configured: true,
      enrichment: rows[0] ?? null,
    });
  } catch (error) {
    return NextResponse.json({
      configured: false,
      enrichment: null,
      error: error instanceof Error ? error.message : "Unable to load enrichment.",
    });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const trend = await getTrendBySlug(slug);

  if (!trend) {
    return NextResponse.json({ error: "Trend not found." }, { status: 404 });
  }

  try {
    const analysis = await analyzeTrendWithOpenAI(trend);
    const row = toEnrichmentRow(slug, analysis);

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        saved: false,
        enrichment: row,
        error: "Supabase is not configured. Analysis was generated but not saved.",
      });
    }

    const rows = await supabaseRest<EnrichmentRow[]>("trend_enrichments?on_conflict=trend_slug", {
      method: "POST",
      headers: {
        prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([row]),
    });

    return NextResponse.json({
      saved: true,
      enrichment: rows[0] ?? row,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to analyze trend." },
      { status: 500 },
    );
  }
}

function toEnrichmentRow(slug: string, analysis: TrendAnalysis): EnrichmentRow {
  return {
    trend_slug: slug,
    summary: analysis.summary,
    why_trending: analysis.why_trending,
    audience: analysis.audience,
    spread_path: analysis.spread_path,
    brand_fit: analysis.brand_fit,
    risk_level: analysis.risk_level,
    risk_reason: analysis.risk_reason,
    content_angles: analysis.content_angles,
    keywords: analysis.keywords,
    confidence: analysis.confidence,
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    analyzed_at: new Date().toISOString(),
  };
}
