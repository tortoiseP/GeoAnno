<template>
  <div>
  <component :is="currentComponent"
              v-if="doc.id"
              v-shortkey="shortKeys"
              @shortkey="changeSelectedLabel">
    <template #header>
      <toolbar-laptop
        :doc-id="doc.id"
        :steps="steps"
        :step-idx="stepIdx"
        :step-confirmed="stepConfirmed"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="doc.isConfirmed"
        :total="docs.count"
        :enable-stepper="project.enableStepper"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
        @step-change="onStepChange"
      />
      <toolbar-mobile :total="docs.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card v-if="steps[stepIdx - 1] === Step.Definition" class="image-show-card">
        <image-define :image-url="doc.fileUrl" @loaded="imageLoaded" />
      </v-card>
      <v-card v-else-if="steps[stepIdx - 1] === Step.Caption">
        <image-caption :example-id="doc.id" @reverse="updateStep" />
      </v-card>
      <v-card v-else-if="steps[stepIdx - 1] === Step.Label">
        <div class="annotation-text pa-4">
          <entity-editor
            :dark="$vuetify.theme.dark"
            :rtl="isRTL"
            :text="doc.text"
            :entities="annotations"
            :entity-labels="spanTypes"
            :relations="relations"
            :relation-labels="relationTypes"
            :allow-overlapping="project.allowOverlapping"
            :grapheme-mode="project.graphemeMode"
            :selected-label="selectedLabel"
            :relation-mode="relationMode"
            @addEntity="addSpan"
            @addRelation="addRelation"
            @click:entity="updateSpan"
            @click:relation="updateRelation"
            @contextmenu:entity="deleteSpan"
            @contextmenu:relation="deleteRelation"
          />
        </div>
      </v-card>
    </template>
    <template v-if="enableSidebar" #sidebar>
      <!-- 图像元数据表单 -->
      <v-card v-if="steps[stepIdx - 1] === Step.Definition">
        <v-card-title>图像元数据</v-card-title>
        <v-card-text>
          <meta-form
            :project-id="projectId"
            :example-id="doc.id"
            @reverse="updateStep" />
        </v-card-text>
      </v-card>
      <div v-else-if="steps[stepIdx - 1] === Step.Label">
        <annotation-progress :progress="progress" />
        <!-- 文本信息标注标签管理 -->
        <v-card class="mt-4">
          <v-card-title>标签类型</v-card-title>
          <v-card-text>
            <v-switch v-if="useRelationLabeling" v-model="relationMode">
              <template #label>
                <span v-if="relationMode">关系</span>
                <span v-else>概念/实体</span>
              </template>
            </v-switch>
            <v-chip-group v-model="selectedLabelIndex" column>
              <v-chip
                v-for="(item, index) in labelTypes"
                :key="item.id"
                v-shortkey="[item.suffixKey]"
                :color="item.backgroundColor"
                filter
                :text-color="$contrastColor(item.backgroundColor)"
                @shortkey="selectedLabelIndex = index"
              >
                {{ item.text }}
                <v-avatar
                  v-if="item.suffixKey"
                  right
                  color="white"
                  class="black--text font-weight-bold"
                >
                  {{ item.suffixKey }}
                </v-avatar>
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <image-define :image-url="doc.fileUrl" @loaded="imageLoaded" />
        </v-card>
      </div>
    </template>
  </component>
  </div>
</template>

<script>
import _, { update } from 'lodash'
import { mapGetters } from 'vuex'
import LayoutCaption from '@/components/tasks/layout/LayoutCaption'
import LayoutMeta from '~/components/tasks/layout/LayoutMeta'
import LayoutText from '@/components/tasks/layout/LayoutText'
import LayoutImage from '~/components/tasks/layout/LayoutImage'
import ListMetadata from '@/components/tasks/metadata/ListMetadata'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import EntityEditor from '@/components/tasks/sequenceLabeling/EntityEditor.vue'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'
import MetaForm from '~/components/tasks/integrated/MetaForm.vue'
import ImageDefine from '~/components/tasks/integrated/ImageDefine.vue'
import BaseImage from '~/components/tasks/image/BaseImage.vue'
import ImageCaption from '~/components/tasks/integrated/ImageCaption.vue'
import { Step, stepList } from '~/domain/models/project/integrated/step'

