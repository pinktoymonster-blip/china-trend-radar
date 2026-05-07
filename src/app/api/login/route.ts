import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accessCookieName, accessPassword, accessToken } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const submittedPassword = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/");
  const safeNextPath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";

  if (submittedPassword !== accessPassword) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(accessCookieName, accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(safeNextPath);
}
