<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <BaseCard v-else title="" number="" :show-close-button="true" @close="$emit('close')">
      
      <div class="grid grid-cols-3 text-white h-[40vh]">
        <div class="flex justify-around">
          <div >
          <highcharts :options="chartOptions" class="w-[100%] m-auto h-[calc(100%-100px)]"></highcharts>
          <ul class="gap-4 flex-col gap-3 text-[10px] justify-center">
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #4990d3"></p>
              Все вакансии:
              <b>{{ Numeral(vacancy_count) }}</b>
            </li>
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #003B99"></p>
              Квалифицированные профессии:
              <b>{{ Numeral(qual_prof) }}</b>
            </li>
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #0027E9"></p>
              Рабочие профессии:
              <b>{{ Numeral(rab_prof) }}</b>
            </li>
          </ul>
          </div>
          <div>
          <highcharts :options="resumeChartOptions" class="w-[100%] m-auto h-[calc(100%-100px)]"></highcharts>
          <ul class="gap-4 flex-col gap-3 text-[10px] justify-center">
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #D15B32"></p>
              Все резюме:
              <b>{{ Numeral(resume_count) }}</b>
            </li>
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #801F00"></p>
              Квалифицированные профессии:
              <b>{{ Numeral(qual_resume_prof) }}</b>
            </li>
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #FFA559"></p>
              Рабочие профессии:
              <b>{{ Numeral(rab_resume_prof) }}</b>
            </li>
          </ul>
          </div>
        </div>
        <div>
          <div class="list overflow-auto h-[calc(40vh-50px)] border-x border-gray-600 px-5 mt-5">
            <div v-for="i in Object.values(groupByNkz(false)).splice(0, 15)" :key="i"
              class="grid grid-cols-2 gap-2 justify-between items-center text-xs text-white mb-2">
              <a-tooltip placement="topLeft" :title="i.name_nkz">
                <p class="truncate cursor-pointer">{{ i.name_nkz }}</p>
              </a-tooltip>
              <div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#54ACFE" trailColor="#3B3F4B" :show-info="false" :percent="
                      +Numeral((i.vacancy_count / maxVacancyCount) * 100)
  " />
                  <p class="text-[10px] w-[40px]">{{ i.vacancy_count }}</p>
                </div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#FE6A35" trailColor="#3B3F4B" :show-info="false" :percent="+Numeral((i.resume_count / maxVacancyCount) * 100)
                    " />
                  <p class="text-[10px] w-[40px]">{{ i.resume_count }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="list overflow-auto h-[calc(40vh-50px)] pl-5 mt-4">
            <div v-for="i in Object.values(groupByNkz(true)).splice(0, 15)" :key="i.name_nkz"
              class="grid grid-cols-2 gap-2 justify-between items-center text-xs text-white mb-2">
              <a-tooltip placement="topLeft" :title="i.name_nkz">
                <p class="truncate cursor-pointer">{{ i.name_nkz }}</p>
              </a-tooltip>
              <div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#FE6A35" trailColor="#3B3F4B" :show-info="false"
                    :percent="+Numeral((i.resume_count / maxResumeCount) * 100)" />
                  <p class="text-[10px] w-[40px]">{{ i.resume_count }}</p>
                </div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#54ACFE" trailColor="#3B3F4B" :show-info="false" :percent="+Numeral((i.vacancy_count / maxResumeCount) * 100)
                    " />
                  <p class="text-[10px] w-[40px]">{{ i.vacancy_count }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map h-[calc(54vh)]">
        <div class="flex gap-1 text-white">
        <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn mini">
          Вакансии
        </div>
        <div :class="{ active: tab === 2 }" @click="tab = 2" class="btn mini">
          Резюме
        </div>
      </div>
        <div class="flex items-center justify-between w-full pr-10">
          <div></div>
          <div v-if="currentRegion"
            class="rounded cursor-pointer bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="currentRegion = null">
            <CloseOutlined />
          </div>
        </div>
        <BaseMap :current-region="+currentRegion" :fill-color="(v) => {
          return getColorFromGradient(
            (groupByRegion()[v]?.[
              tab === 1 ? 'vacancy_count' : 'resume_count'
            ] /
              (tab === 1
                ? maxRegionVacancyCount
                : maxRegionResumeCount)) *
            100
          )
}" @click-polygon="clickPolygon" v-slot="slotProps">
          <div>
            <div class="flex items-center gap-2">
              <p>Регион:</p>
              <p class="font-bold">{{ slotProps.data.region }}</p>
            </div>
          </div>
        </BaseMap>
      </div>
    </BaseCard>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF3 } from "../../../../entities/f/api";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";

const loader = ref(false);
const data = ref<any[]>([]);
const currentRegion = ref();
const tab = ref(1);

async function loadF3() {
  loader.value = true;

  data.value = await getF3().finally(() => {
    loader.value = false;
  });

  console.log(data.value); 
}

loadF3();

const clickPolygon = (code: string) => {
  currentRegion.value = +code;
}

const groupByNkz = (sort) =>
  Object.values(
    data.value
      .filter((item) =>
        !!currentRegion.value ? item.parent1_code === currentRegion.value : true
      )
      .reduce((acc, curr) => {
        if (!curr.name_nkz) return acc;

        if (!acc[curr.name_nkz]) {
          acc[curr.name_nkz] = { ...curr };
          return acc;
        }
        acc[curr.name_nkz].vacancy_count += curr.vacancy_count;
        acc[curr.name_nkz].resume_count += curr.resume_count;
        acc[curr.name_nkz].soot += curr.soot;

        return acc;
      }, {})
  ).sort((a, b) => (sort ? b.soot - a.soot : a.soot - b.soot));

