import { useState, useEffect } from 'react'
import { Mail, Heart, Calendar, Save, Users, ToggleLeft, ToggleRight, Download, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function ExtrasTab() {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()

  const [emailEnabled, setEmailEnabled] = useState(profile?.email_capture_enabled ?? false)
  const [emailTitle, setEmailTitle]     = useState(profile?.email_capture_title ?? '')
  const [tipUrl, setTipUrl]             = useState(profile?.tip_url ?? '')
  const [bookingUrl, setBookingUrl]     = useState(profile?.booking_url ?? '')
  const [seoTitle, setSeoTitle]         = useState(profile?.seo_title ?? '')
  const [seoDesc, setSeoDesc]           = useState(profile?.seo_description ?? '')
  const [seoImage, setSeoImage]         = useState(profile?.seo_image ?? '')
  const [subscribers, setSubscribers]   = useState<{ email: string; subscribed_at: string }[]>([])
  const [loadingSubs, setLoadingSubs]   = useState(false)
  const [saving, setSaving]             = useState(false)

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    setLoadingSubs(true)
    const { data } = await supabase
      .from('email_subscribers')
      .select('email, subscribed_at')
      .eq('user_id', user!.id)
      .order('subscribed_at', { ascending: false })
    setSubscribers(data ?? [])
    setLoadingSubs(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update({
      email_capture_enabled: emailEnabled,
      email_capture_title:   emailTitle || null,
      tip_url:               tipUrl     || null,
      booking_url:           bookingUrl || null,
      seo_title:             seoTitle   || null,
      seo_description:       seoDesc    || null,
      seo_image:             seoImage   || null,
    }).eq('id', user!.id)
    await refreshProfile()
    setSaving(false)
    toast('Đã lưu cài đặt!')
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Page Extras</h2>
        <p className="text-sm text-gray-500 mt-0.5">Add extra blocks to your public page.</p>
      </div>

      {/* Email Capture */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Email Capture</h3>
          </div>
          <button onClick={() => setEmailEnabled(v => !v)} className="flex-shrink-0">
            {emailEnabled
              ? <ToggleRight size={28} style={{ color: '#333A2F' }} />
              : <ToggleLeft  size={28} className="text-gray-300" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 -mt-2">Collect emails from visitors on your page.</p>
        {emailEnabled && (
          <>
            <input
              type="text" value={emailTitle} onChange={e => setEmailTitle(e.target.value)}
              placeholder="Heading (e.g. Stay in the loop)" maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-600">
                  {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  {subscribers.length > 0 && (
                    <button onClick={() => {
                      const csv = 'Email,Subscribed At\n' + subscribers.map(s => `${s.email},${s.subscribed_at}`).join('\n')
                      const a = document.createElement('a')
                      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
                      a.download = 'subscribers.csv'
                      a.click()
                    }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                      <Download size={12} /> CSV
                    </button>
                  )}
                  <button onClick={fetchSubscribers} className="text-xs text-gray-400 hover:text-gray-600">Refresh</button>
                </div>
              </div>
              {loadingSubs ? (
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
              ) : subscribers.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {subscribers.map(s => (
                    <div key={s.email} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-700 truncate">{s.email}</span>
                      <span className="text-gray-400 ml-2 flex-shrink-0">{new Date(s.subscribed_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No subscribers yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tip Jar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Tip Jar</h3>
        </div>
        <p className="text-xs text-gray-400">Paste your MoMo, PayPal, Ko-fi, or any donation link.</p>
        <input
          type="url" value={tipUrl} onChange={e => setTipUrl(e.target.value)}
          placeholder="https://ko-fi.com/yourname"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
      </div>

      {/* Booking */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Booking Link</h3>
        </div>
        <p className="text-xs text-gray-400">Paste your Calendly, Google Calendar, or booking page link.</p>
        <input
          type="url" value={bookingUrl} onChange={e => setBookingUrl(e.target.value)}
          placeholder="https://calendly.com/yourname"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
      </div>

      {/* SEO Meta */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">SEO & Social Preview</h3>
        </div>
        <p className="text-xs text-gray-400">Tùy chỉnh tiêu đề và mô tả hiển thị khi chia sẻ link của bạn.</p>
        <div className="space-y-2.5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Title</label>
            <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
              placeholder={profile?.display_name || 'Your name'}
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            <p className="text-[10px] text-gray-400 text-right mt-0.5">{seoTitle.length}/60</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
            <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)}
              placeholder={profile?.bio || 'Check out my links'}
              rows={2} maxLength={160}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] resize-none" />
            <p className="text-[10px] text-gray-400 text-right mt-0.5">{seoDesc.length}/160</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Thumbnail Image URL (og:image)</label>
            <input type="url" value={seoImage} onChange={e => setSeoImage(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
          </div>
        </div>
        {/* Preview card */}
        {(seoTitle || seoDesc || seoImage) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preview</p>
            {seoImage && <img src={seoImage} alt="" className="w-full h-28 object-cover rounded-lg mb-2" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
            <p className="text-xs font-bold text-blue-700 truncate">{seoTitle || profile?.display_name || profile?.username}</p>
            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{seoDesc || profile?.bio}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">donlybio.vercel.app/u/{profile?.username}</p>
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
        style={{ background: '#333A2F' }}>
        <Save size={16} />
        {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
      </button>
    </div>
  )
}
