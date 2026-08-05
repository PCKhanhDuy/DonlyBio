import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Star, BarChart2, Palette, Music2, MessageSquare, QrCode, Zap, Layers } from 'lucide-react'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify, SiGithub, SiTelegram, SiWhatsapp, SiX, SiThreads } from 'react-icons/si'

const A = '#5B6AD0'
const AL = '#8b92e0'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const v = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Mini chart for analytics card ────────────────────────────────────────────
function MiniChart() {
  const bars = [35, 58, 42, 76, 55, 88, 64, 92, 70, 84, 60, 95, 78, 68]
  const max = Math.max(...bars)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60, padding: '0 4px', marginTop: 16 }}>
      {bars.map((h, i) => (
        <motion.div key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(h / max) * 100}%` }}
          transition={{ duration: .6, delay: i * .04, ease: 'easeOut' }}
          style={{ flex: 1, background: i >= bars.length - 3 ? A : `rgba(91,106,208,${.25 + i * .04})`, borderRadius: '3px 3px 0 0', minHeight: 4 }}
        />
      ))}
    </div>
  )
}

// ─── Mini player ───────────────────────────────────────────────────────────────
function MiniPlayer() {
  return (
    <div style={{ marginTop: 16, background: 'rgba(30,215,96,.07)', border: '1px solid rgba(30,215,96,.18)', borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1ED760', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="9" height="11" viewBox="0 0 9 11"><path d="M0 0L9 5.5L0 11Z" fill="#000" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, width: 90, background: 'rgba(255,255,255,.6)', borderRadius: 99, marginBottom: 5 }} />
          <div style={{ height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 99, position: 'relative', overflow: 'hidden' }}>
            <motion.div animate={{ width: ['28%', '72%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#1ED760', borderRadius: 99 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mini message ──────────────────────────────────────────────────────────────
function MiniMessage() {
  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '14px 14px 14px 4px', padding: '8px 12px', maxWidth: '80%' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', lineHeight: 1.4 }}>Cho mình hỏi về dịch vụ của bạn...</p>
      </div>
      <div style={{ alignSelf: 'flex-end', background: `rgba(91,106,208,.25)`, border: `1px solid rgba(91,106,208,.3)`, borderRadius: '14px 14px 4px 14px', padding: '8px 12px', maxWidth: '80%' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', lineHeight: 1.4 }}>Cảm ơn! Mình sẽ phản hồi sớm 👋</p>
      </div>
    </div>
  )
}

// ─── Mini QR ───────────────────────────────────────────────────────────────────
function MiniQR() {
  const pattern = [
    [1,1,1,0,1,1,1],[1,0,1,0,1,0,1],[1,1,1,0,1,1,1],
    [0,0,0,0,0,1,0],[1,0,1,1,0,0,1],[0,1,0,0,1,0,1],[1,0,1,0,1,1,1],
  ]
  return (
    <div style={{ marginTop: 16, display: 'inline-grid', gridTemplateColumns: `repeat(7, 10px)`, gap: 2 }}>
      {pattern.flat().map((cell, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: cell ? 'rgba(255,255,255,.7)' : 'transparent' }} />
      ))}
    </div>
  )
}

// ─── Mini code ─────────────────────────────────────────────────────────────────
function MiniCode() {
  return (
    <div style={{ marginTop: 16, fontFamily: '"SF Mono","Fira Code",monospace', fontSize: 11.5, lineHeight: 1.8, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '12px 14px' }}>
      <span style={{ color: AL }}>{'.'}</span><span style={{ color: '#7dd3fc' }}>bio-link</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{' {'}</span><br />
      <span style={{ color: 'rgba(255,255,255,.25)', paddingLeft: 14 }}>{'  '}</span><span style={{ color: '#f0abfc' }}>{'font-family'}</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{': '}</span><span style={{ color: '#86efac' }}>{'Playfair'}</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{';'}</span><br />
      <span style={{ paddingLeft: 14 }}></span><span style={{ color: '#f0abfc' }}>{'--accent'}</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{': '}</span><span style={{ color: '#86efac' }}>{'#a78bfa'}</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{';'}</span><br />
      <span style={{ color: 'rgba(255,255,255,.3)' }}>{'}'}</span>
    </div>
  )
}

// ─── Mini templates ────────────────────────────────────────────────────────────
function MiniTemplates() {
  const themes = [
    { bg: '#0d0d0d', accent: '#5B6AD0', name: 'Minimal Dark' },
    { bg: '#1a0a00', accent: '#f97316', name: 'Warm Tone' },
    { bg: '#0a0a14', accent: '#8b5cf6', name: 'Purple Night' },
  ]
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 7 }}>
      {themes.map(t => (
        <div key={t.name} style={{ flex: 1, height: 64, borderRadius: 10, background: t.bg, border: '1px solid rgba(255,255,255,.1)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: t.accent, opacity: .9 }} />
          <div style={{ position: 'absolute', bottom: 10, left: 7, right: 7, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 4, background: 'rgba(255,255,255,.3)', borderRadius: 99 }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 99, width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Phone preview ────────────────────────────────────────────────────────────
function BioPreview() {
  return (
    <div style={{
      width: 240, height: 480, borderRadius: 42, flexShrink: 0,
      background: '#0c0c0c',
      boxShadow: '0 0 0 1.5px rgba(255,255,255,.15), 0 0 0 3px rgba(255,255,255,.04), 0 60px 100px rgba(0,0,0,.9)',
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 70, height: 7, background: '#000', borderRadius: 99, zIndex: 5 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%,rgba(91,106,208,.2) 0%,transparent 55%)` }} />
      <div style={{ padding: '36px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, height: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,${A},${AL})`, border: '2px solid rgba(255,255,255,.1)', flexShrink: 0 }} />
        <div style={{ height: 9, width: 108, background: 'rgba(255,255,255,.85)', borderRadius: 99 }} />
        <div style={{ height: 6, width: 72, background: 'rgba(255,255,255,.22)', borderRadius: 99 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
          {['#E1306C','#010101','#FF0000','#1DA1F2'].map((c,i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: c, opacity: .8 }} />)}
        </div>
        {[100, 86, 92, 76].map((w, i) => (
          <div key={i} style={{ width: 196, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 9 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: A, opacity: .7 }} />
            <div style={{ height: 6, width: w, background: 'rgba(255,255,255,.38)', borderRadius: 99 }} />
          </div>
        ))}
        <div style={{ width: 196, borderRadius: 11, background: 'rgba(30,215,96,.07)', border: '1px solid rgba(30,215,96,.2)', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#1ED760', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="8" height="9" viewBox="0 0 8 9"><path d="M0 0L8 4.5L0 9Z" fill="#000"/></svg>
          </div>
          <div style={{ flex: 1 }}><div style={{ height: 5, width: 80, background: 'rgba(255,255,255,.5)', borderRadius: 99, marginBottom: 4 }} /><div style={{ height: 3, background: 'rgba(30,215,96,.3)', borderRadius: 99 }}><div style={{ width: '38%', height: '100%', background: '#1ED760', borderRadius: 99 }} /></div></div>
        </div>
        <div style={{ marginTop: 'auto', padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,.03)' }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,.2)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>donlybio.vercel.app/u/you</span>
        </div>
      </div>
    </div>
  )
}

const PLATFORMS: [React.ElementType, string, string][] = [
  [SiInstagram,'#E1306C','Instagram'],[SiTiktok,'#fff','TikTok'],[SiYoutube,'#FF0000','YouTube'],
  [SiFacebook,'#1877F2','Facebook'],[SiSpotify,'#1ED760','Spotify'],[SiGithub,'#fff','GitHub'],
  [SiTelegram,'#229ED9','Telegram'],[SiWhatsapp,'#25D366','WhatsApp'],[SiX,'#fff','X'],[SiThreads,'#fff','Threads'],
]

const TESTIMONIALS = [
  { name:'Minh Khoa', role:'Content Creator', text:'Profile mình trông chuyên nghiệp hẳn. Khách hàng cứ hỏi mình dùng tool gì để design đẹp thế.' },
  { name:'Thu Hương', role:'Freelance Designer', text:'Music player là tính năng tôi dùng nhiều nhất — fan nghe nhạc ngay trên bio, không cần mở app khác.' },
  { name:'Anh Tú', role:'Photographer', text:'Layout Gallery hiển thị portfolio rất ấn tượng. Lần đầu tôi thấy bio link có thể làm được điều này.' },
  { name:'Linh Chi', role:'Musician', text:'Thời gian khách ở lại trang bio tăng gấp đôi sau khi tích hợp Spotify embed. Thật sự ấn tượng.' },
  { name:'Duy Phong', role:'YouTuber', text:'Analytics giúp tôi biết chính xác hôm nào traffic cao và link nào được click nhiều nhất trong ngày.' },
  { name:'Hà My', role:'KOL & Influencer', text:'Templates Pro đẹp và rất chuyên nghiệp. Brand tôi trông ổn hẳn mà không cần thuê designer riêng.' },
]

const PLANS = [
  {
    id: 'starter', name: 'Starter', desc: 'Cá nhân mới bắt đầu.',
    monthly: 0, yearly: 0, highlight: false,
    cta: 'Bắt đầu miễn phí', href: '/login',
    features: ['Không giới hạn links','10 templates cơ bản','6 layout options','Analytics 7 ngày','QR code','Contact form & Inbox','Music player','GitHub Stats block'],
  },
  {
    id: 'creator', name: 'Creator', desc: 'Creator muốn nổi bật.',
    monthly: 59000, yearly: 39000, yearlyTotal: 468000, badge: 'Phổ biến', highlight: true,
    cta: 'Dùng thử 7 ngày', href: '/pricing',
    features: ['Tất cả Starter','30+ templates đẹp','13 layout options','Analytics 30 ngày','Testimonials block','VCard download 1 chạm','Link nâng cao & animation','Custom social icon bar'],
  },
  {
    id: 'pro', name: 'Pro', desc: 'Brand & agency chuyên nghiệp.',
    monthly: 99000, yearly: 65000, yearlyTotal: 780000, highlight: false,
    cta: 'Nâng cấp Pro', href: '/pricing',
    features: ['Tất cả Creator','4 templates PRO độc quyền','7 layouts PRO','Analytics 90 ngày + CTR','Bảo vệ trang bằng mật khẩu','Custom CSS không giới hạn','Background image & gradient','Priority support'],
  },
]

function fmt(n: number) { return n === 0 ? '0₫' : (n / 1000).toFixed(0) + 'K₫' }

export default function Landing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div style={{ background: '#000', color: '#fff', overflowX: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: 60, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: '#1a1f16', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#c5cba0' }}>D</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>DONLY</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/login" style={{ padding: '7px 14px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.45)' }}>Đăng nhập</Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
            <Link to="/login" style={{ padding: '8px 18px', fontSize: 14, fontWeight: 700, color: '#000', background: '#fff', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '-0.01em' }}>
              Bắt đầu <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '91vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 80px', overflow: 'hidden' }}>
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px)`, backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%,black,transparent)', pointerEvents: 'none' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: `radial-gradient(ellipse,${A}10 0%,transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 80, maxWidth: 1140, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Text */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,.61,.36,1] }}
            style={{ flex: '1 1 380px', maxWidth: 540 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 99, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', marginBottom: 32 }}>
              <motion.div animate={{ opacity: [1,.4,1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>Miễn phí · Không cần thẻ ngân hàng</span>
            </div>

            <h1 style={{ fontSize: 'clamp(46px,5.5vw,78px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.02, marginBottom: 24 }}>
              Trang bio xịn nhất
              <br />
              <span style={{ background: `linear-gradient(120deg,#fff 30%,${AL} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                cho người sáng tạo.
              </span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.44)', lineHeight: 1.72, marginBottom: 38, maxWidth: 420 }}>
              Một URL duy nhất cho links, âm nhạc, contact form và analytics. Tạo trang bio chuyên nghiệp trong vài phút.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 44 }}>
              <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: .97 }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', fontWeight: 800, fontSize: 15, padding: '13px 26px', borderRadius: 12, letterSpacing: '-0.01em' }}>
                  Tạo trang miễn phí <ArrowRight size={15} />
                </Link>
              </motion.div>
              <Link to="/demo" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 15, color: 'rgba(255,255,255,.55)', fontWeight: 500, padding: '13px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)' }}>
                Xem demo →
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {[A,'#a78bfa','#64748b','#94a3b8','#475569'].map((c,i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #000', marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', zIndex: 5-i }}>
                    {['M','T','A','L','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_,i) => <Star key={i} size={12} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2, fontWeight: 500 }}>Tin dùng bởi 1,000+ creators</p>
              </div>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15, ease: [.22,.61,.36,1] }} style={{ flexShrink: 0 }}>
            <motion.div animate={{ y: [0,-10,0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
              <BioPreview />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '18px 0', overflow: 'hidden' }}>
        <motion.div animate={{ x: ['0%','-50%'] }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content' }}>
          {[...PLATFORMS,...PLATFORMS].map(([Icon,color,name],i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 30px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <Icon size={15} color={color as string} style={{ opacity:.45 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.25)', letterSpacing: '.01em' }}>{name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── BENTO FEATURES ──────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#000' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14 }}>Tính năng</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 900, letterSpacing: '-0.045em', marginBottom: 10 }}>Một công cụ. Vô số khả năng.</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.38)', marginBottom: 56, maxWidth: 440 }}>Mọi tính năng để xây dựng trang bio nổi bật — trong một sản phẩm duy nhất.</p>
          </FadeUp>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'auto', gap: 10 }}>

            {/* Analytics — 2 cols, row 1 */}
            <FadeUp delay={0}>
              <motion.div whileHover={{ borderColor: 'rgba(91,106,208,.35)' }} transition={{ duration:.2 }}
                style={{ gridColumn:'span 2', padding:'28px 26px', borderRadius:18, background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.08)', height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:`rgba(91,106,208,.12)`,border:`1px solid rgba(91,106,208,.2)`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <BarChart2 size={16} style={{ color:AL }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>Analytics chi tiết</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Theo dõi views, clicks và CTR theo ngày — 7, 30 hoặc 90 ngày. Dashboard rõ ràng, không cần tool thứ ba.</p>
                <MiniChart />
                <div style={{ display:'flex',gap:20,marginTop:14 }}>
                  {[{l:'Views hôm nay',n:'128'},{l:'Clicks',n:'47'},{l:'CTR',n:'36.7%'}].map(s => (
                    <div key={s.l}><p style={{ fontSize:18,fontWeight:800,color:'#fff',letterSpacing:'-0.03em' }}>{s.n}</p><p style={{ fontSize:11,color:'rgba(255,255,255,.3)',fontWeight:600,marginTop:1 }}>{s.l}</p></div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>

            {/* Templates — 1 col, row 1 */}
            <FadeUp delay={.06}>
              <motion.div whileHover={{ borderColor:'rgba(255,255,255,.14)' }} transition={{ duration:.2 }}
                style={{ padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <Palette size={16} style={{ color:'rgba(255,255,255,.5)' }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>30+ Templates</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Mỗi template có palette màu riêng, preview thật trước khi áp dụng.</p>
                <MiniTemplates />
              </motion.div>
            </FadeUp>

            {/* Music — 1 col, row 2 */}
            <FadeUp delay={.1}>
              <motion.div whileHover={{ borderColor:'rgba(30,215,96,.25)' }} transition={{ duration:.2 }}
                style={{ padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'rgba(30,215,96,.08)',border:'1px solid rgba(30,215,96,.18)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <Music2 size={16} style={{ color:'#1ED760' }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>Music Player</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Nhúng Spotify hoặc YouTube. Visitor nghe nhạc ngay trên trang bio.</p>
                <MiniPlayer />
              </motion.div>
            </FadeUp>

            {/* Contact — 1 col, row 2 */}
            <FadeUp delay={.13}>
              <motion.div whileHover={{ borderColor:'rgba(255,255,255,.14)' }} transition={{ duration:.2 }}
                style={{ padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <MessageSquare size={16} style={{ color:'rgba(255,255,255,.5)' }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>Contact & Inbox</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Visitor nhắn tin thẳng, bạn quản lý trong Dashboard.</p>
                <MiniMessage />
              </motion.div>
            </FadeUp>

            {/* QR — 1 col, row 2 */}
            <FadeUp delay={.16}>
              <motion.div whileHover={{ borderColor:'rgba(255,255,255,.14)' }} transition={{ duration:.2 }}
                style={{ padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <QrCode size={16} style={{ color:'rgba(255,255,255,.5)' }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>QR Code</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Tạo QR code riêng, tải PNG dùng ngay cho in ấn và danh thiếp.</p>
                <MiniQR />
              </motion.div>
            </FadeUp>

            {/* Custom CSS — 2 cols, row 3 PRO */}
            <FadeUp delay={.19}>
              <motion.div whileHover={{ borderColor:'rgba(91,106,208,.35)' }} transition={{ duration:.2 }}
                style={{ gridColumn:'span 2',padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%',position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${A}60,transparent)` }} />
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                  <div style={{ width:34,height:34,borderRadius:10,background:`rgba(91,106,208,.1)`,border:`1px solid rgba(91,106,208,.2)`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Layers size={16} style={{ color:AL }} />
                  </div>
                  <div style={{ padding:'2px 9px',borderRadius:99,background:'rgba(91,106,208,.15)',border:`1px solid rgba(91,106,208,.25)` }}>
                    <span style={{ fontSize:10,fontWeight:800,color:AL,letterSpacing:'.08em',textTransform:'uppercase' }}>Pro</span>
                  </div>
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>Custom CSS</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6,marginBottom:0,maxWidth:360 }}>Toàn quyền tùy biến giao diện bằng CSS — dành cho designer và developer muốn kiểm soát hoàn toàn.</p>
                <MiniCode />
              </motion.div>
            </FadeUp>

            {/* Links — 1 col, row 3 */}
            <FadeUp delay={.22}>
              <motion.div whileHover={{ borderColor:'rgba(255,255,255,.14)' }} transition={{ duration:.2 }}
                style={{ padding:'28px 26px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',height:'100%' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
                  <Zap size={16} style={{ color:'rgba(255,255,255,.5)' }} />
                </div>
                <p style={{ fontWeight:800,fontSize:15,color:'#fff',marginBottom:6,letterSpacing:'-0.01em' }}>Links nâng cao</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.38)',lineHeight:1.6 }}>Schedule bật/tắt theo lịch, hiệu ứng animation, VCard download 1 chạm.</p>
                <div style={{ marginTop:16,display:'flex',flexDirection:'column',gap:6 }}>
                  {[{label:'Instagram',on:true},{label:'Sale Link',on:true},{label:'Old Portfolio',on:false}].map(l => (
                    <div key={l.label} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',borderRadius:8,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)' }}>
                      <span style={{ fontSize:11,color:'rgba(255,255,255,.5)',fontWeight:600 }}>{l.label}</span>
                      <div style={{ width:28,height:16,borderRadius:99,background:l.on?A:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',padding:'0 3px',justifyContent:l.on?'flex-end':'flex-start',transition:'all .2s' }}>
                        <div style={{ width:10,height:10,borderRadius:'50%',background:'#fff' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'72px 40px', background:'#060606' }}>
        <FadeUp>
          <div style={{ maxWidth:860,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)' }}>
            {[{n:'1,000+',l:'Creators đang dùng'},{n:'30+',l:'Templates đẹp'},{n:'19',l:'Layout options'},{n:'< 2 phút',l:'Để tạo trang bio'}].map((s,i) => (
              <div key={i} style={{ padding:'28px 20px',textAlign:'center',borderRight:i<3?'1px solid rgba(255,255,255,.07)':'none' }}>
                <p style={{ fontSize:38,fontWeight:900,letterSpacing:'-0.04em',color:'#fff',lineHeight:1 }}>{s.n}</p>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.32)',marginTop:8,fontWeight:500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#000',borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth:1040,margin:'0 auto' }}>
          <FadeUp>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:'.16em',color:'rgba(255,255,255,.28)',textTransform:'uppercase',marginBottom:14 }}>Đánh giá</p>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,letterSpacing:'-0.045em',marginBottom:56 }}>Creators tin dùng DONLY.</h2>
          </FadeUp>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
            {TESTIMONIALS.map((t,i) => (
              <FadeUp key={t.name} delay={i*0.06}>
                <div style={{ padding:'24px',borderRadius:16,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',height:'100%' }}>
                  <div style={{ display:'flex',gap:2,marginBottom:14 }}>{[...Array(5)].map((_,j) => <Star key={j} size={12} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}</div>
                  <p style={{ fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.72,marginBottom:20 }}>"{t.text}"</p>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:'50%',background:A,opacity:.75,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:12,flexShrink:0 }}>
                      {t.name.split(' ').map((w:string)=>w[0]).join('')}
                    </div>
                    <div><p style={{ fontWeight:700,fontSize:13,color:'#fff' }}>{t.name}</p><p style={{ fontSize:12,color:'rgba(255,255,255,.3)',fontWeight:500 }}>{t.role}</p></div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#060606',borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth:980,margin:'0 auto' }}>
          <FadeUp>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:'.16em',color:'rgba(255,255,255,.28)',textTransform:'uppercase',marginBottom:14,textAlign:'center' }}>Pricing</p>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,letterSpacing:'-0.045em',textAlign:'center',marginBottom:10 }}>Đơn giản và minh bạch.</h2>
            <p style={{ textAlign:'center',color:'rgba(255,255,255,.35)',fontSize:15,marginBottom:40 }}>Bắt đầu miễn phí — nâng cấp khi bạn sẵn sàng.</p>

            {/* Toggle */}
            <div style={{ display:'flex',justifyContent:'center',marginBottom:56 }}>
              <div style={{ display:'inline-flex',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.09)',borderRadius:12,padding:4 }}>
                {(['monthly','yearly'] as const).map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{
                    padding:'8px 20px',borderRadius:9,border:'none',cursor:'pointer',fontSize:13.5,fontWeight:600,
                    background:billing===b?'#fff':'transparent',
                    color:billing===b?'#000':'rgba(255,255,255,.42)',
                    transition:'all .2s',display:'flex',alignItems:'center',gap:7,
                  }}>
                    {b==='monthly'?'Theo tháng':'Theo năm'}
                    {b==='yearly'&&<span style={{ fontSize:10,fontWeight:800,padding:'1px 7px',borderRadius:99,background:billing==='yearly'?A:'rgba(91,106,208,.2)',color:billing==='yearly'?'#fff':AL,letterSpacing:'.04em' }}>-34%</span>}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,alignItems:'start' }}>
            {PLANS.map((plan,i) => (
              <FadeUp key={plan.id} delay={i*0.08}>
                <motion.div whileHover={{ y:-3,borderColor:plan.highlight?`${A}55`:'rgba(255,255,255,.14)' }} transition={{ duration:.2 }}
                  style={{ padding:'32px 28px',borderRadius:20,position:'relative',overflow:'hidden',
                    background:plan.highlight?`rgba(91,106,208,.07)`:'rgba(255,255,255,.02)',
                    border:`1px solid ${plan.highlight?'rgba(91,106,208,.28)':'rgba(255,255,255,.08)'}`,
                  }}>
                  {plan.highlight&&<div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${A},transparent)` }} />}
                  {plan.badge&&<div style={{ position:'absolute',top:22,right:22,background:A,borderRadius:99,padding:'2px 10px' }}><span style={{ fontSize:10,fontWeight:800,color:'#fff',letterSpacing:'.06em' }}>{plan.badge}</span></div>}

                  <p style={{ fontSize:11,fontWeight:700,letterSpacing:'.14em',color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginBottom:8 }}>{plan.name}</p>
                  <p style={{ fontSize:13,color:'rgba(255,255,255,.35)',marginBottom:22 }}>{plan.desc}</p>

                  <motion.div key={billing+plan.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ duration:.22 }}>
                    <div style={{ display:'flex',alignItems:'baseline',gap:3,marginBottom:4 }}>
                      <span style={{ fontSize:46,fontWeight:900,letterSpacing:'-0.05em',color:'#fff',lineHeight:1 }}>
                        {billing==='monthly'?fmt(plan.monthly):fmt(plan.yearly??plan.monthly)}
                      </span>
                      {plan.monthly>0&&<span style={{ fontSize:14,color:'rgba(255,255,255,.3)',fontWeight:500 }}>/tháng</span>}
                    </div>
                    {billing==='yearly'&&plan.yearlyTotal
                      ?<p style={{ fontSize:12,color:'rgba(255,255,255,.28)' }}>Thanh toán {fmt(plan.yearlyTotal)}/năm</p>
                      :plan.monthly===0?<p style={{ fontSize:12,color:'rgba(255,255,255,.28)' }}>mãi mãi · không điều kiện</p>
                      :<p style={{ fontSize:12,color:'transparent' }}>—</p>}
                  </motion.div>

                  <div style={{ height:1,background:'rgba(255,255,255,.07)',margin:'22px 0' }} />

                  <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:28 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:'flex',alignItems:'flex-start',gap:9,fontSize:13.5,color:'rgba(255,255,255,.58)' }}>
                        <div style={{ width:16,height:16,borderRadius:'50%',background:plan.highlight?`rgba(91,106,208,.18)`:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>
                          <Check size={9} style={{ color:plan.highlight?AL:'rgba(255,255,255,.45)' }} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.href} style={{
                    display:'block',textAlign:'center',padding:'12px',borderRadius:11,fontSize:14,fontWeight:700,
                    background:plan.highlight?A:'rgba(255,255,255,.06)',
                    color:plan.highlight?'#fff':'rgba(255,255,255,.7)',
                    border:plan.highlight?'none':'1px solid rgba(255,255,255,.1)',
                    transition:'opacity .15s',
                  }} onMouseEnter={e=>{e.currentTarget.style.opacity='.82'}} onMouseLeave={e=>{e.currentTarget.style.opacity='1'}}>
                    {plan.cta}
                  </Link>
                </motion.div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={.25}><p style={{ textAlign:'center',fontSize:13,color:'rgba(255,255,255,.2)',marginTop:26 }}>Tất cả gói có 7 ngày dùng thử. Hủy bất kỳ lúc nào.</p></FadeUp>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding:'80px 40px 100px',background:'#000',borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <FadeUp>
          <div style={{ maxWidth:640,margin:'0 auto',textAlign:'center',padding:'80px 40px',borderRadius:24,background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.08)',position:'relative',overflow:'hidden' }}>
            <div style={{ position:'absolute',top:'-50%',left:'50%',transform:'translateX(-50%)',width:500,height:400,background:`radial-gradient(circle,${A}0f 0%,transparent 65%)`,pointerEvents:'none' }} />
            <div style={{ position:'relative',zIndex:1 }}>
              <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)',fontWeight:900,letterSpacing:'-0.045em',marginBottom:14 }}>Bắt đầu ngay hôm nay.</h2>
              <p style={{ fontSize:16,color:'rgba(255,255,255,.38)',marginBottom:34,lineHeight:1.65 }}>Tạo trang bio chuyên nghiệp trong 2 phút. Miễn phí, không cần thẻ ngân hàng.</p>
              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }} style={{ display:'inline-block' }}>
                <Link to="/login" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'#fff',color:'#000',fontWeight:800,fontSize:15,padding:'14px 30px',borderRadius:12,letterSpacing:'-0.01em' }}>
                  Tạo trang DONLY của bạn <ArrowRight size={15} />
                </Link>
              </motion.div>
              <p style={{ fontSize:12,color:'rgba(255,255,255,.18)',marginTop:18 }}>Miễn phí · Không giới hạn links · Không cần credit card</p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.07)',padding:'28px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <div style={{ width:26,height:26,borderRadius:7,background:'#1a1f16',border:'1px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ fontWeight:900,fontSize:13,color:'#c5cba0' }}>D</span>
          </div>
          <span style={{ fontWeight:700,color:'rgba(255,255,255,.4)',fontSize:13 }}>DONLY © 2026</span>
        </div>
        <div style={{ display:'flex',gap:24 }}>
          {[['Đăng nhập','/login'],['Pricing','/pricing']].map(([l,href]) => (
            <Link key={l} to={href} style={{ fontSize:13,color:'rgba(255,255,255,.28)',fontWeight:500 }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.18)' }}>Made for creators in Vietnam</p>
      </footer>
    </div>
  )
}
