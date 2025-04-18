<template>
  <div class="text-white relative">
    <div class="absolute pl-4 z-[2000] overflow-auto w-full">
      <ul class="py-1 flex gap-2 text-nowrap">
        <template v-for="l in listLabels" :key="l.name">
          <li
            @click="programStore.setCurrentKey(l.key)"
            class="w-max p-1 bg-[#252A36] text-xs cursor-pointer items-center gap-2 border justify-between mb-1 px-3 h-max"
            :class="{
              'border-[#3090E8]': current_key === l.key,
              'border-gray-700': current_key !== l.key,
            }"
          >
            <div class="flex items-center gap-2">
              <img :src="l.icon" alt="" class="w-[20px] h-[20px]" />
              <p>{{ l.name }}</p>
            </div>
          </li>
        </template>
      </ul>
    </div>
    
    <div
      v-if="!!currentRegion || !!currentRaion"
      class="rounded absolute z-[2001] top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
      @click="handleReset"
    >
      <CloseOutlined />
    </div>
    
    <div class="map-container ml-3" style="margin-top: 30px;">
      <div class="map-absolute">
        <BaseMap
          v-if="!regionNumber"
          :current-region="undefined"
          :fill-color="getRegionFillColor"
          @click-polygon="clickPolygon"
          v-slot="slotProps"
        >
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
            <div class="flex items-center gap-2" v-if="groupByRegion && groupByRegion[slotProps.data.id_reg]">
              <p class="mb-2">
                Участники:
                <span class="font-bold">{{
                  groupByRegion[slotProps.data.id_reg].total
                }}</span>
              </p>
            </div>
          </div>
        </BaseMap>
        
        <BaseMapNoMarker
          v-if="regionNumber"
          :current-region="regionNumber"
          :current-raion="raionNumber"
          :zoom="getCityZoom(currentRegion)"
          :fill-color="getRaionFillColor"
          @click-polygon="clickRaion"
          v-slot="slotProps"
        >
          <div>
            <div class="flex items-center gap-2">
              <p>Район:</p>
              <p class="font-bold">{{ slotProps.data.raion }}</p>
            </div>
            <div class="flex items-center gap-2" v-if="groupByRaion && groupByRaion[slotProps.data.id_rai]">
              <p class="mb-2">
                Участники:
                <span class="font-bold">{{
                  groupByRaion[slotProps.data.id_rai].total
                }}</span>
              </p>
            </div>
          </div>
        </BaseMapNoMarker>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useProgramStore } from "../store";
import { storeToRefs } from "pinia";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import { useRegionStore } from "../../../../entities/region/store";
import "leaflet/dist/leaflet.css";

const programStore = useProgramStore();
const regionStore = useRegionStore();
const { current_key, currentRegion, currentRaion, serpin, aulAmanati, diplommenAulga } =
  storeToRefs(programStore);

onMounted(() => {
  console.log("B5Widget mounted");
  console.log("regionPolygons:", regionStore.regionPolygons);
  console.log("raionPolygons:", regionStore.raionPolygons);
});

const regionNumber = computed<number | undefined>(() => 
  currentRegion.value !== null ? Number(currentRegion.value) : undefined
);

const raionNumber = computed<number | undefined>(() => 
  currentRaion.value !== null ? Number(currentRaion.value) : undefined
);

const isRegionSelected = computed(() => !!currentRegion.value);

const listLabels = computed(() => [
  { name: "Серпiн", icon: "/images/a_block/map_1.png", key: "serpin" },
  {
    name: "Ауыл аманаты",
    icon: "/images/a_block/map_2.png",
    key: "auyl_amanat",
  },
  {
    name: "Дипломмен ауылға",
    icon: "/images/a_block/map_3.png",
    key: "diplom",
  },
  {
    name: "Ауыл - ел бесiгi",
    icon: "/images/a_block/map_3.png",
    key: "auyl_el",
  },
]);

const maxTotal = computed(
  (): number => {
    if (!groupByRegion.value) return 0;
    return Object.values(groupByRegion.value).reduce(
      (acc, curr: any) => acc + curr.total,
      0
    ) as number;
  }
);

const maxTotalRaion = computed(
  (): number => {
    if (!groupByRaion.value) return 0;
    return Object.values(groupByRaion.value).reduce(
      (acc, curr: any) => acc + curr.total,
      0
    ) as number;
  }
);

const getRegionFillColor = (v: string) => {
  if (!groupByRegion.value || !groupByRegion.value[v]) {
    return getColorFromGradient(0, false, false, 10);
  }
  return getColorFromGradient(
    (groupByRegion.value[v].total / maxTotal.value) * 100,
    false,
    false,
    10
  );
};

