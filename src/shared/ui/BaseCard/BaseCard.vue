<template>
  <div :key="cardId" class="p-1 bg-[#1C1F27] w-full h-full rounded">
    <div class="head flex justify-between bg-[#252A36] p-2 rounded w-full">
      <div class="flex text-xs text-white items-center">
        <p class="border-r mr-2 pr-2 border-[#3B3F4B]">{{ number }}</p>
        <p>{{ title }}</p>
      </div>
      <div class="flex items-center text-white text-xs gap-4 pr-2">
        <slot name="actions" />
        <ExpandOutlined v-if="showOpenButton" @click="emit('open')" class="cursor-pointer" />
        <CloseOutlined v-if="showCloseButton" @click="emit('close')" class="cursor-pointer" />
      </div>
    </div>
    <div class="p-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { generateUniqueID } from "../../helpers/generateUniqueId";
import type { Props } from "./types";
import { CloseOutlined, ExpandOutlined } from "@ant-design/icons-vue";

const cardId = ref(generateUniqueID("card"));

const emit = defineEmits<{
  (e: "close"): void;
  (e: "open"): void;
}>();

withDefaults(defineProps<Partial<Props>>(), {
  title: "",
  number: "",
  showCloseButton: false,
  onClose: () => {},
  showOpenButton: false,
  onOpen: () => {},
});
</script>
