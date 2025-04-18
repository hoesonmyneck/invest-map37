<template>
  <a-modal :footer="null" class="p-0" width="100%" height="100%" :closable="false" :centered="true">
    <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <BaseCard v-else title="" number="" :show-close-button="true" @close="$emit('close')">
      
      <div class="grid grid-cols-3 text-white h-[40vh]">
        <div class="flex justify-around">
          <div >
          <highcharts :options="chartOptions" class="w-[100%] m-auto h-[60%]"></highcharts>
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
              <p class="w-4 h-4 rounded-full" style="background-color: #434F8B"></p>
              Неквалифицированные профессии:
              <b>{{ Numeral(nekval_prof) }}</b>
            </li>
            <li class="flex gap-2 mb-2">
              <p class="w-4 h-4 rounded-full" style="background-color: #0027E9"></p>
              Рабочие профессии:
              <b>{{ Numeral(rab_prof) }}</b>
            </li>
          </ul>
          </div>
          <div>
          <highcharts :options="resumeChartOptions" class="w-[100%] m-auto h-[60%]"></highcharts>
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
              <p class="w-4 h-4 rounded-full" style="background-color: #925948"></p>
              Неквалифицированные профессии:
              <b>{{ Numeral(nekval_resume_prof) }}</b>
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
            <div v-for="i in topNkzItems" :key="i.name_nkz"
              class="grid grid-cols-2 gap-2 justify-between items-center text-xs text-white mb-2">
              <a-tooltip placement="topLeft" :title="i.name_nkz">
                <p class="truncate cursor-pointer">{{ i.name_nkz }}</p>
              </a-tooltip>
              <div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#54ACFE" trailColor="#3B3F4B" :show-info="false" 
                    :percent="+Numeral((i.vacancy_count / maxVacancyCount) * 100)" />
                  <p class="text-[10px] w-[40px]">{{ i.vacancy_count }}</p>
                </div>
                <div class="flex items-center">
                  <a-progress class="h-2" strokeColor="#FE6A35" trailColor="#3B3F4B" :show-info="false" 
                    :percent="+Numeral((i.resume_count / maxVacancyCount) * 100)" />
                  <p class="text-[10px] w-[40px]">{{ i.resume_count }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="list overflow-auto h-[calc(40vh-50px)] pl-5 mt-4">
            <div v-for="i in topResumeItems" :key="i.name_nkz"
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
                  <a-progress class="h-2" strokeColor="#54ACFE" trailColor="#3B3F4B" :show-info="false" 
                    :percent="+Numeral((i.vacancy_count / maxResumeCount) * 100)" />
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
            class="rounded cursor-pointer bg-[#252A36] w-8 h-8 flex items-center justify-center"
            @click="currentRegion = null">
            <CloseOutlined />
          </div>
        </div>
        <BaseMap :current-region="currentRegion ? +currentRegion : undefined" :fill-color="getRegionColor" @click-polygon="clickPolygon" v-slot="slotProps">
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
import { computed, ref, watch, onMounted } from "vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF3 } from "../../../../entities/f/api";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";

interface F3Item {
  id_reg: number;
  name_nkz?: string;
  vacancy_count: number;
  resume_count: number;
  soot: number;
  qual_prof: number;
  rab_prof: number;
  qual_resume: number;
  rab_resume: number;
  [key: string]: any;
}

interface GroupedItem extends F3Item {
  name_nkz: string;
}

const loader = ref(true);
const data = ref<F3Item[]>([]);
const currentRegion = ref<number | null>(null);
const tab = ref(1);

const regionGroupCache = ref<Record<number, F3Item>>({});
const nkzGroupCache = ref<{
  byVacancy: GroupedItem[];
  byResume: GroupedItem[];
}>({
  byVacancy: [],
  byResume: []
});

async function loadF3() {
  loader.value = true;

  try {
    data.value = await getF3() as F3Item[];
    prepareData();
  } finally {
    loader.value = false;
  }
}

function prepareData() {
  regionGroupCache.value = groupByRegionInternal();
  updateNkzCache();
}

function updateNkzCache() {
  const groupedData = groupByNkzInternal();
  
  nkzGroupCache.value = {
    byVacancy: [...groupedData].sort((a, b) => a.soot - b.soot).slice(0, 15),
    byResume: [...groupedData].sort((a, b) => b.soot - a.soot).slice(0, 15)
  };
}

function clickPolygon(code: string) {
  currentRegion.value = +code;
}

function getRegionColor(code: string) {
  const regionData = regionGroupCache.value[+code];
  if (!regionData) return "#222732";
  
  const value = (tab.value === 1 ? regionData.vacancy_count : regionData.resume_count) / 
                (tab.value === 1 ? maxRegionVacancyCount.value : maxRegionResumeCount.value);
  
  return getColorFromGradient((value * 100) || 0);
}

function groupByNkzInternal(): GroupedItem[] {
  const filteredData = data.value.filter(item => 
    !currentRegion.value ? true : item.id_reg === currentRegion.value
  );
  
  const grouped: Record<string, GroupedItem> = {};
  
  for (const item of filteredData) {
    if (!item.name_nkz) continue;
    
    if (!grouped[item.name_nkz]) {
      grouped[item.name_nkz] = { 
        ...item,
        name_nkz: item.name_nkz
      };
    } else {
      grouped[item.name_nkz].vacancy_count += item.vacancy_count;
      grouped[item.name_nkz].resume_count += item.resume_count;
      grouped[item.name_nkz].soot += item.soot;
    }
  }
  
  return Object.values(grouped);
}

function groupByRegionInternal(): Record<number, F3Item> {
  const grouped: Record<number, F3Item> = {};
  
  for (const item of data.value) {
    if (!item.id_reg) continue;
    
    if (!grouped[item.id_reg]) {
      grouped[item.id_reg] = { ...item };
    } else {
      grouped[item.id_reg].vacancy_count += item.vacancy_count;
      grouped[item.id_reg].resume_count += item.resume_count;
      grouped[item.id_reg].soot += item.soot;
    }
  }
  
  return grouped;
}

const topNkzItems = computed(() => nkzGroupCache.value.byVacancy);
const topResumeItems = computed(() => nkzGroupCache.value.byResume);

const maxVacancyCount = computed(() => {
  return groupByNkzInternal()
    .sort((a, b) => b.vacancy_count - a.vacancy_count)[0]?.vacancy_count || 0;
});

const maxResumeCount = computed(() => {
  return groupByNkzInternal()
    .sort((a, b) => b.resume_count - a.resume_count)[0]?.resume_count || 0;
});

const maxRegionVacancyCount = computed(() => {
  const regions = Object.values(regionGroupCache.value)
    .sort((a, b) => b.vacancy_count - a.vacancy_count);
  return regions.length > 0 ? regions[0].vacancy_count : 0;
});

const maxRegionResumeCount = computed(() => {
  const regions = Object.values(regionGroupCache.value)
    .sort((a, b) => b.resume_count - a.resume_count);
  return regions.length > 0 ? regions[0].resume_count : 0;
});

const filteredData = computed(() => 
  data.value.filter(item => !currentRegion.value ? true : item.id_reg === currentRegion.value)
);

const qual_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.qual_prof, 0)
);

