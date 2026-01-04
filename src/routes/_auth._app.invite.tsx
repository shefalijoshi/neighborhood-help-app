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
  
  // Accessing global context and navigation tools
  const { profile } = Route.useRouteContext()
  const queryClient = useQueryClient()
  const router = useRouter()

  const createInvite = useMutation({
    mutationFn: async () => {
      if (!profile?.neighborhood_id) throw new Error('Neighborhood context missing')

      // 1. Generate the random code string via RPC
      const { data: code, error: genError } = await supabase.rpc('generate_invite_code')
      if (genError) throw genError

      // 2. Insert into the invite_codes table
      const { error: insertError } = await supabase
        .from('invite_codes')
        .insert({
          code: code,
          neighborhood_id: profile.neighborhood_id,
          created_by: profile.id,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 Hour Expiry
        })

      if (insertError) throw insertError
      return code
    },
    onSuccess: async (code) => {
      setInviteCode(code)
      // Refresh the cache and re-run route guards
      await queryClient.invalidateQueries({ queryKey: ['invites'] })
      await router.invalidate()
    }
  })

  const handleCopy = () => {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#F9F7F2]">
      <div className="w-full max-w-sm text-center">
        
        {/* Artisan Header */}
        <header className="mb-10">
          <div className="inline-block px-3 py-1 bg-[#EBE7DE] rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[#6B6658] mb-4">
            Network Expansion
          </div>
          <h1 className="text-3xl font-serif text-[#2D2D2D]">Invite a Neighbor</h1>
          <p className="mt-4 text-sm text-[#6B6658] leading-relaxed">
            Invite codes allow new residents to join your specific neighborhood boundary.
          </p>
        </header>

        {/* The Artisan Card */}
        <div className="artisan-card p-2 bg-white border-t-4 border-[#4A5D4E]">
          <div className="bg-[#F2F0E9]/50 rounded-[1.8rem] py-10 px-6">
            
            {!inviteCode ? (
              <div className="space-y-6">
                <p className="text-xs text-[#6B6658] italic leading-relaxed px-4">
                  "Each code is valid for 24 hours and can be used to authenticate one new household."
                </p>
                <button
                  onClick={() => createInvite.mutate()}
                  disabled={createInvite.isPending}
                  className="btn-primary w-full py-4 shadow-xl shadow-[#4A5D4E]/10"
                >
                  {createInvite.isPending ? 'GENERATING...' : 'CREATE INVITE CODE'}
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#A09B8E] block mb-4">
                    Your Unique Code
                  </label>
                  <div className="bg-white border border-[#EBE7DE] rounded-xl py-6 shadow-inner">
                    <span className="text-4xl font-mono font-bold tracking-[0.3em] text-[#2D2D2D] ml-[0.3em]">
                      {inviteCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isCopied 
                        ? 'bg-[#4A5D4E] text-white shadow-lg' 
                        : 'bg-white border border-[#EBE7DE] text-[#4A5D4E] hover:bg-[#F9F7F2]'
                    }`}
                  >
                    {isCopied ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}
                  </button>
                  
                  <button
                    onClick={() => setInviteCode(null)}
                    className="text-[10px] uppercase tracking-widest font-bold text-[#A09B8E] hover:text-[#6B6658] transition-colors"
                  >
                    Create another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Feedback */}
        {createInvite.isError && (
          <div className="mt-6 p-3 rounded-xl bg-[#BC6C4D]/5 border border-[#BC6C4D]/10">
            <p className="text-[11px] font-bold text-[#BC6C4D] uppercase tracking-tighter">
              Generation Failed
            </p>
            <p className="text-[10px] text-[#6B6658] mt-1">Please check your connection and try again.</p>
          </div>
        )}

        {/* Navigation Back */}
        <button
          onClick={() => router.navigate({ to: '/dashboard' })}
          className="mt-12 text-[10px] uppercase tracking-widest font-bold text-[#A09B8E] hover:text-[#6B6658] transition-colors"
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  )
}