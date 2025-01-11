import { Step } from '~/domain/models/project/integrated/step';


export interface IntegratedReponsitory {
  getStepStatus(projectId: number, exampleId: number): Promise<Array<boolean>>

  updateStepStatus(projectId: number, exampleId: number, step: Step, status: boolean): Promise<void>
}