import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink, Globe, Link2, Share2, Check, X as XIcon, Mail, Copy, Briefcase, Star, Heart, CalendarDays, ImageOff, ShoppingBag, SearchX, ChevronRight, Music, MessageSquare, Send, Lock } from 'lucide-react'
import {
  SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiShopee,
  SiGithub, SiTelegram, SiWhatsapp, SiMessenger, SiZalo,
  SiDiscord, SiTwitch, SiSpotify, SiPinterest, SiReddit,
  SiSnapchat, SiMedium, SiBehance, SiDribbble, SiThreads,
} from 'react-icons/si'
import { supabase } from '../lib/supabase'
import { TEMPLATES, PLATFORM_COLORS, FONTS, DEFAULT_SETTINGS } from '../types'
import type { Profile, BioLink, Product, PhotoAlbum, Photo, TemplateId, LayoutId, TemplateStyle, CustomSettings } from '../types'
import StoryViewer from '../components/StoryViewer'

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: SiInstagram, tiktok:    SiTiktok,    youtube:   SiYoutube,
  facebook:  SiFacebook,  twitter:   SiX,          threads:   SiThreads,
  linkedin:  Briefcase,   github:    SiGithub,     telegram:  SiTelegram,
  whatsapp:  SiWhatsapp,  messenger: SiMessenger,  discord:   SiDiscord,
  twitch:    SiTwitch,    spotify:   SiSpotify,    pinterest: SiPinterest,
  reddit:    SiReddit,    snapchat:  SiSnapchat,   medium:    SiMedium,
  behance:   SiBehance,   dribbble:  SiDribbble,   shopee:    SiShopee,
  zalo:      SiZalo,      website:   Globe,         custom:    Link2,
}

const NAME_SIZES: Record<string, string> = {
  sm: '13px', base: '16px', lg: '18px', xl: '21px', '2xl': '26px', '3xl': '32px',
}

function getNameStyle(settings: CustomSettings, tpl: TemplateStyle, overrideColor?: string): React.CSSProperties {
  return {
    fontWeight: settings.nameWeight,
    fontSize:   NAME_SIZES[settings.nameSize] ?? '21px',
    color:      overrideColor ?? (settings.nameColor || tpl.textColor),
    fontFamily: settings.nameFont ? (FONTS[settings.nameFont]?.css ?? undefined) : undefined,
    lineHeight: 1.15,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]+)/)
  return m?.[1] ?? null
}

