<template>
  <BaseCard
    title="Перспектива занятости сельского хозяйства"
    number="F5"
    @open="visible = true"
    :show-open-button="true"
  >
    <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <div v-else class="text-white">
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
    <F5ModalWidget :visible="visible" @close="visible = false" />
  </BaseCard>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { getF5 } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F5ModalWidget from "./modals/F5ModalWidget.vue";

const loader = ref(false);
const data = ref([]);
const tab = ref(2);
const visible = ref(false);

async function loadF5() {
  data.value = await getF5().finally(() => {
    loader.value = false;
  });
}

loadF5();

const allCount = computed(() =>
  Object.values(_transformedData.value)?.reduce(
    (acc, curr) => acc + curr.new_id,
    0
  )
);

const _transformedData = computed(() =>
  data.value.reduce((acc, curr) => {
    const _key = curr.raion + curr.tip + curr.region;
    acc[_key] = curr;

    return acc;
  }, {})
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
