import { DefinitionItem } from '@/domain/models/tasks/integrated/definition';
import { CaptionItem } from "~/domain/models/tasks/integrated/caption";

export class DefinitionDTO {
  exampleId: number
  name: string
  imageType: string
  caption: string
  imageId: string
  sourceName: string
  textTitle: string
  textId: string

  constructor(item: DefinitionItem) {
    this.exampleId = item.exampleId
    this.name = item.name
    this.imageType = item.imageType
    this.caption = item.caption
    this.imageId = item.imageId
    this.sourceName = item.sourceName
    this.textTitle = item.textTitle
    this.textId = item.textId
  }
}

export class CaptionDTO {
  exampleId: number
  imageUrl: string
  text: string

  constructor(item: CaptionItem) {
    this.exampleId = item.exampleId
    this.imageUrl = item.imageUrl
    this.text = item.text
  }
}