import ApiServiceV2 from '@/services/api.service.v2'
import { AuthRepository } from '@/domain/models/auth/authRepository'

export class APIAuthRepository implements AuthRepository {
  constructor(private readonly request = ApiServiceV2) {}

  async login(username: string, password: string): Promise<void> {
    const url = `/auth/login/`
    await this.request.post(url, { username, password })
  }

  async logout(): Promise<void> {
    const url = '/auth/logout/'
    await this.request.post(url)
  }
}
