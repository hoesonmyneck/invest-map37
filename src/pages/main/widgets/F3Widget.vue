<template>
  <BaseCard
    title="Вакансии / резюме"
    number="F3"
    @open="visible = true"
    :show-open-button="true"
  >
    <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <div v-else class="text-white">
      <div class="flex gap-1">
        <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn mini">
          <PieChartOutlined class="text-xs" />
        </div>
        <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn mini">
          Наиболее дефицитные
        </div>
        <div :class="{ active: tab === 2 }" @click="tab = 2" class="btn mini">
          Наиболее избыточные
        </div>
      </div>

      <div class="flex gap-23 w-[115%]">
        <div class="overflow-auto h-[calc(50vh-106px)] ml-10">
          <template v-if="tab === 0">
            <highcharts
            :options="chartOptions"
            class="w-full m-auto h-[calc(100%-100px)]"
          ></highcharts>
          <ul class="flex gap-4 flex-col text-[10px] justify-center">
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #4990D3"
              ></p>
              Весь рынок: <b>{{ Numeral(vacancy_count) }}</b>
            </li>
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #003B99"
              ></p>
              Квалифицированные профессии: <b>{{ Numeral(qual_prof) }}</b>
            </li>
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #0027E9"
              ></p>
              Рабочие профессии:
              <b>{{ Numeral(rab_prof) }}</b>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="list pt-5">
            <div
              v-for="i in Object.values(groupByNkz).splice(0, 15)"
              :key="i"
              class="grid grid-cols-2 gap-2 justify-between items-center text-xs text-white mb-2"
            >
              <a-tooltip placement="topLeft" :title="i.name_nkz">
                <p class="truncate cursor-pointer">{{ i.name_nkz }}</p>
              </a-tooltip>
              <div>
                <div class="flex items-center w-[280px]" v-if="tab === 2">
                  <a-progress
                    class="h-2"
                    strokeColor="#FE6A35"
                    trailColor="#3B3F4B"
                    :show-info="false"
                    :percent="+Numeral((i.resume_count / maxVacancyCount) * 100)"
                  />
                  <p class="text-[10px] w-[40px]">{{ i.resume_count }}</p>
                </div>
                <div class="flex items-center" v-if="tab === 2">
                  <a-progress 
                    class="h-2"
                    strokeColor="#54ACFE"
                    trailColor="#3B3F4B"
                    :show-info="false"
                    :percent="
                      +Numeral((i.vacancy_count / maxResumeCount) * 100)
                    "
                  />
                  <p class="text-[10px] w-[40px]">{{ i.vacancy_count }}</p>
                </div>
                <div class="flex items-center" v-if="tab === 1">
                  <a-progress 
                    class="h-2"
                    strokeColor="#54ACFE"
                    trailColor="#3B3F4B"
                    :show-info="false"
                    :percent="
                      +Numeral((i.vacancy_count / maxVacancyCount) * 100)
                    "
                  />
                  <p class="text-[10px] w-[40px]">{{ i.vacancy_count }}</p>
                </div>
                <div class="flex items-center" v-if="tab === 1">
                  <a-progress
                    class="h-2"
                    strokeColor="#FE6A35"
                    trailColor="#3B3F4B"
                    :show-info="false"
                    :percent="+Numeral((i.resume_count / maxResumeCount) * 100)"
                  />
                  <p class="text-[10px] w-[40px]">{{ i.resume_count }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="overflow-auto h-[calc(50vh-106px)]">
        <template v-if="tab === 0">
          <highcharts
            :options="newChartOptions"
            class="w-full m-auto h-[calc(100%-100px)]"
          ></highcharts>
          <ul class="flex gap-4 flex-col text-[10px] justify-center">
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #D15B32"
              ></p>
              Все резюме: <b>{{ Numeral(resume_count) }}</b>
            </li>
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #801F00"
              ></p>
              Квалифицированные профессии: <b>{{ Numeral(qual_resume_prof) }}</b>
            </li>
            <li class="flex gap-2">
              <p
                class="w-4 h-4 rounded-full"
                style="background-color: #FFA559"
              ></p>
              Рабочие профессии:
              <b>{{ Numeral(rab_resume_prof) }}</b>
            </li>
          </ul>
        </template>
      </div>
    </div>
    </div>
    <F3ModalWidget :visible="visible" @close="visible = false" />
  </BaseCard>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getF3 } from "../../../entities/f/api";
import { PieChartOutlined } from "@ant-design/icons-vue";
import { Numeral } from "../../../shared/helpers/numeral";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import F3ModalWidget from "./modals/F3ModalWidget.vue";

const loader = ref(false);
const data = ref([]);
const tab = ref(0);
const visible = ref(false);

async function loadF3() {
  loader.value = true;

  data.value = await getF3().finally(() => {
    loader.value = false;
  });
}

loadF3();

const qual_prof = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.qual_prof), 0)
);
const rab_prof = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.rab_prof), 0)
);
const vacancy_count = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.vacancy_count), 0)
);

const qual_resume_prof = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.qual_resume), 0)
);

const rab_resume_prof = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.rab_resume), 0)
);

const resume_count = computed(() =>
  data.value.reduce((acc, curr) => (acc += curr.resume_count), 0)
);

const groupByNkz = computed(() =>
  Object.values(
    data.value.reduce((acc, curr) => {
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
  ).sort((a, b) => (tab.value === 2 ? b.soot - a.soot : a.soot - b.soot))
);

const maxVacancyCount = computed(
  () =>
    Object.values(groupByNkz.value).sort(
      (a, b) => b.vacancy_count - a.vacancy_count
    )[0]?.vacancy_count
);
const maxResumeCount = computed(
  () =>
    Object.values(groupByNkz.value).sort(
      (a, b) => b.resume_count - a.resume_count
    )[0]?.resume_count
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
      name: "Весь рынок",
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
const newChartOptions = computed(() => ({
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
      name: "Весь рынок",
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
