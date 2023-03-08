<template>
  <TiptapVuetify
    v-model="innerValue"
    placeholder="Ответ"
    :card-props="{ outlined: true }"
    :extensions="extensions" />
</template>

<script>
import {
  TiptapVuetify,
  History,
  Bold,
  Italic,
  Strike,
  Underline,
  Heading,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  Link,
} from 'tiptap-vuetify';

export default {
  name: 'RichEditor',

  components: {
    TiptapVuetify,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      innerValue: null,

      extensions: [
        History,
        Bold,
        Italic,
        Underline,
        Strike,
        [
          Heading,
          {
            options: {
              levels: [3, 4, 5, 6],
            },
          },
        ],
        ListItem,
        BulletList,
        OrderedList,
        Blockquote,
        Link,
      ],
    };
  },

  watch: {
    innerValue(value) {
      this.$emit('input', value);
    },

    value(value) {
      this.innerValue = value;
    },
  },

  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>

<style lang="scss">
.tiptap-vuetify-editor .ProseMirror {
  min-height: 150px !important;
  margin: 20px 10px !important;
}
</style>
