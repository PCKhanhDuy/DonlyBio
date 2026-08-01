import { useNavigate } from 'react-router-dom'
import { X, Crown, Check, Zap } from 'lucide-react'

const PRO_FEATURES = [
  'Tất cả template & layout cao cấp (Ocean, Sunset, Glass…)',
  'Background gradient & upload ảnh tùy chỉnh',
  'Social bar không giới hạn (Free: tối đa 3)',
  'Announcement banner (sticky top)',
  'Analytics 90 ngày + chỉ số CTR',
  'AI tạo bio tự động',
  'Custom SEO meta tags',
  'Ưu tiên hỗ trợ',
]

export default function UpgradeModal({ onClose, feature }: { onClose: () => void; feature?: string }) {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top strip */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316,#ef4444)' }} />

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}
            >
              <Crown size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">Nâng cấp PRO</h2>
            {feature && (
              <p className="text-xs text-amber-600 font-semibold mt-1 bg-amber-50 inline-block px-2.5 py-0.5 rounded-full">
                Mở khóa: {feature}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Truy cập toàn bộ tính năng để tạo BioLink đẳng cấp.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-2 mb-5">
            {PRO_FEATURES.map(f => (
              <div key={f} className="flex items-start gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: '#EBEDDF' }}
                >
                  <Check size={9} style={{ color: '#333A2F' }} />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-1.5 mb-5 py-3 bg-gray-50 rounded-2xl">
            <span className="text-2xl font-black text-gray-900">149.000₫</span>
            <span className="text-xs text-gray-400 font-medium">/tháng</span>
          </div>

          {/* CTA */}
          <button
            onClick={() => { onClose(); navigate('/pricing') }}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg,#333A2F,#4a5540)' }}
          >
            <Zap size={15} />
            Xem gói & nâng cấp ngay
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-2.5">
            Không cần thẻ tín dụng · Hủy bất kỳ lúc nào
          </p>
        </div>
      </div>
    </div>
  )
}
