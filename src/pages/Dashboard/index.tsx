import { useState, useEffect, useCallback } from 'react'
import { Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Link2, ShoppingBag, Image, Palette, Settings, Eye, LogOut, ExternalLink, Copy, Check, PenSquare, Zap, BarChart2, LayoutDashboard, RefreshCw, Smartphone, EyeOff, Crown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import LinksTab from './LinksTab'
import ProductsTab from './ProductsTab'
import GalleryTab from './GalleryTab'
import AppearanceTab from './AppearanceTab'
import SettingsTab from './SettingsTab'
import ExtrasTab from './ExtrasTab'
import AnalyticsTab from './AnalyticsTab'
import OverviewTab from './OverviewTab'
import { useNotifications, NotificationBell, NotificationPanel } from './NotificationPanel'

type Tab = 'overview' | 'links' | 'products' | 'photos' | 'appearance' | 'settings' | 'extras' | 'analytics'

function StatsBar({ userId }: { userId: string }) {
  const [stats, setStats] = useState<{ links: number; products: number; albums: number } | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('bio_links').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('photo_albums').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]).then(([l, p, a]) => {
      setStats({ links: l.count ?? 0, products: p.count ?? 0, albums: a.count ?? 0 })
    })
  }, [userId])

  if (!stats) return null

  const items = [
    { label: 'Links',    value: stats.links    },
    { label: 'Products', value: stats.products  },
    { label: 'Albums',   value: stats.albums    },
  ]

  return (
    <div className="flex items-center gap-5 px-8 py-2.5 bg-white border-b border-gray-100 overflow-x-auto">
      {items.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-200 mr-3">·</span>}
          <span className="text-sm font-bold text-gray-800">{s.value}</span>
          <span className="text-xs text-gray-400">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

const NAV: { id: Tab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'overview',   label: 'Overview',   shortLabel: 'Home',    icon: LayoutDashboard },
  { id: 'links',      label: 'Links',      shortLabel: 'Links',   icon: Link2 },
  { id: 'products',   label: 'Products',   shortLabel: 'Shop',    icon: ShoppingBag },
  { id: 'photos',     label: 'Gallery',    shortLabel: 'Photos',  icon: Image },
  { id: 'appearance', label: 'Appearance', shortLabel: 'Look',    icon: Palette },
  { id: 'settings',   label: 'Settings',   shortLabel: 'Me',      icon: Settings },
  { id: 'extras',     label: 'Extras',     shortLabel: 'Extras',  icon: Zap },
  { id: 'analytics',  label: 'Analytics',  shortLabel: 'Stats',   icon: BarChart2 },
]

interface SidebarProps {
  profile: { username: string | null; display_name: string | null; avatar_url: string | null }
  tab: Tab
  setTab: (t: Tab) => void
  copied: boolean
  copyLink: () => void
  publicUrl: string
  handleSignOut: () => void
  isPro: boolean
}

function Sidebar({ profile, tab, setTab, copied, copyLink, publicUrl, handleSignOut, isPro }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="DONLY" className="w-28 object-contain flex-shrink-0" />
        </div>
      </div>

      {/* Public page link */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-xs text-gray-500 truncate flex-1">u/{profile.username}</span>
          <button onClick={copyLink} className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all" title="Copy link">
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all" title="Open page">
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === id ? 'text-[#333A2F]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            style={tab === id ? { background: '#EBEDDF' } : {}}>
            <Icon size={18} style={tab === id ? { color: '#333A2F' } : { color: undefined }} className={tab === id ? '' : 'text-gray-400'} />
            {label}
          </button>
        ))}
      </nav>

      {/* PRO */}
      {!isPro && (
        <div className="px-3 py-3 border-t border-gray-100">
          <Link to="/pricing"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border"
            style={{ background: '#FEFCE8', borderColor: '#FDE68A', color: '#92400E' }}>
            <Crown size={14} /> Nâng cấp PRO
          </Link>
        </div>
      )}
      {isPro && (
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: '#FEFCE8', borderColor: '#FDE68A' }}>
            <Crown size={13} style={{ color: '#D97706' }} />
            <span className="text-xs font-bold" style={{ color: '#92400E' }}>PRO đang hoạt động</span>
          </div>
        </div>
      )}

      {/* Open Editor */}
      <div className="px-3 py-3 border-t border-gray-100">
        <Link to="/editor"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
          style={{ background: '#333A2F' }}>
          <PenSquare size={15} /> Open Editor
        </Link>
      </div>

      {/* Sign out */}
      <div className="px-3 py-2 border-t border-gray-100">
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style={{ background: '#333A2F' }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : (profile.display_name || profile.username || 'U')[0].toUpperCase()
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{profile.display_name || profile.username}</p>
            <p className="text-xs text-gray-400 truncate">@{profile.username}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Phone frame preview ──────────────────────────────────────────────────────
function PhonePreview({ url }: { url: string }) {
  const [key, setKey] = useState(0)
  const refresh = useCallback(() => setKey(k => k + 1), [])

  // iPhone 15 proportions: ~390×844 logical px → aspect ~1:2.16
  const W = 220
  const H = Math.round(W * 2.16)
  const FRAME = 12        // bezel thickness
  const INNER_W = W - FRAME * 2
  const INNER_H = H - FRAME * 2
  const SCALE = INNER_W / 390  // scale content from 390px wide

  return (
    <div className="flex flex-col items-center gap-3 pt-6 pb-6 select-none">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 tracking-wide">
        <Smartphone size={12} />
        <span>Live Preview</span>
        <button onClick={refresh} className="p-1 rounded-md hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-all ml-0.5">
          <RefreshCw size={11} />
        </button>
      </div>

      {/* iPhone shell */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: W,
          height: H,
          borderRadius: 44,
          background: 'linear-gradient(145deg, #2a2a2c 0%, #1a1a1c 50%, #141416 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          padding: FRAME,
        }}
      >
        {/* Side buttons (left) */}
        <div className="absolute" style={{ left: -3, top: 80, width: 3, height: 34, background: '#2a2a2c', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 0 rgba(255,255,255,0.06)' }} />
        <div className="absolute" style={{ left: -3, top: 124, width: 3, height: 56, background: '#2a2a2c', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 0 rgba(255,255,255,0.06)' }} />
        <div className="absolute" style={{ left: -3, top: 192, width: 3, height: 56, background: '#2a2a2c', borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 0 rgba(255,255,255,0.06)' }} />
        {/* Power button (right) */}
        <div className="absolute" style={{ right: -3, top: 140, width: 3, height: 72, background: '#2a2a2c', borderRadius: '0 2px 2px 0', boxShadow: '1px 0 0 rgba(255,255,255,0.06)' }} />

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            width: INNER_W,
            height: INNER_H,
            borderRadius: 34,
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute z-20 flex items-center justify-center gap-1.5"
            style={{
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 90,
              height: 30,
              background: '#000',
              borderRadius: 20,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-gray-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          </div>

          {/* Status bar */}
          <div className="absolute z-10 top-0 inset-x-0 flex items-center justify-between px-5 pt-2" style={{ height: 48 }}>
            <span className="text-[10px] font-bold text-black/70">9:41</span>
            <div className="flex items-center gap-1 opacity-70">
              {/* signal bars */}
              <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="6" width="3" height="5" rx="0.5" fill="#000"/><rect x="4.5" y="4" width="3" height="7" rx="0.5" fill="#000"/><rect x="9" y="2" width="3" height="9" rx="0.5" fill="#000"/><rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill="#000"/></svg>
              {/* wifi */}
              <svg width="14" height="11" viewBox="0 0 14 11"><path d="M7 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-3.5C8.6 5 10 5.8 11 7l-1.2 1.2A3.5 3.5 0 0 0 7 7c-.96 0-1.83.39-2.46 1.02L3.3 6.8C4.3 5.7 5.6 5 7 5zm0-3.5c2.4 0 4.55 1.1 6 2.83L11.8 5.03A6.5 6.5 0 0 0 7 3a6.5 6.5 0 0 0-4.8 2.1L1 3.86A9.5 9.5 0 0 1 7 1.5z" fill="#000"/></svg>
              {/* battery */}
              <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#000" strokeOpacity="0.35" fill="none"/><rect x="19.5" y="3.5" width="2" height="4" rx="1" fill="#000" fillOpacity="0.4"/><rect x="2" y="2" width="13" height="7" rx="1.5" fill="#000"/></svg>
            </div>
          </div>

          {/* iframe */}
          <div className="absolute inset-0" style={{ top: 0 }}>
            <iframe
              key={key}
              src={url}
              title="Page preview"
              className="border-0"
              style={{
                width: Math.round(INNER_W / SCALE),
                height: Math.round(INNER_H / SCALE),
                transform: `scale(${SCALE})`,
                transformOrigin: 'top left',
              }}
            />
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center z-20">
            <div className="w-24 h-1 rounded-full bg-black/20" />
          </div>
        </div>
      </div>

      <a href={url} target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors font-medium">
        <ExternalLink size={11} /> Open in new tab
      </a>
    </div>
  )
}

export default function Dashboard() {
  const { profile, loading, signOut, isPro } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get('tab') as Tab | null
    return (t && (['overview','links','products','photos','appearance','settings','extras','analytics'] as Tab[]).includes(t)) ? t : 'overview'
  })
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const { notifications, unread, markAllRead, markRead } = useNotifications()

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
    </div>
  )

  if (!profile?.username) return <Navigate to="/onboarding" replace />

  const handleSignOut = async () => { await signOut(); navigate('/login', { replace: true }) }
  const publicUrl = `${window.location.origin}/u/${profile.username}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTab = NAV.find(n => n.id === tab)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <Sidebar profile={profile} tab={tab} setTab={setTab} copied={copied} copyLink={copyLink} publicUrl={publicUrl} handleSignOut={handleSignOut} isPro={isPro} />
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 safe-area-inset-bottom">
        <div className="flex">
          {NAV.map(({ id, shortLabel, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all ${tab !== id ? 'text-gray-400' : ''}`}
              style={tab === id ? { color: '#333A2F' } : {}}>
              <Icon size={20} />
              <span className="text-[10px] font-medium">{shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DONLY" className="h-7 object-contain" />
        </div>
        <div className="flex-1 flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-1.5 mx-2 min-w-0">
          <span className="text-xs text-gray-500 truncate">u/{profile.username}</span>
          <button onClick={copyLink} className="flex-shrink-0 p-0.5">
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
          </button>
        </div>
        <NotificationBell onClick={() => setNotifOpen(true)} unread={unread} />
        <a href={publicUrl} target="_blank" rel="noreferrer"
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
          style={{ background: '#333A2F' }}>
          <Eye size={13} />
        </a>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64 flex min-h-screen">

        {/* Content area */}
        <main className="flex-1 pt-14 lg:pt-0 pb-20 lg:pb-0 min-w-0">
          {/* Desktop top bar */}
          <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
            <div>
              <h1 className="text-base font-semibold text-gray-900">{currentTab?.label}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{window.location.host}/u/{profile.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell onClick={() => setNotifOpen(true)} unread={unread} />
              <button onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                {copied ? <><Check size={15} className="text-green-500" /> Copied!</> : <><Copy size={15} /> Copy Link</>}
              </button>
              <button onClick={() => setShowPreview(v => !v)}
                className="hidden xl:flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                {showPreview ? <><EyeOff size={15} /> Hide Preview</> : <><Smartphone size={15} /> Show Preview</>}
              </button>
              <a href={publicUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all"
                style={{ background: '#333A2F' }}>
                <Eye size={15} /> Open Page
              </a>
            </div>
          </div>

          <StatsBar userId={profile.id} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {tab === 'overview'   && <OverviewTab onTabChange={(t) => setTab(t as Tab)} />}
            {tab === 'links'      && <LinksTab />}
            {tab === 'products'   && <ProductsTab />}
            {tab === 'photos'     && <GalleryTab />}
            {tab === 'appearance' && <AppearanceTab />}
            {tab === 'settings'   && <SettingsTab />}
            {tab === 'extras'     && <ExtrasTab />}
            {tab === 'analytics'  && <AnalyticsTab />}
          </div>
        </main>

        {/* Live preview panel (xl+) */}
        {showPreview && (
          <aside className="hidden xl:flex flex-col w-72 bg-white border-l border-gray-100 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
            <PhonePreview url={publicUrl} />
          </aside>
        )}
      </div>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        unread={unread}
        markAllRead={markAllRead}
        markRead={markRead}
      />
    </div>
  )
}
