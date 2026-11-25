import { apiRequest } from '../../../helpers/apiHelper'

export const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

function query(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

async function data(path, options) {
  const res = await apiRequest(path, options)
  return res.data
}

export const getCategories = () => data('/public/categories', { auth: false })
export const getPublicPosts = (q, category) =>
  data(`/public/posts${query({ q, category })}`, { auth: false })
export const getPublicPost = (slug) => data(`/public/posts/${slug}`, { auth: false })

export const getMyPosts = () => data('/posts')
export const getStats = () => data('/posts/stats')
export const createPost = (body) => data('/posts', { method: 'POST', body })
export const updatePost = (id, body) => data(`/posts/${id}`, { method: 'PUT', body })
export const togglePublish = (id) => data(`/posts/${id}/toggle-publish`, { method: 'PATCH' })
export const deletePost = (id) => data(`/posts/${id}`, { method: 'DELETE' })
export const aiGenerate = (body) => data('/posts/ai-generate', { method: 'POST', body })
