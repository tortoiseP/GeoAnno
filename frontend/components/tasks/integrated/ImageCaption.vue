<template>
  <div class="editor-wrapper">
    <editor
      ref="toastuiEditor"
      style="height: 100%;"
      :initial-value="caption.text"
      :options="editorOptions"
      preview-style="vertical"
      @change="updateCaption"
    />
    <v-snackbar
      v-model="snackbar.visiable"
      :timeout="snackbar.timeout"
      bottom
    >
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar.visiable = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import _ from 'lodash'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import { Editor } from '@toast-ui/vue-editor'
import '@/assets/style/editor.css'
import { Step } from '~/domain/models/project/integrated/step'

export default {
  components: {
    Editor
  },

  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  props: {
    exampleId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      editorOptions: {
        language: this.$t('toastui.localeCode')
      },
      projectId: "",
      caption: {
        "exampleId": "",
        "imageUrl": "",
        "text": ""
      },
      editorContent: "", // Markdown内容
      mounted: false,
      snackbar: {
        visiable: false,
        text: "",
        timeout: 2000
      }
    }
  },

  watch: {
    'caption.text' (newText, oldText) {
      if (newText.length > 0 && oldText.length === 0) {
        this.$emit('reverse', Step.Caption, true);
      } else if (newText.length === 0 && oldText.length > 0) {
        this.$emit('reverse', Step.Caption, false);
      }
    }
  },

  async mounted() {
    this.projectId = this.$route.params.id
    try {
      this.caption = await this.$services.integrated.getCaption(
        parseInt(this.projectId),
        parseInt(this.exampleId)
      )
    } catch (error) {
      this.snackbar.visiable = true
      this.snackbar.text = "数据获取异常"
      console.log(error);
    }
    // 拼接Markdown内容
    this.editorContent = this.createMarkdownContent(this.caption)
    this.$refs.toastuiEditor.invoke('setMarkdown', this.editorContent)
    this.mounted = true
  },

  methods: {
    createMarkdownContent(caption) {
      // 拼接Markdown格式
      const imageMarkdown = `![Logo](${caption.imageUrl})`  // 图像部分
      const textMarkdown = caption.text  // 文本部分
      return `* * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *
${imageMarkdown}
* * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *  * * *
${textMarkdown}`
    },
    updateCaption: _.debounce(function () {
      if (this.mounted) {
        const markdown = this.$refs.toastuiEditor.invoke('getMarkdown')
        this.caption.text = markdown.split("\n").slice(3).join("\n") 
        this.$services.integrated.updateCaption(
          parseInt(this.projectId),
          parseInt(this.exampleId),
          this.caption.text
        )
      }
    }, 1000)
  }
}
</script>

<style>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* 父容器高度设为 100vh - header */
  height: calc(100vh - 140px);  
}

.tui-editor {
  flex-grow: 1; /* 使编辑器组件占满剩余空间 */
  height: 100%; /* 编辑器高度填充父容器 */
}

.tui-editor-contents {
  height: 100% !important; /* 确保编辑器内容区也占满容器 */
}
.toastuiEditor{
  height: 100%;
}
.te-md-container .CodeMirror,
.tui-editor-contents {
  font-size: 20px;
}
</style>
