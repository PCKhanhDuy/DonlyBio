import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Link2, Pencil, X, Check, Globe,
  GripVertical, Heading1, Star, Calendar, Image as ImageIcon, Clock, Type, Timer, BarChart2 } from 'lucide-react'
import {
  SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiShopee,
  SiGithub, SiTelegram, SiWhatsapp, SiMessenger, SiZalo,
  SiDiscord, SiTwitch, SiSpotify, SiPinterest, SiReddit,
  SiSnapchat, SiMedium, SiBehance, SiDribbble, SiThreads,
} from 'react-icons/si'
import { Briefcase } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import type { BioLink, BlockType } from '../../types'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram',   icon: SiInstagram, color: '#E1306C' },
  { id: 'tiktok',   label: 'TikTok',      icon: SiTiktok,    color: '#010101' },
  { id: 'youtube',  label: 'YouTube',     icon: SiYoutube,   color: '#FF0000' },
  { id: 'facebook', label: 'Facebook',    icon: SiFacebook,  color: '#1877F2' },
  { id: 'twitter',  label: 'X / Twitter', icon: SiX,         color: '#14171A' },
  { id: 'threads',  label: 'Threads',     icon: SiThreads,   color: '#000000' },
  { id: 'linkedin', label: 'LinkedIn',    icon: Briefcase,   color: '#0A66C2' },
  { id: 'github',   label: 'GitHub',      icon: SiGithub,    color: '#24292e' },
  { id: 'telegram', label: 'Telegram',    icon: SiTelegram,  color: '#2AABEE' },
  { id: 'whatsapp', label: 'WhatsApp',    icon: SiWhatsapp,  color: '#25D366' },
  { id: 'messenger',label: 'Messenger',   icon: SiMessenger, color: '#0084FF' },
  { id: 'discord',  label: 'Discord',     icon: SiDiscord,   color: '#5865F2' },
  { id: 'twitch',   label: 'Twitch',      icon: SiTwitch,    color: '#9146FF' },
  { id: 'spotify',  label: 'Spotify',     icon: SiSpotify,   color: '#1ED760' },
  { id: 'pinterest',label: 'Pinterest',   icon: SiPinterest, color: '#E60023' },
  { id: 'reddit',   label: 'Reddit',      icon: SiReddit,    color: '#FF4500' },
  { id: 'snapchat', label: 'Snapchat',    icon: SiSnapchat,  color: '#FFFC00' },
  { id: 'medium',   label: 'Medium',      icon: SiMedium,    color: '#000000' },
  { id: 'behance',  label: 'Behance',     icon: SiBehance,   color: '#1769FF' },
  { id: 'dribbble', label: 'Dribbble',    icon: SiDribbble,  color: '#EA4C89' },
  { id: 'shopee',   label: 'Shopee',      icon: SiShopee,    color: '#EE4D2D' },
  { id: 'zalo',     label: 'Zalo',        icon: SiZalo,      color: '#0068FF' },
  { id: 'website',  label: 'Website',     icon: Globe,       color: '#6366F1' },
  { id: 'custom',   label: 'Custom Link', icon: Link2,       color: '#8B5CF6' },
]

const getPlatform = (id: string | null) => PLATFORMS.find(p => p.id === id) ?? PLATFORMS[PLATFORMS.length - 1]

const INPUT = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] bg-white text-gray-800'

const BLOCK_TYPES: { id: BlockType; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { id: 'youtube',   label: 'YouTube',       icon: SiYoutube,   color: '#FF0000', desc: 'Embed video' },
  { id: 'spotify',   label: 'Spotify',       icon: SiSpotify,   color: '#1ED760', desc: 'Embed nhạc' },
  { id: 'instagram', label: 'Instagram Post',icon: SiInstagram, color: '#E1306C', desc: 'Link bài viết' },
  { id: 'tiktok',    label: 'TikTok Video',  icon: SiTiktok,    color: '#010101', desc: 'Link video' },
  { id: 'heading',   label: 'Heading',       icon: Heading1,    color: '#6366F1', desc: 'Tiêu đề phân cách' },
  { id: 'text',      label: 'Text',          icon: Type,        color: '#64748b', desc: 'Đoạn văn bản' },
  { id: 'image',     label: 'Image',         icon: ImageIcon,   color: '#0ea5e9', desc: 'Ảnh full-width' },
  { id: 'countdown',    label: 'Countdown',       icon: Timer,      color: '#f97316', desc: 'Đồng hồ đếm ngược' },
  { id: 'github',       label: 'GitHub Stats',    icon: SiGithub,   color: '#24292e', desc: 'GitHub profile card' },
  { id: 'poll',         label: 'Poll / Vote',     icon: BarChart2,  color: '#8b5cf6', desc: 'Bình chọn tương tác' },
  { id: 'youtube_feed', label: 'YouTube Channel', icon: SiYoutube,  color: '#FF0000', desc: 'Video mới nhất' },
  { id: 'twitter',      label: 'Tweet Card',      icon: SiX,        color: '#14171A', desc: 'Nhúng tweet/post' },
]

