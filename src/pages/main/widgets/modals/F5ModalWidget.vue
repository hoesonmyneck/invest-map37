<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true" :visible="visible">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <BaseCard v-else title="" number="" :show-close-button="true" @close="$emit('close')">
      <div class="grid grid-cols-[1fr_2fr] text-white">
        <div>
          <div class="flex gap-1">
            <div :class="{ active: tab === 0 }" @click="changeTab(0)" class="btn">
              Общее
            </div>
            <div :class="{ active: tab === 1 }" @click="changeTab(1)" class="btn">
              Общая площадь
            </div>
            <div :class="{ active: tab === 2 }" @click="changeTab(2)" class="btn">
              Количество голов
            </div>
          </div>
          <div class="overflow-auto h-[calc(50vh-106px)]">
            <template v-if="tab === 0">
              <div class="relative mt-5">
                <highcharts :options="chartOptions1" class="w-full m-auto h-[300px]"></highcharts>
                <div class="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <p class="text-2xl">{{ Numeral(allCount) }}</p>
                  <p class="text-gray-500 text-xs">Всего</p>
                  <p class="text-2xl">{{ Numeral(totalUniqueIdSum) }}</p>
                  <p class="text-gray-500 text-xs">Из них уникальных</p>
                </div>
              </div>
              <ul class="flex gap-4 text-[10px] justify-center">
                <li class="flex gap-2">
                  <p class="w-4 h-4 rounded-full" style="background-color: #FFA559"></p>
                  Животноводство
                </li>
                <li class="flex gap-2">
                  <p class="w-4 h-4 rounded-full" style="background-color: #0CCF89"></p>
                  Растениеводство
                </li>
              </ul>
            </template>

            <template v-else>
              <p v-if="tab === 1" class="mb-2 pb-2 border-b mt-4 text-sm">
                Общая площадь:
                <b>{{ formatNumber(filteredArea) }}</b>
                га
              </p>
              <p v-if="tab === 2" class="mb-2 pb-2 border-b mt-4 text-sm">
                Количество голов:
                <b>{{ formatNumber(filteredArea) }}</b>
              </p>
              <highcharts :options="chartOptions2" class="w-full m-auto"></highcharts>
            </template>
          </div>
        </div>
        <div class="ml-4 pl-4 border-l border-gray-600 overflow-scroll">
          <div
            class="head grid gap-1 grid-cols-[100px_100px_100px_100px_100px_100px_150px_130px_100px_] text-[10px] pt-4 pb-2 mb-2 border-b border-gray-600">
            <p>НАИМЕНОВАНИЕ</p>
            <p>БИН <br><br> {{ formatNumber(filteredBin) }}</p>
            <p>ТИП</p>
            <p>ПОДТИП</p>
            <p>ПЛОЩАДЬ <br><br> <div v-if="tab === 1"> {{ formatNumber(filteredArea) }}</div></p>
            <p>ГОЛОВ <br><br> <div v-if="tab === 2"> {{ formatNumber(filteredArea) }}</div></p>
            <p>Фактические рабочие места <br><br> {{ formatNumber(filteredWorkPlaces) }}</p>
            <p>Потребность в кадрах <br><br> {{ formatNumber(filteredTotalHeadCount) }}</p>
            <p>Свободные резюме<br><br> {{ formatNumber(filteredIinSum) }}</p>
          </div>
          <div class="overflow-y-auto h-[calc(40vh-50px)] w-full">
            <div
              class="head gap-1 grid grid-cols-[100px_100px_100px_100px_100px_100px_150px_130px_100px_] text-[10px] mt-1"
              v-for="item in dataListFiltered.slice(0, 30)" :key="item.area + item.full_name">
              <a-tooltip placement="left" :title="item.full_name">
                <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate cursor-pointer" @click="openCompanyPopup(item)">
                  {{ item.full_name }}
                </p>
              </a-tooltip>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.bin }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ +item.tip === 1 ? "Растениеводство" : "Животноводство" }}
              </p>
              <a-tooltip placement="left" :title="item.crop_ru"><p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.crop_ru }}
              </p></a-tooltip>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ +item.tip === 1 ? item.area : "" }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ +item.tip !== 1 ? item.area : "" }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.work_places }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.total_head_count }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.iin_sum }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="map h-[calc(50vh)] relative">
        <div class="flex items-center justify-between w-full pr-10 mt-5">
          <div class="flex gap-1 text-white">
            <div :class="{ active: tabMapStatus === 0 }" @click="tabMapStatus = 0" class="btn mini">
              Животноводство
            </div>
            <div :class="{ active: tabMapStatus === 1 }" @click="tabMapStatus = 1" class="btn mini">
              Растениеводство
            </div>
          </div>
          <div v-if="!!currentRegion || !!currentRaion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="() => {
              if (!!currentRaion) {
                currentRaion = null;
                return;
              }
              currentRegion = null;
            }">
            <CloseOutlined />
          </div>
        </div>
        <BaseMap 
          v-if="!currentRegion"
          :current-region="0" 
          :fill-color="(v) => {
            return getColorFromGradient((groupByRegion()[+v]?.area / maxCountGroupByRegion) * 100)
          }" 
          @click-polygon="clickPolygon" 
          v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>{{ tabMapStatus === 1 ? "Площадь" : "Голов" }}:</p>
              <p class="font-bold">
                {{
                  (() => {
                    const regionArea = groupByRegion()[+slotProps.data.parent1_code]?.area || 0;
                    const totalArea = Object.values(groupByRegion()).reduce((acc, curr) => acc + curr.area, 0);
                    const percentage = (regionArea / totalArea) * 100;
                    return Numeral(percentage) + "% (" + Numeral(regionArea) + (tabMapStatus === 1 ? " га" : " голов") + ")";
                  })()
                }}
              </p>
            </div>
          </div>
        </BaseMap>
        
        <BaseMapNoMarker
          v-else
          :current-region="currentRegion ? +currentRegion : 0"
          :current-raion="currentRaion ? +currentRaion : undefined"
          :fill-color="(v) => {
            if (!groupByRaion()[+v] || groupByRaion()[+v]?.parent1_code !== Number(currentRegion)) {
              return '#222732'; 
            }
            const regionRaions = Object.values(groupByRaion()).filter((raion: F5Item) => raion.parent1_code === Number(currentRegion));
            const totalRegionArea = regionRaions.reduce((acc: number, raion: F5Item) => acc + raion.area, 0);
            const areaValue = groupByRaion()[+v]?.area || 0;
            const percentage = (areaValue / totalRegionArea) * 100;
            
            if (percentage <= 3.5) {
              return '#109669'; 
            }
            
            return getColorFromGradient(
              percentage,
              true,
              false,
              10
            );
          }"
          @click-polygon="clickRaion"
          v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Район:</p>
              <p class="font-bold">{{ slotProps.data.raion }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>{{ tabMapStatus === 1 ? "Площадь" : "Голов" }}:</p>
              <p class="font-bold">
                {{
                  (() => {
                    const regionRaions = Object.values(groupByRaion()).filter((raion: F5Item) => raion.parent1_code === Number(currentRegion));
                    const totalRegionArea = regionRaions.reduce((acc: number, raion: F5Item) => acc + raion.area, 0);
                    const areaValue = groupByRaion()[+slotProps.data.parent2_code]?.area || 0;
                    const percentage = (areaValue / totalRegionArea) * 100;
                    return Numeral(percentage) + "% (" + Numeral(areaValue) + (tabMapStatus === 1 ? " га" : " голов") + ")";
                  })()
                }}
              </p>
            </div>
          </div>
        </BaseMapNoMarker>
      </div>
    </BaseCard>
  </a-modal>

 
  <a-modal 
    :footer="null" 
    class="p-0 text-white" 
    width="70%" 
    height="80%" 
    :closable="false" 
    :centered="true" 
    :visible="companyPopupVisible"
    @cancel="companyPopupVisible = false"
  >
    <BaseCard title="" number="" :show-close-button="true" @close="companyPopupVisible = false">
      <div v-if="selectedCompany" class="text-white">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 class="text-xl mb-4">{{ selectedCompany.full_name }}</h2>
            <div class="grid grid-cols-2 gap-2 text-sm mr-20">
              <p>БИН:</p>
              <p>{{ selectedCompany.bin }}</p>
              
              <p>Тип:</p>
              <p>{{ +selectedCompany.tip === 1 ? "Растениеводство" : "Животноводство" }}</p>
              
              <p>Подтип:</p>
              <p>{{ selectedCompany.crop_ru }}</p>
              
              <p>{{ +selectedCompany.tip === 1 ? "Площадь:" : "Количество голов:" }}</p>
              <p>{{ formatNumber(selectedCompany.area) }} {{ +selectedCompany.tip === 1 ? "га" : "" }}</p>
              
              <!-- <p>Фактические рабочие места:</p>
              <div class="flex gap-5">
                <p>{{ formatNumber(selectedCompany.work_places) }}</p>
                <div class="bg-white h-5 w-[1px]"></div>
                <p> Общие по району: {{ formatNumber(getDistrictTotal('work_places')) }}</p>
              </div>
              
              
              <p>Потребность в кадрах:</p>
              <div class="flex gap-5">
                <p>{{ formatNumber(selectedCompany.total_head_count) }}</p>
                <div class="bg-white h-5 w-[1px]"></div>
                <p> Общая по району: {{ formatNumber(getDistrictTotal('total_head_count')) }}</p>
              </div>
              
              
              <p>Свободные резюме:</p>
              <div class="flex gap-5">
                <p>{{ formatNumber(selectedCompany.iin_sum) }}</p>
                <div class="bg-white h-5 w-[1px]"></div>
                <p> Общие по району: {{ formatNumber(getDistrictTotal('iin_sum')) }}</p>
              </div> -->
            </div>
            <div class="flex">
            <div class="flex flex-col mt-10">
             <div class="flex gap-26" >
              <p>Фактические рабочие места:</p>
              <p>{{ formatNumber(selectedCompany.work_places) }}</p>
             </div>

             <div class="flex gap-36" >
              <p>Потребность в кадрах:</p>
              <p>{{ formatNumber(selectedCompany.total_head_count) }}</p>
             </div>

             <div class="flex gap-39" >
              <p>Свободные резюме:</p>
              <p>{{ formatNumber(selectedCompany.iin_sum) }}</p>
             </div>
            </div>
            <div class="w-[1px] h-16 bg-white mt-10 ml-10"></div>
            <div class="flex flex-col mt-10 ml-10">
             <div class="flex gap-5" >
              <p>Общие по району:</p>
              <p>{{ formatNumber(getDistrictTotal('work_places')) }}</p>
             </div>

             <div class="flex gap-5" >
              <p>Общая по району:</p>
              <p>{{ formatNumber(getDistrictTotal('total_head_count')) }}</p>
             </div>

             <div class="flex gap-5" >
              <p>Общие по району:</p>
              <p>{{ formatNumber(getDistrictTotal('iin_sum')) }}</p>
             </div>
            </div>
            </div>
          </div>
          <div>
            <highcharts 
              v-if="selectedCompany" 
              :options="getCompanyChartOptions()" 
              class="w-full h-[250px]"
            ></highcharts>
          </div>
        </div>
      </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { computed, ref, onMounted } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF5, getF5_1, getF7_total } from "../../../../entities/f/api";
