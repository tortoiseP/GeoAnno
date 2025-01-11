import { plainToInstance } from 'class-transformer'
import ApiServiceV2 from '@/services/api.service.v2'
import { CatalogRepository } from '@/domain/models/upload/catalogRepository'
import { Catalog } from '~/domain/models/upload/catalog'

export class APICatalogRepository implements CatalogRepository {
  constructor(private readonly request = ApiServiceV2) {}

  async list(projectId: string): Promise<Catalog[]> {
    const url = `/projects/${projectId}/catalog`
    const response = await this.request.get(url)
    return response.data.map((item: any) => plainToInstance(Catalog, item))
  }
}