function getBlockMeta(bt: BlockType | null) {
  return BLOCK_TYPES.find(b => b.id === bt) ?? null
}

function isScheduled(link: BioLink) {
  return !!(link.active_from || link.active_until)
}

function isCurrentlyActive(link: BioLink) {
  const now = new Date()
  if (link.active_from && new Date(link.active_from) > now) return false
  if (link.active_until && new Date(link.active_until) < now) return false
  return true
}

// ─── Sortable row wrapper ──────────────────────────────────────────────────────
function SortableRow({ link, children }: { link: BioLink; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.45 : 1 }}
      className="relative">
      <div {...attributes} {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500 z-10 touch-none">
        <GripVertical size={15} />
      </div>
      {children}
    </div>
  )
}

// ─── Add link form ─────────────────────────────────────────────────────────────
function AddLinkForm({ linksCount, onSaved, onCancel }: {
  linksCount: number
  onSaved: () => void
  onCancel: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ platform: 'instagram', title: 'Instagram', url: '' })
  const [saving, setSaving] = useState(false)

  const handlePlatformChange = (id: string) => {
    const p = getPlatform(id)
    setForm({ platform: id, title: p.label, url: '' })
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('bio_links').insert({
      user_id: user!.id, platform: form.platform, title: form.title, url: form.url,
      sort_order: linksCount, block_type: 'link', is_featured: false,
    })
    if (error) { toast('Lỗi khi lưu link', 'error'); setSaving(false); return }
    toast('Đã thêm link!')
    onSaved()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm">Thêm Link Mạng Xã Hội</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto pr-1">
        {PLATFORMS.map(p => {
          const Icon = p.icon; const sel = form.platform === p.id
          return (
            <button key={p.id} type="button" onClick={() => handlePlatformChange(p.id)} title={p.label}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 text-[10px] font-medium transition-all ${sel ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: sel ? p.color + '20' : '#f3f4f6' }}>
                <Icon size={15} style={{ color: sel ? p.color : '#9ca3af' }} />
              </div>
              <span className="truncate w-full text-center leading-tight">{p.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Tiêu đề" value={form.title} required onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
        <input type="url" placeholder="https://..." value={form.url} required onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Hủy</button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-white text-sm font-medium rounded-xl disabled:opacity-50 hover:opacity-90" style={{ background: '#333A2F' }}>
          {saving ? 'Đang lưu…' : 'Lưu Link'}
        </button>
      </div>
    </form>
  )
}

// ─── Add block form ────────────────────────────────────────────────────────────
function AddBlockForm({ linksCount, onSaved, onCancel }: {
  linksCount: number
  onSaved: () => void
  onCancel: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [blockType, setBlockType] = useState<BlockType>('youtube')
  const [form, setForm] = useState({ title: '', url: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const needsUrl = !['heading', 'text'].includes(blockType)
    const needsTitle = ['text', 'poll'].includes(blockType)
    if (needsUrl && !form.url) return
    if (needsTitle && !form.title) return
    setSaving(true)
    const { error } = await supabase.from('bio_links').insert({
      user_id: user!.id, platform: null,
      title: form.title || '', url: form.url || '',
      sort_order: linksCount, block_type: blockType, is_featured: false,
    })
    if (error) { toast('Lỗi khi thêm block', 'error'); setSaving(false); return }
    toast('Đã thêm block!')
    onSaved()
    setSaving(false)
  }

  const urlPlaceholder: Record<string, string> = {
    youtube:      'https://www.youtube.com/watch?v=...',
    spotify:      'https://open.spotify.com/track/...',
    instagram:    'https://www.instagram.com/p/...',
    tiktok:       'https://www.tiktok.com/@user/video/...',
    image:        'https://example.com/image.jpg',
    countdown:    '',
    twitter:      'https://x.com/user/status/...',
    youtube_feed: 'https://www.youtube.com/@channelname',
    poll:         '',
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm">Thêm Content Block</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BLOCK_TYPES.map(b => {
          const Icon = b.icon; const sel = blockType === b.id
          return (
            <button key={b.id} type="button" onClick={() => { setBlockType(b.id); setForm({ title: '', url: '' }) }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all text-center ${sel ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
              <Icon size={18} style={{ color: sel ? b.color : '#9ca3af' }} />
              <div>
                <div className="font-semibold">{b.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{b.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="space-y-2">
        {blockType === 'heading' && (
          <input type="text" placeholder="Tiêu đề phân cách" value={form.title} required onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
        )}
        {blockType === 'text' && (
          <textarea placeholder="Nội dung đoạn văn..." value={form.title} required rows={4}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className={INPUT + ' resize-none'} />
        )}
        {blockType === 'countdown' && (
          <>
            <input type="text" placeholder="Tên sự kiện (e.g. Ra mắt sản phẩm)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày & giờ mục tiêu</label>
              <input type="datetime-local" value={form.url} required onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
            </div>
          </>
        )}
        {blockType === 'poll' && (
          <>
            <input type="text" placeholder="Câu hỏi bình chọn" value={form.title} required onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Các lựa chọn (phân cách bằng dấu phẩy)</label>
              <input type="text" placeholder="Lựa chọn A, Lựa chọn B, Lựa chọn C" value={form.url} required onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
              <p className="text-[10px] text-gray-400 mt-1">Nhập các phương án, cách nhau bằng dấu phẩy</p>
            </div>
          </>
        )}
        {!['heading', 'text', 'countdown', 'poll'].includes(blockType) && (
          <>
            <input type="url" placeholder={urlPlaceholder[blockType] || 'https://...'} value={form.url} required onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className={INPUT} />
            <input type="text" placeholder="Tiêu đề (tùy chọn)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
          </>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Hủy</button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-white text-sm font-medium rounded-xl disabled:opacity-50 hover:opacity-90" style={{ background: '#333A2F' }}>
          {saving ? 'Đang lưu…' : 'Thêm Block'}
        </button>
      </div>
    </form>
  )
}

// ─── Inline edit form ──────────────────────────────────────────────────────────
function EditForm({ link, onSaved, onCancel }: { link: BioLink; onSaved: () => void; onCancel: () => void }) {
  const { toast } = useToast()
  const isBlock = link.block_type && link.block_type !== 'link'
  const [platform, setPlatform] = useState(link.platform ?? 'custom')
  const [title, setTitle]       = useState(link.title)
  const [url, setUrl]           = useState(link.url)
  const [thumbnail, setThumbnail] = useState(link.thumbnail_url ?? '')
  const [useSchedule, setUseSchedule] = useState(!!(link.active_from || link.active_until))
  const [activeFrom,  setActiveFrom]  = useState(link.active_from  ? link.active_from.slice(0, 16)  : '')
  const [activeUntil, setActiveUntil] = useState(link.active_until ? link.active_until.slice(0, 16) : '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title) return
    setSaving(true)
    const { error } = await supabase.from('bio_links').update({
      platform:      isBlock ? null : platform,
      title,
      url:           link.block_type === 'heading' ? '' : url,
      thumbnail_url: thumbnail || null,
      active_from:   useSchedule && activeFrom  ? new Date(activeFrom).toISOString()  : null,
      active_until:  useSchedule && activeUntil ? new Date(activeUntil).toISOString() : null,
    }).eq('id', link.id)
    if (error) { toast('Lỗi khi lưu', 'error'); setSaving(false); return }
    toast('Đã lưu thay đổi!')
    onSaved()
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border-2 p-4 shadow-sm space-y-3" style={{ borderColor: '#333A2F' }}>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#333A2F' }}>Chỉnh Sửa</p>

      {!isBlock && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {PLATFORMS.map(p => {
            const PIcon = p.icon; const sel = platform === p.id
            return (
              <button key={p.id} type="button" onClick={() => { setPlatform(p.id); setTitle(getPlatform(p.id).label) }} title={p.label}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 text-[10px] font-medium transition-all ${sel ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: sel ? p.color + '20' : '#f3f4f6' }}>
                  <PIcon size={13} style={{ color: sel ? p.color : '#9ca3af' }} />
                </div>
                <span className="truncate w-full text-center">{p.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {link.block_type === 'text' ? (
          <textarea placeholder="Nội dung đoạn văn..." value={title} required rows={3}
            onChange={e => setTitle(e.target.value)}
            className={INPUT + ' resize-none sm:col-span-2'} />
        ) : (
          <input type="text" placeholder="Tiêu đề" value={title} required onChange={e => setTitle(e.target.value)} className={INPUT} />
        )}
        {link.block_type === 'countdown' ? (
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Ngày & giờ mục tiêu</label>
            <input type="datetime-local" value={url} onChange={e => setUrl(e.target.value)} className={INPUT} />
          </div>
        ) : !['heading', 'text'].includes(link.block_type ?? '') && (
          <input type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} className={INPUT} />
        )}
      </div>

      {/* Thumbnail (for regular links only) */}
      {(!link.block_type || link.block_type === 'link') && (
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1.5">
            <ImageIcon size={12} /> Ảnh thumbnail (tùy chọn)
          </label>
          <input type="url" placeholder="https://example.com/image.jpg" value={thumbnail} onChange={e => setThumbnail(e.target.value)} className={INPUT} />
          {thumbnail && (
            <div className="mt-2 flex items-center gap-2">
              <img src={thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
              <p className="text-xs text-gray-400">Preview thumbnail</p>
            </div>
          )}
        </div>
      )}

      {/* Schedule */}
      <div>
        <button type="button" onClick={() => setUseSchedule(v => !v)}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${useSchedule ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          <Calendar size={12} /> {useSchedule ? 'Đã đặt lịch' : 'Đặt lịch (tùy chọn)'}
        </button>
        {useSchedule && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Từ ngày</label>
              <input type="datetime-local" value={activeFrom} onChange={e => setActiveFrom(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Đến ngày</label>
              <input type="datetime-local" value={activeUntil} onChange={e => setActiveUntil(e.target.value)} className={INPUT} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">
          <X size={13} /> Hủy
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#333A2F' }}>
          <Check size={13} /> {saving ? 'Đang lưu…' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}

// ─── Main tab ──────────────────────────────────────────────────────────────────
export default function LinksTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [links, setLinks]       = useState<BioLink[]>([])
  const [loading, setLoading]   = useState(true)
  const [mode, setMode]         = useState<'link' | 'block' | null>(null)
  const [editId, setEditId]     = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    const { data } = await supabase.from('bio_links').select('*').eq('user_id', user!.id).order('sort_order')
    setLinks(data ?? [])
    setLoading(false)
  }

  const toggle = async (link: BioLink) => {
    await supabase.from('bio_links').update({ is_active: !link.is_active }).eq('id', link.id)
    setLinks(ls => ls.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l))
    toast(link.is_active ? 'Link đã ẩn' : 'Link đã bật', 'info')
  }

  const remove = async (id: string) => {
    await supabase.from('bio_links').delete().eq('id', id)
    setLinks(ls => ls.filter(l => l.id !== id))
    setDeletingId(null)
    toast('Đã xóa link', 'info')
  }

  const toggleFeatured = async (link: BioLink) => {
    const newVal = !link.is_featured
    if (newVal) {
      // Unset all others first
      await supabase.from('bio_links').update({ is_featured: false }).eq('user_id', user!.id)
      await supabase.from('bio_links').update({ is_featured: true }).eq('id', link.id)
      setLinks(ls => ls.map(l => ({ ...l, is_featured: l.id === link.id })))
      toast('Đã đặt làm link nổi bật')
    } else {
      await supabase.from('bio_links').update({ is_featured: false }).eq('id', link.id)
      setLinks(ls => ls.map(l => l.id === link.id ? { ...l, is_featured: false } : l))
      toast('Đã bỏ nổi bật', 'info')
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = links.findIndex(l => l.id === active.id)
    const newIdx = links.findIndex(l => l.id === over.id)
    const newArr = arrayMove(links, oldIdx, newIdx)
    setLinks(newArr)
    await Promise.all(newArr.map((l, i) => supabase.from('bio_links').update({ sort_order: i }).eq('id', l.id)))
  }

  const isBlock = (l: BioLink) => l.block_type && l.block_type !== 'link'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Links & Blocks</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kéo <GripVertical size={11} className="inline" /> để sắp xếp. Nhấn <Star size={11} className="inline" /> để đặt link nổi bật.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setMode(mode === 'block' ? null : 'block'); setEditId(null) }}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border transition-all ${mode === 'block' ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Plus size={15} /> Block
          </button>
          <button onClick={() => { setMode(mode === 'link' ? null : 'link'); setEditId(null) }}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#333A2F' }}>
            <Plus size={15} /> Link
          </button>
        </div>
      </div>

      {mode === 'link' && (
        <AddLinkForm linksCount={links.length} onSaved={() => { setMode(null); fetchLinks() }} onCancel={() => setMode(null)} />
      )}
      {mode === 'block' && (
        <AddBlockForm linksCount={links.length} onSaved={() => { setMode(null); fetchLinks() }} onCancel={() => setMode(null)} />
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Link2 size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Chưa có link nào</p>
          <p className="text-xs text-gray-400 mt-1">Thêm link mạng xã hội hoặc content block.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {links.map(link => {
                const bt = link.block_type

                if (editId === link.id) return (
                  <div key={link.id}>
                    <EditForm link={link}
                      onSaved={() => { setEditId(null); fetchLinks() }}
                      onCancel={() => setEditId(null)} />
                  </div>
                )

                const scheduled = isScheduled(link)
                const liveNow   = scheduled ? isCurrentlyActive(link) : true

                // Common actions strip
                const actions = (
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {/* Featured star — only for regular links */}
                    {(!bt || bt === 'link') && (
                      <button onClick={() => toggleFeatured(link)}
                        title={link.is_featured ? 'Bỏ nổi bật' : 'Đặt làm nổi bật'}
                        className="p-1.5 rounded-lg transition-all hover:bg-amber-50">
                        <Star size={14} className={link.is_featured ? 'text-amber-400' : 'text-gray-300 hover:text-amber-300'} fill={link.is_featured ? '#fbbf24' : 'none'} />
                      </button>
                    )}
                    <button onClick={() => { setEditId(link.id); setMode(null) }}
                      className="p-1.5 text-gray-300 hover:text-[#333A2F] hover:bg-[#EBEDDF] rounded-lg transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => toggle(link)} className="px-1 text-gray-400">
                      {link.is_active ? <ToggleRight size={20} style={{ color: '#333A2F' }} /> : <ToggleLeft size={20} />}
                    </button>
                    {deletingId === link.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => remove(link.id)} className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-lg">Del</button>
                        <button onClick={() => setDeletingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={12} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(link.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )

                // ── Heading block ──
                if (bt === 'heading') return (
                  <SortableRow key={link.id} link={link}>
                    <div className={`flex items-center gap-3 pl-8 pr-3 py-3 bg-white rounded-2xl border transition-all ${link.is_active ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
                      <Heading1 size={16} className="text-violet-500 flex-shrink-0" />
                      <span className="flex-1 text-sm font-bold text-gray-800">{link.title}</span>
                      <span className="hidden sm:block text-[10px] text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full font-medium">Heading</span>
                      {actions}
                    </div>
                  </SortableRow>
                )

                // ── Content block ──
                if (isBlock(link)) {
                  const meta = getBlockMeta(bt)
                  const BIcon = meta?.icon ?? Link2
                  const bColor = meta?.color ?? '#8B5CF6'
                  return (
                    <SortableRow key={link.id} link={link}>
                      <div className={`flex items-center gap-3 pl-8 pr-3 py-3 bg-white rounded-2xl border transition-all ${link.is_active && liveNow ? 'border-gray-200' : 'border-gray-100 opacity-55'}`}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bColor + '15' }}>
                          <BIcon size={16} style={{ color: bColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{link.title || meta?.label}</p>
                          <p className="text-xs text-gray-400 truncate">{link.url}</p>
                        </div>
                        <span className="hidden sm:block text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ color: bColor, borderColor: bColor + '40', background: bColor + '10' }}>
                          {meta?.label}
                        </span>
                        {actions}
                      </div>
                    </SortableRow>
                  )
                }

                // ── Regular link ──
                const plat = getPlatform(link.platform)
                const PlatIcon = plat.icon
                return (
                  <SortableRow key={link.id} link={link}>
                    <div className={`flex items-center gap-3 pl-8 pr-3 py-2.5 bg-white rounded-2xl border transition-all ${link.is_active && liveNow ? 'border-gray-200' : 'border-gray-100 opacity-55'} ${link.is_featured ? 'ring-2 ring-amber-300 ring-offset-0' : ''}`}>
                      {/* Thumbnail or platform icon */}
                      {link.thumbnail_url ? (
                        <img src={link.thumbnail_url} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: plat.color + '15' }}>
                          <PlatIcon size={18} style={{ color: plat.color }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-gray-900 truncate">{link.title}</p>
                          {link.is_featured && <Star size={11} className="text-amber-400 flex-shrink-0" fill="#fbbf24" />}
                          {scheduled && (
                            <span className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              <Clock size={9} /> {liveNow ? 'Live' : 'Chờ'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                      </div>
                      <span className="hidden sm:block text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0"
                        style={{ color: plat.color, borderColor: plat.color + '40', background: plat.color + '10' }}>
                        {plat.label}
                      </span>
                      {actions}
                    </div>
                  </SortableRow>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {links.length > 0 && (
        <p className="text-xs text-center text-gray-400 pt-1">
          {links.filter(l => l.is_active).length}/{links.length} items hiển thị · Kéo để sắp xếp
        </p>
      )}
    </div>
  )
}
