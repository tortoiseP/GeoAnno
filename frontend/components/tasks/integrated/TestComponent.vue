<template>
  <div>
  </div>
</template>

<script>

export default {
  props: {
    exampleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: '',
        imageType: null,
        caption: '',
        imageId: '',
        sourceName: '',
        textTitle: '',
        textId: ''
      },
      items: ['地貌学原理图', '地貌学地图', '地貌学实景图', '其他图像']
    }
  },
  validations: {
    formData: {
      name: { required, maxLength: maxLength(25) },
      imageType: { required },
      caption: { maxLength: maxLength(128) }
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.formData.name.$dirty) return errors
      !this.$v.formData.name.required && errors.push('图名是必填项')
      !this.$v.formData.name.maxLength && errors.push('图名最长不超过25字')
      return errors
    },
    imageTypeErrors() {
      const errors = []
      if (!this.$v.formData.imageType.$dirty) return errors
      !this.$v.formData.imageType.required && errors.push('图像类型是必填项')
      return errors
    },
    captionErrors() {
      const errors = []
      if (!this.$v.formData.caption.$dirty) return errors
      !this.$v.formData.caption.maxLength && errors.push('图注最长不超过128字')
      return errors
    }
  },
  watch: {
    exampleId: {
      immediate: true,
      handler() {
        this.fetchFormData()
      }
    }
  },
  methods: {
    async fetchFormData() {
      const data = await this.$services.integrated.getMeta(1, 1)
      this.formData = { ...this.formData, ...data }
      // this.$
    },
    saveForm() {
      this.$emit('save', this.formData)
    },
    resetForm() {
      this.formData = {
        name: '',
        imageType: null,
        caption: '',
        imageId: '',
        sourceName: '',
        textTitle: '',
        textId: ''
      }
      this.$emit('reset')
    }
  }
}
</script>

<style scoped>
</style>
