export class CaptionItem {
  constructor(public exampleId: number, public imageUrl: string, public text: string
  ) {}

  static valueOf({
    example_id,
    image_url,
    text
  }: {
    example_id: number
    image_url: string
    text: string
  }): CaptionItem {
    return new CaptionItem(example_id, image_url, text)
  }

  toObject(): Object {
    return {
      caption_id: this.exampleId,
      image_url: this.imageUrl,
      text: this.text
    }
  }

}