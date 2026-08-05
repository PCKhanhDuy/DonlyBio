import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, BarChart2, Palette, Music2, MessageSquare,
  QrCode, Link2, Globe, Zap, Users, Star, Check, Shield, Layers,
} from 'lucide-react'
import {
  SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify,
  SiGithub, SiTelegram, SiWhatsapp, SiX, SiThreads,
} from 'react-icons/si'

// ─── Scroll fade-in wrapper ────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Section label ─────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 18 }}>
      {children}
    </p>
  )
}

// ─── Phone mockup ──────────────────────────────────────────────────────────────
function PhoneMockup() {
  const links = [
    { color: '#E1306C', label: 'Instagram', w: 90 },
    { color: '#010101', label: 'TikTok', w: 70 },
    { color: '#FF0000', label: 'YouTube', w: 80 },
    { color: '#6366f1', label: 'Portfolio', w: 100 },
  ]
  return (
    <div style={{
      width: 258, height: 530, borderRadius: 48, flexShrink: 0,
      background: '#0a0a10',
      boxShadow: '0 0 0 2px rgba(255,255,255,.12), 0 0 0 4px rgba(255,255,255,.04), 0 80px 120px rgba(0,0,0,.8)',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Top notch */}
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 90, height: 9, background: '#111', borderRadius: 99, zIndex: 10 }} />
      {/* Gradient overlay at top */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% -20%, rgba(99,102,241,.25) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ padding: '44px 18px 22px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11 }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'conic-gradient(from 0deg,#6366f1,#ec4899,#f59e0b,#6366f1)', opacity: .7, filter: 'blur(4px)' }} />
          <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', border: '2px solid rgba(0,0,0,.4)' }} />
        </div>

        {/* Name bars */}
        <div style={{ height: 10, width: 120, background: 'rgba(255,255,255,.88)', borderRadius: 99 }} />
        <div style={{ height: 7, width: 80, background: 'rgba(255,255,255,.28)', borderRadius: 99 }} />

        {/* Social dots row */}
        <div style={{ display: 'flex', gap: 7, paddingBottom: 4 }}>
          {['#E1306C', '#010101', '#FF0000', '#1DA1F2'].map((c, i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 8, background: c }} />
          ))}
        </div>

        {/* Link cards */}
        {links.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            style={{
              width: 210, height: 40, borderRadius: 13,
              background: `linear-gradient(90deg, ${l.color}20, rgba(255,255,255,.03))`,
              border: `1px solid ${l.color}35`,
              display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 10,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
            <div style={{ height: 7, width: l.w, background: 'rgba(255,255,255,.5)', borderRadius: 99 }} />
          </motion.div>
        ))}

        {/* Music player */}
        <div style={{ width: 210, borderRadius: 13, background: 'rgba(30,215,96,.07)', border: '1px solid rgba(30,215,96,.22)', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#1ED760', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><path d="M0 0L9 5.5L0 11V0Z" fill="black" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, width: 80, background: 'rgba(255,255,255,.6)', borderRadius: 99, marginBottom: 5 }} />
              <div style={{ height: 3, background: 'rgba(30,215,96,.35)', borderRadius: 99, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '100%', background: '#1ED760', borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom url */}
        <div style={{ marginTop: 'auto', padding: '5px 14px', borderRadius: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>donlybio.vercel.app/u/you</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bento feature card ─────────────────────────────────────────────────────────
function BentoCard({
  icon: Icon, title, desc, accent = '#6366f1', span = 1, tall = false, children,
}: {
  icon: React.ElementType; title: string; desc: string; accent?: string; span?: number; tall?: boolean; children?: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, borderColor: `${accent}55` }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: 20, padding: '28px 26px',
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        gridColumn: `span ${span}`,
        minHeight: tall ? 240 : 170,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden', cursor: 'default',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }} />
      <div>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Icon size={18} color={accent} />
        </div>
        <p style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 7 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.65 }}>{desc}</p>
      </div>
      {children}
    </motion.div>
  )
}

// ─── Platforms ──────────────────────────────────────────────────────────────────
const PLATFORMS: [React.ElementType, string][] = [
  [SiInstagram, '#E1306C'], [SiTiktok, '#fff'], [SiYoutube, '#FF0000'],
  [SiFacebook, '#1877F2'], [SiSpotify, '#1ED760'], [SiGithub, '#fff'],
  [SiTelegram, '#229ED9'], [SiWhatsapp, '#25D366'], [SiX, '#fff'], [SiThreads, '#fff'],
]

// ─── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Minh Khoa', role: 'Content Creator', color: '#6366f1', text: 'Profile mình trông xịn hẳn sau khi dùng DONLY. Khách hàng cứ hỏi dùng tool design gì.' },
  { name: 'Thu Hương', role: 'Freelance Designer', color: '#ec4899', text: 'Music player là tính năng yêu thích nhất. Fan nghe nhạc ngay trên bio mà không cần mở app khác.' },
  { name: 'Anh Tú', role: 'Photographer', color: '#3b82f6', text: 'Layout Gallery hiển thị portfolio cực kỳ đẹp. Lần đầu thấy bio link có thể làm điều này.' },
  { name: 'Linh Chi', role: 'Musician', color: '#10b981', text: 'Từ khi bật Spotify embed, thời gian khách ở lại trang bio của mình tăng gấp đôi.' },
  { name: 'Duy Phong', role: 'YouTuber', color: '#f59e0b', text: 'Analytics giúp mình biết hôm nào traffic cao, content nào đang dẫn nhiều click nhất.' },
  { name: 'Hà My', role: 'KOL / Influencer', color: '#ef4444', text: 'Templates PRO đẹp vô cùng. Brand mình trông professional mà không cần thuê designer.' },
]

const FREE_F = ['30+ templates & themes', '13 layout miễn phí', 'Không giới hạn links', 'Music player + QR code', 'Contact form + Inbox', 'Testimonials block', 'Analytics 7 & 30 ngày', 'VCard download', 'GitHub Stats block']
const PRO_F = ['Tất cả tính năng Free', '4 templates PRO độc quyền', '7 layouts PRO độc quyền', 'Analytics 90 ngày + CTR', 'Bảo vệ trang bằng mật khẩu', 'Custom CSS không giới hạn', 'Background image / gradient', 'Announcement banner PRO']

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div style={{ background: '#060608', color: '#fff', overflowX: 'hidden', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 64, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,6,8,.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#333A2F,#5a7a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#EBEDDF' }}>D</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: 19, letterSpacing: '-0.04em' }}>DONLY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, fontWeight: 500, padding: '8px 14px' }}>
            Đăng nhập
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
            <Link to="/login" style={{
              background: '#fff', color: '#0a0a0a', fontWeight: 800, fontSize: 14,
              padding: '9px 20px', borderRadius: 12,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              Bắt đầu <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-5%', left: '5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.11) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '0%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center,black 30%,transparent 80%)',
        }} />

        <div style={{ maxWidth: 1180, width: '100%', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left */}
          <div style={{ flex: '1 1 380px', maxWidth: 560 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, ease: [.21,.47,.32,.98] }}
            >
              {/* Status chip */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', marginBottom: 32 }}>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, .6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8' }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>Bio link thế hệ mới cho người Việt</span>
              </div>

              <h1 style={{ fontSize: 'clamp(44px,5.5vw,76px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.04, marginBottom: 26 }}>
                Một link.{' '}
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 25%, #f472b6 60%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Mọi thứ của bạn.
                </span>
              </h1>

              <p style={{ fontSize: 18, color: 'rgba(255,255,255,.48)', lineHeight: 1.75, marginBottom: 38, maxWidth: 460 }}>
                Tạo trang bio cá nhân đẹp và chuyên nghiệp trong&nbsp;
                <span style={{ color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>2 phút</span>.
                Links, nhạc, contact form, analytics — tất cả qua&nbsp;
                <span style={{ color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>một URL duy nhất</span>.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
                  <Link to="/login" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#fff', color: '#0a0a0a', fontWeight: 800, fontSize: 15,
                    padding: '14px 28px', borderRadius: 14,
                    boxShadow: '0 4px 24px rgba(255,255,255,.18)',
                  }}>
                    Tạo trang miễn phí <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
                  <Link to="/u/demo" target="_blank" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.7)', fontWeight: 600, fontSize: 15,
                    padding: '14px 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)',
                  }}>
                    Xem demo
                  </Link>
                </motion.div>
              </div>

              {/* Trust */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map((c, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #060608', marginLeft: i > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', zIndex: 5 - i }}>
                      {['M', 'T', 'A', 'L', 'D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', fontWeight: 500 }}>1,000+ creators Việt Nam đang dùng</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: phone + floating cards */}
          <div style={{ position: 'relative', width: 400, height: 580, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow */}
            <motion.div
              animate={{ opacity: [.5, .8, .5] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)', pointerEvents: 'none' }}
            />
            {/* Phone */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ zIndex: 2 }}
            >
              <PhoneMockup />
            </motion.div>

            {/* Floating cards */}
            {[
              { top: 48, left: -10, delay: 0, duration: 3.8, content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart2 size={15} color="#10b981" /></div>
                  <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 2 }}>Hôm nay</p><p style={{ fontSize: 14, fontWeight: 800 }}>+128 views</p></div>
                </div>
              )},
              { top: 155, right: -20, delay: .5, duration: 4.2, content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(236,72,153,.15)', border: '1px solid rgba(236,72,153,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={15} color="#ec4899" /></div>
                  <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 2 }}>Tin nhắn mới</p><p style={{ fontSize: 13, fontWeight: 700 }}>Hà My: "Cho mình hỏi..."</p></div>
                </div>
              )},
              { bottom: 195, left: -15, delay: 1, duration: 4.5, content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(30,215,96,.15)', border: '1px solid rgba(30,215,96,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M0 0L10 6L0 12V0Z" fill="#1ED760" /></svg>
                  </div>
                  <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 2 }}>Đang phát</p><p style={{ fontSize: 13, fontWeight: 700 }}>Spotify embedded</p></div>
                </div>
              )},
              { bottom: 72, right: -5, delay: .3, duration: 3.5, content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={15} color="#f59e0b" /></div>
                  <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 2 }}>Link click</p><p style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>+42% ↑</p></div>
                </div>
              )},
            ].map((b, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
                style={{
                  position: 'absolute', zIndex: 10,
                  background: 'rgba(12,12,18,.85)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 16, padding: '12px 16px',
                  boxShadow: '0 8px 40px rgba(0,0,0,.5)',
                  top: 'top' in b ? b.top : undefined,
                  bottom: 'bottom' in b ? b.bottom : undefined,
                  left: 'left' in b ? b.left : undefined,
                  right: 'right' in b ? b.right : undefined,
                  whiteSpace: 'nowrap',
                }}
              >
                {b.content}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORMS MARQUEE ───────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '24px 0', overflow: 'hidden', background: 'rgba(255,255,255,.015)' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content', gap: 0 }}
        >
          {[...PLATFORMS, ...PLATFORMS].map(([Icon, color], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 32px', color: 'rgba(255,255,255,.25)', flexShrink: 0 }}>
              <Icon size={17} color={color as string} style={{ opacity: .55 }} />
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>
                {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Spotify', 'GitHub', 'Telegram', 'WhatsApp', 'X (Twitter)', 'Threads'][i % 10]}
              </span>
              <span style={{ margin: '0 8px', opacity: .2 }}>·</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '88px 40px', background: '#060608' }}>
        <FadeUp>
          <div style={{ maxWidth: 820, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 2 }}>
            {[
              { n: '1,000+', sub: 'Creators đang dùng' },
              { n: '30+', sub: 'Templates đẹp' },
              { n: '19', sub: 'Layout options' },
              { n: '< 2 phút', sub: 'Để tạo trang bio' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '36px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
                <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 500, marginTop: 8 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── BENTO FEATURES ──────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#0a0a10' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ marginBottom: 56 }}>
              <Label>Tính năng</Label>
              <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 900, letterSpacing: '-0.04em', maxWidth: 480 }}>
                Một công cụ.<br />Vô số khả năng.
              </h2>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, gridAutoRows: 'minmax(170px,auto)' }}>
            {[
              { icon: Palette, title: 'Templates & Themes', desc: '30+ template đẹp, 19 layout — từ Minimal đến Magazine. Preview thật trước khi chọn.', accent: '#818cf8', span: 1 },
              { icon: BarChart2, title: 'Analytics chi tiết', desc: 'Biểu đồ views, clicks, CTR theo ngày. Dashboard rõ ràng, không cần tool thứ 3.', accent: '#34d399', span: 2 },
              { icon: Music2, title: 'Music Player', desc: 'Nhúng Spotify hoặc YouTube thẳng vào trang bio. Fan nghe nhạc mà không rời trang.', accent: '#1ED760', span: 1 },
              { icon: MessageSquare, title: 'Contact Form + Inbox', desc: 'Visitor nhắn tin trực tiếp, đọc trong Dashboard — không cần email hay Messenger.', accent: '#f472b6', span: 1 },
              { icon: Shield, title: 'Bảo vệ trang', desc: 'Đặt mật khẩu riêng cho trang bio. Phù hợp nội dung cần kiểm soát truy cập.', accent: '#fb923c', span: 1, pro: true },
              { icon: QrCode, title: 'QR Code', desc: 'Tạo QR dẫn về bio page, tải PNG để in danh thiếp, standee hoặc dùng offline.', accent: '#a78bfa', span: 1 },
              { icon: Globe, title: 'GitHub Stats', desc: 'Block live thống kê GitHub — repos, followers, bio tự cập nhật không cần thao tác.', accent: '#94a3b8', span: 1 },
              { icon: Layers, title: 'Custom CSS', desc: 'Nhập CSS tuỳ ý để customize không giới hạn. Full control cho designer & developer.', accent: '#60a5fa', span: 1, pro: true },
              { icon: Link2, title: 'Link nâng cao', desc: 'Schedule bật/tắt link theo lịch, hiệu ứng animation, VCard download 1 chạm.', accent: '#f59e0b', span: 1 },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06}>
                <BentoCard {...f}>
                  {f.pro && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 99, padding: '3px 10px', marginTop: 14, alignSelf: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pro</span>
                    </div>
                  )}
                </BentoCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#060608' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <Label>Cách hoạt động</Label>
              <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 900, letterSpacing: '-0.04em' }}>3 bước đơn giản</h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
            {[
              { n: '01', icon: Users, title: 'Đăng ký miễn phí', desc: 'Tạo tài khoản trong 10 giây — không cần thẻ ngân hàng, không điều kiện.', accent: '#818cf8' },
              { n: '02', icon: Palette, title: 'Tùy chỉnh trang bio', desc: 'Chọn template, thêm links, âm nhạc, contact form, testimonials...', accent: '#f472b6', highlight: true },
              { n: '03', icon: Zap, title: 'Chia sẻ link của bạn', desc: 'Paste URL duy nhất vào Instagram bio, TikTok, danh thiếp, mọi nơi.', accent: '#34d399' },
            ].map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.1}>
                <div style={{
                  padding: '36px 28px', borderRadius: 22,
                  background: s.highlight ? `linear-gradient(145deg,${s.accent}18,rgba(255,255,255,.03))` : 'rgba(255,255,255,.03)',
                  border: `1px solid ${s.highlight ? s.accent + '40' : 'rgba(255,255,255,.08)'}`,
                  height: '100%',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.accent}18`, border: `1px solid ${s.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={18} color={s.accent} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '0.15em' }}>BƯỚC {s.n}</span>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.42)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#0a0a10' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Label>Testimonials</Label>
              <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 14 }}>
                Được yêu thích bởi creators
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', marginLeft: 6, fontWeight: 500 }}>5.0 / 5.0</span>
              </div>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.07}>
                <motion.div
                  whileHover={{ borderColor: `${t.color}40`, y: -3 }}
                  transition={{ duration: .2 }}
                  style={{ padding: '24px', borderRadius: 18, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', height: '100%' }}
                >
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, marginBottom: 20 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                      {t.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#060608' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Label>Pricing</Label>
              <h2 style={{ fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>Đơn giản. Minh bạch.</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.38)' }}>Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng.</p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 16 }}>
            {/* Free */}
            <FadeUp delay={0.05}>
              <div style={{ padding: '36px', borderRadius: 24, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)', height: '100%' }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 10 }}>Free</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>0</span>
                  <span style={{ fontSize: 20, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>₫</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', marginBottom: 28 }}>mãi mãi · không điều kiện</p>
                <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {FREE_F.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(129,140,248,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={10} style={{ color: '#818cf8' }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" style={{
                  display: 'block', textAlign: 'center', padding: '14px',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,.12)',
                  fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,.7)',
                  transition: 'all .2s',
                }}>
                  Bắt đầu miễn phí
                </Link>
              </div>
            </FadeUp>

            {/* Pro */}
            <FadeUp delay={0.12}>
              <div style={{ padding: '36px', borderRadius: 24, background: 'linear-gradient(145deg,rgba(99,102,241,.12),rgba(236,72,153,.08),rgba(6,6,8,1) 70%)', border: '1px solid rgba(99,102,241,.35)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)' }} />
                <div style={{ position: 'absolute', top: 28, right: 28, background: 'linear-gradient(135deg,#f59e0b,#f97316)', borderRadius: 99, padding: '3px 10px' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#000', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pro</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 10 }}>Pro</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>149K</span>
                  <span style={{ fontSize: 20, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>₫/tháng</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', marginBottom: 28 }}>≈ 5,000₫/ngày · hủy bất kỳ lúc nào</p>
                <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {PRO_F.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,.7)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(245,158,11,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={10} style={{ color: '#fbbf24' }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" style={{
                  display: 'block', textAlign: 'center', padding: '14px',
                  borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  fontWeight: 800, fontSize: 15, color: '#fff',
                  boxShadow: '0 8px 32px rgba(99,102,241,.35)', transition: 'all .2s',
                }}>
                  Nâng cấp Pro ngay →
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 40px 100px' }}>
        <FadeUp>
          <div style={{
            maxWidth: 960, margin: '0 auto',
            borderRadius: 28, padding: '88px 40px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            background: '#0a0a10',
            border: '1px solid rgba(255,255,255,.08)',
          }}>
            <div style={{ position: 'absolute', top: '-40%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(32px,4vw,58px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
                Bắt đầu ngay hôm nay.
                <br />
                <span style={{
                  background: 'linear-gradient(135deg,#a5b4fc,#f472b6,#fb923c)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Miễn phí mãi mãi.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.4)', marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
                Không cần thẻ ngân hàng. Tạo trang bio trong 2 phút.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} style={{ display: 'inline-block' }}>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  background: '#fff', color: '#0a0a0a', fontWeight: 900,
                  padding: '18px 40px', borderRadius: 16, fontSize: 16,
                  boxShadow: '0 0 0 1px rgba(255,255,255,.15),0 8px 40px rgba(255,255,255,.2)',
                }}>
                  Tạo trang DONLY của bạn <ArrowRight size={18} />
                </Link>
              </motion.div>
              <p style={{ marginTop: 22, fontSize: 13, color: 'rgba(255,255,255,.2)', fontWeight: 500 }}>
                Miễn phí · Không giới hạn links · Không cần credit card
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#333A2F,#5a7a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: 13, color: '#EBEDDF' }}>D</span>
          </div>
          <span style={{ fontWeight: 800, color: 'rgba(255,255,255,.6)', fontSize: 14 }}>DONLY</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.2)' }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Đăng nhập', '/login'], ['Pricing', '/pricing']].map(([l, href]) => (
            <Link key={l} to={href} style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.18)', fontWeight: 500 }}>Made for creators in Vietnam</p>
      </footer>
    </div>
  )
}
