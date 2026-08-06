import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Star, Upload, Camera, ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Photo, PhotoAlbum } from '../../types'
import StoryViewer from '../../components/StoryViewer'

type View = 'albums' | 'detail'

export default function GalleryTab() {
  const { user } = useAuth()
  const [view, setView]             = useState<View>('albums')
  const [albums, setAlbums]         = useState<PhotoAlbum[]>([])
  const [activeAlbum, setActive]    = useState<PhotoAlbum | null>(null)
  const [photos, setPhotos]         = useState<Photo[]>([])
  const [loading, setLoading]       = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName]       = useState('')
  const [newDesc, setNewDesc]       = useState('')
  const [creating, setCreating]     = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [storyIdx, setStoryIdx]     = useState<number | null>(null)

  useEffect(() => { loadAlbums() }, [])

  const loadAlbums = async () => {
    const { data } = await supabase
      .from('photo_albums').select('*').eq('user_id', user!.id).order('sort_order')
    setAlbums(data ?? [])
    setLoading(false)
  }

  const loadPhotos = async (albumId: string) => {
    const { data } = await supabase
      .from('photos').select('*').eq('album_id', albumId).order('sort_order')
    setPhotos(data ?? [])
  }

  const openAlbum = async (album: PhotoAlbum) => {
    setActive(album)
    await loadPhotos(album.id)
    setView('detail')
  }

  const createAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const { data } = await supabase.from('photo_albums').insert({
      user_id:     user!.id,
      name:        newName.trim(),
      description: newDesc.trim() || null,
      sort_order:  albums.length,
    }).select().single()
    if (data) setAlbums(prev => [...prev, data])
    setNewName(''); setNewDesc(''); setShowCreate(false); setCreating(false)
  }

  const [deletingAlbumId, setDeletingAlbumId] = useState<string | null>(null)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)

  const deleteAlbum = async (id: string) => {
    await supabase.from('photo_albums').delete().eq('id', id)
    setAlbums(prev => prev.filter(a => a.id !== id))
    setDeletingAlbumId(null)
  }

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeAlbum) return
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    let firstUrl: string | null = null
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `${user!.id}/albums/${activeAlbum.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) { console.error(error); continue }
      const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
      if (!firstUrl) firstUrl = pub.publicUrl
      await supabase.from('photos').insert({
        user_id:    user!.id,
        album_id:   activeAlbum.id,
        url:        pub.publicUrl,
        sort_order: photos.length,
      })
    }

    // Auto-set cover if album has none
    if (!activeAlbum.cover_url && firstUrl) {
      await supabase.from('photo_albums').update({ cover_url: firstUrl }).eq('id', activeAlbum.id)
      const updated = { ...activeAlbum, cover_url: firstUrl }
      setActive(updated)
      setAlbums(prev => prev.map(a => a.id === activeAlbum.id ? updated : a))
    }

    await loadPhotos(activeAlbum.id)
    setUploading(false)
    // Reset file input
    e.target.value = ''
  }

  const deletePhoto = async (photo: Photo) => {
    await supabase.from('photos').delete().eq('id', photo.id)
    const next = photos.filter(p => p.id !== photo.id)
    setPhotos(next)
    if (activeAlbum && photo.url === activeAlbum.cover_url) {
      const newCover = next[0]?.url ?? null
      await supabase.from('photo_albums').update({ cover_url: newCover }).eq('id', activeAlbum.id)
      const updated = { ...activeAlbum, cover_url: newCover }
      setActive(updated)
      setAlbums(prev => prev.map(a => a.id === activeAlbum.id ? updated : a))
    }
  }

  const setCover = async (photo: Photo) => {
    if (!activeAlbum) return
    await supabase.from('photo_albums').update({ cover_url: photo.url }).eq('id', activeAlbum.id)
    const updated = { ...activeAlbum, cover_url: photo.url }
    setActive(updated)
    setAlbums(prev => prev.map(a => a.id === activeAlbum.id ? updated : a))
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ALBUMS VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'albums') return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Album ảnh</h2>
          <p className="text-sm text-gray-500 mt-0.5">Nhóm ảnh theo chủ đề — khách xem như stories.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          style={{ background: '#333A2F' }}>
          <Plus size={16} /> Tạo album
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createAlbum}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
          <p className="font-semibold text-gray-800 text-sm">Tạo album mới</p>
          <input
            type="text" placeholder="Tên album (vd: Street Style 2024) *"
            value={newName} required onChange={e => setNewName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
          <input
            type="text" placeholder="Mô tả ngắn (tuỳ chọn)"
            value={newDesc} onChange={e => setNewDesc(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#333A2F]" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowCreate(false); setNewName(''); setNewDesc('') }}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Hủy</button>
            <button type="submit" disabled={creating}
              className="px-4 py-2 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              style={{ background: '#333A2F' }}>
              {creating ? 'Đang tạo…' : 'Tạo album'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Camera size={34} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Chưa có album nào</p>
          <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto">
            Tạo album cho từng buổi chụp. Khách có thể vuốt xem như Instagram Stories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map(album => (
            <div key={album.id} className="group relative cursor-pointer"
              onClick={() => openAlbum(album)}>
              {/* Portrait card */}
              <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                {album.cover_url
                  ? <img src={album.cover_url} alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
                      <ImageIcon size={30} className="text-gray-400" />
                      <p className="text-xs text-gray-400">Chưa có ảnh</p>
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-bold drop-shadow leading-tight">{album.name}</p>
                  {album.description && (
                    <p className="text-white/65 text-xs mt-0.5 line-clamp-1">{album.description}</p>
                  )}
                </div>
                {deletingAlbumId === album.id ? (
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end" onClick={e => e.stopPropagation()}>
                    <button onClick={() => deleteAlbum(album.id)}
                      className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow">
                      Delete
                    </button>
                    <button onClick={() => setDeletingAlbumId(null)}
                      className="px-2 py-1 bg-white/80 backdrop-blur text-gray-700 text-[10px] font-medium rounded-lg shadow">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); setDeletingAlbumId(album.id) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 backdrop-blur text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // ALBUM DETAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => { setView('albums'); setPhotos([]) }}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors flex-shrink-0">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{activeAlbum!.name}</h2>
          <p className="text-sm text-gray-400">{photos.length} ảnh</p>
        </div>
        <label
          className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer ${uploading ? 'opacity-60 cursor-wait' : ''}`}
          style={{ background: '#333A2F' }}>
          <input type="file" accept="image/*" multiple onChange={uploadPhotos} className="hidden" disabled={uploading} />
          <Upload size={15} /> {uploading ? 'Đang tải lên…' : 'Thêm ảnh'}
        </label>
      </div>

      {photos.length === 0 ? (
        <label className="flex flex-col items-center justify-center gap-4 py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#333A2F] hover:bg-[#EBEDDF]/20 transition-all">
          <input type="file" accept="image/*" multiple onChange={uploadPhotos} className="hidden" disabled={uploading} />
          <Upload size={36} className="text-gray-300" />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500">Tải ảnh đầu tiên lên</p>
            <p className="text-xs text-gray-400 mt-1">Chọn nhiều ảnh cùng lúc — hiển thị như story.</p>
          </div>
        </label>
      ) : (
        <>
          {/* Story preview button */}
          <button onClick={() => setStoryIdx(0)}
            className="w-full flex items-center justify-center gap-2.5 py-3 border text-sm font-semibold rounded-2xl hover:opacity-90 transition-colors"
            style={{ borderColor: '#333A2F', background: '#EBEDDF', color: '#333A2F' }}>
            <span className="text-base">▶</span> Xem trước Story ({photos.length} ảnh)
          </button>

          {/* Photos masonry */}
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {photos.map((photo, i) => (
              <div key={photo.id}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setStoryIdx(i)}>
                <img src={photo.url} alt={photo.caption ?? ''}
                  className="w-full object-cover hover:scale-[1.02] transition-transform duration-200"
                  loading="lazy" />
                {photo.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 px-3 py-2">
                    <p className="text-white text-xs">{photo.caption}</p>
                  </div>
                )}
                {/* Cover badge */}
                {photo.url === activeAlbum!.cover_url && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={8} fill="white" /> Cover
                  </div>
                )}
                {/* Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {photo.url !== activeAlbum!.cover_url && (
                    <button
                      onClick={e => { e.stopPropagation(); setCover(photo) }}
                      className="w-7 h-7 bg-amber-400 text-white rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors shadow"
                      title="Set as cover">
                      <Star size={12} />
                    </button>
                  )}
                  {deletingPhotoId === photo.id ? (
                    <div className="flex flex-col gap-1 items-end" onClick={e => e.stopPropagation()}>
                      <button onClick={() => { deletePhoto(photo); setDeletingPhotoId(null) }}
                        className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow">
                        Delete
                      </button>
                      <button onClick={() => setDeletingPhotoId(null)}
                        className="px-2 py-1 bg-white/80 text-gray-700 text-[10px] rounded-lg shadow">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setDeletingPhotoId(photo.id) }}
                      className="w-7 h-7 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors shadow">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {storyIdx !== null && (
        <StoryViewer
          photos={photos}
          albumName={activeAlbum!.name}
          startIndex={storyIdx}
          onClose={() => setStoryIdx(null)}
        />
      )}
    </div>
  )
}
