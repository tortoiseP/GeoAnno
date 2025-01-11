

export interface IntegratedReponsitory {
  getStepStatus(projectId: number, exampleId: number): Promise<Array<boolean>>

  updateStepStatus(projectId: number, exampleId: number, stepConfirmed: boolean[]): Promise<void>
}