import {
  CATEGORIES,
  getCategories,
  getPublicPosts,
  getPublicPost,
  getMyPosts,
  getStats,
  createPost,
  updatePost,
  togglePublish,
  deletePost,
  aiGenerate,
} from './blogApi'
import { apiRequest } from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({ apiRequest: vi.fn() }))

beforeEach(() => vi.resetAllMocks())

const cases = [
  ['getCategories', () => getCategories(), '/public/categories', { auth: false }],
  ['getPublicPosts tanpa filter', () => getPublicPosts('', ''), '/public/posts', { auth: false }],
  [
    'getPublicPosts dengan filter',
    () => getPublicPosts('go', 'Umum'),
    '/public/posts?q=go&category=Umum',
    { auth: false },
  ],
  ['getPublicPost', () => getPublicPost('abc'), '/public/posts/abc', { auth: false }],
  ['getMyPosts', () => getMyPosts(), '/posts', undefined],
  ['getStats', () => getStats(), '/posts/stats', undefined],
  ['createPost', () => createPost({ a: 1 }), '/posts', { method: 'POST', body: { a: 1 } }],
  ['updatePost', () => updatePost(3, { a: 1 }), '/posts/3', { method: 'PUT', body: { a: 1 } }],
  ['togglePublish', () => togglePublish(3), '/posts/3/toggle-publish', { method: 'PATCH' }],
  ['deletePost', () => deletePost(3), '/posts/3', { method: 'DELETE' }],
  [
    'aiGenerate',
    () => aiGenerate({ topic: 'x' }),
    '/posts/ai-generate',
    { method: 'POST', body: { topic: 'x' } },
  ],
]

describe('blogApi', () => {
  it.each(cases)('%s', async (_name, call, path, options) => {
    apiRequest.mockResolvedValue({ data: 'D' })
    expect(await call()).toBe('D')
    expect(apiRequest).toHaveBeenCalledWith(path, options)
  })

  it('menyediakan daftar kategori', () => {
    expect(CATEGORIES).toContain('Umum')
  })
})
