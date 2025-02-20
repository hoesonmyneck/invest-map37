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
      <div class="grid grid-cols-[1fr_2fr] text-white">
        <div>
          <div class="flex gap-1">
            <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn">
              Соотношение
            </div>
            <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn">
              Общая площадь
            </div>
            <div :class="{ active: tab === 2 }" @click="tab = 2" class="btn">
              Количество голов
            </div>
          </div>
          <div class="overflow-auto h-[calc(50vh-106px)]">
            <template v-if="tab === 0">
              <div class="relative mt-5">
                <highcharts
                  :options="chartOptions1"
                  class="w-full m-auto h-[300px]"
                ></highcharts>
                <div
                  class="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <p class="text-2xl">{{ Numeral(allCount) }}</p>
                  <p class="text-gray-500 text-xs">Всего</p>
                </div>
              </div>
              <ul class="flex gap-4 text-[10px] justify-center">
                <li class="flex gap-2">
                  <p
                    class="w-4 h-4 rounded-full"
                    style="background-color: #8979ff"
                  ></p>
                  Животноводство
                </li>
                <li class="flex gap-2">
                  <p
                    class="w-4 h-4 rounded-full"
                    style="background-color: #ff928a"
                  ></p>
                  Растениеводство
                </li>
              </ul>
            </template>

            <template v-else>
              <p v-if="tab === 1" class="mb-2 pb-2 border-b mt-4 text-sm">
                Общая площадь:
                <b>{{
                  Numeral(
                    Object.values(totalArea).reduce(
                      (acc, curr) => acc + curr.area,
                      0
                    )
                  )
                }}</b>
                га
              </p>
              <p v-if="tab === 2" class="mb-2 pb-2 border-b mt-4 text-sm">
                Количество голов:
                <b>{{
                  Numeral(
                    Object.values(totalArea).reduce(
                      (acc, curr) => acc + curr.area,
                      0
                    )
                  )
                }}</b>
              </p>
              <highcharts
                :options="chartOptions2"
                class="w-full m-auto"
              ></highcharts>
            </template>
          </div>
        </div>
        <div class="ml-4 pl-4 border-l border-gray-600 overflow-scroll">
          <div
            class="head grid gap-1 grid-cols-[100px_100px_100px_100px_100px_100px_100px_50px_50px] text-[10px] pt-4 pb-2 mb-2 border-b border-gray-600"
          >
            <p>НАИМЕНОВАНИЕ</p>
            <p>БИН</p>
            <p>ТИП</p>
            <p>ПОДТИП</p>
            <p>ПЛОЩАДЬ</p>
            <p>ГОЛОВ</p>
            <p>Потреб. в кадрах</p>
            <p>Св. вакансии</p>
            <p>ТиПО</p>
          </div>
          <div class="overflow-y-auto h-[calc(40vh-50px)] w-full">
            <div
              class="head gap-1 grid grid-cols-[100px_100px_100px_100px_100px_100px_100px_50px_50px] text-[10px] mt-1"
              v-for="item in dataListFiltered.slice(0, 30)"
              :key="item.area + item.full_name"
            >
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ item.full_name }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ item.bin }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ +item.tip === 1 ? "Растениеводство" : "Животноводство" }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ item.crop_ru }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ +item.tip === 1 ? item.area : "" }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ +item.tip !== 1 ? item.area : "" }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                {{ item.total_head_count }}
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                -
              </p>
              <p
                class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate"
              >
                -
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="map h-[calc(50vh)] relative">
        <div class="flex items-center justify-between w-full pr-10 mt-5">
          <div class="flex gap-1 text-white">
            <div
              :class="{ active: tabMapStatus === 0 }"
              @click="tabMapStatus = 0"
              class="btn mini"
            >
              Животноводство
            </div>
            <div
              :class="{ active: tabMapStatus === 1 }"
              @click="tabMapStatus = 1"
              class="btn mini"
            >
              Растениеводство
            </div>
          </div>
          <div
            v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="currentRegion = ''"
          >
            <CloseOutlined />
          </div>
        </div>
        <l-map
          ref="mapRef"
          :zoom="5"
          :center="[49.213962, 67.109173]"
          :options="{ zoomControl: false }"
          class="w-full"
          :use-global-leaflet="false"
        >
          <template>
            <l-polygon
              v-for="p in Object.values(regionPolygons.features)"
              :key="p.parent1_code"
              @click="currentRegion = p.properties.parent1_code"
              :lat-lngs="reverseCoordinates(p.geometry.coordinates)"
              color="white"
              :opacity="1"
              :weight="1"
              :fillOpacity="1"
              :fillColor="
                !!currentRegion
                  ? currentRegion === p.properties.parent1_code
                    ? getColorFromGradient(
                        (groupByRegion[+p.properties.parent1_code]?.area /
                          maxCountGroupByRegion) *
                          100
                      )
                    : '#252A36'
                  : getColorFromGradient(
                      (groupByRegion[+p.properties.parent1_code]?.area /
                        maxCountGroupByRegion) *
                        100
                    )
              "
            >
              <l-tooltip class="p-0 bg-transparent rounded-md">
                <div class="flex items-center gap-2">
                  <p>Регион:</p>
                  <p class="font-bold">{{ p.properties.region }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <p>{{ tabMapStatus === 1 ? "Площадь" : "Голов" }}:</p>
                  <p class="font-bold">
                    {{
                      Numeral(groupByRegion[+p.properties.parent1_code]?.area)
                    }}
                  </p>
                </div>
              </l-tooltip>
            </l-polygon>
          </template>
        </l-map>
      </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTooltip, LPolygon } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { computed, ref } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF5, getF5_1 } from "../../../../entities/f/api";
