import { useState, useEffect } from 'react'
import { Eye, MousePointerClick, Link2, Users, ExternalLink, Plus, PenSquare, QrCode, TrendingUp, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { BioLink } from '../../types'

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
    <div className="flex justify-center py-20">
      <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
    </div>
  )

  const s = stats!
  const statCards = [
    { label: 'Lượt xem (7 ngày)', value: s.views7d, icon: Eye,              color: '#333A2F', bg: '#EBEDDF' },
    { label: 'Lượt click (7 ngày)', value: s.clicks7d, icon: MousePointerClick, color: '#2563eb', bg: '#dbeafe' },
    { label: 'Links đang bật',     value: s.activeLinks, icon: Link2,         color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Subscribers',        value: s.subscribers, icon: Users,          color: '#059669', bg: '#d1fae5' },
  ]

  const hasData = s.views7d > 0 || s.clicks7d > 0 || s.totalLinks > 0

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Xin chào, {profile?.display_name || profile?.username}! 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Đây là tổng quan trang DONLY của bạn.</p>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          <ExternalLink size={14} /> Xem trang
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
              <c.icon size={17} style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: 'Thêm Link',     icon: Plus,       action: () => onTabChange('links'),      color: '#333A2F', bg: '#EBEDDF' },
            { label: 'Mở Editor',     icon: PenSquare,  action: () => {},                         color: '#7c3aed', bg: '#ede9fe', href: '/editor' },
            { label: 'Analytics',     icon: TrendingUp, action: () => onTabChange('analytics'),  color: '#2563eb', bg: '#dbeafe' },
            { label: 'QR Code',       icon: QrCode,     action: () => onTabChange('settings'),   color: '#059669', bg: '#d1fae5' },
          ].map(a => {
            const inner = (
              <button key={a.label} onClick={a.action}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center w-full">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
                  <a.icon size={18} style={{ color: a.color }} />
                </div>
                <span className="text-xs font-semibold text-gray-700">{a.label}</span>
              </button>
            )
            return a.href
              ? <Link key={a.label} to={a.href}>{inner}</Link>
              : <div key={a.label}>{inner}</div>
          })}
        </div>
      </div>

      {/* Two column: Top links + Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top performing links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-800">Top Links (7 ngày)</p>
          </div>
          {s.topLinks.length === 0 ? (
            <div className="text-center py-6">
              <MousePointerClick size={24} className="mx-auto text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">Chưa có click nào. Chia sẻ trang để bắt đầu!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {s.topLinks.map((item, i) => (
                <div key={item.link.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: i === 0 ? '#EBEDDF' : '#f3f4f6', color: i === 0 ? '#333A2F' : '#9ca3af' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.link.title}</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: '#333A2F' }}>
                    {item.clicks} click
                  </span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => onTabChange('analytics')}
            className="mt-4 text-xs font-medium w-full text-center py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors" style={{ color: '#333A2F' }}>
            Xem đầy đủ →
          </button>
        </div>

        {/* Getting started / Featured link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          {s.featuredLink ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Star size={15} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-800">Link Nổi Bật</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#EBEDDF' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#333A2F' }}>
                  <Star size={15} className="text-white" fill="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: '#333A2F' }}>{s.featuredLink.title}</p>
                  <p className="text-xs text-gray-500 truncate">{s.featuredLink.url}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Link này hiển thị nổi bật trên trang của bạn.</p>
            </>
          ) : !hasData ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-800">Bắt đầu</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { done: !!profile?.avatar_url,  label: 'Upload ảnh đại diện',        action: () => onTabChange('settings') },
                  { done: !!profile?.bio,          label: 'Viết bio',                   action: () => onTabChange('settings') },
                  { done: s.totalLinks > 0,        label: 'Thêm link đầu tiên',        action: () => onTabChange('links') },
                  { done: s.subscribers > 0,       label: 'Thu được subscriber đầu tiên', action: () => onTabChange('extras') },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className={`flex items-center gap-3 w-full text-left p-2.5 rounded-xl text-xs transition-all ${item.done ? 'opacity-60' : 'hover:bg-gray-50'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {item.done && <span className="text-white text-[9px] font-bold">✓</span>}
                    </div>
                    <span className={`font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Star size={15} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-800">Link Nổi Bật</p>
              </div>
              <div className="text-center py-6">
                <Star size={24} className="mx-auto text-gray-200 mb-2" />
                <p className="text-xs text-gray-400">Chưa có link nổi bật nào.</p>
                <button onClick={() => onTabChange('links')}
                  className="mt-3 text-xs font-medium px-4 py-1.5 rounded-xl text-white transition-all"
                  style={{ background: '#333A2F' }}>
                  Chọn Link Nổi Bật
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Public URL card */}
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#EBEDDF' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#333A2F' }}>
          <ExternalLink size={17} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#333A2F' }}>Your DONLY Link</p>
          <p className="text-sm font-semibold truncate" style={{ color: '#333A2F' }}>{publicUrl}</p>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer"
          className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all"
          style={{ background: '#333A2F' }}>
          Xem →
        </a>
      </div>
    </div>
  )
}
