import { CaptionItem } from "~/domain/models/tasks/integrated/caption"

export interface CaptionRepository {
  // 创建一个Caption新版本
  create(projectId: number, exampleId: number, caption: CaptionItem): Promise<CaptionItem>

  get(projectId: number, exampleId: number): Promise<CaptionItem>

  update(projectId: number, exampleId: number, text: string): Promise<CaptionItem>

  delete(projectId: number, exampleId: number): Promise<void>
}