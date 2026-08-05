// ─── Per-element customization settings ───────────────────────────────────────
export interface CustomSettings {
  pageFont:          string
  avatarShape:       'circle' | 'rounded' | 'square'
  avatarBorder:      boolean
  avatarBorderWidth: number
  avatarBorderColor: string
  avatarShadow:      boolean
  nameSize:          'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  nameColor:         string
  nameFont:          string
  nameWeight:        '400' | '600' | '700' | '800' | '900'
  linkIconPos:       'left' | 'right' | 'none'
  linkBorder:        boolean
  linkBgCustom:      string
  linkRadius:        number
  linkShadow:        boolean
  linkHeight:        'sm' | 'md' | 'lg'
  productImgRatio:   'square' | 'portrait' | 'wide' | 'circle'
  productCols:       2 | 3
  productShowPrice:  boolean
  productShowDesc:   boolean
  productRounded:    number
  // Social icons bar
  socialBar?:        Array<{ platform: string; url: string }>
  // Announcement banner
  announcement?:     string
  announcementUrl?:  string
  announcementColor?: string
  // Link animation on hover
  linkAnimation?:    'none' | 'lift' | 'pulse' | 'shake' | 'glow' | 'bounce'
  // Custom CSS (Pro)
  customCss?:        string
  // VCard download on public page
  vcardEnabled?:     boolean
  // Music player widget
  musicWidgetUrl?:   string
  // Contact form
  contactFormEnabled?: boolean
  // Testimonials block
  testimonialsEnabled?: boolean
  // Page password protection (Pro)
  pagePasswordEnabled?: boolean
  pagePassword?: string
}

export const DEFAULT_SETTINGS: CustomSettings = {
  pageFont:          'default',
  avatarShape:       'circle',
  avatarBorder:      false,
  avatarBorderWidth: 3,
  avatarBorderColor: '#ffffff',
  avatarShadow:      false,
  nameSize:          'xl',
  nameColor:         '',
  nameFont:          '',
  nameWeight:        '700',
  linkIconPos:       'left',
  linkBorder:        true,
  linkBgCustom:      '',
  linkRadius:        16,
  linkShadow:        false,
  linkHeight:        'md',
  productImgRatio:   'square',
  productCols:       2,
  productShowPrice:  true,
  productShowDesc:   false,
  productRounded:    12,
}

export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  job_title: string | null
  bio: string | null
  avatar_url: string | null
  template_id: string | null
  layout_id: string | null
  custom_bg: string | null
  custom_settings: CustomSettings | null
  tip_url: string | null
  booking_url: string | null
  email_capture_enabled: boolean | null
  email_capture_title: string | null
  seo_title: string | null
  seo_description: string | null
  seo_image: string | null
  plan: 'free' | 'pro' | null
}

export type BlockType = 'link' | 'youtube' | 'spotify' | 'instagram' | 'tiktok' | 'heading' | 'text' | 'image' | 'countdown' | 'github'

export type BioLink = {
  id: string
  user_id: string
  platform: string | null
  title: string
  url: string
  sort_order: number
  is_active: boolean
  block_type: BlockType | null
  is_featured: boolean
  thumbnail_url: string | null
  active_from: string | null
  active_until: string | null
}

export type Product = {
  id: string
  user_id: string
  name: string
  description: string | null
  price: string | null
  image_url: string | null
  affiliate_url: string
  sort_order: number
  is_active: boolean
}

export type Photo = {
  id: string
  user_id: string
  album_id: string | null
  url: string
  caption: string | null
  sort_order: number
}

export type PhotoAlbum = {
  id: string
  user_id: string
  name: string
  description: string | null
  cover_url: string | null
  sort_order: number
  created_at: string
}

