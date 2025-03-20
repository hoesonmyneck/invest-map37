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
      <div class="overflow-auto h-[calc(94vh)] grid grid-cols-2">
        <div class="grid">
          <div class="max-h-[100vh] overflow-scroll text-white max-w-[95%]">
            <div
              class="head grid grid-cols-[2fr_120px_120px_135px_130px] mb-2 pb-2 border-b border-gray-600"
            >
              <p>Наименование</p>
              <p>Количество 2023</p>
              <p>Количество 2024</p>
              <p>Прирост 2023/2024</p>
              <p>Прогноз 2025</p>
            </div>
            <div
              class="mt-1 gap-1 grid grid-cols-[2fr_120px_120px_140px_120px] text-[12px]"
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
              <p
                class="h-9 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ !!i.prognoz ? `${+i.prognoz.toFixed(1)} %` : "" }}
              </p>
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

              if (index < 6) {
                return getColorFromGradient(100); // Зеленый
              } else if (index >= sortedRaions.length - 6) {
                return getColorFromGradient(10); // Красный
              } else {
                return getColorFromGradient(50); // Оранжевый
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

const currentRegion = ref<string | null>(null);
const currentRaion = ref<string | null>(null);
const loader = ref(false);

defineEmits(["close"]);
const props = defineProps<{
  data: F2Data[];
}>();

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
</script>
