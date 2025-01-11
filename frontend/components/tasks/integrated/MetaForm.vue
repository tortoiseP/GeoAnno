<template>
  <form>
    <v-text-field
      v-model="formData.name"
      :error-messages="nameErrors"
      label="图名"
      :counter="25"
      required
      @input="$v.formData.name.$touch()"
      @blur="$v.formData.name.$touch()"
    ></v-text-field>
    <v-select
      v-model="formData.imageType"
      :items="items"
      :error-messages="imageTypeErrors"
      label="图像类型"
      required
      @change="$v.formData.imageType.$touch()"
      @blur="$v.formData.imageType.$touch()"
    ></v-select>
    <v-textarea
      v-model="formData.caption"
      :error-messages="captionErrors"
      label="图注"
      :counter="128"
      rows="3"
      @input="$v.formData.caption.$touch()"
      @blur="$v.formData.caption.$touch()"
    ></v-textarea>
    <v-text-field
      v-model="formData.imageId"
      label="图像编号"
      disabled
    ></v-text-field>
    <v-text-field
      v-model="formData.sourceName"
      label="数据来源"
      disabled
    ></v-text-field>
    <v-text-field
      v-model="formData.textTitle"
      label="章节标题"
      disabled
    ></v-text-field>
    <v-text-field
      v-model="formData.textId"
      label="上下文编号"
      disabled
    ></v-text-field>
    <v-btn @click="saveForm">保存</v-btn>
    <v-btn @click="resetForm">清除</v-btn>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { Step } from '~/domain/models/project/integrated/step';

export default {
  mixins: [validationMixin],
  props: {
    projectId: {
      type: String,
      required: true
    },
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
      const data = await this.$services.integrated.getMeta(
        parseInt(this.projectId),
        parseInt(this.exampleId)
      )
      // await setTimeout(() => {}, 1);
      // const data = {
      //   exampleId: 1,
      //   name: "陇海路卧龙寺滑坡剖面图",
      //   imageType: "地貌学原理图",
      //   caption: "1 . 滑坡壁2 . 滑坡洼地3 . 滑坡台阶4 . 滑醉林",
      //   imageId: "7851-0006-0002-0002-0226",
      //   sourceName: "水文与地貌",
      //   textTitle: "二、 滑坡",
      //   textId: "7851-0006-0002-0002",
      // };
      this.formData = { ...this.formData, ...data }
    },
    saveForm() {
      this.$services.integrated.updateMeta(
        this.projectId,
        this.exampleId,
        this.formData.name,
        this.formData.imageType,
        this.formData.caption
      );
      this.$emit('reverse', Step.Definition, true)
    },
    resetForm() {
      this.fetchFormData()
      this.$emit('reverse', Step.Definition, false)
    }
  }
}
</script>

<style scoped>
</style>