import { Numeral } from "../../../../shared/helpers/numeral";
import { useRegionStore } from "../../../../entities/region/store";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";
import { createApp } from 'vue';

interface F5Item {
  region: string;
  parent1_code: number;
  raion: string;
  parent2_code: number;
  tip: number;
  crop_ru: string;
  area: number;
  new_id: number;
  total_unique_id?: number;
}

interface F5_1Item {
  full_name: string;
  bin: number;
  tip: number;
  crop_ru: string;
  area: number;
  work_places: number;
  total_head_count: number;
  iin_sum: number;
  parent1_code: number;
  parent2_code?: number;
}

interface F7Item {
  region: string;
  parent1_code: number;
  raion?: string;
  parent2_code?: number;
  tip: number;
  iin_sum: number;
  bin: number;
  work_places: number;
  area: number;
  total_head_count: number;
  bezrabot_zero: number;
}

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);

const loader = ref(true);
const data = ref<F5Item[]>([]);
const dataList = ref<F5_1Item[]>([]);
const tab = ref(0);
const tabMapStatus = ref(0);
const currentRegion = ref<number | null>(null);
const currentRaion = ref<number | null>(null);
const f7Data = ref<F7Item[]>([]);
const f5Data = ref<F5Item[]>([]);
const selectedCompany = ref<F5_1Item | null>(null);
const companyPopupVisible = ref(false);

