import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    // If no session exists, they are trespassing. 
    // Kick them to login immediately.
    if (!context.session) {
      throw redirect({
        to: '/login',
      })
    }
    
    // We can also pass the confirmed session down to all children
    return {
      authSession: context.session,
    }
  },
  // This renders the children: either create-profile or the _app layout
  component: () => <Outlet />,
})