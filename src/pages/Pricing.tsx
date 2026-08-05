import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Crown, Zap, ArrowLeft, Mail, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'

const A = '#5B6AD0'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'Cá nhân mới bắt đầu.',
    monthly: 0,
    yearly: 0,
    highlight: false,
    cta: 'Tiếp tục miễn phí',
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
    missing: [
      'Templates & Layouts premium',
      'Analytics 30+ ngày',
      'Announcement banner',
      'Custom CSS',
      'Background image & gradient',
    ],
  },
  {
    id: 'creator',
    name: 'Creator',
    desc: 'Creator muốn nổi bật.',
    monthly: 59000,
    yearly: 39000,
    yearlyTotal: 468000,
    badge: 'Phổ biến',
    highlight: true,
    cta: 'Nâng cấp Creator',
    features: [
      'Tất cả Starter',
      '30+ templates đẹp',
      '13 layout options',
      'Analytics 30 ngày',
      'Testimonials block',
      'VCard download 1 chạm',
      'Link animation & nâng cao',
      'Custom social icon bar',
    ],
    missing: [
      '4 templates PRO độc quyền',
      'Analytics 90 ngày + CTR',
      'Custom CSS không giới hạn',
      'Bảo vệ trang bằng mật khẩu',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Brand & agency chuyên nghiệp.',
    monthly: 99000,
    yearly: 65000,
    yearlyTotal: 780000,
    highlight: false,
    cta: 'Nâng cấp Pro',
    features: [
      'Tất cả Creator',
      '4 templates PRO độc quyền',
      '7 layouts PRO',
      'Analytics 90 ngày + CTR',
      'Bảo vệ trang bằng mật khẩu',
      'Custom CSS không giới hạn',
      'Background image & gradient',
      'Priority support',
    ],
    missing: [],
  },
]

function fmt(n: number) {
  if (n === 0) return '0₫'
  return n.toLocaleString('vi-VN') + '₫'
}