import { Numeral } from "../../../../shared/helpers/numeral";
import { reverseCoordinates } from "../../../../shared/helpers/reverseCoordinates";
import { useRegionStore } from "../../../../entities/region/store";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";

const loader = ref(true);
const data = ref([]);
const dataList = ref([]);
const tab = ref(0);
const tabMapStatus = ref(0);
const currentRegion = ref("");
const { regionPolygons } = useRegionStore();

async function loadF5() {
  data.value = await getF5();
  dataList.value = await getF5_1();

  loader.value = false;
}

loadF5();

const allCount = computed(() =>
  Object.values(_transformedData.value)?.reduce(
    (acc, curr) => acc + curr.new_id,
    0
  )
);

const _transformedData = computed(() =>
  data.value
    .filter(
      (item) =>
        (currentRegion.value === "" ||
          item.parent1_code === currentRegion.value) &&
        (tab.value === 0
          ? true
          : item.tip ===
            (tab.value === 1 ? "Растениеводство" : "Животноводство"))
    )
    .reduce((acc, curr) => {
      const _key = curr.raion + curr.tip + curr.region;
      acc[_key] = curr;

      return acc;
    }, {})
);

const dataListFiltered = computed(() =>
  dataList.value.filter(
    (item) =>
      (currentRegion.value === "" ||
        item.parent1_code === currentRegion.value) &&
      (tab.value === 0 ? true : +item.tip === tab.value)
  )
);

const type_1 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item) => item.tip === "Растениеводство"
  )
);
const type_2 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item) => item.tip === "Животноводство"
  )
);

const totalArea = computed(() =>
  data.value
    .filter(
      (item) =>
        item.tip === (tab.value === 1 ? "Растениеводство" : "Животноводство")
    )
    ?.reduce((acc, curr) => {
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

const groupByRegion = computed(() =>
  data.value
    .filter(
      (item) =>
        item.tip ===
        (tabMapStatus.value === 1 ? "Растениеводство" : "Животноводство")
    )
    ?.reduce((acc, curr) => {
      if (!acc[curr.parent1_code]) {
        acc[curr.parent1_code] = { ...curr };
        return acc;
      }

      acc[curr.parent1_code].area += curr.area;
      acc[curr.parent1_code].new_id += curr.new_id;
      return acc;
    }, {})
);

const maxCountGroupByRegion = computed(
  () =>
    Object.values(groupByRegion.value)?.sort((a, b) => b.area - a.area)[0]?.area
);

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
            color: "#FF928A",
            y: type_1.value.reduce((acc, curr) => acc + curr.new_id, 0),
          },
          {
            name: "Животноводство",
            color: "#8979FF",
            y: type_2.value.reduce((acc, curr) => acc + curr.new_id, 0),
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
        .sort((a, b) => b.area - a.area)
        .map((item) => item.crop_ru),
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
          .sort((a, b) => b.area - a.area)
          .map((item) => {
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
</script>

<style scoped lang="scss">
.block {
  @apply h-8 px-3 flex items-center bg-[#252A36] rounded w-full;
}
</style>
