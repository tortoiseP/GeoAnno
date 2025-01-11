<template>
  <v-stage
    ref="stageRef"
    :config="{ ...configStage }"
  >
    <v-layer>
      <base-image :image-url="imageUrl" @loaded="imageLoaded" />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Konva from 'konva'
import BaseImage from '@/components/tasks/image/BaseImage.vue'

export default Vue.extend({
  name: 'VBoundingBox',

  components: {
    BaseImage
  },
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      selectedRectangle: null as string | null,
      imageSize: {
        width: 0,
        height: 0
      },
      configStage: {
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true
      },
      stage: {} as Konva.Stage
    }
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    this.stage = (this.$refs.stageRef as unknown as Konva.StageConfig).getNode()
  },

  beforeDestroy() {},

  methods: {
    imageLoaded(width: number, height: number) {
      const maxScale = this.$el.clientWidth / width
      const imageIsSmallerThanContainer = maxScale > 1
      this.imageSize.width = width
      this.imageSize.height = height
      if (imageIsSmallerThanContainer) {
        this.configStage.width = width
        this.configStage.height = height
        this.stage.scale({ x: 1, y: 1 })
        this.$emit('update-scale', 1)
      } else {
        this.configStage.width = width * maxScale
        this.configStage.height = height * maxScale
        this.stage.scale({ x: maxScale, y: maxScale })
        this.$emit('update-scale', maxScale)
      }
      this.stage.draw()
    }
  }
})
</script>
