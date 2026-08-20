import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createPost, listPosts, subscribePosts, type PostSummary } from '../lib/communityStore'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

export function CommunityBoardPage() {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = () => {
      listPosts().then(setPosts)
    }
    load()
    return subscribePosts(load)
  }, [])

  const resetForm = () => {
    setTitle('')
    setBody('')
    setFiles([])
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    try {
      await createPost({ title, body, files })
      resetForm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-2xl font-black">{t('community_board_title')}</h1>
      <p className="mt-1 text-sm text-obang-black/70">{t('community_board_subtitle')}</p>
      <p className="mt-3 text-xs text-obang-black/50">{t('community_local_notice')}</p>

      <div className="mt-6 flex items-center justify-end gap-3">
        {user ? (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="min-h-11 shrink-0 border-2 border-obang-black bg-obang-red px-4 text-sm font-bold text-obang-white transition-colors hover:bg-obang-black"
          >
            {t('community_new_post')}
          </button>
        ) : (
          <Link
            to="/login"
            className="min-h-11 shrink-0 border-2 border-obang-black px-4 py-2.5 text-sm font-bold transition-colors hover:bg-obang-black hover:text-obang-white"
          >
            {t('community_login_to_post')}
          </Link>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-2 border-obang-black bg-obang-white p-4 shadow-hard">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('community_post_title_placeholder')}
            maxLength={80}
            className="min-h-11 w-full border-2 border-obang-black px-3 text-sm outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t('community_post_body_placeholder')}
            rows={4}
            className="w-full border-2 border-obang-black px-3 py-2 text-sm outline-none"
          />

          <label className="flex min-h-11 w-fit cursor-pointer items-center border-2 border-obang-black px-3 text-sm font-bold hover:bg-obang-black/10">
            {t('community_attach_media')}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-1 border-2 border-obang-black bg-obang-white px-2 py-1 text-xs">
                  <span className="max-w-32 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="font-bold text-obang-red hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 border-2 border-obang-black px-4 text-sm font-bold hover:bg-obang-black/10"
            >
              {t('community_post_cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 border-2 border-obang-black bg-obang-black px-4 text-sm font-bold text-obang-white hover:bg-obang-black/80 disabled:opacity-50"
            >
              {t('community_post_submit')}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 divide-y-2 divide-obang-black border-2 border-obang-black">
        {posts.length === 0 && <p className="p-6 text-center text-sm text-obang-black/60">{t('community_no_posts')}</p>}
        {posts.map((post) => (
          <Link key={post.id} to={`/community/${post.id}`} className="flex gap-3 p-4 hover:bg-obang-black/5">
            {post.media[0] &&
              (post.media[0].kind === 'image' ? (
                <img src={post.media[0].url} alt="" className="h-14 w-14 shrink-0 border-2 border-obang-black object-cover" />
              ) : (
                <video src={post.media[0].url} className="h-14 w-14 shrink-0 border-2 border-obang-black object-cover" />
              ))}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-bold">{post.title}</h2>
                <span className="shrink-0 text-xs text-obang-black/50">{post.commentCount}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-obang-black/60">
                <span>{post.author}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
