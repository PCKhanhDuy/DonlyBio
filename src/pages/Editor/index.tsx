import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ZoomIn, ZoomOut, Check, Globe, Lock,
  Link2, ShoppingBag, Trash2, Eye, EyeOff,
  Upload, ExternalLink, Sparkles, Palette, Sliders,
  Image as ImageIcon, User, BarChart3, Smartphone, Briefcase,
} from 'lucide-react'
import {
  SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiShopee,
  SiGithub, SiTelegram, SiWhatsapp, SiMessenger,
  SiDiscord, SiTwitch, SiSpotify, SiPinterest, SiReddit,
  SiSnapchat, SiMedium, SiBehance, SiDribbble, SiThreads, SiZalo,
} from 'react-icons/si'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { TEMPLATES, LAYOUTS, PLATFORM_COLORS, PLATFORMS, FONTS, DEFAULT_SETTINGS } from '../../types'
import type { TemplateId, LayoutId, BioLink, Product, PhotoAlbum, TemplateStyle, CustomSettings } from '../../types'

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: SiInstagram, tiktok: SiTiktok,   youtube:   SiYoutube,
  facebook:  SiFacebook,  twitter: SiX,        threads:   SiThreads,
  linkedin:  Briefcase,   github:  SiGithub,   telegram:  SiTelegram,
  whatsapp:  SiWhatsapp,  messenger: SiMessenger, discord: SiDiscord,
  twitch:    SiTwitch,    spotify: SiSpotify,  pinterest: SiPinterest,
  reddit:    SiReddit,    snapchat: SiSnapchat, medium:   SiMedium,
  behance:   SiBehance,   dribbble: SiDribbble, shopee:  SiShopee,
  zalo:      SiZalo,      website: Globe,       custom:   Link2,
}

const GRADIENTS = [
  'linear-gradient(135deg,#7C3AED 0%,#DB2777 100%)',
  'linear-gradient(135deg,#0891b2 0%,#1e40af 100%)',
  'linear-gradient(135deg,#f97316 0%,#ec4899 100%)',
  'linear-gradient(135deg,#065f46 0%,#0891b2 100%)',
  'linear-gradient(135deg,#fbbf24 0%,#f43f5e 100%)',
  'linear-gradient(135deg,#34d399 0%,#3b82f6 100%)',
  'linear-gradient(135deg,#f953c6 0%,#b91d73 100%)',
  'linear-gradient(135deg,#f59e0b 0%,#dc2626 100%)',
]
const MESHES = [
  'radial-gradient(at 40% 20%,#ff758c 0%,transparent 50%),radial-gradient(at 80% 80%,#ffa07a 0%,transparent 50%),radial-gradient(at 10% 80%,#da8fff 0%,transparent 50%),#ffe0f0',
  'radial-gradient(at 30% 20%,#06d6a0 0%,transparent 50%),radial-gradient(at 80% 70%,#8338ec 0%,transparent 50%),radial-gradient(at 10% 80%,#3a86ff 0%,transparent 50%),#0a0a2e',
  'radial-gradient(at 20% 30%,#ffd93d 0%,transparent 50%),radial-gradient(at 80% 20%,#ff6b6b 0%,transparent 50%),radial-gradient(at 50% 80%,#ff8c42 0%,transparent 50%),#fff3cd',
  'radial-gradient(at 20% 20%,#0096c7 0%,transparent 50%),radial-gradient(at 80% 80%,#023e8a 0%,transparent 50%),#03045e',
  'radial-gradient(at 20% 30%,#ffc8dd 0%,transparent 50%),radial-gradient(at 80% 20%,#bde0fe 0%,transparent 50%),radial-gradient(at 50% 80%,#cdb4db 0%,transparent 50%),#fff0f3',
  'radial-gradient(at 20% 20%,#00ff87 0%,transparent 50%),radial-gradient(at 80% 80%,#ff00c8 0%,transparent 50%),radial-gradient(at 60% 40%,#00b4d8 0%,transparent 50%),#000510',
]

type BgType = 'default' | 'color' | 'gradient' | 'image'
function parseBgType(bg: string | null): BgType {
  if (!bg) return 'default'
  if (bg.startsWith('img:')) return 'image'
  return bg.startsWith('linear') || bg.startsWith('radial') ? 'gradient' : 'color'
}

const NAME_SIZES: Record<string, string> = {
  sm: '13px', base: '15px', lg: '17px', xl: '19px', '2xl': '23px', '3xl': '27px',
}

// ─── Phone frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ children, zoom }: { children: React.ReactNode; zoom: number }) {
  const W = 390, H = 844
  return (
    <div style={{ width: W * zoom, height: H * zoom, flexShrink: 0, position: 'relative' }}>
      <div style={{ width: W, height: H, transform: `scale(${zoom})`, transformOrigin: 'top left', position: 'absolute' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 55, background: 'linear-gradient(145deg,#2c2c2e,#1c1c1e)', boxShadow: '0 30px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.1)' }} />
        {[120,165,235].map(t => <div key={t} style={{ position:'absolute', top:t, left:-3, width:3, height:t===165?60:32, background:'#2a2a2e', borderRadius:'2px 0 0 2px' }} />)}
        <div style={{ position:'absolute', top:165, right:-3, width:3, height:85, background:'#2a2a2e', borderRadius:'0 2px 2px 0' }} />
        <div style={{ position:'absolute', inset:5, borderRadius:50, background:'#0a0a0a' }} />
        <div style={{ position:'absolute', inset:8, borderRadius:47, overflow:'hidden', background:'white' }}>
          <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', width:120, height:34, background:'#000', borderRadius:20, zIndex:100 }} />
          <div style={{ height:'100%', overflowY:'auto', paddingTop:50 }} className="hide-scrollbar">
            {children}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', width:130, height:4, background:'rgba(255,255,255,0.22)', borderRadius:4 }} />
      </div>
    </div>
  )
}

// ─── Preview sub-components ───────────────────────────────────────────────────
interface PProfile { username: string|null; displayName: string|null; bio: string|null; avatarUrl: string|null }

function PAvatar({ p, tpl, dim = 80, settings }: { p: PProfile; tpl: TemplateStyle; dim?: number; settings: CustomSettings }) {
  const letter = (p.displayName || p.username || 'U')[0].toUpperCase()
  const borderRadius = settings.avatarShape === 'circle' ? '50%'
    : settings.avatarShape === 'rounded' ? `${Math.round(dim * 0.22)}px`
    : '6px'
  const border = settings.avatarBorder
    ? `${settings.avatarBorderWidth}px solid ${settings.avatarBorderColor}`
    : `2px solid ${tpl.cardBorder}`
  const boxShadow = settings.avatarShadow ? '0 6px 20px rgba(0,0,0,0.28)' : undefined
  return p.avatarUrl
    ? <img src={p.avatarUrl} alt="" style={{ width:dim, height:dim, borderRadius, objectFit:'cover', border, boxShadow, flexShrink:0 }} />
    : <div style={{ width:dim, height:dim, borderRadius, background:tpl.cardBg, border, color:tpl.textColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:dim/3, fontWeight:700, flexShrink:0, boxShadow }}>{letter}</div>
}

