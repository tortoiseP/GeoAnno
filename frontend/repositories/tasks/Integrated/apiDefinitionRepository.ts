import ApiServiceV2 from '@/services/api.service.v2'
import { DefinitionItem } from '~/domain/models/tasks/integrated/definition';
import { DefinitionRepository } from "~/domain/models/tasks/integrated/definitionRepository";


export class ApiDefinitionRepository implements DefinitionRepository {
  constructor(private readonly request = ApiServiceV2) {}

  async get(projectId: number, exampleId: number): Promise<DefinitionItem>{
    const url = `/projects/${projectId}/examples/${exampleId}/definition`
    const response = await this.request.get(url)
    return DefinitionItem.valueOf(response.data)
  }

  async update(
    projectId: number,
    exampleId: number,
    name: String,
    imageType: String,
    caption: String
  ): Promise<DefinitionItem> {
      const url = `/projects/${projectId}/examples/${exampleId}/definition`
      const response = await this.request.patch(url, { name, caption, "image_type": imageType})
      return DefinitionItem.valueOf(response.data)
  }
}