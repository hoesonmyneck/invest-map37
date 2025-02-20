<template>
  <a-modal
    :footer="null"
    class="p-0"
    width="100%"
    height="100%"
    :closable="false"
    :centered="true"
  >
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <BaseCard
      v-else
      title=""
      number=""
      :show-close-button="true"
      @close="$emit('close')"
    >
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-1 gap-3 text-white">
          <div>
            <p class="mb-2 px-4 py-1 rounded bg-[#252A36] flex items-center">
              «СЕРПIН»
            </p>
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
                  <img
                    class="w-4"
                    :src="`/images/a_block/img_${i + 2}.png`"
                    alt=""
                  />
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
          </div>
          <div>
            <p class="mb-2 px-4 py-1 rounded bg-[#252A36] flex items-center">
              «АУЫЛ АМАНАТЫ»
            </p>
            <div class="grid grid-cols-[200px_1fr] gap-2 items-start p-3 px-5">
              <div class="relative flex items-center justify-center">
                <highcharts
                  :options="chartAulAmanati"
                  class="h-[170px] m-auto"
                ></highcharts>
                <p class="absolute text-2xl font-bold">
                  {{ Numeral((opv_has / total1) * 100) }}%
                </p>
              </div>
              <ul class="overflow-scroll h-[180px]">
                <li
                  class="grid grid-cols-[40px_1fr_80px_60px] w-full mb-2 pb-2 border-b border-gray-700"
                >
                  <img class="w-4" src="/images/a_block/img_1.png" alt="" />
                  <p class="text-[10px]">Участники</p>
                  <p class="text-[10px]">{{ Numeral(total) }}</p>
                  <p class="text-[10px] text-end">100%</p>
                </li>

                <li
                  v-for="(l, i) in listAulAmanati"
                  class="grid text-gray-400 grid-cols-[40px_1fr_80px_60px] w-full mb-4"
                >
                  <img
                    class="w-4"
                    :src="`/images/a_block/a2_${i + 1}.png`"
                    alt=""
                  />
                  <p class="text-[10px]">{{ l.name }}</p>
                  <p class="text-[10px]">{{ Numeral(l.count) }}</p>
                  <p
                    class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center"
                  >
                    {{ Numeral(l.percent) }}%
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <p class="mb-2 px-4 py-1 rounded bg-[#252A36] flex items-center">
              «ДИПЛОММЕН АУЫЛҒА»
            </p>
            <div class="grid grid-cols-[200px_1fr] gap-2 items-center p-3 px-5">
              <div class="relative flex items-center justify-center">
                <highcharts
                  :options="chartDiplommenAulga"
                  class="h-[170px] m-auto"
                ></highcharts>
                <p class="absolute text-2xl font-bold">
                  {{ ((rabotaet_aul / total2) * 100).toFixed(0) }}%
                </p>
              </div>
              <ul>
                <li
                  class="grid grid-cols-[40px_1fr_80px_70px] w-full mb-2 pb-2 border-b border-gray-700"
                >
                  <img class="w-4" src="/images/a_block/img_1.png" alt="" />
                  <p class="text-[10px]">Участники</p>
                  <p class="text-[10px]">{{ Numeral(total) }}</p>
                  <p class="text-[10px] text-end">100%</p>
                </li>

                <li
                  v-for="(l, i) in listDiplommenAulga"
                  class="grid text-gray-400 grid-cols-[40px_1fr_80px_70px] w-full mb-4"
                >
                  <img
                    class="w-4"
                    :src="`/images/a_block/a2_${i + 1}.png`"
                    alt=""
                  />
                  <p class="text-[10px]">{{ l.name }}</p>
                  <p class="text-[10px]">{{ Numeral(l.count) }}</p>
                  <p
                    class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center"
                  >
                    {{ +l.percent.toFixed(2) }}%
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="text-white">
          <p
            class="mb-2 px-4 py-1 w-full rounded bg-[#252A36] flex items-center"
          >
            «АУЫЛ-ЕЛ БЕСІГІ»
          </p>
          <div class="text-white overflow-x-scroll h-[calc(70vh)] w-full">
            <div
              class="header-grid-text items-end w-full"
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
              <p>{{ Numeral(aulBesigi.length) }}</p>
              <p>{{ Numeral(totalSumm) }}</p>
            </div>
            <div class="">
              <div
                v-for="l in aulBesigi.sort(
                  (a, b) => b.percentage_change - a.percentage_change
                )"
                :key="
                  l.project_name +
                  l.name +
                  l.start_date +
                  l.end_date +
                  l.plan_rab +
                  l.fact_rab
                "
                class="header-grid-text3 text-xs"
                style="margin-bottom: 0; padding: 2px 5px"
              >
                <p class="block truncate">{{ l.project_name }}</p>
                <p class="block">{{ Numeral(l.project_price) }}</p>
                <p class="block truncate">{{ l.name }}</p>
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
                      background: getColorFromGradient(
                        l.percentage_change ?? 0
                      ),
                      width: `${
                        l.percentage_change > 100
                          ? 100
                          : l.percentage_change ?? 0
                      }%`,
                    }"
                  ></div>
                  <p class="absolute text-[12px]">
                    {{ `${Numeral(l.percentage_change ?? 0)}%` }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { useRegionStore } from "../../../../entities/region/store";
import {
  getSerpin,
  getAulAmanati,
  getDiplommenAulga,
  getAulBesigi,
} from "../../../../entities/f/api";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";

const loader = ref(false);
const serpin = ref([]);
const aulAmanati = ref([]);
const diplommenAulga = ref([]);
const aulBesigi = ref([]);

const { currentRegion } = storeToRefs(useRegionStore());

async function loadSerpin() {
  serpin.value = await getSerpin().finally(() => {
    loader.value = false;
  });
}
async function loadAulAmanati() {
  aulAmanati.value = await getAulAmanati().finally(() => {
    loader.value = false;
  });
}
async function loadDiplommenAulga() {
  diplommenAulga.value = await getDiplommenAulga().finally(() => {
    loader.value = false;
  });
}
async function loadAulBesigi() {
  aulBesigi.value = await getAulBesigi().finally(() => {
    loader.value = false;
  });
}

const totalSumm = computed(() =>
  aulBesigi.value.reduce((acc, curr) => acc + curr.project_price, 0)
);

loadSerpin();
loadAulAmanati();
loadDiplommenAulga();
loadAulBesigi();

const filterByRegion = (data: any[]) =>
  data.filter((e) =>
    !currentRegion.value ? true : +e.parent1_code === +currentRegion.value
  );

const calculateTotal = (data: any[], key: string) =>
  computed(() =>
    filterByRegion(data).reduce((acc, curr) => +acc + +(curr[key] || 0), 0)
  );

const rabotaet = computed(() => calculateTotal(serpin.value, "rabotaet").value);
const bezrabot = computed(() => calculateTotal(serpin.value, "bezrabot").value);
const est_trud = computed(() => calculateTotal(serpin.value, "est_trud").value);
const bez_trud = computed(() => calculateTotal(serpin.value, "bez_trud").value);
const ispolnayet = computed(
  () => calculateTotal(serpin.value, "ispolnayet").value
);
const total = computed(() => calculateTotal(serpin.value, "total").value);

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

const srok_5 = computed(() => calculateTotal(aulAmanati.value, "srok_5").value);
const srok_7 = computed(() => calculateTotal(aulAmanati.value, "srok_7").value);
const active_ip = computed(
  () => calculateTotal(aulAmanati.value, "active_ip").value
);
const not_active = computed(
  () => calculateTotal(aulAmanati.value, "not_active").value
);
const opv_has = computed(
  () => calculateTotal(aulAmanati.value, "opv_has").value
);
const total1 = computed(() => calculateTotal(aulAmanati.value, "total").value);

const listAulAmanati = computed(() => [
  {
    name: "Срок до 5 лет",
    count: srok_5.value,
    percent: (srok_5.value / total1.value) * 100,
  },
  {
    name: "Срок до 7 лет",
    count: srok_7.value,
    percent: (srok_7.value / total1.value) * 100,
  },
  {
    name: "Активное ИП",
    count: active_ip.value,
    percent: (active_ip.value / total1.value) * 100,
  },
  {
    name: "Неактивное ИП",
    count: not_active.value,
    percent: (not_active.value / total1.value) * 100,
  },
  {
    name: "Есть ОПВ",
    count: opv_has.value,
    percent: (opv_has.value / total1.value) * 100,
  },
]);

const rabotaet_aul = computed(
  () => calculateTotal(diplommenAulga.value, "rabotaet_aul").value
);
const bezrabot2 = computed(
  () => calculateTotal(diplommenAulga.value, "bezrabot").value
);
const total2 = computed(
  () => calculateTotal(diplommenAulga.value, "total").value
);

const listDiplommenAulga = computed(() => [
  {
    name: "Работающие в селе",
    count: rabotaet_aul.value,
    percent: (rabotaet_aul.value / total2.value) * 100,
  },
  {
    name: "Безработные",
    count: bezrabot2.value,
    percent: (bezrabot2.value / total2.value) * 100,
  },
]);

const chartOptions = (categories: string[], series: any[]) => ({
  chart: {
    type: "column",
    inverted: true,
    polar: true,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  tooltip: {
    outside: true,
  },
  legend: {
    enabled: false,
  },
  pane: {
    size: "100%",
    innerSize: "70%",
  },
  xAxis: {
    tickInterval: 1,
    labels: {
      enabled: false,
    },
    lineWidth: 0,
    gridLineWidth: 0,
    categories,
  },
  yAxis: {
    labels: {
      enabled: false,
    },
    lineWidth: 0,
    tickInterval: 25,
    reversedStacks: false,
    endOnTick: true,
    showLastLabel: true,
    gridLineWidth: 0,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      borderWidth: 0,
      pointPadding: 0,
      groupPadding: 0.15,
    },
  },
  series,
});

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

const chartAulAmanati = computed(() =>
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
        data: [(opv_has.value / total1.value) * 100],
        color: "#3090E8",
      },

      {
        name: "",
        data: [100 - (opv_has.value / total1.value) * 100],
        color: "#3090E820",
      },
    ]
  )
);

const chartDiplommenAulga = computed(() =>
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
        data: [(rabotaet_aul.value / total2.value) * 100],
        color: "#3090E8",
      },
      {
        name: "",
        data: [100 - (rabotaet_aul.value / total2.value) * 100],
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
