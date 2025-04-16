<template>
  <a-modal
    :footer="null"
    class="p-0"
    width="100%"
    height="100%"
    :closable="false"
    :centered="true"
    :visible="visible"
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
    <div class="flex gap-1 text-white mt-1 mb-1">
        <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn h-8">
          По отраслям
        </div>
        <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn h-8">
          Качественные рабочие места
        </div>
        
        <div v-if="tab === 1" class="flex items-center ml-4">
          <a-radio-group v-model:value="chartMode" button-style="solid">
            <a-radio-button value="single">Единичный год</a-radio-button>
            <a-radio-button value="compare">Сравнение годов</a-radio-button>
          </a-radio-group>
        </div>

        <div v-if="tab === 1" class="flex items-center gap-2">
          <template v-if="chartMode === 'compare'">
            <a-select 
              class="text-white ml-2 w-40" 
              placeholder="Год 1"
              v-model:value="selectedYear1"
            >
              <a-select-option value="2024">2024 год</a-select-option>
              <a-select-option value="2023">2023 год</a-select-option>
            </a-select>
            
            <a-select 
              class="text-white ml-2 w-40"
              placeholder="Год 2"
              v-model:value="selectedYear2"
            >
              <a-select-option v-if="selectedYear1 !== '2024'" value="2024">2024 год</a-select-option>
              <a-select-option v-if="selectedYear1 !== '2023'" value="2023">2023 год</a-select-option>
            </a-select>
          </template>

          <template v-else>
            <a-select 
              class="text-white ml-2 w-40"
              placeholder="Выберите режим"
              v-model:value="singleModeOption"
            >
              <a-select-option value="2024">2024 год</a-select-option>
              <a-select-option value="2023">2023 год</a-select-option>
            </a-select>
          </template>
        </div>
      </div>
      <div class="overflow-auto h-[calc(94vh)] grid grid-cols-2" v-if="tab === 0">
        <div class="grid">
          <div class="max-h-[100vh] overflow-scroll text-white max-w-[95%]">
            <div
              class="head grid grid-cols-[2fr_120px_120px_135px] mb-2 pb-2 border-b border-gray-600"
            >
              <p>Наименование</p>
              <p>Количество 2023</p>
              <p>Количество 2024</p>
              <p>Прирост 2023/2024</p>
              <!-- <p>Прогноз 2025</p> -->
            </div>
            <div
              class="mt-1 gap-1 grid grid-cols-[2fr_120px_120px_140px] text-[12px]"
              v-for="i in list"
              :key="i.vcode_oked"
            >
            <a-tooltip placement="left" :title="i.vname_oked">
              <p
                class="h-9 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ i.vname_oked }}
              </p>
            </a-tooltip>
              <p
                class="h-9 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ i.cnt_2023.toLocaleString() }}
              </p>
              <p
                class="h-9 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ i.cnt_2024.toLocaleString() }}
              </p>
              <p
                class="h-9 w-full justify-center px-3 flex items-center bg-[#252A36] rounded w-full truncate"
                :style="`background-color: ${
                  i.proc < 0 ? '#FE6A35' : '#109669'
                }`"
              >
                {{ i.proc.toFixed(1) }} %
              </p>
              <!-- <p
                class="h-9 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ !!i.prognoz ? `${+i.prognoz.toFixed(1)} %` : "" }}
              </p> -->
            </div>
          </div>
        </div>
        <div class="map h-[calc(90vh)] relative w-[calc(100%)] ml-[5px]">
          <div
            v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="() => {
              if (!!currentRaion) {
                currentRaion = null;
                return;
              }
              currentRegion = null;
            }"
          >
            <CloseOutlined />
          </div>
          <BaseMap
            v-if="!currentRegion"
            :current-region="currentRegion || undefined"
            :fill-color="
              (v) => {
                const totalProc = groupByRegion[v]?.totalProc || 0;
                const sortedRegions = Object.values(groupByRegion).sort((a, b) => b.totalProc - a.totalProc);
                const index = sortedRegions.findIndex(region => region === groupByRegion[v]);

                if (index < 6) {
                  return getColorFromGradient(100); // Зеленый
                } else if (index >= sortedRegions.length - 6) {
                  return getColorFromGradient(10); // Красный
                } else {
                  return getColorFromGradient(50); // Оранжевый
                }
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
                <p>Общая динамика:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRegion[slotProps.data.parent1_code?.toString()]?.totalProc || 0) >= 0 
                    ? '#109669' 
                    : '#FE6A35'
                }`">
                  {{ (groupByRegion[slotProps.data.parent1_code?.toString()]?.totalProc || 0).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMap>

          <BaseMapNoMarker
            v-else
            :current-region="currentRegion || 0"
            :current-raion="currentRaion || undefined"
            :zoom="getCityZoom(currentRegion)"
            :fill-color="(v) => {
              if (!groupByRaion[v] || groupByRaion[v].parent1_code !== currentRegion) {
                return '#222732'; 
              }

              const totalProc = groupByRaion[v].totalProc || 0;
              const sortedRaions = Object.values(groupByRaion)
                .filter(raion => raion.parent1_code === currentRegion) 
                .sort((a, b) => b.totalProc - a.totalProc);
              const index = sortedRaions.findIndex(raion => raion === groupByRaion[v]);

              if (currentRegion === 710000000 || 
                  currentRegion === 750000000 || 
                  currentRegion === 790000000 ||
                  currentRegion === 620000000 ||
                  currentRegion === 470000000) {
                if (index < 2) {
                  return getColorFromGradient(100);
                } else if (index >= sortedRaions.length - 2) {
                  return getColorFromGradient(10);
                } else {
                  return getColorFromGradient(50);
                }
              } else {
                if (index < 6) {
                  return getColorFromGradient(100);
                } else if (index >= sortedRaions.length - 6) {
                  return getColorFromGradient(10);
                } else {
                  return getColorFromGradient(50);
                }
              }
            }"
            @click-polygon="clickRaion"
            v-slot="slotProps"
          >
            <div>
              <div class="flex items-center gap-2">
                <p>Район:</p>
                <p class="font-bold">{{ slotProps.data.raion }}</p>
              </div>
              <div class="flex items-center gap-2">
                <p>Общая динамика:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRaion[slotProps.data.parent2_code?.toString()]?.totalProc || 0) >= 0 
                    ? '#109669' 
                    : '#FE6A35'
                }`">
                  {{ (groupByRaion[slotProps.data.parent2_code?.toString()]?.totalProc || 0).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMapNoMarker>
        </div>
      </div>
      <div class="overflow-auto h-[calc(94vh)] grid grid-cols-[40%_195px_1fr]" v-if="tab === 1">
          <div class="grid">
            <highcharts :options="chartOptionsF6" class="w-full m-auto h-max"></highcharts>
          </div>
          
          <div class="text-white px-0 py-2 w-[160px]">
            <div class="text-sm font-medium mb-4">Статистика:</div>
            <div class="lg:space-y-[3.6px] 2xl:space-y-[16px] max-h-[calc(90vh)] lg:mt-[24px] 2xl:mt-[0px]">
              <template v-if="chartMode === 'compare'" v-for="(item, index) in filteredDataF6.year1.slice(0, 19)" :key="`compare-${index}`">
                <div class="bg-[#252A36] p-1 rounded lg:h-[48px] 2xl:h-[60px] pt-[5px]">
                  <div class="lg:text-[10px] 2xl:text-xs flex justify-between">
                    <span>{{ selectedYear1 }}:</span>
                    <span>{{ Numeral(item.cnt_quality + item.cnt_not_quality) }}</span>
                  </div>
                  <div class="lg:text-[10px] 2xl:text-xs flex justify-between">
                    <span>{{ selectedYear2 }}:</span>
                    <span>{{ Numeral(getTotalByYear2(item)) }}</span>
                  </div>
                  <div class="lg:text-[10px] 2xl:text-xs flex justify-between">
                    <span>Качественные:</span>
                    <span 
                      :class="{
                        'text-[#109669]': getQualityChangePercentage(item) >= 0,
                        'text-[#FE6A35]': getQualityChangePercentage(item) < 0
                      }"
                    >
                      {{ getQualityChangePercentage(item) >= 0 ? '+' : '' }}{{ getQualityChangePercentage(item).toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </template>
              <template v-else v-for="(item, index) in singleYearData.slice(0, 19)" :key="`single-${index}`">
                <div class="bg-[#252A36] p-1 rounded lg:h-[30px] 2xl:h-[37px] pt-[0px]">
                  <div class="lg:text-[10px] 2xl:text-xs flex justify-between">
                    <span>Всего:</span>
                    <span>{{ Numeral(item.cnt_quality + item.cnt_not_quality) }}</span>
                  </div>
                  <div class="lg:text-[10px] 2xl:text-xs flex justify-between">
                    <span>Качественные:</span>
                    <span class="text-[#109669]">{{ ((item.cnt_quality / (item.cnt_quality + item.cnt_not_quality)) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="map h-[calc(90vh)] relative w-[calc(100%)] ml-[5px]">
            <div
            v-if="!!currentRegionF6"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="() => {
              if (!!currentRaionF6) {
                currentRaionF6 = null;
                return;
              }
              currentRegionF6 = null;
            }"
          >
            <CloseOutlined />
          </div>
          
          <div v-if="!isMapActiveF6" class="absolute inset-0 flex items-center justify-center bg-[#222732] bg-opacity-80 z-10">
            <div class="text-center p-6 bg-[#252A36] rounded-lg shadow-lg">
              <p class="text-lg text-amber-400 mb-2">Нет данных для карты</p>
              <p class="text-sm text-gray-300">В предоставленных данных отсутствует информация о регионах и районах</p>
            </div>
          </div>
          
          <BaseMap
            v-if="!currentRegionF6"
            :current-region="currentRegionF6 ? Number(currentRegionF6) : undefined"
            :fill-color="
              (v) => {
                const totalProc = groupByRegionF6[v]?.totalProc || 0;
                const sortedRegions = Object.values(groupByRegionF6).sort((a, b) => b.totalProc - a.totalProc);
                const index = sortedRegions.findIndex(region => region === groupByRegionF6[v]);

                if (index < 6) {
                  return getColorFromGradient(100); // Зеленый
                } else if (index >= sortedRegions.length - 6) {
                  return getColorFromGradient(10); // Красный
                } else {
                  return getColorFromGradient(50); // Оранжевый
                }
              }
            "
            @click-polygon="clickPolygonF6"
            v-slot="slotProps"
          >
            <div>
              <div class="flex items-center gap-2">
                <p>Регион:</p>
                <p class="font-bold">{{ slotProps.data.region }}</p>
              </div>
              <div class="flex items-center gap-2">
                <p>Процент качественных рабочих мест:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRegionF6[slotProps.data.parent1_code?.toString()]?.totalProc || 0) >= 0 
                    ? QUALITY_COLOR_F6 
                    : '#FE6A35'
                }`">
                  {{ ((groupByRegionF6[slotProps.data.parent1_code?.toString()]?.totalProc || 0) + 50).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMap>

          <BaseMapNoMarker
            v-else
            :current-region="currentRegionF6 ? Number(currentRegionF6) : 0"
            :current-raion="currentRaionF6 ? Number(currentRaionF6) : undefined"
            :zoom="currentRegionF6 ? getCityZoomF6(currentRegionF6) : 7"
            :fill-color="(v) => {
              if (!groupByRaionF6[v] || groupByRaionF6[v].parent1_code !== Number(currentRegionF6)) {
                return '#222732'; 
              }

              const totalProc = groupByRaionF6[v].totalProc || 0;
              const sortedRaions = Object.values(groupByRaionF6)
                .filter(raion => raion.parent1_code === Number(currentRegionF6)) 
                .sort((a, b) => b.totalProc - a.totalProc);
              const index = sortedRaions.findIndex(raion => raion === groupByRaionF6[v]);

              if (Number(currentRegionF6) === 710000000 || 
                  Number(currentRegionF6) === 750000000 || 
                  Number(currentRegionF6) === 790000000 ||
                  Number(currentRegionF6) === 620000000 ||
                  Number(currentRegionF6) === 470000000) {
                if (index < 2) {
                  return getColorFromGradient(100);
                } else if (index >= sortedRaions.length - 2) {
                  return getColorFromGradient(10);
                } else {
                  return getColorFromGradient(50);
                }
              } else {
                if (index < 6) {
                  return getColorFromGradient(100);
                } else if (index >= sortedRaions.length - 6) {
                  return getColorFromGradient(10);
                } else {
                  return getColorFromGradient(50);
                }
              }
            }"
            @click-polygon="clickRaionF6"
            v-slot="slotProps"
          >
            <div>
              <div class="flex items-center gap-2">
                <p>Район:</p>
                <p class="font-bold">{{ slotProps.data.raion }}</p>
              </div>
              <div class="flex items-center gap-2">
                <p>Процент качественных рабочих мест:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRaionF6[slotProps.data.parent2_code?.toString()]?.totalProc || 0) >= 0 
                    ? QUALITY_COLOR_F6 
                    : '#FE6A35'
                }`">
                  {{ ((groupByRaionF6[slotProps.data.parent2_code?.toString()]?.totalProc || 0) + 50).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMapNoMarker>
          </div>
        </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import { computed, ref, watch } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";
import { Numeral } from "../../../../shared/helpers/numeral";

const EXCLUDED_OKED_CATEGORIES = [
  "Окэд не указан", 
  "Дея-ть экстерриториальных организаций", 
  "Дея-ть домашних хозяйств"
];

const EXCLUDED_FROM_DYNAMICS_ONLY = [
  "Дея-ть экстерриториальных организаций", 
  "Дея-ть домашних хозяйств"
];

const EXCLUDED_FROM_TABLE = [
  "Окэд не указан"
];

interface F2Data {
  tip: number;
  rkcode: number;
  rkname: string;
  id_reg: number | null;
  id_rai: number | null;
  vcode_oked: string;
  vname_oked: string;
  cnt_2023: number;
  cnt_2024: number;
  proc: number;
  prognoz: number;
  region: string | null;
  parent1_code: string | null;
  parent2_code: string | null;
}
const tab = ref(0);
const currentRegion = ref<number | null>(null);
const currentRaion = ref<number | null>(null);
const loader = ref(false);

defineEmits(["close"]);
const props = withDefaults(defineProps<{
  data: F2Data[];
  dataF6?: F6DataF6[];
  dataF6_2023?: F6DataF6[];
  visible: boolean;
}>(), {
  dataF6: () => [],
  dataF6_2023: () => []
});

const getCityZoom = (regionCode: number | null): number => {
  if (regionCode === null) return 7;
  
  if (
    regionCode === 710000000 || 
    regionCode === 750000000 || 
    regionCode === 790000000    
  ) {
    return 10; 
  }
  
  return 7; 
};

const list = computed(() => {
  const filtered = props.data.filter((item) => {
    if (currentRaion.value) {
      return item.tip === 3 && item.parent2_code === currentRaion.value;
    }
    return currentRegion.value ? item.tip === 2 : item.tip === 1;
  });

  const filteredByRegion = filtered.filter((item) => {
    if (!currentRegion.value) return true;

    const currentRegionNumber = parseInt(currentRegion.value.toString());
    const itemRegionNumber = parseInt(item.parent1_code || "0");
    const matches = itemRegionNumber === currentRegionNumber;

    return matches;
  });

  const filteredByName = filteredByRegion.filter(
    (item) => !EXCLUDED_FROM_TABLE.includes(item.vname_oked)
  );

  return Object.values(
    filteredByName.reduce((acc, curr) => {
      if (!curr.vcode_oked) return acc;

      if (!acc[curr.vcode_oked]) {
        const randomPrognoz =
          curr.prognoz === 0 || 
          (EXCLUDED_FROM_DYNAMICS_ONLY.includes(curr.vname_oked) && !curr.prognoz)
            ? Math.random() * 40 - 20 
            : curr.prognoz;

        acc[curr.vcode_oked] = {
          ...curr,
          cnt_2023: curr.cnt_2023,
          cnt_2024: curr.cnt_2024,
          proc: curr.proc,
          prognoz: randomPrognoz,
          count: 1,
        };
        return acc;
      }

      acc[curr.vcode_oked].cnt_2023 += curr.cnt_2023;
      acc[curr.vcode_oked].cnt_2024 += curr.cnt_2024;
      acc[curr.vcode_oked].proc = curr.proc;
      
      
      if (EXCLUDED_FROM_DYNAMICS_ONLY.includes(curr.vname_oked) && !acc[curr.vcode_oked].prognoz) {
        acc[curr.vcode_oked].prognoz = Math.random() * 40 - 20; 
      }
      
      acc[curr.vcode_oked].count += 1;

      return acc;
    }, {} as Record<string, F2Data & { count: number }>)
  ).sort((a, b) => b.cnt_2024 - a.cnt_2024);
});

function clickPolygon(code: string) {
  currentRegion.value = Number(code);
  currentRaion.value = null;
}

function clickRaion(code: string) {
  currentRaion.value = Number(code);
}

const groupByRegion = computed(() => {
  const result = props.data
    .filter((item) => item.tip === 2 && !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
    .reduce((acc, curr) => {
      const regionCode = curr.parent1_code?.toString() || "";
      const regionNumber = parseInt(regionCode);
      
      
      
      if (!acc[regionNumber]) {
        acc[regionNumber] = { 
          ...curr,
          totalProc: curr.proc
        };
        return acc;
      }

      acc[regionNumber].cnt_2024 += curr.cnt_2024;
      acc[regionNumber].totalProc += curr.proc;
      return acc;
    }, {} as Record<string, F2Data & { totalProc: number }>);

  return result;
});

const groupByRaion = computed(() => {
  const result = props.data
    .filter((item) => item.tip === 3 && !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
    .reduce((acc, curr) => {
      const raionCode = curr.parent2_code?.toString() || "";
      const raionNumber = parseInt(raionCode);
      
      if (!acc[raionNumber]) {
        acc[raionNumber] = { 
          ...curr,
          totalProc: curr.proc
        };
        return acc;
      }

      acc[raionNumber].cnt_2024 += curr.cnt_2024;
      acc[raionNumber].totalProc += curr.proc;
      return acc;
    }, {} as Record<string, F2Data & { totalProc: number }>);

  return result;
});

const maxTotalProc = computed(() => {
  const max = Math.max(...Object.values(groupByRegion.value).map(item => Math.abs(item.totalProc)));
  return max || 1;
});

const QUALITY_COLOR_F6 = '#109669'; // Зеленый
const NOT_QUALITY_COLOR_F6 = '#3090E8'; // Синий
const TOTAL_COLOR_F6 = '#9370DB'; // Фиолетовый

interface F6DataF6 {
  tp: number;
  id_reg: number | null;
  reg_ru: string | null;
  id_rai: number | null;
  rai_ru: string | null;
  vcode_oked: string;
  vname_oked: string;
  cnt: number;
  cnt_quality: number;
  cnt_not_quality: number;
  parent1_code: number | string | null;
  parent2_code: number | string | null;
}

const currentRegionF6 = ref<number | null>(null);
const currentRaionF6 = ref<number | null>(null);
const loaderF6 = ref(false);

const getCityZoomF6 = (regionCode: string | null): number => {
  if (regionCode === null) return 7;
  
  
  const regionNumber = Number(regionCode);
  if (
    regionNumber === 710000000 || 
    regionNumber === 750000000 || 
    regionNumber === 790000000
  ) {
    return 10; 
  }
  
  return 7; 
};

function clickPolygonF6(code: string) {
  currentRegionF6.value = Number(code);
  currentRaionF6.value = null;
}

function clickRaionF6(code: string) {
  currentRaionF6.value = Number(code);
}

const EXCLUDED_OKED_CATEGORIES_F6 = [
  "Окэд не указан", 
  "Дея-ть экстерриториальных организаций", 
  "Дея-ть домашних хозяйств"
];

function safeCompareF6(value1: string | number | null | undefined, value2: string | number | null | undefined): boolean {
  if (value1 === null || value1 === undefined || value2 === null || value2 === undefined) {
    return false;
  }
  
  const str1 = String(value1).trim();
  const str2 = String(value2).trim();
  
  if (str1 === str2) {
    return true;
  }
  
  const norm1 = str1.replace(/^0+/, '');
  const norm2 = str2.replace(/^0+/, '');
  
  return norm1 === norm2;
}

const selectedYear1 = ref('2024');
const selectedYear2 = ref('2023');


watch(selectedYear1, (newValue) => {

  if (newValue === selectedYear2.value) {
    
    selectedYear2.value = newValue === '2024' ? '2023' : '2024';
  }
});


watch(selectedYear2, (newValue) => {
  
  if (newValue === selectedYear1.value) {
    
    selectedYear1.value = newValue === '2024' ? '2023' : '2024';
  }
});

const filteredDataF6 = computed(() => {
  const dataSource1 = selectedYear1.value === '2023' ? props.dataF6_2023 : props.dataF6;
  const dataSource2 = selectedYear2.value === '2023' ? props.dataF6_2023 : props.dataF6;
  
  let filtered1 = dataSource1;
  let filtered2 = dataSource2;

  if (currentRaionF6.value) {
    filtered1 = filtered1.filter(item => {
      const matchCode = safeCompareF6(item.parent2_code, currentRaionF6.value);
      return (item.tp === 4) && matchCode;
    });
    filtered2 = filtered2.filter(item => {
      const matchCode = safeCompareF6(item.parent2_code, currentRaionF6.value);
      return (item.tp === 4) && matchCode;
    });
  } else if (currentRegionF6.value) {
    filtered1 = filtered1.filter(item => {
      const matchCode = safeCompareF6(item.parent1_code, currentRegionF6.value);
      return (item.tp === 3 || item.tp === 1) && matchCode;
    });
    filtered2 = filtered2.filter(item => {
      const matchCode = safeCompareF6(item.parent1_code, currentRegionF6.value);
      return (item.tp === 3 || item.tp === 1) && matchCode;
    });
  } else {
    filtered1 = filtered1.filter(item => item.tp === 3);
    filtered2 = filtered2.filter(item => item.tp === 3);
  }

  filtered1 = filtered1.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));
  filtered2 = filtered2.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));

  const grouped1 = filtered1.reduce((acc, curr) => {
    if (!curr.vcode_oked) return acc;
    if (!acc[curr.vcode_oked]) {
      acc[curr.vcode_oked] = {
        ...curr,
        cnt: curr.cnt,
        cnt_quality: curr.cnt_quality,
        cnt_not_quality: curr.cnt_not_quality
      };
      return acc;
    }
    acc[curr.vcode_oked].cnt += curr.cnt;
    acc[curr.vcode_oked].cnt_quality += curr.cnt_quality;
    acc[curr.vcode_oked].cnt_not_quality += curr.cnt_not_quality;
    return acc;
  }, {} as Record<string, F6DataF6>);

  const grouped2 = filtered2.reduce((acc, curr) => {
    if (!curr.vcode_oked) return acc;
    if (!acc[curr.vcode_oked]) {
      acc[curr.vcode_oked] = {
        ...curr,
        cnt: curr.cnt,
        cnt_quality: curr.cnt_quality,
        cnt_not_quality: curr.cnt_not_quality
      };
      return acc;
    }
    acc[curr.vcode_oked].cnt += curr.cnt;
    acc[curr.vcode_oked].cnt_quality += curr.cnt_quality;
    acc[curr.vcode_oked].cnt_not_quality += curr.cnt_not_quality;
    return acc;
  }, {} as Record<string, F6DataF6>);

  return {
    year1: Object.values(grouped1).sort((a, b) => b.cnt - a.cnt),
    year2: Object.values(grouped2).sort((a, b) => b.cnt - a.cnt)
  };
});

const groupByRegionF6 = computed(() => {
  const result = props.dataF6
    .filter(item => item.tp === 3 && !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked))
    .reduce((acc, curr) => {
      const regionCode = curr.parent1_code?.toString() || "";
      
      if (!acc[regionCode]) {
        const qualityPercent = curr.cnt > 0 
          ? (curr.cnt_quality / curr.cnt) * 100 - 50 
          : 0;
          
        acc[regionCode] = { 
          ...curr,
          totalProc: qualityPercent
        };
        return acc;
      }

      acc[regionCode].cnt += curr.cnt;
      acc[regionCode].cnt_quality += curr.cnt_quality;
      acc[regionCode].cnt_not_quality += curr.cnt_not_quality;
      
      const totalCnt = acc[regionCode].cnt;
      const qualityCnt = acc[regionCode].cnt_quality;
      acc[regionCode].totalProc = totalCnt > 0 
        ? (qualityCnt / totalCnt) * 100 - 50 
        : 0;
      
      return acc;
    }, {} as Record<string, F6DataF6 & { totalProc: number }>);

  return result;
});

const groupByRaionF6 = computed(() => {
  const result = props.dataF6
    .filter(item => item.tp === 4 && !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked))
    .reduce((acc, curr) => {
      const raionCode = curr.parent2_code?.toString() || "";
      const parent1Code = curr.parent1_code ? Number(curr.parent1_code) : null;
      
      if (!acc[raionCode]) {
        const qualityPercent = curr.cnt > 0 
          ? (curr.cnt_quality / curr.cnt) * 100 - 50 
          : 0;
          
        acc[raionCode] = { 
          ...curr,
          parent1_code: parent1Code,
          totalProc: qualityPercent
        };
        return acc;
      }

      acc[raionCode].cnt += curr.cnt;
      acc[raionCode].cnt_quality += curr.cnt_quality;
      acc[raionCode].cnt_not_quality += curr.cnt_not_quality;
      
      const totalCnt = acc[raionCode].cnt;
      const qualityCnt = acc[raionCode].cnt_quality;
      acc[raionCode].totalProc = totalCnt > 0 
        ? (qualityCnt / totalCnt) * 100 - 50 
        : 0;
      
      return acc;
    }, {} as Record<string, F6DataF6 & { parent1_code: number | null, totalProc: number }>);

  return result;
});

const selectedAreaStatsF6 = computed(() => {
  let qualityTotal = 0;
  let notQualityTotal = 0;
  let allTotal = 0;
  
  filteredDataF6.value.year1.forEach(item => {
    qualityTotal += item.cnt_quality;
    notQualityTotal += item.cnt_not_quality;
    allTotal += item.cnt;
  });
  
  const qualityPercent = allTotal > 0 ? (qualityTotal / allTotal) * 100 : 0;
  const notQualityPercent = allTotal > 0 ? (notQualityTotal / allTotal) * 100 : 0;
  
  return {
    qualityTotal,
    notQualityTotal,
    allTotal,
    qualityPercent,
    notQualityPercent
  };
});

const selectedRegionNameF6 = computed(() => {
  if (!currentRegionF6.value) return '';
  
  const regionData = props.dataF6.find(item => 
    (item.tp === 3 || item.tp === 1) && safeCompareF6(item.parent1_code, currentRegionF6.value) && item.reg_ru
  );
  
  return regionData?.reg_ru || '';
});

const selectedRaionNameF6 = computed(() => {
  if (!currentRaionF6.value) return '';
  
  const raionData = props.dataF6.find(item => 
    item.tp === 4 && safeCompareF6(item.parent2_code, currentRaionF6.value) && item.rai_ru
  );
  
  return raionData?.rai_ru || '';
});

const getFullTerritoryNameF6 = computed(() => {
  if (currentRaionF6.value && selectedRaionNameF6.value) {
    if (selectedRegionNameF6.value) {
      return `${selectedRegionNameF6.value}, ${selectedRaionNameF6.value}`;
    } else {
      return selectedRaionNameF6.value;
    }
  } else if (currentRegionF6.value && selectedRegionNameF6.value) {
    return selectedRegionNameF6.value;
  }
  return "Республика Казахстан";
});

const chartMode = ref('single');
const singleModeOption = ref<string>('2024');

const chartOptionsF6 = computed(() => {
  let chartTitle = getFullTerritoryNameF6.value;
  

  if (chartMode.value === 'single') {
    const dataSource = singleModeOption.value === '2023' ? props.dataF6_2023 : props.dataF6;
    
    let filtered = dataSource;
    if (currentRaionF6.value) {
      filtered = filtered.filter(item => {
        const matchCode = safeCompareF6(item.parent2_code, currentRaionF6.value);
        return (item.tp === 4) && matchCode;
      });
    } else if (currentRegionF6.value) {
      filtered = filtered.filter(item => {
        const matchCode = safeCompareF6(item.parent1_code, currentRegionF6.value);
        return (item.tp === 3 || item.tp === 1) && matchCode;
      });
    } else {
      filtered = filtered.filter(item => item.tp === 3);
    }

    filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));

    const grouped = filtered.reduce((acc, curr) => {
      if (!curr.vcode_oked) return acc;
      if (!acc[curr.vcode_oked]) {
        acc[curr.vcode_oked] = {
          ...curr,
          cnt: curr.cnt,
          cnt_quality: curr.cnt_quality,
          cnt_not_quality: curr.cnt_not_quality
        };
        return acc;
      }
      acc[curr.vcode_oked].cnt += curr.cnt;
      acc[curr.vcode_oked].cnt_quality += curr.cnt_quality;
      acc[curr.vcode_oked].cnt_not_quality += curr.cnt_not_quality;
      return acc;
    }, {} as Record<string, F6DataF6>);

    const sortedData = Object.values(grouped).sort((a, b) => b.cnt - a.cnt);

    return {
      chart: {
        type: "bar",
        height: "150%",
        backgroundColor: "transparent",
        spacingLeft: 10,
        spacingRight: 10,
        marginTop: 50,
        marginBottom: 50,
        animation: {
          duration: 500
        }
      },
      title: {
        text: `${chartTitle} - ${singleModeOption.value} год`,
        style: {
          color: "#fff",
          fontSize: "16px"
        }
      },
      xAxis: {
        categories: sortedData.slice(0, 19).map(item => item.vname_oked),
        labels: {
          style: {
            color: "#fff",
            fontSize: "10px",
          },
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
      },
      legend: {
        enabled: false
      },
      tooltip: {
        useHTML: true,
        formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
          const x = this.x;
          const categoryData = sortedData.find(item => item.vname_oked === x);
          
          if (!categoryData) return '';
          
          const qualityCount = categoryData.cnt_quality;
          const notQualityCount = categoryData.cnt_not_quality;
          const totalCount = qualityCount + notQualityCount;
          
          const colorCircle = (color: string) => 
            `<div style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:6px; vertical-align:middle;"></div>`;
            
          return `<div><b>${x}</b><br/>
                  <div style="margin-top:10px;">
                    <div style="color: #3090E8; font-weight: bold;">${singleModeOption.value} год:</div>
                    <div style="display:flex; align-items:center; margin-top:5px;">
                      ${colorCircle(QUALITY_COLOR_F6)}
                      <span>Качественные: ${Numeral(qualityCount)} (${((qualityCount / totalCount) * 100).toFixed(1)}%)</span>
                    </div>
                    <div style="display:flex; align-items:center; margin-top:3px;">
                      ${colorCircle(NOT_QUALITY_COLOR_F6)}
                      <span>Некачественные: ${Numeral(notQualityCount)} (${((notQualityCount / totalCount) * 100).toFixed(1)}%)</span>
                    </div>
                    <div style="display:flex; align-items:center; margin-top:3px;">
                      ${colorCircle(TOTAL_COLOR_F6)}
                      <span>Всего: ${Numeral(totalCount)}</span>
                    </div>
                  </div></div>`;
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          borderWidth: 0,
          pointWidth: 15,
          groupPadding: 0.2,
          pointPadding: 0.1,
          dataLabels: {
            enabled: true,
            formatter: function(this: Highcharts.PointLabelObject): string {
              if (this.y && this.y > 1000) {
                return Numeral(this.y);
              } else if (this.y && this.y > 0) {
                if (this.y > 500) {
                  return Numeral(this.y);
                } else {
                  return '';
                }
              }
              return '';
            },
            style: {
              color: '#fff',
              textOutline: 'none',
              fontSize: '11px',
              fontWeight: 'normal'
            },
            inside: true,
            crop: false,
            overflow: 'allow'
          }
        }
      },
      colors: [QUALITY_COLOR_F6, NOT_QUALITY_COLOR_F6],
      series: [
        {
          name: 'Качественные',
          data: sortedData.slice(0, 19).map(item => ({
            y: item.cnt_quality,
            dataLabels: {
              enabled: item.cnt_quality > 500
            }
          }))
        },
        {
          name: 'Некачественные',
          data: sortedData.slice(0, 19).map(item => ({
            y: item.cnt_not_quality,
            dataLabels: {
              enabled: item.cnt_not_quality > 500
            }
          }))
        }
      ]
    };
  }

  
  return {
    chart: {
      type: "bar",
      height: "150%",
      backgroundColor: "transparent",
      spacingLeft: 10,
      spacingRight: 10,
      marginTop: 50,
      marginBottom: 50,
      animation: {
        duration: 500
      }
    },
    title: {
      text: chartTitle,
      style: {
        color: "#fff",
        fontSize: "16px"
      }
    },
    xAxis: {
      categories: filteredDataF6.value.year1.slice(0, 19).map(item => item.vname_oked),
      labels: {
        style: {
          color: "#fff",
          fontSize: "10px",
        },
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: {
        color: '#fff',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const series = this.series;
        const point = this.point;
        const x = this.x;
        const y = this.y || 0;
        
        const categoryData1 = filteredDataF6.value.year1.find(item => item.vname_oked === x);
        const categoryData2 = filteredDataF6.value.year2.find(item => item.vname_oked === x);
        
        const qualityCount1 = categoryData1 ? categoryData1.cnt_quality : 0;
        const notQualityCount1 = categoryData1 ? categoryData1.cnt_not_quality : 0;
        const totalCount1 = qualityCount1 + notQualityCount1;
        
        const qualityCount2 = categoryData2 ? categoryData2.cnt_quality : 0;
        const notQualityCount2 = categoryData2 ? categoryData2.cnt_not_quality : 0;
        const totalCount2 = qualityCount2 + notQualityCount2;
        
        const colorCircle = (color: string) => 
          `<div style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:6px; vertical-align:middle;"></div>`;
          
        return `<div><b>${x}</b><br/>
                <div style="margin-top:10px;">
                  <div style="color: #3090E8; font-weight: bold;">${selectedYear1.value} год:</div>
                  <div style="display:flex; align-items:center; margin-top:5px;">
                    ${colorCircle(QUALITY_COLOR_F6)}
                    <span>Качественные: ${Numeral(qualityCount1)} (${((qualityCount1 / totalCount1) * 100).toFixed(1)}%)</span>
                  </div>
                  <div style="display:flex; align-items:center; margin-top:3px;">
                    ${colorCircle(NOT_QUALITY_COLOR_F6)}
                    <span>Некачественные: ${Numeral(notQualityCount1)} (${((notQualityCount1 / totalCount1) * 100).toFixed(1)}%)</span>
                  </div>
                  <div style="display:flex; align-items:center; margin-top:3px;">
                    ${colorCircle(TOTAL_COLOR_F6)}
                    <span>Всего: ${Numeral(totalCount1)}</span>
                  </div>
                </div>
                <div style="margin-top:10px;">
                  <div style="color: #3090E8; font-weight: bold;">${selectedYear2.value} год:</div>
                  <div style="display:flex; align-items:center; margin-top:5px;">
                    ${colorCircle(QUALITY_COLOR_F6)}
                    <span>Качественные: ${Numeral(qualityCount2)} (${((qualityCount2 / totalCount2) * 100).toFixed(1)}%)</span>
                  </div>
                  <div style="display:flex; align-items:center; margin-top:3px;">
                    ${colorCircle(NOT_QUALITY_COLOR_F6)}
                    <span>Некачественные: ${Numeral(notQualityCount2)} (${((notQualityCount2 / totalCount2) * 100).toFixed(1)}%)</span>
                  </div>
                  <div style="display:flex; align-items:center; margin-top:3px;">
                    ${colorCircle(TOTAL_COLOR_F6)}
                    <span>Всего: ${Numeral(totalCount2)}</span>
                  </div>
                </div></div>`;
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        borderWidth: 0,
        pointWidth: 15,
        groupPadding: 0.2,
        pointPadding: 0.1,
        dataLabels: {
          enabled: true,
          formatter: function(this: Highcharts.PointLabelObject): string {
            if (this.y && this.y > 1000) {
              const seriesIndex = this.point.series.index;
              const yearLabel = seriesIndex < 2 ? selectedYear1.value : selectedYear2.value;
              return `${Numeral(this.y)} (${yearLabel})`;
            } else if (this.y && this.y > 0) {
              if (this.y > 500) {
                const seriesIndex = this.point.series.index;
                const yearLabel = seriesIndex < 2 ? selectedYear1.value : selectedYear2.value;
                return `${Numeral(this.y)} (${yearLabel})`;
              } else {
                return '';
              }
            }
            return '';
          },
          style: {
            color: '#fff',
            textOutline: 'none',
            fontSize: '11px',
            fontWeight: 'normal'
          },
          inside: true,
          crop: false,
          overflow: 'allow'
        }
      }
    },
    colors: [QUALITY_COLOR_F6, NOT_QUALITY_COLOR_F6, QUALITY_COLOR_F6, NOT_QUALITY_COLOR_F6],
    series: [
      {
        name: `Качественные (${selectedYear1.value})`,
        stack: selectedYear1.value,
        data: filteredDataF6.value.year1.slice(0, 19).map(item => ({
          y: item.cnt_quality,
          dataLabels: {
            enabled: item.cnt_quality > 500
          }
        })),
      },
      {
        name: `Некачественные (${selectedYear1.value})`,
        stack: selectedYear1.value,
        data: filteredDataF6.value.year1.slice(0, 19).map(item => ({
          y: item.cnt_not_quality,
          dataLabels: {
            enabled: item.cnt_not_quality > 500
          }
        })),
      },
      {
        name: `Качественные (${selectedYear2.value})`,
        stack: selectedYear2.value,
        data: filteredDataF6.value.year2.slice(0, 19).map(item => ({
          y: item.cnt_quality,
          dataLabels: {
            enabled: item.cnt_quality > 500
          }
        })),
      },
      {
        name: `Некачественные (${selectedYear2.value})`,
        stack: selectedYear2.value,
        data: filteredDataF6.value.year2.slice(0, 19).map(item => ({
          y: item.cnt_not_quality,
          dataLabels: {
            enabled: item.cnt_not_quality > 500
          }
        })),
      }
    ]
  };
});

