<template>
  <div>
    <BaseCard title="Занятые по отраслям" number="F2" @open="visible = true" :show-open-button="true">
      <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
      <div v-else class="overflow-auto h-[calc(50vh-66px)]">
        <highcharts :options="chartOptions" class="w-full m-auto h-max"></highcharts>
      </div>
    </BaseCard>

    <F2ModalWidget :data="data" :visible="visible" @close="visible = false" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { getF2_new } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F2ModalWidget from "./modals/F2ModalWidget.vue";

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

const loader = ref(true);
const data = ref<F2Data[]>([]);
const visible = ref(false);
const currentRegion = ref("");

async function loadF2() {
  data.value = await getF2_new().finally(() => {
    loader.value = false;
  });
}

const list = computed(() =>
  Object.values(
    data.value
      .filter((item) => item.tip === 1)
      .filter((item) =>
        !!currentRegion.value ? item.parent1_code === currentRegion.value : true
      )
      .reduce((acc, curr) => {
        if (!curr.vcode_oked) return acc;

        if (!acc[curr.vcode_oked]) {
          acc[curr.vcode_oked] = { ...curr };
          return acc;
        }

        acc[curr.vcode_oked].cnt_2024 += curr.cnt_2024;
        return acc;
      }, {} as Record<string, F2Data>)
  ).sort((a, b) => b.cnt_2024 - a.cnt_2024)
);

const groupByRegion = computed(() =>
  data.value
    .filter((item) => item.tip === 1)
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => {
      if (!acc[curr.parent1_code || '']) {
        acc[curr.parent1_code || ''] = { ...curr };
        return acc;
      }

      acc[curr.parent1_code || ''].cnt_2024 += curr.cnt_2024;
      return acc;
    }, {} as Record<string, F2Data>)
);

const maxGroupByRegion = computed(
  () =>
    Object.values(groupByRegion.value).sort((a, b) => b.cnt_2024 - a.cnt_2024)[0]
      ?.cnt_2024
);

loadF2();

const chartOptions = computed(() => {
  return {
    chart: {
      type: "bar",
      height: visible.value ? "" : "150%",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        grouping: false,
        borderWidth: 0,
      },
      series: {
        borderRadius: 0,
        dataLabels: {
          format: "{point.price}",
          enabled: true,
          style: {
            color: "#fff",
          },
        },
        showInLegend: true,
      },
    },
    xAxis: {
      categories: list.value.map((item) => item.vname_oked),
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
        colorByPoint: true,
        pointWidth: 14,
        borderWidth: 0,
        data: list.value.map((e) => ({
          y: e.cnt_2024,
          color: "#3090E8",
          price: Numeral(e.cnt_2024),
        })),
      },
    ],
  };
});
</script>
