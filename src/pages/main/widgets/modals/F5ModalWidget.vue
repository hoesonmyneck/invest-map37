<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <BaseCard v-else title="" number="" :show-close-button="true" @close="$emit('close')">
      <div class="grid grid-cols-[1fr_2fr] text-white">
        <div>
          <div class="flex gap-1">
            <div :class="{ active: tab === 0 }" @click="changeTab(0)" class="btn">
              Соотношение
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
                  <p class="w-4 h-4 rounded-full" style="background-color: #8979ff"></p>
                  Животноводство
                </li>
                <li class="flex gap-2">
                  <p class="w-4 h-4 rounded-full" style="background-color: #ff928a"></p>
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
            class="head grid gap-1 grid-cols-[100px_100px_100px_100px_100px_100px_100px_150px_70px_100px] text-[10px] pt-4 pb-2 mb-2 border-b border-gray-600">
            <p>НАИМЕНОВАНИЕ</p>
            <p>БИН <br><br> {{ formatNumber(filteredBin) }}</p>
            <p>ТИП</p>
            <p>ПОДТИП</p>
            <p>ПЛОЩАДЬ <br><br> <div v-if="tab === 1"> {{ formatNumber(filteredArea) }}</div></p>
            <p>ГОЛОВ <br><br> <div v-if="tab === 2"> {{ formatNumber(filteredArea) }}</div></p>
            <p>Потреб. в кадрах <br><br> {{ formatNumber(filteredTotalHeadCount) }}</p>
            <p>Фактические рабочие места <br><br> {{ formatNumber(filteredWorkPlaces) }}</p>
            <p>Св. вакансии<br><br> {{ formatNumber(filteredIinSum) }}</p>
            <p>ТиПО <br><br> {{ formatNumber(filteredBezrabotZero) }}</p>
          </div>
          <div class="overflow-y-auto h-[calc(40vh-50px)] w-full">
            <div
              class="head gap-1 grid grid-cols-[100px_100px_100px_100px_100px_100px_100px_150px_70px_100px] text-[10px] mt-1"
              v-for="item in dataListFiltered.slice(0, 30)" :key="item.area + item.full_name">
              <a-tooltip placement="left" :title="item.full_name"><p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.full_name }}
              </p></a-tooltip>
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
                {{ item.total_head_count }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.work_places }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.iin_sum }}
              </p>
              <p class="h-6 w-full px-1 flex items-center bg-[#252A36] rounded w-full truncate">
                {{ item.bezrabot_zero }}
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
          <div v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="currentRegion = ''">
            <CloseOutlined />
          </div>
        </div>
        <BaseMap :current-region="+currentRegion" :fill-color="(v) => {
          return getColorFromGradient((groupByRegion()[+v]?.area / maxCountGroupByRegion) * 100)
        }" @click-polygon="clickPolygon" v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
            <div class="flex items-center gap-2">
              <p>{{ tabMapStatus === 1 ? "Площадь" : "Голов" }}:</p>
              <p class="font-bold">
                {{
                Numeral(groupByRegion()[+slotProps.data.parent1_code].area)
                }}
              </p>
            </div>
          </div>
        </BaseMap>
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
import { createApp } from 'vue';

const loader = ref(true);
const data = ref([]);
const dataList = ref([]);
const tab = ref(0);
const tabMapStatus = ref(0);
const currentRegion = ref(null);
const f7Data = ref([]);
const f5Data = ref([]);

async function loadF5() {
  data.value = await getF5();
  dataList.value = await getF5_1();

  loader.value = false;
}

loadF5();

const clickPolygon = (code: string) => {
  currentRegion.value = +code;
  console.log("Region clicked:", code);
}

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
        (!currentRegion.value ||
          +item.parent1_code === currentRegion.value) &&
        (tab.value === 0
          ? true
          : +item.tip ===
          (tab.value === 1 ? 1 : 2))
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
      (!currentRegion.value ||
        +item.parent1_code === currentRegion.value) &&
      (tab.value === 0 ? true : +item.tip === tab.value)
  )
);

const maxCountGroupByRegion = computed(
  () =>
    Object.values(groupByRegion())?.sort((a, b) => b.area - a.area)[0]?.area
);

const type_1 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item) => +item.tip === 1
  )
);
const type_2 = computed(() =>
  Object.values(_transformedData.value)?.filter(
    (item) => +item.tip === 2
  )
);

