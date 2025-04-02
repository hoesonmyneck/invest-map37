<template>
  <BaseCard title="Инвестиционные проекты" number="A1" class="text-white" :show-close-button="!!currentOtrasl" @close="() => {
    if (currentProject) {
      aStore.setCurrentProject(null)
      aStore.setCurrentRaion(null)
      return;
    }
    aStore.setCurrentOtrasl(null)
  }">
    <div class="flex gap-1 text-xs p-1">
      <p class="h-6 px-4 flex items-center border cursor-pointer" @click="aStore.setCurrentLabel(0)"
        :class="`${currentLabel === 0 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        Общее</p>
      <p class="h-6 px-4 flex items-center border cursor-pointer" @click="aStore.setCurrentLabel(3)"
        :class="`${currentLabel === 3 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        К-Инвест</p>
      
     
      <div class="relative dropdown-container w-[170px]">
        <p class="h-6 px-4 flex items-center justify-around border cursor-pointer select-none" @click="toggleDropdown"
          :class="`${[1, 2, 4, 5].includes(currentLabel) ? 'border-[#3090e8]' : 'border-gray-600'}`">
          {{ getSelectedLabel + (isDropdownOpen ? ' ▲' : ' ▼') }}
        </p>
        <transition name="dropdown">
          <div v-if="isDropdownOpen" class="absolute left-0 mt-1 bg-gray-800 border border-gray-600 rounded w-full z-10 shadow-lg overflow-hidden">
            <p class="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150" 
               :class="{'bg-gray-700': currentLabel === 1}"
               @click="selectLabel(1)">МинПром</p>
            <p class="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150" 
               :class="{'bg-gray-700': currentLabel === 4}"
               @click="selectLabel(4)">Минэнерго (зеленая энергетика)</p>
            <p class="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150" 
               :class="{'bg-gray-700': currentLabel === 5}"
               @click="selectLabel(5)">Минэнерго</p>
            <p class="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150" 
               :class="{'bg-gray-700': currentLabel === 2}"
               @click="selectLabel(2)">СГП</p>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="text-white grid grid-cols-[200px_1fr] gap-2">
      <div class="relative h-max">
        <highcharts class="hc map w-full" :options="chartOptions" />
        <div class="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p class="text-2xl">{{ a1FilterByOtrasl.length }}</p>
          <p class="text-gray-500 text-xs">Инвестпроекты</p>
        </div>
      </div>

      <div class="overflow-y-scroll h-[200px]">
        <ul>
          <li class="flex text-[10px] items-center gap-2 mb-1 text-xs justify-between min-w-[200px]" v-for="item in Object.values(list).sort(
            (a, b) => b.count - a.count
          )" :key="item.otrasl">
            <div class="flex gap-2 items-center cursor-pointer" @click="aStore.setCurrentOtrasl(item.otrasl)">
              <p class="min-w-4 w-4 h-4 rounded-full" :style="{ backgroundColor: a1FilterByOtrasl.color }"></p>
              <p>{{ item.otrasl }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <p>{{ item.count }}</p>
              <p class="bg-black p-1 rounded px-2 w-[50px] text-center">
                {{ Numeral((item.count / a1FilterByOtrasl.length) * 100) }}%
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </BaseCard>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { randomColorGenerate } from "../../../shared/helpers/randomColorGenerate";
import { Numeral } from "../../../shared/helpers/numeral";
import { useAStore } from "../store";
import { storeToRefs } from "pinia";

const aStore = useAStore();
const { a1FilterByOtrasl, currentLabel, currentOtrasl, currentProject } = storeToRefs(aStore);


const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectLabel = (label: number) => {
  aStore.setCurrentLabel(label);
  isDropdownOpen.value = false;
};


const getSelectedLabel = computed(() => {
  if (currentLabel.value === 1) return 'МинПром';
  if (currentLabel.value === 4) return 'Минэнерго (зеленая энергетика)';
  if (currentLabel.value === 5) return 'Минэнерго';
  if (currentLabel.value === 2) return 'СГП';
  return 'Выбрать';
});


const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isDropdownOpen.value && !target.closest('.dropdown-container')) {
    isDropdownOpen.value = false;
  }
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const list = computed(() =>
  a1FilterByOtrasl.value.reduce((acc, curr) => {
    if (!acc[curr.otrasl]) {
      acc[curr.otrasl] = { ...curr, count: 1, color: randomColorGenerate() };
      return acc;
    }

    acc[curr.otrasl].count += 1;
    acc[curr.otrasl].count_inv_project += curr.count_inv_project;
    return acc;
  }, {})
);

const chartOptions = computed(() => ({
  chart: {
    type: "pie",
    custom: {},
    backgroundColor: "transparent",
    height: "100%",
  },
  title: {
    text: "",
  },
  tooltip: {
    pointFormat: "<b>{point.y:.0f}</b>",
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      cursor: "pointer",
      borderRadius: 0,
      dataLabels: [
        {
          enabled: false,
        },
      ],
      showInLegend: true,
    },
  },
  series: [
    {
      name: "Проекты",
      colorByPoint: true,
      innerSize: "85%",
      data: Object.values(list.value).map((e) => ({
        name: e.otrasl,
        y: e.count,
        color: e.color,
      })),
    },
  ],
}));
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