export const PLATFORMS: Record<string, { label: string; emoji: string }> = {
  instagram: { label: 'Instagram',   emoji: '📷' },
  tiktok:    { label: 'TikTok',      emoji: '🎵' },
  youtube:   { label: 'YouTube',     emoji: '▶️' },
  facebook:  { label: 'Facebook',    emoji: '👥' },
  twitter:   { label: 'X / Twitter', emoji: '✖️' },
  threads:   { label: 'Threads',     emoji: '🧵' },
  linkedin:  { label: 'LinkedIn',    emoji: '💼' },
  github:    { label: 'GitHub',      emoji: '🐱' },
  telegram:  { label: 'Telegram',    emoji: '✈️' },
  whatsapp:  { label: 'WhatsApp',    emoji: '💬' },
  messenger: { label: 'Messenger',   emoji: '💙' },
  discord:   { label: 'Discord',     emoji: '🎮' },
  twitch:    { label: 'Twitch',      emoji: '📡' },
  spotify:   { label: 'Spotify',     emoji: '🎧' },
  pinterest: { label: 'Pinterest',   emoji: '📌' },
  reddit:    { label: 'Reddit',      emoji: '🔴' },
  snapchat:  { label: 'Snapchat',    emoji: '👻' },
  medium:    { label: 'Medium',      emoji: '✍️' },
  behance:   { label: 'Behance',     emoji: '🎨' },
  dribbble:  { label: 'Dribbble',    emoji: '🏀' },
  shopee:    { label: 'Shopee',      emoji: '🛍️' },
  lazada:    { label: 'Lazada',      emoji: '🛒' },
  zalo:      { label: 'Zalo',        emoji: '🇻🇳' },
  website:   { label: 'Website',     emoji: '🌐' },
  custom:    { label: 'Custom Link', emoji: '🔗' },
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  tiktok:    '#010101',
  youtube:   '#FF0000',
  facebook:  '#1877F2',
  twitter:   '#14171A',
  threads:   '#000000',
  linkedin:  '#0A66C2',
  github:    '#24292e',
  telegram:  '#2AABEE',
  whatsapp:  '#25D366',
  messenger: '#0084FF',
  discord:   '#5865F2',
  twitch:    '#9146FF',
  spotify:   '#1ED760',
  pinterest: '#E60023',
  reddit:    '#FF4500',
  snapchat:  '#FFFC00',
  medium:    '#000000',
  behance:   '#1769FF',
  dribbble:  '#EA4C89',
  shopee:    '#EE4D2D',
  lazada:    '#0F0F64',
  zalo:      '#0068FF',
  website:   '#6366F1',
  custom:    '#6B7280',
}

// 'solid'       → button uses template btnBg (default)
// 'vivid'       → entire button = platform brand color
// 'icon-colors' → button is light/white, icon shows platform brand color
export type BtnStyle = 'solid' | 'vivid' | 'icon-colors'

export type TemplateId =
  // ─── FREE ──────────────────────────────────────────────────────────────────
  | 'minimal'    | 'dark'       | 'gradient'
  | 'cream'      | 'violet'     | 'forest'    | 'teal'    | 'earth'
  | 'neon'       | 'vivid'      | 'glass'
  | 'sakura'     | 'midnight'   | 'paper'     | 'peach'   | 'nordic'
  | 'cyberpunk'  | 'jade'       | 'lavender'  | 'retro'   | 'coral'
  | 'blush'      | 'charcoal'   | 'matcha'    | 'dusk'    | 'arctic'
  // ─── PRO ───────────────────────────────────────────────────────────────────
  | 'ocean' | 'sunset' | 'aurora' | 'rose'

export type LayoutId =
  // ─── FREE ──────────────────────────────────────────────────────────────────
  | 'centered' | 'left' | 'hero' | 'grid' | 'magazine' | 'overlay'
  | 'banner' | 'bubble' | 'float'
  | 'bento' | 'timeline' | 'strip' | 'resume'
  // ─── PRO ───────────────────────────────────────────────────────────────────
  | 'card' | 'split' | 'compact' | 'columns' | 'spotlight'
  | 'masonry' | 'glass'

export type TemplateStyle = {
  label: string
  isPremium: boolean
  btnStyle?: BtnStyle
  pageBg: string
  cardBg: string
  cardBorder: string
  textColor: string
  subtextColor: string
  btnBg: string
  btnBorder: string
  btnText: string
}

export type LayoutConfig = {
  label: string
  description: string
  isPremium: boolean
}