const getRaionFillColor = (v: string) => {
  if (!groupByRaion.value || !groupByRaion.value[+v]) {
    return '#dc2626';
  }
  return getColorFromGradient(
    (groupByRaion.value[+v].total / maxTotalRaion.value) * 100,
    false,
    false,
    10
  );
};

const groupByRegion = computed(() => {
  if (current_key.value === "serpin")
    return serpin.value.reduce((acc, curr: any) => {
      if (acc[curr.id_reg]) {
        acc[curr.id_reg].total += curr.total;
        acc[curr.id_reg].value += curr.ispolnayet;
      } else {
        acc[curr.id_reg] = {
          ...curr,
          value: curr.ispolnayet,
        };
      }

      return acc;
    }, {});

  if (current_key.value === "diplom")
    return diplommenAulga.value.reduce((acc, curr: any) => {
      if (acc[curr.id_reg]) {
        const item = acc[curr.id_reg];
        item.value += curr.rabotaet_aul;
        item.total += curr.total;
        item.count += 1;
      } else {
        acc[curr.id_reg] = {
          ...curr,
          count: 1,
          value: curr.rabotaet_aul,
        };
      }

      return acc;
    }, {});

  if (current_key.value === "auyl_amanat")
    return aulAmanati.value.reduce((acc, curr: any) => {
      if (acc[curr.id_reg]) {
        const item = acc[curr.id_reg];
        item.value += curr.active_ip;
        item.total += curr.total;
        item.not_active += curr.not_active;
        item.opv_has += curr.opv_has;
        item.active_ip += curr.active_ip;
        item.loan_price_sum += !!curr.loan_price_sum ? curr.loan_price_sum : 0;
        item.count += 1;
      } else {
        acc[curr.id_reg] = {
          ...curr,
          count: 1,
          value: curr.active_ip,
        };
      }

      return acc;
    }, {});
  
  return {};
});

const groupByRaion = computed(() => {
  if (!currentRegion.value) return {};
  
  if (current_key.value === "serpin")
    return serpin.value.reduce((acc, curr: any) => {
      if (curr.id_reg === currentRegion.value) {
        if (acc[curr.id_rai]) {
          acc[curr.id_rai].total += curr.total;
          acc[curr.id_rai].value += curr.ispolnayet;
        } else {
          acc[curr.id_rai] = {
            ...curr,
            value: curr.ispolnayet,
          };
        }
      }
      return acc;
    }, {});

  if (current_key.value === "diplom")
    return diplommenAulga.value.reduce((acc, curr: any) => {
      if (curr.id_reg === currentRegion.value) {
        if (acc[curr.id_rai]) {
          const item = acc[curr.id_rai];
          item.value += curr.rabotaet_aul;
          item.total += curr.total;
          item.count += 1;
        } else {
          acc[curr.id_rai] = {
            ...curr,
            count: 1,
            value: curr.rabotaet_aul,
          };
        }
      }
      return acc;
    }, {});

  if (current_key.value === "auyl_amanat")
    return aulAmanati.value.reduce((acc, curr: any) => {
      if (curr.id_reg === currentRegion.value) {
        if (acc[curr.id_rai]) {
          const item = acc[curr.id_rai];
          item.value += curr.active_ip;
          item.total += curr.total;
          item.not_active += curr.not_active;
          item.opv_has += curr.opv_has;
          item.active_ip += curr.active_ip;
          item.loan_price_sum += !!curr.loan_price_sum ? curr.loan_price_sum : 0;
          item.count += 1;
        } else {
          acc[curr.id_rai] = {
            ...curr,
            count: 1,
            value: curr.active_ip,
          };
        }
      }
      return acc;
    }, {});
  
  return {};
});

const getCityZoom = (regionCode: number | null): number => {
  if (regionCode === null) return 6;
  
  if (
    regionCode === 71 || 
    regionCode === 75 || 
    regionCode === 79    
  ) {
    return 9; 
  }
  
  return 6; 
};

const clickPolygon = (code: string | null) => {
  programStore.setCurrentRegion(code);
};

const clickRaion = (code: string | null) => {
  programStore.setCurrentRaion(code);
};

const handleReset = () => {
  programStore.setCurrentRegion(null);
  programStore.setCurrentRaion(null);
};
</script>

<style scoped lang="scss">
.map-container {
  position: relative;
  height: 600px;
  width: 100%;
  overflow: hidden;
}

.map-absolute {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

:deep(.leaflet-container) {
  height: 100% !important;
  width: 100% !important;
  margin: 0;
  z-index: 1;
}

:deep(.l-map) {
  height: 100%;
  width: 100%;
}

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