export default function Pricing() {
  const navigate = useNavigate()
  const { profile, isPro, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [activating, setActivating] = useState(false)
  const [contactPlan, setContactPlan] = useState<typeof PLANS[0] | null>(null)

  const currentPlan = profile?.plan ?? 'starter'

  const activateDemo = async (planId: string) => {
    if (!profile) return
    setActivating(true)
    await supabase.from('profiles').update({ plan: planId }).eq('id', profile.id)
    await refreshProfile()
    setActivating(false)
    toast(`Đã kích hoạt ${planId.toUpperCase()}!`)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <img src="/logo.png" alt="DONLY" className="h-7 object-contain" />
        {isPro && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Crown size={12} /> Bạn đang dùng PRO
          </span>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Chọn gói phù hợp</h1>
          <p className="text-gray-500 mt-2 text-base">Bắt đầu miễn phí, nâng cấp khi bạn cần thêm sức mạnh.</p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(['monthly', 'yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                style={billing === b
                  ? { background: '#333A2F', color: '#fff' }
                  : { color: '#6b7280' }}>
                {b === 'monthly' ? 'Theo tháng' : 'Theo năm'}
                {b === 'yearly' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: billing === 'yearly' ? A : '#EEF0FB', color: billing === 'yearly' ? '#fff' : A }}>
                    -34%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {PLANS.map(plan => {
            const price = billing === 'monthly' ? plan.monthly : (plan.yearly ?? plan.monthly)
            const isCurrent = currentPlan === plan.id
            const isDark = plan.id === 'pro'

            return (
              <div key={plan.id}
                className="rounded-3xl border-2 p-7 flex flex-col relative overflow-hidden transition-all"
                style={isDark
                  ? { background: '#1a1f18', borderColor: '#2d342b' }
                  : plan.highlight
                    ? { background: '#fff', borderColor: A + '60' }
                    : { background: '#fff', borderColor: '#e5e7eb' }}>

                {/* Top accent line for highlight */}
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-3xl" style={{ background: A }} />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-5 right-5 text-[10px] font-black text-white px-2.5 py-1 rounded-full"
                    style={{ background: A }}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-5">
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1.5"
                    style={{ color: isDark ? 'rgba(235,237,223,.4)' : plan.highlight ? A : '#9ca3af' }}>
                    {plan.name}
                  </p>
                  <p className="text-xs mb-4" style={{ color: isDark ? 'rgba(235,237,223,.45)' : '#6b7280' }}>
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-black tabular-nums"
                      style={{ color: isDark ? '#fff' : '#111' }}>
                      {fmt(price)}
                    </span>
                    {plan.monthly > 0 && (
                      <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(235,237,223,.35)' : '#9ca3af' }}>
                        /tháng
                      </span>
                    )}
                  </div>
                  {billing === 'yearly' && plan.yearlyTotal ? (
                    <p className="text-xs" style={{ color: isDark ? 'rgba(235,237,223,.3)' : '#9ca3af' }}>
                      Thanh toán {fmt(plan.yearlyTotal)}/năm
                    </p>
                  ) : plan.monthly === 0 ? (
                    <p className="text-xs" style={{ color: isDark ? 'rgba(235,237,223,.3)' : '#9ca3af' }}>
                      mãi mãi · không điều kiện
                    </p>
                  ) : null}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-2 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={isDark
                          ? { background: 'rgba(235,237,223,.12)' }
                          : plan.highlight
                            ? { background: A + '15' }
                            : { background: '#F5F5F0' }}>
                        <Check size={9} style={{ color: isDark ? '#a3e635' : plan.highlight ? A : '#333A2F' }} />
                      </div>
                      <span className="text-sm leading-snug"
                        style={{ color: isDark ? 'rgba(235,237,223,.75)' : '#374151' }}>
                        {f}
                      </span>
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X size={9} className="text-gray-300" />
                      </div>
                      <span className="text-sm leading-snug"
                        style={{ color: isDark ? 'rgba(235,237,223,.2)' : '#d1d5db' }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-2xl text-center text-sm font-bold border-2"
                    style={isDark
                      ? { borderColor: 'rgba(235,237,223,.2)', color: 'rgba(235,237,223,.5)' }
                      : { borderColor: '#e5e7eb', color: '#9ca3af' }}>
                    Gói hiện tại
                  </div>
                ) : plan.id === 'starter' ? (
                  <button onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
                    {plan.cta}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => setContactPlan(plan)}
                      className="w-full py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                      style={isDark
                        ? { background: '#EBEDDF', color: '#333A2F' }
                        : plan.highlight
                          ? { background: A, color: '#fff' }
                          : { background: '#333A2F', color: '#fff' }}>
                      <Zap size={14} /> {plan.cta}
                    </button>
                    {profile && (
                      <button onClick={() => activateDemo(plan.id)} disabled={activating}
                        className="w-full py-1.5 rounded-xl text-[11px] font-medium transition-colors"
                        style={{ color: isDark ? 'rgba(235,237,223,.3)' : '#9ca3af' }}>
                        {activating ? 'Đang kích hoạt…' : `Demo: Kích hoạt ${plan.name}`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Câu hỏi thường gặp</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { q: 'Tôi có thể hủy bất cứ lúc nào không?', a: 'Có. Tài khoản giữ gói hiện tại đến hết chu kỳ thanh toán, sau đó về Starter.' },
              { q: 'Dữ liệu có bị mất khi downgrade không?', a: 'Không. Links, sản phẩm và ảnh vẫn giữ nguyên. Chỉ các tính năng premium bị khóa.' },
              { q: 'Thanh toán qua hình thức nào?', a: 'Chuyển khoản ngân hàng, MoMo, ZaloPay. Liên hệ để được hướng dẫn chi tiết.' },
              { q: 'Gói Creator và Pro khác nhau thế nào?', a: 'Pro có thêm 4 templates độc quyền, analytics 90 ngày, Custom CSS và bảo vệ trang bằng mật khẩu.' },
            ].map(item => (
              <div key={item.q} className="border border-gray-100 rounded-2xl p-4">
                <p className="font-semibold text-gray-800 text-sm mb-1.5">{item.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {contactPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setContactPlan(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setContactPlan(null)} className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100">
              <X size={16} />
            </button>
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Nâng cấp {contactPlan.name}</h3>
              <p className="text-sm text-gray-500">
                Gói <strong>{contactPlan.name}</strong> —&nbsp;
                <strong>{fmt(billing === 'monthly' ? contactPlan.monthly : contactPlan.yearly ?? contactPlan.monthly)}</strong>/tháng
                {billing === 'yearly' && contactPlan.yearlyTotal ? ` · ${fmt(contactPlan.yearlyTotal)}/năm` : ''}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Liên hệ để được kích hoạt trong vòng 24h.
            </p>
            <div className="space-y-3">
              <a href={`mailto:duyphan925@gmail.com?subject=Nâng cấp DONLY ${contactPlan.name}&body=Xin chào, tôi muốn nâng cấp tài khoản lên gói ${contactPlan.name} (${fmt(billing === 'monthly' ? contactPlan.monthly : contactPlan.yearly ?? contactPlan.monthly)}/tháng). Tài khoản: ${profile?.username ?? ''}`}
                className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Email</p>
                  <p className="text-xs text-gray-400">duyphan925@gmail.com</p>
                </div>
              </a>
              <a href="https://zalo.me/0000000000" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Zalo</p>
                  <p className="text-xs text-gray-400">Nhắn tin trực tiếp</p>
                </div>
              </a>
            </div>
            <p className="text-center text-xs text-gray-400 mt-5">Phản hồi trong 1–24 giờ</p>
          </div>
        </div>
      )}
    </div>
  )
}
