import { useEffect, useState } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

type Step = 'phone' | 'sending' | 'otp' | 'verifying' | 'pin' | 'error'

export function Login({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [pin, setPin] = useState('')
  const [resendIn, setResendIn] = useState(30)

  useEffect(() => {
    if (step !== 'otp' || resendIn === 0) return
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [step, resendIn])

  function submitPhone() {
    if (phone.replace(/\D/g, '').length < 10) return
    setStep('sending')
    setResendIn(30)
    setTimeout(() => setStep('otp'), 900)
  }

  function submitOtp() {
    if (otp.length !== 6) return
    setStep('verifying')
    setTimeout(() => {
      // Demo: any 6-digit OTP works except one reserved failure case.
      if (otp === '000000') {
        setStep('error')
      } else {
        setStep('pin')
      }
    }, 900)
  }

  function submitPin() {
    if (pin.length !== 4) return
    onComplete()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-navy-700 text-base font-semibold text-white">
            GC
          </div>
          <div>
            <p className="text-base font-semibold text-navy-800">{t('appName')}</p>
            <p className="text-xs text-ink/50">{t('tagline')}</p>
          </div>
        </div>

        <div className="rounded-sm border border-line bg-white p-6 shadow-card">
          {(step === 'phone' || step === 'sending') && (
            <>
              <h1 className="mb-1 text-lg font-semibold text-ink">Log in to your account</h1>
              <p className="mb-5 text-sm text-ink/60">
                Enter your mobile number or Aadhaar-linked ID. We'll send a one-time code to verify it's you.
              </p>
              <label className="mb-1 block text-xs font-medium text-ink/70">Mobile number or ID</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXX10"
                inputMode="numeric"
                className="w-full rounded-sm border border-line px-3 py-2.5 text-sm outline-none focus:border-navy-700"
              />
              <button
                onClick={submitPhone}
                disabled={step === 'sending'}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
              >
                {step === 'sending' && <Loader2 size={15} className="animate-spin" />}
                {step === 'sending' ? 'Sending code…' : 'Send OTP'}
              </button>
            </>
          )}

          {(step === 'otp' || step === 'verifying') && (
            <>
              <h1 className="mb-1 text-lg font-semibold text-ink">Enter the code</h1>
              <p className="mb-5 text-sm text-ink/60">
                We sent a 6-digit code to <span className="font-medium text-ink">{phone || '98XXXXXX10'}</span>.
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                inputMode="numeric"
                className="w-full rounded-sm border border-line px-3 py-2.5 text-center text-lg tracking-[0.5em] outline-none focus:border-navy-700"
              />
              <button
                onClick={submitOtp}
                disabled={step === 'verifying'}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
              >
                {step === 'verifying' && <Loader2 size={15} className="animate-spin" />}
                {step === 'verifying' ? 'Verifying…' : 'Verify & continue'}
              </button>
              <button
                onClick={() => resendIn === 0 && submitPhone()}
                disabled={resendIn > 0}
                className="mt-3 w-full text-center text-xs text-navy-700 disabled:text-ink/35"
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
              </button>
            </>
          )}

          {step === 'error' && (
            <>
              <h1 className="mb-1 text-lg font-semibold text-ink">That code didn't match</h1>
              <p className="mb-5 text-sm text-ink/60">Check the 6-digit code and try again.</p>
              <button
                onClick={() => setStep('otp')}
                className="w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
              >
                Try again
              </button>
            </>
          )}

          {step === 'pin' && (
            <>
              <div className="mb-4 flex items-center gap-2 text-verified-600">
                <ShieldCheck size={18} />
                <p className="text-sm font-medium">Number verified</p>
              </div>
              <h1 className="mb-1 text-lg font-semibold text-ink">Set a 4-digit PIN</h1>
              <p className="mb-5 text-sm text-ink/60">
                Use this PIN to log in quickly next time, without waiting for an OTP.
              </p>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                inputMode="numeric"
                className="w-full rounded-sm border border-line px-3 py-2.5 text-center text-lg tracking-[0.6em] outline-none focus:border-navy-700"
              />
              <button
                onClick={submitPin}
                disabled={pin.length !== 4}
                className="mt-4 w-full rounded-sm bg-navy-700 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
              >
                Continue to GovConnect
              </button>
            </>
          )}
        </div>
        <p className="mt-4 text-center text-[11px] text-ink/40">
          Your OTP is never stored. Only a session token stays on this device.
        </p>
      </div>
    </div>
  )
}
