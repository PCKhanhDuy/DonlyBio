import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck, MessageSquare, Mail, Trophy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { AppNotification } from '../../types'

const ICON_MAP = {
  contact_message: { icon: MessageSquare, color: '#818cf8', bg: 'rgba(129,140,248,.15)' },
  email_subscribe: { icon: Mail,           color: '#34d399', bg: 'rgba(52,211,153,.15)' },
  milestone:       { icon: Trophy,         color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
}

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 60)   return 'Vừa xong'
  if (d < 3600)  return Math.floor(d / 60) + ' phút trước'
  if (d < 86400) return Math.floor(d / 3600) + ' giờ trước'
  return Math.floor(d / 86400) + ' ngày trước'
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) {
      setNotifications(data as AppNotification[])
      setUnread(data.filter(n => !n.is_read).length)
    }
  }, [user])

  useEffect(() => {
    load()
    if (!user) return
    const channel = supabase
      .channel('notifications:' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => {
          setNotifications(prev => [payload.new as AppNotification, ...prev])
          setUnread(n => n + 1)
        })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, load])

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnread(0)
  }

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnread(prev => Math.max(0, prev - 1))
  }

  return { notifications, unread, markAllRead, markRead, reload: load }
}

// ─── Bell button ──────────────────────────────────────────────────────────────
export function NotificationBell({ onClick, unread }: { onClick: () => void; unread: number }) {
  return (
    <button onClick={onClick} className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
      <Bell size={18} />
      {unread > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
          style={{ background: '#ef4444', lineHeight: 1 }}
        >
          {unread > 9 ? '9+' : unread}
        </motion.span>
      )}
    </button>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export function NotificationPanel({ open, onClose, notifications, unread, markAllRead, markRead }: {
  open: boolean
  onClose: () => void
  notifications: AppNotification[]
  unread: number
  markAllRead: () => void
  markRead: (id: string) => void
}) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            style={{ borderLeft: '1px solid #e5e7eb' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell size={17} className="text-gray-600" />
                <span className="font-bold text-gray-900 text-base">Thông báo</span>
                {unread > 0 && (
                  <span className="text-xs font-black text-white px-2 py-0.5 rounded-full" style={{ background: '#ef4444' }}>
                    {unread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                    <CheckCheck size={13} /> Đọc tất cả
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                  <Bell size={36} strokeWidth={1.2} />
                  <p className="text-sm font-medium">Chưa có thông báo nào</p>
                  <p className="text-xs text-center px-8">Bạn sẽ nhận thông báo khi có người nhắn tin, đăng ký nhận tin hoặc trang đạt mốc views.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map(n => {
                    const { icon: Icon, color, bg } = ICON_MAP[n.type] ?? ICON_MAP.milestone
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors ${n.is_read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'}`}
                        onClick={() => { if (!n.is_read) markRead(n.id) }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                          <Icon size={16} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-snug ${n.is_read ? 'text-gray-600 font-medium' : 'text-gray-900 font-semibold'}`}>{n.title}</p>
                            {!n.is_read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#5B6AD0' }} />}
                          </div>
                          {n.body && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.body}</p>}
                          <p className="text-[10px] text-gray-300 mt-1.5 font-medium">{timeAgo(n.created_at)}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">{notifications.length} thông báo gần đây</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
