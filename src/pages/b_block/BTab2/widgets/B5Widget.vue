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
      v-if="!!currentRegion"
      class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
      @click="clickPolygon(null)"
    >
      <CloseOutlined />
    </div>
    <BaseMap
      :current-region="+currentRegion"
      :fill-color="
        (v) => {
          if(!groupByRegion[v]) return "#252A36";

          return getColorFromGradient(
            !groupByRegion ? 0 : (groupByRegion[v].total / maxTotal) * 100,
            false,
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
        <div class="flex items-center gap-2" v-if="groupByRegion">
          <p class="mb-2">
            Участники:
            <span class="font-bold">{{
              groupByRegion[slotProps.data.parent1_code].total
            }}</span>
          </p>
        </div>
      </div>
    </BaseMap>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useProgramStore } from "../store";
import { storeToRefs } from "pinia";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";

const programStore = useProgramStore();
const { current_key, currentRegion, serpin, aulAmanati, diplommenAulga } =
  storeToRefs(programStore);

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

const maxTotal = computed(() =>
  Object.values(groupByRegion.value).reduce((acc, curr) => acc + curr.total, 0)
);

const groupByRegion = computed(() => {
  if (current_key.value === "serpin")
    return [...serpin.value].reduce((acc, curr) => {
      if (acc[curr.parent1_code]) {
        acc[curr.parent1_code].total += curr.total;
        acc[curr.parent1_code].value += curr.ispolnayet;
      } else {
        acc[curr.parent1_code] = {
          ...curr,
          value: curr.ispolnayet,
        };
      }

      return acc;
    }, {});

  if (current_key.value === "diplom")
    return diplommenAulga.value.reduce((acc, curr) => {
      if (acc[curr.parent1_code]) {
        const item = acc[curr.parent1_code];
        item.value += curr.rabotaet_aul;
        item.total += curr.total;
        item.count += 1;
      } else {
        acc[curr.parent1_code] = {
          ...curr,
          count: 1,
          value: curr.rabotaet_aul,
        };
      }

      return acc;
    }, {});

  if (current_key.value === "auyl_amanat")
    return aulAmanati.value.reduce((acc, curr) => {
      if (acc[curr.parent1_code]) {
        const item = acc[curr.parent1_code];
        item.value += curr.active_ip;
        item.total += curr.total;
        item.not_active += curr.not_active;
        item.opv_has += curr.opv_has;
        item.active_ip += curr.active_ip;
        item.loan_price_sum += !!curr.loan_price_sum ? curr.loan_price_sum : 0;
        item.count += 1;
      } else {
        acc[curr.parent1_code] = {
          ...curr,
          count: 1,
          value: curr.active_ip,
        };
      }

      return acc;
    }, {});
});

const clickPolygon = (code: string) => {
  programStore.setCurrentRegion(code);
};
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
