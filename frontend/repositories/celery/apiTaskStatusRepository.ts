import { plainToInstance } from 'class-transformer'
import ApiServiceV2 from '@/services/api.service.v2'
import { TaskStatusRepository } from '@/domain/models/celery/taskStatusRepository'
import { Status } from '@/domain/models/celery/status'

export class APITaskStatusRepository implements TaskStatusRepository {
  constructor(private readonly request = ApiServiceV2) {}

  async get(taskId: string): Promise<Status> {
    const url = `/tasks/status/${taskId}`
    const response = await this.request.get(url)
    return plainToInstance(Status, response.data)
  }
}
