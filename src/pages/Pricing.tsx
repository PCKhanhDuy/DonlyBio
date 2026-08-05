import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Crown, Zap, ArrowLeft, Mail, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'

const FREE_FEATURES = [
  { label: 'BioLink trang cá nhân', ok: true },
  { label: 'Số link không giới hạn', ok: true },
  { label: '13 template miễn phí', ok: true },
  { label: '12 layout miễn phí', ok: true },
  { label: 'Background màu sắc', ok: true },
  { label: 'Social bar (tối đa 3 icon)', ok: true },
  { label: 'Analytics cơ bản (7 & 30 ngày)', ok: true },
  { label: 'SEO meta tags', ok: true },
  { label: 'Products & Gallery', ok: true },
  { label: 'Template & Layout premium', ok: false },
  { label: 'Background gradient & ảnh', ok: false },
  { label: 'Social bar không giới hạn', ok: false },
  { label: 'Announcement banner', ok: false },
  { label: 'Analytics 90 ngày + CTR', ok: false },
  { label: 'AI tạo bio tự động', ok: false },
]

const PRO_FEATURES = [
  { label: 'BioLink trang cá nhân', ok: true },
  { label: 'Số link không giới hạn', ok: true },
  { label: '4 template premium (Ocean, Sunset, Aurora, Rose)', ok: true },
  { label: '7 layout premium (Card, Split, Glass, Masonry…)', ok: true },
  { label: 'Background gradient & upload ảnh', ok: true },
  { label: 'Social bar không giới hạn', ok: true },
  { label: 'Analytics 90 ngày + chỉ số CTR', ok: true },
  { label: 'SEO meta tags đầy đủ', ok: true },
  { label: 'Announcement banner (sticky)', ok: true },
  { label: 'AI tạo bio tự động', ok: true },
  { label: 'Products & Gallery', ok: true },
  { label: 'Ưu tiên hỗ trợ', ok: true },
  { label: 'Tất cả tính năng tương lai', ok: true },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { profile, isPro, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [activating, setActivating] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const activateDemo = async () => {
    if (!profile) return
    setActivating(true)
    await supabase.from('profiles').update({ plan: 'pro' }).eq('id', profile.id)
    await refreshProfile()
    setActivating(false)
    toast('🎉 PRO đã được kích hoạt!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <img src="/logo.png" alt="DONLY" className="h-7 object-contain" />
        {isPro && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <Crown size={12} /> Bạn đang dùng PRO
          </span>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}
          >
            <Crown size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Chọn gói phù hợp
          </h1>
          <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi bạn cần thêm sức mạnh.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Miễn phí</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">0₫</span>
                <span className="text-gray-400 mb-1.5">/tháng</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Bắt đầu xây dựng BioLink của bạn ngay hôm nay.</p>
            </div>
            <div className="flex-1 space-y-2.5 mb-8">
              {FREE_FEATURES.map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  {f.ok
                    ? <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#EBEDDF' }}>
                        <Check size={9} style={{ color: '#333A2F' }} />
                      </div>
                    : <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-100">
                        <X size={9} className="text-gray-300" />
                      </div>
                  }
                  <span className={`text-sm ${f.ok ? 'text-gray-700' : 'text-gray-300'}`}>{f.label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              Tiếp tục miễn phí
            </button>
          </div>

          {/* Pro */}
          <div
            className="rounded-3xl p-8 flex flex-col relative overflow-hidden"
            style={{ background: '#333A2F' }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#f59e0b,transparent)', transform: 'translate(30%,-30%)' }} />

            <div className="mb-6 relative">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">PRO</p>
                <span className="text-[10px] bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full">Phổ biến nhất</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-white">149.000₫</span>
                <span className="text-[#EBEDDF]/60 mb-1.5">/tháng</span>
              </div>
              <p className="text-sm text-[#EBEDDF]/70 mt-2">Toàn bộ tính năng để tạo BioLink chuyên nghiệp.</p>
            </div>

            <div className="flex-1 space-y-2.5 mb-8 relative">
              {PRO_FEATURES.map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(235,237,223,0.2)' }}>
                    <Check size={9} className="text-amber-400" />
                  </div>
                  <span className="text-sm text-[#EBEDDF]">{f.label}</span>
                </div>
              ))}
            </div>

            {isPro ? (
              <div className="w-full py-3 rounded-2xl text-center font-bold text-sm text-[#333A2F] bg-amber-400">
                ✓ Bạn đang dùng PRO
              </div>
            ) : (
              <div className="space-y-2.5 relative">
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full py-3 rounded-2xl font-bold text-sm text-[#333A2F] bg-[#EBEDDF] hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={15} /> Nâng cấp ngay
                </button>
                {profile && (
                  <button
                    onClick={activateDemo}
                    disabled={activating}
                    className="w-full py-2 rounded-2xl font-medium text-xs text-[#EBEDDF]/50 hover:text-[#EBEDDF]/80 transition-colors border border-white/10"
                  >
                    {activating ? 'Đang kích hoạt…' : '🔧 Demo: Kích hoạt PRO (test)'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact modal */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowContact(false)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowContact(false)} className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100">
                <X size={16} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Liên hệ nâng cấp</h3>
              <p className="text-sm text-gray-500 mb-6">
                Gửi tin nhắn cho chúng tôi để được kích hoạt PRO ngay trong vòng 24h.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:duyphan925@gmail.com?subject=Nâng cấp DONLY PRO&body=Xin chào, tôi muốn nâng cấp tài khoản lên PRO."
                  className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Email</p>
                    <p className="text-xs text-gray-400">duyphan925@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://zalo.me/0000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Zalo</p>
                    <p className="text-xs text-gray-400">Nhắn tin trực tiếp</p>
                  </div>
                </a>
              </div>
              <p className="text-center text-xs text-gray-400 mt-5">
                Phản hồi trong 1–24 giờ · Giá 149.000₫/tháng
              </p>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-5">
            {[
              { q: 'Tôi có thể hủy bất cứ lúc nào không?', a: 'Có, bạn có thể hủy gói PRO bất kỳ lúc nào. Tài khoản sẽ giữ PRO đến hết chu kỳ thanh toán.' },
              { q: 'Dữ liệu của tôi có bị mất khi downgrade không?', a: 'Không. Tất cả links, sản phẩm và hình ảnh vẫn được giữ nguyên. Chỉ các tính năng PRO sẽ bị khóa.' },
              { q: 'Thanh toán qua hình thức nào?', a: 'Hiện tại hỗ trợ: Chuyển khoản ngân hàng, MoMo, ZaloPay. Liên hệ để được hướng dẫn.' },
              { q: 'PRO có thêm tính năng mới không?', a: 'Có! Tất cả tính năng mới trong tương lai đều sẽ có trong gói PRO mà không tăng giá.' },
            ].map(item => (
              <div key={item.q}>
                <p className="font-semibold text-gray-800 text-sm mb-1">{item.q}</p>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
