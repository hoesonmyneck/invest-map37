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
          <div class="flex items-center mb-2 gap-2">
            <p>Поиск:</p>
            <div class="flex items-center gap-2">
              <a-input 
                v-model:value="searchQuery" 
                :placeholder="searchType === 'bin' ? 'Введите БИН' : 'Введите наименование'" 
                class="bg-[#252A36] text-white   h-[26px]" 
                @change="handleSearch"
                @pressEnter="handleSearch"
                style="width: 130px; margin: 0; padding: 0px; border: none;"
                allowClear
              >
                <template #prefix>
                  <SearchOutlined class="text-gray-400" />
                </template>
              </a-input>
              <div class="btn h-[26px]" @click="clearSearch"> Сбросить</div>
            </div>
          </div>
          <div
            class="head grid gap-1 grid-cols-[250px_100px_100px_100px_100px_100px_150px_130px_100px_] text-[10px] pt-4 pb-2 mb-2 border-b border-gray-600">
            <p class="cursor-pointer flex items-center gap-1" @click="toggleSort('full_name')">
              НАИМЕНОВАНИЕ <br><br><br>
              <SortAscendingOutlined v-if="sortField === 'full_name' && sortOrder === 'asc'" class="text-blue-400" />
              <SortDescendingOutlined v-if="sortField === 'full_name' && sortOrder === 'desc'" class="text-blue-400" />
            </p>
            <p class="cursor-pointer flex items-center gap-1" @click="toggleSort('bin')">
              БИН <br><br> {{ formatNumber(filteredBin) }}
              <SortAscendingOutlined v-if="sortField === 'bin' && sortOrder === 'asc'" class="text-blue-400" />
              <SortDescendingOutlined v-if="sortField === 'bin' && sortOrder === 'desc'" class="text-blue-400" />
            </p>
            <p>ТИП</p>
            <p>ПОДТИП</p>
            <p>ПЛОЩАДЬ <br><br> <div v-if="tab === 1"> {{ formatNumber(filteredArea) }}</div><div v-if="tab === 0"> {{ formatNumber(filteredAreaForPlants) }}</div></p>
            <p>ГОЛОВ <br><br> <div v-if="tab === 2"> {{ formatNumber(filteredArea) }}</div><div v-if="tab === 0"> {{ formatNumber(filteredAreaForAnimals) }}</div></p>
            <p>Фактические рабочие места <br><br> {{ formatNumber(filteredWorkPlaces) }}</p>
            <p>Потребность в кадрах <br><br> {{ formatNumber(filteredTotalHeadCount) }}</p>
            <p>Свободные резюме<br><br> {{ formatNumber(filteredIinSum) }}</p>
          </div>
          <div class="overflow-y-auto h-[calc(40vh-50px)] w-full">
            <div
              class="head gap-1 grid grid-cols-[250px_100px_100px_100px_100px_100px_150px_130px_100px_] text-[10px] mt-1"
              v-for="item in displayedItems" :key="item.area + item.full_name">
              <a-tooltip placement="left" :title="item.full_name">
                <p 
                  class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate cursor-pointer" 
                  :class="{ 'bg-blue-800': searchType === 'name' && searchQuery && item.full_name && item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) }"
                  @click="openCompanyPopup(item)"
                >
                  {{ item.full_name }}
                </p>
              </a-tooltip>
              <a-tooltip placement="left" :title="item.bin">
                <p 
                  class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate cursor-pointer" 
                  :class="{ 'bg-blue-800': searchType === 'bin' && searchQuery && item.bin && item.bin.toString().includes(searchQuery) }"
                  @click="selectRegionAndDistrict(item)"
                >
                  {{ item.bin }}
                </p>
              </a-tooltip>
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
            
            <div v-if="filteredItems.length > displayLimit" class="flex justify-center mt-4">
              <a-button type="primary" size="small" @click="showMoreResults">
                Показать больше ({{ displayedItems.length }} из {{ filteredItems.length }})
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="map h-[calc(50vh)] relative">
        <div class="flex items-center justify-between w-full pr-10 mt-5">
          
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
        <div class="w-full flex justify-center text-white">
          Выбрано: 
          <span v-if="!currentRegion" class="ml-2">Республика Казахстан</span>
          <span v-else class="ml-2">
            {{ getRegionName(currentRegion) }}
            <span v-if="currentRaion">, {{ getRaionName(currentRegion, currentRaion) }}</span>
          </span>
        </div>
        <BaseMap 
          v-if="!currentRegion"
          :current-region="0" 
          :fill-color="(v) => {
            const workPlacesData = getWorkPlacesPercentage(+v);
            return workPlacesData.color;
          }" 
          @click-polygon="clickPolygon" 
          v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>Обеспеченность кадрами:</p>
              <p class="font-bold" :style="{ color: getWorkPlacesPercentage(+slotProps.data.parent1_code).color }">
                {{ getWorkPlacesPercentage(+slotProps.data.parent1_code).text }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p>Фактические рабочие места:</p>
              <p class="font-bold">
                {{ Numeral(getRegionWorkPlaces(+slotProps.data.parent1_code)) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p>Потребность в кадрах:</p>
              <p class="font-bold">
                {{ Numeral(getRegionHeadCount(+slotProps.data.parent1_code)) }}
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
            
            const workPlacesData = getWorkPlacesPercentageByRaion(+v);
            return workPlacesData.color;
          }"
          @click-polygon="clickRaion"
          v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Район:</p>
              <p class="font-bold">{{ slotProps.data.raion }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>Обеспеченность кадрами:</p>
              <p class="font-bold" :style="{ color: getWorkPlacesPercentageByRaion(+slotProps.data.parent2_code).color }">
                {{ getWorkPlacesPercentageByRaion(+slotProps.data.parent2_code).text }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p>Фактические рабочие места:</p>
              <p class="font-bold">
                {{ Numeral(getRaionWorkPlaces(+slotProps.data.parent2_code)) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p>Потребность в кадрах:</p>
              <p class="font-bold">
                {{ Numeral(getRaionHeadCount(+slotProps.data.parent2_code)) }}
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

              <p>Местонахождение:</p>
              <p>{{ getCompanyLocation() }}</p>
              
              <p>Тип:</p>
              <p>{{ getCompanyType() }}</p>
              
              <template v-if="hasLivestock()">
                <p>Общее количество голов:</p>
                <p>{{ formatNumber(getTotalLivestock()) }} голов</p>
              </template>
              
              <template v-if="hasCrops()">
                <p>Общая площадь:</p>
                <p>{{ formatNumber(getTotalArea()) }} га</p>
              </template>
            </div>
            
          
            <div class="mt-6">
              <h3 class="text-lg mb-3">Детальная информация</h3>
              <div class="border border-gray-700 rounded overflow-hidden">
                <div class="grid grid-cols-3 gap-2 p-2 bg-[#252A36] text-white text-sm font-medium">
                  <div>Тип</div>
                  <div>Наименование</div>
                  <div>Площадь/Количество</div>
                </div>
                <div v-if="selectedCompany.crop_ru_list && selectedCompany.crop_ru_list.length > 0">
                 
                  <template v-for="(crop, idx) in selectedCompany.crop_ru_list" :key="'animal-'+idx">
                    <div 
                      v-if="selectedCompany.tip_list && selectedCompany.tip_list[idx] !== 1"
                      class="grid grid-cols-3 gap-2 p-2 border-t border-gray-700 text-sm"
                    >
                      <div>Животноводство</div>
                      <div>{{ crop }}</div>
                      <div>
                        {{ formatNumber(selectedCompany.area_list && selectedCompany.area_list[idx] ? selectedCompany.area_list[idx] : 0) }}
                        голов
                      </div>
                    </div>
                  </template>
                  
            
                  <template v-for="(crop, idx) in selectedCompany.crop_ru_list" :key="'plant-'+idx">
                    <div 
                      v-if="selectedCompany.tip_list && selectedCompany.tip_list[idx] === 1"
                      class="grid grid-cols-3 gap-2 p-2 border-t border-gray-700 text-sm"
                    >
                      <div>Растениеводство</div>
                      <div>{{ crop }}</div>
                      <div>
                        {{ formatNumber(selectedCompany.area_list && selectedCompany.area_list[idx] ? selectedCompany.area_list[idx] : 0) }}
                        га
                      </div>
                    </div>
                  </template>
                </div>
                <div v-else class="p-3 text-center text-gray-400">
                  Нет данных о видах культур и животных
                </div>
              </div>
            </div>
            
          </div>
          <div class="mt-10">
              <highcharts 
                v-if="selectedCompany" 
                :options="getCompanyChartOptions()" 
                class="w-full h-[500px]"
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
import { CloseOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, HistoryOutlined } from "@ant-design/icons-vue";
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
  tip_list?: number[];
  area_list?: number[];
  crop_ru_list?: string[];
  iin_list?: number[];
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
const currentRegion = ref<number | null>(null);
const currentRaion = ref<number | null>(null);
const f7Data = ref<F7Item[]>([]);
const f5Data = ref<F5Item[]>([]);
const selectedCompany = ref<F5_1Item | null>(null);
const companyPopupVisible = ref(false);
const searchQuery = ref('');
const searchType = ref('bin');
const sortField = ref('');
const sortOrder = ref('asc');
const displayLimit = ref(30);

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
      +item.tip === 2
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

const getWorkPlacesPercentage = (regionCode: number): { percentage: number; color: string; text: string } => {
  const filteredData = f7Data.value.filter((item: F7Item) => 
    item.parent1_code === regionCode && 
    (tab.value === 0 ? true : item.tip === (tab.value === 1 ? 1 : 2))
  );
  
  const workPlaces = filteredData.reduce((acc: number, curr: F7Item) => acc + (curr.work_places || 0), 0);
  const headCount = filteredData.reduce((acc: number, curr: F7Item) => acc + (curr.total_head_count || 0), 0);
  
  if (headCount === 0) return { percentage: 0, color: '#FFA559', text: '0%' };
  
  const percentage = Math.round((workPlaces / headCount) * 100);
  let color = '#0CCF89'; 
  let text = `+${percentage - 100}%`;
  
  if (percentage < 100) {
   
    const redIntensity = Math.min(255, Math.max(100, 255 - (percentage * 1.5)));
    color = `rgb(${redIntensity}, 89, 89)`;
    text = `-${100 - percentage}%`;
  } else if (percentage === 100) {
    color = '#FFA559'; 
    text = '0%';
  } else if (percentage > 100) {
    
    const greenIntensity = Math.min(255, Math.max(100, 100 + (percentage - 100) * 1.5));
    color = `rgb(12, ${greenIntensity}, 89)`;
  }
  
  return { percentage, color, text };
};

const getWorkPlacesPercentageByRaion = (raionCode: number): { percentage: number; color: string; text: string } => {
  const filteredData = f7Data.value.filter((item: F7Item) => 
    item.parent2_code === raionCode && 
    (tab.value === 0 ? true : item.tip === (tab.value === 1 ? 1 : 2))
  );
  
  const workPlaces = filteredData.reduce((acc: number, curr: F7Item) => acc + (curr.work_places || 0), 0);
  const headCount = filteredData.reduce((acc: number, curr: F7Item) => acc + (curr.total_head_count || 0), 0);
  
  if (headCount === 0) return { percentage: 0, color: '#FFA559', text: '0%' };
  
  const percentage = Math.round((workPlaces / headCount) * 100);
  let color = '#0CCF89'; 
  let text = `+${percentage - 100}%`;
  
  if (percentage < 100) {
 
    const redIntensity = Math.min(255, Math.max(100, 255 - (percentage * 1.5)));
    color = `rgb(${redIntensity}, 89, 89)`;
    text = `-${100 - percentage}%`;
  } else if (percentage === 100) {
    color = '#FFA559'; 
    text = '0%';
  } else if (percentage > 100) {
    
    const greenIntensity = Math.min(255, Math.max(100, 100 + (percentage - 100) * 1.5));
    color = `rgb(12, ${greenIntensity}, 89)`;
  }
  
  return { percentage, color, text };
};

const groupByRaion = (): Record<number, F5Item> => data.value
  .filter(
    (item) =>
      +item.tip === 2
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
  
  
  selectRegionAndDistrict(company);
};


const getCompanyChartOptions = () => {
  if (!selectedCompany.value) return {};
  
  return {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "Трудовые ресурсы организации и района",
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
      enabled: true,
      itemStyle: {
        color: "#fff"
      }
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        borderWidth: 0,
        grouping: false,
        pointPadding: 0.1
      },
      series: {
        pointWidth: 40
      }
    },
    series: [
      {
        name: "Организация",
        pointPlacement: -0,
        data: [
          {
            y: selectedCompany.value.work_places,
            color: "#3090E8"
          },
          {
            y: selectedCompany.value.total_head_count,
            color: "#3090E8"
          },
          {
            y: selectedCompany.value.iin_sum,
            color: "#3090E8",
          }
        ],
        dataLabels: {
          enabled: true,
          color: "#fff",
          formatter: function(this: any): string {
            return Numeral(this.y);
          }
        }
      },
      {
        name: "Район",
        pointPlacement: 0.2,
        data: [
          {
            y: getDistrictTotal('work_places'),
            color: "",
            borderWidth: 2,
            borderDashStyle: 'shortdash',
            borderColor: '#544fc5'
          },
          {
            y: getDistrictTotal('total_head_count'),
            color: "",
            borderWidth: 2,
            borderDashStyle: 'shortdash',
            borderColor: '#544fc5'
          },
        ],
        dataLabels: {
          enabled: true,
          color: "#fff",
          formatter: function(this: any): string {
            return Numeral(this.y);
          }
        }
      }
    ]
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

const getCompanyType = () => {
  if (!selectedCompany.value || !selectedCompany.value.tip_list) return '';
  
  const company = selectedCompany.value;
  const hasAnimalHusbandry = company.tip_list?.some(tip => tip !== 1) || false;
  const hasCrops = company.tip_list?.some(tip => tip === 1) || false;
  
  if (hasAnimalHusbandry && hasCrops) {
    return 'Животноводство и Растениеводство';
  } else if (hasAnimalHusbandry) {
    return 'Животноводство';
  } else if (hasCrops) {
    return 'Растениеводство';
  }
  
  return company.tip === 1 ? 'Растениеводство' : 'Животноводство';
};

const hasLivestock = () => {
  if (!selectedCompany.value || !selectedCompany.value.tip_list) return false;
  return selectedCompany.value.tip_list.some(tip => tip !== 1);
};

const getTotalLivestock = () => {
  if (!selectedCompany.value || !selectedCompany.value.tip_list || !selectedCompany.value.area_list) return 0;
  
  const company = selectedCompany.value;
  let total = 0;
  company.tip_list?.forEach((tip, index) => {
    if (tip !== 1 && company.area_list) {
      total += company.area_list[index] || 0;
    }
  });
  
  return total;
};

const hasCrops = () => {
  if (!selectedCompany.value || !selectedCompany.value.tip_list) return false;
  return selectedCompany.value.tip_list.some(tip => tip === 1);
};

const getTotalArea = () => {
  if (!selectedCompany.value || !selectedCompany.value.tip_list || !selectedCompany.value.area_list) return 0;
  
  const company = selectedCompany.value;
  let total = 0;
  company.tip_list?.forEach((tip, index) => {
    if (tip === 1 && company.area_list) {
      total += company.area_list[index] || 0;
    }
  });
  
  return total;
};

const getCompanyLocation = () => {
  if (!selectedCompany.value) return '';
  
 
  const parentCode = selectedCompany.value.parent1_code;
  const districtCode = selectedCompany.value.parent2_code;
  
  let regionName = '';
  let districtName = '';
  

  const regionData = data.value.find(item => item.parent1_code === parentCode);
  if (regionData) {
    regionName = regionData.region;
  }
  
 
  const districtData = data.value.find(item => 
    item.parent2_code === districtCode && 
    item.parent1_code === parentCode
  );
  if (districtData) {
    districtName = districtData.raion;
  }
  
  if (regionName && districtName) {
    return `${regionName}, ${districtName}`;
  } else if (regionName) {
    return regionName;
  } else {
    return 'Не указано';
  }
};

const selectRegionAndDistrict = (item: F5_1Item) => {
  if (item.parent1_code) {
    currentRegion.value = item.parent1_code;
    
   
    if (item.parent2_code !== undefined) {
      setTimeout(() => {
        currentRaion.value = Number(item.parent2_code);
      }, 300);
    }
    
    
    setTimeout(() => {
      const mapElement = document.querySelector('.map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }
};





const handleSearch = () => {
  searchQuery.value = searchQuery.value.trim();
  displayLimit.value = 30;
};


const clearSearch = () => {
  searchQuery.value = '';
};

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const filteredItems = computed(() => {
  let result = dataListFiltered.value;
  if (searchQuery.value) {
    if (searchType.value === 'bin') {
      result = result.filter(item => 
        item.bin && item.bin.toString().includes(searchQuery.value)
      );
    } else {
      result = result.filter(item => 
        item.full_name && item.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
  }
  
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let valueA, valueB;
      if (sortField.value === 'bin') {
        valueA = a.bin ? a.bin.toString() : '';
        valueB = b.bin ? b.bin.toString() : '';
      } else if (sortField.value === 'full_name') {
        valueA = a.full_name || '';
        valueB = b.full_name || '';
      } else {
        return 0;
      }
      if (sortOrder.value === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }
  
  return result;
});

const showMoreResults = () => {
  displayLimit.value += 30;
};

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, displayLimit.value);
});

const getRegionWorkPlaces = (regionCode: number): number => {
  return f7Data.value
    .filter((item: F7Item) => item.parent1_code === regionCode)
    .reduce((acc: number, curr: F7Item) => acc + (curr.work_places || 0), 0);
};

const getRegionHeadCount = (regionCode: number): number => {
  return f7Data.value
    .filter((item: F7Item) => item.parent1_code === regionCode)
    .reduce((acc: number, curr: F7Item) => acc + (curr.total_head_count || 0), 0);
};

const getRaionWorkPlaces = (raionCode: number): number => {
  return f7Data.value
    .filter((item: F7Item) => item.parent2_code === raionCode)
    .reduce((acc: number, curr: F7Item) => acc + (curr.work_places || 0), 0);
};

const getRaionHeadCount = (raionCode: number): number => {
  return f7Data.value
    .filter((item: F7Item) => item.parent2_code === raionCode)
    .reduce((acc: number, curr: F7Item) => acc + (curr.total_head_count || 0), 0);
};

const filteredAreaForPlants = computed(() => {
  const selectedTip = 1; 
  
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

const filteredAreaForAnimals = computed(() => {
  const selectedTip = 2; 
  
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

const getRegionName = (regionCode: number): string => {
  const region = data.value.find(item => item.parent1_code === regionCode);
  return region ? region.region : `Регион ${regionCode}`;
};

const getRaionName = (regionCode: number, raionCode: number): string => {
  const raion = data.value.find(item => 
    item.parent1_code === regionCode && 
    item.parent2_code === raionCode
  );
  return raion ? raion.raion : `Район ${raionCode}`;
};
</script>

<style scoped lang="scss">
.block {
  @apply h-8 px-3 flex items-center bg-[#252A36] rounded w-full;
}
</style>
