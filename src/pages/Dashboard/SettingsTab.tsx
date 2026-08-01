import { useState, useRef } from 'react'
import { Camera, Save, User, FileText, AtSign, Briefcase, KeyRound, Download, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function SettingsTab() {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [jobTitle, setJobTitle] = useState(profile?.job_title ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const qrContainerRef = useRef<HTMLDivElement>(null)

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user!.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    setAvatarUrl(data.publicUrl + '?t=' + Date.now())
    setUploading(false)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ display_name: displayName, job_title: jobTitle, bio, avatar_url: avatarUrl }).eq('id', user!.id)
    await refreshProfile()
    setSaving(false)
    if (error) toast('Lỗi khi lưu', 'error')
    else toast('Đã lưu profile!')
  }

  const initials = (displayName || profile?.username || 'U')[0].toUpperCase()

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Update your public profile information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: '#333A2F' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                : <span className="text-white text-2xl font-bold">{initials}</span>
              }
            </div>
            <label className={`absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-sm transition-all ${uploading ? 'opacity-50' : ''}`}>
              <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" disabled={uploading} />
              <Camera size={14} className="text-gray-600" />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Profile photo</p>
            <p className="text-xs text-gray-400 mb-2">Upload or paste an image URL</p>
            <input type="url" placeholder="https://example.com/photo.jpg" value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            {uploading && <p className="text-xs mt-1" style={{ color: '#333A2F' }}>Uploading…</p>}
          </div>
        </div>

        {/* Username (read-only) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <AtSign size={15} className="text-gray-400" /> Username
          </label>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
            @{profile?.username}
            <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md">Locked</span>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User size={15} className="text-gray-400" /> Display Name
          </label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Your name" maxLength={60}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
        </div>

        {/* Job Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase size={15} className="text-gray-400" /> Job Title
          </label>
          <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
            placeholder="e.g. Photographer · Content Creator" maxLength={80}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
        </div>

        {/* Bio */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText size={15} className="text-gray-400" /> Bio
          </label>
          <textarea value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Tell people about yourself…" rows={3} maxLength={160}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] resize-none" />
          <p className="text-xs text-gray-400 text-right mt-1">{bio.length}/160</p>
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: '#333A2F' }}>
          <Save size={16} />
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </form>

      {/* QR Code */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <QrCode size={15} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">QR Code</h3>
        </div>
        {profile?.username ? (
          <div className="flex items-start gap-5">
            <div ref={qrContainerRef} className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
              <QRCodeSVG
                value={`${window.location.origin}/u/${profile.username}`}
                size={120}
                bgColor="#ffffff"
                fgColor="#333A2F"
                level="M"
              />
            </div>
            <div className="flex-1 space-y-2 pt-1">
              <p className="text-xs text-gray-500 leading-relaxed">
                QR code cho trang của bạn. Ai scan sẽ được đưa đến <span className="font-mono font-medium">/u/{profile.username}</span>
              </p>
              <button
                onClick={() => {
                  const svg = qrContainerRef.current?.querySelector('svg')
                  if (!svg) return
                  const svgData = new XMLSerializer().serializeToString(svg)
                  const canvas = document.createElement('canvas')
                  canvas.width = 400; canvas.height = 400
                  const ctx = canvas.getContext('2d')!
                  const img = new Image()
                  img.onload = () => { ctx.drawImage(img, 0, 0, 400, 400); const a = document.createElement('a'); a.download = `qr-${profile.username}.png`; a.href = canvas.toDataURL('image/png'); a.click() }
                  img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Download size={13} /> Download PNG
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">Set your username first to generate a QR code.</p>
        )}
      </div>

      {/* Account */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Account</h3>
        <Link to="/reset-password"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <KeyRound size={15} className="text-gray-400" /> Change Password
        </Link>
      </div>
    </div>
  )
}
