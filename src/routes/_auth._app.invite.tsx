import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/_auth/_app/invite')({
  component: InvitePage,
})

function InvitePage() {
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  
  // Use the context we set up in the root layout
  const { profile } = Route.useRouteContext()
  const queryClient = useQueryClient()
  const router = useRouter()

  const createInvite = useMutation({
    mutationFn: async () => {
      if (!profile?.neighborhood_id) throw new Error('Neighborhood context missing')

      // 1. Generate the random code string via your RPC
      const { data: code, error: genError } = await supabase.rpc('generate_invite_code')
      if (genError) throw genError

      // 2. Insert into the invite_codes table
      const { error: insertError } = await supabase
        .from('invite_codes')
        .insert({
          code: code,
          neighborhood_id: profile.neighborhood_id, // Get this from context!
          created_by: profile.id,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
        })

      if (insertError) throw insertError
      return code
    },
    onSuccess: async (code) => {
      setInviteCode(code)
      await queryClient.invalidateQueries({ queryKey: ['invites', profile?.neighborhood_id] })
      await router.invalidate()
    },
  })

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Invite a Neighbor</h1>
          <p className="mt-2 text-sm text-slate-500">
            Invite codes are valid for 24 hours. Your neighbor can join instantly if they are within 0.5 miles.
          </p>
        </header>

        {!inviteCode ? (
          <button
            onClick={() => createInvite.mutate()}
            disabled={createInvite.isPending}
            className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {createInvite.isPending ? 'Generating...' : 'Create Invite Code'}
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
              <span className="text-4xl font-mono font-bold tracking-[0.4em] text-indigo-700">
                {inviteCode}
              </span>
            </div>
            
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all ${
                isCopied 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isCopied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                'Copy Invite Code'
              )}
            </button>

            <button
              onClick={() => {
                setInviteCode(null)
                setIsCopied(false)
              }}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Reset and create new
            </button>
          </div>
        )}

        {createInvite.isError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {createInvite.error.message}
          </div>
        )}
      </div>
    </div>
  )
}