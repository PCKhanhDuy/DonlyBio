import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Music, Send, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from 'react-icons/si'

const LINKS = [
  { id: 1, title: 'Kênh YouTube chính',       url: '#', icon: '▶', color: '#FF0000', desc: 'Video mới mỗi tuần' },
  { id: 2, title: 'TikTok — Daily Vlogs',      url: '#', icon: '♪', color: '#010101', desc: 'Follow để không bỏ lỡ' },
  { id: 3, title: 'Portfolio & Agency',         url: '#', icon: '✦', color: '#5B6AD0', desc: 'Dịch vụ thiết kế & content' },
  { id: 4, title: 'Khoá học Content Creator',  url: '#', icon: '🎓', color: '#f59e0b', desc: 'Enroll ngay — Giảm 30%' },
  { id: 5, title: 'Shop Merch',                url: '#', icon: '🛍', color: '#10b981', desc: 'Limited edition tháng này' },
]

const TESTIMONIALS = [
  { name: 'Hà My', role: 'Photographer', text: 'Khoá học của Alex thay đổi hoàn toàn cách tôi làm content. Tăng 50K followers trong 3 tháng!', stars: 5 },
  { name: 'Khánh Duy', role: 'Marketer', text: 'Nội dung chất lượng và rất thực tế. Áp dụng ngay được vào công việc.', stars: 5 },
  { name: 'Minh Thư', role: 'Student', text: 'Đầu tư xứng đáng nhất từ trước đến nay. Alex chia sẻ rất tận tâm và chi tiết.', stars: 5 },
]

export default function Demo() {
  const [contactName, setContactName] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [sent, setSent] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const visibleLinks = showAll ? LINKS : LINKS.slice(0, 3)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() || !contactMsg.trim()) return
    setSent(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#0a0a12 0%,#0d0d18 40%,#080810 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: '-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif',
      padding: '0 16px 80px',
    }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '5%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,106,208,.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,.05) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>

        {/* ── Profile ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, ease: [.22,.61,.36,1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 56, paddingBottom: 28 }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'conic-gradient(from 0deg,#5B6AD0,#8b92e0,#ec4899,#5B6AD0)', opacity: .7, filter: 'blur(3px)', animation: 'spin 8s linear infinite' }} />
            <div style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#5B6AD0,#8b92e0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, border: '3px solid #0a0a12' }}>
              🎬
            </div>
          </div>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 4 }}>Alex Nguyễn</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', fontWeight: 500, marginBottom: 14, textAlign: 'center' }}>Content Creator · Nhiếp ảnh · Giảng viên</p>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, textAlign: 'center', maxWidth: 340, marginBottom: 20 }}>
            Mình chia sẻ về content creation, photography và cuộc sống của một creative freelancer tại Sài Gòn.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { Icon: SiInstagram, color: '#E1306C', href: '#' },
              { Icon: SiTiktok,    color: '#fff',    href: '#' },
              { Icon: SiYoutube,   color: '#FF0000', href: '#' },
              { Icon: SiSpotify,   color: '#1ED760', href: '#' },
            ].map(({ Icon, color, href }, i) => (
              <motion.a key={i} href={href} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: .9 }}
                style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── Music Player ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .15 }}
          style={{ marginBottom: 16, background: 'rgba(30,215,96,.07)', border: '1px solid rgba(30,215,96,.18)', borderRadius: 18, padding: '14px 18px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1ED760,#17a34a)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(30,215,96,.3)' }}>
              <Music size={20} color="#000" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lofi Study Playlist — Alex Mix</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 7 }}>Spotify · 24 tracks</p>
              <div style={{ height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 99, position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: ['18%', '82%'] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#1ED760', borderRadius: 99 }}
                />
              </div>
            </div>
            <a href="#" style={{ width: 32, height: 32, borderRadius: '50%', background: '#1ED760', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0L10 6L0 12Z" fill="#000" /></svg>
            </a>
          </div>
        </motion.div>

        {/* ── Links ────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
          <AnimatePresence>
            {visibleLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.url}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: .4, delay: .2 + i * .07 }}
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: .98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px', borderRadius: 16,
                  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                  textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${link.color}20`, border: `1px solid ${link.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {link.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 1 }}>{link.title}</p>
                  {link.desc && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', fontWeight: 500 }}>{link.desc}</p>}
                </div>
                <ExternalLink size={14} style={{ color: 'rgba(255,255,255,.25)', flexShrink: 0 }} />
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

        {LINKS.length > 3 && (
          <motion.button
            onClick={() => setShowAll(v => !v)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
            style={{ width: '100%', padding: '11px', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}
          >
            {showAll ? <><ChevronUp size={15} /> Thu gọn</> : <><ChevronDown size={15} /> Xem thêm {LINKS.length - 3} link</>}
          </motion.button>
        )}

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .5 }}
          style={{ marginBottom: 16 }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>
            Đánh giá từ học viên
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .55 + i * .08 }}
                style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.65, marginBottom: 12 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(91,106,208,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Contact Form ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .7 }}
          style={{ marginBottom: 8, padding: '22px', borderRadius: 20, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            Liên hệ với mình
          </p>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: 28, marginBottom: 10 }}>✅</p>
                <p style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>Gửi thành công!</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Mình sẽ phản hồi trong 24h nhé.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Tên của bạn"
                  style={{ padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
                <textarea
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  placeholder="Tin nhắn của bạn..."
                  rows={3}
                  style={{ padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                />
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
                  style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#5B6AD0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit' }}>
                  <Send size={14} /> Gửi tin nhắn
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── DONLY badge ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}
          style={{ textAlign: 'center', paddingTop: 32 }}
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 99, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', textDecoration: 'none' }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#1a1f16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 10, color: '#c5cba0' }}>D</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.35)' }}>Tạo trang bio của bạn với DONLY</span>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
