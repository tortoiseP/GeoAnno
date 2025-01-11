<template>
  <v-toolbar class="toolbar-control" dense flat>
    <v-row class="toolbar-control-row" no-gutters>
      <v-btn-toggle>
        <button-review
          v-if="steps[stepIdx - 1] === Step.Definition"
          :is-reviewd="stepConfirmed[stepIdx - 1]"
          @click:review="$emit('click:review', Step.Definition)" />
          <button-review
          v-else-if="steps[stepIdx - 1] === Step.Caption"
          :is-reviewd="stepConfirmed[stepIdx - 1]"
          @click:review="$emit('click:review', Step.Caption)"/>
          <button-review
          v-else-if="steps[stepIdx - 1] === Step.Label"
          :is-reviewd="stepConfirmed[stepIdx - 1]"
          @click:review="$emit('click:review', Step.Label)"/>

        <button-filter :value="filterOption" @click:filter="changeFilter" />

        <button-guideline @click:guideline="dialogGuideline = true" />
        <v-dialog v-model="dialogGuideline">
          <form-guideline :guideline-text="guidelineText" @click:close="dialogGuideline = false" />
        </v-dialog>

        <button-comment @click:comment="dialogComment = true" />
        <v-dialog v-model="dialogComment">
          <form-comment :example-id="docId" @click:cancel="dialogComment = false" />
        </v-dialog>

        <button-auto-labeling
          v-if="steps[stepIdx - 1] === Step.Label"
          @click:auto="dialogAutoLabeling = true" />
        <v-dialog v-model="dialogAutoLabeling">
          <form-auto-labeling
            :is-enabled="enableAutoLabeling"
            :error-message="errorMessage"
            @click:cancel="dialogAutoLabeling = false"
            @input="updateAutoLabeling"
          />
        </v-dialog>

        <button-clear 
          v-if="steps[stepIdx - 1] === Step.Label"
          @click:clear="dialogClear = true" />
        <v-dialog v-model="dialogClear">
          <form-clear-label
            @click:ok="
              $emit('click:clear-label')
              dialogClear = false
            "
            @click:cancel="dialogClear = false"
          />
        </v-dialog>

        <button-keyboard-shortcut @click:open="dialogShortcut = true" />
        <v-dialog v-model="dialogShortcut">
          <form-keyboard-shortcut @click:close="dialogShortcut = false" />
        </v-dialog>
      </v-btn-toggle>
      <v-spacer />
      <!-- <v-spacer /> -->
      <template v-if="enableStepper" >
        <v-stepper class="toolbar-step" :value="stepIdx" @change="handleStepChange">
          <v-stepper-header class="toolbar-step-header">
            <v-stepper-step
              class="toolbar-step-header-step"
              step="1"
              :complete="stepConfirmed[0]"
              :color="stepConfirmed[0] ? 'success' : 'primary'"
              edit-icon="mdi-account-check"
              editable>
              图像信息校对
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              class="toolbar-step-header-step"
              step="2"
              :complete="stepConfirmed[1]"
              :color="stepConfirmed[1] ? 'success' : 'primary'"
              edit-icon="mdi-account-check"
              editable>
              图像文本描述
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              class="toolbar-step-header-step"
              step="3"
              :complete="stepConfirmed[2]"
              :color="stepConfirmed[2] ? 'success' : 'primary'"
              edit-icon="mdi-account-check"
              editable>
              文本信息标注
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </template>
      <slot />
      <v-spacer />
      <button-pagination
        :value="page"
        :total="total"
        @click:prev="updatePage(page - 1)"
        @click:next="updatePage(page + 1)"
        @click:first="updatePage(1)"
        @click:last="updatePage(total)"
        @click:jump="updatePage($event)"
      />
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import ButtonAutoLabeling from './buttons/ButtonAutoLabeling.vue'
import ButtonClear from './buttons/ButtonClear.vue'
import ButtonComment from './buttons/ButtonComment.vue'
import ButtonFilter from './buttons/ButtonFilter.vue'
import ButtonGuideline from './buttons/ButtonGuideline.vue'
import ButtonPagination from './buttons/ButtonPagination.vue'
import ButtonReview from './buttons/ButtonReview.vue'
import ButtonKeyboardShortcut from './buttons/ButtonKeyboardShortcut.vue'
import FormAutoLabeling from './forms/FormAutoLabeling.vue'
import FormClearLabel from './forms/FormClearLabel.vue'
import FormComment from './forms/FormComment.vue'
import FormGuideline from './forms/FormGuideline.vue'
import FormKeyboardShortcut from './forms/FormKeyboardShortcut.vue'
import { Step, stepList } from '~/domain/models/project/integrated/step'


