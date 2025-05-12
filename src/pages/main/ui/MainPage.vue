<script setup lang="ts">
import F1Widget from "../widgets/F1Widget.vue";
import F2Widget from "../widgets/F2Widget.vue";
import F3Widget from "../widgets/F3Widget.vue";
import F4Widget from "../widgets/F4Widget.vue";
import F5Widget from "../widgets/F5Widget.vue";
import F6Widget from "../widgets/F6Widget.vue";
import UserRegionInfo from "../../../shared/ui/UserRegionInfo/UserRegionInfo.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="grid grid-cols-3 p-1 gap-1 flex-grow">
      <F1Widget v-if="route.query.blocks ? route.query.blocks.includes('1') : true" />
      <F2Widget v-if="route.query.blocks ? route.query.blocks.includes('2') : true" />
      <F3Widget v-if="route.query.blocks ? route.query.blocks.includes('3') : true" />
      <F4Widget v-if="route.query.blocks ? route.query.blocks.includes('4') : true" />
      <F5Widget v-if="route.query.blocks ? route.query.blocks.includes('5') : true" /> 
      <!-- <F6Widget v-if="route.query.blocks ? route.query.blocks.includes('6') : true" /> -->
    </div>
  </div>
</template>
