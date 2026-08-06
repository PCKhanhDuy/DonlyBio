import { useState, useEffect } from 'react'
import { Plus, Trash2, ShoppingBag, ExternalLink, ToggleLeft, ToggleRight, Upload, Link as LinkIcon, Pencil, X, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import type { Product } from '../../types'

const EMPTY = { name: '', description: '', price: '', image_url: '', affiliate_url: '' }

const INPUT = 'px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F] bg-white'

export default function ProductsTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [products, setProducts]         = useState<Product[]>([])
  const [loading, setLoading]           = useState(true)
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(EMPTY)
  const [saving, setSaving]             = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [imgTab, setImgTab]             = useState<'url' | 'upload'>('url')

  const [editId, setEditId]             = useState<string | null>(null)
  const [editForm, setEditForm]         = useState(EMPTY)
  const [editImgUploading, setEditImgUploading] = useState(false)
  const [editImgTab, setEditImgTab]     = useState<'url' | 'upload'>('url')
  const [deletingId, setDeletingId]     = useState<string | null>(null)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).order('sort_order')
    setProducts(data ?? [])
    setLoading(false)
  }

  const handleImageFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImg: (url: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${user!.id}/products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    setImg(data.publicUrl)
    setUploading(false)
    e.target.value = ''
  }

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!form.name || !form.affiliate_url) return
    setSaving(true)
    await supabase.from('products').insert({
      user_id: user!.id, name: form.name, description: form.description || null,
      price: form.price || null, image_url: form.image_url || null,
      affiliate_url: form.affiliate_url, sort_order: products.length,
    })
    setForm(EMPTY)
    setShowForm(false)
    await loadProducts()
    setSaving(false)
    toast('Đã thêm sản phẩm!')
  }

  const startEdit = (p: Product) => {
    setShowForm(false)
    setEditId(p.id)
    setEditForm({
      name:          p.name,
      description:   p.description ?? '',
      price:         p.price ?? '',
      image_url:     p.image_url ?? '',
      affiliate_url: p.affiliate_url,
    })
    setEditImgTab('url')
  }

  const saveEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!editId) return
    setSaving(true)
    await supabase.from('products').update({
      name:          editForm.name,
      description:   editForm.description || null,
      price:         editForm.price || null,
      image_url:     editForm.image_url || null,
      affiliate_url: editForm.affiliate_url,
    }).eq('id', editId)
    setProducts(products.map(p => p.id === editId
      ? { ...p, name: editForm.name, description: editForm.description || null,
          price: editForm.price || null, image_url: editForm.image_url || null,
          affiliate_url: editForm.affiliate_url }
      : p
    ))
    setEditId(null)
    setSaving(false)
    toast('Đã cập nhật sản phẩm!')
  }

  const toggle = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    setProducts(products.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x))
  }

  const remove = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
    setDeletingId(null)
    toast('Đã xóa sản phẩm', 'info')
  }

  const move = async (i: number, dir: -1 | 1) => {
    const arr = [...products]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setProducts(arr)
    await Promise.all(arr.map((p, idx) => supabase.from('products').update({ sort_order: idx }).eq('id', p.id)))
  }

  // ── Image upload section (reused in add + edit forms) ──────────────────
  function ImageSection({
    imageUrl, onUrlChange, onUpload, uploading, tab, setTab,
  }: {
    imageUrl: string
    onUrlChange: (v: string) => void
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    uploading: boolean
    tab: 'url' | 'upload'
    setTab: (t: 'url' | 'upload') => void
  }) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tab === 'url' ? 'bg-[#EBEDDF] border-[#333A2F] text-[#333A2F]' : 'border-gray-200 text-gray-500'}`}>
            <LinkIcon size={12} /> URL
          </button>
          <button type="button" onClick={() => setTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tab === 'upload' ? 'bg-[#EBEDDF] border-[#333A2F] text-[#333A2F]' : 'border-gray-200 text-gray-500'}`}>
            <Upload size={12} /> Upload
          </button>
        </div>

        {tab === 'url' && (
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="url" placeholder="URL ảnh sản phẩm (tuỳ chọn)" value={imageUrl}
              onChange={e => onUrlChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]`} />
          </div>
        )}

        {tab === 'upload' && (
          <label className={`flex flex-col items-center justify-center gap-2 w-full py-7 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploading ? 'border-[#333A2F] bg-[#EBEDDF]' : 'border-gray-200 hover:border-[#333A2F]/50 hover:bg-[#EBEDDF]/40'}`}>
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={uploading} />
            <Upload size={22} className={uploading ? 'animate-bounce' : 'text-gray-400'} style={uploading ? { color: '#333A2F' } : {}} />
            <p className="text-sm font-medium text-gray-500">{uploading ? 'Đang tải lên…' : 'Click để tải ảnh lên'}</p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP — tối đa 5 MB</p>
          </label>
        )}

        {imageUrl && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
            <img src={imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700">Preview</p>
              <p className="text-[11px] text-gray-400 truncate">{imageUrl}</p>
            </div>
            <button type="button" onClick={() => onUrlChange('')}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm Affiliate</h2>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý sản phẩm và kiếm hoa hồng từ affiliate.</p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setEditId(null) }}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          style={{ background: '#333A2F' }}>
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {/* Edit form (shown instead of add form when editing) */}
      {editId && (
        <form onSubmit={saveEdit} className="bg-white rounded-2xl border-2 p-5 shadow-sm space-y-4" style={{ borderColor: '#333A2F' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Chỉnh sửa sản phẩm</h3>
            <button type="button" onClick={() => setEditId(null)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Tên sản phẩm *" value={editForm.name} required
              onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={INPUT} />
            <input type="text" placeholder="Giá (vd: 250.000đ)" value={editForm.price}
              onChange={e => setEditForm({ ...editForm, price: e.target.value })} className={INPUT} />
            <input type="url" placeholder="Link affiliate *" value={editForm.affiliate_url} required
              onChange={e => setEditForm({ ...editForm, affiliate_url: e.target.value })}
              className={`${INPUT} sm:col-span-2`} />
            <textarea placeholder="Mô tả (tuỳ chọn)" value={editForm.description} rows={2}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className={`${INPUT} sm:col-span-2 resize-none`} />
          </div>

          <ImageSection
            imageUrl={editForm.image_url}
            onUrlChange={url => setEditForm(f => ({ ...f, image_url: url }))}
            onUpload={e => handleImageFile(e, url => setEditForm(f => ({ ...f, image_url: url })), setEditImgUploading)}
            uploading={editImgUploading}
            tab={editImgTab}
            setTab={setEditImgTab}
          />

          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setEditId(null)}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
            <button type="submit" disabled={saving || editImgUploading}
              className="px-4 py-2 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ background: '#333A2F' }}>
              {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

      {/* Add form */}
      {showForm && !editId && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Sản phẩm mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Tên sản phẩm *" value={form.name} required
              onChange={e => setForm({ ...form, name: e.target.value })} className={INPUT} />
            <input type="text" placeholder="Giá (vd: 250.000đ)" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} className={INPUT} />
            <input type="url" placeholder="Link affiliate *" value={form.affiliate_url} required
              onChange={e => setForm({ ...form, affiliate_url: e.target.value })}
              className={`${INPUT} sm:col-span-2`} />
            <textarea placeholder="Mô tả (tuỳ chọn)" value={form.description} rows={2}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={`${INPUT} sm:col-span-2 resize-none`} />
          </div>

          <ImageSection
            imageUrl={form.image_url}
            onUrlChange={url => setForm(f => ({ ...f, image_url: url }))}
            onUpload={e => handleImageFile(e, url => setForm(f => ({ ...f, image_url: url })), setImgUploading)}
            uploading={imgUploading}
            tab={imgTab}
            setTab={setImgTab}
          />

          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY) }}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
            <button type="submit" disabled={saving || imgUploading}
              className="px-4 py-2 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              style={{ background: '#333A2F' }}>
              {saving ? 'Đang thêm…' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <ShoppingBag size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Chưa có sản phẩm nào</p>
          <p className="text-xs text-gray-400 mt-1">Thêm sản phẩm affiliate đầu tiên của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                p.id === editId ? 'ring-2 ring-[#333A2F]' : ''
              } ${p.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              {/* Image */}
              <div className="relative">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover" />
                  : <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <ShoppingBag size={36} className="text-gray-300" />
                    </div>
                }
                {/* Toggle */}
                <button onClick={() => toggle(p)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-xl shadow-sm hover:scale-105 transition-all">
                  {p.is_active
                    ? <ToggleRight size={20} style={{ color: '#333A2F' }} />
                    : <ToggleLeft  size={20} className="text-gray-400" />
                  }
                </button>
                {!p.is_active && (
                  <div className="absolute bottom-2 left-2 bg-gray-900/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur">
                    Hidden
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm leading-snug">{p.name}</p>
                {p.price && <p className="text-sm font-semibold mt-1" style={{ color: '#333A2F' }}>{p.price}</p>}
                {p.description && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                )}

                {deletingId === p.id ? (
                  <div className="flex gap-1.5 mt-3">
                    <button onClick={() => remove(p.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors">
                      <Trash2 size={11} /> Xóa
                    </button>
                    <button onClick={() => setDeletingId(null)}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-100 text-xs rounded-xl transition-colors">
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5 mt-3">
                    <a href={p.affiliate_url} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-xl transition-colors">
                      <ExternalLink size={11} /> Xem
                    </a>
                    <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-[#333A2F] hover:bg-[#EBEDDF] rounded-xl transition-all" title="Chỉnh sửa">
                      <Pencil size={14} />
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(products.indexOf(p), -1)} disabled={products.indexOf(p) === 0}
                        className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors rounded">
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => move(products.indexOf(p), 1)} disabled={products.indexOf(p) === products.length - 1}
                        className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors rounded">
                        <ChevronDown size={13} />
                      </button>
                    </div>
                    <button onClick={() => setDeletingId(p.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
