<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <BaseCard title="" number="" :show-close-button="true" @close="$emit('close')" class="h-screen">
      <div class="flex gap-2">
        <div class="btn mini text-white" :class="{ 'bg-blue-500 active': activeTab === 1 }" @click="activeTab = 1">
          Рынок труда
        </div>
        <div class="btn mini text-white" :class="{ 'bg-blue-500 active': activeTab === 2 }" @click="activeTab = 2">
          Программы
        </div>
        <a-select v-if="activeTab === 2" v-model:value="currentYear" class="w-[80px]">
          <a-select-option v-for="year in ['Все', 2021, 2022, 2023, 2024]" :key="year" :value="year">
            {{ year }}
          </a-select-option>
        </a-select>
      </div>

      <BTab1 v-if="activeTab === 1" :active-tab="activeTab" />
      <BTab2 v-if="activeTab === 2" :active-tab="activeTab" />
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import BTab1 from '../../../b_block/BTab1/ui/BTab1.vue';
import BaseCard from '../../../../shared/ui/BaseCard/BaseCard.vue';
import BTab2 from '../../../b_block/BTab2/ui/BTab2.vue';
import { storeToRefs } from 'pinia';
import { useProgramStore } from '../../../b_block/BTab2/store';
const activeTab = ref(1);

const { currentYear } = storeToRefs(useProgramStore());

function useBStore(): any {
  throw new Error('Function not implemented.');
}
</script>

<style scoped lang="scss"></style>
