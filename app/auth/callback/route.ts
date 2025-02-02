import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=code_not_found`
    );
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/sign-in?error=${error.message}`
      );
    }

    // Kullanıcı bilgilerini al
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        `${requestUrl.origin}/sign-in?error=user_not_found`
      );
    }

    // Admin kontrolü
    if (user.email === "leventyarali@gmail.com") {
      return NextResponse.redirect(`${requestUrl.origin}/admin`);
    }

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    console.error("Unexpected auth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=unexpected_error`
    );
  }
}
