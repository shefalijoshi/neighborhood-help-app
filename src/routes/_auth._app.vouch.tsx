import { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/_auth/_app/vouch')({
  component: VouchEntryPage,
})

function VouchEntryPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [code, setCode] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const vouchMutation = useMutation({
    mutationFn: async (enteredCode: string) => {
      // Calls the RPC we defined to activate the neighbor
      const { error } = await supabase.rpc('vouch_via_handshake', {
        entered_code: enteredCode,
      })
      if (error) throw error
    },
    onSuccess: async () => {
      setIsSuccess(true)
      
      // Refresh local state and global context
      await queryClient.invalidateQueries()
      await router.invalidate()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure we only submit if the code is complete
    if (code.length === 6 && !vouchMutation.isPending) {
      vouchMutation.mutate(code)
    }
  }

  // Helper to handle input and keep it clean
  const handleInputChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (cleaned.length <= 6) {
      setCode(cleaned)
    }
  }

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md animate-in zoom-in duration-300 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Neighbor Verified!</h1>
          <p className="mt-2 text-slate-500">
            You've officially welcomed a new neighbor to the community.
          </p>
        </div>
      </div>
    )
  }

  // INPUT VIEW
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Handshake</h1>
          <p className="mt-2 text-slate-500">
            Enter the 6-digit code from your neighbor's device to verify their residency.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="••••••"
              className="block w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-5 text-center text-5xl font-mono font-bold tracking-[0.2em] text-indigo-600 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={code.length < 6 || vouchMutation.isPending}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale"
          >
            {vouchMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Vouch for Neighbor'
            )}
          </button>
        </form>

        {vouchMutation.isError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-shake">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">{vouchMutation.error.message}</p>
          </div>
        )}

        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="mt-6 w-full text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          Nevermind, go back
        </button>
      </div>
    </div>
  )
}