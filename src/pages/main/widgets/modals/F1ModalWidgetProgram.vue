<template>
 <div style="width:97%; height:88vh; overflow:scroll">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <div v-else>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-1 gap-3 text-white">
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
          </BaseCard>
          <BaseCard
           title="«АУЫЛ АМАНАТЫ»"
           number="A2"
           :show-close-button="false"
           @close="$emit('close')">
            
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
          </BaseCard>
          <BaseCard
      title="«ДИПЛОММЕН АУЫЛҒА»"
      number="A3"
      :show-close-button="false"
      @close="$emit('close')"
    >
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
          </BaseCard>
        </div>

        <Card :title="currentRegion ? `${regions[currentRegion].parent1_name}` : 'Казахстан'" number="M1"
    class="relative z-10 text-white" :close="currentRegion" @clear="
      regionStore.setCurrentRegion(undefined)">
    <div class="absolute p-4 z-[2000] overflow-auto w-full">
      <ul class="py-1 flex gap-2 text-nowrap">
        <template v-for="l in listLabels" :key="l.name">
          <li @click="aStore.setAMapCurrentKey(l.key)"
            class="w-max p-1 bg-[#252A36] text-xs cursor-pointer items-center gap-2 border justify-between mb-1 px-3 h-max"
            :class="{ 'border-[#3090E8]': a_map_current_key === l.key, 'border-gray-700': a_map_current_key !== l.key }">
            <div class="flex items-center gap-2">
              <img :src="l.icon" alt="" class="w-[20px] h-[20px]">
              <p>{{ l.name }}</p>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <div class="relative z-1 overflow-hidden h-[50vh]">
      <BaseMap
          :current-region="+currentRegion"
          :fill-color="
            (v) => {
              return getColorFromGradient(
                (+groupByRegion()[+v].rt_unemployed / allBezrabot) * 100,
                true,
                false,
                10
              );
            }
          "
          @click-polygon="clickPolygon"
          v-slot="slotProps"
        >
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>Безрабочий:</p>
              <p class="font-bold">
                {{
                  Numeral(
                    groupByRegion()[+slotProps.data.parent1_code].rt_unemployed
                  )
                }}
              </p>
            </div>
          </div>
        </BaseMap>
    </div>
  </Card>
        <BaseCard
      title="«АУЫЛ-ЕЛ БЕСІГІ»"
      number="A4"
      :show-close-button="false"
      @close="$emit('close')"
    >
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
              <a-tooltip placement="left" :title="l.project_name"><p class="block truncate">{{ l.project_name }}</p> </a-tooltip>
                <p class="block">{{ Numeral(l.project_price) }}</p>
              <a-tooltip placement="left" :title="l.name">  <p class="block truncate">{{ l.name }}</p></a-tooltip>
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
        </BaseCard>
        
      </div>
    </div>
  </div>
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
import { useA2Store } from "../../../../stores/a2.store";
import Card from "../../../../shared/ui/Card/Card.vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import { getF1 } from "../../../../entities/f/api";

const data = ref<any[]>([]);
async function loadF1() {
  data.value = await getF1().finally(() => {
    loader.value = false;
  });
}
loadF1();

const groupByRegion = () =>
  [...data.value].reduce((acc, curr) => {
    if (!acc[curr.parent1_code]) {
      acc[curr.parent1_code] = { rt_unemployed: +curr.rt_unemployed };
      return acc;
    }

    acc[curr.parent1_code].rt_unemployed += +curr.rt_unemployed;
    return acc;
  }, {} as any);

const _filter = computed(() =>
  [...data.value].filter((e) =>
    !currentRegion.value ? true : e.parent1_code === currentRegion.value
  )
);


const loader = ref(false);
const serpin = ref([]);
const aulAmanati = ref([]);
const diplommenAulga = ref([]);
const aulBesigi = ref([]);




const regionStore = useRegionStore();
const { regionPolygons, currentRegion, regions } = storeToRefs(regionStore);
const aStore = useA2Store();
const { a_map_current_key, a1, a2, a3 } = storeToRefs(aStore);

const _filterA1 = computed(() => [...a1.value]
  .filter(e => (!currentRegion.value || +e.parent1_code === +currentRegion.value))
);

const _filterA2 = computed(() => [...a2.value]
  .filter(e => (!currentRegion.value || +e.parent1_code === +currentRegion.value))
);

const _filterA3 = computed(() => [...a3.value]
  .filter(e => (!currentRegion.value || +e.parent1_code === +currentRegion.value))
);

const listLabels = computed(() => [
  { name: 'Серпiн', icon: '/images/a_block/map_1.png', key: 'serpin' },
  { name: 'Ауыл аманаты', icon: '/images/a_block/map_2.png', key: 'auyl_amanat' },
  { name: 'Дипломмен ауылға', icon: '/images/a_block/map_3.png', key: 'diplom' },
  { name: 'Ауыл - ел бесiгi', icon: '/images/a_block/map_3.png', key: 'auyl_el' },
]);

const summ = computed(() => {
  if (a_map_current_key.value === 'serpin') return _filterA1.value.reduce((acc, curr) => {
    if (acc[curr.parent1_code]) {
      const item = acc[curr.parent1_code]
      item.value += curr.ispolnayet
      item.total += curr.total
      item.count += 1
    } else {
      acc[curr.parent1_code] = {
        ...curr,
        count: 1,
        value: curr.ispolnayet
      }
    }

    return acc;
  }, {});


  if (a_map_current_key.value === 'auyl_amanat') return _filterA3.value.reduce((acc, curr) => {
    console.log(curr.loan_price_sum_aulamanat);

    if (acc[curr.parent1_code]) {
      const item = acc[curr.parent1_code]
      item.value += curr.active_ip
      item.total += curr.total
      item.not_active += curr.not_active
      item.opv_has += curr.opv_has
      item.active_ip += curr.active_ip
      item.loan_price_sum += !!curr.loan_price_sum ? curr.loan_price_sum : 0
      item.count += 1
    } else {
      acc[curr.parent1_code] = {
        ...curr,
        count: 1,
        value: 0,
      }
    }

    return acc;
  }, {});


  if (a_map_current_key.value === 'diplom') return _filterA2.value.reduce((acc, curr) => {
    if (acc[curr.parent1_code]) {
      const item = acc[curr.parent1_code]
      item.value += curr.rabotaet_aul
      item.total += curr.total
      item.count += 1
    } else {
      acc[curr.parent1_code] = {
        ...curr,
        count: 1,
        value: 0
      }
    }

    return acc;
  }, {});

  return {};
});

const ratesMaxMin = computed(() => {
  const rates = Object.values(summ.value).map(e => e.value / e.total * 100);
  return {
    min: Math.min(...rates),
    max: Math.max(...rates)
  };
});

const list = computed(() => regionPolygons.value.map(e => {
  let _data = summ.value[e.parent1_code]
  const { max } = ratesMaxMin.value

  return {
    ...e,
    ..._data,
    count: Numeral(!!_data ? _data.total : 0),
    color: !_data ? '#252a36' : getColorFromGradient(_data.value === 0 ? 0 : (_data.value / _data.total * 100) / max * 100),
  };
}));

const setCurrentRegion = (code: string) => regionStore.setCurrentRegion(code);

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
.tag {
  background: #12141A;
  border-radius: 2px;
  height: 18px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  color: #818693;
  font-size: 10px;
}
</style>