function PLinkBtn({ link, tpl, align='center', settings }: { link:BioLink; tpl:TemplateStyle; align?:'center'|'left'; settings:CustomSettings }) {
  const Icon = PLATFORM_ICONS[link.platform??'custom'] ?? Link2
  const platColor = PLATFORM_COLORS[link.platform??'custom'] ?? tpl.btnText
  const bStyle = tpl.btnStyle ?? 'solid'
  const bg = settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[link.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
  const border = settings.linkBorder ? (bStyle==='vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
  const color = settings.linkBgCustom ? undefined : (bStyle==='vivid' ? '#fff' : tpl.btnText)
  const padding = settings.linkHeight === 'sm' ? '7px 14px' : settings.linkHeight === 'lg' ? '15px 16px' : '11px 16px'
  const boxShadow = settings.linkShadow ? '0 3px 10px rgba(0,0,0,0.12)' : undefined
  const iconEl = <span style={bStyle==='icon-colors' && !settings.linkBgCustom ? { color:platColor } : {}}><Icon size={15} /></span>
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9, padding, background:bg, border, borderRadius:settings.linkRadius+'px', color, fontSize:12, fontWeight:600, boxShadow }}>
      {settings.linkIconPos !== 'right' && settings.linkIconPos !== 'none' && iconEl}
      <span style={{ flex:1, textAlign: settings.linkIconPos==='right' ? (align==='center'?'center':'left') : align }}>{link.title}</span>
      {settings.linkIconPos === 'right' && iconEl}
      <ExternalLink size={9} style={{ opacity:0.3 }} />
    </div>
  )
}

function PGridLinkBtn({ link, tpl, settings }: { link:BioLink; tpl:TemplateStyle; settings:CustomSettings }) {
  const Icon = PLATFORM_ICONS[link.platform??'custom'] ?? Link2
  const platColor = PLATFORM_COLORS[link.platform??'custom'] ?? tpl.btnText
  const bStyle = tpl.btnStyle ?? 'solid'
  const bg = settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[link.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
  const border = settings.linkBorder ? (bStyle==='vivid' ? 'none' : `1px solid ${tpl.btnBorder}`) : 'none'
  const color = settings.linkBgCustom ? undefined : (bStyle==='vivid' ? '#fff' : tpl.btnText)
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, padding:12, background:bg, border, borderRadius:settings.linkRadius+'px', color, fontSize:10, fontWeight:600, minHeight:72 }}>
      <span style={bStyle==='icon-colors' && !settings.linkBgCustom ? { color:platColor } : {}}><Icon size={20} /></span>
      <span style={{ textAlign:'center', lineHeight:1.2 }}>{link.title}</span>
    </div>
  )
}

