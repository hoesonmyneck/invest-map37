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
        
        <a-select 
          v-if="tab === 1" 
          class="text-white ml-2 w-40" 
          placeholder="Фильтр 1"
        >
          <a-select-option value="option1">Опция 1</a-select-option>
        </a-select>
        
        <a-select 
          v-if="tab === 1" 
          class="text-white ml-2 w-40"
          placeholder="Фильтр 2"
        >
          <a-select-option value="option1">Опция 1</a-select-option>
        </a-select>
        
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
            :current-region="currentRegion"
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
            :current-region="currentRegion"
            :current-raion="currentRaion"
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
            <div class="space-y-[16px] max-h-[calc(90vh)] mt-[30px]">
              <template v-for="(item, index) in filteredDataF6.slice(0, 19)" :key="index">
                <div class="bg-[#252A36] p-1 rounded h-[37px] pt-[1px]">
                  <div class="text-xs flex justify-between">
                    <span>Всего:</span>
                    <span>{{ Numeral(item.cnt_quality + item.cnt_not_quality) }}</span>
                  </div>
                  <div class="text-xs flex justify-between">
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
import { computed, ref } from "vue";
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
const currentRegion = ref<string | null>(null);
const currentRaion = ref<string | null>(null);
const loader = ref(false);

defineEmits(["close"]);
const props = withDefaults(defineProps<{
  data: F2Data[];
  dataF6?: F6DataF6[];
  visible: boolean;
}>(), {
  dataF6: () => []
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
      return item.tip === 3 && item.parent2_code === parseInt(currentRaion.value);
    }
    return currentRegion.value ? item.tip === 2 : item.tip === 1;
  });

  const filteredByRegion = filtered.filter((item) => {
    if (!currentRegion.value) return true;

    const currentRegionNumber = parseInt(currentRegion.value);
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
  currentRegion.value = code;
  currentRaion.value = null;
}

function clickRaion(code: string) {
  currentRaion.value = code;
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

// Константы цветов для использования в компоненте
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

const currentRegionF6 = ref<string | null>(null);
const currentRaionF6 = ref<string | null>(null);
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
  console.log('Выбран регион с кодом:', code);
  currentRegionF6.value = code;
  currentRaionF6.value = null;
}

function clickRaionF6(code: string) {
  console.log('Выбран район с кодом:', code);
  
  
  const raionData = props.dataF6.find(item => 
    item.tp === 4 && safeCompareF6(item.parent2_code, code)
  );
  
 
  if (raionData && raionData.parent1_code) {
   
    if (!currentRegionF6.value) {
      currentRegionF6.value = raionData.parent1_code.toString();
    }
  }
  
  currentRaionF6.value = code;
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

const filteredDataF6 = computed(() => {
  let filtered = props.dataF6;
  console.log('Всего записей:', props.dataF6.length);

  if (currentRaionF6.value) {
    filtered = filtered.filter(item => {
      const matchCode = safeCompareF6(item.parent2_code, currentRaionF6.value);
      const match = (item.tp === 4) && matchCode;
      return match;
    });
    console.log('После фильтрации по району:', filtered.length);
  } else if (currentRegionF6.value) {
    filtered = filtered.filter(item => {
      const matchCode = safeCompareF6(item.parent1_code, currentRegionF6.value);
      
      const match = (item.tp === 3 || item.tp === 1) && matchCode;
      return match;
    });
    console.log('После фильтрации по региону:', filtered.length);
    
    if (filtered.length < 3) {
      console.log('Мало данных, пробуем альтернативный подход');
      
      const regionInfo = props.dataF6.find(item => 
        item.parent1_code?.toString() === currentRegionF6.value && item.reg_ru
      );
      
      if (regionInfo && regionInfo.reg_ru) {
        console.log('Пробуем фильтровать по имени региона:', regionInfo.reg_ru);
        
        const regionName = regionInfo.reg_ru;
        const regionRecords = props.dataF6.filter(item => 
          (item.tp === 3 || item.tp === 1) && item.reg_ru === regionName
        );
        
        if (regionRecords.length > 0) {
          filtered = regionRecords;
          console.log('Найдено записей по имени региона:', filtered.length);
        }
      }
    }
  } else {
    filtered = filtered.filter(item => item.tp === 3);
    
    if (filtered.length === 0) {
      filtered = props.dataF6.filter(item => item.tp === 1);
      console.log('Используем данные tp=1:', filtered.length);
    }
    
    console.log('Общие данные:', filtered.length);
  }

  filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));
  console.log('После исключения категорий:', filtered.length);
  
  if (filtered.length === 0) {
    console.warn('Данных не найдено, используем запасной вариант');
    
    if (currentRaionF6.value) {
      filtered = props.dataF6.filter(item => item.tp === 4);
    } else if (currentRegionF6.value) {
      filtered = props.dataF6.filter(item => item.tp === 3 || item.tp === 1);
    } else {
      filtered = props.dataF6;
    }
    
    filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES_F6.includes(item.vname_oked));
    console.log('Запасной вариант, записей:', filtered.length);
  }

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
  
  filteredDataF6.value.forEach(item => {
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

const chartOptionsF6 = computed(() => {
  let chartTitle = getFullTerritoryNameF6.value;
  
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
      categories: filteredDataF6.value.slice(0, 19).map(item => item.vname_oked),
      labels: {
        style: {
          color: "#fff",
          fontSize: "10px",
        },
      },
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
        
        const categoryData = filteredDataF6.value.find(item => item.vname_oked === x);
        const qualityCount = categoryData ? categoryData.cnt_quality : 0;
        const notQualityCount = categoryData ? categoryData.cnt_not_quality : 0;
        const totalCount = qualityCount + notQualityCount;
        
       
        const colorCircle = (color: string) => 
          `<div style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:6px; vertical-align:middle;"></div>`;
          
        return `<div><b>${x}</b><br/>
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
                </div></div>`;
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        borderWidth: 0,
        pointWidth: 30,
        minPointLength: 1,
        groupPadding: 0.1,
        pointPadding: 0.05,
        dataLabels: {
          enabled: true,
          formatter: function(this: Highcharts.PointLabelObject): string {
            if (this.y && this.y > 1000) {
              return Numeral(this.y);
            } else if (this.y && this.y > 0) {
              return this.y > 500 ? Numeral(this.y) : '';
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
        data: filteredDataF6.value.slice(0, 19).map(item => ({
          y: item.cnt_quality,
          dataLabels: {
            enabled: item.cnt_quality > 500
          }
        })),
      },
      {
        name: 'Рабочие места',
        data: filteredDataF6.value.slice(0, 19).map(item => ({
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
  return filteredDataF6.value.length > 0;
});
</script>
