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
      class="h-screen max-h-[1000px]"
    >
      <div class="grid grid-cols-2 h-[35vh]">
        <div>

          <div class="flex gap-2">
            <div class="btn mini text-white" :class="{ 'bg-blue-500 active': activeTab === 'program1' }" @click="activeTab = 'program1'">Программы</div>
            <div class="btn mini text-white" :class="{ 'bg-blue-500 active': activeTab === 'program2' }" @click="activeTab = 'program2'">Программы 2</div>
          </div>

          <div
            class="flex pt-5 justify-center items-center w-full"
            v-if="loader"
          >
            <a-spin />
          </div>
          <div v-else class="text-white grid grid-cols-2 gap-2">
            <div v-if="activeTab === 'program1'" class="relative">
              <highcharts
                :options="chartOptions"
                class="h-[350px] w-full m-auto"
              ></highcharts>
              <div
                class="absolute text-center top-[150px] m-auto left-1/2 -translate-x-1/2"
              >
                <p class="text-[24px] mx-3">
                  {{ Intl.NumberFormat().format(naselenie) }}
                </p>
                <p class="text-[16px] text-[#818693]">Человек</p>
                <p class="mt-6">Трудоспособные</p>
                <ul class="flex gap-7 text-[16px] justify-center mt-5">
                  <li class="border-t-2 border-[#DF173B] pt-1">
                    {{ Numeral((bezrabot / trudo) * 100) }}%
                  </li>
                  <li class="border-t-2 border-[#3090E8] pt-1">
                    {{ Numeral((trudo / naselenie) * 100) }}%
                  </li>
                  <li class="border-t-2 border-[#0CCF89] pt-1">
                    {{ Numeral((rabot / trudo) * 100) }}%
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <ul v-if="activeTab === 'program1'">
                <li
                  class="flex text-[10px] items-center gap-2 mb-3 text-lg justify-between"
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
                    <p class="bg-black p-1 rounded">
                      {{ Numeral(item.percent) }}%
                    </p>
                  </div>
                </li>
              </ul>
              <div v-if="activeTab === 'program2'" class="w-screen">
                <F1ModalWidgetProgram :visible="visible" @close="visible = false" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map h-[calc(54vh)] relative" v-if="activeTab === 'program1'">
        <div
          v-if="!!currentRegion"
          class="absolute top-5 z-10 right-5 rounded bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
          @click="currentRegion = null"
        >
          <CloseOutlined />
        </div>
        <BaseMap
          :current-region="+currentRegion"
          :fill-color="
            (v) => {
              return getColorFromGradient(
                (+groupByRegion()[+v].rt_unemployed / allBezrabot) * 100,
                true,
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
            <div class="flex items-center gap-2">
              <p>Безрабочий:</p>
              <p class="font-bold">
                {{
                  Numeral(
                    groupByRegion()[+slotProps.data.parent1_code].rt_unemployed
                  )
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
import { computed, ref } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import F1ModalWidgetProgram from "../modals/F1ModalWidgetProgram.vue";
import { getF1 } from "../../../../entities/f/api";
import { Numeral } from "../../../../shared/helpers/numeral";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";

const loader = ref(true);
const data = ref<any[]>([]);
const currentRegion = ref();
const activeTab = ref('program1');

async function loadF1() {
  data.value = await getF1().finally(() => {
    loader.value = false;
  });
}

function openLink() {
  window.open("https://map-invest-new.netlify.app/", "_blank");
}

function clickPolygon(code: string) {
  currentRegion.value = +code;
}

loadF1();

const groupByRegion = () =>
  [...data.value].reduce((acc, curr) => {
    if (!acc[curr.parent1_code]) {
      acc[curr.parent1_code] = { rt_unemployed: +curr.rt_unemployed };
      return acc;
    }

    acc[curr.parent1_code].rt_unemployed += +curr.rt_unemployed;
    return acc;
  }, {} as any);

const _filter = computed(() =>
  [...data.value].filter((e) =>
    !currentRegion.value ? true : e.parent1_code === currentRegion.value
  )
);

const allBezrabot = computed(() =>
  data.value.reduce((acc, curr) => acc + curr.rt_unemployed, 0)
);
const naselenie = computed(() =>
  _filter.value.reduce((acc, curr) => acc + curr.cnt, 0)
);
const bezrabot = computed(() =>
  _filter.value.reduce((acc, curr) => acc + curr.rt_unemployed, 0)
);
const trudo = computed(() =>
  _filter.value.reduce((acc, curr) => acc + curr.trud_vozrast, 0)
);
const rabot = computed(() =>
  _filter.value.reduce((acc, curr) => acc + curr.working, 0)
);
const nezanyat = computed(() =>
  _filter.value.reduce((acc, curr) => acc + curr.nezanyat, 0)
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
    title: "Наемные",
    value: rabot.value,
    percent: (rabot.value / trudo.value) * 100,
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
    value: nezanyat.value,
    percent: (nezanyat.value / trudo.value) * 100,
    icon: "work_not",
  },
]);

const chartOptions = computed(() => {
  return {
    chart: {
      type: "solidgauge",
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
            y: (rabot.value / trudo.value) * 100,
          },
        ],
      },
    ],
  };
});
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
