import { DefinitionItem } from '@/domain/models/tasks/integrated/definition'

export interface DefinitionRepository {
  get(projectId: number, exampleId: number): Promise<DefinitionItem>

  update(
    projectId: number,
    exampleId: number,
    name: String,
    imageType: String,
    caption: String
  ): Promise<DefinitionItem>
  
}