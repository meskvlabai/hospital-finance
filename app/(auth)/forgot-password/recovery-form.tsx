'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RecoveryForm({ invalid }: { invalid: boolean }) {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [notice, setNotice] = useState(invalid ? 'تعذّر التحقق من الرابط. اطلب رابطًا جديدًا وافتحه في المتصفح نفسه.' : '')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim()
    setBusy(true)
    setNotice('')
    try {
      const redirectTo = new URL('/auth/callback', window.location.origin).href
      const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo })
      if (error && error.status === 429) setNotice('طلبات كثيرة. انتظر قليلًا قبل المحاولة مجددًا.')
      else if (error && error.status !== 400 && error.status !== 422) setNotice('تعذّر إرسال الطلب الآن. حاول لاحقًا أو تواصل مع الدعم.')
      else setSent(true)
    } catch {
      setNotice('تعذّر الاتصال بخدمة الاستعادة. تحقق من الاتصال وحاول مجددًا.')
    } finally { setBusy(false) }
  }

  return <main className="min-h-screen flex items-center justify-center p-5"><section className="card w-full max-w-md space-y-5" aria-labelledby="recovery-title">
    <h1 id="recovery-title" className="text-xl font-bold">استعادة كلمة المرور</h1>
    {sent ? <p role="status">إذا كان البريد مرتبطًا بحساب، فستصلك رسالة استعادة. افتح أحدث رابط في المتصفح نفسه لاختيار كلمة مرور جديدة.</p> : <form onSubmit={submit} className="space-y-4">
      <p>أدخل بريد الحساب الذي تستطيع استقبال الرسائل عليه.</p>
      <label className="block" htmlFor="recovery-email">البريد الإلكتروني</label>
      <input className="form-input" id="recovery-email" type="email" name="email" dir="ltr" autoComplete="email" required />
      {notice && <p role="alert">{notice}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'جارٍ إرسال الطلب…' : 'إرسال رابط الاستعادة'}</button>
    </form>}
    <Link className="inline-block text-sm underline" href="/login">العودة لتسجيل الدخول</Link>
  </section></main>
}
