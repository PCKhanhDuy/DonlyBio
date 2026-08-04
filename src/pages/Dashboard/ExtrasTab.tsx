import { useState, useEffect } from 'react'
import { Mail, Heart, Calendar, Save, Users, ToggleLeft, ToggleRight, Download, Search,
  Music, MessageSquare, Star, Plus, Trash2, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { DEFAULT_SETTINGS } from '../../types'
import type { CustomSettings } from '../../types'

type Testimonial = {
  id: string
  author_name: string
  author_role: string | null
  content: string
  rating: number
  sort_order: number
  is_active: boolean
  created_at: string
}

type ContactMsg = {
  id: string
  sender_name: string
  sender_email: string | null
  message: string
  is_read: boolean
  created_at: string
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex-shrink-0">
      {on
        ? <ToggleRight size={28} style={{ color: '#333A2F' }} />
        : <ToggleLeft  size={28} className="text-gray-300" />}
    </button>
  )
}

function StarRating({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={16} fill={n <= value ? '#f59e0b' : 'none'} style={{ color: n <= value ? '#f59e0b' : '#d1d5db' }} />
        </button>
      ))}
    </div>
  )
}

export default function ExtrasTab() {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()

  // Profile fields
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

  // Custom settings
  const initSettings: CustomSettings = { ...DEFAULT_SETTINGS, ...(profile?.custom_settings ?? {}) }
  const [musicUrl, setMusicUrl]             = useState(initSettings.musicWidgetUrl ?? '')
  const [contactEnabled, setContactEnabled] = useState(initSettings.contactFormEnabled ?? false)
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(initSettings.testimonialsEnabled ?? false)

  // Contact messages inbox
  const [messages, setMessages]     = useState<ContactMsg[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Testimonials management
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadingTest, setLoadingTest]   = useState(false)
  const [showAddTest, setShowAddTest]   = useState(false)
  const [newTest, setNewTest] = useState({ author_name: '', author_role: '', content: '', rating: 5 })
  const [addingTest, setAddingTest]     = useState(false)

  useEffect(() => { fetchSubscribers() }, [])
  useEffect(() => { if (contactEnabled) fetchMessages() }, [contactEnabled])
  useEffect(() => { if (testimonialsEnabled) fetchTestimonials() }, [testimonialsEnabled])

  const fetchSubscribers = async () => {
    setLoadingSubs(true)
    const { data } = await supabase
      .from('email_subscribers').select('email, subscribed_at')
      .eq('user_id', user!.id).order('subscribed_at', { ascending: false })
    setSubscribers(data ?? [])
    setLoadingSubs(false)
  }

  const fetchMessages = async () => {
    setLoadingMsgs(true)
    const { data } = await supabase
      .from('contact_messages').select('*')
      .eq('user_id', user!.id).order('created_at', { ascending: false })
    setMessages(data ?? [])
    setUnreadCount((data ?? []).filter(m => !m.is_read).length)
    setLoadingMsgs(false)
  }

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const fetchTestimonials = async () => {
    setLoadingTest(true)
    const { data } = await supabase
      .from('testimonials').select('*')
      .eq('user_id', user!.id).order('sort_order')
    setTestimonials(data ?? [])
    setLoadingTest(false)
  }

  const addTestimonial = async () => {
    if (!newTest.author_name.trim() || !newTest.content.trim()) return
    setAddingTest(true)
    const { data } = await supabase.from('testimonials').insert({
      user_id: user!.id,
      author_name: newTest.author_name.trim(),
      author_role: newTest.author_role.trim() || null,
      content: newTest.content.trim(),
      rating: newTest.rating,
      sort_order: testimonials.length,
    }).select().single()
    if (data) setTestimonials(prev => [...prev, data])
    setNewTest({ author_name: '', author_role: '', content: '', rating: 5 })
    setShowAddTest(false)
    setAddingTest(false)
    toast('Đã thêm testimonial!')
  }

  const toggleTestActive = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id)
    setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, is_active: !t.is_active } : x))
  }

  const deleteTestimonial = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id)
    setTestimonials(prev => prev.filter(t => t.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    const currentSettings: CustomSettings = { ...DEFAULT_SETTINGS, ...(profile?.custom_settings ?? {}) }
    const updatedSettings: CustomSettings = {
      ...currentSettings,
      musicWidgetUrl: musicUrl || undefined,
      contactFormEnabled: contactEnabled,
      testimonialsEnabled: testimonialsEnabled,
    }
    await supabase.from('profiles').update({
      email_capture_enabled: emailEnabled,
      email_capture_title:   emailTitle || null,
      tip_url:               tipUrl     || null,
      booking_url:           bookingUrl || null,
      seo_title:             seoTitle   || null,
      seo_description:       seoDesc    || null,
      seo_image:             seoImage   || null,
      custom_settings:       updatedSettings,
    }).eq('id', user!.id)
    await refreshProfile()
    setSaving(false)
    toast('Đã lưu cài đặt!')
  }

  const INPUT = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]'

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Page Extras</h2>
        <p className="text-sm text-gray-500 mt-0.5">Add extra blocks to your public page.</p>
      </div>

      {/* Music Player Widget */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Music Player</h3>
        </div>
        <p className="text-xs text-gray-400">Dán link Spotify hoặc YouTube để hiển thị player trên trang của bạn.</p>
        <input
          type="url" value={musicUrl} onChange={e => setMusicUrl(e.target.value)}
          placeholder="https://open.spotify.com/track/… hoặc youtu.be/…"
          className={INPUT} />
        {musicUrl && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Player sẽ hiển thị trên trang public của bạn.
          </p>
        )}
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 text-sm">
              Contact Form
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#ef4444' }}>
                  {unreadCount}
                </span>
              )}
            </h3>
          </div>
          <Toggle on={contactEnabled} onChange={() => {
            setContactEnabled(v => !v)
            if (!contactEnabled) fetchMessages()
          }} />
        </div>
        <p className="text-xs text-gray-400 -mt-2">Cho phép khách ghé thăm gửi tin nhắn cho bạn.</p>

        {contactEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                {messages.length} tin nhắn {unreadCount > 0 && `(${unreadCount} chưa đọc)`}
              </span>
              <button onClick={fetchMessages} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Refresh
              </button>
            </div>
            {loadingMsgs ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">Chưa có tin nhắn nào.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {messages.map(msg => (
                  <div key={msg.id}
                    className={`rounded-xl border p-3 transition-colors ${msg.is_read ? 'border-gray-100 bg-gray-50' : 'border-blue-100 bg-blue-50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                          <p className="text-xs font-semibold text-gray-800 truncate">{msg.sender_name}</p>
                          {msg.sender_email && (
                            <p className="text-[10px] text-gray-400 truncate">{msg.sender_email}</p>
                          )}
                        </div>
                        <button
                          className="text-xs text-gray-600 mt-1 text-left w-full"
                          onClick={() => {
                            if (expandedMsg === msg.id) {
                              setExpandedMsg(null)
                            } else {
                              setExpandedMsg(msg.id)
                              if (!msg.is_read) markRead(msg.id)
                            }
                          }}>
                          {expandedMsg === msg.id ? (
                            <span>{msg.message}</span>
                          ) : (
                            <span className="line-clamp-1 text-gray-500">{msg.message}</span>
                          )}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setExpandedMsg(expandedMsg === msg.id ? null : msg.id); if (!msg.is_read) markRead(msg.id) }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          {expandedMsg === msg.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button onClick={() => deleteMessage(msg.id)}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Testimonials</h3>
          </div>
          <Toggle on={testimonialsEnabled} onChange={() => {
            setTestimonialsEnabled(v => !v)
            if (!testimonialsEnabled) fetchTestimonials()
          }} />
        </div>
        <p className="text-xs text-gray-400 -mt-2">Hiển thị đánh giá từ khách hàng trên trang của bạn.</p>

        {testimonialsEnabled && (
          <div className="space-y-3">
            {loadingTest ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <>
                {testimonials.length > 0 && (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {testimonials.map(t => (
                      <div key={t.id} className={`rounded-xl border p-3 ${t.is_active ? 'border-gray-100 bg-gray-50' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold text-gray-800">{t.author_name}</p>
                              {t.author_role && <p className="text-[10px] text-gray-400">{t.author_role}</p>}
                              <StarRating value={t.rating} />
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{t.content}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => toggleTestActive(t)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title={t.is_active ? 'Ẩn' : 'Hiện'}>
                              {t.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                            </button>
                            <button onClick={() => deleteTestimonial(t.id)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showAddTest ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-700">Thêm testimonial mới</p>
                      <button onClick={() => setShowAddTest(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </div>
                    <input value={newTest.author_name} onChange={e => setNewTest(p => ({ ...p, author_name: e.target.value }))}
                      placeholder="Tên tác giả *" className={INPUT} />
                    <input value={newTest.author_role} onChange={e => setNewTest(p => ({ ...p, author_role: e.target.value }))}
                      placeholder="Chức vụ / công ty (tuỳ chọn)" className={INPUT} />
                    <textarea value={newTest.content} onChange={e => setNewTest(p => ({ ...p, content: e.target.value }))}
                      placeholder="Nội dung đánh giá *" rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] resize-none" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Đánh giá:</span>
                      <StarRating value={newTest.rating} onChange={n => setNewTest(p => ({ ...p, rating: n }))} />
                    </div>
                    <button onClick={addTestimonial} disabled={addingTest || !newTest.author_name.trim() || !newTest.content.trim()}
                      className="w-full py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
                      style={{ background: '#333A2F' }}>
                      {addingTest ? 'Đang thêm…' : 'Thêm testimonial'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowAddTest(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <Plus size={14} /> Thêm testimonial
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Email Capture */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Email Capture</h3>
          </div>
          <Toggle on={emailEnabled} onChange={() => setEmailEnabled(v => !v)} />
        </div>
        <p className="text-xs text-gray-400 -mt-2">Collect emails from visitors on your page.</p>
        {emailEnabled && (
          <>
            <input
              type="text" value={emailTitle} onChange={e => setEmailTitle(e.target.value)}
              placeholder="Heading (e.g. Stay in the loop)" maxLength={60}
              className={INPUT} />
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
          className={INPUT} />
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
          className={INPUT} />
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
              placeholder={profile?.display_name || 'Your name'} maxLength={60}
              className={INPUT} />
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
              className={INPUT} />
          </div>
        </div>
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
