import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code')
  let destination = '/forgot-password?invalid=1'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) destination = '/change-password'
  }
  return new Response(null, { status: 303, headers: { Location: destination, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } })
}