export const TEMPLATES: Record<TemplateId, TemplateStyle> = {

  // ─── FREE – ORIGINAL ────────────────────────────────────────────────────────
  minimal: {
    label: 'Minimal', isPremium: false,
    pageBg: '#F9FAFB', cardBg: '#FFFFFF', cardBorder: '#E5E7EB',
    textColor: '#111827', subtextColor: '#6B7280',
    btnBg: '#FFFFFF', btnBorder: '#E5E7EB', btnText: '#111827',
  },
  dark: {
    label: 'Dark', isPremium: false,
    pageBg: '#111827', cardBg: '#1F2937', cardBorder: '#374151',
    textColor: '#F9FAFB', subtextColor: '#9CA3AF',
    btnBg: '#1F2937', btnBorder: '#374151', btnText: '#F9FAFB',
  },
  gradient: {
    label: 'Purple Haze', isPremium: false,
    pageBg: 'linear-gradient(135deg,#7C3AED 0%,#DB2777 100%)',
    cardBg: 'rgba(255,255,255,0.15)', cardBorder: 'rgba(255,255,255,0.25)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.85)',
    btnBg: 'rgba(255,255,255,0.18)', btnBorder: 'rgba(255,255,255,0.3)', btnText: '#FFFFFF',
  },
  cream: {
    label: 'Cream', isPremium: false,
    pageBg: '#FAF7F0', cardBg: '#FFFFFF', cardBorder: '#EDE8DF',
    textColor: '#3D2B1F', subtextColor: '#8B7355',
    btnBg: '#7A6245', btnBorder: '#6B5438', btnText: '#FFFFFF',
  },
  violet: {
    label: 'Violet', isPremium: false,
    btnStyle: 'icon-colors',
    pageBg: 'linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)',
    cardBg: '#FFFFFF', cardBorder: '#F3E8FF',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.8)',
    btnBg: 'rgba(255,255,255,0.95)', btnBorder: 'rgba(255,255,255,0.6)', btnText: '#111827',
  },
  forest: {
    label: 'Forest', isPremium: false,
    pageBg: 'linear-gradient(160deg,#0f4c35 0%,#1a6b4a 40%,#0d3d5e 100%)',
    cardBg: 'rgba(255,255,255,0.09)', cardBorder: 'rgba(255,255,255,0.16)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.7)',
    btnBg: 'rgba(255,255,255,0.13)', btnBorder: 'rgba(255,255,255,0.22)', btnText: '#FFFFFF',
  },
  teal: {
    label: 'Teal Glass', isPremium: false,
    pageBg: 'linear-gradient(135deg,#0d9488 0%,#0891b2 100%)',
    cardBg: 'rgba(255,255,255,0.12)', cardBorder: 'rgba(255,255,255,0.22)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.78)',
    btnBg: 'rgba(255,255,255,0.18)', btnBorder: 'rgba(255,255,255,0.3)', btnText: '#FFFFFF',
  },
  earth: {
    label: 'Earth', isPremium: false,
    pageBg: 'linear-gradient(135deg,#78350f 0%,#92400e 50%,#451a03 100%)',
    cardBg: 'rgba(255,255,255,0.1)', cardBorder: 'rgba(255,220,180,0.25)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,220,180,0.8)',
    btnBg: 'rgba(255,220,180,0.18)', btnBorder: 'rgba(255,220,180,0.3)', btnText: '#FFFFFF',
  },
  neon: {
    label: 'Neon', isPremium: false,
    pageBg: '#000000', cardBg: '#0D0D0D', cardBorder: 'rgba(0,255,200,0.3)',
    textColor: '#FFFFFF', subtextColor: '#00FFC8',
    btnBg: '#0D0D0D', btnBorder: 'rgba(0,255,200,0.4)', btnText: '#00FFC8',
  },
  vivid: {
    label: 'Vivid', isPremium: false,
    btnStyle: 'vivid',
    pageBg: '#0D0D0D', cardBg: '#1A1A1A', cardBorder: '#2A2A2A',
    textColor: '#FFFFFF', subtextColor: '#AAAAAA',
    btnBg: '#1A1A1A', btnBorder: '#333333', btnText: '#FFFFFF',
  },
  glass: {
    label: 'Deep Glass', isPremium: false,
    pageBg: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e3a5f 100%)',
    cardBg: 'rgba(255,255,255,0.06)', cardBorder: 'rgba(255,255,255,0.14)',
    textColor: '#E0E7FF', subtextColor: 'rgba(224,231,255,0.65)',
    btnBg: 'rgba(255,255,255,0.09)', btnBorder: 'rgba(255,255,255,0.18)', btnText: '#E0E7FF',
  },

  // ─── FREE – NEW ─────────────────────────────────────────────────────────────
  sakura: {
    label: 'Sakura', isPremium: false,
    pageBg: 'linear-gradient(135deg,#fce7f3 0%,#ffe4e6 60%,#fdf2f8 100%)',
    cardBg: 'rgba(255,255,255,0.7)', cardBorder: '#fda4af',
    textColor: '#881337', subtextColor: '#be123c',
    btnBg: 'rgba(255,255,255,0.85)', btnBorder: '#fda4af', btnText: '#881337',
  },
  midnight: {
    label: 'Midnight', isPremium: false,
    pageBg: 'linear-gradient(135deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
    cardBg: 'rgba(255,255,255,0.06)', cardBorder: 'rgba(165,180,252,0.2)',
    textColor: '#e0e7ff', subtextColor: '#a5b4fc',
    btnBg: 'rgba(99,102,241,0.18)', btnBorder: 'rgba(99,102,241,0.35)', btnText: '#c7d2fe',
  },
  paper: {
    label: 'Paper', isPremium: false,
    pageBg: '#FAFAF8',
    cardBg: '#FFFFFF', cardBorder: '#E2E8F0',
    textColor: '#1A202C', subtextColor: '#4A5568',
    btnBg: '#1A202C', btnBorder: '#1A202C', btnText: '#FFFFFF',
  },
  peach: {
    label: 'Peach', isPremium: false,
    pageBg: 'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
    cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(252,182,159,0.55)',
    textColor: '#7c2d12', subtextColor: '#9a3412',
    btnBg: 'rgba(255,255,255,0.75)', btnBorder: 'rgba(252,182,159,0.6)', btnText: '#7c2d12',
  },
  nordic: {
    label: 'Nordic', isPremium: false,
    pageBg: '#ECEFF4',
    cardBg: '#FFFFFF', cardBorder: '#D8DEE9',
    textColor: '#2E3440', subtextColor: '#4C566A',
    btnBg: '#2E3440', btnBorder: '#2E3440', btnText: '#ECEFF4',
  },
  cyberpunk: {
    label: 'Cyberpunk', isPremium: false,
    btnStyle: 'icon-colors',
    pageBg: '#0D0D0D',
    cardBg: 'rgba(255,230,0,0.04)', cardBorder: 'rgba(255,230,0,0.45)',
    textColor: '#FFE600', subtextColor: '#00FF9F',
    btnBg: 'rgba(255,230,0,0.07)', btnBorder: 'rgba(255,230,0,0.5)', btnText: '#FFE600',
  },
  jade: {
    label: 'Jade', isPremium: false,
    pageBg: 'linear-gradient(135deg,#134e5e 0%,#71b280 100%)',
    cardBg: 'rgba(255,255,255,0.08)', cardBorder: 'rgba(113,178,128,0.35)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.72)',
    btnBg: 'rgba(113,178,128,0.22)', btnBorder: 'rgba(113,178,128,0.4)', btnText: '#FFFFFF',
  },
  lavender: {
    label: 'Lavender', isPremium: false,
    pageBg: 'linear-gradient(135deg,#ede9fe 0%,#f5f3ff 55%,#fdf4ff 100%)',
    cardBg: 'rgba(255,255,255,0.75)', cardBorder: '#ddd6fe',
    textColor: '#4c1d95', subtextColor: '#7c3aed',
    btnBg: 'rgba(255,255,255,0.85)', btnBorder: '#ddd6fe', btnText: '#4c1d95',
  },
  retro: {
    label: 'Retro', isPremium: false,
    pageBg: '#FFF8F0',
    cardBg: '#FFFFFF', cardBorder: '#fed7aa',
    textColor: '#431407', subtextColor: '#9a3412',
    btnBg: '#f97316', btnBorder: '#ea580c', btnText: '#FFFFFF',
  },
  coral: {
    label: 'Coral', isPremium: false,
    pageBg: 'linear-gradient(135deg,#f953c6 0%,#b91d73 100%)',
    cardBg: 'rgba(255,255,255,0.12)', cardBorder: 'rgba(255,255,255,0.25)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,255,255,0.8)',
    btnBg: 'rgba(255,255,255,0.18)', btnBorder: 'rgba(255,255,255,0.3)', btnText: '#FFFFFF',
  },
  blush: {
    label: 'Blush', isPremium: false,
    pageBg: 'radial-gradient(at 30% 20%, #ffc8dd 0%, transparent 55%), radial-gradient(at 80% 70%, #bde0fe 0%, transparent 55%), radial-gradient(at 10% 80%, #cdb4db 0%, transparent 50%), #fff0f3',
    cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(255,180,210,0.4)',
    textColor: '#5c1a3b', subtextColor: '#9d366b',
    btnBg: 'rgba(255,255,255,0.8)', btnBorder: 'rgba(255,180,210,0.5)', btnText: '#5c1a3b',
  },
  charcoal: {
    label: 'Charcoal', isPremium: false,
    pageBg: 'linear-gradient(160deg,#1c1c1e 0%,#2c2c2e 100%)',
    cardBg: '#3a3a3c', cardBorder: '#48484a',
    textColor: '#F5F5F7', subtextColor: '#98989D',
    btnBg: '#3a3a3c', btnBorder: '#58585a', btnText: '#F5F5F7',
  },
  matcha: {
    label: 'Matcha', isPremium: false,
    pageBg: 'linear-gradient(135deg,#b7e4c7 0%,#d8f3dc 50%,#f0fff4 100%)',
    cardBg: 'rgba(255,255,255,0.72)', cardBorder: '#95d5b2',
    textColor: '#1b4332', subtextColor: '#2d6a4f',
    btnBg: '#2d6a4f', btnBorder: '#1b4332', btnText: '#FFFFFF',
  },
  dusk: {
    label: 'Dusk', isPremium: false,
    pageBg: 'radial-gradient(at 20% 20%, #e63946 0%, transparent 50%), radial-gradient(at 80% 60%, #7209b7 0%, transparent 50%), radial-gradient(at 40% 80%, #f72585 0%, transparent 50%), radial-gradient(at 90% 20%, #ff6b35 0%, transparent 50%), #1a001e',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,100,180,0.3)',
    textColor: '#FFFFFF', subtextColor: 'rgba(255,180,220,0.85)',
    btnBg: 'rgba(247,37,133,0.2)', btnBorder: 'rgba(247,37,133,0.4)', btnText: '#FFFFFF',
  },
  arctic: {
    label: 'Arctic', isPremium: false,
    pageBg: 'radial-gradient(at 20% 30%, #e0f2fe 0%, transparent 55%), radial-gradient(at 80% 20%, #f0f9ff 0%, transparent 55%), radial-gradient(at 50% 80%, #dbeafe 0%, transparent 55%), radial-gradient(at 90% 70%, #ede9fe 0%, transparent 50%), #f8fafc',
    cardBg: 'rgba(255,255,255,0.8)', cardBorder: '#bfdbfe',
    textColor: '#1e3a5f', subtextColor: '#3b5f8a',
    btnBg: 'rgba(255,255,255,0.9)', btnBorder: '#93c5fd', btnText: '#1e3a5f',
  },

  // ─── PRO ────────────────────────────────────────────────────────────────────
  ocean: {
    label: 'Ocean', isPremium: true,
    pageBg: 'linear-gradient(180deg,#0c1445 0%,#1a3a6b 50%,#0c1445 100%)',
    cardBg: 'rgba(255,255,255,0.08)', cardBorder: 'rgba(96,165,250,0.3)',
    textColor: '#e0f2fe', subtextColor: '#93c5fd',
    btnBg: 'rgba(59,130,246,0.2)', btnBorder: 'rgba(96,165,250,0.4)', btnText: '#bfdbfe',
  },
  sunset: {
    label: 'Sunset', isPremium: true,
    pageBg: 'linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)',
    cardBg: 'rgba(255,255,255,0.15)', cardBorder: 'rgba(255,255,255,0.3)',
    textColor: '#ffffff', subtextColor: 'rgba(255,255,255,0.8)',
    btnBg: 'rgba(255,255,255,0.2)', btnBorder: 'rgba(255,255,255,0.35)', btnText: '#ffffff',
  },
  aurora: {
    label: 'Aurora', isPremium: true,
    pageBg: 'linear-gradient(135deg,#064e3b 0%,#065f46 30%,#0891b2 70%,#1e40af 100%)',
    cardBg: 'rgba(255,255,255,0.08)', cardBorder: 'rgba(52,211,153,0.3)',
    textColor: '#ecfdf5', subtextColor: '#6ee7b7',
    btnBg: 'rgba(52,211,153,0.15)', btnBorder: 'rgba(52,211,153,0.3)', btnText: '#a7f3d0',
  },
  rose: {
    label: 'Rose Gold', isPremium: true,
    pageBg: 'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%)',
    cardBg: '#ffffff', cardBorder: '#fbcfe8',
    textColor: '#831843', subtextColor: '#be185d',
    btnBg: '#fdf2f8', btnBorder: '#f9a8d4', btnText: '#9d174d',
  },
}

