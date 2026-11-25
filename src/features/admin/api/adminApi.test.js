import { getAdminUsers, getAdminPosts } from './adminApi'
import { apiRequest } from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({ apiRequest: vi.fn() }))

beforeEach(() => vi.resetAllMocks())

describe('adminApi', () => {
  it('getAdminUsers', async () => {
    apiRequest.mockResolvedValue({ data: ['u'] })
    expect(await getAdminUsers()).toEqual(['u'])
    expect(apiRequest).toHaveBeenCalledWith('/admin/users')
  })

  it('getAdminPosts', async () => {
    apiRequest.mockResolvedValue({ data: ['p'] })
    expect(await getAdminPosts()).toEqual(['p'])
    expect(apiRequest).toHaveBeenCalledWith('/admin/posts')
  })
})