function getSpotifyEmbed(url: string): string | null {
  const m = url.match(/open\.spotify\.com\/(track|album|playlist|artist|episode)\/([^?&\s]+)/)
  if (!m) return null
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator`
}

async function trackClick(linkId: string, userId: string) {
  try { await supabase.from('link_clicks').insert({ link_id: linkId, user_id: userId }) } catch {}
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function PublicPage() {
  const { username } = useParams<{ username: string }>()
  const [profile,  setProfile]  = useState<Profile | null>(null)
  const [links,    setLinks]    = useState<BioLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [albums,   setAlbums]   = useState<PhotoAlbum[]>([])
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [storyAlbum,  setStoryAlbum]  = useState<PhotoAlbum | null>(null)
  const [storyPhotos, setStoryPhotos] = useState<Photo[]>([])
  // Page password gate state
  const [pwInput,    setPwInput]    = useState('')
  const [pwError,    setPwError]    = useState(false)
  const [pwUnlocked, setPwUnlocked] = useState(false)

  useEffect(() => { if (username) load(username) }, [username])
  useEffect(() => {
    if (profile?.username) {
      setPwUnlocked(sessionStorage.getItem(`donly_pw_${profile.username}`) === '1')
    }
  }, [profile?.username])

  const load = async (uname: string) => {
    const { data: p } = await supabase
      .from('profiles').select('*').eq('username', uname.toLowerCase()).single()
    if (!p) { setNotFound(true); setLoading(false); return }
    setProfile(p)
    const [{ data: l }, { data: pr }, { data: alb }] = await Promise.all([
      supabase.from('bio_links').select('*').eq('user_id', p.id).eq('is_active', true).order('sort_order'),
      supabase.from('products').select('*').eq('user_id', p.id).eq('is_active', true).order('sort_order'),
      supabase.from('photo_albums').select('*').eq('user_id', p.id).order('sort_order'),
    ])
    const now = new Date()
    const liveLinks = (l ?? []).filter(link => {
      if (link.active_from  && new Date(link.active_from)  > now) return false
      if (link.active_until && new Date(link.active_until) < now) return false
      return true
    })
    setLinks(liveLinks)
    setProducts(pr ?? [])
    setAlbums(alb ?? [])
    setLoading(false)
    // Track page view (best effort)
    try { await supabase.from('page_views').insert({ user_id: p.id }) } catch {}
  }

  // OG meta tags
  useEffect(() => {
    if (!profile) return
    const name   = profile.seo_title    || profile.display_name || '@' + profile.username
    const desc   = profile.seo_description || profile.bio || `Check out ${name}'s links on DONLY`
    const imgUrl = profile.seo_image    || profile.avatar_url
    document.title = `${name} | DONLY`
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('og:title',       name)
    setMeta('og:type',        'profile')
    setMeta('og:description', desc)
    if (imgUrl) setMeta('og:image', imgUrl)
    return () => { document.title = 'DONLY' }
  }, [profile])

  // Load Google Fonts for profile settings
  useEffect(() => {
    if (!profile) return
    const s: CustomSettings = { ...DEFAULT_SETTINGS, ...(profile.custom_settings ?? {}) }
    ;[s.pageFont, s.nameFont].filter(Boolean).forEach(key => {
      const font = FONTS[key]
      if (!font?.google) return
      const id = `gf-pub-${key}`
      if (document.getElementById(id)) return
      const link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`
      document.head.appendChild(link)
    })
  }, [profile])

  const openAlbum = async (album: PhotoAlbum) => {
    const { data } = await supabase.from('photos').select('*').eq('album_id', album.id).order('sort_order')
    setStoryPhotos(data ?? [])
    setStoryAlbum(album)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#EBEDDF' }}>
      <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
      <SearchX size={56} className="mb-5 text-slate-500" />
      <h1 className="text-2xl font-bold text-white">@{username} not found</h1>
      <p className="text-slate-400 mt-2 text-sm">This page doesn't exist or has been removed.</p>
      <a href="/" className="mt-8 px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-colors" style={{ background: '#333A2F' }}>
        Create your own DONLY page →
      </a>
    </div>
  )

  const tplId    = (profile!.template_id ?? 'minimal') as TemplateId
  const layoutId = (profile!.layout_id   ?? 'centered') as LayoutId
  const tpl      = TEMPLATES[tplId] ?? TEMPLATES.minimal
  const rawBg    = profile!.custom_bg ?? null
  const isImgBg  = rawBg?.startsWith('img:') ?? false
  const bgImage  = isImgBg ? rawBg!.slice(4) : null
  const pageBg   = (rawBg && !isImgBg) ? rawBg : tpl.pageBg
  const settings: CustomSettings = { ...DEFAULT_SETTINGS, ...(profile!.custom_settings ?? {}) }
  const pageFont = FONTS[settings.pageFont]?.css ?? 'system-ui, -apple-system, sans-serif'

  // Password gate
  if (settings.pagePasswordEnabled && settings.pagePassword && !pwUnlocked) {
    const checkPw = (e: React.FormEvent) => {
      e.preventDefault()
      if (pwInput === settings.pagePassword) {
        sessionStorage.setItem(`donly_pw_${profile!.username}`, '1')
        setPwUnlocked(true)
      } else {
        setPwError(true)
        setTimeout(() => setPwError(false), 2000)
      }
    }
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: pageBg }}>
        <div className="w-full max-w-xs p-8 rounded-3xl shadow-2xl space-y-5 text-center"
          style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
          {profile!.avatar_url && (
            <img src={profile!.avatar_url} alt="" className="w-16 h-16 rounded-full mx-auto object-cover" />
          )}
          <div>
            <h2 className="font-bold text-base" style={{ color: tpl.textColor }}>
              {profile!.display_name || `@${profile!.username}`}
            </h2>
            <p className="text-xs mt-1 flex items-center justify-center gap-1.5" style={{ color: tpl.subtextColor }}>
              <Lock size={11} /> Trang này được bảo vệ
            </p>
          </div>
          <form onSubmit={checkPw} className="space-y-3">
            <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)}
              placeholder="Nhập mật khẩu…" required autoFocus
              className="w-full px-4 py-2.5 rounded-xl text-sm text-center focus:outline-none"
              style={{ background: tpl.btnBg, border: `1px solid ${pwError ? '#ef4444' : tpl.btnBorder}`, color: tpl.btnText }} />
            {pwError && <p className="text-xs text-red-500">Mật khẩu không đúng</p>}
            <button type="submit"
              className="w-full py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
              style={{ background: '#333A2F', color: '#fff' }}>
              Mở khóa
            </button>
          </form>
        </div>
      </div>
    )
  }

  const shared: LayoutProps = {
    profile: profile!, links, products, albums, tpl, pageBg, bgImage, settings, onAlbum: openAlbum,
  }

  const blurBgStyle: React.CSSProperties = {
    position: 'absolute', inset: '-12%',
    ...(bgImage
      ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: pageBg }),
    filter: 'blur(36px) brightness(0.55) saturate(1.3)',
  }

  return (
    <>
      {/* Custom CSS injection */}
      {settings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      )}

      <div className="hidden md:block fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div style={blurBgStyle} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="md:hidden fixed inset-0 -z-10" style={{ background: bgImage ? undefined : pageBg }}>
        {bgImage && (
          <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        {bgImage && <div className="absolute inset-0 bg-black/40" />}
      </div>

      <div className="min-h-screen md:flex md:justify-center md:items-start md:py-10 md:px-4 relative" style={{ zIndex: 1, fontFamily: pageFont }}>
        <div
          className="w-full md:max-w-[520px] relative md:rounded-3xl md:overflow-hidden md:shadow-2xl md:shadow-black/50"
          style={{ background: pageBg }}>

          {bgImage && layoutId !== 'overlay' && (
            <>
              <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
              <div className="absolute inset-0 bg-black/42" style={{ zIndex: 1 }} />
            </>
          )}

          <AnnouncementBanner settings={settings} />
          <ShareButton profile={profile!} />

          <div className={bgImage && layoutId !== 'overlay' ? 'relative' : ''} style={{ zIndex: bgImage && layoutId !== 'overlay' ? 2 : undefined }}>
            {layoutId === 'left'      && <LeftLayout      {...shared} />}
            {layoutId === 'hero'      && <HeroLayout      {...shared} />}
            {layoutId === 'grid'      && <GridLayout      {...shared} />}
            {layoutId === 'card'      && <CardLayout      {...shared} />}
            {layoutId === 'split'     && <SplitLayout     {...shared} />}
            {layoutId === 'compact'   && <CompactLayout   {...shared} />}
            {layoutId === 'magazine'  && <MagazineLayout  {...shared} />}
            {layoutId === 'overlay'   && <OverlayLayout   {...shared} />}
            {layoutId === 'banner'    && <BannerLayout    {...shared} />}
            {layoutId === 'bubble'    && <BubbleLayout    {...shared} />}
            {layoutId === 'float'     && <FloatLayout     {...shared} />}
            {layoutId === 'columns'   && <ColumnsLayout   {...shared} />}
            {layoutId === 'spotlight' && <SpotlightLayout {...shared} />}
            {layoutId === 'bento'     && <BentoLayout     {...shared} />}
            {layoutId === 'timeline'  && <TimelineLayout  {...shared} />}
            {layoutId === 'strip'     && <StripLayout     {...shared} />}
            {layoutId === 'resume'    && <ResumeLayout    {...shared} />}
            {layoutId === 'masonry'   && <MasonryLayout   {...shared} />}
            {layoutId === 'glass'     && <GlassLayout     {...shared} />}
            {(layoutId === 'centered' || !layoutId ||
              !(['left','hero','grid','card','split','compact','magazine','overlay','banner','bubble','float','columns','spotlight','bento','timeline','strip','resume','masonry','glass'] as LayoutId[]).includes(layoutId)) && (
              <CenteredLayout {...shared} />
            )}
          </div>
        </div>
      </div>

      {storyAlbum && storyPhotos.length > 0 && (
        <StoryViewer
          photos={storyPhotos}
          albumName={storyAlbum.name}
          onClose={() => { setStoryAlbum(null); setStoryPhotos([]) }}
        />
      )}
    </>
  )
}

// ─── Shared props ──────────────────────────────────────────────────────────────
interface LayoutProps {
  profile: Profile
  links: BioLink[]
  products: Product[]
  albums: PhotoAlbum[]
  tpl: TemplateStyle
  pageBg: string
  bgImage: string | null
  settings: CustomSettings
  onAlbum: (a: PhotoAlbum) => void
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function AvatarImg({ profile, tpl, size, settings }: {
  profile: Profile; tpl: TemplateStyle; size: 'xs' | 'sm' | 'md' | 'lg'; settings: CustomSettings
}) {
  const dimPx = size === 'lg' ? 96 : size === 'md' ? 64 : size === 'sm' ? 48 : 36
  const dim = `${dimPx}px`
  const borderRadius = settings.avatarShape === 'circle' ? '50%'
    : settings.avatarShape === 'rounded' ? `${Math.round(dimPx * 0.22)}px`
    : '6px'
  const border = settings.avatarBorder
    ? `${settings.avatarBorderWidth}px solid ${settings.avatarBorderColor}`
    : `3px solid ${tpl.cardBorder}`
  const boxShadow = settings.avatarShadow ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 14px rgba(0,0,0,0.1)'
  const txtSize = size === 'lg' ? '2rem' : size === 'md' ? '1.4rem' : size === 'sm' ? '1.1rem' : '0.9rem'

  return profile.avatar_url
    ? <img src={profile.avatar_url} alt=""
        style={{ width: dim, height: dim, borderRadius, objectFit: 'cover', border, boxShadow, flexShrink: 0 }} />
    : <div style={{ width: dim, height: dim, borderRadius, background: tpl.cardBg, border, color: tpl.textColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
        fontSize: txtSize, flexShrink: 0, boxShadow }}>
        {(profile.display_name || profile.username || 'U')[0].toUpperCase()}
      </div>
}

// ─── Link button ──────────────────────────────────────────────────────────────
function LinkBtn({ link, tpl, align = 'center', settings, userId }: {
  link: BioLink; tpl: TemplateStyle; align?: 'center' | 'left'; settings: CustomSettings; userId?: string
}) {
  const Icon      = PLATFORM_ICONS[link.platform ?? 'custom'] ?? Link2
  const platColor = PLATFORM_COLORS[link.platform ?? 'custom'] ?? tpl.btnText
  const bStyle    = tpl.btnStyle ?? 'solid'

  const bg     = settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[link.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
  const border  = settings.linkBorder ? (bStyle === 'vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
  const color   = settings.linkBgCustom ? undefined : (bStyle === 'vivid' ? '#fff' : tpl.btnText)
  const padding = settings.linkHeight === 'sm' ? '9px 20px' : settings.linkHeight === 'lg' ? '18px 20px' : '13px 20px'
  const boxShadow = link.is_featured
    ? '0 0 0 2px rgba(251,191,36,0.6), 0 4px 20px rgba(0,0,0,0.12)'
    : settings.linkShadow ? '0 4px 14px rgba(0,0,0,0.12)' : undefined

  const iconEl = (
    <span style={bStyle === 'icon-colors' && !settings.linkBgCustom ? { color: platColor, filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' } : {}}>
      <Icon size={18} />
    </span>
  )

  const animClass = settings.linkAnimation && settings.linkAnimation !== 'none'
    ? `link-anim-${settings.linkAnimation}`
    : ''

  return (
    <a href={link.url} target="_blank" rel="noreferrer"
      onClick={() => userId && trackClick(link.id, userId)}
      className={`link-btn flex items-center gap-3 w-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg relative ${animClass}`}
      style={{ background: bg, border, color, padding, borderRadius: settings.linkRadius + 'px', boxShadow, backdropFilter: 'blur(8px)' }}>
      {/* Thumbnail takes priority over icon */}
      {link.thumbnail_url ? (
        <img src={link.thumbnail_url} alt="" className="flex-shrink-0 object-cover"
          style={{ width: 36, height: 36, borderRadius: Math.max(0, settings.linkRadius - 6) + 'px' }} />
      ) : (
        settings.linkIconPos !== 'right' && settings.linkIconPos !== 'none' && iconEl
      )}
      <span className={`flex-1 ${align === 'center' && !link.thumbnail_url && settings.linkIconPos !== 'right' ? 'text-center' : 'text-left'}`}>
        {link.title}
      </span>
      {!link.thumbnail_url && settings.linkIconPos === 'right' && iconEl}
      {link.is_featured && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-white flex-shrink-0">
          <Star size={9} fill="currentColor" />
        </span>
      )}
      <ExternalLink size={12} style={{ opacity: 0.35 }} />
    </a>
  )
}

// ─── Grid link button ─────────────────────────────────────────────────────────
function GridLinkBtn({ link, tpl, settings, userId }: { link: BioLink; tpl: TemplateStyle; settings: CustomSettings; userId?: string }) {
  const Icon      = PLATFORM_ICONS[link.platform ?? 'custom'] ?? Link2
  const platColor = PLATFORM_COLORS[link.platform ?? 'custom'] ?? tpl.btnText
  const bStyle    = tpl.btnStyle ?? 'solid'
  const bg     = settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[link.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
  const border  = settings.linkBorder ? (bStyle === 'vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
  const color   = settings.linkBgCustom ? undefined : (bStyle === 'vivid' ? '#fff' : tpl.btnText)

  const boxShadow = link.is_featured
    ? '0 0 0 2px rgba(251,191,36,0.6), 0 4px 16px rgba(0,0,0,0.1)' : undefined

  return (
    <a href={link.url} target="_blank" rel="noreferrer"
      onClick={() => userId && trackClick(link.id, userId)}
      className="flex flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-center transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg overflow-hidden relative"
      style={{ background: bg, border, color, borderRadius: settings.linkRadius + 'px', minHeight: 90, backdropFilter: 'blur(8px)', boxShadow }}>
      {link.thumbnail_url ? (
        <img src={link.thumbnail_url} alt="" className="w-12 h-12 object-cover"
          style={{ borderRadius: Math.max(0, settings.linkRadius - 8) + 'px' }} />
      ) : (
        <span style={bStyle === 'icon-colors' && !settings.linkBgCustom ? { color: platColor } : {}}>
          <Icon size={26} />
        </span>
      )}
      <span className="leading-tight line-clamp-2">{link.title}</span>
      {link.is_featured && (
        <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white">
          <Star size={8} fill="currentColor" />
        </span>
      )}
    </a>
  )
}

// ─── Content block components ──────────────────────────────────────────────────
function HeadingBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px opacity-25" style={{ background: tpl.subtextColor }} />
      <p className="text-xs font-bold uppercase tracking-widest flex-shrink-0" style={{ color: tpl.subtextColor }}>
        {link.title}
      </p>
      <div className="flex-1 h-px opacity-25" style={{ background: tpl.subtextColor }} />
    </div>
  )
}

function YoutubeBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  const vid = getYoutubeId(link.url)
  if (!vid) return (
    <a href={link.url} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      <SiYoutube size={22} style={{ color: '#FF0000' }} />
      <span className="text-sm font-semibold" style={{ color: tpl.textColor }}>{link.title || 'YouTube Video'}</span>
    </a>
  )
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tpl.cardBorder}` }}>
      {link.title && (
        <p className="px-3 py-2 text-xs font-semibold flex items-center gap-2"
          style={{ color: tpl.subtextColor, background: tpl.cardBg }}>
          <SiYoutube size={13} style={{ color: '#FF0000' }} /> {link.title}
        </p>
      )}
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${vid}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    </div>
  )
}

function SpotifyBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  const embedUrl = getSpotifyEmbed(link.url)
  if (!embedUrl) return (
    <a href={link.url} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      <SiSpotify size={22} style={{ color: '#1ED760' }} />
      <span className="text-sm font-semibold" style={{ color: tpl.textColor }}>{link.title || 'Spotify'}</span>
    </a>
  )
  const isTrack = link.url.includes('/track/')
  const height = isTrack ? 152 : 352
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tpl.cardBorder}` }}>
      {link.title && (
        <p className="px-3 py-2 text-xs font-semibold flex items-center gap-2"
          style={{ color: tpl.subtextColor, background: tpl.cardBg }}>
          <SiSpotify size={13} style={{ color: '#1ED760' }} /> {link.title}
        </p>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ display: 'block', borderRadius: 0 }}
        loading="lazy" />
    </div>
  )
}

function SocialPostBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  const isIg = link.block_type === 'instagram'
  const Icon = isIg ? SiInstagram : SiTiktok
  const color = isIg ? '#E1306C' : '#010101'
  const label = isIg ? 'Instagram Post' : 'TikTok Video'
  return (
    <a href={link.url} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-md"
      style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: tpl.subtextColor }}>{label}</p>
        <p className="text-sm font-semibold truncate" style={{ color: tpl.textColor }}>{link.title || link.url}</p>
      </div>
      <ExternalLink size={13} style={{ color: tpl.subtextColor, opacity: 0.6, flexShrink: 0 }} />
    </a>
  )
}

function TextBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  return (
    <div className="px-1 py-1">
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: tpl.subtextColor }}>{link.title}</p>
    </div>
  )
}

function ImageBlock({ link, tpl, settings }: { link: BioLink; tpl: TemplateStyle; settings: CustomSettings }) {
  if (!link.url) return null
  return (
    <div className="overflow-hidden" style={{ borderRadius: settings.linkRadius + 'px' }}>
      <img src={link.url} alt={link.title || ''} className="w-full object-cover block"
        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
      {link.title && (
        <p className="text-xs text-center py-2" style={{ color: tpl.subtextColor, opacity: 0.6 }}>{link.title}</p>
      )}
    </div>
  )
}

function CountdownBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  const getRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now()
    if (isNaN(diff) || diff <= 0) return null
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [rem, setRem] = useState(() => getRemaining(link.url))
  useEffect(() => {
    if (!link.url) return
    const t = setInterval(() => setRem(getRemaining(link.url)), 1000)
    return () => clearInterval(t)
  }, [link.url])

  return (
    <div className="px-4 py-4 rounded-2xl space-y-3" style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      {link.title && <p className="text-sm font-semibold text-center" style={{ color: tpl.textColor }}>{link.title}</p>}
      {rem ? (
        <div className="grid grid-cols-4 gap-2">
          {([['d','Ngày'],['h','Giờ'],['m','Phút'],['s','Giây']] as const).map(([k, l]) => (
            <div key={k} className="text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: tpl.textColor }}>{String(rem[k]).padStart(2,'0')}</div>
              <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: tpl.subtextColor }}>{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center font-semibold" style={{ color: tpl.subtextColor }}>Sự kiện đã bắt đầu!</p>
      )}
    </div>
  )
}

// ─── GitHub stats block ───────────────────────────────────────────────────────
function GithubBlock({ link, tpl }: { link: BioLink; tpl: TemplateStyle }) {
  const [gh, setGh] = useState<{
    name: string; login: string; bio: string | null;
    avatar_url: string; followers: number; public_repos: number
  } | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const raw = link.url ?? ''
    const username = raw.replace(/^https?:\/\/github\.com\//, '').replace(/\/.*$/, '').trim()
    if (!username) { setErr(true); return }
    fetch(`https://api.github.com/users/${username}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setGh)
      .catch(() => setErr(true))
  }, [link.url])

  if (err) return (
    <a href={link.url} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      <SiGithub size={20} style={{ color: tpl.textColor }} />
      <span className="text-sm font-semibold" style={{ color: tpl.textColor }}>{link.title || 'GitHub Profile'}</span>
    </a>
  )

  if (!gh) return (
    <div className="h-28 rounded-2xl animate-pulse" style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }} />
  )

  return (
    <div className="p-4 rounded-2xl space-y-3" style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
      <div className="flex items-center gap-3">
        <img src={gh.avatar_url} alt="" className="w-12 h-12 rounded-full flex-shrink-0 object-cover" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: tpl.textColor }}>{gh.name || gh.login}</p>
          <p className="text-xs" style={{ color: tpl.subtextColor }}>@{gh.login}</p>
        </div>
        <SiGithub size={18} style={{ color: tpl.subtextColor, flexShrink: 0 }} />
      </div>
      {gh.bio && <p className="text-xs leading-relaxed" style={{ color: tpl.subtextColor }}>{gh.bio}</p>}
      <div className="flex gap-5">
        <div>
          <p className="text-sm font-bold" style={{ color: tpl.textColor }}>{gh.followers.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: tpl.subtextColor }}>followers</p>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: tpl.textColor }}>{gh.public_repos}</p>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: tpl.subtextColor }}>repos</p>
        </div>
      </div>
      <a href={`https://github.com/${gh.login}`} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all hover:scale-[1.02]"
        style={{ background: tpl.btnBg, border: `1px solid ${tpl.btnBorder}`, color: tpl.btnText }}>
        <SiGithub size={13} /> View on GitHub
      </a>
    </div>
  )
}

