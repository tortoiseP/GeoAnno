import ApiServiceV2 from '@/services/api.service.v2'
import { Step } from '~/domain/models/project/integrated/step';
import { IntegratedReponsitory } from '~/domain/models/tasks/integrated/integratedReponsitory';


export class ApiIntegratedRepository implements IntegratedReponsitory {
  constructor(private readonly request = ApiServiceV2) {}

  async getStepStatus(projectId: number, exampleId: number): Promise<Array<boolean>> {
    const url = `/projects/${projectId}/examples/${exampleId}/step-status`
    const response = await this.request.get(url)
    return response.data.map((b: any) => b)
  }

  async updateStepStatus(
    projectId: number,
    exampleId: number,
    step: Step,
    status: Boolean
  ): Promise<void> {
    const url = `/projects/${projectId}/examples/${exampleId}/step-status`
    await this.request.patch(url, {step, status})
  }

}