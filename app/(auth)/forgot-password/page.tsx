import RecoveryForm from './recovery-form'

export default async function ForgotPassword({ searchParams }: { searchParams: Promise<{ invalid?: string }> }) {
  return <RecoveryForm invalid={(await searchParams).invalid === '1'} />
}
