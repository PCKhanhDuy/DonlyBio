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
    { label: 'Links',    value: stats.links,    color: 'bg-[#EBEDDF] text-[#333A2F]' },
    { label: 'Products', value: stats.products, color: 'bg-blue-100 text-blue-700'   },
    { label: 'Albums',   value: stats.albums,   color: 'bg-pink-100 text-pink-700'   },
  ]

  return (
    <div className="flex items-center gap-3 px-8 py-3 bg-white border-b border-gray-100 overflow-x-auto">
      {items.map(s => (
        <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${s.color}`}>
          <span className="text-base font-bold">{s.value}</span>
          <span className="opacity-75">{s.label}</span>
        </div>
      ))}
      <p className="text-xs text-gray-400 ml-auto hidden sm:block">Your DONLY BioLink overview</p>
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

      {/* Upgrade CTA (free users) */}
      {!isPro && (
        <div className="px-3 py-3 border-t border-gray-100">
          <Link to="/pricing"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#fff' }}>
            <Crown size={14} /> Nâng cấp PRO
          </Link>
        </div>
      )}
      {isPro && (
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50">
            <Crown size={13} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-bold text-amber-600">PRO đang hoạt động</span>
          </div>
        </div>
      )}

      {/* Open Editor */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1.5">
        <Link to="/editor"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
          style={{ background: '#333A2F' }}>
          <PenSquare size={15} /> Open Editor
        </Link>
        <p className="text-[10px] text-gray-400 text-center leading-tight px-1">
          Recommended on desktop or wide screens for best experience
        </p>
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

  return (
    <div className="flex flex-col items-center gap-3 pt-4 pb-6">
      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
        <Smartphone size={13} />
        <span>Live Preview</span>
        <button onClick={refresh} className="ml-1 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all" title="Refresh preview">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Phone shell */}
      <div className="relative" style={{ width: 256 }}>
        {/* Outer shell */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gray-900 shadow-2xl" style={{ margin: '-10px' }} />
        {/* Screen bezel */}
        <div className="relative rounded-[2rem] overflow-hidden bg-white" style={{ height: 520 }}>
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 z-10 flex justify-center pt-2">
            <div className="w-20 h-5 bg-gray-900 rounded-b-xl flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
              <div className="w-3 h-1.5 bg-gray-700 rounded-full" />
            </div>
          </div>
          {/* iframe */}
          <iframe
            key={key}
            src={url}
            className="w-full h-full border-0"
            title="Page preview"
            style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%', height: '133.33%' }}
          />
        </div>
        {/* Home indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      <a href={url} target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
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
    </div>
  )
}
