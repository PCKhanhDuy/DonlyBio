import { useEffect, useState } from 'react'
import { X, Download, Copy, Check, QrCode } from 'lucide-react'
import QRCode from 'qrcode'

interface Props {
  url: string
  username: string
  onClose: () => void
}

export default function QRModal({ url, username, onClose }: Props) {
  const [dataUrl, setDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#333A2F', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    }).then(setDataUrl)
  }, [url])

  const download = () => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `donly-${username}-qr.png`
    a.click()
  }

  const copy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-xs w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#333A2F,#4a5540,#7a8a6a)' }} />
        <div className="p-7">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#EBEDDF' }}>
              <QrCode size={18} style={{ color: '#333A2F' }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">QR Code</h2>
              <p className="text-xs text-gray-400">Quét để mở trang của bạn</p>
            </div>
          </div>

          {dataUrl ? (
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-inner">
                <img src={dataUrl} alt="QR Code" className="w-52 h-52 block" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-60 mb-5">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
            </div>
          )}

          <div className="bg-gray-50 rounded-xl px-3 py-2 mb-5">
            <p className="text-center text-xs text-gray-500 font-mono truncate">{url}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              {copied ? <><Check size={14} className="text-green-500" /> Đã copy</> : <><Copy size={14} /> Copy link</>}
            </button>
            <button
              onClick={download}
              disabled={!dataUrl}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
              style={{ background: '#333A2F' }}
            >
              <Download size={14} /> Tải PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
