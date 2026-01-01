import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // 1. If no session, send to login
    if (!context.session) {
      throw redirect({ to: '/login' })
    }

    // 2. If session exists but no neighborhood, send to onboarding
    if (!context.profile?.neighborhood_id) {
      throw redirect({ to: '/onboarding' })
    }

    // 3. If everything is ready, send to dashboard
    throw redirect({ to: '/dashboard' })
  },
})