const rab_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.rab_prof, 0)
);

const qual_resume_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.qual_resume, 0)
);

const rab_resume_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.rab_resume, 0)
);

const vacancy_count = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.vacancy_count, 0)
);

const resume_count = computed(() => 
  filteredData.value.reduce((acc, curr) => acc + curr.resume_count, 0)
);

const nekval_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => {
    if (curr.qual_prof === 0 && curr.vacancy_count) {
      return acc + curr.vacancy_count;
    }
    return acc;
  }, 0)
);

const nekval_resume_prof = computed(() => 
  filteredData.value.reduce((acc, curr) => {
    if (curr.qual_resume === 0 && curr.resume_count) {
      return acc + curr.resume_count;
    }
    return acc;
  }, 0)
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
      {
        outerRadius: "37%",
        innerRadius: "13%",
        backgroundColor: "#54E9D720",
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
          y: vacancy_count.value > 0 ? (qual_prof.value / vacancy_count.value) * 100 : 0,
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
          y: vacancy_count.value > 0 ? (rab_prof.value / vacancy_count.value) * 100 : 0,
        },
      ],
      custom: {
        icon: "commenting-o",
        iconColor: "#303030",
      },
    },
    {
      name: "Неквалифицированные профессии",
      data: [
        {
          color: "#434F8B",
          radius: "37%",
          innerRadius: "13%",
          count: Numeral(nekval_prof.value),
          y: vacancy_count.value > 0 ? (nekval_prof.value / vacancy_count.value) * 100 : 0,
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
      {
        outerRadius: "37%",
        innerRadius: "13%",
        backgroundColor: "#FF598420",
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
          y: resume_count.value > 0 ? (qual_resume_prof.value / resume_count.value) * 100 : 0,
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
          y: resume_count.value > 0 ? (rab_resume_prof.value / resume_count.value) * 100 : 0,
        },
      ],
      custom: {
        icon: "commenting-o",
        iconColor: "#303030",
      },
    },
    {
      name: "Неквалифицированные профессии",
      data: [
        {
          color: "#925948",
          radius: "37%",
          innerRadius: "13%",
          count: Numeral(nekval_resume_prof.value),
          y: resume_count.value > 0 ? (nekval_resume_prof.value / resume_count.value) * 100 : 0,
        },
      ],
      custom: {
        icon: "commenting-o",
        iconColor: "#303030",
      },
    },
  ],
}));

watch(currentRegion, () => {
  updateNkzCache();
});

watch(tab, () => {
});

onMounted(() => {
  loadF3();
});
</script>