export default {
  components: {
    AnnotationProgress,
    EntityEditor,
    MetaForm,
    ImageDefine,
    BaseImage,
    ImageCaption,
    LayoutMeta,
    LayoutCaption,
    LayoutImage,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile
  },

  layout: 'workspace',

  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  },

  data() {
    return {
      annotations: [],
      docs: [],
      spanTypes: [],
      relations: [],
      relationTypes: [],
      project: {},
      enableAutoLabeling: false,
      enableStepper: false,
      rtl: false,
      selectedLabelIndex: null,
      progress: {},
      relationMode: false,
      // 集成式标注进度展示
      Step,
      steps: stepList,
      stepIdx: 1,
      stepConfirmed: new Array(stepList).fill(false)
    }
  },

  async fetch() { // SSR 异步数据获取，在页面渲染之前
    this.docs = await this.$services.example.fetchOne(
      this.projectId,
      this.$route.query.page,
      this.$route.query.q,
      this.$route.query.isChecked
    )
    const doc = this.docs.items[0]
    if(doc !== undefined) {
      doc.fileUrl = "http://127.0.0.1:8000/media/JN2Csq9tHShPaUBXQaxtCb/jT4F9aC8HhYMLqnZHGazo7"
    }
    
    if (this.enableAutoLabeling && !doc.isConfirmed) {
      await this.autoLabel(doc.id)
    }
    await this.list(doc.id)
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUsername', 'getUserId']),
    ...mapGetters('config', ['isRTL']),

    currentComponent() {
      switch (stepList[this.stepIdx - 1]) {
        case Step.Definition:
          return LayoutMeta
        case Step.Caption:
          return LayoutImage
        case Step.Label:
          return LayoutCaption
        default:
          return LayoutText;
      }
    },

    enableSidebar() {
      if(stepList[this.stepIdx - 1] !== Step.Caption) {
        return true
      } else {
        return false
      }
    },

    shortKeys() {
      return Object.fromEntries(this.spanTypes.map((item) => [item.id, [item.suffixKey]]))
    },

    projectId() {
      return this.$route.params.id
    },

    doc() {
      if (_.isEmpty(this.docs) || this.docs.items.length === 0) {
        return {}
      } else {
        return this.docs.items[0]
      }
    },

    selectedLabel() {
      if (Number.isInteger(this.selectedLabelIndex)) {
        if (this.relationMode) {
          return this.relationTypes[this.selectedLabelIndex]
        } else {
          return this.spanTypes[this.selectedLabelIndex]
        }
      } else {
        return null
      }
    },

    useRelationLabeling() {
      return !!this.project.useRelation
    },

    labelTypes() {
      if (this.relationMode) {
        return this.relationTypes
      } else {
        return this.spanTypes
      }
    }
  },

  watch: {
    '$route.query': '$fetch',
    enableAutoLabeling(val) {
      if (val) {
        this.list(this.doc.id)
      }
    },
    annotations(newVal, oldVal) {
      this.checkAndUpdateLabelStep(newVal.length, oldVal.length)
    },
    relations(oldVal, newVal) {
      this.checkAndUpdateLabelStep(newVal.length, oldVal.length)
    }
  },

  async created() {
    this.spanTypes = await this.$services.spanType.list(this.projectId)
    this.relationTypes = await this.$services.relationType.list(this.projectId)
    this.project = await this.$services.project.findById(this.projectId)
    this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
  },

  methods: {
    async maybeFetchSpanTypes(annotations) {
      const labelIds = new Set(this.spanTypes.map((label) => label.id))
      if (annotations.some((item) => !labelIds.has(item.label))) {
        this.spanTypes = await this.$services.spanType.list(this.projectId)
      }
    },

    async list(docId) {
      // const stepConfirmed = await this.$services.integrated.getStepStatus(this.projectId, docId);
      // this.stepConfirmed = stepConfirmed
      const annotations = await this.$services.sequenceLabeling.list(this.projectId, docId)
      const relations = await this.$services.sequenceLabeling.listRelations(this.projectId, docId)
      // In colab mode, if someone add a new label and annotate data
      // with the label during your work, it occurs exception
      // because there is no corresponding label.
      await this.maybeFetchSpanTypes(annotations)
      this.annotations = annotations
      this.relations = relations
    },

    async deleteSpan(id) {
      await this.$services.sequenceLabeling.delete(this.projectId, this.doc.id, id)
      await this.list(this.doc.id)
    },

    async addSpan(startOffset, endOffset, labelId) {
      await this.$services.sequenceLabeling.create(
        this.projectId,
        this.doc.id,
        labelId,
        startOffset,
        endOffset
      )
      await this.list(this.doc.id)
    },

    async updateSpan(annotationId, labelId) {
      await this.$services.sequenceLabeling.changeLabel(
        this.projectId,
        this.doc.id,
        annotationId,
        labelId
      )
      await this.list(this.doc.id)
    },

    async addRelation(fromId, toId, typeId) {
      await this.$services.sequenceLabeling.createRelation(
        this.projectId,
        this.doc.id,
        fromId,
        toId,
        typeId
      )
      await this.list(this.doc.id)
    },

    async updateRelation(relationId, typeId) {
      await this.$services.sequenceLabeling.updateRelation(
        this.projectId,
        this.doc.id,
        relationId,
        typeId
      )
      await this.list(this.doc.id)
    },

    async deleteRelation(relationId) {
      await this.$services.sequenceLabeling.deleteRelation(this.projectId, this.doc.id, relationId)
      await this.list(this.doc.id)
    },

    async clear() {
      await this.$services.sequenceLabeling.clear(this.projectId, this.doc.id)
      await this.list(this.doc.id)
    },

    async autoLabel(docId) {
      try {
        await this.$services.sequenceLabeling.autoLabel(this.projectId, docId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },

    async updateProgress() {
      this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
    },

    async confirm() {
      await this.$services.example.confirm(this.projectId, this.doc.id)
      await this.$fetch()
      this.updateProgress()
    },

    changeSelectedLabel(event) {
      this.selectedLabelIndex = this.spanTypes.findIndex((item) => item.suffixKey === event.srcKey)
    },

    onStepChange(newStepIdx) {
      this.stepIdx = newStepIdx
      console.log("stepInx updated: " + newStepIdx)
    },

    imageLoaded(width, height) {
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
    },
    updateStep(step, b) {
      const stepConfirmed = [...this.stepConfirmed]
      switch (step) {
        case Step.Definition:
          stepConfirmed[0] = b
          break
        case Step.Caption:
          stepConfirmed[1] = b
          break
        case Step.Label:
          stepConfirmed[2] = b
          break
        default:
          return
      }
      this.stepConfirmed = stepConfirmed
      // this.$services.integrated.updateStepStatus(this.projectId, this.doc.id, this.stepConfirmed)
    },
    checkAndUpdateLabelStep(newLen, oldLen) {
      if(!this.stepConfirmed[2] && oldLen === 0 && newLen > 0) {
        this.updateStep(Step.Label, true)
      } else if(this.stepConfirmed[2] && oldLen > 0 && newLen === 0
        && this.annotations.length === 0 && this.relations.length === 0
      ) {
        this.updateStep(Step.Label, false)
      }
    }
  }
}
</script>

<style scoped>
.image-show-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.annotation-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: 'Roboto', sans-serif !important;
  opacity: 0.6;
}

.sidebar-fixed {
  position: fixed;
  right: 0;  /* 右侧固定 */
  width: 450px; /* 设置宽度 */
  max-height: calc(100vh - 140px); /* 设置最大高度，防止超出页面 */
  overflow-y: auto; /* 添加垂直滚动 */
  z-index: 1000; /* 确保其位于其他元素之上 */
  padding: 0 5px;
}
</style>