async function loadF5() {
  data.value = await getF5();
  dataList.value = await getF5_1();

  loader.value = false;
}

loadF5();

const clickPolygon = (code: string) => {
  currentRegion.value = +code;
  currentRaion.value = null;
}

const clickRaion = (code: string) => {
  currentRaion.value = +code;
}

const allCount = computed(() =>
  Object.values(_transformedData.value)?.reduce(
    (acc, curr: F5Item) => acc + curr.new_id,
    0
  )
);

const _transformedData = computed(() =>
  data.value
    .filter(
      (item) =>
        (!currentRegion.value ||
          +item.parent1_code === currentRegion.value) &&
        (!currentRaion.value ||
          +item.parent2_code === currentRaion.value) &&
        (tab.value === 0
          ? true
          : +item.tip ===
          (tab.value === 1 ? 1 : 2))
    )
    .reduce((acc: Record<string, F5Item>, curr) => {
      const _key = curr.raion + curr.tip + curr.region;
      acc[_key] = curr;

      return acc;
    }, {})
);

const dataListFiltered = computed(() =>
  dataList.value.filter(
    (item) =>
      ((!currentRegion.value ||
        +item.parent1_code === currentRegion.value) &&
        (!currentRaion.value ||
        (item.parent2_code !== undefined && +item.parent2_code === currentRaion.value))) &&
      (tab.value === 0 ? true : +item.tip === tab.value)
  )
);

