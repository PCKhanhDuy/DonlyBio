import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Check, ArrowRight, Star, ChevronRight } from 'lucide-react'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify, SiGithub, SiTelegram, SiWhatsapp, SiX, SiThreads } from 'react-icons/si'

// ─── Global CSS ────────────────────────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  @keyframes float{0%,100%{transform:translateY(0px) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
  @keyframes float2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
  @keyframes float3{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
  @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes pulse-ring{0%{transform:scale(.8);opacity:.8}100%{transform:scale(2);opacity:0}}
  @keyframes glow-pulse{0%,100%{opacity:.6}50%{opacity:1}}
  @keyframes fade-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes counter{from{opacity:0}to{opacity:1}}
  @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

  .land *{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .land a{text-decoration:none}
  .land h1,.land h2,.land h3{letter-spacing:-0.04em;line-height:1.05}

  .btn-cta{
    display:inline-flex;align-items:center;gap:10px;
    background:#fff;color:#0a0a0a;
    font-weight:800;font-size:16px;
    padding:15px 32px;border-radius:14px;border:none;cursor:pointer;
    box-shadow:0 0 0 1px rgba(255,255,255,.15),0 4px 32px rgba(255,255,255,.2);
    transition:all .2s;
  }
  .btn-cta:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(255,255,255,.3),0 8px 48px rgba(255,255,255,.3)}

  .btn-ghost{
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);
    font-weight:600;font-size:15px;
    padding:14px 28px;border-radius:14px;
    border:1px solid rgba(255,255,255,.12);
    cursor:pointer;transition:all .2s;
  }
  .btn-ghost:hover{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.2)}

  .badge-float{
    position:absolute;
    background:rgba(15,15,15,.85);
    border:1px solid rgba(255,255,255,.14);
    border-radius:16px;padding:10px 14px;
    backdrop-filter:blur(16px);
    display:flex;align-items:center;gap:10px;
    white-space:nowrap;color:#fff;
    box-shadow:0 8px 32px rgba(0,0,0,.4);
  }
  .badge-float span{font-size:12px;font-weight:700}

  .feat-item:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.12)!important;background:rgba(255,255,255,.06)!important}
  .feat-item{transition:all .25s}

  .card-light{background:#fff;border-radius:24px;border:1px solid #f0ede8}
  .card-light:hover{box-shadow:0 8px 40px rgba(0,0,0,.08);transform:translateY(-2px)}
  .card-light{transition:all .25s}

  .pro-badge{
    background:linear-gradient(135deg,#f59e0b,#f97316);
    color:#000;font-size:10px;font-weight:900;letter-spacing:1.5px;
    text-transform:uppercase;padding:3px 10px;border-radius:99px;
  }
`

// ─── Phone mockup ──────────────────────────────────────────────────────────────
function Phone() {
  return (
    <div style={{
      width: 260, height: 520,
      borderRadius: 44,
      background: '#0d0d14',
      border: '2px solid rgba(255,255,255,.18)',
      boxShadow: '0 0 0 1px rgba(255,255,255,.05),0 60px 120px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.12)',
      overflow: 'hidden', position: 'relative', flexShrink: 0,
    }}>
      {/* Status bar pill */}
      <div style={{ position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',width:80,height:8,background:'#111',borderRadius:99,zIndex:10 }} />
      {/* Background gradient */}
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,.2) 0%,transparent 60%)' }} />

      <div style={{ padding:'40px 18px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:10,height:'100%' }}>
        {/* Avatar with glow */}
        <div style={{ position:'relative',marginBottom:4 }}>
          <div style={{ position:'absolute',inset:-6,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#ec4899)',opacity:.4,filter:'blur(8px)' }} />
          <div style={{ width:68,height:68,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,position:'relative',border:'3px solid rgba(255,255,255,.15)' }}>
            ✨
          </div>
        </div>
        <div style={{ height:11,width:110,background:'rgba(255,255,255,.9)',borderRadius:99 }} />
        <div style={{ height:8,width:74,background:'rgba(255,255,255,.3)',borderRadius:99 }} />
        {/* Socials */}
        <div style={{ display:'flex',gap:8,margin:'2px 0' }}>
          {['#E1306C','#010101','#FF0000','#1DA1F2','#29ABE2'].map((c,i) => (
            <div key={i} style={{ width:22,height:22,borderRadius:6,background:c,opacity:.85 }} />
          ))}
        </div>
        {/* Links */}
        {[
          {label:'Instagram', color:'#E1306C', delay:.1},
          {label:'TikTok',    color:'#010101', delay:.2},
          {label:'YouTube',   color:'#FF0000', delay:.3},
          {label:'Portfolio', color:'#6366f1', delay:.4},
        ].map((l,i) => (
          <div key={i} style={{
            width:210,height:38,borderRadius:12,
            background:`linear-gradient(135deg,${l.color}22,rgba(255,255,255,.04))`,
            border:`1px solid ${l.color}44`,
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            animation:`fade-up .4s ease ${l.delay}s both`,
          }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:l.color,boxShadow:`0 0 6px ${l.color}` }} />
            <div style={{ height:7,width:70,background:'rgba(255,255,255,.55)',borderRadius:99 }} />
          </div>
        ))}
        {/* Spotify mini */}
        <div style={{ width:210,background:'rgba(30,215,96,.08)',border:'1px solid rgba(30,215,96,.3)',borderRadius:12,padding:'8px 12px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:22,height:22,borderRadius:6,background:'#1ED760',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11 }}>▶</div>
            <div>
              <div style={{ height:6,width:72,background:'rgba(255,255,255,.65)',borderRadius:99,marginBottom:4 }} />
              <div style={{ height:4,width:110,background:'rgba(30,215,96,.4)',borderRadius:99 }} />
            </div>
          </div>
        </div>
        {/* Views counter */}
        <div style={{ marginTop:'auto',display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.05)',borderRadius:10,padding:'6px 12px',border:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 6px #10b981' }} />
          <span style={{ fontSize:10,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:2,textTransform:'uppercase' }}>donlybio.vercel.app</span>
        </div>
      </div>
    </div>
  )
}

// ─── Platforms marquee ─────────────────────────────────────────────────────────
const PLAT_ICONS = [SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiSpotify, SiGithub, SiTelegram, SiWhatsapp, SiX, SiThreads]
const PLAT_COLORS = ['#E1306C','#010101','#FF0000','#1877F2','#1ED760','#333','#229ED9','#25D366','#000','#101010']

// ─── Feature list ──────────────────────────────────────────────────────────────
const FEATURES = [
  { emoji:'🎨', title:'30+ Templates đẹp',     desc:'Mỗi template có palette màu riêng, preview thật trước khi chọn.' },
  { emoji:'📐', title:'19 Layout options',       desc:'Grid, Gallery, Magazine, Minimal, Bold... tự chọn bố cục phù hợp nhất.' },
  { emoji:'📊', title:'Analytics chi tiết',      desc:'Views, clicks, CTR — biểu đồ theo ngày, 7/30/90 ngày.' },
  { emoji:'🎵', title:'Music Player',            desc:'Nhúng Spotify hoặc YouTube ngay trên trang bio, không cần rời trang.' },
  { emoji:'💬', title:'Contact Form + Inbox',    desc:'Khách nhắn tin thẳng, bạn đọc trong Dashboard mà không cần email.' },
  { emoji:'⭐', title:'Testimonials',            desc:'Thêm đánh giá từ khách hàng với rating, hiển thị đẹp trên bio page.' },
  { emoji:'📱', title:'QR Code',                desc:'Tự tạo QR dẫn về bio page, tải PNG để dùng offline.' },
  { emoji:'🔒', title:'Bảo vệ trang',           desc:'Đặt mật khẩu riêng cho trang bio, phù hợp nội dung giới hạn. Pro.', pro:true },
  { emoji:'✨', title:'Custom CSS',              desc:'Nhập CSS tuỳ ý để tùy biến không giới hạn — full control. Pro.', pro:true },
  { emoji:'🐙', title:'GitHub Stats Block',      desc:'Card live thống kê GitHub: repos, followers, bio tự động cập nhật.' },
  { emoji:'👤', title:'VCard Download',          desc:'Visitor bấm một nút để lưu contact của bạn thẳng vào điện thoại.' },
  { emoji:'⚡', title:'Link nâng cao',           desc:'Schedule lịch bật/tắt link, hiệu ứng animation, highlight màu.' },
]

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:'Minh Khoa',  role:'Content Creator',    avatar:'MK', color:'#6366f1', text:'Profile mình trông xịn hẳn sau khi dùng DONLY. Khách hàng hỏi design bằng tool gì 😂' },
  { name:'Thu Hương',  role:'Freelance Designer',  avatar:'TH', color:'#ec4899', text:'Music player là tính năng yêu thích nhất. Fan nghe nhạc ngay trên bio mà không cần mở app khác!' },
  { name:'Anh Tú',    role:'Photographer',        avatar:'AT', color:'#3b82f6', text:'Layout Gallery hiển thị portfolio cực kỳ đẹp. Lần đầu thấy một bio link có thể làm điều này.' },
  { name:'Linh Chi',  role:'Musician',            avatar:'LC', color:'#10b981', text:'Từ khi bật Spotify embed, thời gian khách ở trên trang bio của mình tăng gấp đôi!' },
  { name:'Duy Phong', role:'YouTuber',            avatar:'DP', color:'#f59e0b', text:'Analytics giúp mình biết hôm nào traffic cao, content nào đang dẫn nhiều click nhất.' },
  { name:'Hà My',     role:'KOL / Influencer',    avatar:'HM', color:'#ef4444', text:'Templates PRO đẹp vô cùng. Brand mình trông professional hẳn mà không cần thuê designer.' },
]

const FREE_F = ['30+ templates & themes','13 layout miễn phí','Không giới hạn links','Music player + QR code','Contact form + Inbox','Testimonials block','Analytics 7 & 30 ngày','VCard download','GitHub Stats block','Social icon bar']
const PRO_F  = ['Tất cả tính năng Free','4 templates PRO độc quyền','7 layouts PRO độc quyền','Analytics 90 ngày + CTR','Bảo vệ trang bằng mật khẩu','Custom CSS không giới hạn','Social bar không giới hạn','Background image / gradient','Announcement banner']

// ─── Counter hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setVal(Math.round(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

function StatCard({ n, suffix='', label }: { n: number; suffix?: string; label: string }) {
  const val = useCountUp(n)
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:48,fontWeight:900,color:'#fff',letterSpacing:-2,lineHeight:1 }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize:14,color:'rgba(255,255,255,.45)',fontWeight:600,marginTop:6 }}>{label}</div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="land" style={{ background:'#070709',color:'#fff',overflowX:'hidden',minHeight:'100vh' }}>
      <style>{CSS}</style>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position:'sticky',top:0,zIndex:999,
        borderBottom:'1px solid rgba(255,255,255,.06)',
        background:'rgba(7,7,9,.8)',backdropFilter:'blur(24px)',
        padding:'0 40px',height:64,
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{
            width:34,height:34,borderRadius:10,
            background:'linear-gradient(135deg,#333A2F,#5a7a4a)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 0 20px rgba(90,122,74,.4)',
          }}>
            <span style={{ color:'#EBEDDF',fontWeight:900,fontSize:17 }}>D</span>
          </div>
          <span style={{ fontWeight:900,fontSize:20,letterSpacing:-0.5,color:'#fff' }}>DONLY</span>
          <span style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,.3)',letterSpacing:2,textTransform:'uppercase',marginLeft:4 }}>Bio</span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <Link to="/login" style={{ color:'rgba(255,255,255,.55)',fontWeight:500,fontSize:14 }}>Đăng nhập</Link>
          <Link to="/login" style={{
            background:'#fff',color:'#0a0a0a',fontWeight:800,fontSize:14,
            padding:'9px 20px',borderRadius:12,
            display:'inline-flex',alignItems:'center',gap:6,
            transition:'all .2s',
          }}
            onMouseEnter={e => { const t=e.currentTarget; t.style.background='#f0f0f0'; t.style.transform='translateY(-1px)' }}
            onMouseLeave={e => { const t=e.currentTarget; t.style.background='#fff'; t.style.transform='' }}>
            Bắt đầu <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ position:'relative',minHeight:'90vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 40px 60px',overflow:'hidden' }}>
        {/* Background orbs */}
        <div style={{ position:'absolute',top:'-10%',left:'10%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:'0%',right:'5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(236,72,153,.08) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',top:'40%',left:'50%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,158,11,.06) 0%,transparent 70%)',pointerEvents:'none',transform:'translateX(-50%)' }} />

        <div style={{ maxWidth:1160,width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',gap:60,flexWrap:'wrap' }}>
          {/* Left: text */}
          <div style={{ flex:'1 1 420px',maxWidth:560 }}>
            {/* Pill badge */}
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,marginBottom:32,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:99,padding:'6px 16px' }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 8px #10b981',animation:'glow-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,.7)' }}>Miễn phí mãi mãi · Không cần thẻ ngân hàng</span>
            </div>

            <h1 style={{ fontSize:'clamp(48px,6vw,80px)',fontWeight:900,color:'#fff',marginBottom:24 }}>
              Một link.
              <br />
              <span style={{
                background:'linear-gradient(135deg,#a5b4fc 0%,#818cf8 30%,#f472b6 60%,#fb923c 100%)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              }}>
                Mọi thứ của bạn.
              </span>
            </h1>

            <p style={{ fontSize:18,color:'rgba(255,255,255,.5)',lineHeight:1.75,marginBottom:40,maxWidth:460 }}>
              Tạo trang bio cá nhân đẹp, chuyên nghiệp trong <strong style={{ color:'rgba(255,255,255,.8)' }}>2 phút</strong>. Links, nhạc, form liên hệ, testimonials — tất cả qua <strong style={{ color:'rgba(255,255,255,.8)' }}>một URL duy nhất</strong>.
            </p>

            <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:48 }}>
              <Link to="/login" className="btn-cta">
                Tạo trang miễn phí <ArrowRight size={17} />
              </Link>
              <Link to="/u/demo" className="btn-ghost" target="_blank">
                Xem demo →
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display:'flex',alignItems:'center',gap:16,flexWrap:'wrap' }}>
              <div style={{ display:'flex',alignItems:'center' }}>
                {['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6'].map((c,i) => (
                  <div key={i} style={{ width:30,height:30,borderRadius:'50%',background:c,border:'2px solid #070709',marginLeft:i>0?-10:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff' }}>
                    {['M','T','A','L','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex',gap:2,marginBottom:3 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}
                </div>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.4)',fontWeight:600 }}>Tin dùng bởi 1,000+ creators Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Right: phone + floating badges */}
          <div style={{ flex:'0 0 auto',position:'relative',width:380,height:580,display:'flex',alignItems:'center',justifyContent:'center' }}>
            {/* Glow behind phone */}
            <div style={{ position:'absolute',inset:'-15%',background:'radial-gradient(circle,rgba(99,102,241,.2) 0%,transparent 65%)',borderRadius:'50%',animation:'glow-pulse 3s ease-in-out infinite' }} />

            {/* The phone */}
            <div style={{ animation:'float 5s ease-in-out infinite', zIndex:2 }}>
              <Phone />
            </div>

            {/* Floating badges — positioned in the 380×580 wrapper */}
            <div className="badge-float" style={{ top:50,left:0,animation:'float2 3.5s ease-in-out infinite' }}>
              <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>📊</div>
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.45)',fontWeight:600 }}>Hôm nay</div>
                <span style={{ fontSize:14,fontWeight:800 }}>+128 views</span>
              </div>
            </div>

            <div className="badge-float" style={{ top:140,right:0,animation:'float3 4s ease-in-out infinite .5s' }}>
              <div style={{ fontSize:18 }}>👋</div>
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.45)',fontWeight:600 }}>Tin nhắn mới</div>
                <span style={{ fontSize:13,fontWeight:700 }}>Hà My: "Cho mình hỏi..."</span>
              </div>
            </div>

            <div className="badge-float" style={{ bottom:180,left:0,animation:'float2 4.5s ease-in-out infinite 1s' }}>
              <div style={{ width:28,height:28,borderRadius:8,background:'#1ED760',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#000' }}>▶</div>
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.45)',fontWeight:600 }}>Đang phát</div>
                <span style={{ fontSize:13,fontWeight:700 }}>Spotify embedded</span>
              </div>
            </div>

            <div className="badge-float" style={{ bottom:80,right:0,animation:'float3 3.8s ease-in-out infinite .3s' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:'#f59e0b',boxShadow:'0 0 8px #f59e0b' }} />
              <span style={{ fontSize:13,fontWeight:700 }}>Link click +42% ↑</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform logos marquee ──────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'28px 0',overflow:'hidden',background:'rgba(255,255,255,.02)' }}>
        <div style={{ display:'flex',animation:'marquee 20s linear infinite',width:'max-content',gap:0 }}>
          {[...PLAT_ICONS,...PLAT_ICONS].map((Icon,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:10,padding:'0 32px',color:'rgba(255,255,255,.3)',flexShrink:0 }}>
              <Icon size={20} color={PLAT_COLORS[i % PLAT_COLORS.length]} style={{ opacity:.6 }} />
              <span style={{ fontSize:13,fontWeight:700,letterSpacing:.5 }}>
                {['Instagram','TikTok','YouTube','Facebook','Spotify','GitHub','Telegram','WhatsApp','X (Twitter)','Threads'][i % 10]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section style={{ padding:'80px 40px',background:'linear-gradient(180deg,#070709 0%,#0f0f16 100%)' }}>
        <div style={{ maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:40 }}>
          <StatCard n={1000} suffix="+" label="Creators đang dùng" />
          <StatCard n={30}   suffix="+"  label="Templates đẹp" />
          <StatCard n={19}   suffix=""   label="Layout options" />
          <StatCard n={2}    suffix=" phút" label="Để tạo trang bio" />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#0f0f16' }}>
        <div style={{ maxWidth:1080,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:4,color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginBottom:16 }}>Tính năng</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,52px)',fontWeight:900,color:'#fff',marginBottom:16 }}>Mọi thứ bạn cần</h2>
            <p style={{ fontSize:17,color:'rgba(255,255,255,.4)',maxWidth:480,margin:'0 auto' }}>12 tính năng được thiết kế để bio page của bạn nổi bật và hiệu quả nhất.</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feat-item" style={{
                padding:'22px 20px',borderRadius:20,
                background:'rgba(255,255,255,.03)',
                border:'1px solid rgba(255,255,255,.07)',
                cursor:'default',
              }}>
                <div style={{ fontSize:30,marginBottom:12 }}>{f.emoji}</div>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
                  <p style={{ fontWeight:800,fontSize:14,color:'#fff' }}>{f.title.replace(/ Pro\.$|\.$/,'')}</p>
                  {f.pro && <span className="pro-badge">PRO</span>}
                </div>
                <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6 }}>{f.desc.replace(/ Pro\.$|\.$/,'')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#070709' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:4,color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginBottom:16 }}>Cách hoạt động</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,52px)',fontWeight:900,color:'#fff' }}>3 bước đơn giản</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20 }}>
            {[
              { n:'01',emoji:'🚀',title:'Đăng ký miễn phí',   desc:'Tạo tài khoản trong 10 giây, không cần thẻ ngân hàng hay điều kiện gì.',dark:false },
              { n:'02',emoji:'🎨',title:'Tùy chỉnh trang bio',desc:'Chọn template, thêm links, âm nhạc, contact form, testimonials…',dark:true },
              { n:'03',emoji:'✨',title:'Chia sẻ link của bạn',desc:'Một URL duy nhất — paste vào Instagram bio, TikTok, danh thiếp…',dark:false },
            ].map(s => (
              <div key={s.n} style={{
                padding:'36px 30px',borderRadius:24,
                background: s.dark ? 'linear-gradient(135deg,rgba(99,102,241,.2),rgba(236,72,153,.1))' : 'rgba(255,255,255,.04)',
                border: s.dark ? '1px solid rgba(99,102,241,.3)' : '1px solid rgba(255,255,255,.07)',
              }}>
                <div style={{ fontSize:42,marginBottom:16 }}>{s.emoji}</div>
                <div style={{ fontSize:11,fontWeight:700,letterSpacing:2,color:'rgba(255,255,255,.25)',textTransform:'uppercase',marginBottom:8 }}>Bước {s.n}</div>
                <p style={{ fontSize:18,fontWeight:800,color:'#fff',marginBottom:10 }}>{s.title}</p>
                <p style={{ fontSize:14,color:'rgba(255,255,255,.45)',lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#0f0f16' }}>
        <div style={{ maxWidth:1080,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:4,color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginBottom:16 }}>Testimonials</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,52px)',fontWeight:900,color:'#fff',marginBottom:12 }}>Được yêu thích bởi creators</h2>
            <div style={{ display:'flex',gap:2,justifyContent:'center' }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}
              <span style={{ fontSize:15,fontWeight:700,color:'rgba(255,255,255,.5)',marginLeft:8 }}>5.0 / 5</span>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ padding:'24px',borderRadius:20,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display:'flex',gap:2,marginBottom:14 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}
                </div>
                <p style={{ fontSize:14,color:'rgba(255,255,255,.6)',lineHeight:1.75,marginBottom:20,fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:'50%',background:t.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:13,flexShrink:0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight:700,fontSize:14,color:'#fff' }}>{t.name}</p>
                    <p style={{ fontSize:12,color:'rgba(255,255,255,.35)',fontWeight:600 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section style={{ padding:'100px 40px',background:'#070709' }}>
        <div style={{ maxWidth:820,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:4,color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginBottom:16 }}>Pricing</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,52px)',fontWeight:900,color:'#fff',marginBottom:12 }}>Đơn giản. Minh bạch.</h2>
            <p style={{ fontSize:16,color:'rgba(255,255,255,.4)' }}>Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng.</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:20,alignItems:'start' }}>
            {/* Free */}
            <div style={{ padding:'36px',borderRadius:28,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)' }}>
              <div style={{ marginBottom:8,fontSize:14,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:2 }}>Free</div>
              <div style={{ fontSize:48,fontWeight:900,color:'#fff',marginBottom:4 }}>0₫</div>
              <div style={{ fontSize:14,color:'rgba(255,255,255,.3)',marginBottom:28 }}>mãi mãi · không điều kiện</div>
              <ul style={{ listStyle:'none',marginBottom:32,display:'flex',flexDirection:'column',gap:11 }}>
                {FREE_F.map(f => (
                  <li key={f} style={{ display:'flex',alignItems:'center',gap:10,fontSize:14,color:'rgba(255,255,255,.65)' }}>
                    <div style={{ width:18,height:18,borderRadius:'50%',background:'rgba(99,102,241,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Check size={11} style={{ color:'#a5b4fc' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" style={{
                display:'block',textAlign:'center',padding:'14px',borderRadius:14,
                border:'1px solid rgba(255,255,255,.15)',fontWeight:700,fontSize:15,color:'rgba(255,255,255,.8)',
                transition:'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,.8)' }}>
                Bắt đầu miễn phí
              </Link>
            </div>

            {/* Pro */}
            <div style={{ padding:'36px',borderRadius:28,position:'relative',overflow:'hidden',background:'linear-gradient(160deg,rgba(99,102,241,.15) 0%,rgba(236,72,153,.1) 50%,rgba(245,158,11,.08) 100%)',border:'1px solid rgba(99,102,241,.3)' }}>
              {/* Top shimmer bar */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)' }} />
              <div style={{ position:'absolute',top:24,right:24 }}>
                <span className="pro-badge">✦ PRO</span>
              </div>

              <div style={{ marginBottom:8,fontSize:14,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:2 }}>Pro</div>
              <div style={{ display:'flex',alignItems:'baseline',gap:4,marginBottom:4 }}>
                <span style={{ fontSize:48,fontWeight:900,color:'#fff' }}>149K</span>
                <span style={{ fontSize:16,color:'rgba(255,255,255,.4)',fontWeight:600 }}>₫/tháng</span>
              </div>
              <div style={{ fontSize:14,color:'rgba(255,255,255,.3)',marginBottom:28 }}>~5,000₫/ngày</div>

              <ul style={{ listStyle:'none',marginBottom:32,display:'flex',flexDirection:'column',gap:11 }}>
                {PRO_F.map(f => (
                  <li key={f} style={{ display:'flex',alignItems:'center',gap:10,fontSize:14,color:'rgba(255,255,255,.75)' }}>
                    <div style={{ width:18,height:18,borderRadius:'50%',background:'rgba(245,158,11,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Check size={11} style={{ color:'#fbbf24' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" style={{
                display:'block',textAlign:'center',padding:'14px',borderRadius:14,
                background:'linear-gradient(135deg,#6366f1,#ec4899)',fontWeight:800,fontSize:15,color:'#fff',
                boxShadow:'0 8px 32px rgba(99,102,241,.4)',transition:'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(99,102,241,.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,.4)' }}>
                Nâng cấp PRO ngay →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding:'0 40px 80px' }}>
        <div style={{
          maxWidth:960,margin:'0 auto',
          borderRadius:32,overflow:'hidden',
          position:'relative',
          background:'linear-gradient(135deg,rgba(99,102,241,.2) 0%,rgba(236,72,153,.15) 50%,rgba(245,158,11,.1) 100%)',
          border:'1px solid rgba(255,255,255,.1)',
          padding:'80px 40px',
          textAlign:'center',
        }}>
          <div style={{ position:'absolute',top:-100,left:-100,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)',pointerEvents:'none' }} />
          <div style={{ position:'absolute',bottom:-80,right:-80,width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(236,72,153,.12) 0%,transparent 70%)',pointerEvents:'none' }} />
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ fontSize:52,marginBottom:20 }}>🚀</div>
            <h2 style={{ fontSize:'clamp(32px,4vw,56px)',fontWeight:900,color:'#fff',marginBottom:16,letterSpacing:-2 }}>
              Bắt đầu ngay hôm nay.
              <br />
              <span style={{
                background:'linear-gradient(135deg,#a5b4fc,#f472b6,#fb923c)',
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              }}>Miễn phí mãi mãi.</span>
            </h2>
            <p style={{ fontSize:17,color:'rgba(255,255,255,.45)',marginBottom:40,maxWidth:420,margin:'0 auto 40px' }}>
              Không cần thẻ ngân hàng. Tạo trang bio đẹp trong vòng 2 phút và bắt đầu nhận traffic ngay.
            </p>
            <Link to="/login" style={{
              display:'inline-flex',alignItems:'center',gap:12,
              background:'#fff',color:'#0a0a0a',fontWeight:900,
              padding:'18px 40px',borderRadius:16,fontSize:17,
              boxShadow:'0 8px 40px rgba(255,255,255,.25)',transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 16px 60px rgba(255,255,255,.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 40px rgba(255,255,255,.25)' }}>
              Tạo trang DONLY của bạn <ChevronRight size={20} />
            </Link>
            <p style={{ marginTop:20,fontSize:13,color:'rgba(255,255,255,.25)',fontWeight:600 }}>
              ✓ Miễn phí · ✓ Không giới hạn links · ✓ Không cần credit card
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.06)',padding:'32px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#333A2F,#5a7a4a)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ color:'#EBEDDF',fontWeight:900,fontSize:13 }}>D</span>
          </div>
          <span style={{ fontWeight:800,color:'rgba(255,255,255,.7)',fontSize:14 }}>DONLY</span>
          <span style={{ fontSize:13,color:'rgba(255,255,255,.25)' }}>© 2026</span>
        </div>
        <div style={{ display:'flex',gap:24 }}>
          {['Đăng nhập','Pricing'].map(l => (
            <Link key={l} to={l==='Pricing'?'/pricing':'/login'} style={{ fontSize:13,color:'rgba(255,255,255,.3)',fontWeight:600,transition:'color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='rgba(255,255,255,.7)' }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,.3)' }}>
              {l}
            </Link>
          ))}
        </div>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.2)',fontWeight:600 }}>Trang bio đẹp nhất cho người Việt 🇻🇳</p>
      </footer>
    </div>
  )
}
