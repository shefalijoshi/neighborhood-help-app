import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface ApiError {
  message: string;
  code: number;
}

export const Route = createFileRoute('/onboarding')({
  // Guard: Kick them out if they are logged out or already have a neighborhood
  beforeLoad: ({ context }) => {
    if (!context.session) throw redirect({ to: '/login' })
    if (context.profile?.neighborhood_id) throw redirect({ to: '/dashboard' })
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: handleInitialize, isPending } = useMutation({
    mutationFn: async () => {
      setError(null)
      
      // 1. Get Coordinates
      const pos = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      )

      // 2. Call the RPC
      const { data, error: rpcError } = await supabase.rpc('initialize_neighborhood', {
        neighborhood_name: name,
        user_lat: pos.coords.latitude,
        user_lng: pos.coords.longitude,
      })

      if (rpcError) throw rpcError
      return data
    },
    onSuccess: async () => {
      // 3. Security: Pull the new 'is_seed_user' flag into the JWT
      await supabase.auth.refreshSession()
      
      // 4. State: Tell TanStack Query the profile is now different
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await router.invalidate()
      
      // 5. Navigate
      router.navigate({ to: '/dashboard' })
    },
    onError: (err: ApiError) => {
      if (err.code === 1) { // Geolocation position denied
        setError("Location access is required to start a neighborhood.")
      } else {
        setError(err.message || "An unexpected error occurred.")
      }
    },
  })

  return (
    <div className="mx-auto max-w-md pt-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create a Neighborhood</h1>
          <p className="mt-2 text-sm text-slate-600">
            You are about to become the first member and seed user for your local area.
          </p>
        </header>

        <div className="space-y-6">
          <div>
            <label htmlFor="nb-name" className="block text-sm font-medium text-slate-700">
              Neighborhood Name
            </label>
            <input
              id="nb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oak Ridge Estates"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={() => handleInitialize()}
            disabled={isPending || !name.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending ? 'Establishing Boundary...' : 'Create Neighborhood'}
          </button>
          
          <p className="text-center text-xs text-slate-400">
            By creating a neighborhood, you'll be set as the anchor point for a 0.5-mile radius.
          </p>
        </div>
      </div>
    </div>
  )
}