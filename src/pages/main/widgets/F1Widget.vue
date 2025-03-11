<template>
  <div>
    <BaseCard
      title="Рынок труда"
      number="F1"
      :show-open-button="true"
      @open="visible = true"
    >
      <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
      <div v-else class="text-white grid grid-cols-2 gap-2">
        <div class="relative">
          <highcharts
            :options="chartOptions"
            class="h-[250px] w-full m-auto"
          ></highcharts>
          <div
            class="absolute text-center top-[90px] m-auto left-1/2 -translate-x-1/2"
          >
            <p class="text-[14px] mx-3">
              {{ Intl.NumberFormat().format(naselenie) }}
            </p>
            <p class="text-[12px] text-[#818693]">Человек</p>
            <p class="text-xs mt-6">Трудоспособные</p>
            <ul class="flex gap-7 text-[12px] justify-center mt-5">
              <li class="border-t-2 border-[#DF173B] pt-1">
                {{ Numeral((bezrabot / trudo) * 100) }}%
              </li>

              <li class="border-t-2 border-[#3090E8] pt-1">
                {{ Numeral((trudo / naselenie) * 100) }}%
              </li>
              <li class="border-t-2 border-[#0CCF89] pt-1">
                {{ Numeral((working / trudo) * 100) }}%
              </li>
            </ul>
          </div>
        </div>

        <div>
          <ul>
            <li
              class="flex text-[10px] items-center gap-2 mb-3 text-xs justify-between"
              v-for="item in list"
              :key="item.title"
            >
              <div class="flex gap-2 items-center">
                <img
                  :src="`/images/icons/${item.icon}.png`"
                  alt=""
                  class="h-4"
                />
                <p>{{ item.title }}</p>
              </div>
              <div class="flex gap-2 items-center">
                <p>{{ Numeral(item.value) }}</p>
                <p class="bg-black p-1 rounded">{{ Numeral(item.percent) }}%</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <F1ModalWidget :visible="visible" @close="visible = false" />
    </BaseCard>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getF1 } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F1ModalWidget from "./modals/F1ModalWidget.vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";

const loader = ref(true);
const data = ref<any[]>([]);
const visible = ref(false);

async function loadF1() {
  data.value = await getF1().finally(() => {
    loader.value = false;
  });
}

loadF1();

const naselenie = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.cnt, 0)
);
const bezrabot = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.rt_unemployed, 0)
);
const trudo = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.trud_vozrast, 0)
);
const working = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.working, 0)
);
const nezaniat = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.nezaniat, 0)
);
const workingNaem = computed(() =>
data.value.reduce((acc, curr) => acc + curr.working_naem, 0)
);
const workingIpNaem = computed(() =>
data.value.reduce((acc, curr) => acc + curr.working_ip_naem, 0)
);
const workingSam = computed(() =>
data.value.reduce((acc, curr) => acc + curr.working_sam, 0)
);

const list = computed(() => [
  {
    title: "Население",
    value: naselenie.value,
    percent: 100,
    icon: "users",
  },
  {
    title: "Трудоспособные",
    value: trudo.value,
    percent: (trudo.value / naselenie.value) * 100,
    icon: "users",
  },
  {
    title: "Работающие",
    value: working.value,
    percent: (working.value / trudo.value) * 100,
    icon: "work",
  },
  {
        title: "Наемные в ЮЛ",
        value: workingNaem.value,
        percent: (workingNaem.value / trudo.value) * 100,
        icon: "work",
    },
    {
        title: "Наемные в ИП",
        value: workingIpNaem.value,
        percent: (workingIpNaem.value / trudo.value) * 100,
        icon: "work",
    },
    {
        title: "Самозанятые",
        value: workingSam.value,
        percent: (workingSam.value / trudo.value) * 100,
        icon: "work",
    },
  {
    title: "Зарегистрированные безработные",
    value: bezrabot.value,
    percent: (bezrabot.value / trudo.value) * 100,
    icon: "work_red",
  },
  {
    title: "Незанятые",
    value: nezaniat.value,
    percent: (nezaniat.value / trudo.value) * 100,
    icon: "work_not",
  },
]);

const chartOptions = computed(() => {
  return {
    chart: {
      type: "solidgauge",
      height: "100%",
      backgroundColor: "transparent",
    },

    title: {
      text: "",
    },

    pane: {
      startAngle: -125,
      endAngle: 125,
      background: [
        {
          outerRadius: 0,
          innerRadius: 0,
          borderWidth: 0,
        },
      ],
    },

    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
          showInLegend: false,
        },
      },
    },

    series: [
      {
        name: "",
        data: [
          {
            radius: "110%",
            innerRadius: "102%",
            color: "rgba(223,23,59,0.2)",
            y: 100,
          },
        ],
      },
      {
        name: "",
        data: [
          {
            radius: "80%",
            innerRadius: "100%",
            color: "rgba(48,144,232,0.2)",
            y: 100,
          },
        ],
      },
      {
        name: "Безработные",
        data: [
          {
            radius: "110%",
            innerRadius: "102%",
            color: "#DF173B",
            y: (bezrabot.value / trudo.value) * 100,
          },
        ],
      },
      {
        name: "Работоспособные",
        data: [
          {
            radius: "80%",
            innerRadius: "100%",
            color: "#3090E8",
            y: (trudo.value / naselenie.value) * 100,
          },
        ],
      },
      {
        name: "Трудоустроенные",
        data: [
          {
            radius: "80%",
            innerRadius: "90%",
            color: "#0CCF89",
            y: (working.value / trudo.value) * 100,
          },
        ],
      },
    ],
  };
});
</script>
