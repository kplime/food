import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPostMessages, sendPostMessage, subscribePostMessages, type ChatMessage } from '../lib/communityStore'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

export function PostChat({ postId }: { postId: string }) {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = () => {
      listPostMessages(postId).then(setMessages)
    }
    load()
    return subscribePostMessages(postId, load)
  }, [postId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    await sendPostMessage(postId, { body: text })
    setText('')
  }

  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-bold">{t('community_post_chat_title')}</h2>

      <div className="mt-3 flex h-72 flex-col border-2 border-obang-black bg-obang-white shadow-hard">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-obang-black/60">{t('community_chat_no_messages')}</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-bold">{m.author}</span>
                <span className="text-xs text-obang-black/50">
                  {new Date(m.createdAt).toLocaleTimeString(lang === 'en' ? 'en-US' : 'ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-obang-black/90">{m.body}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t-2 border-obang-black p-3">
          {user ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('community_chat_placeholder')}
                maxLength={300}
                className="min-h-11 flex-1 border-2 border-obang-black px-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 border-2 border-obang-black bg-obang-red px-4 text-sm font-bold text-obang-white hover:bg-obang-black"
              >
                {t('community_chat_send')}
              </button>
            </form>
          ) : (
            <p className="text-center text-sm text-obang-black/60">
              <Link to="/login" className="font-bold text-obang-red hover:underline">
                {t('community_login_to_post')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
