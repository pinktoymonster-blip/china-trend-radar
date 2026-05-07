import type { Trend } from "@/lib/trends";

export type TrendAnalysis = {
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
};

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    why_trending: { type: "string" },
    audience: { type: "string" },
    spread_path: { type: "string" },
    brand_fit: { type: "string" },
    risk_level: { type: "string", enum: ["low", "medium", "high"] },
    risk_reason: { type: "string" },
    content_angles: {
      type: "array",
      items: { type: "string" },
    },
    keywords: {
      type: "array",
      items: { type: "string" },
    },
    confidence: { type: "number" },
  },
  required: [
    "summary",
    "why_trending",
    "audience",
    "spread_path",
    "brand_fit",
    "risk_level",
    "risk_reason",
    "content_angles",
    "keywords",
    "confidence",
  ],
};

export async function analyzeTrendWithOpenAI(trend: Trend) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "你是中国社交媒体趋势分析师。只根据输入信号进行判断，不要编造具体平台数据。输出必须是中文 JSON。",
        },
        {
          role: "user",
          content: JSON.stringify({
            title: trend.title,
            platform: trend.platform,
            type: trend.type,
            lifecycle: trend.lifecycle,
            rank: trend.rank,
            heat: trend.heat,
            growth_rate: trend.growthRate,
            cross_platform_count: trend.crossPlatformCount,
            tags: trend.tags,
            current_summary: trend.summary,
            current_signal: trend.signal,
            current_spread_path: trend.spreadPath,
            sample_signals: trend.sampleSignals,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "trend_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  const outputText = extractOutputText(data);

  if (!outputText) {
    throw new Error("OpenAI response did not include output text.");
  }

  return JSON.parse(outputText) as TrendAnalysis;
}

function extractOutputText(response: unknown) {
  const outputText = (response as { output_text?: unknown }).output_text;

  if (typeof outputText === "string") {
    return outputText;
  }

  const output = (response as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return "";
  }

  for (const item of output) {
    const content = (item as { content?: unknown }).content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const part of content) {
      const text = (part as { text?: unknown }).text;
      if (typeof text === "string") {
        return text;
      }
    }
  }

  return "";
}
