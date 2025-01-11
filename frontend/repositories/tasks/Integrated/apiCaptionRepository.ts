import ApiServiceV2 from '@/services/api.service.v2'
import { CaptionRepository } from "~/domain/models/tasks/integrated/captionRepository";
import { CaptionItem } from '~/domain/models/tasks/integrated/caption';

export class ApiCaptionRepository implements CaptionRepository {
  constructor(private readonly request = ApiServiceV2) {}
  async create(projectId: number, exampleId: number, item: CaptionItem): Promise<CaptionItem> {
    const url = `/projects/${projectId}/examples/${exampleId}/caption`
    const response = await this.request.post(url, item.toObject)
    return CaptionItem.valueOf(response.data)
  }

  async get(projectId: number, exampleId: number): Promise<CaptionItem> {
    const url = `/projects/${projectId}/examples/${exampleId}/caption`
    const response = await this.request.get(url)
    return CaptionItem.valueOf(response.data)
  }

  async update(
    projectId: number,
    exampleId: number,
    text: string
  ): Promise<CaptionItem>{
    const url = `/projects/${projectId}/examples/${exampleId}/caption`
    const response = await this.request.patch(url, { text })
    return CaptionItem.valueOf(response.data)
  }

  async delete(projectId: number, exampleId: number): Promise<void> {
    const url = `/projects/${projectId}/examples/${exampleId}/caption`
    await this.request.delete(url)
  }

}