import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accessCookieName } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(accessCookieName);
  redirect("/login");
}
