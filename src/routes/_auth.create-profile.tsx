import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, useRouter, redirect } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { getCoordsFromAddress, type Coords } from '../lib/geocoding'

export const Route = createFileRoute('/_auth/create-profile')({
  beforeLoad: ({ context }) => {
    // If name and hood are set, this page is no longer for you.
    if (context.profile?.display_name && context.profile?.neighborhood_id) {
      throw redirect({ to: '/' }) // Go to Traffic Cop to find next step
    }
  },
  component: CreateProfileComponent,
})

function CreateProfileComponent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  // --- Form State ---
  const [name, setName] = useState('')
  const [neighborhoodName, setNeighborhoodName] = useState('')
  const [address, setAddress] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [coords, setCoords] = useState<Coords | null>(null)
  
  // --- UI State ---
  const [step, setStep] = useState<'name' | 'choice' | 'executing'>('name')
  const [method, setMethod] = useState<'join' | 'create' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidatingLocation, setIsValidatingLocation] = useState(false)

  // --- 1. Clean Debounced Effect ---
  useEffect(() => {
    if (address.length < 5) {
      setCoords(null)
      return
    }

    setIsValidatingLocation(true)
    const delayDebounceFn = setTimeout(async () => {
      const result = await getCoordsFromAddress(address)
      setCoords(result)
      setIsValidatingLocation(false)
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [address])

  // --- 2. Join Path ---
  const handleJoin = async () => {
    if (!inviteCode || !coords) return
    setStep('executing')
    setError(null)

    try {
      const { data: status, error: rpcError } = await supabase.rpc('join_neighborhood', {
        invite_code_text: inviteCode.trim().toUpperCase(),
        user_lat: coords.lat,
        user_lng: coords.lng
      })

      if (rpcError) throw rpcError

      await queryClient.invalidateQueries()
      await router.invalidate()

      navigate({ to: status === 'active' ? '/dashboard' : '/vouch-pending' })
    } catch (err: any) {
      setError(err.message || 'Failed to join neighborhood')
      setStep('choice')
    }
  }

  // --- 3. Create Path ---
  const handleCreate = async () => {
    if (!name || !neighborhoodName || !coords || !address) return
    setStep('executing')
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: name, address: address })
        .eq('user_id', user?.id)

      if (profileError) throw profileError

      const { error: rpcError } = await supabase.rpc('initialize_neighborhood', {
        neighborhood_name: neighborhoodName.trim(),
        user_lat: coords.lat,
        user_lng: coords.lng
      })

      if (rpcError) {
        if (rpcError.message.includes('COLLISION')) {
          setError(rpcError.message.replace('COLLISION:', ''))
          setMethod('join') 
        } else {
          throw rpcError
        }
        setStep('choice')
        return
      }

      await queryClient.invalidateQueries()
      await router.invalidate()
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Failed to create neighborhood')
      setStep('choice')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete your profile</h1>
      <p className="text-slate-500 text-sm mb-6">Connect with neighbors in your area.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {step === 'name' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Your Name</label>
          <input
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button 
            onClick={() => setStep('choice')}
            disabled={name.length < 2}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2: Choice, Address & Specific Inputs */}
      {step === 'choice' && (
        <div className="space-y-6">
          {/* Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => {
                console.log("Switching to JOIN");
                setMethod('join');
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${method === 'join' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Join with Code
            </button>
            <button 
              type="button"
              onClick={() => {
                console.log("Switching to CREATE");
                setMethod('create');
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${method === 'create' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Start New Group
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Common Field: Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Home Address</label>
              <div className="relative">
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123 Neighborhood St, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="absolute right-4 top-4">
                  {isValidatingLocation && <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />}
                  {!isValidatingLocation && coords && <span className="text-green-500">✓</span>}
                </div>
              </div>
            </div>
            
            {/* 2. Conditional Field: JOIN (Invite Code) */}
            {method === 'join' && (
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Invite Code</label>
                <input
                  className="w-full p-4 border-2 border-indigo-100 rounded-xl outline-none focus:border-indigo-500 uppercase font-mono text-center text-lg"
                  placeholder="CODE123"
                  maxLength={8}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {/* 3. Conditional Field: CREATE (Neighborhood Name) */}
            {method === 'create' && (
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Neighborhood Name</label>
                <input
                  className="w-full p-4 border-2 border-indigo-100 rounded-xl outline-none focus:border-indigo-500"
                  placeholder="e.g. Oak Street Collective"
                  value={neighborhoodName}
                  onChange={(e) => setNeighborhoodName(e.target.value)}
                />
              </div>
            )}

            {/* 4. The Action Button */}
            <button 
              onClick={() => {
                console.log("Submit clicked. Method:", method, "Coords:", coords, "Name:", neighborhoodName);
                method === 'join' ? handleJoin() : handleCreate();
              }}
              disabled={
                !coords || 
                (method === 'join' && !inviteCode) || 
                (method === 'create' && !neighborhoodName) ||
                isValidatingLocation
              }
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-30 shadow-lg mt-4"
            >
              {method === 'join' ? 'Verify & Join' : 'Create Neighborhood'}
            </button>
          </div>
        </div>
      )}

      {step === 'executing' && (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Processing...</p>
        </div>
      )}
    </div>
  )
}