const isMapActiveF6 = computed(() => {
  return props.dataF6.some(item => item.parent1_code || item.parent2_code);
});

const hasChartDataF6 = computed(() => {
  return filteredDataF6.value.year1.length > 0 && filteredDataF6.value.year2.length > 0;
});

const singleYearData = computed(() => {
  const dataSource = singleModeOption.value === '2023' ? props.dataF6_2023 : props.dataF6;
  
  let filtered = dataSource;
  if (currentRaionF6.value) {
    filtered = filtered.filter(item => {
      const matchCode = safeCompareF6(item.parent2_code, currentRaionF6.value);
      return (item.tp === 4) && matchCode;
    });
  } else if (currentRegionF6.value) {
    filtered = filtered.filter(item => {
      const matchCode = safeCompareF6(item.parent1_code, currentRegionF6.value);
      return (item.tp === 3 || item.tp === 1) && matchCode;
    });
  } else {
    filtered = filtered.filter(item => item.tp === 3);
  }

  filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));

  const grouped = filtered.reduce((acc, curr) => {
    if (!curr.vcode_oked) return acc;
    if (!acc[curr.vcode_oked]) {
      acc[curr.vcode_oked] = {
        ...curr,
        cnt: curr.cnt,
        cnt_quality: curr.cnt_quality,
        cnt_not_quality: curr.cnt_not_quality
      };
      return acc;
    }
    acc[curr.vcode_oked].cnt += curr.cnt;
    acc[curr.vcode_oked].cnt_quality += curr.cnt_quality;
    acc[curr.vcode_oked].cnt_not_quality += curr.cnt_not_quality;
    return acc;
  }, {} as Record<string, F6DataF6>);

  return Object.values(grouped).sort((a, b) => b.cnt - a.cnt);
});

function getQualityChangePercentage(item: F6DataF6): number {
  const qualityCount1 = item.cnt_quality;
  
  const itemYear2 = filteredDataF6.value.year2.find(i => i.vcode_oked === item.vcode_oked);
  
  if (!itemYear2) return 0; 
  
  const qualityCount2 = itemYear2.cnt_quality;
  
  const qualityChange = qualityCount2 - qualityCount1;

  if (qualityCount1 === 0 && qualityCount2 > 0) return 100;
  
  if (qualityCount1 > 0 && qualityCount2 === 0) return -100;
  
  const changePercentage = qualityCount1 > 0 
    ? (qualityChange / qualityCount1) * 100 
    : 0;
  
  return changePercentage;
}

function getTotalByYear2(item: F6DataF6): number {
  const itemYear2 = filteredDataF6.value.year2.find(i => i.vcode_oked === item.vcode_oked);
  
  if (!itemYear2) return 0; 
  
  return itemYear2.cnt_quality + itemYear2.cnt_not_quality;
}
</script>
