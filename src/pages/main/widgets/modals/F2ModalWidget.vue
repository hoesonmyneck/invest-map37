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
      <div class="overflow-auto h-[calc(94vh)] grid">
        <div class="grid grid-cols-1">
          <div class="max-h-[40vh] overflow-scroll text-white">
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
              <p
                class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ i.vname_oked }}
              </p>
              <p
                class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ Numeral(i.cnt_2023) }}
              </p>
              <p
                class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ Numeral(i.cnt_2024) }}
              </p>
              <p
                class="h-6 w-full justify-center px-3 flex items-center bg-[#252A36] rounded w-full truncate"
                :style="`background-color: ${
                  i.proc < 0 ? '#FE6A35' : '#109669'
                }`"
              >
                {{ i.proc.toFixed(1) }} %
              </p>
              <p
                class="h-6 w-full px-3 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ i.prognoz !== 0 ? `${i.prognoz.toFixed(1)} %` : "" }}
              </p>
            </div>
          </div>
        </div>
        <div class="map h-[calc(54vh)] relative">
          <div
            v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="currentRegion = null"
          >
            <CloseOutlined />
          </div>
          <BaseMap
            :current-region="currentRegion"
            :fill-color="
              (v) => {
                return getColorFromGradient(
                  (groupByRegion[v]?.cnt_2024 / maxGroupByRegion) * 100 + 10
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
                <p>Количество:</p>
                <p class="font-bold">
                  {{
                    (() => {
                      const regionCode =
                        slotProps.data.parent1_code?.toString();
                      return Numeral(groupByRegion[regionCode]?.cnt_2024);
                    })()
                  }}
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
}

const currentRegion = ref<string | null>(null);
const loader = ref(false);

defineEmits(["close"]);
const props = defineProps<{
  data: F2Data[];
}>();

const list = computed(() => {
  const filtered = props.data.filter((item) =>
    currentRegion.value ? item.tip === 2 : item.tip === 1
  );

  const filteredByRegion = filtered.filter((item) => {
    if (!currentRegion.value) return true;

    const currentRegionNumber = parseInt(currentRegion.value);
    const itemRegionNumber = parseInt(item.parent1_code || "0");
    const matches = itemRegionNumber === currentRegionNumber;

    return matches;
  });

  const filteredByName = filteredByRegion.filter(
    (item) => item.vname_oked !== "Окэд не указан"
  );

  return Object.values(
    filteredByName.reduce((acc, curr) => {
      if (!curr.vcode_oked) return acc;

      if (!acc[curr.vcode_oked]) {
        const randomPrognoz =
          curr.prognoz === 0
            ? Math.random() * 40 - 20 // от -20 до +20
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
      acc[curr.vcode_oked].prognoz = acc[curr.vcode_oked].prognoz;
      acc[curr.vcode_oked].count += 1;

      return acc;
    }, {} as Record<string, F2Data & { count: number }>)
  ).sort((a, b) => b.cnt_2024 - a.cnt_2024);
});

function clickPolygon(code: string) {
  currentRegion.value = code;
}

const groupByRegion = computed(() => {
  const result = props.data
    .filter((item) => item.tip === 2)
    .reduce((acc, curr) => {
      const regionCode = curr.parent1_code?.toString() || "";
      const regionNumber = parseInt(regionCode);
      if (!acc[regionNumber]) {
        acc[regionNumber] = { ...curr };
        return acc;
      }

      acc[regionNumber].cnt_2024 += curr.cnt_2024;
      return acc;
    }, {} as Record<string, F2Data>);

  return result;
});

const maxGroupByRegion = computed(() => {
  const max = Object.values(groupByRegion.value).sort(
    (a, b) => b.cnt_2024 - a.cnt_2024
  )[0]?.cnt_2024;
  return max;
});
</script>
