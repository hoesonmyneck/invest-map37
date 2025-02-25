<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <APage @close="$emit('close')" />
  </a-modal>
</template>

<script setup lang="ts">
import APage from "../../../a_block/ui/APage.vue";
defineEmits(['close'])
</script>

<style scoped lang="scss"></style>
