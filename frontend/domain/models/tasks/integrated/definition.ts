export class DefinitionItem {
  constructor(public exampleId: number, public name: string, public imageType: string,
    public caption: string, public imageId: string, public sourceName: string,
    public textTitle: string,public textId: string, 
  ) {}

  static valueOf({
    example_id,
    name,
    image_type,
    caption,
    image_id,
    source_name,
    text_title,
    text_id
  }: {
    example_id: number
    name: string
    image_type: string
    caption: string
    image_id: string
    source_name: string
    text_title: string
    text_id: string
  }): DefinitionItem {
    return new DefinitionItem(example_id, name, image_type,
      caption, image_id, source_name,
      text_title, text_id
    )
  }

  toObject(): Object {
    return {
      example_id: this.exampleId,
      name: this.name,
      image_type: this.imageType,
      caption: this.caption,
      image_id: this.imageId,
      source_name: this.sourceName,
      text_title: this.textTitle,
      text_id: this.textId
    }
  }
}