const groupByRegion = () =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => {
      if (!curr.parent1_code) return acc;

      if (!acc[curr.parent1_code]) {
        acc[curr.parent1_code] = { ...curr };
        return acc;
      }
      acc[curr.parent1_code].vacancy_count += curr.vacancy_count;
      acc[curr.parent1_code].resume_count += curr.resume_count;
      acc[curr.parent1_code].soot += curr.soot;

      return acc;
    }, {});

const maxVacancyCount = computed(
  () =>
    Object.values(groupByNkz(true)).sort(
      (a, b) => b.vacancy_count - a.vacancy_count
    )[0]?.vacancy_count
);
const maxResumeCount = computed(
  () =>
    Object.values(groupByNkz(false)).sort(
      (a, b) => b.resume_count - a.resume_count
    )[0]?.resume_count
);

const maxRegionVacancyCount = computed(
  () =>
    Object.values(groupByRegion()).sort(
      (a, b) => b.vacancy_count - a.vacancy_count
    )[0]?.vacancy_count
);
const maxRegionResumeCount = computed(
  () =>
    Object.values(groupByRegion()).sort(
      (a, b) => b.resume_count - a.resume_count
    )[0]?.resume_count
);

const qual_prof = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.qual_prof), 0)
);
const rab_prof = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.rab_prof), 0)
);
const qual_resume_prof = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.qual_resume), 0)
);
const rab_resume_prof = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.rab_resume), 0)
);

const vacancy_count = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.vacancy_count), 0)
);
const resume_count = computed(() =>
  data.value
    .filter((item) =>
      !!currentRegion.value ? item.parent1_code === currentRegion.value : true
    )
    .reduce((acc, curr) => (acc += curr.resume_count), 0)
);

const chartOptions = computed(() => ({
  chart: {
    type: "solidgauge",
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  pane: {
    startAngle: 0,
    endAngle: 360,
    background: [
      {
        outerRadius: "112%",
        innerRadius: "88%",
        backgroundColor: "#4990D320",
        borderWidth: 0,
      },
      {
        outerRadius: "87%",
        innerRadius: "63%",
        backgroundColor: "#D568FB20",
        borderWidth: 0,
      },
      {
        outerRadius: "62%",
        innerRadius: "38%",
        backgroundColor: "#D15B3220",
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
  tooltip: {
    pointFormat: "{point.count} <b>({point.percentage:.0f}%)</b>",
  },

  plotOptions: {
    solidgauge: {
      dataLabels: {
        enabled: false,
      },
      linecap: "round",
      stickyTracking: false,
      rounded: true,
    },
  },

  series: [
    {
      name: "Все вакансии",
      data: [
        {
          color: "#4990D3",
          radius: "112%",
          innerRadius: "88%",
          count: Numeral(vacancy_count.value),
          y: 100,
        },
      ],
      custom: {
        icon: "filter",
        iconColor: "#fff",
      },
    },
    {
      name: "Квалифицированные профессии",
      data: [
        {
          color: "#003B99",
          radius: "87%",
          innerRadius: "63%",
          count: Numeral(qual_prof.value),
          y: (qual_prof.value / vacancy_count.value) * 100,
        },
      ],
      custom: {
        icon: "comments-o",
        iconColor: "#ffffff",
      },
    },
    {
      name: "Рабочие профессии",
      data: [
        {
          color: "#0027E9",
          radius: "62%",
          innerRadius: "38%",
          count: Numeral(rab_prof.value),
          y: (rab_prof.value / vacancy_count.value) * 100,
        },
      ],
      custom: {
        icon: "commenting-o",
        iconColor: "#303030",
      },
    },
  ],
}));

const resumeChartOptions = computed(() => ({
  chart: {
    type: "solidgauge",
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  pane: {
    startAngle: 0,
    endAngle: 360,
    background: [
      {
        outerRadius: "112%",
        innerRadius: "88%",
        backgroundColor: "#4990D320",
        borderWidth: 0,
      },
      {
        outerRadius: "87%",
        innerRadius: "63%",
        backgroundColor: "#D568FB20",
        borderWidth: 0,
      },
      {
        outerRadius: "62%",
        innerRadius: "38%",
        backgroundColor: "#D15B3220",
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
  tooltip: {
    pointFormat: "{point.count} <b>({point.percentage:.0f}%)</b>",
  },

  plotOptions: {
    solidgauge: {
      dataLabels: {
        enabled: false,
      },
      linecap: "round",
      stickyTracking: false,
      rounded: true,
    },
  },

  series: [
    {
      name: "Все вакансии",
      data: [
        {
          color: "#D15B32",
          radius: "112%",
          innerRadius: "88%",
          count: Numeral(resume_count.value),
          y: 100,
        },
      ],
      custom: {
        icon: "filter",
        iconColor: "#fff",
      },
    },
    {
      name: "Квалифицированные профессии",
      data: [
        {
          color: "#801F00",
          radius: "87%",
          innerRadius: "63%",
          count: Numeral(qual_resume_prof.value),
          y: (qual_resume_prof.value / resume_count.value) * 100,
        },
      ],
      custom: {
        icon: "comments-o",
        iconColor: "#ffffff",
      },
    },
    {
      name: "Рабочие профессии",
      data: [
        {
          color: "#FFA559",
          radius: "62%",
          innerRadius: "38%",
          count: Numeral(rab_resume_prof.value),
          y: (rab_resume_prof.value / resume_count.value) * 100,
        },
      ],
      custom: {
        icon: "commenting-o",
        iconColor: "#303030",
      },
    },
  ],
}));
</script>
