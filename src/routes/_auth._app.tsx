import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_app')({
  beforeLoad: ({ context }) => {
    // If they aren't active, they cannot stay in the _app branch
    if (context.membershipStatus !== 'active') {
      throw redirect({ to: '/' }) // Send back to Traffic Cop
    }
  },
  component: () => (
    <div className="app-layout">
      {/* You can put your main Nav Bar here! */}
      <nav>My Neighborhood App</nav> 
      
      <main>
        <Outlet /> {/* This renders Dashboard, Settings, etc. */}
      </main>
    </div>
  )
})