import { apiRequest } from '../../../helpers/apiHelper'

export async function getAdminUsers() {
  return (await apiRequest('/admin/users')).data
}

export async function getAdminPosts() {
  return (await apiRequest('/admin/posts')).data
}
