import { useState, useEffect } from 'react'
import { Check, Palette, Layout, Sparkles, Upload, Link as LinkIcon, Image, Sliders, Globe, Plus, Trash2, X, Crown } from 'lucide-react'
import UpgradeModal from '../../components/UpgradeModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { TEMPLATES, LAYOUTS, FONTS, DEFAULT_SETTINGS } from '../../types'
import type { TemplateId, LayoutId, CustomSettings } from '../../types'

type Section = 'templates' | 'layouts' | 'background' | 'style' | 'social'
type BgType  = 'default' | 'color' | 'gradient' | 'image'

// ─── Gradient presets ─────────────────────────────────────────────────────────
const GRADIENT_PRESETS = [
  { label: 'Purple',   value: 'linear-gradient(135deg,#7C3AED 0%,#DB2777 100%)' },
  { label: 'Sky',      value: 'linear-gradient(135deg,#0891b2 0%,#1e40af 100%)' },
  { label: 'Sunset',   value: 'linear-gradient(135deg,#f97316 0%,#ec4899 100%)' },
  { label: 'Forest',   value: 'linear-gradient(135deg,#065f46 0%,#0891b2 100%)' },
  { label: 'Peach',    value: 'linear-gradient(135deg,#fbbf24 0%,#f43f5e 100%)' },
  { label: 'Mint',     value: 'linear-gradient(135deg,#34d399 0%,#3b82f6 100%)' },
  { label: 'Candy',    value: 'linear-gradient(135deg,#f953c6 0%,#b91d73 100%)' },
  { label: 'Gold',     value: 'linear-gradient(135deg,#f59e0b 0%,#dc2626 100%)' },
  { label: 'Ocean',    value: 'linear-gradient(180deg,#0c1445 0%,#1a3a6b 60%,#0c1445 100%)' },
  { label: 'Rose',     value: 'linear-gradient(135deg,#fce7f3 0%,#fdf2f8 100%)' },
  { label: 'Matcha',   value: 'linear-gradient(135deg,#b7e4c7 0%,#d8f3dc 100%)' },
  { label: 'Midnight', value: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' },
]

// ─── Mesh gradient presets ───────────────────────────────────────────────────
const MESH_PRESETS = [
  { label: 'Flamingo',     value: 'radial-gradient(at 40% 20%,#ff758c 0%,transparent 50%),radial-gradient(at 80% 80%,#ffa07a 0%,transparent 50%),radial-gradient(at 10% 80%,#da8fff 0%,transparent 50%),radial-gradient(at 80% 20%,#ffd07b 0%,transparent 50%),#ffe0f0' },
  { label: 'Aurora',       value: 'radial-gradient(at 30% 20%,#06d6a0 0%,transparent 50%),radial-gradient(at 80% 70%,#8338ec 0%,transparent 50%),radial-gradient(at 10% 80%,#3a86ff 0%,transparent 50%),radial-gradient(at 90% 10%,#00bbf9 0%,transparent 50%),#0a0a2e' },
  { label: 'Golden Hour',  value: 'radial-gradient(at 20% 30%,#ffd93d 0%,transparent 50%),radial-gradient(at 80% 20%,#ff6b6b 0%,transparent 50%),radial-gradient(at 50% 80%,#ff8c42 0%,transparent 50%),radial-gradient(at 90% 70%,#6bcb77 0%,transparent 50%),#fff3cd' },
  { label: 'Deep Ocean',   value: 'radial-gradient(at 20% 20%,#0096c7 0%,transparent 50%),radial-gradient(at 80% 80%,#023e8a 0%,transparent 50%),radial-gradient(at 60% 40%,#0077b6 0%,transparent 50%),radial-gradient(at 10% 80%,#48cae4 0%,transparent 50%),#03045e' },
  { label: 'Spring',       value: 'radial-gradient(at 40% 10%,#90e0ef 0%,transparent 50%),radial-gradient(at 80% 50%,#a8dadc 0%,transparent 50%),radial-gradient(at 10% 60%,#70e000 0%,transparent 50%),radial-gradient(at 70% 90%,#b7e4c7 0%,transparent 50%),#f0fff4' },
  { label: 'Dusk',         value: 'radial-gradient(at 20% 20%,#e63946 0%,transparent 50%),radial-gradient(at 80% 60%,#7209b7 0%,transparent 50%),radial-gradient(at 40% 80%,#f72585 0%,transparent 50%),radial-gradient(at 90% 20%,#ff6b35 0%,transparent 50%),#1a001e' },
  { label: 'Cotton Candy', value: 'radial-gradient(at 20% 30%,#ffc8dd 0%,transparent 50%),radial-gradient(at 80% 20%,#bde0fe 0%,transparent 50%),radial-gradient(at 50% 80%,#cdb4db 0%,transparent 50%),radial-gradient(at 90% 70%,#ffafcc 0%,transparent 50%),#fff0f3' },
  { label: 'Midnight Neon',value: 'radial-gradient(at 20% 20%,#00ff87 0%,transparent 50%),radial-gradient(at 80% 80%,#ff00c8 0%,transparent 50%),radial-gradient(at 60% 40%,#00b4d8 0%,transparent 50%),radial-gradient(at 10% 80%,#f9c74f 0%,transparent 50%),#000510' },
  { label: 'Blush',        value: 'radial-gradient(at 20% 30%,#ffc8dd 0%,transparent 55%),radial-gradient(at 80% 20%,#bde0fe 0%,transparent 55%),radial-gradient(at 10% 80%,#cdb4db 0%,transparent 50%),#fff0f3' },
  { label: 'Citrus',       value: 'radial-gradient(at 20% 30%,#fde68a 0%,transparent 50%),radial-gradient(at 80% 20%,#fca5a5 0%,transparent 50%),radial-gradient(at 50% 80%,#86efac 0%,transparent 50%),radial-gradient(at 90% 70%,#fdba74 0%,transparent 50%),#fffbeb' },
  { label: 'Violet Dream', value: 'radial-gradient(at 30% 30%,#a78bfa 0%,transparent 55%),radial-gradient(at 80% 70%,#818cf8 0%,transparent 55%),radial-gradient(at 60% 10%,#c4b5fd 0%,transparent 50%),#1e1b4b' },
  { label: 'Arctic',       value: 'radial-gradient(at 20% 30%,#e0f2fe 0%,transparent 55%),radial-gradient(at 80% 20%,#f0f9ff 0%,transparent 55%),radial-gradient(at 50% 80%,#dbeafe 0%,transparent 55%),radial-gradient(at 90% 70%,#ede9fe 0%,transparent 50%),#f8fafc' },
]

// ─── Background image presets (SVG patterns as data URIs) ────────────────────
const BG_PATTERNS = [
  {
    label: 'Dots',
    value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23ffffff22'/%3E%3C/svg%3E")`,
  },
  {
    label: 'Grid',
    value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ffffff1a' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  {
    label: 'Diagonal',
    value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cline x1='0' y1='10' x2='10' y2='0' stroke='%23ffffff18' stroke-width='1'/%3E%3C/svg%3E")`,
  },
]

function parseBgType(custom_bg: string | null): BgType {
  if (!custom_bg) return 'default'
  if (custom_bg.startsWith('img:')) return 'image'
  return (custom_bg.startsWith('linear') || custom_bg.startsWith('radial')) ? 'gradient' : 'color'
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${on ? 'bg-[#333A2F]' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function AppearanceTab() {
  const { profile, user, refreshProfile, isPro } = useAuth()
  const [section, setSection]   = useState<Section>('templates')
  const [tplId, setTplId]       = useState<TemplateId>((profile?.template_id ?? 'minimal') as TemplateId)
  const [layoutId, setLayoutId] = useState<LayoutId>((profile?.layout_id ?? 'centered') as LayoutId)
  const [settings, setSettings] = useState<CustomSettings>({
    ...DEFAULT_SETTINGS,
    ...(profile?.custom_settings ?? {}),
  })
  const [bgType, setBgType]     = useState<BgType>(parseBgType(profile?.custom_bg ?? null))
  const [bgColor, setBgColor]   = useState(() => {
    const bg = profile?.custom_bg
    return (bg && !bg.startsWith('linear') && !bg.startsWith('radial') && !bg.startsWith('img:')) ? bg : '#7C3AED'
  })
  const [bgGradient, setBgGradient] = useState(() => {
    const bg = profile?.custom_bg
    return (bg && (bg.startsWith('linear') || bg.startsWith('radial'))) ? bg : 'linear-gradient(135deg,#7C3AED 0%,#DB2777 100%)'
  })
  const [bgImageUrl, setBgImageUrl] = useState(() => {
    const bg = profile?.custom_bg
    return (bg?.startsWith('img:')) ? bg.slice(4) : ''
  })
  const [bgImageUploading, setBgImageUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [socialPlatform, setSocialPlatform] = useState('instagram')
  const [socialUrl, setSocialUrl]           = useState('')
  const [showUpgrade, setShowUpgrade]       = useState<string | false>(false)

  const effectiveBg =
    bgType === 'color'    ? bgColor
    : bgType === 'gradient' ? bgGradient
    : bgType === 'image'    ? (bgImageUrl ? `img:${bgImageUrl}` : null)
    : null

  // Load Google Fonts when nameFont / pageFont change
  useEffect(() => {
    [settings.pageFont, settings.nameFont].filter(Boolean).forEach(key => {
      const font = FONTS[key]
      if (!font?.google) return
      const id = `gf-dash-${key}`
      if (document.getElementById(id)) return
      const link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`
      document.head.appendChild(link)
    })
  }, [settings.pageFont, settings.nameFont])

  const set = <K extends keyof CustomSettings>(k: K, v: CustomSettings[K]) =>
    setSettings(s => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    await supabase.from('profiles').update({
      template_id:     tplId,
      layout_id:       layoutId,
      custom_bg:       effectiveBg,
      custom_settings: settings,
    }).eq('id', profile!.id)
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const uploadBgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setBgImageUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/bg.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (error) { alert('Upload failed: ' + error.message); setBgImageUploading(false); return }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    setBgImageUrl(data.publicUrl + '?t=' + Date.now())
    setBgImageUploading(false)
    e.target.value = ''
  }

  const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'templates',  label: 'Templates',  icon: Sparkles },
    { id: 'layouts',    label: 'Layouts',    icon: Layout   },
    { id: 'background', label: 'Background', icon: Palette  },
    { id: 'style',      label: 'Style',      icon: Sliders  },
    { id: 'social',     label: 'Social',     icon: Globe    },
  ]

  // Preview of current background (for bg section)
  const previewBg =
    bgType === 'color'    ? bgColor
    : bgType === 'gradient' ? bgGradient
    : bgType === 'image' && bgImageUrl ? `url(${bgImageUrl})`
    : null

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
          <p className="text-sm text-gray-500 mt-0.5">Customize your public page look & feel.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: '#333A2F' }}>
          <Palette size={16} />
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Section tabs */}
      <div className="overflow-x-auto pb-0.5 -mb-0.5">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-max min-w-full sm:w-fit">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                section === s.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <s.icon size={14} />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden text-xs">{s.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TEMPLATES ─── */}
      {section === 'templates' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {(Object.entries(TEMPLATES) as [TemplateId, typeof TEMPLATES[TemplateId]][]).map(([id, tpl]) => (
            <div key={id}
              onClick={() => {
                if (tpl.isPremium && !isPro) { setShowUpgrade('Template ' + tpl.label); return }
                setTplId(id)
              }}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                tplId === id
                  ? 'border-[#333A2F] shadow-md'
                  : 'border-gray-200 hover:border-gray-300'}`}>
              {/* Mini preview */}
              <div className="h-28 p-3 flex flex-col items-center justify-center gap-1.5" style={{ background: tpl.pageBg }}>
                <div className="w-7 h-7 rounded-full" style={{ background: tpl.cardBg, border: `2px solid ${tpl.cardBorder}` }} />
                <div className="w-12 h-1.5 rounded-full" style={{ background: tpl.textColor, opacity: 0.8 }} />
                <div className="w-full h-5 rounded-lg" style={{ background: tpl.btnBg, border: `1px solid ${tpl.btnBorder}` }} />
                <div className="w-full h-5 rounded-lg" style={{ background: tpl.btnBg, border: `1px solid ${tpl.btnBorder}` }} />
              </div>
              {/* Label */}
              <div className="px-2.5 py-2 bg-white border-t border-gray-100 flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-gray-700 truncate">{tpl.label}</span>
                {tplId === id && !tpl.isPremium && <Check size={12} className="flex-shrink-0" style={{ color: '#333A2F' }} />}
              </div>
              {/* Selected ring */}
              {tplId === id && !tpl.isPremium && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow" style={{ background: '#333A2F' }}>
                  <Check size={10} className="text-white"/>
                </div>
              )}
              {/* PRO overlay */}
              {tpl.isPremium && !isPro && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                  <Crown size={15} className="text-amber-400"/>
                  <span className="text-white text-[10px] font-bold bg-amber-500 px-2 py-0.5 rounded-full">PRO</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── LAYOUTS ────────────────────────────────────────────────────────── */}
      {section === 'layouts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(LAYOUTS) as [LayoutId, typeof LAYOUTS[LayoutId]][]).map(([id, layout]) => (
            <div key={id}
              onClick={() => {
                if (layout.isPremium && !isPro) { setShowUpgrade('Layout ' + layout.label); return }
                setLayoutId(id)
              }}
              className={`relative rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                layoutId === id
                  ? 'border-[#333A2F] bg-[#EBEDDF]/40'
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <LayoutMockup id={id} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{layout.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{layout.description}</p>
                </div>
                {layout.isPremium && !isPro
                  ? <span className="flex-shrink-0 flex items-center gap-1 text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                      <Crown size={9} /> PRO
                    </span>
                  : layoutId === id
                    ? <Check size={16} className="flex-shrink-0" style={{ color: '#333A2F' }} />
                    : null
                }
              </div>
              {layout.isPremium && !isPro && (
                <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-center px-4">
                    <Crown size={18} className="mx-auto text-amber-500 mb-1.5" />
                    <p className="text-xs font-semibold text-gray-600">Nâng cấp PRO</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── BACKGROUND ─────────────────────────────────────────────────────── */}
      {section === 'background' && (
        <div className="space-y-6 max-w-xl">

          {/* Type tabs */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Background type</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { id: 'default',  label: 'Template', icon: Sparkles, pro: false },
                { id: 'color',    label: 'Color',    icon: Palette,  pro: false },
                { id: 'gradient', label: 'Gradient', icon: Layout,   pro: true  },
                { id: 'image',    label: 'Image',    icon: Image,    pro: true  },
              ] as { id: BgType; label: string; icon: React.ElementType; pro: boolean }[]).map(t => (
                <button key={t.id}
                  onClick={() => {
                    if (t.pro && !isPro) { setShowUpgrade('Background ' + t.label); return }
                    setBgType(t.id)
                  }}
                  className={`relative flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    bgType === t.id
                      ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  <t.icon size={14} />
                  {t.label}
                  {t.pro && !isPro && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                      <Crown size={8} className="text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Default */}
          {bgType === 'default' && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
              <Sparkles size={16} className="text-gray-400 flex-shrink-0" />
              Uses the background from your selected template above.
            </div>
          )}

          {/* Solid color */}
          {bgType === 'color' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Solid color</p>
              <div className="flex items-center gap-4 mb-4">
                <label className="cursor-pointer">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="sr-only" />
                  <div className="w-14 h-14 rounded-2xl shadow-md border-2 border-white ring-2 ring-gray-200 cursor-pointer hover:ring-[#333A2F] transition-all"
                    style={{ background: bgColor }} />
                </label>
                <div>
                  <p className="text-base font-mono font-semibold text-gray-800">{bgColor.toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Click swatch to pick</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['#F9FAFB','#111827','#FAFAF8','#0D0D0D','#7C3AED','#DB2777','#0891b2','#059669','#F59E0B','#EF4444','#ECEFF4','#FFF8F0'].map(c => (
                  <button key={c} onClick={() => setBgColor(c)}
                    className={`w-8 h-8 rounded-xl border-2 transition-all ${bgColor === c ? 'border-[#333A2F] scale-110' : 'border-white ring-1 ring-gray-200'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          )}

          {/* Gradient */}
          {bgType === 'gradient' && (
            <div className="space-y-5">
              {/* Linear presets */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Linear gradients</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map(g => (
                    <button key={g.value} onClick={() => setBgGradient(g.value)}
                      title={g.label}
                      className={`h-14 rounded-xl transition-all ${
                        bgGradient === g.value ? 'ring-2 ring-[#333A2F] ring-offset-2 scale-105' : 'hover:scale-[1.03]'
                      }`}
                      style={{ background: g.value }} />
                  ))}
                </div>
              </div>

              {/* Mesh presets */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Mesh gradients</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {MESH_PRESETS.map(g => (
                    <button key={g.label} onClick={() => setBgGradient(g.value)}
                      title={g.label}
                      className={`h-14 rounded-xl transition-all ${
                        bgGradient === g.value ? 'ring-2 ring-[#333A2F] ring-offset-2 scale-105' : 'hover:scale-[1.03]'
                      }`}
                      style={{ background: g.value }} />
                  ))}
                </div>
              </div>

              {/* Custom CSS */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Custom CSS gradient</p>
                <input type="text" value={bgGradient} onChange={e => setBgGradient(e.target.value)}
                  placeholder="linear-gradient(135deg, #7C3AED, #DB2777)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
                <div className="h-10 rounded-xl mt-2 shadow-inner" style={{ background: bgGradient }} />
              </div>
            </div>
          )}

          {/* Image */}
          {bgType === 'image' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Background image</p>
              <p className="text-xs text-gray-400 -mt-2">Works best with the <strong>Overlay</strong> or <strong>Magazine</strong> layout.</p>

              {/* URL input */}
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="url" placeholder="https://your-image-url.jpg"
                  value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
              </div>

              {/* Upload */}
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${bgImageUploading ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-[#333A2F]/50 hover:bg-[#EBEDDF]/30'}`}>
                <input type="file" accept="image/*" onChange={uploadBgImage} className="hidden" disabled={bgImageUploading} />
                <Upload size={18} className={bgImageUploading ? 'animate-bounce' : 'text-gray-400'} style={bgImageUploading ? { color: '#333A2F' } : {}} />
                <div>
                  <p className="text-sm font-medium text-gray-600">{bgImageUploading ? 'Uploading…' : 'Upload background photo'}</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP — landscape works best</p>
                </div>
              </label>

              {/* Preview */}
              {bgImageUrl && (
                <div className="relative rounded-2xl overflow-hidden h-36 shadow-sm">
                  <img src={bgImageUrl} alt="Background preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-xs font-medium">Preview (with overlay)</p>
                  </div>
                  <button
                    onClick={() => setBgImageUrl('')}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-red-500/80 text-white text-xs rounded-lg backdrop-blur hover:bg-red-600 transition-colors">
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Live preview pill */}
          {previewBg && bgType !== 'image' && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 shadow-inner"
                style={{ background: previewBg }} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700">Live preview</p>
                <p className="text-[11px] text-gray-400 font-mono truncate">{previewBg}</p>
              </div>
            </div>
          )}

          {/* SVG Patterns section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2.5">Add a texture overlay</p>
            <p className="text-xs text-gray-400 mb-3">Combine with a solid color by selecting Color type first.</p>
            <div className="flex gap-2">
              {BG_PATTERNS.map(p => (
                <button key={p.label}
                  onClick={() => { setBgGradient(`${p.value}, ${bgColor}`); setBgType('gradient') }}
                  className="flex-1 h-10 rounded-xl border border-gray-200 hover:border-[#333A2F]/50 transition-all text-xs text-gray-500 overflow-hidden"
                  style={{ background: `${p.value}, #e2e8f0` }}
                  title={p.label}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STYLE ────────────────────────────────────────────────────────────── */}
      {section === 'style' && (
        <div className="space-y-8 max-w-2xl">
          
          {/* ── Avatar ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-bold text-gray-800">Avatar</p>

            <div>
              <p className="text-xs text-gray-500 mb-2">Shape</p>
              <div className="flex gap-2">
                {([
                  { key: 'circle',  label: 'Circle',  icon: '⬤' },
                  { key: 'rounded', label: 'Rounded', icon: '▣' },
                  { key: 'square',  label: 'Square',  icon: '■' },
                ] as const).map(s => (
                  <button key={s.key} onClick={() => set('avatarShape', s.key)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                      settings.avatarShape === s.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    <span className="text-base">{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Border</p>
              <Toggle on={settings.avatarBorder} onChange={() => set('avatarBorder', !settings.avatarBorder)} />
            </div>

            {settings.avatarBorder && (
              <div className="grid grid-cols-2 gap-4 pl-1">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Border color</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-xl shadow border-2 border-white ring-2 ring-gray-200"
                      style={{ background: settings.avatarBorderColor }}>
                      <input type="color" value={settings.avatarBorderColor}
                        onChange={e => set('avatarBorderColor', e.target.value)}
                        className="opacity-0 w-0 h-0" />
                    </div>
                    <span className="text-sm font-mono text-gray-600">{settings.avatarBorderColor}</span>
                  </label>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Width: {settings.avatarBorderWidth}px</p>
                  <input type="range" min={1} max={8} value={settings.avatarBorderWidth}
                    onChange={e => set('avatarBorderWidth', +e.target.value)}
                    className="w-full accent-[#333A2F]" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Drop Shadow</p>
              <Toggle on={settings.avatarShadow} onChange={() => set('avatarShadow', !settings.avatarShadow)} />
            </div>
          </section>

          {/* ── Name ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-bold text-gray-800">Name Style</p>

            <div>
              <p className="text-xs text-gray-500 mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {(['sm','base','lg','xl','2xl','3xl'] as const).map(s => (
                  <button key={s} onClick={() => set('nameSize', s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      settings.nameSize === s ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Weight</p>
              <div className="flex gap-2">
                {([['400','Regular'],['600','Semibold'],['700','Bold'],['900','Black']] as const).map(([w, l]) => (
                  <button key={w} onClick={() => set('nameWeight', w)}
                    className={`flex-1 py-2 rounded-xl text-xs border-2 transition-all ${
                      settings.nameWeight === w ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    style={{ fontWeight: w }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Color override</p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="w-9 h-9 rounded-xl shadow border-2 border-white ring-2 ring-gray-200"
                    style={{ background: settings.nameColor || '#374151' }}>
                    <input type="color" value={settings.nameColor || '#374151'}
                      onChange={e => set('nameColor', e.target.value)}
                      className="opacity-0 w-0 h-0" />
                  </div>
                </label>
                <span className="text-sm font-mono text-gray-600 flex-1">{settings.nameColor || '(template default)'}</span>
                {settings.nameColor && (
                  <button onClick={() => set('nameColor', '')} className="text-xs text-red-400 hover:text-red-600">Reset</button>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Page font</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {Object.entries(FONTS).map(([k, f]) => (
                  <button key={k} onClick={() => set('pageFont', k)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      settings.pageFont === k ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="text-lg font-bold text-gray-800 leading-tight" style={{ fontFamily: f.css }}>Aa</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{f.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Name font (override)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                <button onClick={() => set('nameFont', '')}
                  className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    !settings.nameFont ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500'
                  }`}>
                  Same as page
                </button>
                {Object.entries(FONTS).filter(([k]) => k !== 'default').map(([k, f]) => (
                  <button key={k} onClick={() => set('nameFont', k)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      settings.nameFont === k ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="text-lg font-bold text-gray-800 leading-tight" style={{ fontFamily: f.css }}>Aa</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{f.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Links ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-bold text-gray-800">Links</p>

            <div>
              <p className="text-xs text-gray-500 mb-2">Icon position</p>
              <div className="flex gap-2">
                {([['left','Left'],['right','Right'],['none','Hidden']] as const).map(([k, l]) => (
                  <button key={k} onClick={() => set('linkIconPos', k)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      settings.linkIconPos === k ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Corner radius: {settings.linkRadius}px</p>
              <input type="range" min={0} max={999} value={settings.linkRadius}
                onChange={e => set('linkRadius', +e.target.value)}
                className="w-full accent-[#333A2F]" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>Square</span><span>Rounded</span><span>Pill</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Height</p>
              <div className="flex gap-2">
                {([['sm','Compact'],['md','Normal'],['lg','Tall']] as const).map(([h, l]) => (
                  <button key={h} onClick={() => set('linkHeight', h)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      settings.linkHeight === h ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Custom background color</p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="w-9 h-9 rounded-xl shadow border-2 border-white ring-2 ring-gray-200"
                    style={{ background: settings.linkBgCustom || '#e5e7eb' }}>
                    <input type="color" value={settings.linkBgCustom || '#e5e7eb'}
                      onChange={e => set('linkBgCustom', e.target.value)}
                      className="opacity-0 w-0 h-0" />
                  </div>
                </label>
                <span className="text-sm font-mono text-gray-600 flex-1">{settings.linkBgCustom || '(template default)'}</span>
                {settings.linkBgCustom && (
                  <button onClick={() => set('linkBgCustom', '')} className="text-xs text-red-400 hover:text-red-600">Reset</button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Show border</p>
              <Toggle on={settings.linkBorder} onChange={() => set('linkBorder', !settings.linkBorder)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Drop shadow</p>
              <Toggle on={settings.linkShadow} onChange={() => set('linkShadow', !settings.linkShadow)} />
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Hover animation</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'none',   label: 'Không', emoji: '—'  },
                  { key: 'lift',   label: 'Lift',   emoji: '⬆'  },
                  { key: 'bounce', label: 'Bounce', emoji: '↕'  },
                  { key: 'shake',  label: 'Shake',  emoji: '↔'  },
                  { key: 'pulse',  label: 'Pulse',  emoji: '◎'  },
                  { key: 'glow',   label: 'Glow',   emoji: '✦'  },
                ] as const).map(a => (
                  <button key={a.key} onClick={() => set('linkAnimation', a.key)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      (settings.linkAnimation ?? 'none') === a.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    <span>{a.emoji}</span>{a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Nút lưu liên hệ (VCard)</p>
              <Toggle on={settings.vcardEnabled ?? false} onChange={() => set('vcardEnabled', !(settings.vcardEnabled ?? false))} />
            </div>
            <p className="text-xs text-gray-400 -mt-2">Hiển thị nút "Lưu liên hệ" trên trang public để khách tải VCard.</p>
          </section>

          {/* ── Products ── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-bold text-gray-800">Products</p>

            <div>
              <p className="text-xs text-gray-500 mb-2">Image shape</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { key: 'square',   label: 'Square',    icon: '■'  },
                  { key: 'portrait', label: 'Portrait',  icon: '▬'  },
                  { key: 'wide',     label: 'Wide 16:9', icon: '▭'  },
                  { key: 'circle',   label: 'Circle',    icon: '⬤' },
                ] as const).map(s => (
                  <button key={s.key} onClick={() => set('productImgRatio', s.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      settings.productImgRatio === s.key ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Columns</p>
              <div className="flex gap-2 w-48">
                {([2, 3] as const).map(n => (
                  <button key={n} onClick={() => set('productCols', n)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      settings.productCols === n ? 'border-[#333A2F] bg-[#EBEDDF] text-[#333A2F]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {n} cols
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Card radius: {settings.productRounded}px</p>
              <input type="range" min={0} max={24} value={settings.productRounded}
                onChange={e => set('productRounded', +e.target.value)}
                className="w-full max-w-xs accent-[#333A2F]" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Show price</p>
              <Toggle on={settings.productShowPrice} onChange={() => set('productShowPrice', !settings.productShowPrice)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Show description</p>
              <Toggle on={settings.productShowDesc} onChange={() => set('productShowDesc', !settings.productShowDesc)} />
            </div>
          </section>

          {/* ── Custom CSS (Pro) ── */}
          <section className={`bg-white rounded-2xl border border-gray-200 p-5 space-y-3 relative ${!isPro ? 'overflow-hidden' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Custom CSS</p>
                <p className="text-xs text-gray-400 mt-0.5">Tùy chỉnh style trang bằng CSS của bạn.</p>
              </div>
              {!isPro && (
                <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
                  <Crown size={10} /> PRO
                </span>
              )}
            </div>
            {isPro ? (
              <>
                <textarea
                  value={settings.customCss ?? ''}
                  onChange={e => set('customCss', e.target.value)}
                  placeholder={`.link-btn {\n  border-radius: 999px;\n}\n\n.page-bg {\n  opacity: 0.9;\n}`}
                  rows={8}
                  spellCheck={false}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#333A2F] resize-y bg-gray-50 text-gray-700"
                />
                <p className="text-[11px] text-gray-400">Áp dụng trực tiếp vào trang public. Target class: <code className="bg-gray-100 px-1 rounded">.link-btn</code>, <code className="bg-gray-100 px-1 rounded">.page-bg</code></p>
              </>
            ) : (
              <div
                className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer"
                onClick={() => setShowUpgrade('Custom CSS')}
              >
                <Crown size={22} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Nâng cấp PRO để dùng Custom CSS</p>
              </div>
            )}
          </section>

        </div>
      )}

      {/* ── SOCIAL BAR ───────────────────────────────────────────────────────── */}
      {section === 'social' && (
        <div className="max-w-lg space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-800">Social Bar</h3>
            <p className="text-xs text-gray-500 mt-0.5">Add social media icons below your name on the public page.</p>
          </div>

          {/* Add new icon */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">Add platform</p>
            <div className="flex gap-2">
              <select value={socialPlatform} onChange={e => setSocialPlatform(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] bg-white">
                {[
                  'instagram','tiktok','youtube','facebook','twitter','threads',
                  'linkedin','github','telegram','whatsapp','discord','twitch',
                  'spotify','pinterest','reddit','medium','behance','dribbble',
                  'shopee','zalo','website',
                ].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
              <input type="url" value={socialUrl} onChange={e => setSocialUrl(e.target.value)}
                placeholder="https://..."
                className="flex-[2] px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
              <button
                disabled={!socialUrl.trim()}
                onClick={() => {
                  if (!socialUrl.trim()) return
                  if ((settings.socialBar ?? []).length >= 3 && !isPro) {
                    setShowUpgrade('Social Bar không giới hạn')
                    return
                  }
                  const bar = [...(settings.socialBar ?? []), { platform: socialPlatform, url: socialUrl.trim() }]
                  set('socialBar', bar)
                  setSocialUrl('')
                }}
                className="px-3 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex-shrink-0"
                style={{ background: '#333A2F' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Current icons */}
          {(settings.socialBar ?? []).length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
              <p className="text-sm font-semibold text-gray-700 mb-3">Active icons</p>
              {(settings.socialBar ?? []).map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl">
                  <Globe size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0 capitalize">{s.platform}</span>
                  <span className="text-xs text-gray-400 flex-1 truncate">{s.url}</span>
                  <button onClick={() => {
                    const bar = (settings.socialBar ?? []).filter((_, j) => j !== i)
                    set('socialBar', bar)
                  }} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
              Chưa có icon mạng xã hội nào.
            </div>
          )}

          {/* Announcement Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Announcement Banner</h3>
              <p className="text-xs text-gray-500 mt-0.5">A sticky banner at the top of your public page.</p>
            </div>
            {!isPro && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
                <Crown size={10} /> PRO
              </span>
            )}
          </div>
          <div className={`bg-white rounded-2xl border border-gray-200 p-5 space-y-4 relative ${!isPro ? 'overflow-hidden' : ''}`}>
            {!isPro && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 z-10 cursor-pointer"
                onClick={() => setShowUpgrade('Announcement Banner')}
              >
                <Crown size={22} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Nâng cấp PRO để dùng Banner</p>
                <p className="text-xs text-gray-400">Hiển thị thông báo sticky trên trang của bạn</p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
              <input type="text" value={settings.announcement ?? ''} onChange={e => set('announcement', e.target.value || undefined as any)}
                placeholder="e.g. New collection just dropped!"
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Link (optional)</label>
              <input type="url" value={settings.announcementUrl ?? ''} onChange={e => set('announcementUrl', e.target.value || undefined as any)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Background color</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="w-9 h-9 rounded-xl shadow border-2 border-white ring-2 ring-gray-200"
                    style={{ background: settings.announcementColor || '#333A2F' }}>
                    <input type="color" value={settings.announcementColor || '#333A2F'}
                      onChange={e => set('announcementColor', e.target.value)}
                      className="opacity-0 w-0 h-0" />
                  </div>
                </label>
                <span className="text-sm font-mono text-gray-600">{settings.announcementColor || '#333A2F'}</span>
                <button onClick={() => set('announcementColor', undefined as any)} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">Reset</button>
              </div>
            </div>
            {settings.announcement && (
              <div className="rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 text-white text-xs font-semibold"
                  style={{ background: settings.announcementColor || '#333A2F' }}>
                  <span className="flex-1 text-center">{settings.announcement}</span>
                  <Trash2 size={12} className="opacity-50" />
                </div>
              </div>
            )}
          </div>
        {/* Free tier limit hint */}
        {!isPro && (settings.socialBar ?? []).length >= 3 && (
          <button
            onClick={() => setShowUpgrade('Social Bar không giới hạn')}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
          >
            <Crown size={12} />
            Bạn đang ở giới hạn 3 icon miễn phí · Nâng cấp PRO để thêm không giới hạn
          </button>
        )}
        </div>
      )}

      {showUpgrade && (
        <UpgradeModal feature={typeof showUpgrade === 'string' ? showUpgrade : undefined} onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}

// ─── Layout mockups ────────────────────────────────────────────────────────────
function LayoutMockup({ id }: { id: LayoutId }) {
  if (id === 'centered') return (
    <div className="h-28 bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 p-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="w-20 h-1.5 bg-gray-300 rounded" />
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
    </div>
  )
  if (id === 'left') return (
    <div className="h-28 bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="space-y-1">
          <div className="w-16 h-1.5 bg-gray-400 rounded" />
          <div className="w-10 h-1 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
      <div className="w-3/4 h-5 bg-gray-200 rounded-lg" />
    </div>
  )
  if (id === 'hero') return (
    <div className="h-28 bg-gray-50 rounded-xl overflow-hidden">
      <div className="h-16 bg-gradient-to-br from-gray-300 to-gray-400 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 space-y-0.5">
          <div className="w-14 h-1.5 bg-white/80 rounded" />
          <div className="w-10 h-1 bg-white/50 rounded" />
        </div>
      </div>
      <div className="p-2 space-y-1">
        <div className="w-full h-3.5 bg-gray-200 rounded-md" />
        <div className="w-full h-3.5 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'grid') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-7 h-7 bg-gray-300 rounded-full" />
        <div className="w-14 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-0.5">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <div className="w-8 h-1 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
  if (id === 'magazine') return (
    <div className="h-28 bg-gray-50 rounded-xl flex overflow-hidden">
      {/* Left: portrait photo */}
      <div className="w-2/5 bg-gradient-to-b from-gray-300 to-gray-400 relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 space-y-0.5">
          <div className="w-10 h-1.5 bg-white/80 rounded" />
          <div className="w-7 h-1 bg-white/50 rounded" />
        </div>
      </div>
      {/* Right: links */}
      <div className="flex-1 p-2 flex flex-col justify-center gap-1.5">
        <div className="w-full h-2 bg-gray-300 rounded" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded" />
        <div className="w-full h-4 bg-gray-200 rounded-md mt-0.5" />
        <div className="w-full h-4 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'overlay') return (
    <div className="h-28 bg-gray-200 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <div className="w-8 h-8 bg-white/30 rounded-full" />
        <div className="w-16 h-1.5 bg-white/65 rounded" />
        <div className="w-20 h-4 bg-white/20 rounded-lg mt-0.5" />
        <div className="w-20 h-4 bg-white/20 rounded-lg" />
      </div>
    </div>
  )
  if (id === 'card') return (
    <div className="h-28 bg-gray-50 rounded-xl overflow-hidden">
      <div className="h-12 relative" style={{ background: 'linear-gradient(to right,#333A2F,#4a5240)' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-white shadow" />
      </div>
      <div className="pt-5 px-3 flex flex-col gap-1.5">
        <div className="w-full h-4 bg-gray-200 rounded-md" />
        <div className="w-full h-4 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'split') return (
    <div className="h-28 bg-gray-50 rounded-xl flex overflow-hidden">
      <div className="w-1/3 bg-gray-200 flex flex-col items-center justify-center gap-1.5 p-2">
        <div className="w-7 h-7 bg-gray-400 rounded-full" />
        <div className="w-8 h-1 bg-gray-400 rounded" />
        <div className="w-8 h-1 bg-gray-300 rounded" />
      </div>
      <div className="flex-1 p-2.5 flex flex-col gap-1.5 justify-center">
        <div className="w-full h-4 bg-gray-200 rounded-md" />
        <div className="w-full h-4 bg-gray-200 rounded-md" />
        <div className="w-full h-4 bg-gray-200 rounded-md" />
        <div className="w-2/3 h-4 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'compact') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-12 h-1.5 bg-gray-400 rounded" />
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-1.5 h-4 bg-gray-200 rounded-md px-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="flex-1 h-1 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  )
  if (id === 'banner') return (
    <div className="h-28 bg-gray-50 rounded-xl overflow-hidden">
      <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-400" />
      <div className="relative px-3 pt-1">
        <div className="absolute -top-5 left-3 w-8 h-8 bg-gray-200 rounded-full border-2 border-gray-50" />
        <div className="pt-5 space-y-1.5">
          <div className="w-14 h-1.5 bg-gray-400 rounded" />
          <div className="w-20 h-1 bg-gray-300 rounded" />
          <div className="w-full h-3.5 bg-gray-200 rounded-md mt-1" />
        </div>
      </div>
    </div>
  )
  if (id === 'bubble') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-7 h-7 bg-gray-300 rounded-full" />
        <div className="w-14 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {['w-12','w-8','w-14','w-10','w-16','w-9'].map((w, i) => (
          <div key={i} className={`${w} h-4 bg-gray-200 rounded-full`} />
        ))}
      </div>
    </div>
  )
  if (id === 'float') return (
    <div className="h-28 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" style={{ backdropFilter: 'blur(4px)' }} />
      <div className="absolute inset-2 bg-white/90 rounded-xl flex flex-col items-center justify-center gap-1.5 p-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-14 h-1.5 bg-gray-400 rounded" />
        <div className="w-full h-3.5 bg-gray-200 rounded-md" />
        <div className="w-full h-3.5 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'columns') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-12 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  )
  if (id === 'spotlight') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-12 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="w-full h-9 bg-gray-300 rounded-xl" />
      <div className="space-y-1">
        <div className="w-full h-3 bg-gray-200 rounded-md" />
        <div className="w-full h-3 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'bento') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-12 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="w-full h-8 bg-gray-300 rounded-xl" />
      <div className="grid grid-cols-2 gap-1">
        <div className="h-4 bg-gray-200 rounded-lg" />
        <div className="h-4 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
  if (id === 'timeline') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="w-12 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="relative pl-4">
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-gray-300" />
        <div className="space-y-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="flex items-center gap-1.5 relative">
              <div className="absolute -left-[11px] w-2 h-2 rounded-full border bg-white border-gray-400" />
              <div className="h-3.5 bg-gray-200 rounded-md flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  if (id === 'strip') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="w-10 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="divide-y divide-gray-200">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="h-2 w-16 bg-gray-300 rounded" />
            <div className="h-2 w-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
  if (id === 'resume') return (
    <div className="h-28 bg-gray-50 rounded-xl overflow-hidden">
      <div className="bg-gray-200 px-2.5 pt-2.5 pb-2 flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-400 rounded-full flex-shrink-0" />
        <div className="space-y-1">
          <div className="w-14 h-1.5 bg-gray-400 rounded" />
          <div className="w-10 h-1 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="px-2.5 pt-1.5 space-y-1">
        <div className="h-2 w-8 bg-gray-300 rounded mb-1.5" />
        <div className="h-3.5 bg-gray-200 rounded-md" />
        <div className="h-3.5 bg-gray-200 rounded-md" />
      </div>
    </div>
  )
  if (id === 'masonry') return (
    <div className="h-28 bg-gray-50 rounded-xl p-2.5 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="w-12 h-1.5 bg-gray-300 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-1 items-start">
        <div className="space-y-1">
          <div className="h-8 bg-gray-300 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded-lg" />
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  )
  if (id === 'glass') return (
    <div className="h-28 rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative p-2.5 space-y-2">
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full ring-2 ring-white/20" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="w-14 h-1.5 rounded" style={{ background: 'rgba(255,255,255,0.4)' }} />
        </div>
        <div className="space-y-1">
          {[0,1,2].map(i => (
            <div key={i} className="h-3.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>
    </div>
  )
  // fallback
  return (
    <div className="h-28 bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 p-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
      <div className="w-full h-5 bg-gray-200 rounded-lg" />
    </div>
  )
}
