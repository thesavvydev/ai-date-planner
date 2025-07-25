import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}