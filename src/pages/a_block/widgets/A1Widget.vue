<template>
  <BaseCard title="Инвестиционные проекты" number="A" class="text-white">
    <div class="flex gap-1 text-xs p-1">
      <p class="h-6 px-4 flex items-center border cursor-pointer" @click="aStore.setCurrentLabel(0)"
        :class="`${currentLabel === 0 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        Общее</p>
      <p class="h-6 px-4 flex items-center border cursor-pointer" @click="aStore.setCurrentLabel(3)"
        :class="`${currentLabel === 3 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        К-Инвест</p>
      <p class="h-6 px-4 flex items-center border cursor-pointer" @click="aStore.setCurrentLabel(1)"
        :class="`${currentLabel === 1 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        МинПром</p>
      <p class="h-6 px-4 flex items-center border cursor-pointer"
        :class="`${currentLabel === 2 ? 'border-[#3090e8]' : 'border-gray-600'}`">
        СГП</p>
    </div>
    <div class="text-white grid grid-cols-[200px_1fr] gap-2">
      <div class="relative h-max">
        <highcharts class="hc map w-full" :options="chartOptions" />
        <div class="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p class="text-2xl">{{ a1Filter.length }}</p>
          <p class="text-gray-500 text-xs">Инвестпроекты</p>
        </div>
      </div>

      <div class="overflow-y-scroll h-[calc(50vh-65px)]">
        <ul>
          <li class="flex text-[10px] items-center gap-2 mb-1 text-xs justify-between min-w-[200px]" v-for="item in Object.values(list).sort(
            (a, b) => b.count - a.count
          )" :key="item.otrasl">
            <div class="flex gap-2 items-center">
              <p class="min-w-4 w-4 h-4 rounded-full" :style="{ backgroundColor: a1Filter.color }"></p>
              <p>{{ item.otrasl }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <p>{{ item.count }}</p>
              <p class="bg-black p-1 rounded px-2 w-[40px] text-center">
                {{ Numeral((item.count / a1Filter.length) * 100) }}%
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </BaseCard>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { randomColorGenerate } from "../../../shared/helpers/randomColorGenerate";
import { Numeral } from "../../../shared/helpers/numeral";
import { useAStore } from "../store";
import { storeToRefs } from "pinia";

const aStore = useAStore();
const { a1Filter, currentLabel } = storeToRefs(aStore);

const list = computed(() =>
  a1Filter.value.reduce((acc, curr) => {
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
