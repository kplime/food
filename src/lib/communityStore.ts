// Data layer for the community board/chat, backed by the Django REST API
// (backend/community) which persists to the MySQL `food` database.
//
// Writes require a logged-in account — the server derives `author` from the
// JWT, so callers here never pass a display name.

import { getAccessToken } from './authStore'

export type Comment = {
  id: string
  author: string
  body: string
  createdAt: number
}

export type Media = {
  id: string
  url: string
  kind: 'image' | 'video'
}

export type PostSummary = {
  id: string
  author: string
  title: string
  body: string
  createdAt: number
  commentCount: number
  media: Media[]
}

export type Post = {
  id: string
  author: string
  title: string
  body: string
  createdAt: number
  comments: Comment[]
  media: Media[]
}

export type ChatMessage = {
  id: string
  author: string
  body: string
  createdAt: number
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api'
const WS_BASE = API_BASE.replace(/^http/, 'ws').replace(/\/api\/?$/, '')

type ApiMedia = { id: number; url: string; kind: 'image' | 'video' }
type ApiComment = { id: number; author: string; body: string; created_at: string }
type ApiChatMessage = { id: number; author: string; body: string; created_at: string }
type ApiPostList = {
  id: number
  author: string
  title: string
  body: string
  created_at: string
  comment_count: number
  media: ApiMedia[]
}
type ApiPostDetail = {
  id: number
  author: string
  title: string
  body: string
  created_at: string
  comments: ApiComment[]
  media: ApiMedia[]
}

function toComment(c: ApiComment): Comment {
  return { id: String(c.id), author: c.author, body: c.body, createdAt: Date.parse(c.created_at) }
}

function toChatMessage(m: ApiChatMessage): ChatMessage {
  return { id: String(m.id), author: m.author, body: m.body, createdAt: Date.parse(m.created_at) }
}

function toMedia(m: ApiMedia): Media {
  return { id: String(m.id), url: m.url, kind: m.kind }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken()
  // Let the browser set its own multipart Content-Type (with boundary) when
  // the body is FormData — forcing 'application/json' would break the upload.
  const isFormData = init?.body instanceof FormData
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

// Opens a WebSocket to a Channels consumer and fires `callback` on every
// message it pushes (the payload itself doesn't matter — it's just a "go
// refetch" signal). Reconnects with backoff if the connection drops.
function wsSubscribe(path: string, callback: () => void): () => void {
  let socket: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let closedByCaller = false

  const connect = () => {
    socket = new WebSocket(`${WS_BASE}${path}`)
    socket.onmessage = () => callback()
    socket.onclose = () => {
      if (!closedByCaller) reconnectTimer = setTimeout(connect, 2000)
    }
  }
  connect()

  return () => {
    closedByCaller = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    // Closing a still-CONNECTING socket logs a noisy (harmless) browser
    // warning — this is common under StrictMode's mount/cleanup/mount dance.
    // Deferring the close until it's actually open avoids that.
    if (socket && socket.readyState === WebSocket.CONNECTING) {
      socket.addEventListener('open', () => socket?.close())
    } else {
      socket?.close()
    }
  }
}

// -- Posts --

export async function listPosts(): Promise<PostSummary[]> {
  const posts = await apiFetch<ApiPostList[]>('/posts/')
  return posts.map((p) => ({
    id: String(p.id),
    author: p.author,
    title: p.title,
    body: p.body,
    createdAt: Date.parse(p.created_at),
    commentCount: p.comment_count,
    media: p.media.map(toMedia),
  }))
}

export async function getPost(id: string): Promise<Post | undefined> {
  try {
    const p = await apiFetch<ApiPostDetail>(`/posts/${id}/`)
    return {
      id: String(p.id),
      author: p.author,
      title: p.title,
      body: p.body,
      createdAt: Date.parse(p.created_at),
      comments: p.comments.map(toComment),
      media: p.media.map(toMedia),
    }
  } catch {
    return undefined
  }
}

export async function createPost(input: { title: string; body: string; files?: File[] }): Promise<Post> {
  const form = new FormData()
  form.set('title', input.title.trim())
  form.set('body', input.body.trim())
  for (const file of input.files ?? []) form.append('media', file)

  const p = await apiFetch<ApiPostDetail>('/posts/', { method: 'POST', body: form })
  return {
    id: String(p.id),
    author: p.author,
    title: p.title,
    body: p.body,
    createdAt: Date.parse(p.created_at),
    comments: [],
    media: p.media.map(toMedia),
  }
}

export async function addComment(postId: string, input: { body: string }): Promise<Comment> {
  const c = await apiFetch<ApiComment>(`/posts/${postId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ body: input.body.trim() }),
  })
  return toComment(c)
}

export function subscribePosts(callback: () => void): () => void {
  return wsSubscribe('/ws/posts/', callback)
}

// -- Per-post chat --

export async function listPostMessages(postId: string): Promise<ChatMessage[]> {
  const messages = await apiFetch<ApiChatMessage[]>(`/posts/${postId}/chat/`)
  return messages.map(toChatMessage)
}

export async function sendPostMessage(postId: string, input: { body: string }): Promise<ChatMessage> {
  const m = await apiFetch<ApiChatMessage>(`/posts/${postId}/chat/`, {
    method: 'POST',
    body: JSON.stringify({ body: input.body.trim() }),
  })
  return toChatMessage(m)
}

// Fires on any change to this post's room — new comment or new chat message.
// Used by both the post detail page (comments) and PostChat (chat).
export function subscribePostMessages(postId: string, callback: () => void): () => void {
  return wsSubscribe(`/ws/posts/${postId}/`, callback)
}
