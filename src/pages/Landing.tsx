import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Star, BarChart2, Palette, Music2, MessageSquare, QrCode, Zap, Globe, Shield, Layers, Users } from 'lucide-react'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify, SiGithub, SiTelegram, SiWhatsapp, SiX, SiThreads } from 'react-icons/si'

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = '#5B6AD0'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Phone preview ────────────────────────────────────────────────────────────
function BioPreview() {
  return (
    <div style={{
      width: 220, height: 440,
      background: '#0d0d0d',
      borderRadius: 38,
      border: '1.5px solid rgba(255,255,255,.14)',
      boxShadow: '0 0 0 1px rgba(255,255,255,.04), 0 60px 100px rgba(0,0,0,.9)',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)', width: 72, height: 7, background: '#000', borderRadius: 99, zIndex: 5 }} />
      <div style={{ padding: '38px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#5B6AD0,#8b92e0)', border: '2px solid rgba(255,255,255,.1)', flexShrink: 0 }} />
        <div style={{ height: 9, width: 100, background: 'rgba(255,255,255,.85)', borderRadius: 99 }} />
        <div style={{ height: 6, width: 68, background: 'rgba(255,255,255,.22)', borderRadius: 99 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
          {['#E1306C', '#010101', '#FF0000', '#1DA1F2'].map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: c, opacity: .8 }} />
          ))}
        </div>
        {[{ w: 90 }, { w: 76 }, { w: 84 }, { w: 70 }].map((l, i) => (
          <div key={i} style={{
            width: 180, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
            display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 9,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, opacity: .7 }} />
            <div style={{ height: 6, width: l.w, background: 'rgba(255,255,255,.4)', borderRadius: 99 }} />
          </div>
        ))}
        <div style={{ width: 180, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#1ED760', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="8" height="10" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="#000" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 5, width: 72, background: 'rgba(255,255,255,.5)', borderRadius: 99, marginBottom: 4 }} />
            <div style={{ height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 99 }}>
              <div style={{ width: '38%', height: '100%', background: '#1ED760', borderRadius: 99 }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', padding: '4px 12px', borderRadius: 7, background: 'rgba(255,255,255,.03)' }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,.22)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>donlybio.vercel.app</span>
        </div>
      </div>
    </div>
  )
}

// ─── Platforms ────────────────────────────────────────────────────────────────
const PLATFORMS: [React.ElementType, string, string][] = [
  [SiInstagram, '#E1306C', 'Instagram'], [SiTiktok, '#fff', 'TikTok'],
  [SiYoutube, '#FF0000', 'YouTube'], [SiFacebook, '#1877F2', 'Facebook'],
  [SiSpotify, '#1ED760', 'Spotify'], [SiGithub, '#fff', 'GitHub'],
  [SiTelegram, '#229ED9', 'Telegram'], [SiWhatsapp, '#25D366', 'WhatsApp'],
  [SiX, '#fff', 'X (Twitter)'], [SiThreads, '#fff', 'Threads'],
]

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Palette,        title: 'Templates & Themes',    desc: '30+ template được thiết kế chuyên nghiệp, 19 layout — từ Minimal đến Magazine.' },
  { icon: BarChart2,      title: 'Analytics chi tiết',    desc: 'Theo dõi views, clicks và CTR theo ngày. Dashboard đơn giản, không cần tool thứ ba.' },
  { icon: Music2,         title: 'Music Player',          desc: 'Nhúng Spotify hoặc YouTube trực tiếp vào trang bio. Visitor nghe nhạc mà không cần rời trang.' },
  { icon: MessageSquare,  title: 'Contact Form & Inbox',  desc: 'Visitor nhắn tin thẳng, bạn quản lý trong Dashboard. Không cần email hay Messenger.' },
  { icon: QrCode,         title: 'QR Code tự động',       desc: 'Mỗi trang bio có QR riêng, tải PNG để dùng in ấn, standee hoặc danh thiếp.' },
  { icon: Globe,          title: 'GitHub Stats',          desc: 'Card thống kê GitHub live — repos, followers, bio — tự cập nhật theo profile thật.' },
  { icon: Zap,            title: 'Links nâng cao',        desc: 'Schedule bật/tắt theo lịch, hiệu ứng animation, VCard download 1 chạm.' },
  { icon: Shield,         title: 'Bảo vệ trang',         desc: 'Đặt mật khẩu cho trang bio, phù hợp nội dung giới hạn đối tượng truy cập.' },
  { icon: Layers,         title: 'Custom CSS',            desc: 'Toàn quyền tùy biến giao diện bằng CSS — dành cho designer và developer.' },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Minh Khoa',  role: 'Content Creator',    text: 'Profile mình trông chuyên nghiệp hơn hẳn. Khách hàng tự hỏi dùng tool gì để làm đẹp vậy.' },
  { name: 'Thu Hương',  role: 'Freelance Designer',  text: 'Music player là tính năng tôi dùng nhiều nhất. Fan nghe nhạc ngay trên bio, không cần mở app khác.' },
  { name: 'Anh Tú',    role: 'Photographer',        text: 'Layout Gallery hiển thị portfolio rất đẹp. Lần đầu tôi thấy một bio link làm được điều này.' },
  { name: 'Linh Chi',  role: 'Musician',            text: 'Thời gian khách ở lại trang bio tăng gấp đôi sau khi tích hợp Spotify embed.' },
  { name: 'Duy Phong', role: 'YouTuber',            text: 'Analytics cho tôi biết chính xác hôm nào traffic cao và link nào đang được click nhiều nhất.' },
  { name: 'Hà My',     role: 'KOL & Influencer',    text: 'Templates Pro đẹp và chuyên nghiệp. Brand tôi trông rất ổn mà không cần thuê designer riêng.' },
]

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter',
    desc: 'Dành cho cá nhân mới bắt đầu.',
    monthly: 0,
    yearly: 0,
    cta: 'Bắt đầu miễn phí',
    ctaLink: '/login',
    highlight: false,
    features: [
      'Không giới hạn links',
      '10 templates cơ bản',
      '6 layout options',
      'Analytics 7 ngày',
      'QR code',
      'Contact form & Inbox',
      'Music player',
      'GitHub Stats block',
    ],
  },
  {
    name: 'Creator',
    desc: 'Dành cho creator muốn nổi bật.',
    monthly: 149000,
    yearly: 99000,
    yearlyTotal: 1188000,
    badge: 'Phổ biến nhất',
    cta: 'Dùng thử 7 ngày',
    ctaLink: '/pricing',
    highlight: true,
    features: [
      'Tất cả tính năng Starter',
      '30+ templates',
      '13 layout options',
      'Analytics 30 ngày',
      'Testimonials block',
      'VCard download',
      'Link nâng cao & animation',
      'Custom social icon bar',
    ],
  },
  {
    name: 'Pro',
    desc: 'Dành cho brand và agency chuyên nghiệp.',
    monthly: 399000,
    yearly: 249000,
    yearlyTotal: 2988000,
    cta: 'Nâng cấp Pro',
    ctaLink: '/pricing',
    highlight: false,
    features: [
      'Tất cả tính năng Creator',
      '4 templates PRO độc quyền',
      '7 layouts PRO độc quyền',
      'Analytics 90 ngày + CTR',
      'Bảo vệ trang bằng mật khẩu',
      'Custom CSS không giới hạn',
      'Background image & gradient',
      'Priority support',
    ],
  },
]

