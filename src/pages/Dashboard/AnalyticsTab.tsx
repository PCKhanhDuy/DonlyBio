import { useState, useEffect } from 'react'
import { TrendingUp, MousePointerClick, Eye, RefreshCw, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { BioLink } from '../../types'

function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getLast7Days(): string[] { return getLast30Days().slice(-7) }

function getLast90Days(): string[] {
  const days: string[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function AnalyticsTab() {
  const { user, isPro } = useAuth()
  const navigate = useNavigate()
  const [range, setRange] = useState<7 | 30 | 90>(7)
  const [views, setViews] = useState<{ date: string; count: number }[]>([])
  const [clicksByDay, setClicksByDay] = useState<{ date: string; count: number }[]>([])
  const [clicks, setClicks] = useState<{ link_id: string; count: number }[]>([])
  const [links, setLinks] = useState<BioLink[]>([])
  const [loading, setLoading] = useState(true)
  const [totalViews, setTotalViews] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => { load() }, [range])

  const load = async () => {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - range)
    const sinceStr = since.toISOString()

    const [{ data: vData }, { data: cData }, { data: lData }] = await Promise.all([
      supabase.from('page_views').select('viewed_at').eq('user_id', user!.id).gte('viewed_at', sinceStr),
      supabase.from('link_clicks').select('link_id,clicked_at').eq('user_id', user!.id).gte('clicked_at', sinceStr),
      supabase.from('bio_links').select('*').eq('user_id', user!.id).order('sort_order'),
    ])

    // Group views by day
    const days = range === 7 ? getLast7Days() : range === 30 ? getLast30Days() : getLast90Days()
    const viewMap: Record<string, number> = {}
    days.forEach(d => { viewMap[d] = 0 })
    ;(vData ?? []).forEach(v => {
      const d = v.viewed_at.slice(0, 10)
      if (viewMap[d] !== undefined) viewMap[d]++
    })
    setViews(days.map(d => ({ date: d, count: viewMap[d] })))
    setTotalViews((vData ?? []).length)

    // Group clicks by day
    const clickDayMap: Record<string, number> = {}
    days.forEach(d => { clickDayMap[d] = 0 })
    ;(cData ?? []).forEach(c => {
      const d = c.clicked_at.slice(0, 10)
      if (clickDayMap[d] !== undefined) clickDayMap[d]++
    })
    setClicksByDay(days.map(d => ({ date: d, count: clickDayMap[d] })))

    // Group clicks by link_id
    const clickMap: Record<string, number> = {}
    ;(cData ?? []).forEach(c => {
      clickMap[c.link_id] = (clickMap[c.link_id] ?? 0) + 1
    })
    const clickArr = Object.entries(clickMap).map(([link_id, count]) => ({ link_id, count }))
    clickArr.sort((a, b) => b.count - a.count)
    setClicks(clickArr)
    setTotalClicks((cData ?? []).length)

    setLinks(lData ?? [])
    setLoading(false)
  }

  const maxViews = Math.max(...views.map(v => v.count), 1)

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T00:00:00')
    return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Lượt xem trang và click links của bạn.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {([7, 30] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${range === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                {r} ngày
              </button>
            ))}
            <button
              onClick={() => isPro ? setRange(90) : navigate('/pricing')}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${range === 90 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              90 ngày
              {!isPro && <Crown size={9} className="text-amber-500" />}
            </button>
          </div>
          <button onClick={load} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className={`grid gap-4 ${isPro ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EBEDDF' }}>
              <Eye size={15} style={{ color: '#333A2F' }} />
            </div>
            <span className="text-sm font-medium text-gray-600">Lượt xem</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '—' : totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{range} ngày qua</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50">
              <MousePointerClick size={15} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Lượt click</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '—' : totalClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{range} ngày qua</p>
        </div>
        {isPro && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50">
                <TrendingUp size={15} className="text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">CTR</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loading || totalViews === 0 ? '—' : `${((totalClicks / totalViews) * 100).toFixed(1)}%`}
            </p>
            <p className="text-xs text-gray-400 mt-1">Click-Through Rate</p>
          </div>
        )}
      </div>
      {!isPro && (
        <button onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
        >
          <Crown size={14} />
          PRO: Xem thêm chỉ số CTR, 90 ngày analytics và nhiều hơn nữa →
        </button>
      )}

      {/* Views chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">Lượt xem theo ngày</h3>
        </div>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {views.map(v => (
              <div key={v.date} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full relative flex flex-col justify-end" style={{ height: '100px' }}>
                  <div
                    className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 relative"
                    style={{
                      height: `${Math.max(4, (v.count / maxViews) * 100)}%`,
                      background: '#333A2F',
                    }}>
                    {v.count > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                        {v.count}
                      </div>
                    )}
                  </div>
                </div>
                {range <= 7 && (
                  <span className="text-[9px] text-gray-400">{formatDate(v.date)}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {range === 30 && (
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">{formatDate(views[0]?.date ?? '')}</span>
            <span className="text-[10px] text-gray-400">{formatDate(views[views.length - 1]?.date ?? '')}</span>
          </div>
        )}
      </div>

      {/* Clicks chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-5">
          <MousePointerClick size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">Lượt click theo ngày</h3>
        </div>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {clicksByDay.map(v => {
              const maxC = Math.max(...clicksByDay.map(x => x.count), 1)
              return (
                <div key={v.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full relative flex flex-col justify-end" style={{ height: '100px' }}>
                    <div
                      className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 relative"
                      style={{ height: `${Math.max(4, (v.count / maxC) * 100)}%`, background: '#2563eb' }}>
                      {v.count > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                          {v.count}
                        </div>
                      )}
                    </div>
                  </div>
                  {range <= 7 && (
                    <span className="text-[9px] text-gray-400">{formatDate(v.date)}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {range === 30 && (
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">{formatDate(clicksByDay[0]?.date ?? '')}</span>
            <span className="text-[10px] text-gray-400">{formatDate(clicksByDay[clicksByDay.length - 1]?.date ?? '')}</span>
          </div>
        )}
      </div>

      {/* Link clicks breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MousePointerClick size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">Click theo link</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#333A2F', borderTopColor: 'transparent' }} />
          </div>
        ) : clicks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Chưa có click nào trong {range} ngày qua</p>
        ) : (
          <div className="space-y-3">
            {clicks.map(c => {
              const link = links.find(l => l.id === c.link_id)
              const pct = Math.round((c.count / totalClicks) * 100)
              return (
                <div key={c.link_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-3">
                      {link?.title ?? 'Link đã xóa'}
                    </span>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">{c.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: '#333A2F' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
