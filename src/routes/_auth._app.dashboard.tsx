import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/_auth/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { profile } = Route.useRouteContext()

  // Fetch Neighborhood Details
  const { data: neighborhood } = useQuery({
    queryKey: ['neighborhood', profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('name, radius_miles')
        .eq('id', profile?.neighborhood_id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!profile?.neighborhood_id,
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-tight uppercase text-sm mb-1">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {neighborhood?.name || 'Local Neighborhood'}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Hello, {profile?.display_name}!
        </h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Action: Invite */}
        <div className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-xl font-bold mb-2">Invite Neighbors</h3>
          <p className="text-slate-500 mb-6 leading-relaxed">
            New members within {neighborhood?.radius_miles || '0.5'} miles join instantly.
          </p>
          <Link 
            to="/invite"
            className="inline-flex w-full items-center justify-center bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-all"
          >
            Generate Invite Code
          </Link>
        </div>

        {/* Action: Vouch */}
        <div className="group relative overflow-hidden bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-100 transition-all hover:shadow-indigo-200">
          <h3 className="text-xl font-bold mb-2 text-white">Vouch for Neighbor</h3>
          <p className="text-indigo-100 mb-6 leading-relaxed">
            Verify a neighbor in person using their 6-digit handshake code.
          </p>
          <Link 
            to="/vouch"
            className="inline-flex w-full items-center justify-center bg-white text-indigo-600 py-4 rounded-2xl font-semibold hover:bg-indigo-50 transition-all"
          >
            Enter Handshake Code
          </Link>
        </div>
      </div>
      
      {/* FEED PLACEHOLDER */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Updates</h2>
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
           <p className="text-slate-400 font-medium">Your neighborhood feed will appear here.</p>
        </div>
      </section>
    </div>
  )
}