export default Vue.extend({
  components: {
    ButtonAutoLabeling,
    ButtonClear,
    ButtonComment,
    ButtonFilter,
    ButtonGuideline,
    ButtonKeyboardShortcut,
    ButtonPagination,
    ButtonReview,
    FormAutoLabeling,
    FormClearLabel,
    FormComment,
    FormGuideline,
    FormKeyboardShortcut
  },

  props: {
    docId: {
      type: Number,
      required: true
    },
    enableAutoLabeling: {
      type: Boolean,
      default: false,
      required: true
    },
    guidelineText: {
      type: String,
      default: '',
      required: true
    },
    total: {
      type: Number,
      default: 1
    },
    enableStepper: {
      type: Boolean,
      default: false,
      required: false
    },
    stepIdx: {
      type: Number,
      default: 1
    },
    steps: {
      type: Array,
      default: stepList
    },
    stepConfirmed: {
      type: Array,
      default: () => {
        return [false, false, false]
      }
    }
  },

  data() {
    return {
      dialogAutoLabeling: false,
      dialogClear: false,
      dialogComment: false,
      dialogGuideline: false,
      dialogShortcut: false,
      Step,
      errorMessage: ''
    }
  },

  computed: {
    page(): number {
      // @ts-ignore
      return parseInt(this.$route.query.page, 10)
    },
    filterOption(): string {
      // @ts-ignore
      return this.$route.query.isChecked
    }
  },

  methods: {
    updatePage(page: number) {
      this.$router.push({
        query: {
          page: page.toString(),
          isChecked: this.filterOption,
          q: this.$route.query.q
        }
      })
      this.$emit('page-change')
    },

    changeFilter(isChecked: string) {
      this.$router.push({
        query: {
          page: '1',
          isChecked,
          q: this.$route.query.q
        }
      })
    },

    updateAutoLabeling(isEnable: boolean) {
      if (isEnable) {
        this.$emit('update:enable-auto-labeling', true)
      } else {
        this.$emit('update:enable-auto-labeling', false)
      }
    },

    handleStepChange(newStepIdx: any) {
      this.$emit('step-change', parseInt(newStepIdx))
    }
  }
})
</script>

<style scoped>
.toolbar-control {
  position: sticky;
  top: 68px;
  z-index: 100;
}

.toolbar-control >>> .v-toolbar__content {
  padding: 0px !important;
}

::v-deep .v-dialog {
  width: 800px;
}

.toolbar-control-row {
  align-items: center;
}

.toolbar-step {
  /* position: sticky;
  top: 70px; */
  z-index: 100;
  height: 42px;
  margin: 0px 25px;
  flex-grow: 1;
}

.toolbar-step-header {
  height: 42px;
}

.toolbar-step-header-step{
  padding: 5px 24px;
}



.v-btn-toggle {
  border-left: 1px solid #ccc;  /* 设置左侧边框 */
}

.v-application--is-ltr .v-btn-toggle > .v-btn.v-btn:not(:first-child) {
  border-left-width: 0;  /* 隐藏除第一个按钮外其他按钮的左边框 */
}

.v-btn-toggle > .v-btn:first-child {
  border-left-width: 1px !important;  /* 确保第一个按钮的左边框始终可见 */
}
</style>
