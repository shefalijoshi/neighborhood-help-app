import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '../lib/supabase' 

export const Route = createFileRoute('/login')({
  // GUARD: If they are already logged in, don't even show this page
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'login' | 'join'; sent: boolean }>({
    type: 'login',
    sent: false,
  })

  const handleAuth = async (type: 'login' | 'join') => {
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This tells Supabase where to send them after they click the link
        emailRedirectTo: window.location.origin, 
      },
    })

    if (!error) {
      setMessage({ type, sent: true })
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  // If the email was sent, show the "Success" state
  if (message.sent) {
    return (
      <div className="auth-container">
        <h2>{message.type === 'join' ? 'Welcome to the neighborhood!' : 'Welcome back!'}</h2>
        <p>Check your email at <strong>{email}</strong> for a magic link to sign in.</p>
        <button onClick={() => setMessage({ ...message, sent: false })}>Back</button>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h1>Neighborhood App</h1>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <div className="button-group">
        <button 
          onClick={() => handleAuth('login')} 
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'Login'}
        </button>

        <button 
          onClick={() => handleAuth('join')} 
          className="secondary"
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'New? Join now'}
        </button>
      </div>
    </div>
  )
}