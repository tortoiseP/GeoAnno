import ApiServiceV2 from '@/services/api.service.v2'
import { IntegratedReponsitory } from '~/domain/models/tasks/integrated/integratedReponsitory';


export class ApiIntegratedRepository implements IntegratedReponsitory {
  constructor(private readonly request = ApiServiceV2) {}

  async getStepStatus(projectId: number, exampleId: number): Promise<Array<boolean>> {
    const url = `/projects/${projectId}/examples/${exampleId}/step-status`
    const response = await this.request.get(url)
    return response.data
  }

  async updateStepStatus(
    projectId: number,
    exampleId: number,
    stepConfirmed: boolean[]
  ): Promise<void> {
    const url = `/projects/${projectId}/examples/${exampleId}/step-status`
    await this.request.post(url, 
      {"project_id": projectId, "example_id": exampleId, "step_confirmed": stepConfirmed}
    )
  }

}