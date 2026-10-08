import { ChatCircle, PaperPlaneRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { useZen } from '../state'

type Msg = { from: 'me' | 'support'; text: string }

// ZenMarket's support-message thread, demo-scaled: messages you send append
// locally so the composer actually works.
export function MessagesPage() {
  const { t } = useZen()
  const [sent, setSent] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setSent((m) => [...m, { from: 'me', text }, { from: 'support', text: t['msg.reply'] }])
    setDraft('')
  }

  const msgs: Msg[] = [
    { from: 'support', text: t['msg.seed1'] },
    { from: 'support', text: t['msg.seed2'] },
    ...sent,
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5">
      <h1 className="mb-4 flex items-center gap-2 text-lg font-bold text-zm-ink">
        <ChatCircle size={20} weight="fill" className="text-teal-700" />
        {t['msg.title']}
      </h1>
      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                  m.from === 'me'
                    ? 'rounded-br-sm bg-teal-700 text-white'
                    : 'rounded-bl-sm bg-neutral-100 text-zm-ink'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-neutral-100 p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t['msg.placeholder']}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
          />
          <button
            onClick={send}
            aria-label={t['msg.send']}
            className="grid h-9 w-9 place-items-center rounded-md bg-zm-red text-white hover:bg-zm-red-dark"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-neutral-400">
        {t['msg.note']}
      </p>
    </div>
  )
}