function fmt(n: number) {
  if (n === 0) return '0₫'
  return (n / 1000).toFixed(0) + 'K₫'
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div style={{ background: '#000', color: '#fff', overflowX: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif' }}>

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 60, padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: '#333A2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#EBEDDF' }}>D</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em', color: '#fff' }}>DONLY</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login" style={{ padding: '7px 14px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.5)', borderRadius: 8 }}>
            Đăng nhập
          </Link>
          <Link to="/login" style={{ padding: '8px 18px', fontSize: 14, fontWeight: 700, color: '#000', background: '#fff', borderRadius: 9, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            Bắt đầu <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '120px 32px 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: '88vh' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: `radial-gradient(ellipse,${ACCENT}14 0%,transparent 65%)`, pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%,black,transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 72, maxWidth: 1120, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [.22,.61,.36,1] }}
            style={{ flex: '1 1 380px', maxWidth: 540 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 99, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.6)', letterSpacing: '.01em' }}>Miễn phí · Không cần thẻ ngân hàng</span>
            </div>

            <h1 style={{ fontSize: 'clamp(42px,5vw,68px)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.05, marginBottom: 22, color: '#fff' }}>
              Một link cho<br />
              <span style={{ color: 'rgba(255,255,255,.38)' }}>mọi thứ của bạn.</span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.44)', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
              Tạo trang bio cá nhân đẹp và chuyên nghiệp trong vài phút. Links, nhạc, contact form, analytics — tất cả qua một URL duy nhất.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#fff', color: '#000', fontWeight: 800, fontSize: 15,
                  padding: '13px 26px', borderRadius: 12,
                }}>
                  Tạo trang miễn phí <ArrowRight size={15} />
                </Link>
              </motion.div>
              <Link to="/u/demo" target="_blank" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.65)', fontWeight: 600, fontSize: 15,
                padding: '13px 22px', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)',
              }}>
                Xem demo
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 36 }}>
              <div style={{ display: 'flex' }}>
                {['#5B6AD0', '#a78bfa', '#64748b', '#94a3b8', '#475569'].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #000', marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', zIndex: 5 - i }}>
                    {['M', 'T', 'A', 'L', 'D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', marginTop: 2, fontWeight: 500 }}>1,000+ creators đang sử dụng</p>
              </div>
            </div>
          </motion.div>

          {/* Phone side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .15, ease: [.22,.61,.36,1] }}
            style={{ flexShrink: 0 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BioPreview />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PLATFORMS ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '20px 0', overflow: 'hidden', background: 'rgba(255,255,255,.01)' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: 'max-content' }}
        >
          {[...PLATFORMS, ...PLATFORMS].map(([Icon, color, name], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 28px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <Icon size={15} color={color as string} style={{ opacity: .5 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.28)', letterSpacing: '.01em' }}>{name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: '#000' }}>
        <FadeUp>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { n: '1,000+', l: 'Creators đang dùng' },
              { n: '30+',    l: 'Templates đẹp' },
              { n: '19',     l: 'Layout options' },
              { n: '< 2 phút', l: 'Để tạo trang bio' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '32px 24px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none',
              }}>
                <p style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginTop: 8, fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14 }}>Tính năng</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
              Một công cụ, vô số khả năng.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: 60, maxWidth: 460 }}>
              Mọi tính năng bạn cần để xây dựng trang bio chuyên nghiệp — trong một sản phẩm duy nhất.
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.05}>
                <motion.div
                  whileHover={{ background: 'rgba(255,255,255,.04)' }}
                  style={{
                    padding: '30px 26px',
                    background: 'rgba(255,255,255,.02)',
                    borderRight: (i % 3 !== 2) ? '1px solid rgba(255,255,255,.07)' : 'none',
                    borderBottom: (i < 6) ? '1px solid rgba(255,255,255,.07)' : 'none',
                    cursor: 'default',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <f.icon size={17} style={{ color: 'rgba(255,255,255,.55)' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14.5, color: '#fff', marginBottom: 7, letterSpacing: '-0.01em' }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.65 }}>{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', background: '#000', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14 }}>Cách hoạt động</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 60 }}>Bắt đầu trong 3 bước.</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { n: '01', icon: Users,   title: 'Tạo tài khoản',      desc: 'Đăng ký trong 10 giây. Không cần thẻ ngân hàng.' },
              { n: '02', icon: Palette, title: 'Tùy chỉnh trang bio', desc: 'Chọn template, thêm links, âm nhạc, contact form và nhiều hơn nữa.', highlight: true },
              { n: '03', icon: Zap,     title: 'Chia sẻ link',        desc: 'Một URL — dùng trên Instagram, TikTok, danh thiếp, mọi nơi.' },
            ].map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.1}>
                <div style={{
                  padding: '32px 28px', borderRadius: 16,
                  background: s.highlight ? 'rgba(91,106,208,.08)' : 'rgba(255,255,255,.03)',
                  border: `1px solid ${s.highlight ? 'rgba(91,106,208,.25)' : 'rgba(255,255,255,.07)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: s.highlight ? 'rgba(91,106,208,.15)' : 'rgba(255,255,255,.05)', border: `1px solid ${s.highlight ? 'rgba(91,106,208,.3)' : 'rgba(255,255,255,.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={17} style={{ color: s.highlight ? '#8b92e0' : 'rgba(255,255,255,.45)' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.12em' }}>{s.n}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>{s.title}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.42)', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14 }}>Đánh giá</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 56 }}>Creators tin dùng DONLY.</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.06}>
                <div style={{ padding: '24px', borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', height: '100%' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: ACCENT, opacity: .8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {t.name.split(' ').map((w: string) => w[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', background: '#000', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.04em', textAlign: 'center', marginBottom: 10 }}>Đơn giản và minh bạch.</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.38)', fontSize: 15, marginBottom: 40 }}>Bắt đầu miễn phí, nâng cấp khi bạn cần thêm.</p>

            {/* Billing toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 12, padding: 4, gap: 2 }}>
                {(['monthly', 'yearly'] as const).map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{
                    padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    background: billing === b ? '#fff' : 'transparent',
                    color: billing === b ? '#000' : 'rgba(255,255,255,.45)',
                    transition: 'all .2s',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    {b === 'monthly' ? 'Theo tháng' : 'Theo năm'}
                    {b === 'yearly' && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: billing === 'yearly' ? ACCENT : 'rgba(91,106,208,.25)', color: billing === 'yearly' ? '#fff' : '#8b92e0', padding: '1px 7px', borderRadius: 99, letterSpacing: '.05em' }}>
                        -33%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, alignItems: 'start' }}>
            {PLANS.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ borderColor: plan.highlight ? `${ACCENT}60` : 'rgba(255,255,255,.14)' }}
                  style={{
                    padding: '32px 28px', borderRadius: 18, position: 'relative', overflow: 'hidden',
                    background: plan.highlight ? 'rgba(91,106,208,.06)' : 'rgba(255,255,255,.02)',
                    border: `1px solid ${plan.highlight ? 'rgba(91,106,208,.3)' : 'rgba(255,255,255,.08)'}`,
                    transition: 'border-color .2s',
                  }}
                >
                  {plan.highlight && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
                  )}
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: 20, right: 20, background: ACCENT, borderRadius: 99, padding: '2px 10px' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.06em', textTransform: 'uppercase' }}>{plan.badge}</span>
                    </div>
                  )}

                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 10 }}>{plan.name}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', marginBottom: 24 }}>{plan.desc}</p>

                  <div style={{ marginBottom: 6 }}>
                    <motion.div
                      key={billing + plan.name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: .25 }}
                      style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}
                    >
                      <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
                        {billing === 'monthly' ? fmt(plan.monthly) : fmt(plan.yearly ?? plan.monthly)}
                      </span>
                      {plan.monthly > 0 && (
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>/tháng</span>
                      )}
                    </motion.div>
                    {billing === 'yearly' && plan.yearlyTotal && (
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>
                        Thanh toán {fmt(plan.yearlyTotal)}/năm
                      </p>
                    )}
                    {plan.monthly === 0 && (
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>mãi mãi · không điều kiện</p>
                    )}
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '24px 0' }} />

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,.6)' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: plan.highlight ? 'rgba(91,106,208,.2)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <Check size={9} style={{ color: plan.highlight ? '#8b92e0' : 'rgba(255,255,255,.5)' }} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.ctaLink} style={{
                    display: 'block', textAlign: 'center', padding: '12px',
                    borderRadius: 11, fontSize: 14, fontWeight: 700,
                    background: plan.highlight ? ACCENT : 'rgba(255,255,255,.07)',
                    color: plan.highlight ? '#fff' : 'rgba(255,255,255,.75)',
                    border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,.1)',
                    transition: 'opacity .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '.85' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                    {plan.cta}
                  </Link>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={.2}>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.22)', marginTop: 28, fontWeight: 500 }}>
              Tất cả gói đều có 7 ngày dùng thử miễn phí. Hủy bất kỳ lúc nào.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px 100px', background: '#000', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <FadeUp>
          <div style={{
            maxWidth: 680, margin: '0 auto', textAlign: 'center',
            padding: '80px 40px', borderRadius: 24,
            background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-60%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${ACCENT}0d 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 14 }}>Bắt đầu ngay hôm nay.</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', marginBottom: 36, lineHeight: 1.65 }}>
                Tạo trang bio chuyên nghiệp trong 2 phút. Miễn phí, không cần thẻ ngân hàng.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} style={{ display: 'inline-block' }}>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: '#fff', color: '#000', fontWeight: 800, fontSize: 15,
                  padding: '14px 30px', borderRadius: 12,
                }}>
                  Tạo trang DONLY của bạn <ArrowRight size={16} />
                </Link>
              </motion.div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', marginTop: 18 }}>
                Miễn phí · Không giới hạn links · Không cần credit card
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#333A2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: 13, color: '#EBEDDF' }}>D</span>
          </div>
          <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.5)', fontSize: 13 }}>DONLY © 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Đăng nhập', '/login'], ['Pricing', '/pricing']].map(([l, href]) => (
            <Link key={l} to={href} style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.18)' }}>Made for creators in Vietnam</p>
      </footer>
    </div>
  )
}
