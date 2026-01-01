import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { supabase } from '../lib/supabase' // your supabase client
import type { Session } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'
import type { QueryClient } from '@tanstack/react-query'

type Profile = Database['public']['Tables']['profiles']['Row']

// 1. Define what the context looks like for all child routes
interface MyRouterContext {
  queryClient: QueryClient
  session: Session | null
  profile: Profile | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // 2. The Loader fetches the "Source of Truth" before any route renders
  beforeLoad: async ({ context }) => {
    const { data: { session } } = await supabase.auth.getSession()

    let profile = null
    if (session) {
      profile = await context.queryClient.ensureQueryData({
        queryKey: ['profile', session.user.id],
        queryFn: async () => {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .single()
          return data
        },
      })
    }

    return {
      session,
      profile,
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Empty Shell Navbar */}
      <nav className="h-16 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Content will go here later */}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}