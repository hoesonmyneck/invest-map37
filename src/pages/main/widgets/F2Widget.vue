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
import { getF2 } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F2ModalWidget from "./modals/F2ModalWidget.vue";

const loader = ref(true);
const data = ref([]);
const visible = ref(false);
const currentRegion = ref("");

async function loadF2() {
  data.value = await getF2().finally(() => {
    loader.value = false;
  });
}

const list = computed(() =>
  Object.values(
    data.value
      .filter((item) =>
        !!currentRegion.value ? item.parent1_code === currentRegion.value : true
      )
      .reduce((acc, curr) => {
        if (!curr.oked) return acc;

        if (!acc[curr.oked]) {
          acc[curr.oked] = { ...curr };
          return acc;
        }

        acc[curr.oked].cnt24 += +curr.cnt24;
        return acc;
      }, {})
  ).sort((a, b) => +b.cnt24 - +a.cnt24)
);

const groupByRegion = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
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
      categories: list.value.map((item) => item.oked),
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
          y: e.cnt24,
          color: "#3090E8",
          price: Numeral(e.cnt24),
        })),
      },
    ],
  };
});
</script>
