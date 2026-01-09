import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Dog, 
  Clock, 
  ShieldCheck, 
  Play, 
  CheckCircle2,
  Brain,
  BadgeAlert
} from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/_auth/_app/assists/$assistId')({
  component: AssistDetailComponent,
})

function AssistDetailComponent() {
  const { assistId } = Route.useParams()
  const { profile } = Route.useRouteContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: assist, isLoading } = useQuery({
    queryKey: ['assist_details', assistId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_assist_details', { 
        t_assist_id: assistId 
      })
      if (error) throw error
      return data
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase.rpc('update_assist_status', {
        t_assist_id: assistId,
        t_new_status: newStatus
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assist_details', assistId] })
      queryClient.invalidateQueries({ queryKey: ['neighborhood_feed'] })
    }
  })

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-beige"><div className="h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>
  if (!assist) return <div className="p-8 text-center font-serif italic text-brand-text">Assist not found.</div>

  const isHelper = assist.helper_id === profile?.id
  const status = assist.status

  return (
    <div className="artisan-page-focus pt-8">
      <div className="artisan-container-large px-4">
        {/* Navigation */}
        <button 
          onClick={() => navigate({ to: '/dashboard' })}
          className="nav-link-back"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Hero Header */}
        <header className="artisan-header">
          <div className="relative inline-block mb-4">
            <div className="h-24 w-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-white mx-auto">
              {assist.dog_photo ? (
                <img src={assist.dog_photo} alt={assist.dog_name} className="h-full w-full object-cover" />
              ) : (
                <Dog className="w-10 h-10 text-brand-stone" />
              )}
            </div>
            <h1 className="artisan-header-title">{assist.dog_name || 'Dog Walk'}</h1>
            <p className="artisan-meta-tiny">
              {assist.dog_size}
            </p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-terracotta text-white rounded-full">
              <span className="capitalize">
                {assist.status.replace('_', ' ')}{isHelper ? ` with ${assist.seeker_name}` : ` with ${assist.helper_name}`}
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {/* Verification Card */}
          <div className="artisan-card p-6 bg-white border-t-4 border-brand-terracotta text-center">
            <div className="flex justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-brand-terracotta" />
            </div>
            <p className="text-label mb-2">Verification Code</p>
            <div className="text-4xl font-serif tracking-[0.3em] text-brand-dark ml-[0.3em]">
              {assist.verification_code}
            </div>
            <p className="artisan-meta-tiny">Exchange this code when meeting to verify identity</p>
          </div>

          {/* Action Area */}
          {isHelper && status !== 'completed' && (
            <div className="mt-8">
              {status === 'confirmed' ? (
                <button 
                  onClick={() => updateStatusMutation.mutate('in_progress')}
                  disabled={updateStatusMutation.isPending}
                  className="btn-primary"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {updateStatusMutation.isPending ? 'STARTING...' : 'START WALK'}
                </button>
              ) : (
                <button 
                  onClick={() => updateStatusMutation.mutate('completed')}
                  disabled={updateStatusMutation.isPending}
                  className="btn-secondary"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {updateStatusMutation.isPending ? 'COMPLETING...' : 'COMPLETE WALK'}
                </button>
              )}
            </div>
          )}

          <div className="artisan-card mb2">
            <div className="artisan-card-inner">
              <div className="detail-row">
                <div className="icon-box">
                  <Clock className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="text-label block mb-3">Timeframe</p>
                  <p className="text-brand-dark font-medium">
                    {assist.timeframe ? format(new Date(assist.timeframe), 'p') : 'As Soon As Possible'}
                  </p>
                </div>
              </div>
              {/* 2. Duration Section */}
              <div className="detail-row">
                <div className="icon-box">
                  <Dog className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="text-label block mb-3">Planned Duration</p>
                  <p className="text-brand-dark font-medium">{assist.duration} Minutes</p>
                </div>
              </div>
              {/* 3. Location Section */}
              <div className="detail-row">
                <div className="icon-box">
                  <MapPin className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="text-label block mb-3">Pickup Address (Verified)</p>
                  <p className="text-brand-dark font-medium">
                  {isHelper ? assist.seeker_full_address : assist.seeker_street_name}
                  </p>
                  <p className="artisan-meta-tiny mt-2">Full address shared once accepted</p>
                </div>
              </div>
              {/* Contact information */}
              {isHelper && (
                  <div className="detail-row">
                  <div className="icon-box">
                    <Mail className="w-4 h-4 text-brand-green/60" />
                  </div>
                  <div>
                    <p className="text-label block mb-3">Email</p>
                    <p className="text-brand-dark font-medium">{assist.seeker_email}</p>
                  </div>
                </div>
              )}
              {!isHelper && assist.helper_phone && (
                <div className="detail-row">
                  <div className="icon-box">
                    <Phone className="w-4 h-4 text-brand-green/60" />
                  </div>
                  <div>
                    <p className="text-label block mb-3">Phone</p>
                    <p className="text-brand-dark font-medium">{assist.helper_phone}</p>
                  </div>
                </div>)}
              {!isHelper && assist.helper_email && (
                <div className="detail-row">
                  <div className="icon-box">
                    <Mail className="w-4 h-4 text-brand-green/60" />
                  </div>
                  <div>
                    <p className="text-label block mb-3">Email</p>
                    <p className="text-brand-dark font-medium">{assist.helper_email}</p>
                  </div>
                </div>)}  
            </div>
          </div>

          {/* Special Needs Card */}
          {(assist.temperament?.length > 0) &&
          (<div className="artisan-card mb-2">
            <div className="artisan-card-inner">
              <div className="detail-row">
                <div className="icon-box">
                  <BadgeAlert className="w-4 h-4 text-brand-terracotta" />
                </div>
                <div>
                  <p className="text-label block mb-3">Care Instructions</p>
                  <p className="text-brand-dark font-medium">
                    "{assist.special_needs}"
                  </p>
                </div>
              </div>
            </div>
          </div>)}

          {/* Personality Card */}
          {(assist.temperament?.length > 0) && (
            <div className="artisan-card">
            <div className="artisan-card-inner">
              <div className="detail-row">
                <div className="icon-box">
                  <Brain className="w-4 h-4 text-brand-green" />
                </div>
                <div>
                  <p className="text-label block mb-3">Temperament</p>
                  <div className="text-brand-dark font-medium">
                    {assist.temperament.map((trait: string) => (
                      <span key={trait} className="badge-pill">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}