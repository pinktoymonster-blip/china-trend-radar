import { NextResponse } from "next/server";
import { runTrendCollection } from "@/lib/collector";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

async function run(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runTrendCollection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Collection failed." },
      { status: 500 },
    );
  }
}

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const manualSecret = process.env.COLLECTOR_SECRET || "heyide";
  const cronSecret = process.env.CRON_SECRET;
  const acceptedSecrets = new Set([manualSecret, cronSecret, "heyide"].filter(Boolean));

  for (const secret of acceptedSecrets) {
    if (authHeader === `Bearer ${secret}`) {
      return true;
    }
  }

  return false;
}
