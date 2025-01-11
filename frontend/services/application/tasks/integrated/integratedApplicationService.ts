import { RelationRepository } from '~/domain/models/tasks/relationRepository';
import { DefinitionRepository } from '~/domain/models/tasks/integrated/definitionRepository';
import { APISpanRepository } from '~/repositories/tasks/Integrated/apiSpanRepository';
import { CaptionRepository } from '~/domain/models/tasks/integrated/captionRepository';
import { CaptionDTO, DefinitionDTO } from './integratedData';
import { IntegratedReponsitory } from '~/domain/models/tasks/integrated/integratedReponsitory';
import { Step } from '~/domain/models/project/integrated/step';

export class IntegratedApplicationService {
  constructor(
    readonly integratedReponsitory: IntegratedReponsitory,
    readonly definitionReponsitory: DefinitionRepository,
    readonly captionReponsitory: CaptionRepository,
    readonly relationRepository: RelationRepository,
    readonly spanRepository: APISpanRepository
  ) {}

  public async getStepStatus(projectId: number, exampleId: number): Promise<Array<boolean>> {
    return await this.integratedReponsitory.getStepStatus(projectId, exampleId)
  }

  public async updateStepStatus(
    projectId: number,
    exampleId: number,
    step: Step,
    status: boolean
  ): Promise<void> {
    return await this.integratedReponsitory.updateStepStatus(projectId, exampleId, step, status);
  }

  public async getDefinition(projectId: number, exampleId: number) {
    const item = await this.definitionReponsitory.get(projectId, exampleId)
    return new DefinitionDTO(item)
  }

  public async updateDefinition(projectId: number, exampleId: number,
    name: String, imageType: String, caption: String): Promise<void> {
    await this.definitionReponsitory.update(projectId, exampleId, name, imageType, caption)
  }

  public async getCaption(projectId: number, exampleId: number) {
    const item = await this.captionReponsitory.get(projectId, exampleId)
    return new CaptionDTO(item)
  }

  public async updateCaption(projectId: number, exampleId: number, text: string): Promise<void> {
    await this.captionReponsitory.update(projectId, exampleId, text)
  }
}