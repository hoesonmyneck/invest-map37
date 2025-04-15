<template>
  <div class="text-white">
    <BaseCard
      title="«ДИПЛОММЕН АУЫЛҒА»"
      number="A3"
      :show-close-button="false"
      @close="$emit('close')"
    >
      <div class="grid grid-cols-[200px_1fr] gap-2 items-center p-3 px-5">
        <div class="relative flex items-center justify-center">
          <highcharts :options="chart" class="h-[170px] m-auto"></highcharts>
          <p class="absolute text-2xl font-bold">
            {{ ((rabotaet_aul / total) * 100).toFixed(0) }}%
          </p>
        </div>
        <ul>
          <li
            class="grid grid-cols-[40px_1fr_80px_70px] w-full mb-2 pb-2 border-b border-gray-700"
          >
            <img class="w-4" src="/images/a_block/img_1.png" alt="" />
            <p class="text-[10px]">Участники</p>
            <p class="text-[10px]">{{ Numeral(total) }}</p>
            <p class="text-[10px] text-end">{{ Numeral((total / totalBeforeFilter) * 100) }}%</p>
          </li>

          <li
            v-for="(l, i) in listDiplommenAulga"
            class="grid text-gray-400 grid-cols-[40px_1fr_80px_70px] w-full mb-4"
          >
            <img class="w-4" :src="`/images/a_block/a2_${i + 1}.png`" alt="" />
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ l.name }}</p>
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ Numeral(l.count) }}</p>
            <p
              class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center"
            >
              {{ +l.percent.toFixed(2) }}%
            </p>
          </li>
        </ul>
      </div>
    </BaseCard>

    <IinPopupWidget
      v-if="showPopup"
      :visible="showPopup"
      :iins="selectedCategory ? programStore.getIinsByCategory('diplommenAulga', selectedCategory.key) : []"
      :names="selectedCategory ? programStore.getNamesByCategory('diplommenAulga', selectedCategory.key) : []"
      :addresses="selectedCategory ? programStore.getAddressesByCategory('diplommenAulga', selectedCategory.key) : []"
      :title="`«ДИПЛОММЕН АУЫЛҒА» - ${selectedCategory ? selectedCategory.name : ''}`"
      :category-name="selectedCategory ? selectedCategory.name : ''"
      @close="showPopup = false"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getDiplommenAulga } from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { chartOptions } from "../helpers/chartOption";
import IinPopupWidget from "./IinPopupWidget.vue";

const programStore = useProgramStore();
const { diplommenAulgaFilter, diplommenAulga } = storeToRefs(programStore);

const showPopup = ref(false);
const selectedCategory = ref<{ name: string, key: string } | null>(null);

const totalBeforeFilter = computed(() =>
  diplommenAulga.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const rabotaet_aul = computed(() =>
  diplommenAulgaFilter.value.reduce(
    (acc, curr) => +acc + +(curr.rabotaet_aul || 0),
    0
  )
);
const bezrabot = computed(() =>
  diplommenAulgaFilter.value.reduce(
    (acc, curr) => +acc + +(curr.bezrabot || 0),
    0
  )
);
const total = computed(() =>
  diplommenAulgaFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const listDiplommenAulga = computed(() => [
  {
    name: "Работающие в селе",
    key: "rabotaet_aul",
    count: rabotaet_aul.value,
    percent: (rabotaet_aul.value / total.value) * 100,
  },
  {
    name: "Безработные",
    key: "bezrabot",
    count: bezrabot.value,
    percent: (bezrabot.value / total.value) * 100,
  },
]);

function showIinPopup(category: { name: string, key: string, count: number, percent: number }) {
  selectedCategory.value = category;
  showPopup.value = true;
}

const chart = computed(() =>
  chartOptions(
    [
      "Общее количество",
      "Работающие",
      "Безработные",
      "В других регионах",
      "На юге Казахстана",
    ],
    [
      {
        name: "Исполняющие",
        data: [(rabotaet_aul.value / total.value) * 100],
        color: "#3090E8",
      },
      {
        name: "",
        data: [100 - (rabotaet_aul.value / total.value) * 100],
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