const maxCountGroupByRegion = computed(
  () => {
    const values = Object.values(groupByRegion());
    if (values.length === 0) return 0;
    return values.sort((a: F5Item, b: F5Item) => b.area - a.area)[0]?.area || 0;
  }
);

const type_1 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item: F5Item) => +item.tip === 1
  )
);
const type_2 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item: F5Item) => +item.tip === 2
  )
);

const totalArea = computed(() =>
  data.value
    .filter(
      (item) =>
        (+item.tip === (tab.value === 1 ? 1 : 2)) && 
        (!currentRegion.value || item.parent1_code === currentRegion.value) &&
        (!currentRaion.value || item.parent2_code === currentRaion.value)
    )
    ?.reduce((acc: Record<string, F5Item>, curr) => {
      if (
        [
          "Кулан",
          "Пони",
          "Ослы",
          "Верблюды",
          "Свиньи",
          "Козы",
          "Мулы",
        ].includes(curr.crop_ru)
      )
        return acc;

      if (!acc[curr.crop_ru]) {
        acc[curr.crop_ru] = { ...curr };
        return acc;
      }

      acc[curr.crop_ru].area += curr.area;
      acc[curr.crop_ru].new_id += curr.new_id;
      return acc;
    }, {})
);

const groupByRegion = (): Record<number, F5Item> => data.value
  .filter(
    (item) =>
      +item.tip ===
      (tabMapStatus.value === 1 ? 1 : 2)
  )
  ?.reduce((acc: Record<number, F5Item>, curr) => {
    if (!acc[curr.parent1_code]) {
      acc[curr.parent1_code] = { ...curr };
      return acc;
    }

    acc[curr.parent1_code].area += curr.area;
    acc[curr.parent1_code].new_id += curr.new_id;
    return acc;
  }, {});

