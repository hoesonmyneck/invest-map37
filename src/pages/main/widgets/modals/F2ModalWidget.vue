<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>

    <BaseCard v-else title="" number="" :show-close-button="true" @close="$emit('close')">
      <div class="overflow-auto h-[calc(94vh)] grid">
        <div class="grid grid-cols-1">
          <div class="max-h-[40vh] overflow-scroll text-white">
            <div class="head grid grid-cols-[2fr_120px_120px_120px] mb-2 pb-2 border-b border-gray-600">
              <p>Наименование</p>
              <p>Количество</p>
              <p>Прирост</p>
              <p>Прогноз</p>
            </div>
            <div class="mt-1 gap-1 grid grid-cols-[2fr_120px_120px_120px] text-[12px]" v-for="i in list"
              :key="i.crop_ru">
              <p class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ i.oked }}
              </p>
              <p class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ Numeral(i.cnt24) }}
              </p>
              <p class="h-6 w-full justify-center px-3 flex items-center bg-[#252A36] rounded w-full truncate" :style="`background-color: ${i.percentage_change_cnt < 0 ? '#FE6A35' : '#109669'
                }`">
                {{ Numeral(i.percentage_change_cnt / i.count) }} %
              </p>
              <p class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate">
                {{
                !!i.prirost_2025 ? `${+i.prirost_2025.toFixed(2)} %` : ""
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="map h-[calc(54vh)] relative">
          <div v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="currentRegion = null">
            <CloseOutlined />
          </div>
          <BaseMap :current-region="+currentRegion" :fill-color="(v) => {
            return getColorFromGradient((groupByRegion[v]?.cnt24 / maxGroupByRegion) * 100 + 10)
          }" @click-polygon="clickPolygon" v-slot="slotProps">
            <div>
              <div class="flex items-center gap-2">
                <p>Регион:</p>
                <p class="font-bold">{{ slotProps.data.region }}</p>
              </div>
              <div class="flex items-center gap-2">
                <p>Количество:</p>
                <p class="font-bold">
                  {{ Numeral(groupByRegion[+slotProps.data.parent1_code]?.cnt24) }}
                </p>
              </div>
            </div>
          </BaseMap>
        </div>
      </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import { Numeral } from "../../../../shared/helpers/numeral";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";

const currentRegion = ref();
const loader = ref(false);

defineEmits(["close"]);
const props = defineProps<{
  data: any[];
}>();

const list = computed(() =>
  Object.values(
    props.data
      .filter((item) =>
        !!currentRegion.value ? item.parent1_code === currentRegion.value : true
      )
      .reduce((acc, curr) => {
        if (!curr.oked) return acc;

        if (!acc[curr.oked]) {
          acc[curr.oked] = { ...curr, count: 1 };
          return acc;
        }

        acc[curr.oked].cnt24 += +curr.cnt24;
        acc[curr.oked].percentage_change_cnt += +curr.percentage_change_cnt;
        acc[curr.oked].count += 1;

        return acc;
      }, {})
  ).sort((a, b) => +b.cnt24 - +a.cnt24)
);

function clickPolygon(code: string) {
  currentRegion.value = +code;
}

const groupByRegion = computed(() =>
  props.data
    .reduce((acc, curr) => {
      if (!acc[curr.parent1_code]) {
        acc[curr.parent1_code] = { ...curr };
        return acc;
      }

      acc[curr.parent1_code].cnt24 += +curr.cnt24;
      return acc;
    }, {})
);

const maxGroupByRegion = computed(
  () =>
    Object.values(groupByRegion.value).sort((a, b) => b.cnt24 - a.cnt24)[0]
      ?.cnt24
);
</script>
