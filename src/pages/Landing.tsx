import { Link } from 'react-router-dom'
import { ExternalLink, QrCode, Music, MessageSquare, Star, BarChart2, Palette, Lock, Zap, Check } from 'lucide-react'

const FEATURES = [
  { icon: Palette,       label: 'Giao diện đẹp',       desc: '30+ templates & 19 layouts, tùy chỉnh font, màu sắc, animation' },
  { icon: BarChart2,     label: 'Analytics chi tiết',   desc: 'Theo dõi lượt xem, click theo ngày, CTR (Pro)' },
  { icon: Music,         label: 'Music Player',         desc: 'Embed Spotify / YouTube ngay trên trang bio' },
  { icon: MessageSquare, label: 'Contact Form',         desc: 'Khách gửi tin nhắn trực tiếp, quản lý inbox trong dashboard' },
  { icon: Star,          label: 'Testimonials',         desc: 'Hiển thị đánh giá từ khách hàng, tăng uy tín' },
  { icon: QrCode,        label: 'QR Code',              desc: 'Tạo QR code riêng, dễ chia sẻ offline' },
  { icon: Lock,          label: 'Bảo vệ trang',         desc: 'Đặt mật khẩu để trang chỉ hiện với người được phép (Pro)' },
  { icon: Zap,           label: 'Link nâng cao',        desc: 'Lên lịch link, thumbnail, hover animation, VCard download' },
]

const TESTIMONIALS = [
  { name: 'Minh Khoa', role: 'Content Creator', text: 'DONLY giúp mình gom hết link vào một chỗ, profile nhìn cực chuyên nghiệp!', rating: 5 },
  { name: 'Thu Hương', role: 'Freelancer',       text: 'Music player và contact form là 2 tính năng mình yêu thích nhất.',           rating: 5 },
  { name: 'Anh Tú',   role: 'Photographer',     text: 'Giao diện Gallery layout của DONLY hiển thị ảnh rất đẹp và gọn.',           rating: 5 },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#333A2F' }}>
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="font-black text-lg tracking-tight" style={{ color: '#333A2F' }}>DONLY</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Đăng nhập
          </Link>
          <Link to="/login"
            className="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#333A2F' }}>
            Bắt đầu miễn phí
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
          style={{ background: '#EBEDDF', color: '#333A2F' }}>
          <Zap size={14} /> Trang bio đẹp nhất cho người Việt
        </div>
        <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
          Một link.
          <br />
          <span style={{ color: '#333A2F' }}>Mọi thứ của bạn.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Tạo trang bio cá nhân đẹp, chuyên nghiệp trong vài phút.
          Chia sẻ tất cả links, âm nhạc, portfolio chỉ qua một URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/login"
            className="px-8 py-3.5 text-base font-bold text-white rounded-2xl hover:opacity-90 transition-all shadow-lg"
            style={{ background: '#333A2F' }}>
            Tạo trang miễn phí →
          </Link>
          <a href="/u/demo" target="_blank" rel="noreferrer"
            className="px-8 py-3.5 text-base font-semibold rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <ExternalLink size={16} /> Xem demo
          </a>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-10">
          Tính năng nổi bật
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.label} className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#EBEDDF' }}>
                <f.icon size={18} style={{ color: '#333A2F' }} />
              </div>
              <p className="font-bold text-sm mb-1">{f.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-10">Giá cả</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Free */}
          <div className="p-7 rounded-3xl border-2 border-gray-100">
            <p className="font-black text-xl mb-1">Free</p>
            <p className="text-3xl font-black mb-4">0₫</p>
            <ul className="space-y-2.5 mb-7 text-sm text-gray-600">
              {['30+ templates miễn phí', '13 layout miễn phí', 'Analytics 7-30 ngày', 'QR Code, VCard', 'Music player, Contact form', 'Testimonials'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/login"
              className="block w-full py-3 text-center text-sm font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
              Bắt đầu miễn phí
            </Link>
          </div>
          {/* Pro */}
          <div className="p-7 rounded-3xl border-2 relative overflow-hidden" style={{ borderColor: '#333A2F', background: '#333A2F' }}>
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-amber-400 text-[10px] font-black rounded-full text-black uppercase tracking-widest">
              PRO
            </div>
            <p className="font-black text-xl text-white mb-1">Pro</p>
            <p className="text-3xl font-black text-white mb-1">149.000₫</p>
            <p className="text-xs text-white/60 mb-5">/tháng</p>
            <ul className="space-y-2.5 mb-7 text-sm text-white/80">
              {['Tất cả tính năng Free', '4 templates PRO độc quyền', '7 layouts PRO', 'Analytics 90 ngày + CTR', 'Bảo vệ trang bằng mật khẩu', 'Custom CSS không giới hạn', 'Social bar không giới hạn', 'Gradient & ảnh nền tuỳ chỉnh'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing"
              className="block w-full py-3 text-center text-sm font-bold rounded-xl bg-amber-400 text-black hover:bg-amber-300 transition-all">
              Nâng cấp PRO →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-10">
          Người dùng nói gì
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="p-5 rounded-2xl border border-gray-100">
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic mb-4">"{t.text}"</p>
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: '#333A2F' }}>
          Tạo trang DONLY của bạn ngay hôm nay
        </h2>
        <p className="text-gray-500 mb-8">Miễn phí. Không cần thẻ ngân hàng. Dùng ngay trong 2 phút.</p>
        <Link to="/login"
          className="inline-block px-10 py-4 text-base font-bold text-white rounded-2xl hover:opacity-90 transition-all shadow-lg"
          style={{ background: '#333A2F' }}>
          Bắt đầu miễn phí →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        <p>© 2026 DONLY · Trang bio đẹp nhất cho người Việt</p>
      </footer>
    </div>
  )
}