const groupByRaion = (): Record<number, F5Item> => data.value
  .filter(
    (item) =>
      +item.tip ===
      (tabMapStatus.value === 1 ? 1 : 2)
  )
  ?.reduce((acc: Record<number, F5Item>, curr) => {
    if (!curr.parent2_code) return acc;
    
    if (!acc[curr.parent2_code]) {
      acc[curr.parent2_code] = { ...curr };
      return acc;
    }

    acc[curr.parent2_code].area += curr.area;
    acc[curr.parent2_code].new_id += curr.new_id;
    return acc;
  }, {});

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{point.y} <b>({point.percentage:.0f}%)</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 8,
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    },
    xAxis: {
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      labels: {
        enabled: false,
      },
    },
    series: [
      {
        name: "",
        innerSize: "75%",
        data: [
          {
            name: "Растениеводство",
            color: "#0CCF89",
            y: type_1.value.reduce((acc: number, curr: F5Item) => acc + curr.new_id, 0),
          },
          {
            name: "Животноводство",
            color: "#FFA559",
            y: type_2.value.reduce((acc: number, curr: F5Item) => acc + curr.new_id, 0),
          },
        ],
      },
    ],
  };
});

const chartOptions2 = computed(() => {
  return {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: tab.value === 1 ? "200%" : "30%",
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{point.count}",
    },
    plotOptions: {
      column: {
        grouping: false,
        borderWidth: 0,
      },
      series: {
        borderRadius: 0,
        dataLabels: {
          format: "{point.count}",
          enabled: true,
          style: {
            color: "#fff",
          },
        },
        showInLegend: true,
      },
    },
    xAxis: {
      categories: Object.values(totalArea.value)
        .sort((a: F5Item, b: F5Item) => b.area - a.area)
        .map((item: F5Item) => item.crop_ru),
      tickmarkPlacement: "on",
      labels: {
        style: {
          color: "#fff",
          fontSize: "10px",
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
        style: {
          color: "#fff",
        },
      },
    },
    series: [
      {
        name: "",
        pointWidth: 12,
        borderWidth: 0,
        data: Object.values(totalArea.value)
          .sort((a: F5Item, b: F5Item) => b.area - a.area)
          .map((item: F5Item) => {
            return {
              name: item.crop_ru,
              y: item.area,
              count: Numeral(item.area),
              color: "#3090e8",
            };
          }),
      },
    ],
  };
});

onMounted(async () => {
  const responseF7 = await getF7_total();
  f7Data.value = responseF7;

  const responseF5 = await getF5();
  f5Data.value = responseF5;
});

const totalUniqueIdSum = computed(() => {
  const uniqueRaions: Record<number, number> = {};
  f5Data.value.forEach(item => {
    if ((!currentRegion.value || item.parent1_code === currentRegion.value) &&
        (!currentRaion.value || item.parent2_code === currentRaion.value)) {
      if (!uniqueRaions[item.parent2_code]) {
        uniqueRaions[item.parent2_code] = item.total_unique_id || 0;
      }
    }
  });
  return Object.values(uniqueRaions).reduce((acc: number, curr: number) => acc + curr, 0);
});

const filteredBin = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.bin || 0), 0);
    } else if (currentRegion.value && !currentRaion.value) {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.bin || 0), 0);
    } else {
      return f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.bin || 0), 0);
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.bin || 0), 0);
  } else if (currentRegion.value && !currentRaion.value) {
    return f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.bin || 0), 0);
  } else {
    return f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.bin || 0), 0);
  }
});

const filteredArea = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return Math.round(f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.area || 0), 0));
    } else if (currentRegion.value && !currentRaion.value) {
      return Math.round(f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.area || 0), 0));
    } else {
      return Math.round(f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.area || 0), 0));
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return Math.round(f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.area || 0), 0));
  } else if (currentRegion.value && !currentRaion.value) {
    return Math.round(f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.area || 0), 0));
  } else {
    return Math.round(f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.area || 0), 0));
  }
});

const filteredTotalHeadCount = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
    } else if (currentRegion.value && !currentRaion.value) {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
    } else {
      return f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
  } else if (currentRegion.value && !currentRaion.value) {
    return f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
  } else {
    return f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.total_head_count || 0), 0);
  }
});

