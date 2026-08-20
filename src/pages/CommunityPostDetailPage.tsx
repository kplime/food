import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addComment, getPost, subscribePostMessages, type Post } from '../lib/communityStore'
import { PostChat } from '../components/PostChat'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

export function CommunityPostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | undefined>(undefined)
  const [loaded, setLoaded] = useState(false)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!id) return
    const load = () => {
      getPost(id).then((p) => {
        setPost(p)
        setLoaded(true)
      })
    }
    load()
    return subscribePostMessages(id, load)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !comment.trim()) return
    await addComment(id, { body: comment })
    setComment('')
  }

  if (loaded && !post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-obang-black/70">{t('community_post_not_found')}</p>
        <Link to="/community" className="mt-3 inline-block text-obang-red hover:underline">
          {t('community_back_to_board')}
        </Link>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/community" className="inline-flex items-center py-2 text-sm text-obang-black/70 hover:text-obang-red">
        {t('community_back_to_board')}
      </Link>

      <div className="mt-3 border-2 border-obang-black bg-obang-white p-5 shadow-hard">
        <h1 className="font-display text-2xl font-black">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-xs text-obang-black/60">
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR')}</span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm text-obang-black/90">{post.body}</p>

        {post.media.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {post.media.map((m) =>
              m.kind === 'image' ? (
                <img key={m.id} src={m.url} alt="" className="w-full border-2 border-obang-black object-cover" />
              ) : (
                <video key={m.id} src={m.url} controls className="w-full border-2 border-obang-black" />
              ),
            )}
          </div>
        )}
      </div>

      <section className="mt-6">
        <h2 className="font-display text-lg font-bold">
          {t('community_comments_title')} ({post.comments.length})
        </h2>

        <div className="mt-3 divide-y divide-obang-black/15 border-2 border-obang-black">
          {post.comments.length === 0 && (
            <p className="p-4 text-center text-sm text-obang-black/60">{t('community_no_comments')}</p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex items-center gap-2 text-xs text-obang-black/60">
                <span className="font-bold text-obang-black">{c.author}</span>
                <span>·</span>
                <span>{new Date(c.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR')}</span>
              </div>
              <p className="mt-1 text-sm text-obang-black/90">{c.body}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('community_comment_placeholder')}
              maxLength={300}
              className="min-h-11 flex-1 border-2 border-obang-black px-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 border-2 border-obang-black bg-obang-black px-4 text-sm font-bold text-obang-white hover:bg-obang-black/80"
            >
              {t('community_comment_submit')}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-center text-sm text-obang-black/60">
            <Link to="/login" className="font-bold text-obang-red hover:underline">
              {t('community_login_to_post')}
            </Link>
          </p>
        )}
      </section>

      <PostChat postId={post.id} />
    </div>
  )
}
