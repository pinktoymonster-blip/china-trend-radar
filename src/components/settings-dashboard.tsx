"use client";

import { useEffect, useState } from "react";
import {
  defaultSettings,
  type CollectionSource,
  type RadarSettings,
  type RiskRule,
  type ScoringWeight,
} from "@/lib/settings";
import { platformLabels } from "@/lib/trends";

const intervalOptions = [15, 30, 60, 120];
const riskActions: Record<RiskRule["action"], string> = {
  downrank: "降权",
  exclude: "排除",
  review: "观察",
};

export function SettingsDashboard() {
  const [settings, setSettings] = useState<RadarSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const data = (await response.json()) as RadarSettings;
        setSettings(data);
      } catch {
        setSettings({
          ...defaultSettings,
          error: "设置读取失败，当前显示默认配置。",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  async function saveSetting(resource: string, id: string, changes: Record<string, unknown>) {
    if (!settings.configured) {
      setMessage("Supabase 未连接，当前设置不会保存。");
      return false;
    }

    setSavingKey(`${resource}:${id}`);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resource, id, changes }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "保存失败");
      }

      setMessage("设置已保存。");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
      return false;
    } finally {
      setSavingKey("");
    }
  }

  async function updateSource(source: CollectionSource, changes: Partial<CollectionSource>) {
    const nextSource = { ...source, ...changes };
    setSettings((current) => ({
      ...current,
      sources: current.sources.map((item) => (item.id === source.id ? nextSource : item)),
    }));
    await saveSetting("source", source.id, changes);
  }

  async function updateWeight(weight: ScoringWeight) {
    await saveSetting("weight", weight.key, { value: weight.value });
  }

  async function updateCategory(key: string, enabled: boolean) {
    setSettings((current) => ({
      ...current,
      categories: current.categories.map((item) => (item.key === key ? { ...item, enabled } : item)),
    }));
    await saveSetting("category", key, { enabled });
  }

  async function updateRiskRule(rule: RiskRule, changes: Partial<RiskRule>) {
    const nextRule = { ...rule, ...changes };
    setSettings((current) => ({
      ...current,
      riskRules: current.riskRules.map((item) => (item.key === rule.key ? nextRule : item)),
    }));
    await saveSetting("riskRule", rule.key, changes);
  }

  const totalWeight = settings.scoringWeights.reduce((sum, weight) => sum + weight.value, 0);
  const disabled = !settings.configured;

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
      <div className="lg:col-span-2">
        <div
          className={
            settings.configured
              ? "rounded-lg border border-[#d9d1c3] bg-[#edf4ef] px-4 py-3 text-sm font-semibold text-[#2c6e49]"
              : "rounded-lg border border-[#d9d1c3] bg-[#fff1c2] px-4 py-3 text-sm font-semibold text-[#7a5b00]"
          }
        >
          {loading
            ? "正在读取设置..."
            : settings.configured
              ? "Supabase 已连接，设置会保存到数据库。"
              : settings.error || "Supabase 未连接，当前显示默认配置。"}
          {message ? <span className="ml-2">{message}</span> : null}
        </div>
      </div>

      <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">采集来源</h2>
            <p className="mt-1 text-sm text-[#64707d]">启用状态和采集周期会写入数据库。</p>
          </div>
          <span className="rounded-md bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#2c6e49]">
            自动
          </span>
        </div>

        <div className="mt-5 divide-y divide-[#eee6dc]">
          {settings.sources.map((source) => (
            <div key={source.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_118px_96px] sm:items-center">
              <div>
                <div className="font-semibold text-[#1f2933]">{source.name}</div>
                <div className="mt-1 text-xs text-[#64707d]">
                  平台：{platformLabels[source.platform]}
                </div>
              </div>
              <select
                value={source.intervalMinutes}
                disabled={disabled || savingKey === `source:${source.id}`}
                onChange={(event) =>
                  void updateSource(source, { intervalMinutes: Number(event.target.value) })
                }
                className="h-10 rounded-md border border-[#d9d1c3] bg-[#f1eadf] px-3 text-sm font-semibold text-[#6b5639] disabled:opacity-60"
              >
                {intervalOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} 分钟
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={disabled || savingKey === `source:${source.id}`}
                onClick={() => void updateSource(source, { enabled: !source.enabled })}
                className={
                  source.enabled
                    ? "h-10 rounded-md bg-[#edf4ef] px-3 text-sm font-semibold text-[#2c6e49] disabled:opacity-60"
                    : "h-10 rounded-md bg-[#eee6dc] px-3 text-sm font-semibold text-[#64707d] disabled:opacity-60"
                }
              >
                {source.enabled ? "启用" : "暂停"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
        <h2 className="text-lg font-semibold">评分模型</h2>
        <p className="mt-1 text-sm text-[#64707d]">
          权重总和当前为 {totalWeight}。建议保持 100。
        </p>

        <div className="mt-5 space-y-4">
          {settings.scoringWeights.map((weight) => (
            <div key={weight.key}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-[#1f2933]">{weight.label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={weight.value}
                    disabled={disabled || savingKey === `weight:${weight.key}`}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setSettings((current) => ({
                        ...current,
                        scoringWeights: current.scoringWeights.map((item) =>
                          item.key === weight.key ? { ...item, value } : item,
                        ),
                      }));
                    }}
                    className="h-9 w-20 rounded-md border border-[#d9d1c3] px-2 text-right text-sm font-semibold disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={disabled || savingKey === `weight:${weight.key}`}
                    onClick={() => void updateWeight(weight)}
                    className="h-9 rounded-md bg-[#1f2933] px-3 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    保存
                  </button>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#eee6dc]">
                <div className="h-full rounded-full bg-[#a34832]" style={{ width: `${weight.value}%` }} />
              </div>
              <p className="mt-2 text-xs leading-5 text-[#64707d]">{weight.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
        <h2 className="text-lg font-semibold">监测范围</h2>
        <p className="mt-1 text-sm text-[#64707d]">关闭后，该类型不会进入候选池。</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {settings.categories.map((category) => (
            <button
              type="button"
              key={category.key}
              disabled={disabled || savingKey === `category:${category.key}`}
              onClick={() => void updateCategory(category.key, !category.enabled)}
              className={
                category.enabled
                  ? "rounded-md bg-[#f1eadf] px-3 py-2 text-sm font-semibold text-[#6b5639] disabled:opacity-60"
                  : "rounded-md bg-[#eee6dc] px-3 py-2 text-sm font-semibold text-[#64707d] disabled:opacity-60"
              }
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
        <h2 className="text-lg font-semibold">风险与降权规则</h2>
        <p className="mt-1 text-sm text-[#64707d]">命中规则的趋势会按设置处理。</p>
        <div className="mt-5 space-y-3">
          {settings.riskRules.map((rule) => (
            <div
              key={rule.key}
              className="grid gap-3 rounded-lg border border-[#eee6dc] px-3 py-3 text-sm sm:grid-cols-[1fr_100px_92px] sm:items-center"
            >
              <span className="font-semibold text-[#1f2933]">{rule.label}</span>
              <select
                value={rule.action}
                disabled={disabled || savingKey === `riskRule:${rule.key}`}
                onChange={(event) =>
                  void updateRiskRule(rule, { action: event.target.value as RiskRule["action"] })
                }
                className="h-9 rounded-md border border-[#d9d1c3] bg-[#fff1c2] px-2 text-xs font-semibold text-[#7a5b00] disabled:opacity-60"
              >
                {Object.entries(riskActions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={disabled || savingKey === `riskRule:${rule.key}`}
                onClick={() => void updateRiskRule(rule, { enabled: !rule.enabled })}
                className={
                  rule.enabled
                    ? "h-9 rounded-md bg-[#edf4ef] text-xs font-semibold text-[#2c6e49] disabled:opacity-60"
                    : "h-9 rounded-md bg-[#eee6dc] text-xs font-semibold text-[#64707d] disabled:opacity-60"
                }
              >
                {rule.enabled ? "启用" : "暂停"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
