<template>
  <div class="text-white">
    <BaseCard
      title="«АУЫЛ-ЕЛ БЕСІГІ»"
      number="A4"
      :show-close-button="false"
      @close="$emit('close')"
    >
      <div class="text-white overflow-x-scroll h-[calc(20vh)] w-full" ref="scrollContainer" @scroll="handleScroll">
        <div
          class="header-grid-text items-end text-xs w-full"
          style="margin-bottom: 0; padding: 0 10px"
        >
          <p>Наименование проекта</p>
          <p>Стоимость</p>
          <p>Организация</p>
          <p>Дата начала</p>
          <p>Дата окончания</p>
          <p>План раб</p>
          <p>Факт раб</p>
          <p>%</p>
        </div>
        <div
          class="header-grid-text3 w-full border-b border-gray-700 text-gray-400 mb-2"
        >
          <p>{{ Numeral(sortedItems.length) }}</p>
          <p>{{ Numeral(totalSumm) }}</p>
        </div>
        <div class="">
          <div
            v-for="(l, index) in displayedItems"
            :key="Math.random()"
            class="header-grid-text3 text-xs"
            style="margin-bottom: 0; padding: 2px 5px"
            :id="`item-${index}`"
            :ref="index === lastVisibleItemIndex ? setLastVisibleItemRef : undefined"
          >
            <a-tooltip placement="left" :title="l.project_name">
              <p class="block truncate">{{ l.project_name }}</p>
            </a-tooltip>
            <p class="block">{{ Numeral(l.project_price) }}</p>
            <a-tooltip placement="left" :title="l.name">
              <p class="block truncate">{{ l.name }}</p>
            </a-tooltip>
            <p class="block">{{ l.start_date }}</p>
            <p class="block">{{ l.end_date }}</p>
            <p class="block">{{ l.plan_rab }}</p>
            <p class="block">{{ l.fact_rab }}</p>
            <div
              class="bg-[#252a36] relative cell-center h-6 w-full flex items-center justify-center"
            >
              <div
                class="absolute top-0 left-0 h-full rounded w-full"
                :style="{
                  background: getColorFromGradient(l.percentage_change ?? 0),
                  width: `${
                    l.percentage_change > 100 ? 100 : l.percentage_change ?? 0
                  }%`,
                }"
              ></div>
              <p class="absolute text-[12px]">
                {{
                  `${Numeral(
                    l.percentage_change > 100 ? 100 : l.percentage_change ?? 0
                  )}%`
                }}
              </p>
            </div>
          </div>
          
          <div 
            v-if="displayedItems.length < sortedItems.length" 
            class="text-center py-4"
          >
            <a-button
              type="primary"
              @click="loadMore"
              :loading="loading"
              class="bg-blue-600"
            >
              Загрузить еще 500
            </a-button>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch, nextTick, onUpdated } from "vue";
import { getAulBesigi } from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";

const programStore = useProgramStore();
const { aulBesigiFilter } = storeToRefs(programStore);

const totalSumm = computed(() =>
  aulBesigiFilter.value.reduce((acc, curr) => acc + curr.project_price, 0)
);

const initialItemsCount = 200;  
const itemsPerPage = 500;      
const currentPage = ref(0);     
const loading = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);
const lastVisibleItemIndex = ref<number | null>(null);
const lastVisibleItemElement = ref<HTMLElement | null>(null);

const sortedItems = computed(() => 
  aulBesigiFilter.value.sort((a, b) => b.percentage_change - a.percentage_change)
);

const displayedItems = computed(() => {
  if (currentPage.value === 0) {
    return sortedItems.value.slice(0, initialItemsCount);
  } else {
    return sortedItems.value.slice(0, initialItemsCount + (currentPage.value * itemsPerPage));
  }
});

function setLastVisibleItemRef(el: any) {
  if (el) {
    lastVisibleItemElement.value = el;
  }
}

function loadMore() {
  if (loading.value) return;
  
  loading.value = true;
  
  if (currentPage.value === 0) {
    lastVisibleItemIndex.value = initialItemsCount - 1;
  } else {
    lastVisibleItemIndex.value = initialItemsCount + (currentPage.value * itemsPerPage) - 1;
  }
  
  setTimeout(() => {
    currentPage.value += 1;
    
    nextTick(() => {
      if (lastVisibleItemElement.value) {
        lastVisibleItemElement.value.scrollIntoView({ block: 'start' });
      }
      loading.value = false;
    });
  }, 300);
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
  const shouldLoadMore = isNearBottom && 
                         displayedItems.value.length < sortedItems.value.length && 
                         !loading.value;
  
  if (shouldLoadMore && !document.querySelector('.load-more-active')) {
    loadMore();
  }
}

watch(() => aulBesigiFilter.value, () => {
  currentPage.value = 0;
  lastVisibleItemIndex.value = null;
  lastVisibleItemElement.value = null;
}, { deep: true });
</script>

<style scoped lang="scss">
.block {
  padding: 4px 12px;
  height: max-content;
  background: #252a36;
  border-radius: 6px;
}

.header-grid-text3 {
  display: grid;
  grid-gap: 4px;
  padding: 8px;

  grid-template-columns: 170px 140px 170px 100px 80px 60px 100px 50px;
}

.header-grid-text {
  display: grid;
  grid-gap: 4px;
  padding: 8px;
  grid-template-columns: 170px 140px 170px 100px 80px 60px 100px 50px;
}
</style>