const totalArea = computed(() =>
  data.value
    .filter(
      (item) =>
        +item.tip === (tab.value === 1 ? 1 : 2)
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

const groupByRegion = () => data.value
  .filter(
    (item) =>
      +item.tip ===
      (tabMapStatus.value === 1 ? 1 : 2)
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

onMounted(async () => {
  const responseF7 = await getF7_total();
  f7Data.value = responseF7;

  const responseF5 = await getF5();
  f5Data.value = responseF5;
});

const totalUniqueIdSum = computed(() => {
  const uniqueRaions = {};
  f5Data.value.forEach(item => {
    if (!uniqueRaions[item.parent2_code]) {
      uniqueRaions[item.parent2_code] = item.total_unique_id;
    }
  });
  return Object.values(uniqueRaions).reduce((acc, curr) => acc + curr, 0);
});

const filteredBin = computed(() => {
  const selectedTip = tab.value === 1 ? 1 : 2;

  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value.reduce((acc, curr) => acc + curr.bin, 0);
    } else {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value)
        .reduce((acc, curr) => acc + curr.bin, 0);
    }
  }

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + curr.bin, 0);
  }

  const filteredData = f7Data.value.find(
    (item) => item.parent1_code === currentRegion.value && +item.tip === selectedTip
  );

  return filteredData ? filteredData.bin : "Нет данных";
});

const filteredArea = computed(() => {
  const selectedTip = tab.value === 1 ? 1 : 2;

  if (tab.value === 0) {
    if (!currentRegion.value) {
      return Math.round(f7Data.value.reduce((acc, curr) => acc + curr.area, 0));
    } else {
      return Math.round(f7Data.value
        .filter(item => item.parent1_code === currentRegion.value)
        .reduce((acc, curr) => acc + curr.area, 0));
    }
  }

  if (!currentRegion.value) {
    return Math.round(f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + curr.area, 0));
  }

  const filteredData = f7Data.value.find(
    (item) => item.parent1_code === currentRegion.value && +item.tip === selectedTip
  );

  return filteredData ? Math.round(filteredData.area) : "Нет данных";
});

const filteredTotalHeadCount = computed(() => {
  const selectedTip = tab.value === 1 ? 1 : 2;

  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value.reduce((acc, curr) => acc + curr.total_head_count, 0);
    } else {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value)
        .reduce((acc, curr) => acc + curr.total_head_count, 0);
    }
  }

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + curr.total_head_count, 0);
  }

  const filteredData = f7Data.value.find(
    (item) => item.parent1_code === currentRegion.value && +item.tip === selectedTip
  );

  return filteredData ? filteredData.total_head_count : "Нет данных";
});

const filteredIinSum = computed(() => {
  const selectedTip = tab.value === 1 ? 1 : 2;

  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value.reduce((acc, curr) => acc + curr.iin_sum, 0);
    } else {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value)
        .reduce((acc, curr) => acc + curr.iin_sum, 0);
    }
  }

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + curr.iin_sum, 0);
  }

  const filteredData = f7Data.value.find(
    (item) => item.parent1_code === currentRegion.value && +item.tip === selectedTip
  );

  return filteredData ? filteredData.iin_sum : "Нет данных";
});

const filteredBezrabotZero = computed(() => {
  const selectedTip = tab.value === 1 ? 1 : 2;

  if (tab.value === 0) {
    if (!currentRegion.value) {
      return f7Data.value.reduce((acc, curr) => acc + curr.bezrabot_zero, 0);
    } else {
      return f7Data.value
        .filter(item => item.parent1_code === currentRegion.value)
        .reduce((acc, curr) => acc + curr.bezrabot_zero, 0);
    }
  }

  if (!currentRegion.value) {
    return f7Data.value
      .filter(item => +item.tip === selectedTip)
      .reduce((acc, curr) => acc + curr.bezrabot_zero, 0);
  }

  const filteredData = f7Data.value.find(
    (item) => item.parent1_code === currentRegion.value && +item.tip === selectedTip
  );

  return filteredData ? filteredData.bezrabot_zero : "Нет данных";
});

const filteredWorkPlaces = computed(() => {
  const uniqueRegions = {};

  f7Data.value.forEach(item => {
    if (tab.value === 0) {
      if (!currentRegion.value || item.parent1_code === currentRegion.value) {
        if (!uniqueRegions[item.parent1_code]) {
          uniqueRegions[item.parent1_code] = 0;
        }
        uniqueRegions[item.parent1_code] += item.work_places;
      }
    } else {
      const selectedTip = tab.value === 1 ? 1 : 2;
      if ((!currentRegion.value || item.parent1_code === currentRegion.value) && item.tip === selectedTip) {
        if (!uniqueRegions[item.parent1_code]) {
          uniqueRegions[item.parent1_code] = item.work_places;
        }
      }
    }
  });

  return Object.values(uniqueRegions).reduce((acc, curr) => acc + curr, 0);
});

const changeTab = (newTab) => {
  tab.value = newTab;
  console.log("Tab changed to:", newTab);
};

const app = createApp({});

app.config.globalProperties.$filters = {
  formatNumber(value) {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

const formatNumber = (value) => {
  if (!value) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
</script>

<style scoped lang="scss">
.block {
  @apply h-8 px-3 flex items-center bg-[#252A36] rounded w-full;
}
</style>
