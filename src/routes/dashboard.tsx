import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/dashboard')({
  // Guard logic lives here now
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
    if (!context.profile?.neighborhood_id) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { profile } = Route.useRouteContext()

  const { data: neighborhood, isLoading } = useQuery({
    queryKey: ['neighborhood', profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('id', profile.neighborhood_id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!profile?.neighborhood_id,
  })

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading...</div>

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">{neighborhood?.name}</h1>
        <p className="text-slate-500 font-medium">Seed User Dashboard</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-indigo-50 p-6 border border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-tight">Boundary</h3>
          <p className="text-3xl font-bold text-indigo-700">0.5 Miles</p>
        </div>
        
        <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Members</h3>
          <p className="text-3xl font-bold text-slate-900">1</p>
        </div>
      </div>
    </div>
  )
}