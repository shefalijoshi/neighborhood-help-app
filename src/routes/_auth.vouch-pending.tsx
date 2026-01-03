import { useEffect } from 'react'
import { createFileRoute, useNavigate, useRouter, redirect } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/_auth/vouch-pending')({
  beforeLoad: ({ context }) => {
    // If you are active, you shouldn't be in the waiting room.
    if (context.membershipStatus === 'active') {
      throw redirect({ to: '/' }) // Go to Traffic Cop (will send to Dashboard)
    }
  },
  component: VouchPendingPage,
})

function VouchPendingPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const router = useRouter() // Access the router to trigger global refreshes
  const { profile } = Route.useRouteContext()

  // 1. Fetch current membership status
  const { data: membership, isLoading } = useQuery({
    queryKey: ['my-membership'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('neighborhood_memberships')
        .select('id, vouch_verification_code, vouch_code_expires_at, status')
        .eq('profile_id', profile?.id)
        .eq('status', 'pending_second_vouch')
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  // 2. REALTIME LISTENER: Listen for the moment a neighbor vouches for you
  useEffect(() => {
    if (!membership?.id) return

    const channel = supabase
    .channel(`vouch-status-${profile?.id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'neighborhood_memberships',
        filter: `profile_id=eq.${profile?.id}`, // Correct column name
      },
      async (payload) => {
        if (payload.new.status === 'active') {
          await queryClient.invalidateQueries()
          await router.invalidate()
          navigate({ to: '/dashboard' })
        }
      }
    )
    .subscribe()

  return () => {
      supabase.removeChannel(channel)
    }
  }, [profile?.id, membership?.id, navigate, queryClient, router])

  // 3. Mutation for code generation (The "Handshake")
  const requestVouch = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('request_vouch_handshake')
      if (error) throw error
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-membership'] })
      await router.invalidate()
    },
  })

  if (isLoading) return <div className="p-8 text-center animate-pulse">Checking status...</div>

  const activeCode = membership?.vouch_verification_code
  const isExpired = membership?.vouch_code_expires_at 
    ? new Date(membership.vouch_code_expires_at) < new Date() 
    : true

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        
        {/* Header Icon & Title */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Neighbor Verification</h1>
          <p className="text-slate-500 mt-2">
            Since you are joining from a distance, we need a local neighbor to vouch for you in person.
          </p>
        </div>

        {/* Handshake Code Area */}
        {activeCode && !isExpired ? (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your Handshake Code</p>
            <div className="text-5xl font-mono font-bold tracking-[0.2em] text-indigo-600 bg-indigo-50/50 border-2 border-dashed border-indigo-200 py-6 rounded-xl">
              {activeCode}
            </div>
            <p className="text-xs text-slate-400">
              Code expires at {new Date(membership.vouch_code_expires_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <button 
              onClick={() => requestVouch.mutate()}
              disabled={requestVouch.isPending}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700 hover:underline pt-4"
            >
              {requestVouch.isPending ? 'Generating...' : 'Refresh Code'}
            </button>
          </div>
        ) : (
          <div className="py-4">
            <button
              onClick={() => requestVouch.mutate()}
              disabled={requestVouch.isPending}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98]"
            >
              {requestVouch.isPending ? 'Generating Code...' : 'Get Handshake Code'}
            </button>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Show this code to any active neighbor. Once they enter it on their device, you'll be granted full access.
            </p>
          </div>
        )}

        {requestVouch.isError && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
            {requestVouch.error.message}
          </div>
        )}
      </div>
    </div>
  )
}