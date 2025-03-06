<template>
  <div class="text-white">
    <BaseCard
      title="«СЕРПIН»"
      number="A1"
      :show-close-button="false"
      @close="$emit('close')"
    >
      <div
        class="grid grid-cols-[200px_1fr] gap-2 items-start p-3 px-5 relative"
      >
        <div class="relative flex items-center justify-center">
          <highcharts
            :options="chartSerpin"
            class="h-[170px] m-auto"
          ></highcharts>
          <p class="absolute text-2xl font-bold">
            {{ Numeral((ispolnayet / total) * 100) }}%
          </p>
        </div>
        <ul class="">
          <li
            class="grid grid-cols-[40px_1fr_80px_60px] w-full mb-2 pb-2 border-b border-gray-700"
          >
            <img class="w-4" src="/images/a_block/img_1.png" alt="" />
            <p class="text-[10px]">Участники</p>
            <p class="text-[10px]">{{ Numeral(total) }}</p>
            <p class="text-[10px] text-end">100%</p>
          </li>

          <li
            v-for="(l, i) in listSerpin"
            class="grid text-gray-400 grid-cols-[40px_1fr_80px_60px] w-full mb-2"
          >
            <img class="w-4" :src="`/images/a_block/img_${i + 2}.png`" alt="" />
            <p class="text-[10px]">{{ l.name }}</p>
            <p class="text-[10px]">{{ l.count }}</p>
            <p
              class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center"
            >
              {{ Numeral(l.percent) }}%
            </p>
          </li>
        </ul>
      </div>
    </BaseCard>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { chartOptions } from "../helpers/chartOption";

const programStore = useProgramStore();
const { serpinFilter } = storeToRefs(programStore);

const rabotaet = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.rabotaet || 0), 0)
);
const bezrabot = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.bezrabot || 0), 0)
);
const est_trud = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.est_trud || 0), 0)
);
const bez_trud = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.bez_trud || 0), 0)
);
const ispolnayet = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.ispolnayet || 0), 0)
);
const total = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const listSerpin = computed(() => [
  {
    name: "Работающие",
    count: rabotaet.value,
    percent: (rabotaet.value / total.value) * 100,
  },
  {
    name: "Безработные",
    count: bezrabot.value,
    percent: (bezrabot.value / total.value) * 100,
  },
  {
    name: "С трудовым договором:",
    count: est_trud.value,
    percent: (est_trud.value / total.value) * 100,
  },
  {
    name: "Без трудового договора",
    count: bez_trud.value,
    percent: (bez_trud.value / total.value) * 100,
  },
  {
    name: "Исполняющие",
    count: ispolnayet.value,
    percent: (ispolnayet.value / total.value) * 100,
  },
]);

const chartSerpin = computed(() =>
  chartOptions(
    [
      "Общее количество",
      "Работающие",
      "Безработные",
      "По трудовому договору",
      "Без трудового договора",
      "В других регионах",
      "На юге Казахстана",
    ],
    [
      {
        name: "Исполняющие",
        data: [(ispolnayet.value / total.value) * 100],
        color: "#3090E8",
      },

      {
        name: "",
        data: [100 - (ispolnayet.value / total.value) * 100],
        color: "#3090E820",
      },
    ]
  )
);
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
