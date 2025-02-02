import { createServerClient } from "@supabase/ssr";
import { Database } from "./database.types";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

export async function createClient(
  context?: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL ve Anon Key gerekli')
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => {
          return context?.req.cookies[name]
        },
        set: (name, value, options) => {
          context?.res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`)
        },
        remove: (name) => {
          context?.res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
        },
      },
    }
  )
} 