function BlockOrLink({ link, tpl, settings, userId, align }: {
  link: BioLink; tpl: TemplateStyle; settings: CustomSettings; userId: string; align?: 'center' | 'left'
}) {
  switch (link.block_type) {
    case 'heading':   return <HeadingBlock link={link} tpl={tpl} />
    case 'youtube':   return <YoutubeBlock link={link} tpl={tpl} />
    case 'spotify':   return <SpotifyBlock link={link} tpl={tpl} />
    case 'instagram':
    case 'tiktok':    return <SocialPostBlock link={link} tpl={tpl} />
    case 'text':      return <TextBlock link={link} tpl={tpl} />
    case 'image':     return <ImageBlock link={link} tpl={tpl} settings={settings} />
    case 'countdown': return <CountdownBlock link={link} tpl={tpl} />
    case 'github':    return <GithubBlock link={link} tpl={tpl} />
    default:          return <LinkBtn link={link} tpl={tpl} settings={settings} userId={userId} align={align} />
  }
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ text, tpl }: { text: string; tpl: TemplateStyle }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: tpl.subtextColor, opacity: 0.7 }}>{text}</p>
  )
}

// ─── Products grid ────────────────────────────────────────────────────────────
function ProductsGrid({ products, tpl, settings }: { products: Product[]; tpl: TemplateStyle; settings: CustomSettings }) {
  if (!products.length) return null
  const cols = settings.productCols
  const isCircle = settings.productImgRatio === 'circle'
  const aspectRatio = settings.productImgRatio === 'portrait' ? '2/3'
    : settings.productImgRatio === 'wide' ? '16/9'
    : '1/1'

  return (
    <div>
      <Label text="Products" tpl={tpl} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
        {products.map(p => (
          <a key={p.id} href={p.affiliate_url} target="_blank" rel="noreferrer"
            className="transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}`, borderRadius: settings.productRounded + 'px', overflow: 'hidden', display: 'block' }}>
            {isCircle ? (
              <div style={{ padding: '8px', aspectRatio: '1/1', background: `${tpl.cardBorder}18` }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: `${tpl.cardBorder}30`, opacity: 0.4 }}><ShoppingBag size={22} /></div>
                }
              </div>
            ) : (
              p.image_url
                ? <img src={p.image_url} alt={p.name} style={{ width: '100%', aspectRatio, objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', aspectRatio, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${tpl.cardBorder}30`, opacity: 0.4 }}><ShoppingBag size={28} /></div>
            )}
            <div className="p-3">
              <p className="text-xs font-semibold truncate" style={{ color: tpl.textColor }}>{p.name}</p>
              {settings.productShowPrice && p.price && (
                <p className="text-xs mt-0.5 font-semibold" style={{ color: tpl.subtextColor }}>{p.price}</p>
              )}
              {settings.productShowDesc && p.description && (
                <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: tpl.subtextColor }}>{p.description}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Albums row ───────────────────────────────────────────────────────────────
function AlbumRow({ albums, tpl, onOpen }: {
  albums: PhotoAlbum[]; tpl: TemplateStyle; onOpen: (a: PhotoAlbum) => void
}) {
  if (!albums.length) return null
  return (
    <div>
      <Label text="Gallery" tpl={tpl} />
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}>
        {albums.map(album => (
          <div key={album.id} onClick={() => onOpen(album)}
            className="flex-shrink-0 w-[130px] snap-start cursor-pointer group">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden relative bg-gray-900">
              {album.cover_url
                ? <img src={album.cover_url} alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center opacity-20"><ImageOff size={28} /></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-2.5">
                <p className="text-white text-[11px] font-bold drop-shadow leading-tight line-clamp-2">{album.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FooterTag({ tpl }: { tpl: TemplateStyle }) {
  return (
    <a href="/" className="block text-center text-xs pt-6 pb-4 hover:opacity-60 transition-opacity"
      style={{ color: tpl.subtextColor, opacity: 0.4 }}>
      Made with DONLY ✦
    </a>
  )
}

// ─── Social icons bar ─────────────────────────────────────────────────────────
function SocialBar({ settings, tpl }: { settings: CustomSettings; tpl: TemplateStyle }) {
  const icons = settings.socialBar ?? []
  if (!icons.length) return null
  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap py-1">
      {icons.map((s, i) => {
        const Icon = PLATFORM_ICONS[s.platform] ?? Link2
        const color = PLATFORM_COLORS[s.platform] ?? tpl.subtextColor
        return (
          <a key={i} href={s.url} target="_blank" rel="noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}`, color }}>
            <Icon size={17} />
          </a>
        )
      })}
    </div>
  )
}

// ─── Announcement banner ──────────────────────────────────────────────────────
function AnnouncementBanner({ settings }: { settings: CustomSettings }) {
  const text  = settings.announcement
  const url   = settings.announcementUrl
  const color = settings.announcementColor || '#333A2F'
  const [dismissed, setDismissed] = useState(false)
  if (!text || dismissed) return null

  const inner = (
    <>
      <span className="flex-1 text-xs font-semibold text-center">{text}</span>
      {url && <ChevronRight size={13} className="flex-shrink-0 opacity-70" />}
      <button onClick={e => { e.preventDefault(); e.stopPropagation(); setDismissed(true) }}
        className="flex-shrink-0 ml-1 opacity-60 hover:opacity-100 transition-opacity">
        <XIcon size={13} />
      </button>
    </>
  )

  return url ? (
    <a href={url} target="_blank" rel="noreferrer"
      className="flex items-center gap-2 px-4 py-2.5 text-white z-50 sticky top-0 hover:opacity-90 transition-opacity"
      style={{ background: color }}>
      {inner}
    </a>
  ) : (
    <div className="flex items-center gap-2 px-4 py-2.5 text-white z-50 sticky top-0" style={{ background: color }}>
      {inner}
    </div>
  )
}

// ─── Email capture block ──────────────────────────────────────────────────────
function EmailCaptureBlock({ profile, tpl, dark }: { profile: Profile; tpl: TemplateStyle; dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    const { error } = await supabase.from('email_subscribers').insert({
      user_id: profile.id,
      email: email.trim().toLowerCase(),
    })
    setStatus(error ? 'error' : 'done')
    if (error) setTimeout(() => setStatus('idle'), 3000)
  }

  const cardBg = dark ? 'rgba(255,255,255,0.1)' : tpl.cardBg
  const cardBorder = dark ? 'rgba(255,255,255,0.2)' : tpl.cardBorder
  const textColor = dark ? '#fff' : tpl.textColor
  const subColor = dark ? 'rgba(255,255,255,0.65)' : tpl.subtextColor
  const title = profile.email_capture_title || 'Stay in the loop'

  if (status === 'done') return (
    <div className="text-center py-4 px-4 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <p className="text-sm font-semibold" style={{ color: textColor }}>✓ You're subscribed!</p>
      <p className="text-xs mt-0.5" style={{ color: subColor }}>Thanks for joining.</p>
    </div>
  )

  return (
    <div className="px-4 py-4 rounded-2xl space-y-3" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <p className="text-sm font-semibold" style={{ color: textColor }}>{title}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com" required
          className="flex-1 px-3 py-2 text-sm rounded-xl border bg-transparent focus:outline-none"
          style={{ borderColor: cardBorder, color: textColor }} />
        <button type="submit" disabled={status === 'loading'}
          className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#333A2F' }}>
          {status === 'loading' ? '…' : 'Join'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500">Something went wrong. Try again.</p>}
    </div>
  )
}

// ─── Music player widget ──────────────────────────────────────────────────────
function MusicPlayerWidget({ settings, tpl }: { settings: CustomSettings; tpl: TemplateStyle }) {
  const url = settings.musicWidgetUrl
  if (!url) return null
  const spotifyEmbed = getSpotifyEmbed(url)
  if (spotifyEmbed) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tpl.cardBorder}` }}>
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"
          style={{ background: tpl.cardBg, color: tpl.subtextColor }}>
          <Music size={12} /> Music
        </div>
        <iframe src={spotifyEmbed} width="100%" height="152" frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy" style={{ display: 'block' }} />
      </div>
    )
  }
  const ytId = getYoutubeId(url)
  if (ytId) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tpl.cardBorder}` }}>
        <iframe src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0`}
          width="100%" height="200" frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen loading="lazy" style={{ display: 'block' }} />
      </div>
    )
  }
  return null
}

// ─── Testimonials block ───────────────────────────────────────────────────────
function TestimonialsBlock({ profile, tpl }: { profile: Profile; tpl: TemplateStyle }) {
  const [items, setItems] = useState<Array<{
    id: string; author_name: string; author_role: string | null; content: string; rating: number
  }>>([])

  useEffect(() => {
    supabase.from('testimonials').select('id,author_name,author_role,content,rating')
      .eq('user_id', profile.id).eq('is_active', true).order('sort_order')
      .then(({ data }) => setItems(data ?? []))
  }, [profile.id])

  if (items.length === 0) return null

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tpl.subtextColor }}>
        Reviews
      </p>
      {items.map(t => (
        <div key={t.id} className="p-4 rounded-2xl space-y-2"
          style={{ background: tpl.cardBg, border: `1px solid ${tpl.cardBorder}` }}>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
              <Star key={n} size={11} fill={n <= t.rating ? '#f59e0b' : 'none'}
                style={{ color: n <= t.rating ? '#f59e0b' : tpl.subtextColor + '40' }} />
            ))}
          </div>
          <p className="text-sm leading-relaxed italic" style={{ color: tpl.textColor }}>"{t.content}"</p>
          <div>
            <p className="text-xs font-semibold" style={{ color: tpl.textColor }}>{t.author_name}</p>
            {t.author_role && <p className="text-[11px]" style={{ color: tpl.subtextColor }}>{t.author_role}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Contact form block ───────────────────────────────────────────────────────
function ContactFormBlock({ profile, tpl, dark }: { profile: Profile; tpl: TemplateStyle; dark?: boolean }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [msg, setMsg]         = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    setStatus('sending')
    const { error } = await supabase.from('contact_messages').insert({
      user_id: profile.id,
      sender_name: name.trim(),
      sender_email: email.trim() || null,
      message: msg.trim(),
    })
    if (error) { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); return }
    setStatus('done')
    setName(''); setEmail(''); setMsg('')
  }

  const cardBg    = dark ? 'rgba(255,255,255,0.08)' : tpl.cardBg
  const cardBord  = dark ? 'rgba(255,255,255,0.15)' : tpl.cardBorder
  const textColor = dark ? '#fff' : tpl.textColor
  const subColor  = dark ? 'rgba(255,255,255,0.6)' : tpl.subtextColor
  const inputSt: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.06)' : tpl.cardBg,
    border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : tpl.cardBorder}`,
    color: textColor,
  }

  if (status === 'done') return (
    <div className="text-center py-5 px-4 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBord}` }}>
      <p className="text-sm font-semibold" style={{ color: textColor }}>✓ Đã gửi!</p>
      <p className="text-xs mt-0.5" style={{ color: subColor }}>Cảm ơn bạn đã liên hệ.</p>
    </div>
  )

  return (
    <div className="p-4 rounded-2xl space-y-3" style={{ background: cardBg, border: `1px solid ${cardBord}` }}>
      <div className="flex items-center gap-2">
        <MessageSquare size={14} style={{ color: subColor }} />
        <p className="text-sm font-semibold" style={{ color: textColor }}>Gửi tin nhắn</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input value={name} onChange={e => setName(e.target.value)} required
          placeholder="Tên của bạn *"
          className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none placeholder-gray-400"
          style={inputSt} />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email"
          placeholder="Email (tuỳ chọn)"
          className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none placeholder-gray-400"
          style={inputSt} />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} required
          placeholder="Tin nhắn của bạn…" rows={3}
          className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none resize-none placeholder-gray-400"
          style={inputSt} />
        <button type="submit" disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#333A2F' }}>
          <Send size={13} />
          {status === 'sending' ? 'Đang gửi…' : 'Gửi'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500">Có lỗi xảy ra. Vui lòng thử lại.</p>}
    </div>
  )
}

// ─── Extras section (music + testimonials + contact + tip jar + booking + email + vcard) ──
function ExtrasSection({ profile, tpl, dark, settings }: { profile: Profile; tpl: TemplateStyle; dark?: boolean; settings?: CustomSettings }) {
  const hasTip        = !!profile.tip_url
  const hasBooking    = !!profile.booking_url
  const hasEmail      = !!profile.email_capture_enabled
  const hasVcard      = !!settings?.vcardEnabled
  const hasMusic      = !!settings?.musicWidgetUrl
  const hasContact    = !!settings?.contactFormEnabled
  const hasTestimonials = !!settings?.testimonialsEnabled
  if (!hasTip && !hasBooking && !hasEmail && !hasVcard && !hasMusic && !hasContact && !hasTestimonials) return null

  const btnStyle: React.CSSProperties = dark
    ? { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }
    : { background: tpl.btnBg, border: `1px solid ${tpl.btnBorder}`, color: tpl.btnText }

  return (
    <div className="space-y-2.5">
      {hasMusic  && settings && <MusicPlayerWidget settings={settings} tpl={tpl} />}
      {hasTestimonials && <TestimonialsBlock profile={profile} tpl={tpl} />}
      {(hasTip || hasBooking) && (
        <div className="flex gap-2.5">
          {hasTip && (
            <a href={profile.tip_url!} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={btnStyle}>
              <Heart size={14} /> Send a Tip
            </a>
          )}
          {hasBooking && (
            <a href={profile.booking_url!} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={btnStyle}>
              <CalendarDays size={14} /> Book a Meeting
            </a>
          )}
        </div>
      )}
      {hasEmail  && <EmailCaptureBlock profile={profile} tpl={tpl} dark={dark} />}
      {hasVcard  && settings && <VCardBtn profile={profile} tpl={tpl} settings={settings} />}
      {hasContact && <ContactFormBlock profile={profile} tpl={tpl} dark={dark} />}
    </div>
  )
}

// ─── VCard download button ────────────────────────────────────────────────────
function VCardBtn({ profile, tpl, settings }: { profile: Profile; tpl: TemplateStyle; settings: CustomSettings }) {
  if (!settings.vcardEnabled) return null

  const download = () => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.display_name || profile.username || ''}`,
      `NICKNAME:${profile.username || ''}`,
      profile.job_title ? `TITLE:${profile.job_title}` : '',
      profile.bio ? `NOTE:${profile.bio.replace(/\n/g, '\\n')}` : '',
      `URL;type=HOMEPAGE:${window.location.href}`,
      profile.avatar_url ? `PHOTO;VALUE=URL:${profile.avatar_url}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\r\n')

    const blob = new Blob([lines], { type: 'text/vcard' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${profile.username || 'contact'}.vcf`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const btnStyle: React.CSSProperties = {
    background: tpl.btnBg,
    border: `1px solid ${tpl.btnBorder}`,
    color: tpl.btnText,
  }

  return (
    <button
      onClick={download}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={btnStyle}
    >
      <Copy size={14} />
      Lưu liên hệ
    </button>
  )
}

// ─── Share sheet ───────────────────────────────────────────────────────────────
function ShareModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const url = window.location.href
  const title = profile.display_name || ('@' + profile.username)
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const enc = encodeURIComponent
  const SHARES = [
    { label: 'Facebook',   color: '#1877F2',  Icon: SiFacebook,  href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: 'X / Twitter',color: '#000000',  Icon: SiX,         href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { label: 'WhatsApp',   color: '#25D366',  Icon: SiWhatsapp,  href: `https://wa.me/?text=${enc(title + '\n' + url)}` },
    { label: 'Telegram',   color: '#2AABEE',  Icon: SiTelegram,  href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}` },
    { label: 'Messenger',  color: '#0084FF',  Icon: SiMessenger, href: `https://www.facebook.com/dialog/send?link=${enc(url)}&redirect_uri=${enc(url)}` },
    { label: 'Zalo',       color: '#0068FF',  Icon: SiZalo,      href: `https://zalo.me/share?url=${enc(url)}` },
    { label: 'Pinterest',  color: '#E60023',  Icon: SiPinterest, href: `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}` },
    { label: 'Reddit',     color: '#FF4500',  Icon: SiReddit,    href: `https://reddit.com/submit?url=${enc(url)}&title=${enc(title)}` },
    { label: 'TikTok',     color: '#010101',  Icon: SiTiktok,    href: `https://www.tiktok.com/share?url=${enc(url)}` },
    { label: 'Instagram',  color: '#E1306C',  Icon: SiInstagram, href: `https://www.instagram.com/`, note: 'Copy link first' },
    { label: 'Email',      color: '#6366F1',  Icon: Mail,        href: `mailto:?subject=${enc(title)}&body=${enc('Check out this page: ' + url)}` },
  ]

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center" style={{ zIndex: 300 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-[400px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'shareSlideUp .28s cubic-bezier(.22,.68,0,1.2) both' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 md:hidden" />
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Share this page</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
            <XIcon size={15} />
          </button>
        </div>
        <div className="px-4 pb-2">
          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {SHARES.map(s => (
              <a key={s.label} href={s.href} target={s.label === 'Email' ? '_self' : '_blank'} rel="noreferrer"
                className="flex flex-col items-center gap-1.5 group" title={(s as { note?: string }).note}>
                <div className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: s.color }}>
                  <s.Icon size={24} color="white" />
                </div>
                <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">{s.label}</span>
                {(s as { note?: string }).note && <span className="text-[9px] text-gray-400 text-center leading-none">{(s as { note?: string }).note}</span>}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-5 mt-4 mb-3 border-t border-gray-100" />
        <div className="px-5 pb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Copy link</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5">
            <Link2 size={13} className="text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-xs text-gray-600 truncate font-mono select-all">{url}</span>
            <button onClick={copyLink}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${copied ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes shareSlideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  )
}

function ShareButton({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-50 w-9 h-9 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:bg-black/35 hover:text-white transition-all shadow-sm"
        aria-label="Share page">
        <Share2 size={15} />
      </button>
      {open && <ShareModal profile={profile} onClose={() => setOpen(false)} />}
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// LAYOUTS
// ═════════════════════════════════════════════════════════════════════════════

function CenteredLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  return (
    <div className="max-w-sm mx-auto px-4 py-12 space-y-5">
      <div className="text-center space-y-3 pb-2">
        <div className="flex justify-center">
          <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        </div>
        <div>
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm mt-0.5" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-sm font-medium mt-1" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-sm mt-3 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        </div>
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {links.length > 0 && (
        <div className="space-y-2.5">
          {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

function LeftLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-5">
      <div className="flex items-center gap-4 pb-2">
        <AvatarImg profile={profile} tpl={tpl} size="md" settings={settings} />
        <div className="min-w-0">
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-xs font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        </div>
      </div>
      {links.length > 0 && (
        <div className="space-y-2.5">
          {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

function HeroLayout({ profile, links, products, albums, tpl, pageBg, settings, onAlbum }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      <div className="relative w-full h-[52vh] overflow-hidden">
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover object-top" />
          : <div className="w-full h-full" style={{ background: tpl.pageBg }} />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <h1 style={getNameStyle(settings, tpl, '#fff')}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-white/70 text-sm mt-0.5">@{profile.username}</p>
          {profile.job_title && <p className="text-white/80 text-sm font-medium mt-0.5">{profile.job_title}</p>}
        </div>
      </div>
      <div className="max-w-sm mx-auto px-4 py-6 space-y-5">
        {profile.bio && <p className="text-sm leading-relaxed text-center" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={tpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
        <FooterTag tpl={tpl} />
      </div>
    </div>
  )
}

function GridLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  // Group items: consecutive regular links go into 2-col grid, blocks render full-width
  type Group = { type: 'block'; link: BioLink } | { type: 'grid'; links: BioLink[] }
  const groups: Group[] = []
  for (const l of links) {
    const isBlock = l.block_type && l.block_type !== 'link'
    if (isBlock) {
      groups.push({ type: 'block', link: l })
    } else {
      const last = groups[groups.length - 1]
      if (last?.type === 'grid') last.links.push(l)
      else groups.push({ type: 'grid', links: [l] })
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-12 space-y-5">
      <div className="text-center space-y-3 pb-2">
        <div className="flex justify-center">
          <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        </div>
        <div>
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm mt-0.5" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-sm font-medium mt-1" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-sm mt-3 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        </div>
      </div>
      {groups.length > 0 && (
        <div className="space-y-2.5">
          {groups.map((g, i) => {
            if (g.type === 'block') {
              return <BlockOrLink key={i} link={g.link} tpl={tpl} settings={settings} userId={profile.id} />
            }
            const gLinks = g.links
            const isOdd = gLinks.length % 2 !== 0
            return (
              <div key={i} className="space-y-2.5">
                {isOdd && <LinkBtn link={gLinks[0]} tpl={tpl} align="center" settings={settings} userId={profile.id} />}
                {gLinks.length > (isOdd ? 1 : 0) && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {(isOdd ? gLinks.slice(1) : gLinks).map(l => (
                      <GridLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

function CardLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  return (
    <div className="max-w-sm mx-auto px-4 py-0 space-y-5 pb-12">
      <div className="relative mb-14">
        <div className="h-44 w-full rounded-b-3xl overflow-hidden" style={{ background: tpl.pageBg }}>
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover object-top opacity-60" />
          )}
          <div className="absolute inset-0 rounded-b-3xl"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5))' }} />
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="p-1 rounded-full" style={{ background: tpl.pageBg }}>
            <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
          </div>
        </div>
      </div>
      <div className="text-center space-y-2 pt-2">
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm leading-relaxed pt-1" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
      </div>
      {links.length > 0 && (
        <div className="space-y-2.5 pt-2">
          {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

function SplitLayout({ profile, links, products, albums, tpl, pageBg, settings, onAlbum }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: pageBg }}>
      <div className="md:w-2/5 flex flex-col items-center justify-center gap-4 px-6 py-10 md:border-r md:min-h-full"
        style={{ borderColor: tpl.cardBorder, backdropFilter: 'blur(8px)', background: tpl.cardBg }}>
        <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        <div className="text-center space-y-1.5">
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-xs font-medium mt-0.5 max-w-[200px]" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-xs leading-relaxed pt-1 max-w-[200px]" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        </div>
      </div>
      <div className="flex-1 px-6 py-10 max-w-lg space-y-5">
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={tpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
        <FooterTag tpl={tpl} />
      </div>
    </div>
  )
}

function MagazineLayout({ profile, links, products, albums, tpl, bgImage, settings, onAlbum }: LayoutProps) {
  const portraitSrc = bgImage ?? profile.avatar_url
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative md:w-[42%] flex-shrink-0 overflow-hidden" style={{ minHeight: '55vw' }}>
        {portraitSrc
          ? <img src={portraitSrc} alt="" className="w-full h-full object-cover object-center" style={{ minHeight: '50vw' }} />
          : <div className="w-full h-full min-h-[50vw]" style={{ background: tpl.pageBg }} />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
        <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8">
          <div className="w-12 h-0.5 bg-white/60 mb-3" />
          <h1 style={getNameStyle(settings, tpl, '#fff')}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-white/65 text-sm mt-1">@{profile.username}</p>
          {profile.job_title && <p className="text-white/80 text-sm font-medium mt-0.5">{profile.job_title}</p>}
        </div>
      </div>
      <div className="flex-1 px-6 py-10 space-y-6 max-w-lg self-start" style={{ background: tpl.pageBg }}>
        {profile.bio && (
          <p className="text-sm leading-relaxed border-l-2 pl-4" style={{ color: tpl.subtextColor, borderColor: tpl.cardBorder }}>
            {profile.bio}
          </p>
        )}
        {links.length > 0 && (
          <div className="space-y-2.5">
            <Label text="Links" tpl={tpl} />
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={tpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
        <FooterTag tpl={tpl} />
      </div>
    </div>
  )
}

function OverlayLayout({ profile, links, products, albums, tpl, bgImage, pageBg, settings, onAlbum }: LayoutProps) {
  const darkTpl: TemplateStyle = {
    ...tpl,
    cardBg: 'rgba(255,255,255,0.1)',
    cardBorder: 'rgba(255,255,255,0.2)',
    textColor: '#fff',
    subtextColor: 'rgba(255,255,255,0.7)',
    btnBg: 'rgba(255,255,255,0.15)',
    btnBorder: 'rgba(255,255,255,0.25)',
    btnText: '#fff',
  }
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        {bgImage
          ? <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          : profile.avatar_url
            ? <img src={profile.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0" style={{ background: pageBg }} />
        }
        <div className="absolute inset-0 bg-black/52" />
      </div>
      <div className="max-w-sm mx-auto px-4 py-12 space-y-5 relative z-10">
        <div className="text-center space-y-3 pb-2">
          <div className="flex justify-center">
            <div className="ring-4 ring-white/20 rounded-full">
              <AvatarImg profile={profile} tpl={{ ...tpl, cardBorder: 'rgba(255,255,255,0.3)' }} size="lg" settings={settings} />
            </div>
          </div>
          <div>
            <h1 style={getNameStyle(settings, tpl, '#fff')}>{profile.display_name || `@${profile.username}`}</h1>
            <p className="text-white/60 text-sm mt-0.5">@{profile.username}</p>
            {profile.job_title && <p className="text-white/80 text-sm font-medium mt-0.5">{profile.job_title}</p>}
            {profile.bio && <p className="text-sm mt-3 leading-relaxed text-white/75">{profile.bio}</p>}
          </div>
        </div>
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={darkTpl} settings={settings} userId={profile.id} align="center" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={darkTpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} dark settings={settings} />
        <p className="text-center text-xs pt-6 pb-4 text-white/30">Made with DONLY ✦</p>
      </div>
    </div>
  )
}

function CompactLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const bStyle = tpl.btnStyle ?? 'solid'
  return (
    <div className="max-w-sm mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center gap-3 pb-1">
        <AvatarImg profile={profile} tpl={tpl} size="sm" settings={settings} />
        <div className="min-w-0">
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-xs" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-xs font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        </div>
      </div>
      {profile.bio && <p className="text-xs leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
      {links.length > 0 && (
        <div className="space-y-1.5">
          {links.map(l => {
            const isBlock = l.block_type && l.block_type !== 'link'
            if (isBlock) return <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />

            const Icon      = PLATFORM_ICONS[l.platform ?? 'custom'] ?? Link2
            const platColor = PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnText
            const bg     = settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
            const border  = settings.linkBorder ? (bStyle === 'vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
            const color   = settings.linkBgCustom ? undefined : (bStyle === 'vivid' ? '#fff' : tpl.btnText)
            return (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                onClick={() => trackClick(l.id, profile.id)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-md"
                style={{ background: bg, border, color, borderRadius: settings.linkRadius + 'px', backdropFilter: 'blur(8px)' }}>
                {settings.linkIconPos !== 'none' && (
                  <span style={bStyle === 'icon-colors' && !settings.linkBgCustom ? { color: platColor } : {}}>
                    <Icon size={15} />
                  </span>
                )}
                <span className="flex-1 text-left">{l.title}</span>
                <ExternalLink size={10} style={{ opacity: 0.3 }} />
              </a>
            )
          })}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Banner layout ─────────────────────────────────────────────────────────────
function BannerLayout({ profile, links, products, albums, tpl, bgImage, settings, onAlbum }: LayoutProps) {
  const bannerSrc = bgImage ?? profile.avatar_url
  return (
    <div style={{ background: tpl.pageBg }}>
      <div className="relative h-36 overflow-hidden">
        {bannerSrc
          ? <img src={bannerSrc} alt="" className="w-full h-full object-cover object-top" />
          : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${tpl.btnBg}cc, ${tpl.cardBg})` }} />
        }
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>
      <div className="relative px-5 pb-3">
        <div className="absolute -top-10 left-5 p-0.5 rounded-full" style={{ background: tpl.pageBg }}>
          <AvatarImg profile={profile} tpl={tpl} size="md" settings={settings} />
        </div>
        <div className="pt-14">
          <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm mt-0.5" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
          {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
          <SocialBar settings={settings} tpl={tpl} />
        </div>
      </div>
      <div className="px-5 pb-10 space-y-5">
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={tpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
        <FooterTag tpl={tpl} />
      </div>
    </div>
  )
}

// ─── Bubble layout ─────────────────────────────────────────────────────────────
function BubbleLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const bStyle = tpl.btnStyle ?? 'solid'
  const regularLinks = links.filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.block_type && l.block_type !== 'link')
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        </div>
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-1 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {regularLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {regularLinks.map(l => {
            const Icon = PLATFORM_ICONS[l.platform ?? 'custom'] ?? Link2
            const platColor = PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnText
            const bg = settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
            const border = settings.linkBorder ? (bStyle === 'vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
            const color = settings.linkBgCustom ? undefined : (bStyle === 'vivid' ? '#fff' : tpl.btnText)
            return (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                onClick={() => trackClick(l.id, profile.id)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: bg, border, color, borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                {settings.linkIconPos !== 'none' && (
                  <span style={bStyle === 'icon-colors' && !settings.linkBgCustom ? { color: platColor } : {}}>
                    <Icon size={14} />
                  </span>
                )}
                {l.title}
              </a>
            )
          })}
        </div>
      )}
      {blocks.length > 0 && (
        <div className="space-y-2.5">
          {blocks.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Float layout ──────────────────────────────────────────────────────────────
function FloatLayout({ profile, links, products, albums, tpl, bgImage, pageBg, settings, onAlbum }: LayoutProps) {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        {bgImage
          ? <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          : profile.avatar_url
            ? <img src={profile.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0" style={{ background: pageBg }} />
        }
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(28px)', background: 'rgba(0,0,0,0.28)' }} />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: tpl.pageBg, border: `1px solid ${tpl.cardBorder}` }}>
          <div className="px-6 py-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
              </div>
              <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
              <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
              {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
              {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
              <SocialBar settings={settings} tpl={tpl} />
            </div>
            {links.length > 0 && (
              <div className="space-y-2.5">
                {links.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
              </div>
            )}
            <ProductsGrid products={products} tpl={tpl} settings={settings} />
            <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
            <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
            <FooterTag tpl={tpl} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Columns layout (PRO) ──────────────────────────────────────────────────────
function ColumnsLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const regularLinks = links.filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.block_type && l.block_type !== 'link')
  const leftLinks  = regularLinks.filter((_, i) => i % 2 === 0)
  const rightLinks = regularLinks.filter((_, i) => i % 2 !== 0)
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        </div>
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
      </div>
      {regularLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            {leftLinks.map(l => <LinkBtn key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
          </div>
          <div className="space-y-2">
            {rightLinks.map(l => <LinkBtn key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
          </div>
        </div>
      )}
      {blocks.length > 0 && (
        <div className="space-y-2.5">
          {blocks.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Spotlight layout (PRO) ────────────────────────────────────────────────────
function SpotlightLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const featured = links.find(l => l.is_featured && (!l.block_type || l.block_type === 'link'))
  const hero = featured ?? links.find(l => !l.block_type || l.block_type === 'link')
  const rest = hero ? links.filter(l => l.id !== hero.id) : links
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} />
        </div>
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
      </div>
      {hero && (
        <a href={hero.url} target="_blank" rel="noreferrer"
          onClick={() => trackClick(hero.id, profile.id)}
          className="block rounded-3xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
          style={{ background: tpl.btnBg, border: `1px solid ${tpl.btnBorder}` }}>
          {hero.thumbnail_url
            ? <img src={hero.thumbnail_url} alt="" className="w-full h-44 object-cover" />
            : <div className="h-16 w-full opacity-15 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg,${tpl.cardBg},${tpl.pageBg})` }}>
                <Link2 size={28} />
              </div>
          }
          <div className="px-5 py-4">
            {hero.is_featured && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">
                <Star size={11} fill="currentColor" /> Featured
              </div>
            )}
            <p className="text-base font-bold leading-snug" style={{ color: tpl.btnText }}>{hero.title}</p>
            <p className="text-xs mt-1 truncate opacity-50" style={{ color: tpl.btnText }}>{hero.url}</p>
          </div>
        </a>
      )}
      {rest.length > 0 && (
        <div className="space-y-2.5">
          {rest.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="center" />)}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Bento layout ──────────────────────────────────────────────────────────────
function BentoLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const bStyle = tpl.btnStyle ?? 'solid'
  const regularLinks = links.filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.block_type && l.block_type !== 'link')
  const hero = regularLinks.find(l => l.is_featured) ?? regularLinks[0]
  const rest2 = hero ? regularLinks.filter(l => l.id !== hero.id) : regularLinks.slice(1)
  const getBg = (l: BioLink) => settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
  const getBorder = (_l: BioLink) => settings.linkBorder ? `1px solid ${tpl.btnBorder}` : 'none'
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center"><AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} /></div>
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {regularLinks.length > 0 && (
        <div className="space-y-2">
          {hero && (
            <a href={hero.url} target="_blank" rel="noreferrer" onClick={() => trackClick(hero.id, profile.id)}
              className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg"
              style={{ background: getBg(hero), border: getBorder(hero) }}>
              {hero.thumbnail_url
                ? <img src={hero.thumbnail_url} alt="" className="w-full h-36 object-cover" />
                : <div className="h-14 flex items-center justify-center opacity-10"><Link2 size={28} /></div>
              }
              <div className="px-4 py-3 flex items-center gap-2">
                <span className="flex-1 font-bold text-sm" style={{ color: tpl.btnText }}>{hero.title}</span>
                {hero.is_featured && <Star size={13} fill="currentColor" className="text-amber-400 flex-shrink-0" />}
                <ExternalLink size={12} style={{ opacity: 0.4, color: tpl.btnText, flexShrink: 0 }} />
              </div>
            </a>
          )}
          {rest2.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {rest2.map(l => <GridLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />)}
            </div>
          )}
        </div>
      )}
      {blocks.length > 0 && (
        <div className="space-y-2.5">{blocks.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />)}</div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Timeline layout ───────────────────────────────────────────────────────────
function TimelineLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <AvatarImg profile={profile} tpl={tpl} size="sm" settings={settings} />
        <h1 className="mt-3" style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-1.5 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {links.length > 0 && (
        <div className="relative pl-7">
          <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: tpl.cardBorder }} />
          <div className="space-y-4">
            {links.map(l => {
              const isBlock = l.block_type && l.block_type !== 'link'
              return (
                <div key={l.id} className="relative">
                  <div className="absolute -left-[17px] top-3.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: tpl.pageBg, borderColor: l.is_featured ? '#f59e0b' : tpl.btnBg }} />
                  {isBlock
                    ? <BlockOrLink link={l} tpl={tpl} settings={settings} userId={profile.id} />
                    : <LinkBtn link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />
                  }
                </div>
              )
            })}
          </div>
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Strip layout ──────────────────────────────────────────────────────────────
function StripLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  return (
    <div className="max-w-sm mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <AvatarImg profile={profile} tpl={tpl} size="sm" settings={settings} />
        <h1 className="mt-3" style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {links.length > 0 && (
        <div>
          {links.map((l, idx) => {
            const isBlock = l.block_type && l.block_type !== 'link'
            const divider = idx > 0
              ? <div className="w-full h-px opacity-20" style={{ background: tpl.cardBorder }} />
              : null
            if (isBlock) return (
              <div key={l.id}>
                {divider}
                <div className="py-4">
                  <BlockOrLink link={l} tpl={tpl} settings={settings} userId={profile.id} />
                </div>
              </div>
            )
            return (
              <div key={l.id}>
                {divider}
                <a href={l.url} target="_blank" rel="noreferrer"
                  onClick={() => trackClick(l.id, profile.id)}
                  className="flex items-center justify-between py-4 group transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    {l.is_featured && <Star size={12} fill="currentColor" className="text-amber-400 flex-shrink-0" />}
                    <span className="text-sm font-semibold truncate group-hover:opacity-60 transition-opacity"
                      style={{ color: tpl.textColor }}>{l.title}</span>
                  </div>
                  <ExternalLink size={13} className="flex-shrink-0 ml-3 opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ color: tpl.subtextColor }} />
                </a>
              </div>
            )
          })}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Resume layout ─────────────────────────────────────────────────────────────
function ResumeLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const regularLinks = links.filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.block_type && l.block_type !== 'link')
  return (
    <div className="min-h-screen" style={{ background: tpl.pageBg }}>
      <div className="px-6 py-8" style={{ background: tpl.cardBg, borderBottom: `1px solid ${tpl.cardBorder}` }}>
        <div className="flex items-start gap-4 max-w-md mx-auto">
          <AvatarImg profile={profile} tpl={tpl} size="md" settings={settings} />
          <div className="flex-1 min-w-0">
            <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
            <p className="text-sm mt-0.5" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
            {profile.job_title && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{ background: tpl.btnBg, color: tpl.btnText }}>
                <Briefcase size={11} /> {profile.job_title}
              </div>
            )}
            {profile.bio && <p className="text-xs mt-2.5 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
            <div className="mt-3"><SocialBar settings={settings} tpl={tpl} /></div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6 max-w-md mx-auto">
        {regularLinks.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: tpl.subtextColor, opacity: 0.6 }}>Links</p>
            <div className="space-y-2">
              {regularLinks.map(l => <LinkBtn key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} align="left" />)}
            </div>
          </div>
        )}
        {blocks.length > 0 && (
          <div className="space-y-2.5">{blocks.map(l => <BlockOrLink key={l.id} link={l} tpl={tpl} settings={settings} userId={profile.id} />)}</div>
        )}
        <ProductsGrid products={products} tpl={tpl} settings={settings} />
        <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
        <FooterTag tpl={tpl} />
      </div>
    </div>
  )
}

// ─── Masonry layout (PRO) ──────────────────────────────────────────────────────
function MasonryLayout({ profile, links, products, albums, tpl, settings, onAlbum }: LayoutProps) {
  const bStyle = tpl.btnStyle ?? 'solid'
  const regularLinks = links.filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.block_type && l.block_type !== 'link')
  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center"><AvatarImg profile={profile} tpl={tpl} size="lg" settings={settings} /></div>
        <h1 style={getNameStyle(settings, tpl)}>{profile.display_name || `@${profile.username}`}</h1>
        <p className="text-sm" style={{ color: tpl.subtextColor }}>@{profile.username}</p>
        {profile.job_title && <p className="text-sm font-medium mt-0.5" style={{ color: tpl.subtextColor }}>{profile.job_title}</p>}
        {profile.bio && <p className="text-sm mt-2 leading-relaxed" style={{ color: tpl.subtextColor }}>{profile.bio}</p>}
        <SocialBar settings={settings} tpl={tpl} />
      </div>
      {(regularLinks.length > 0 || blocks.length > 0) && (
        <div style={{ columns: 2, columnGap: '8px' }}>
          {[...regularLinks, ...blocks].map(l => {
            const isBlock = l.block_type && l.block_type !== 'link'
            if (isBlock) return (
              <div key={l.id} className="break-inside-avoid mb-2">
                <BlockOrLink link={l} tpl={tpl} settings={settings} userId={profile.id} />
              </div>
            )
            const bg = settings.linkBgCustom || (bStyle === 'vivid' ? (PLATFORM_COLORS[l.platform ?? 'custom'] ?? tpl.btnBg) : tpl.btnBg)
            const border = settings.linkBorder ? `1px solid ${tpl.btnBorder}` : 'none'
            return (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                onClick={() => trackClick(l.id, profile.id)}
                className="block mb-2 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg break-inside-avoid"
                style={{ background: bg, border, borderRadius: (settings.linkRadius ?? 12) + 'px' }}>
                {l.thumbnail_url && (
                  <img src={l.thumbnail_url} alt="" className="w-full object-cover" style={{ maxHeight: 120 }} />
                )}
                <div className="px-3 py-2.5 flex items-center gap-1.5">
                  {l.is_featured && <Star size={11} fill="currentColor" className="text-amber-400 flex-shrink-0" />}
                  <span className="text-xs font-semibold flex-1 leading-snug" style={{ color: tpl.btnText }}>{l.title}</span>
                  <ExternalLink size={10} style={{ opacity: 0.3, color: tpl.btnText, flexShrink: 0 }} />
                </div>
              </a>
            )
          })}
        </div>
      )}
      <ProductsGrid products={products} tpl={tpl} settings={settings} />
      <AlbumRow albums={albums} tpl={tpl} onOpen={onAlbum} />
      <ExtrasSection profile={profile} tpl={tpl} settings={settings} />
      <FooterTag tpl={tpl} />
    </div>
  )
}

// ─── Glass layout (PRO) ────────────────────────────────────────────────────────
function GlassLayout({ profile, links, products, albums, tpl, bgImage, settings, onAlbum }: LayoutProps) {
  const glassTpl: TemplateStyle = {
    ...tpl,
    cardBg:       'rgba(255,255,255,0.08)',
    cardBorder:   'rgba(255,255,255,0.14)',
    textColor:    '#ffffff',
    subtextColor: 'rgba(255,255,255,0.6)',
    btnBg:        'rgba(255,255,255,0.1)',
    btnBorder:    'rgba(255,255,255,0.2)',
    btnText:      '#ffffff',
  }
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        {bgImage
          ? <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          : profile.avatar_url
            ? <img src={profile.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }} />
        }
        <div className="absolute inset-0 bg-black/45" style={{ backdropFilter: 'blur(6px)' }} />
      </div>
      <div className="max-w-sm mx-auto px-4 py-12 space-y-5 relative z-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="ring-2 ring-white/20 rounded-full p-0.5">
              <AvatarImg profile={profile} tpl={glassTpl} size="lg" settings={settings} />
            </div>
          </div>
          <h1 style={getNameStyle(settings, tpl, '#fff')}>{profile.display_name || `@${profile.username}`}</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>@{profile.username}</p>
          {profile.job_title && <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.job_title}</p>}
          {profile.bio && <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{profile.bio}</p>}
          <SocialBar settings={settings} tpl={glassTpl} />
        </div>
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map(l => <BlockOrLink key={l.id} link={l} tpl={glassTpl} settings={settings} userId={profile.id} align="center" />)}
          </div>
        )}
        <ProductsGrid products={products} tpl={glassTpl} settings={settings} />
        <AlbumRow albums={albums} tpl={glassTpl} onOpen={onAlbum} />
        <ExtrasSection profile={profile} tpl={glassTpl} dark />
        <FooterTag tpl={glassTpl} />
      </div>
    </div>
  )
}
