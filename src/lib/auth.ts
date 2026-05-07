import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const accessCookieName = "china_trend_radar_access";
export const accessToken = "enabled";
export const accessPassword = "heyide";

export async function requireAccess(nextPath = "/") {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get(accessCookieName)?.value === accessToken;

  if (!hasAccess) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
}