const filteredIinSum = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
    } else if (currentRegion.value && !currentRaion.value) {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
    } else {
      return f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
  } else if (currentRegion.value && !currentRaion.value) {
    return f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
  } else {
    return f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.iin_sum || 0), 0);
  }
});

const filteredBezrabotZero = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
    } else if (currentRegion.value && !currentRaion.value) {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
    } else {
      return f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
  } else if (currentRegion.value && !currentRaion.value) {
    return f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
  } else {
    return f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.bezrabot_zero || 0), 0);
  }
});

const filteredWorkPlaces = computed(() => {
  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value
        .filter(item => item.tip === 0)
        .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
    } else if (currentRegion.value && !currentRaion.value) {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value && item.tip === 0)
        .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
    } else {
      return f7Data.value
        .filter(item => 
          item.parent1_code === currentRegion.value && 
          item.parent2_code === currentRaion.value && 
          item.tip === 0
        )
        .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
    }
  }

  const selectedTip = tab.value === 1 ? 1 : 2;

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
  } else if (currentRegion.value && !currentRaion.value) {
    return f7Data.value
      .filter(item => item.parent1_code === currentRegion.value && +item.tip === selectedTip)
      .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
  } else {
    return f7Data.value
      .filter(item => 
        item.parent1_code === currentRegion.value && 
        item.parent2_code === currentRaion.value && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (curr.work_places || 0), 0);
  }
});

const changeTab = (newTab: number) => {
  tab.value = newTab;
};

const app = createApp({});

app.config.globalProperties.$filters = {
  formatNumber(value: string | number) {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

const formatNumber = (value: string | number) => {
  if (!value) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const openCompanyPopup = (company: F5_1Item) => {
  selectedCompany.value = company;
  companyPopupVisible.value = true;
};


const getCompanyChartOptions = () => {
  if (!selectedCompany.value) return {};
  
  return {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "Статистика компании",
      style: {
        color: "#fff"
      }
    },
    xAxis: {
      categories: ["Рабочие места", "Потребность в кадрах", "Свободные резюме"],
      labels: {
        style: {
          color: "#fff"
        }
      }
    },
    yAxis: {
      title: {
        text: "Количество",
        style: {
          color: "#fff"
        }
      },
      labels: {
        style: {
          color: "#fff"
        }
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        borderRadius: 5
      }
    },
    series: [{
      name: "Значение",
      data: [
        {
          y: selectedCompany.value.work_places,
          color: "#3090E8"
        },
        {
          y: selectedCompany.value.total_head_count,
          color: "#0CCF89"
        },
        {
          y: selectedCompany.value.iin_sum,
          color: "#FFA559"
        }
      ],
      dataLabels: {
        enabled: true,
        color: "#fff",
        formatter: function(): string {
          // @ts-ignore - this.y существует в контексте Highcharts
          return Numeral(this.y);
        }
      }
    }]
  };
};

const getDistrictTotal = (field: 'work_places' | 'total_head_count' | 'iin_sum') => {
  if (!selectedCompany.value || !selectedCompany.value.parent2_code) {
    return 0;
  }

  const companyParent2Code = selectedCompany.value.parent2_code;
  
  if (tab.value === 0) {
    return f7Data.value
      .filter(item => 
        item.parent2_code !== undefined && 
        +item.parent2_code === +companyParent2Code && 
        item.tip === 0
      )
      .reduce((acc, curr) => acc + (+curr[field] || 0), 0);
  } else {
    const selectedTip = tab.value === 1 ? 1 : 2;
    
    return f7Data.value
      .filter(item => 
        item.parent2_code !== undefined && 
        +item.parent2_code === +companyParent2Code && 
        +item.tip === selectedTip
      )
      .reduce((acc, curr) => acc + (+curr[field] || 0), 0);
  }
};
</script>

<style scoped lang="scss">
.block {
  @apply h-8 px-3 flex items-center bg-[#252A36] rounded w-full;
}
</style>