function PProducts({ products, tpl, settings }: { products:Product[]; tpl:TemplateStyle; settings:CustomSettings }) {
  if (!products.length) return null
  const cols = settings.productCols
  return (
    <div style={{ marginTop:14 }}>
      <p style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:tpl.subtextColor, opacity:.7, marginBottom:7 }}>Products</p>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:7 }}>
        {products.slice(0, cols === 3 ? 6 : 4).map(p => {
          const isCircle = settings.productImgRatio === 'circle'
          const aspectStyle: React.CSSProperties = {
            width: '100%',
            aspectRatio: settings.productImgRatio === 'portrait' ? '2/3'
              : settings.productImgRatio === 'wide' ? '16/9'
              : '1/1',
            objectFit: 'cover',
            ...(isCircle ? { borderRadius:'50%', padding:'6px' } : {}),
          }
          return (
            <div key={p.id} style={{ background:tpl.cardBg, border:`1px solid ${tpl.cardBorder}`, borderRadius:settings.productRounded+'px', overflow:'hidden' }}>
              {isCircle ? (
                <div style={{ padding:'6px', aspectRatio:'1/1', background:tpl.cardBorder+'20' }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, borderRadius:'50%', background:tpl.cardBorder+'30' }}>🛍️</div>
                  }
                </div>
              ) : (
                p.image_url
                  ? <img src={p.image_url} alt={p.name} style={aspectStyle} />
                  : <div style={{ ...aspectStyle, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, background:tpl.cardBorder+'30' }}>🛍️</div>
              )}
              <div style={{ padding:'5px 7px 7px' }}>
                <p style={{ fontSize:10, fontWeight:600, color:tpl.textColor, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                {settings.productShowPrice && p.price && <p style={{ fontSize:9, color:tpl.subtextColor, marginTop:2 }}>{p.price}</p>}
                {settings.productShowDesc && p.description && <p style={{ fontSize:9, color:tpl.subtextColor, marginTop:2, lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.description}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PAlbums({ albums, tpl }: { albums:PhotoAlbum[]; tpl:TemplateStyle }) {
  if (!albums.length) return null
  return (
    <div style={{ marginTop:14 }}>
      <p style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:tpl.subtextColor, opacity:.7, marginBottom:7 }}>Gallery</p>
      <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:4 }} className="hide-scrollbar">
        {albums.slice(0,6).map(a => (
          <div key={a.id} style={{ flexShrink:0, width:80, aspectRatio:'2/3', borderRadius:10, overflow:'hidden', position:'relative', background:'#111' }}>
            {a.cover_url && <img src={a.cover_url} alt={a.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }} />
            <p style={{ position:'absolute', bottom:4, left:4, right:4, color:'#fff', fontSize:8, fontWeight:700 }}>{a.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Layout previews ──────────────────────────────────────────────────────────
interface PLayoutProps { p:PProfile; links:BioLink[]; products:Product[]; albums:PhotoAlbum[]; tpl:TemplateStyle; pageBg:string; bgImage:string|null; settings:CustomSettings }

function nameSt(settings: CustomSettings, tpl: TemplateStyle): React.CSSProperties {
  return {
    fontSize: NAME_SIZES[settings.nameSize] ?? '19px',
    fontWeight: settings.nameWeight,
    color: settings.nameColor || tpl.textColor,
    fontFamily: settings.nameFont ? (FONTS[settings.nameFont]?.css ?? undefined) : undefined,
  }
}

function PreviewCentered({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ padding:'22px 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
        <PAvatar p={p} tpl={tpl} dim={76} settings={settings} />
        <div style={{ textAlign:'center' }}>
          <p style={nameSt(settings, tpl)}>{p.displayName || '@'+p.username}</p>
          <p style={{ fontSize:11, color:tpl.subtextColor, marginTop:2 }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, marginTop:7, lineHeight:1.5 }}>{p.bio}</p>}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewLeft({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ padding:'18px 16px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <PAvatar p={p} tpl={tpl} dim={52} settings={settings} />
        <div>
          <p style={nameSt(settings, tpl)}>{p.displayName || '@'+p.username}</p>
          <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, marginTop:3, lineHeight:1.4 }}>{p.bio}</p>}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="left" />)}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewHero({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div>
      <div style={{ height:200, position:'relative', overflow:'hidden' }}>
        {p.avatarUrl
          ? <img src={p.avatarUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
          : <div style={{ width:'100%', height:'100%', background:tpl.pageBg }} />
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.75),rgba(0,0,0,0.15))' }} />
        <div style={{ position:'absolute', bottom:12, left:14, right:14 }}>
          <p style={{ ...nameSt(settings, tpl), color:'#fff', fontSize:18 }}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)' }}>@{p.username}</p>
        </div>
      </div>
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
        </div>
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewGrid({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const isOdd = active.length % 2 !== 0
  return (
    <div style={{ padding:'22px 16px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
      </div>
      <div>
        {isOdd && <div style={{ marginBottom:7 }}><PLinkBtn link={active[0]} tpl={tpl} settings={settings} /></div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {(isOdd ? active.slice(1) : active).map(l => <PGridLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
        </div>
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewMagazine({ p, links, products, albums, tpl, bgImage, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const portrait = bgImage ?? p.avatarUrl
  return (
    <div style={{ display:'flex', minHeight:'100%' }}>
      <div style={{ width:'42%', flexShrink:0, overflow:'hidden', minHeight:480, position:'relative' }}>
        {portrait
          ? <img src={portrait} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
          : <div style={{ width:'100%', height:'100%', background:tpl.pageBg, position:'absolute', inset:0 }} />
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }} />
        <div style={{ position:'absolute', bottom:14, left:10, right:5 }}>
          <p style={{ ...nameSt(settings, tpl), color:'#fff', fontSize:14 }}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>@{p.username}</p>
        </div>
      </div>
      <div style={{ flex:1, padding:'18px 12px', display:'flex', flexDirection:'column', gap:9 }}>
        {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, borderLeft:`2px solid ${tpl.cardBorder}`, paddingLeft:7, lineHeight:1.5 }}>{p.bio}</p>}
        {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="left" />)}
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewOverlay({ p, links, products, albums, tpl, bgImage, pageBg, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const overlayTpl = { ...tpl, btnBg:'rgba(255,255,255,0.18)', btnBorder:'rgba(255,255,255,0.28)', btnText:'#fff' }
  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {bgImage
          ? <div style={{ position:'absolute', inset:0, backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center' }} />
          : p.avatarUrl
            ? <img src={p.avatarUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            : <div style={{ position:'absolute', inset:0, background:pageBg }} />
        }
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.48)' }} />
      </div>
      <div style={{ position:'relative', zIndex:2, padding:'22px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ borderRadius:'50%', padding:3, border:'2px solid rgba(255,255,255,0.25)' }}>
            <PAvatar p={p} tpl={{ ...tpl, cardBorder:'rgba(255,255,255,0.3)' }} dim={76} settings={settings} />
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ ...nameSt(settings, tpl), color:'#fff', fontSize:18 }}>{p.displayName||'@'+p.username}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>@{p.username}</p>
            {p.bio && <p style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:7 }}>{p.bio}</p>}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {active.map(l => <PLinkBtn key={l.id} link={l} tpl={overlayTpl} settings={settings} />)}
        </div>
        <PProducts products={products} tpl={{ ...tpl, cardBg:'rgba(0,0,0,0.3)', cardBorder:'rgba(255,255,255,0.15)', textColor:'#fff', subtextColor:'rgba(255,255,255,0.6)' }} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewCard({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ position:'relative', marginBottom:40 }}>
        <div style={{ height:150, background:tpl.pageBg, position:'relative', overflow:'hidden' }}>
          {p.avatarUrl && <img src={p.avatarUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', opacity:0.6 }} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.4))' }} />
        </div>
        <div style={{ position:'absolute', bottom:-34, left:'50%', transform:'translateX(-50%)', padding:3, borderRadius:'50%', background:'white' }}>
          <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ textAlign:'center' }}>
          <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:11, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, marginTop:5 }}>{p.bio}</p>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
        </div>
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewSplit({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ display:'flex', minHeight:'100%' }}>
      <div style={{ width:'38%', flexShrink:0, background:tpl.cardBg, borderRight:`1px solid ${tpl.cardBorder}`, padding:'22px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:9 }}>
        <PAvatar p={p} tpl={tpl} dim={56} settings={settings} />
        <div style={{ textAlign:'center' }}>
          <p style={{ ...nameSt(settings, tpl), fontSize:12 }}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:9, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:9, color:tpl.subtextColor, marginTop:5, lineHeight:1.4 }}>{p.bio}</p>}
        </div>
      </div>
      <div style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:7 }}>
        {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="left" />)}
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewCompact({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ padding:'14px 12px', display:'flex', flexDirection:'column', gap:7 }}>
      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
        <PAvatar p={p} tpl={tpl} dim={38} settings={settings} />
        <div>
          <p style={{ ...nameSt(settings, tpl), fontSize:13 }}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
        </div>
      </div>
      {p.bio && <p style={{ fontSize:11, color:tpl.subtextColor, lineHeight:1.4 }}>{p.bio}</p>}
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        {active.map(l => {
          const Icon = PLATFORM_ICONS[l.platform??'custom'] ?? Link2
          const platColor = PLATFORM_COLORS[l.platform??'custom'] ?? tpl.btnText
          const bStyle = tpl.btnStyle ?? 'solid'
          const bg = settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[l.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
          return (
            <div key={l.id} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 11px', background:bg, border: settings.linkBorder ? `1px solid ${tpl.btnBorder}` : 'none', borderRadius:settings.linkRadius+'px', color:bStyle==='vivid'?'#fff':tpl.btnText, fontSize:11, fontWeight:600 }}>
              {settings.linkIconPos !== 'none' && <span style={bStyle==='icon-colors' ? { color:platColor } : {}}><Icon size={12} /></span>}
              <span style={{ flex:1 }}>{l.title}</span>
            </div>
          )
        })}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewBanner({ p, links, products, albums, tpl, bgImage, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const bannerSrc = bgImage ?? p.avatarUrl
  return (
    <div style={{ background: tpl.pageBg }}>
      <div style={{ height:110, position:'relative', overflow:'hidden' }}>
        {bannerSrc
          ? <img src={bannerSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${tpl.btnBg}cc,${tpl.cardBg})` }} />
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.3))' }} />
      </div>
      <div style={{ position:'relative', padding:'0 16px 8px' }}>
        <div style={{ position:'absolute', top:-36, left:16, padding:2, borderRadius:'50%', background:tpl.pageBg }}>
          <PAvatar p={p} tpl={tpl} dim={52} settings={settings} />
        </div>
        <div style={{ paddingTop:22 }}>
          <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, marginTop:4, lineHeight:1.4 }}>{p.bio}</p>}
        </div>
      </div>
      <div style={{ padding:'8px 16px', display:'flex', flexDirection:'column', gap:7 }}>
        {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="left" />)}
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewBubble({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active).filter(l => !l.block_type || l.block_type === 'link')
  const blocks = links.filter(l => l.is_active && l.block_type && l.block_type !== 'link')
  const bStyle = tpl.btnStyle ?? 'solid'
  return (
    <div style={{ padding:'22px 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={72} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
        {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center', lineHeight:1.4 }}>{p.bio}</p>}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
        {active.map(l => {
          const Icon = PLATFORM_ICONS[l.platform??'custom'] ?? Link2
          const bg = settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[l.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
          const color = settings.linkBgCustom ? undefined : (bStyle==='vivid' ? '#fff' : tpl.btnText)
          return (
            <div key={l.id} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', background:bg, borderRadius:999, color, fontSize:11, fontWeight:600, border:settings.linkBorder?`1px solid ${tpl.btnBorder}`:'none' }}>
              <Icon size={11} />{l.title}
            </div>
          )
        })}
      </div>
      {blocks.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewFloat({ p, links, products, albums, tpl, pageBg, bgImage, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{ position:'absolute', inset:0 }}>
        {bgImage
          ? <div style={{ position:'absolute', inset:0, backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center' }} />
          : p.avatarUrl
            ? <img src={p.avatarUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ position:'absolute', inset:0, background:pageBg }} />
        }
        <div style={{ position:'absolute', inset:0, backdropFilter:'blur(18px)', background:'rgba(0,0,0,0.28)' }} />
      </div>
      <div style={{ position:'relative', zIndex:1, padding:'20px 14px' }}>
        <div style={{ background:tpl.pageBg, border:`1px solid ${tpl.cardBorder}`, borderRadius:20, padding:'18px 14px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
            <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
            <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
            {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center', lineHeight:1.4 }}>{p.bio}</p>}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {active.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
          </div>
          <PProducts products={products} tpl={tpl} settings={settings} />
          <PAlbums albums={albums} tpl={tpl} />
        </div>
      </div>
    </div>
  )
}

function PreviewBento({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const regular = active.filter(l => !l.block_type || l.block_type === 'link')
  const hero = regular.find(l => l.is_featured) ?? regular[0]
  const rest = hero ? regular.filter(l => l.id !== hero.id) : regular.slice(1)
  const bStyle = tpl.btnStyle ?? 'solid'
  const bg = (l: BioLink) => settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[l.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
  return (
    <div style={{ padding:'22px 14px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
      </div>
      {hero && (
        <div style={{ background:bg(hero), borderRadius:14, overflow:'hidden' }}>
          {hero.thumbnail_url && <img src={hero.thumbnail_url} alt="" style={{ width:'100%', height:80, objectFit:'cover' }} />}
          <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ flex:1, fontSize:12, fontWeight:700, color:tpl.btnText }}>{hero.title}</span>
            <ExternalLink size={10} style={{ opacity:0.4, color:tpl.btnText }} />
          </div>
        </div>
      )}
      {rest.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {rest.map(l => <PGridLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
        </div>
      )}
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewTimeline({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ padding:'18px 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <PAvatar p={p} tpl={tpl} dim={48} settings={settings} />
        <div>
          <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, marginTop:3, lineHeight:1.4 }}>{p.bio}</p>}
        </div>
      </div>
      <div style={{ position:'relative', paddingLeft:22 }}>
        <div style={{ position:'absolute', left:7, top:4, bottom:4, width:1, background:tpl.cardBorder }} />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {active.map(l => (
            <div key={l.id} style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:-15, top:9, width:8, height:8, borderRadius:'50%', border:`2px solid ${l.is_featured?'#f59e0b':tpl.btnBg}`, background:tpl.pageBg }} />
              <PLinkBtn link={l} tpl={tpl} settings={settings} align="left" />
            </div>
          ))}
        </div>
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewStrip({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  return (
    <div style={{ padding:'22px 18px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <PAvatar p={p} tpl={tpl} dim={46} settings={settings} />
        <div>
          <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, marginTop:3, lineHeight:1.4 }}>{p.bio}</p>}
        </div>
      </div>
      <div>
        {active.map((l, i) => (
          <div key={l.id}>
            {i > 0 && <div style={{ height:1, background:tpl.cardBorder, opacity:0.2 }} />}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0' }}>
              <span style={{ fontSize:12, fontWeight:600, color:tpl.textColor }}>{l.title}</span>
              <ExternalLink size={11} style={{ color:tpl.subtextColor, opacity:0.4 }} />
            </div>
          </div>
        ))}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewResume({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const regular = active.filter(l => !l.block_type || l.block_type === 'link')
  return (
    <div style={{ background:tpl.pageBg, minHeight:'100%' }}>
      <div style={{ padding:'16px', background:tpl.cardBg, borderBottom:`1px solid ${tpl.cardBorder}` }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
          <PAvatar p={p} tpl={tpl} dim={52} settings={settings} />
          <div>
            <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
            <p style={{ fontSize:10, color:tpl.subtextColor }}>@{p.username}</p>
            {p.bio && <p style={{ fontSize:9, color:tpl.subtextColor, marginTop:4, lineHeight:1.4 }}>{p.bio}</p>}
          </div>
        </div>
      </div>
      <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:7 }}>
        <p style={{ fontSize:8, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:tpl.subtextColor, opacity:0.6 }}>Links</p>
        {regular.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="left" />)}
        <PProducts products={products} tpl={tpl} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

function PreviewColumns({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active).filter(l => !l.block_type || l.block_type === 'link')
  const left  = active.filter((_, i) => i % 2 === 0)
  const right = active.filter((_, i) => i % 2 !== 0)
  return (
    <div style={{ padding:'22px 14px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {left.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="center" />)}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {right.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} align="center" />)}
        </div>
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewSpotlight({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const hero = active.find(l => l.is_featured && (!l.block_type || l.block_type === 'link')) ?? active.find(l => !l.block_type || l.block_type === 'link')
  const rest = hero ? active.filter(l => l.id !== hero.id) : active
  return (
    <div style={{ padding:'22px 14px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
      </div>
      {hero && (
        <div style={{ background:tpl.btnBg, border:`1px solid ${tpl.btnBorder}`, borderRadius:20, overflow:'hidden' }}>
          {hero.thumbnail_url && <img src={hero.thumbnail_url} alt="" style={{ width:'100%', height:100, objectFit:'cover' }} />}
          <div style={{ padding:'10px 14px' }}>
            <p style={{ fontSize:13, fontWeight:700, color:tpl.btnText }}>{hero.title}</p>
          </div>
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {rest.map(l => <PLinkBtn key={l.id} link={l} tpl={tpl} settings={settings} />)}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewMasonry({ p, links, products, albums, tpl, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const bStyle = tpl.btnStyle ?? 'solid'
  return (
    <div style={{ padding:'22px 14px', display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <PAvatar p={p} tpl={tpl} dim={68} settings={settings} />
        <p style={nameSt(settings, tpl)}>{p.displayName||'@'+p.username}</p>
        {p.bio && <p style={{ fontSize:10, color:tpl.subtextColor, textAlign:'center' }}>{p.bio}</p>}
      </div>
      <div style={{ columns:2, columnGap:7 }}>
        {active.map(l => {
          const bg = settings.linkBgCustom || (bStyle==='vivid' ? (PLATFORM_COLORS[l.platform??'custom'] ?? tpl.btnBg) : tpl.btnBg)
          return (
            <div key={l.id} style={{ background:bg, borderRadius:10, overflow:'hidden', marginBottom:7, breakInside:'avoid' }}>
              {l.thumbnail_url && <img src={l.thumbnail_url} alt="" style={{ width:'100%', height:60, objectFit:'cover' }} />}
              <div style={{ padding:'6px 9px', fontSize:10, fontWeight:600, color:tpl.btnText }}>{l.title}</div>
            </div>
          )
        })}
      </div>
      <PProducts products={products} tpl={tpl} settings={settings} />
      <PAlbums albums={albums} tpl={tpl} />
    </div>
  )
}

function PreviewGlass({ p, links, products, albums, tpl, bgImage, settings }: PLayoutProps) {
  const active = links.filter(l => l.is_active)
  const glassTpl = { ...tpl, btnBg:'rgba(255,255,255,0.1)', btnBorder:'rgba(255,255,255,0.2)', btnText:'#fff' }
  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{ position:'absolute', inset:0 }}>
        {bgImage
          ? <div style={{ position:'absolute', inset:0, backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center' }} />
          : p.avatarUrl
            ? <img src={p.avatarUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }} />
        }
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)' }} />
      </div>
      <div style={{ position:'relative', zIndex:1, padding:'22px 14px', display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{ borderRadius:'50%', padding:3, border:'2px solid rgba(255,255,255,0.2)' }}>
            <PAvatar p={p} tpl={{ ...tpl, cardBorder:'rgba(255,255,255,0.3)' }} dim={68} settings={settings} />
          </div>
          <p style={{ ...nameSt(settings, tpl), color:'#fff' }}>{p.displayName||'@'+p.username}</p>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>@{p.username}</p>
          {p.bio && <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)', textAlign:'center', lineHeight:1.4 }}>{p.bio}</p>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {active.map(l => <PLinkBtn key={l.id} link={l} tpl={glassTpl} settings={settings} />)}
        </div>
        <PProducts products={products} tpl={{ ...tpl, cardBg:'rgba(255,255,255,0.08)', textColor:'#fff', subtextColor:'rgba(255,255,255,0.6)' }} settings={settings} />
        <PAlbums albums={albums} tpl={tpl} />
      </div>
    </div>
  )
}

// ─── MiniPreview ──────────────────────────────────────────────────────────────
function MiniPreview({ profile, links, products, albums, templateId, layoutId, customBg, settings }: {
  profile: PProfile; links: BioLink[]; products: Product[]; albums: PhotoAlbum[]
  templateId: TemplateId; layoutId: LayoutId; customBg: string|null; settings: CustomSettings
}) {
  const tpl = TEMPLATES[templateId] ?? TEMPLATES.minimal
  const isImg = customBg?.startsWith('img:') ?? false
  const bgImage = isImg ? customBg!.slice(4) : null
  const pageBg = (customBg && !isImg) ? customBg : tpl.pageBg
  const pProps: PLayoutProps = { p:profile, links, products, albums, tpl, pageBg, bgImage, settings }
  const fontFamily = FONTS[settings.pageFont]?.css ?? 'system-ui'
  const selfHandlesBg: LayoutId[] = ['overlay', 'magazine', 'float', 'glass']

  return (
    <div style={{ minHeight:'100%', fontFamily, position:'relative' }}>
      {bgImage && !selfHandlesBg.includes(layoutId) && (
        <>
          <div style={{ position:'absolute', inset:0, backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:0 }} />
        </>
      )}
      <div style={{ position:'relative', zIndex:1, minHeight:'100%', background:(bgImage && !selfHandlesBg.includes(layoutId)) ? 'transparent' : pageBg }}>
        {layoutId === 'left'      && <PreviewLeft      {...pProps} />}
        {layoutId === 'hero'      && <PreviewHero      {...pProps} />}
        {layoutId === 'grid'      && <PreviewGrid      {...pProps} />}
        {layoutId === 'magazine'  && <PreviewMagazine  {...pProps} />}
        {layoutId === 'overlay'   && <PreviewOverlay   {...pProps} />}
        {layoutId === 'card'      && <PreviewCard      {...pProps} />}
        {layoutId === 'split'     && <PreviewSplit     {...pProps} />}
        {layoutId === 'compact'   && <PreviewCompact   {...pProps} />}
        {layoutId === 'banner'    && <PreviewBanner    {...pProps} />}
        {layoutId === 'bubble'    && <PreviewBubble    {...pProps} />}
        {layoutId === 'float'     && <PreviewFloat     {...pProps} />}
        {layoutId === 'bento'     && <PreviewBento     {...pProps} />}
        {layoutId === 'timeline'  && <PreviewTimeline  {...pProps} />}
        {layoutId === 'strip'     && <PreviewStrip     {...pProps} />}
        {layoutId === 'resume'    && <PreviewResume    {...pProps} />}
        {layoutId === 'columns'   && <PreviewColumns   {...pProps} />}
        {layoutId === 'spotlight' && <PreviewSpotlight {...pProps} />}
        {layoutId === 'masonry'   && <PreviewMasonry   {...pProps} />}
        {layoutId === 'glass'     && <PreviewGlass     {...pProps} />}
        {layoutId === 'centered'  && <PreviewCentered  {...pProps} />}
      </div>
    </div>
  )
}

// ─── Left panel ───────────────────────────────────────────────────────────────
function LeftPanel({ links, setLinks, products, albums, userId }: {
  links: BioLink[]; setLinks: React.Dispatch<React.SetStateAction<BioLink[]>>
  products: Product[]; albums: PhotoAlbum[]; userId: string
}) {
  const navigate = useNavigate()
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ platform: 'instagram', title: '', url: '' })
  const [adding, setAdding] = useState(false)

  const addLink = async () => {
    if (!form.title || !form.url) return
    setAdding(true)
    const { data } = await supabase.from('bio_links').insert({
      user_id: userId, platform: form.platform, title: form.title, url: form.url, sort_order: links.length, is_active: true,
    }).select().single()
    if (data) setLinks(prev => [...prev, data])
    setForm({ platform: 'instagram', title: '', url: '' })
    setAddOpen(false)
    setAdding(false)
  }

  const toggleLink = async (id: string, current: boolean) => {
    await supabase.from('bio_links').update({ is_active: !current }).eq('id', id)
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: !current } : l))
  }

  const deleteLink = async (id: string) => {
    await supabase.from('bio_links').delete().eq('id', id)
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Add Block</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id:'link',    Icon:Link2,       label:'Link',    onClick:()=>setAddOpen(o=>!o) },
            { id:'product', Icon:ShoppingBag, label:'Product', onClick:()=> navigate('/dashboard?tab=products') },
            { id:'album',   Icon:ImageIcon,   label:'Album',   onClick:()=> navigate('/dashboard?tab=photos') },
          ] as const).map(b => (
            <button key={b.id} onClick={b.onClick}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                b.id==='link' && addOpen ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}>
              <b.Icon size={18} />
              {b.label}
            </button>
          ))}
        </div>

        {addOpen && (
          <div className="mt-3 p-3 bg-[#EBEDDF]/60 rounded-xl space-y-2 border border-[#333A2F]/20">
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#333A2F]">
              {Object.entries(PLATFORMS).map(([k,v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <input placeholder="Label (e.g. My Instagram)" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#333A2F]" />
            <input placeholder="https://..." value={form.url} onChange={e => setForm(f=>({...f,url:e.target.value}))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#333A2F]" />
            <div className="flex gap-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={addLink} disabled={adding || !form.title || !form.url}
                className="flex-1 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                style={{ background: '#333A2F' }}>
                {adding ? 'Adding…' : '+ Add Link'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {links.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Links ({links.length})</p>
            <div className="space-y-1.5">
              {links.map(l => {
                const Icon = PLATFORM_ICONS[l.platform ?? 'custom'] ?? Link2
                return (
                  <div key={l.id} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${l.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{l.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{l.url}</p>
                    </div>
                    <button onClick={() => toggleLink(l.id, l.is_active)} className="p-1 rounded-md hover:bg-gray-100">
                      {l.is_active ? <Eye size={12} style={{ color: '#333A2F' }} /> : <EyeOff size={12} className="text-gray-400" />}
                    </button>
                    <button onClick={() => deleteLink(l.id)} className="p-1 rounded-md hover:bg-red-50">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Products ({products.length})</p>
            <div className="space-y-1.5">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-sm">🛍️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                    {p.price && <p className="text-[10px] text-gray-400">{p.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {albums.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Albums ({albums.length})</p>
            <div className="space-y-1.5">
              {albums.map(a => (
                <div key={a.id} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {a.cover_url ? <img src={a.cover_url} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-xs">📷</span>}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 truncate flex-1">{a.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!links.length && !products.length && !albums.length && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-xs text-gray-400">Add a block above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Right panel ──────────────────────────────────────────────────────────────
type RightTab = 'design' | 'style' | 'background' | 'profile'

interface RightPanelProps {
  templateId: TemplateId; setTemplateId: (v: TemplateId) => void
  layoutId: LayoutId; setLayoutId: (v: LayoutId) => void
  customBg: string | null; setCustomBg: (v: string | null) => void
  settings: CustomSettings; setSettings: React.Dispatch<React.SetStateAction<CustomSettings>>
  displayName: string; setDisplayName: (v: string) => void
  bio: string; setBio: (v: string) => void
  avatarUrl: string | null; setAvatarUrl: (v: string | null) => void
  userId: string
}

// Small reusable toggle
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${on ? 'bg-[#333A2F]' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  )
}

function RightPanel(props: RightPanelProps) {
  const { templateId, setTemplateId, layoutId, setLayoutId, customBg, setCustomBg,
    settings, setSettings, displayName, setDisplayName, bio, setBio,
    avatarUrl, setAvatarUrl, userId } = props

  const [tab, setTab] = useState<RightTab>('design')
  const [bgType, setBgType] = useState<BgType>(parseBgType(customBg))
  const [bgColor, setBgColor] = useState(() => {
    const bg = customBg
    return (bg && !bg.startsWith('linear') && !bg.startsWith('radial') && !bg.startsWith('img:')) ? bg : '#7C3AED'
  })
  const [bgGradient, setBgGradient] = useState(() => {
    const bg = customBg
    return (bg && (bg.startsWith('linear') || bg.startsWith('radial'))) ? bg : GRADIENTS[0]
  })
  const [bgImgUrl, setBgImgUrl] = useState(() => customBg?.startsWith('img:') ? customBg.slice(4) : '')
  const [bgImgUploading, setBgImgUploading] = useState(false)
  const [themeFilter, setThemeFilter] = useState<'all'|'light'|'dark'>('all')
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Sync background state → customBg
  useEffect(() => {
    if (bgType === 'default') setCustomBg(null)
    else if (bgType === 'color') setCustomBg(bgColor)
    else if (bgType === 'gradient') setCustomBg(bgGradient)
    else if (bgType === 'image') setCustomBg(bgImgUrl ? `img:${bgImgUrl}` : null)
  }, [bgType, bgColor, bgGradient, bgImgUrl])

  // Load Google Fonts
  useEffect(() => {
    [settings.pageFont, settings.nameFont].filter(Boolean).forEach(key => {
      const font = FONTS[key]
      if (!font?.google) return
      const id = `gf-${key}`
      if (document.getElementById(id)) return
      const link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`
      document.head.appendChild(link)
    })
  }, [settings.pageFont, settings.nameFont])

  const set = <K extends keyof CustomSettings>(k: K, v: CustomSettings[K]) =>
    setSettings(s => ({ ...s, [k]: v }))

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setAvatarUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setAvatarUrl(data.publicUrl + '?t=' + Date.now())
    }
    setAvatarUploading(false); e.target.value = ''
  }

  const uploadBgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setBgImgUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/bg.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setBgImgUrl(data.publicUrl + '?t=' + Date.now())
    }
    setBgImgUploading(false); e.target.value = ''
  }

  const tplEntries = (Object.entries(TEMPLATES) as [TemplateId, typeof TEMPLATES[TemplateId]][])
    .filter(([,t]) => {
      if (themeFilter === 'light') return !t.isPremium && (t.pageBg.match(/#[def][0-9a-f]/i) || t.pageBg.includes('white') || t.pageBg.includes('#f') || t.pageBg.includes('255'))
      if (themeFilter === 'dark')  return !t.isPremium && (t.pageBg.includes('#0') || t.pageBg.includes('#1') || t.pageBg.includes('#2'))
      return true
    })

  const TABS: { id: RightTab; Icon: React.ElementType; label: string }[] = [
    { id: 'design',     Icon: Palette,   label: 'Design'  },
    { id: 'style',      Icon: Sliders,   label: 'Style'   },
    { id: 'background', Icon: ImageIcon, label: 'BG'      },
    { id: 'profile',    Icon: User,      label: 'Profile' },
  ]

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white border-l border-gray-100">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-all border-b-2 ${
              tab === t.id ? 'border-[#333A2F] text-[#333A2F]' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            <t.Icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── DESIGN tab ── */}
        {tab === 'design' && (
          <div className="p-4 space-y-5">
            {/* AI Generator — disabled (no Anthropic credits) */}

            {/* Select Theme */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-700">Theme</p>
              </div>
              <div className="flex gap-1.5 mb-3">
                {(['all','light','dark'] as const).map(f => (
                  <button key={f} onClick={() => setThemeFilter(f)}
                    className={`px-3 py-1 text-[11px] rounded-full font-semibold transition-all capitalize ${themeFilter===f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tplEntries.map(([id, tpl]) => (
                  <div key={id} onClick={() => !tpl.isPremium && setTemplateId(id)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      templateId === id ? 'border-[#333A2F] shadow-md' : 'border-gray-100 hover:border-gray-300'
                    } ${tpl.isPremium ? 'cursor-not-allowed' : ''}`}>
                    <div className="h-20 p-2 flex flex-col items-center justify-center gap-1" style={{ background: tpl.pageBg }}>
                      <div className="w-5 h-5 rounded-full" style={{ background: tpl.cardBg, border: `2px solid ${tpl.cardBorder}` }} />
                      <div className="w-10 h-1 rounded" style={{ background: tpl.textColor, opacity:.8 }} />
                      <div className="w-full h-3 rounded-lg" style={{ background: tpl.btnBg, border:`1px solid ${tpl.btnBorder}` }} />
                      <div className="w-full h-3 rounded-lg" style={{ background: tpl.btnBg, border:`1px solid ${tpl.btnBorder}` }} />
                    </div>
                    <div className="px-2 py-1.5 bg-white flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-600 truncate">{tpl.label}</span>
                      {templateId === id && !tpl.isPremium && <Check size={10} className="flex-shrink-0" style={{ color: '#333A2F' }} />}
                    </div>
                    {tpl.isPremium && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                        <Lock size={12} className="text-white" />
                        <span className="text-[9px] text-white bg-amber-500 px-1.5 py-0.5 rounded font-bold">PRO</span>
                      </div>
                    )}
                    {templateId === id && !tpl.isPremium && (
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#333A2F' }}>
                        <Check size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Layout */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-3">Layout</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(LAYOUTS) as [LayoutId, typeof LAYOUTS[LayoutId]][]).map(([id, l]) => (
                  <button key={id} onClick={() => !l.isPremium && setLayoutId(id)}
                    className={`relative p-2.5 rounded-xl border-2 text-left transition-all ${
                      layoutId===id && !l.isPremium ? 'border-[#333A2F] bg-[#EBEDDF]/50' : 'border-gray-100 hover:border-gray-200'
                    } ${l.isPremium ? 'cursor-not-allowed opacity-70' : ''}`}>
                    <p className="text-[10px] font-bold text-gray-700">{l.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{l.description}</p>
                    {l.isPremium && <span className="absolute top-1.5 right-1.5 text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-bold">PRO</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-3">Page Font</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FONTS).map(([k, f]) => (
                  <button key={k} onClick={() => set('pageFont', k)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${settings.pageFont===k ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-100 hover:border-gray-200'}`}>
                    <p className="text-lg font-bold text-gray-800 leading-tight" style={{ fontFamily: f.css }}>Aa</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{f.label}</p>
                  </button>
                ))}
              </div>

              {/* Button shape → updates linkRadius */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Button Shape</p>
                <div className="flex gap-2">
                  {[
                    { label:'Pill',    radius:999 },
                    { label:'Rounded', radius:16  },
                    { label:'Square',  radius:6   },
                  ].map(s => (
                    <button key={s.label} onClick={() => set('linkRadius', s.radius)}
                      className={`flex-1 py-2.5 text-[11px] font-semibold transition-all border-2 ${settings.linkRadius===s.radius ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      style={{ borderRadius: s.radius + 'px' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STYLE tab ── */}
        {tab === 'style' && (
          <div className="p-4 space-y-6">

            {/* Avatar */}
            <section className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avatar</p>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Shape</p>
                <div className="flex gap-2">
                  {[
                    { key:'circle',  label:'Circle',  icon:'⬤' },
                    { key:'rounded', label:'Rounded', icon:'▣' },
                    { key:'square',  label:'Square',  icon:'■' },
                  ].map(s => (
                    <button key={s.key} onClick={() => set('avatarShape', s.key as CustomSettings['avatarShape'])}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                        settings.avatarShape===s.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      <span className="text-base">{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Border</p>
                <Toggle on={settings.avatarBorder} onChange={() => set('avatarBorder', !settings.avatarBorder)} />
              </div>

              {settings.avatarBorder && (
                <div className="grid grid-cols-2 gap-3 pl-1">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">Color</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-white ring-2 ring-gray-200"
                        style={{ background: settings.avatarBorderColor }}>
                        <input type="color" value={settings.avatarBorderColor}
                          onChange={e => set('avatarBorderColor', e.target.value)}
                          className="opacity-0 w-0 h-0" />
                      </div>
                      <span className="text-xs font-mono text-gray-600">{settings.avatarBorderColor}</span>
                    </label>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Width: {settings.avatarBorderWidth}px</p>
                    <input type="range" min={1} max={8} value={settings.avatarBorderWidth}
                      onChange={e => set('avatarBorderWidth', +e.target.value)}
                      className="w-full accent-[#333A2F]" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Drop Shadow</p>
                <Toggle on={settings.avatarShadow} onChange={() => set('avatarShadow', !settings.avatarShadow)} />
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Name */}
            <section className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name Style</p>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Size</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(['sm','base','lg','xl','2xl','3xl'] as const).map(s => (
                    <button key={s} onClick={() => set('nameSize', s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border-2 ${settings.nameSize===s ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Weight</p>
                <div className="flex gap-1.5">
                  {([['400','Regular'],['600','Semibold'],['700','Bold'],['900','Black']] as const).map(([w,l]) => (
                    <button key={w} onClick={() => set('nameWeight', w)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] transition-all border-2 ${settings.nameWeight===w ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      style={{ fontWeight: w }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Color override</p>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-white ring-2 ring-gray-200"
                      style={{ background: settings.nameColor || '#374151' }}>
                      <input type="color" value={settings.nameColor || '#374151'}
                        onChange={e => set('nameColor', e.target.value)}
                        className="opacity-0 w-0 h-0" />
                    </div>
                  </label>
                  <span className="text-xs font-mono text-gray-600 flex-1">{settings.nameColor || '(template default)'}</span>
                  {settings.nameColor && (
                    <button onClick={() => set('nameColor', '')} className="text-[10px] text-red-400 hover:text-red-600">Reset</button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Font override (name only)</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => set('nameFont', '')}
                    className={`p-2 rounded-lg border-2 text-[10px] font-semibold transition-all ${!settings.nameFont ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500'}`}>
                    Same as page
                  </button>
                  {Object.entries(FONTS).filter(([k]) => k !== 'default').map(([k, f]) => (
                    <button key={k} onClick={() => set('nameFont', k)}
                      className={`p-2 rounded-lg border-2 text-left transition-all ${settings.nameFont===k ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <p className="text-sm font-bold text-gray-800 leading-tight" style={{ fontFamily: f.css }}>Aa</p>
                      <p className="text-[9px] text-gray-500">{f.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Links */}
            <section className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Links</p>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Icon position</p>
                <div className="flex gap-2">
                  {([
                    { key:'left',  label:'Left'  },
                    { key:'right', label:'Right' },
                    { key:'none',  label:'Hidden'},
                  ] as const).map(o => (
                    <button key={o.key} onClick={() => set('linkIconPos', o.key)}
                      className={`flex-1 py-2 rounded-xl border-2 text-[11px] font-semibold transition-all ${settings.linkIconPos===o.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1">Radius: {settings.linkRadius}px</p>
                <input type="range" min={0} max={999} value={settings.linkRadius}
                  onChange={e => set('linkRadius', +e.target.value)}
                  className="w-full accent-[#333A2F]" />
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>Square</span><span>Rounded</span><span>Pill</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Height</p>
                <div className="flex gap-2">
                  {([['sm','Compact'],['md','Normal'],['lg','Tall']] as const).map(([h,l]) => (
                    <button key={h} onClick={() => set('linkHeight', h)}
                      className={`flex-1 py-2 rounded-xl border-2 text-[11px] font-semibold transition-all ${settings.linkHeight===h ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Custom background</p>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-white ring-2 ring-gray-200"
                      style={{ background: settings.linkBgCustom || '#e5e7eb' }}>
                      <input type="color" value={settings.linkBgCustom || '#e5e7eb'}
                        onChange={e => set('linkBgCustom', e.target.value)}
                        className="opacity-0 w-0 h-0" />
                    </div>
                  </label>
                  <span className="text-xs font-mono text-gray-600 flex-1">{settings.linkBgCustom || '(template default)'}</span>
                  {settings.linkBgCustom && (
                    <button onClick={() => set('linkBgCustom', '')} className="text-[10px] text-red-400 hover:text-red-600">Reset</button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Border</p>
                <Toggle on={settings.linkBorder} onChange={() => set('linkBorder', !settings.linkBorder)} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Drop Shadow</p>
                <Toggle on={settings.linkShadow} onChange={() => set('linkShadow', !settings.linkShadow)} />
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Products */}
            <section className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Products</p>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Image shape</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key:'square',   label:'Square',   icon:'■' },
                    { key:'portrait', label:'Portrait', icon:'▬' },
                    { key:'wide',     label:'Wide 16:9',icon:'▭' },
                    { key:'circle',   label:'Circle',   icon:'⬤' },
                  ] as const).map(s => (
                    <button key={s.key} onClick={() => set('productImgRatio', s.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-[11px] font-semibold transition-all ${settings.productImgRatio===s.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <span>{s.icon}</span>{s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Columns</p>
                <div className="flex gap-2">
                  {([2,3] as const).map(n => (
                    <button key={n} onClick={() => set('productCols', n)}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${settings.productCols===n ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {n} cols
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-1">Card radius: {settings.productRounded}px</p>
                <input type="range" min={0} max={24} value={settings.productRounded}
                  onChange={e => set('productRounded', +e.target.value)}
                  className="w-full accent-[#333A2F]" />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Show price</p>
                <Toggle on={settings.productShowPrice} onChange={() => set('productShowPrice', !settings.productShowPrice)} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">Show description</p>
                <Toggle on={settings.productShowDesc} onChange={() => set('productShowDesc', !settings.productShowDesc)} />
              </div>
            </section>
          </div>
        )}

        {/* ── BACKGROUND tab ── */}
        {tab === 'background' && (
          <div className="p-4 space-y-5">
            <p className="text-xs font-bold text-gray-700">Background</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id:'default',  label:'Template', Icon:Sparkles  },
                { id:'color',    label:'Color',    Icon:Palette   },
                { id:'gradient', label:'Gradient', Icon:BarChart3 },
                { id:'image',    label:'Image',    Icon:ImageIcon },
              ] as {id:BgType; label:string; Icon:React.ElementType}[]).map(t => (
                <button key={t.id} onClick={() => setBgType(t.id)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${bgType===t.id ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <t.Icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            {bgType === 'default' && (
              <p className="text-xs text-gray-400 text-center py-4">Uses your selected theme's background.</p>
            )}

            {bgType === 'color' && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <div className="w-10 h-10 rounded-xl shadow border-2 border-white ring-2 ring-gray-200 cursor-pointer hover:ring-[#333A2F] transition-all" style={{ background: bgColor }}>
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="opacity-0 w-0 h-0" />
                  </div>
                  <div>
                    <p className="text-sm font-mono font-bold text-gray-700">{bgColor.toUpperCase()}</p>
                    <p className="text-[11px] text-gray-400">Click to pick color</p>
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['#F9FAFB','#111827','#FAFAF8','#0D0D0D','#7C3AED','#DB2777','#0891b2','#059669','#F59E0B','#EF4444','#ECEFF4','#FFF8F0'].map(c => (
                    <button key={c} onClick={() => setBgColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor===c ? 'border-[#333A2F] scale-110' : 'border-white ring-1 ring-gray-200'}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}

            {bgType === 'gradient' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Linear</p>
                  <div className="grid grid-cols-4 gap-2">
                    {GRADIENTS.map(g => (
                      <button key={g} onClick={() => setBgGradient(g)}
                        className={`h-10 rounded-xl transition-all ${bgGradient===g ? 'ring-2 ring-[#333A2F] ring-offset-2 scale-105' : 'hover:scale-[1.03]'}`}
                        style={{ background: g }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Mesh</p>
                  <div className="grid grid-cols-3 gap-2">
                    {MESHES.map(g => (
                      <button key={g.slice(0,20)} onClick={() => setBgGradient(g)}
                        className={`h-12 rounded-xl transition-all ${bgGradient===g ? 'ring-2 ring-[#333A2F] ring-offset-2 scale-105' : 'hover:scale-[1.03]'}`}
                        style={{ background: g }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 mb-1">Custom CSS</p>
                  <input type="text" value={bgGradient} onChange={e => setBgGradient(e.target.value)}
                    className="w-full px-3 py-2 text-[11px] font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
                  <div className="h-8 rounded-xl mt-2 shadow-inner" style={{ background: bgGradient }} />
                </div>
              </div>
            )}

            {bgType === 'image' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Best with <strong>Overlay</strong> or <strong>Magazine</strong> layout.</p>
                <input type="url" placeholder="https://image-url.jpg" value={bgImgUrl} onChange={e => setBgImgUrl(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${bgImgUploading ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-[#333A2F]/50'}`}>
                  <input type="file" accept="image/*" onChange={uploadBgImage} className="hidden" disabled={bgImgUploading} />
                  <Upload size={16} className={bgImgUploading ? 'animate-bounce' : 'text-gray-400'} />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">{bgImgUploading ? 'Uploading…' : 'Upload photo'}</p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP</p>
                  </div>
                </label>
                {bgImgUrl && (
                  <div className="relative rounded-xl overflow-hidden h-28">
                    <img src={bgImgUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <p className="text-white text-[11px] font-medium">With overlay</p>
                    </div>
                    <button onClick={() => setBgImgUrl('')}
                      className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/80 text-white text-[10px] rounded-lg backdrop-blur">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE tab ── */}
        {tab === 'profile' && (
          <div className="p-4 space-y-5">
            <p className="text-xs font-bold text-gray-700">Profile Info</p>

            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Avatar</p>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: '#333A2F' }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white text-2xl font-bold">{(displayName||'U')[0].toUpperCase()}</span>
                  }
                </div>
                <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${avatarUploading ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-[#333A2F]/50'}`}>
                  <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={avatarUploading} />
                  <Upload size={14} className={avatarUploading ? 'animate-bounce' : 'text-gray-400'} />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">{avatarUploading ? 'Uploading…' : 'Change photo'}</p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Display Name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Write something about yourself…" rows={4}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
              <p className="text-[10px] text-gray-400 mt-1">{bio.length}/160 characters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main EditorPage ──────────────────────────────────────────────────────────
export default function EditorPage() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [templateId, setTemplateId] = useState<TemplateId>((profile?.template_id ?? 'minimal') as TemplateId)
  const [layoutId,   setLayoutId]   = useState<LayoutId>((profile?.layout_id ?? 'centered') as LayoutId)
  const [customBg,   setCustomBg]   = useState<string | null>(profile?.custom_bg ?? null)
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null)
  const [settings, setSettings] = useState<CustomSettings>({
    ...DEFAULT_SETTINGS,
    ...(profile?.custom_settings ?? {}),
  })

  const [links,    setLinks]    = useState<BioLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [albums,   setAlbums]   = useState<PhotoAlbum[]>([])
  const [loading,  setLoading]  = useState(true)

  const [zoom, setZoom] = useState(0.72)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  useEffect(() => {
    if (!profile?.id) return
    Promise.all([
      supabase.from('bio_links').select('*').eq('user_id', profile.id).order('sort_order'),
      supabase.from('products').select('*').eq('user_id', profile.id).order('sort_order'),
      supabase.from('photo_albums').select('*').eq('user_id', profile.id).order('sort_order'),
    ]).then(([l, p, a]) => {
      setLinks(l.data ?? [])
      setProducts(p.data ?? [])
      setAlbums(a.data ?? [])
      setLoading(false)
    })
  }, [profile?.id])

  const publish = async () => {
    if (!profile?.id) return
    setSaving(true)
    await supabase.from('profiles').update({
      template_id:     templateId,
      layout_id:       layoutId,
      custom_bg:       customBg,
      display_name:    displayName || null,
      bio:             bio || null,
      avatar_url:      avatarUrl,
      custom_settings: settings,
    }).eq('id', profile.id)
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const previewProfile: PProfile = {
    username: profile?.username ?? null,
    displayName: displayName || null,
    bio: bio || null,
    avatarUrl: avatarUrl,
  }

  const publicUrl = profile?.username ? `${window.location.origin}/u/${profile.username}` : '#'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f5f5f7]">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0 z-30">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all">
            <ArrowLeft size={18} />
          </button>
          <img src="/logo.png" alt="DONLY" className="w-20 object-contain flex-shrink-0 hidden sm:block" />
        </div>

        <div className="flex-1 flex items-center gap-2 justify-center">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 max-w-xs w-full">
            <Smartphone size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate flex-1">{publicUrl.replace(/https?:\/\//, '')}</span>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
              <ExternalLink size={12} className="text-gray-400 hover:text-[#333A2F] transition-colors" />
            </a>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-1 py-1">
            <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white transition-all">
              <ZoomOut size={14} />
            </button>
            <span className="text-xs font-semibold text-gray-600 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.0, +(z + 0.1).toFixed(1)))}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white transition-all">
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setLeftOpen(o => !o)}
            className={`hidden lg:flex p-2 rounded-xl transition-all ${leftOpen ? 'text-[#333A2F] bg-[#EBEDDF]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="5" height="14" rx="1.5" fill="currentColor" opacity=".5"/>
              <rect x="8" y="1" width="7" height="14" rx="1.5" fill="currentColor"/>
            </svg>
          </button>
          <button onClick={() => setRightOpen(o => !o)}
            className={`hidden lg:flex p-2 rounded-xl transition-all ${rightOpen ? 'text-[#333A2F] bg-[#EBEDDF]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="0" y="1" width="7" height="14" rx="1.5" fill="currentColor"/>
              <rect x="9" y="1" width="6" height="14" rx="1.5" fill="currentColor" opacity=".5"/>
            </svg>
          </button>
          <button onClick={publish} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: '#333A2F' }}>
            {saved ? <><Check size={14} /> Published!</> : saving ? 'Saving…' : <><Sparkles size={14} /> Publish</>}
          </button>
        </div>
      </header>

      {/* 3-panel body */}
      <div className="flex-1 flex overflow-hidden">
        {leftOpen && (
          <aside className="w-72 xl:w-80 bg-white border-r border-gray-100 flex-shrink-0 overflow-hidden flex flex-col">
            <LeftPanel
              links={links} setLinks={setLinks}
              products={products} albums={albums}
              userId={profile?.id ?? ''}
            />
          </aside>
        )}

        <main className="flex-1 overflow-auto flex flex-col items-center py-8 px-4 gap-6">
          {loading
            ? <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
              </div>
            : (
              <>
                <PhoneFrame zoom={zoom}>
                  <MiniPreview
                    profile={previewProfile}
                    links={links}
                    products={products}
                    albums={albums}
                    templateId={templateId}
                    layoutId={layoutId}
                    customBg={customBg}
                    settings={settings}
                  />
                </PhoneFrame>
                <p className="text-xs text-gray-400 select-none">Scroll inside the phone to see more</p>
              </>
            )
          }
        </main>

        {rightOpen && (
          <aside className="w-80 xl:w-96 flex-shrink-0 overflow-hidden flex flex-col">
            <RightPanel
              templateId={templateId} setTemplateId={setTemplateId}
              layoutId={layoutId} setLayoutId={setLayoutId}
              customBg={customBg} setCustomBg={setCustomBg}
              settings={settings} setSettings={setSettings}
              displayName={displayName} setDisplayName={setDisplayName}
              bio={bio} setBio={setBio}
              avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}
              userId={profile?.id ?? ''}
            />
          </aside>
        )}
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  )
}
