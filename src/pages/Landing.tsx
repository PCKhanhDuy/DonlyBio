import { Link } from 'react-router-dom'
import {
  Check, Zap, ArrowRight, Star, BarChart2, Palette, Lock, Music,
  MessageSquare, QrCode, Link2, Globe, Sparkles,
} from 'lucide-react'
import {
  SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify,
  SiGithub, SiTelegram, SiWhatsapp, SiX,
} from 'react-icons/si'

// ─── Animated phone mockup ────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div style={{
      width: 240, height: 480,
      background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
      borderRadius: 36,
      border: '3px solid rgba(255,255,255,0.12)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 99, zIndex: 10 }} />
      {/* Screen glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%,rgba(99,102,241,.15) 0%,transparent 70%)' }} />
      {/* Content */}
      <div style={{ padding: '36px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
        {/* Avatar */}
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(245,158,11,.4)', fontSize: 24, marginBottom: 4 }}>
          ✨
        </div>
        {/* Name */}
        <div style={{ height: 10, width: 100, background: 'rgba(255,255,255,0.85)', borderRadius: 99 }} />
        <div style={{ height: 7, width: 70, background: 'rgba(255,255,255,0.35)', borderRadius: 99 }} />
        {/* Social icons row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 4 }}>
          {['#E1306C','#010101','#FF0000','#0068FF'].map((c,i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
        </div>
        {/* Links */}
        {[
          { bg: 'rgba(255,255,255,0.1)', w: 176, label: 'Instagram', color: '#E1306C' },
          { bg: 'rgba(255,255,255,0.08)', w: 176, label: 'TikTok', color: '#010101' },
          { bg: 'rgba(255,255,255,0.08)', w: 176, label: 'YouTube', color: '#FF0000' },
          { bg: 'rgba(245,158,11,.18)', w: 176, label: '🎵 Spotify', color: '#1ED760' },
        ].map((l,i) => (
          <div key={i} style={{
            width: l.w, height: 34, borderRadius: 10,
            background: l.bg,
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            gap: 6,
            animation: `fadeInUp .4s ease ${i * .1 + .2}s both`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
            <div style={{ height: 7, width: 60, background: 'rgba(255,255,255,0.5)', borderRadius: 99 }} />
          </div>
        ))}
        {/* Spotify player bar */}
        <div style={{
          width: 176, background: 'rgba(30,215,96,.12)', borderRadius: 10, padding: '6px 10px',
          border: '1px solid rgba(30,215,96,.3)', marginTop: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: '#1ED760', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 5, width: 60, background: 'rgba(255,255,255,0.6)', borderRadius: 99, marginBottom: 3 }} />
              <div style={{ height: 3, width: 100, background: 'rgba(30,215,96,.4)', borderRadius: 99 }} />
            </div>
          </div>
        </div>
        {/* Bottom badge */}
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>DONLY</span>
        </div>
      </div>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

// ─── Floating badge ───────────────────────────────────────────────────────────
function FloatBadge({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', background: 'rgba(255,255,255,0.95)',
      borderRadius: 14, padding: '8px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
      color: '#111', whiteSpace: 'nowrap', animation: 'floatY 3s ease-in-out infinite',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Platform logos marquee ───────────────────────────────────────────────────
const PLATFORMS = [SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify, SiGithub, SiTelegram, SiWhatsapp, SiX, SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify]

const FEATURE_CARDS = [
  { icon: Palette,       label: 'Templates đẹp',      desc: '30+ themes, 19 layouts',      grad: 'linear-gradient(135deg,#667eea,#764ba2)', glyph: '🎨' },
  { icon: BarChart2,     label: 'Analytics chi tiết',  desc: 'Biểu đồ views, clicks, CTR',  grad: 'linear-gradient(135deg,#f093fb,#f5576c)', glyph: '📊' },
  { icon: Music,         label: 'Music Player',        desc: 'Spotify & YouTube embed',     grad: 'linear-gradient(135deg,#4facfe,#00f2fe)', glyph: '🎵' },
  { icon: MessageSquare, label: 'Contact Form',        desc: 'Inbox tin nhắn trực tiếp',    grad: 'linear-gradient(135deg,#43e97b,#38f9d7)', glyph: '💬' },
  { icon: Star,          label: 'Testimonials',        desc: 'Đánh giá từ khách hàng',      grad: 'linear-gradient(135deg,#fa709a,#fee140)', glyph: '⭐' },
  { icon: QrCode,        label: 'QR Code',             desc: 'Chia sẻ offline dễ dàng',     grad: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', glyph: '📱' },
  { icon: Lock,          label: 'Bảo vệ trang',        desc: 'Đặt mật khẩu riêng (Pro)',    grad: 'linear-gradient(135deg,#ffecd2,#fcb69f)', glyph: '🔒' },
  { icon: Zap,           label: 'Links nâng cao',      desc: 'Schedule, animation, VCard',  grad: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', glyph: '⚡' },
  { icon: Sparkles,      label: 'Custom CSS',          desc: 'Tùy biến không giới hạn',     grad: 'linear-gradient(135deg,#fd7043,#ffb74d)', glyph: '✨' },
  { icon: Globe,         label: 'GitHub Stats',        desc: 'Card thống kê GitHub live',   grad: 'linear-gradient(135deg,#30cfd0,#667eea)', glyph: '🐙' },
  { icon: Link2,         label: 'VCard Download',      desc: 'Khách lưu contact ngay',      grad: 'linear-gradient(135deg,#f5af19,#f12711)', glyph: '👤' },
  { icon: BarChart2,     label: 'Clicks Chart',        desc: 'Biểu đồ click theo ngày',     grad: 'linear-gradient(135deg,#c471ed,#12c2e9)', glyph: '📈' },
]

const STEPS = [
  { n: '01', title: 'Đăng ký miễn phí',    desc: 'Tạo tài khoản trong vài giây, không cần thẻ ngân hàng.',       emoji: '🚀' },
  { n: '02', title: 'Tùy chỉnh trang bio', desc: 'Chọn template, thêm links, âm nhạc, contact form và nhiều hơn nữa.', emoji: '🎨' },
  { n: '03', title: 'Chia sẻ link của bạn',desc: 'Một URL duy nhất — dùng cho Instagram, TikTok, danh thiếp…',   emoji: '✨' },
]

const TESTIMONIALS = [
  { name: 'Minh Khoa',  role: 'Content Creator',   text: 'DONLY giúp mình gom hết link vào một chỗ. Profile nhìn cực chuyên nghiệp, khách hàng ấn tượng lắm!', color: '#f59e0b', avatar: 'MK' },
  { name: 'Thu Hương',  role: 'Freelance Designer', text: 'Music player và contact form là 2 tính năng mình yêu nhất. Khách hàng nhắn tin thẳng mà không cần email.', color: '#ec4899', avatar: 'TH' },
  { name: 'Anh Tú',    role: 'Photographer',       text: 'Layouts Gallery & Magazine hiển thị ảnh portfolio cực đẹp. Analytics giúp mình hiểu audience rõ hơn.', color: '#3b82f6', avatar: 'AT' },
  { name: 'Linh Chi',  role: 'Musician',           text: 'Tích hợp Spotify ngay trên bio page quá đỉnh. Fans nghe nhạc mà không cần rời trang!', color: '#10b981', avatar: 'LC' },
  { name: 'Duy Phong', role: 'YouTuber',           text: 'Từ khi dùng DONLY, lượng sub YouTube tăng rõ rệt vì mình hướng traffic từ bio page hiệu quả hơn.', color: '#8b5cf6', avatar: 'DP' },
  { name: 'Hà My',     role: 'Influencer',         text: 'Templates PRO đẹp cực kỳ! Page của mình trông xịn như brand lớn mà không tốn nhiều tiền.', color: '#ef4444', avatar: 'HM' },
]

const FREE_FEATURES  = ['30+ templates & themes', '13 layouts miễn phí', 'Không giới hạn links', 'Music player, QR code', 'Contact form + Inbox', 'Testimonials block', 'Analytics 7-30 ngày', 'VCard download', 'GitHub Stats block']
const PRO_FEATURES   = ['Tất cả tính năng Free', '4 templates PRO độc quyền', '7 layouts PRO độc quyền', 'Analytics 90 ngày + CTR', 'Bảo vệ trang bằng mật khẩu', 'Custom CSS không giới hạn', 'Social bar không giới hạn', 'Gradient & ảnh nền tuỳ chỉnh', 'Announcement banner PRO']

export default function Landing() {
  return (
    <div style={{ fontFamily: 'system-ui,-apple-system,sans-serif', color: '#111', background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatY2{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes gradMove{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes marquee{ 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shimmer{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .land-btn-primary{ background:#333A2F; color:#fff; font-weight:700; border-radius:14px; padding:13px 28px; font-size:15px; border:none; cursor:pointer; transition:all .2s; text-decoration:none; display:inline-flex; align-items:center; gap:8px }
        .land-btn-primary:hover{ opacity:.88; transform:translateY(-1px); box-shadow:0 8px 24px rgba(51,58,47,.35) }
        .land-btn-ghost{ background:transparent; color:#333A2F; font-weight:600; border-radius:14px; padding:12px 24px; font-size:14px; border:2px solid #e5e7eb; cursor:pointer; transition:all .2s; text-decoration:none; display:inline-flex; align-items:center; gap:8px }
        .land-btn-ghost:hover{ border-color:#333A2F; background:#EBEDDF }
        .feat-card:hover{ transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.1) }
        .feat-card{ transition:all .25s }
        .step-card:hover .step-num{ transform:scale(1.1) }
        .step-num{ transition:transform .2s }
      `}</style>

      {/* ── Nav ───────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: '#333A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(51,58,47,.3)' }}>
            <span style={{ color: '#EBEDDF', fontWeight: 900, fontSize: 16 }}>D</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px', color: '#333A2F' }}>DONLY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/login" style={{ color: '#555', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>Đăng nhập</Link>
          <Link to="/login" className="land-btn-primary" style={{ padding: '9px 20px', fontSize: 14, borderRadius: 12 }}>
            Bắt đầu miễn phí <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh',
        background: 'radial-gradient(ellipse at 20% 50%,rgba(51,58,47,.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(245,158,11,.07) 0%,transparent 60%),radial-gradient(ellipse at 60% 80%,rgba(99,102,241,.05) 0%,transparent 60%),#fafaf8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 32px 60px',
        gap: 64, flexWrap: 'wrap',
      }}>
        {/* Text */}
        <div style={{ maxWidth: 540, flex: '1 1 320px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EBEDDF', borderRadius: 99, padding: '6px 16px', marginBottom: 28, border: '1px solid rgba(51,58,47,.15)' }}>
            <Sparkles size={13} style={{ color: '#333A2F' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#333A2F', letterSpacing: .3 }}>Trang bio thế hệ mới cho người Việt</span>
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24, color: '#0a0a0a' }}>
            Một link.
            <br />
            <span style={{
              background: 'linear-gradient(135deg,#333A2F 0%,#5a7a4a 40%,#f59e0b 70%,#ef4444 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Mọi thứ của bạn.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#666', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
            Tạo trang bio cá nhân đẹp mắt, chuyên nghiệp trong vài phút. Chia sẻ links, âm nhạc, portfolio, contact form — tất cả qua <strong style={{ color: '#333A2F' }}>một URL duy nhất</strong>.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/login" className="land-btn-primary">
              Tạo trang miễn phí <ArrowRight size={16} />
            </Link>
            <Link to="/u/demo" className="land-btn-ghost" target="_blank">
              Xem demo →
            </Link>
          </div>
          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex' }}>
                {['#f59e0b','#ec4899','#3b82f6','#10b981'].map((c,i) => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                    {['M','T','A','L'][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#777', fontWeight: 600 }}>+1,000 creators</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
            </div>
            <span style={{ fontSize: 12, color: '#777', fontWeight: 600 }}>5.0 / 5 ⭐</span>
          </div>
        </div>

        {/* Phone mockup */}
        <div style={{ position: 'relative', flexShrink: 0, animation: 'floatY 4s ease-in-out infinite' }}>
          <PhoneMockup />
          {/* Glow behind phone */}
          <div style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)', zIndex: -1, borderRadius: '50%' }} />
          {/* Floating badges */}
          <FloatBadge style={{ top: 40, left: -130, animationDuration: '3.5s' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            <span>Link click +42%</span>
          </FloatBadge>
          <FloatBadge style={{ bottom: 100, left: -120, animationDuration: '4s', animationDelay: '.5s' }}>
            <span style={{ fontSize: 16 }}>🎵</span>
            <span>Spotify embedded</span>
          </FloatBadge>
          <FloatBadge style={{ top: 120, right: -140, animationDuration: '3s', animationDelay: '1s' }}>
            <span style={{ fontSize: 16 }}>👋</span>
            <span>New message!</span>
          </FloatBadge>
          <FloatBadge style={{ bottom: 200, right: -130, animationDuration: '5s', animationDelay: '.3s' }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <span>128 views today</span>
          </FloatBadge>
        </div>
      </section>

      {/* ── Platform logos strip ───────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', overflow: 'hidden', background: '#fafaf8' }}>
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase', marginBottom: 20 }}>Kết nối với mọi nền tảng</p>
        <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', width: 'max-content' }}>
          {PLATFORMS.map((Icon, i) => (
            <div key={i} style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 8px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <Icon size={22} style={{ color: '#555' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {[
            { n: '1,000+',  label: 'Creators đang dùng', emoji: '🚀' },
            { n: '30+',     label: 'Templates đẹp',       emoji: '🎨' },
            { n: '19',      label: 'Layout options',       emoji: '📐' },
            { n: '< 2 phút',label: 'Để tạo trang bio',    emoji: '⚡' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center', padding: '32px 16px', borderRadius: 24, background: '#EBEDDF', border: '1px solid rgba(51,58,47,.1)' }}>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#333A2F', letterSpacing: -1, marginTop: 8 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: '#fafaf8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>Tính năng</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: '#0a0a0a', marginTop: 10, marginBottom: 12 }}>Mọi thứ bạn cần</h2>
            <p style={{ fontSize: 16, color: '#777', maxWidth: 460, margin: '0 auto' }}>12+ tính năng được thiết kế để trang bio của bạn trở nên nổi bật và hiệu quả.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            {FEATURE_CARDS.map(f => (
              <div key={f.label} className="feat-card" style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#fff',
                cursor: 'default',
              }}>
                <div style={{ height: 6, background: f.grad }} />
                <div style={{ padding: '18px 18px 16px' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{f.glyph}</div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>Cách hoạt động</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: '#0a0a0a', marginTop: 10 }}>3 bước đơn giản</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="step-card" style={{
                padding: '36px 28px', borderRadius: 24,
                background: i === 1 ? '#333A2F' : '#EBEDDF',
                border: '1px solid ' + (i === 1 ? 'transparent' : 'rgba(51,58,47,.1)'),
              }}>
                <div className="step-num" style={{ fontSize: 44, marginBottom: 16 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: i === 1 ? 'rgba(235,237,223,.5)' : 'rgba(51,58,47,.45)', textTransform: 'uppercase', marginBottom: 8 }}>Bước {s.n}</div>
                <p style={{ fontSize: 18, fontWeight: 800, color: i === 1 ? '#EBEDDF' : '#333A2F', marginBottom: 8, letterSpacing: -0.3 }}>{s.title}</p>
                <p style={{ fontSize: 14, color: i === 1 ? 'rgba(235,237,223,.7)' : '#666', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: '#fafaf8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>Testimonials</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: '#0a0a0a', marginTop: 10 }}>Được yêu thích bởi creators</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                padding: '24px', borderRadius: 20, background: '#fff',
                border: '1px solid #f0f0f0', boxShadow: '0 4px 24px rgba(0,0,0,.04)',
              }}>
                <div style={{ display: 'flex', gap: 1, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>Pricing</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: '#0a0a0a', marginTop: 10 }}>Đơn giản. Minh bạch.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {/* Free */}
            <div style={{ padding: 32, borderRadius: 28, border: '2px solid #e5e7eb', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#111' }}>Free</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#333A2F' }}>0₫</span>
                <span style={{ color: '#aaa', fontSize: 14 }}>/mãi mãi</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} style={{ color: '#16a34a' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 14, border: '2px solid #e5e7eb', fontWeight: 700, fontSize: 15, color: '#333A2F', textDecoration: 'none', transition: 'all .2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#333A2F'; (e.target as HTMLElement).style.background = '#EBEDDF' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#e5e7eb'; (e.target as HTMLElement).style.background = '#fff' }}>
                Bắt đầu miễn phí
              </Link>
            </div>
            {/* Pro */}
            <div style={{ padding: 32, borderRadius: 28, border: '2px solid #333A2F', background: '#333A2F', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#f59e0b,#f97316,#ef4444)' }} />
              <div style={{ position: 'absolute', top: 20, right: 20, background: '#f59e0b', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 900, color: '#000', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                ✦ PRO
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#EBEDDF' }}>Pro</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#f59e0b' }}>149.000₫</span>
                <span style={{ color: 'rgba(235,237,223,.5)', fontSize: 14 }}>/tháng</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PRO_FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(235,237,223,.85)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(245,158,11,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} style={{ color: '#f59e0b' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 14, background: '#f59e0b', fontWeight: 800, fontSize: 15, color: '#000', textDecoration: 'none', transition: 'all .2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#fbbf24' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = '#f59e0b' }}>
                Nâng cấp PRO ngay →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section style={{
        margin: '0 32px 80px', borderRadius: 32,
        background: 'linear-gradient(135deg,#333A2F 0%,#4a5e3a 50%,#2d4a3e 100%)',
        padding: '80px 40px', textAlign: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,158,11,.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#EBEDDF', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
            Bắt đầu ngay hôm nay.
            <br />
            <span style={{ color: '#f59e0b' }}>Miễn phí mãi mãi.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(235,237,223,.65)', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
            Không cần thẻ ngân hàng. Tạo trang bio đẹp trong vòng 2 phút và bắt đầu nhận traffic ngay hôm nay.
          </p>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#f59e0b', color: '#000', fontWeight: 900,
            padding: '16px 36px', borderRadius: 16, fontSize: 17,
            textDecoration: 'none', transition: 'all .2s',
            boxShadow: '0 8px 32px rgba(245,158,11,.4)',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 16px 48px rgba(245,158,11,.5)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(245,158,11,.4)' }}>
            Tạo trang DONLY của bạn <ArrowRight size={20} />
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(235,237,223,.4)', fontWeight: 600 }}>
            ✓ Miễn phí  ·  ✓ Không giới hạn links  ·  ✓ Không cần credit card
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#333A2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#EBEDDF', fontWeight: 900, fontSize: 13 }}>D</span>
          </div>
          <span style={{ fontWeight: 800, color: '#333A2F' }}>DONLY</span>
        </div>
        <p style={{ fontSize: 13, color: '#aaa' }}>© 2026 DONLY · Trang bio đẹp nhất cho người Việt 🇻🇳</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
          {['Đăng nhập', 'Tính năng', 'Pricing'].map(l => (
            <Link key={l} to={l === 'Pricing' ? '/pricing' : '/login'} style={{ fontSize: 13, color: '#aaa', textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
