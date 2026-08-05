import { useState, useEffect } from 'react'
import { Eye, MousePointerClick, Link2, Users, ExternalLink, Plus, PenSquare, QrCode, TrendingUp, Star, ArrowRight, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { BioLink } from '../../types'
import QRModal from '../../components/QRModal'

interface Stats {
  views7d:      number
  clicks7d:     number
  totalLinks:   number
  activeLinks:  number
  subscribers:  number
  featuredLink: BioLink | null
  topLinks:     { link: BioLink; clicks: number }[]
}

export default function OverviewTab({ onTabChange }: { onTabChange: (t: string) => void }) {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQr, setShowQr] = useState(false)
  const publicUrl = `${window.location.origin}/u/${profile!.username}`

  useEffect(() => { load() }, [])

  const load = async () => {
    const since7d = new Date(Date.now() - 7 * 86400000).toISOString()
    const uid = profile!.id

    const [
      { count: views7d },
      { count: clicks7d },
      { data: links },
      { count: subs },
      { data: clickData },
    ] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('user_id', uid).gte('viewed_at', since7d),
      supabase.from('link_clicks').select('*', { count: 'exact', head: true }).eq('user_id', uid).gte('clicked_at', since7d),
      supabase.from('bio_links').select('*').eq('user_id', uid).order('sort_order'),
      supabase.from('email_subscribers').select('*', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('link_clicks').select('link_id').eq('user_id', uid).gte('clicked_at', since7d),
    ])

    const linkList = links ?? []
    const clickMap: Record<string, number> = {}
    ;(clickData ?? []).forEach(c => { clickMap[c.link_id] = (clickMap[c.link_id] ?? 0) + 1 })
    const topLinks = linkList
      .filter(l => clickMap[l.id])
      .map(l => ({ link: l, clicks: clickMap[l.id] ?? 0 }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    setStats({
      views7d: views7d ?? 0,
      clicks7d: clicks7d ?? 0,
      totalLinks: linkList.length,
      activeLinks: linkList.filter(l => l.is_active).length,
      subscribers: subs ?? 0,
      featuredLink: linkList.find(l => l.is_featured) ?? null,
      topLinks,
    })
    setLoading(false)
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
    </div>
  )

  const s = stats!

  const statCards = [
    { label: 'Lượt xem', sub: '7 ngày qua',    value: s.views7d,    icon: Eye,               accent: '#333A2F', bg: '#F5F5F0' },
    { label: 'Lượt click', sub: '7 ngày qua',   value: s.clicks7d,   icon: MousePointerClick, accent: '#2563eb', bg: '#EFF6FF' },
    { label: 'Links bật',  sub: `/${s.totalLinks} tổng`, value: s.activeLinks, icon: Link2,    accent: '#7c3aed', bg: '#F5F3FF' },
    { label: 'Subscribers', sub: 'email',        value: s.subscribers, icon: Users,             accent: '#059669', bg: '#ECFDF5' },
  ]

  const checklist = [
    { done: !!profile?.avatar_url,  label: 'Upload ảnh đại diện', action: () => onTabChange('settings') },
    { done: !!profile?.bio,          label: 'Viết bio',             action: () => onTabChange('settings') },
    { done: s.totalLinks > 0,        label: 'Thêm link đầu tiên',  action: () => onTabChange('links')    },
    { done: s.subscribers > 0,       label: 'Thu subscriber đầu tiên', action: () => onTabChange('extras') },
  ]
  const allDone = checklist.every(c => c.done)

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Xin chào, {profile?.display_name || profile?.username}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Tổng quan trang DONLY của bạn</p>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <ExternalLink size={13} /> Xem trang
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                <c.icon size={15} style={{ color: c.accent }} />
              </div>
              <Activity size={11} className="text-gray-200" />
            </div>
            <p className="text-2xl font-black text-gray-900 tabular-nums">{c.value.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{c.label}</p>
            <p className="text-[10px] text-gray-400">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Thao tác nhanh</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Thêm Link', icon: Plus,      accent: '#333A2F', bg: '#F5F5F0', onClick: () => onTabChange('links'), href: null },
            { label: 'Editor',    icon: PenSquare,  accent: '#7c3aed', bg: '#F5F3FF', onClick: () => {},                   href: '/editor' },
            { label: 'Analytics', icon: TrendingUp, accent: '#2563eb', bg: '#EFF6FF', onClick: () => onTabChange('analytics'), href: null },
            { label: 'QR Code',   icon: QrCode,     accent: '#059669', bg: '#ECFDF5', onClick: () => setShowQr(true),      href: null },
          ].map(a => {
            const content = (
              <div className="flex flex-col items-center gap-2.5 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-center cursor-pointer w-full">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
                  <a.icon size={16} style={{ color: a.accent }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 leading-tight">{a.label}</span>
              </div>
            )
            if (a.href) return <Link key={a.label} to={a.href}>{content}</Link>
            return <button key={a.label} onClick={a.onClick} className="text-left">{content}</button>
          })}
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-gray-400" />
              <p className="text-sm font-bold text-gray-800">Top Links</p>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">7 ngày</span>
            </div>
          </div>
          {s.topLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <MousePointerClick size={28} className="text-gray-200" />
              <p className="text-xs text-gray-400 text-center">Chưa có click nào.<br />Chia sẻ trang để bắt đầu!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {s.topLinks.map((item, i) => (
                <div key={item.link.id} className="flex items-center gap-3 py-1.5">
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={i === 0 ? { background: '#333A2F', color: '#fff' } : { background: '#f3f4f6', color: '#9ca3af' }}>
                    {i + 1}
                  </span>
                  <p className="flex-1 text-xs font-semibold text-gray-700 truncate">{item.link.title}</p>
                  <span className="text-xs font-black flex-shrink-0 tabular-nums" style={{ color: '#333A2F' }}>
                    {item.clicks}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => onTabChange('analytics')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all text-gray-500">
            Xem Analytics <ArrowRight size={11} />
          </button>
        </div>

        {/* Checklist / Featured */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          {s.featuredLink ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                <p className="text-sm font-bold text-gray-800">Link Nổi Bật</p>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: '#F5F5F0' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#333A2F' }}>
                  <Star size={14} className="text-white" fill="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: '#333A2F' }}>{s.featuredLink.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.featuredLink.url}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Hiển thị nổi bật trên trang của bạn</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-800">Bắt đầu</p>
                {allDone && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Hoàn thành</span>}
              </div>
              <div className="space-y-1.5">
                {checklist.map(item => (
                  <button key={item.label} onClick={item.action}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all ${item.done ? 'opacity-50 cursor-default' : 'hover:bg-gray-50'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.done ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                      {item.done && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
                    {!item.done && <ArrowRight size={11} className="ml-auto text-gray-300 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showQr && (
        <QRModal url={publicUrl} username={profile!.username ?? 'user'} onClose={() => setShowQr(false)} />
      )}
    </div>
  )
}
