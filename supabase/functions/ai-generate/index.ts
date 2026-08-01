// Supabase Edge Function: ai-generate
// Deploy:  supabase functions deploy ai-generate
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_TEMPLATES = [
  'minimal','dark','gradient','cream','violet','forest','teal','earth',
  'neon','vivid','glass','sakura','midnight','paper','peach','nordic',
  'cyberpunk','jade','lavender','retro','coral','blush','charcoal','matcha','dusk','arctic',
]
const VALID_LAYOUTS = ['centered','left','hero','grid','magazine','overlay']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { prompt } = await req.json()
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'prompt required' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: [
        'You are a BioLink profile generator. Return ONLY valid JSON (no markdown, no explanation).',
        'Fields: display_name (string), bio (string ≤ 100 chars, engaging, use 1-2 emojis),',
        `template_id (one of: ${VALID_TEMPLATES.join(', ')}),`,
        `layout_id (one of: ${VALID_LAYOUTS.join(', ')}).`,
        'Pick theme and layout that best match the person\'s vibe and profession.',
        'Make the bio punchy and personality-driven.',
      ].join(' '),
      messages: [{ role: 'user', content: `Create a BioLink profile for: ${prompt}` }],
    }),
  })

  const data = await resp.json()
  const text = data.content?.[0]?.text ?? '{}'

  let result: Record<string, unknown> = {}
  try {
    result = JSON.parse(text)
    // Sanitize — only return known-safe fields
    result = {
      display_name: typeof result.display_name === 'string' ? result.display_name.slice(0, 60) : undefined,
      bio:          typeof result.bio          === 'string' ? result.bio.slice(0, 160)          : undefined,
      template_id:  VALID_TEMPLATES.includes(result.template_id as string) ? result.template_id  : undefined,
      layout_id:    VALID_LAYOUTS.includes(result.layout_id   as string) ? result.layout_id    : undefined,
    }
  } catch {
    // Return empty on parse failure
  }

  return new Response(JSON.stringify(result), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