export const LAYOUTS: Record<LayoutId, LayoutConfig> = {
  // ─── FREE ─────────────────────────────────────────────────────────────────
  centered:  { label: 'Centered',    description: 'Everything centered, classic look',              isPremium: false },
  left:      { label: 'Left Align',  description: 'Avatar & bio left-aligned',                     isPremium: false },
  hero:      { label: 'Hero Photo',  description: 'Profile photo fills the top as hero image',     isPremium: false },
  grid:      { label: 'Grid Links',  description: 'Links in a 2-column grid with big icons',       isPremium: false },
  magazine:  { label: 'Magazine',    description: 'Editorial — portrait photo left, links right',  isPremium: false },
  overlay:   { label: 'Overlay',     description: 'Full-screen background photo with overlay',     isPremium: false },
  banner:    { label: 'Banner',      description: 'Wide header banner, avatar overlapping edge',   isPremium: false },
  bubble:    { label: 'Bubble Tags', description: 'Links as floating pill chips, playful look',    isPremium: false },
  float:     { label: 'Float Card',  description: 'Content floats in a glass card on bg image',   isPremium: false },
  bento:     { label: 'Bento Grid',  description: 'Featured link large + others in bento grid',   isPremium: false },
  timeline:  { label: 'Timeline',    description: 'Vertical dotted timeline, great for portfolios', isPremium: false },
  strip:     { label: 'Strip',       description: 'Minimal text-only links, no button boxes',      isPremium: false },
  resume:    { label: 'Resume',      description: 'CV/portfolio style with header and sections',   isPremium: false },
  // ─── PRO ──────────────────────────────────────────────────────────────────
  card:      { label: 'Card Hero',   description: 'Full-width header card + links below',          isPremium: true  },
  split:     { label: 'Split View',  description: 'Fixed sidebar + scrollable content',            isPremium: true  },
  compact:   { label: 'Compact',     description: 'Dense layout, show more above the fold',        isPremium: true  },
  columns:   { label: 'Two Columns', description: 'Links split into 2 columns, more above fold',   isPremium: true  },
  spotlight: { label: 'Spotlight',   description: 'Featured link shown large at top',              isPremium: true  },
  masonry:   { label: 'Masonry',     description: 'Pinterest-style variable height link cards',    isPremium: true  },
  glass:     { label: 'Glass Dark',  description: 'Glassmorphism dark theme, dramatic look',       isPremium: true  },
}

