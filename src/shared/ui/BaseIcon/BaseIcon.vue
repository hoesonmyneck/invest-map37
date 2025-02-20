<template>
  <Component :is="iconElement" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const props = defineProps<{
  name: string;
}>();

const iconElement = defineAsyncComponent(
  () => import(`./icons/${props.name}.vue`)
);
</script>
