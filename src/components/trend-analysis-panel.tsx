"use client";

import { useEffect, useState } from "react";

type Enrichment = {
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

export function TrendAnalysisPanel({ slug }: { slug: string }) {
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadEnrichment() {
      try {
        const response = await fetch(`/api/trends/${slug}/analysis`, { cache: "no-store" });
        const data = (await response.json()) as {
          enrichment?: Enrichment | null;
          error?: string;
        };
        setEnrichment(data.enrichment ?? null);
        setMessage(data.error ?? "");
      } catch {
        setMessage("AI 分析读取失败。");
      } finally {
        setLoading(false);
      }
    }

    void loadEnrichment();
  }, [slug]);

  async function analyze() {
    setAnalyzing(true);
    setMessage("");

    try {
      const response = await fetch(`/api/trends/${slug}/analysis`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        saved?: boolean;
        enrichment?: Enrichment;
        error?: string;
      };

      if (!response.ok || !data.enrichment) {
        throw new Error(data.error || "AI 分析失败。");
      }

      setEnrichment(data.enrichment);
      setMessage(data.saved ? "AI 分析已保存。" : data.error || "AI 分析已生成，但尚未保存。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI 分析失败。");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#d9d1c3] bg-[#fffdf8] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1f2933]">AI 趋势分析</h2>
          <p className="mt-2 text-sm leading-6 text-[#64707d]">
            由 LLM 根据当前信号生成摘要、受众、风险和内容角度，并保存到数据库。
          </p>
        </div>
        <button
          type="button"
          onClick={() => void analyze()}
          disabled={loading || analyzing}
          className="h-10 rounded-lg bg-[#1f2933] px-4 text-sm font-semibold text-white transition hover:bg-[#33404d] disabled:opacity-60"
        >
          {analyzing ? "分析中..." : enrichment ? "重新分析" : "生成分析"}
        </button>
      </div>

      {message ? (
        <div className="mt-4 rounded-lg bg-[#fff1c2] px-3 py-2 text-sm font-semibold text-[#7a5b00]">
          {message}
        </div>
      ) : null}

      {loading ? <p className="mt-4 text-sm text-[#64707d]">正在读取 AI 分析...</p> : null}

      {enrichment ? (
        <div className="mt-5 grid gap-4">
          <AnalysisBlock title="摘要">{enrichment.summary}</AnalysisBlock>
          <AnalysisBlock title="为什么火了">{enrichment.why_trending}</AnalysisBlock>
          <AnalysisBlock title="目标人群">{enrichment.audience}</AnalysisBlock>
          <AnalysisBlock title="传播路径">{enrichment.spread_path}</AnalysisBlock>
          <AnalysisBlock title="品牌适配">{enrichment.brand_fit}</AnalysisBlock>
          <AnalysisBlock title="风险判断">
            {riskLabel(enrichment.risk_level)} · {enrichment.risk_reason}
          </AnalysisBlock>

          <div>
            <h3 className="text-xs font-semibold text-[#64707d]">内容角度</h3>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[#1f2933]">
              {enrichment.content_angles.map((angle) => (
                <li key={angle}>{angle}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#64707d]">关键词</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {enrichment.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-[#f1eadf] px-2 py-1 text-xs font-semibold text-[#6b5639]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#64707d]">
            Model: {enrichment.model} · Confidence: {Math.round(enrichment.confidence * 100)}% ·{" "}
            {new Date(enrichment.analyzed_at).toLocaleString("zh-CN")}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AnalysisBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[#64707d]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#1f2933]">{children}</p>
    </div>
  );
}

function riskLabel(level: Enrichment["risk_level"]) {
  if (level === "low") {
    return "低风险";
  }

  if (level === "high") {
    return "高风险";
  }

  return "需观察";
}