// ─── Font registry (shared between Editor and PublicPage) ─────────────────────
export const FONTS: Record<string, { label: string; css: string; google?: string }> = {
  default:      { label: 'System',       css: 'system-ui, -apple-system, sans-serif' },
  poppins:      { label: 'Poppins',      css: "'Poppins', sans-serif",               google: 'Poppins:wght@400;600;700;900' },
  inter:        { label: 'Inter',        css: "'Inter', sans-serif",                 google: 'Inter:wght@400;600;700;800' },
  raleway:      { label: 'Raleway',      css: "'Raleway', sans-serif",               google: 'Raleway:wght@300;400;600;700;800' },
  montserrat:   { label: 'Montserrat',   css: "'Montserrat', sans-serif",            google: 'Montserrat:wght@400;600;700;900' },
  lato:         { label: 'Lato',         css: "'Lato', sans-serif",                  google: 'Lato:wght@400;700;900' },
  nunito:       { label: 'Nunito',       css: "'Nunito', sans-serif",               google: 'Nunito:wght@400;600;700;900' },
  playfair:     { label: 'Playfair',     css: "'Playfair Display', serif",           google: 'Playfair+Display:ital,wght@0,400;0,700;1,400' },
  merriweather: { label: 'Merriweather', css: "'Merriweather', serif",               google: 'Merriweather:wght@400;700;900' },
  italiana:     { label: 'Italiana',     css: "'Italiana', serif",                   google: 'Italiana' },
  dmMono:       { label: 'DM Mono',      css: "'DM Mono', monospace",               google: 'DM+Mono:wght@400;500' },
  josefin:      { label: 'Josefin Sans', css: "'Josefin Sans', sans-serif",         google: 'Josefin+Sans:wght@300;400;600;700' },
  pacifico:     { label: 'Pacifico',     css: "'Pacifico', cursive",                google: 'Pacifico' },
  dancing:      { label: 'Dancing',      css: "'Dancing Script', cursive",          google: 'Dancing+Script:wght@400;700' },
}

