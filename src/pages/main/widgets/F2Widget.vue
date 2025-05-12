<template>
  <div>
    <BaseCard title="Занятые по отраслям" number="F2" @open="visible = true" :show-open-button="true">
      <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
      <div class="flex justify-between text-white mt-1 mb-1">
        <div class="flex gap-1">
          <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn">
            По отраслям
          </div>
          <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn">
            Качественные рабочие места
          </div>
        </div>
      </div>
      <div class="overflow-auto h-[calc(42vh-66px)]" v-if="tab === 0">
        <div v-if="list.length === 0" class="flex items-center justify-center h-full text-gray-400">
          Нет данных для отображения
        </div>
        <highcharts v-else :options="chartOptions" class="w-full m-auto h-max"></highcharts>
      </div>
      <div v-if="tab === 1" class="overflow-auto h-[calc(42vh-66px)]">
          <div v-if="filteredData.length === 0" class="flex items-center justify-center h-full text-gray-400">
            Нет данных для отображения
          </div>
          <highcharts v-else :options="chartOptions2" class="w-full m-auto h-max"></highcharts>
        </div> 
    </BaseCard>

    <F2ModalWidget :data="data" :visible="visible" :dataF6="dataF6" :dataF6_2023="dataF6_2023" @close="visible = false" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { getF2_new, getF6, getF2_2023 } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F2ModalWidget from "./modals/F2ModalWidget.vue";
import { useAuthStore } from "../../../stores/auth.store";

const tab = ref(0);

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
}

interface F6Data {
  tp: number;
  id_reg: number | null;
  reg_ru: string | null;
  id_rai: number | null;
  rai_ru: string | null;
  vcode_oked: string;
  vname_oked: string;
  cnt: number;
  cnt_quality: number;
  cnt_not_quality: number;
}

interface F2_2023_Data {
  TP: number;
  REGID?: string;
  REG_RU?: string;
  IDRAI?: string;
  RAI_RU?: string;
  VCODE_OKED?: string;
  VNAME_OKED?: string;
  CNT: number;
  CNT_QUALITY: number;
}

const loader = ref(true);
const data = ref<F2Data[]>([]);
const dataF6 = ref<F6Data[]>([]);
const dataF6_2023 = ref<F6Data[]>([]);
const visible = ref(false);
const currentRegion = ref<number | null>(null);
const selectedYear = ref('2024');
const authStore = useAuthStore();

async function loadF2() {
  try {
    loader.value = true;
    
    const [f2Data, f6Data, f6Data2023] = await Promise.all([
      getF2_new(),
      getF6(),
      getF2_2023()
    ]);
    
    data.value = f2Data.map((item: any) => ({
      ...item,
      id_reg: typeof item.id_reg === 'string' ? Number(item.id_reg) : item.id_reg,
      id_rai: typeof item.id_rai === 'string' ? Number(item.id_rai) : item.id_rai
    }));
    
    dataF6.value = f6Data.map((item: any) => ({
      ...item,
      id_reg: typeof item.id_reg === 'string' ? Number(item.id_reg) : item.id_reg,
      id_rai: typeof item.id_rai === 'string' ? Number(item.id_rai) : item.id_rai
    }));
    
    dataF6_2023.value = f6Data2023.map((item: F2_2023_Data) => ({
      tp: item.TP,
      id_reg: item.REGID ? Number(item.REGID) : null,
      reg_ru: item.REG_RU || null,
      id_rai: item.IDRAI ? Number(item.IDRAI) : null,
      rai_ru: item.RAI_RU || null,
      vcode_oked: item.VCODE_OKED || '',
      vname_oked: item.VNAME_OKED || '',
      cnt: item.CNT,
      cnt_quality: item.CNT_QUALITY,
      cnt_not_quality: item.CNT - item.CNT_QUALITY
    }));
    
    const userRegions = authStore.getAllowedRegions;
    
    if (userRegions.length === 1 && userRegions[0].id_reg !== 0) {
      currentRegion.value = userRegions[0].id_reg;
    }
    
    tab.value = 0;
  } catch (error) {
    console.error("Ошибка загрузки данных F2:", error);
  } finally {
    loader.value = false;
  }
}

const QUALITY_COLOR = '#109669'; // Зеленый
const NOT_QUALITY_COLOR = '#3090E8'; // Синий
const TOTAL_COLOR = '#9370DB'; // Фиолетовый

const EXCLUDED_OKED_CATEGORIES = [
  "Окэд не указан", 
  "Дея-ть экстерриториальных организаций", 
  "Дея-ть домашних хозяйств"
];

const filteredData = computed(() => {
  const dataSource = selectedYear.value === '2023' ? dataF6_2023.value : dataF6.value;
  
  if (!dataSource || dataSource.length === 0) {
    return [];
  }
  
  const userRegions = authStore.getAllowedRegions;
  
  let filtered = [];
  
  if (currentRegion.value !== null) {
    filtered = dataSource.filter(item => 
      (item.tp === 3 || item.tp === 2) && 
      item.id_reg === currentRegion.value
    );
    
    if (filtered.length === 0) {
      filtered = dataSource.filter(item => 
        item.tp === 1 && 
        item.id_reg === currentRegion.value
      );
    }
  } else {
    filtered = dataSource.filter(item => item.tp === 2);
    
    if (!userRegions.some(region => region.id_reg === 0)) {
      filtered = filtered.filter(item => 
        userRegions.some(region => region.id_reg === item.id_reg)
      );
    }
  }
  
  filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked));
  
  console.log(`Отфильтровано ${filtered.length} записей F6 для региона ${currentRegion.value}`);
  
  const grouped = filtered.reduce((acc, curr) => {
    const key = curr.vcode_oked;
    if (!acc[key]) {
      acc[key] = {
        ...curr,
        cnt: curr.cnt || 0,
        cnt_quality: curr.cnt_quality || 0,
        cnt_not_quality: curr.cnt_not_quality || 0
      };
    } else {
      acc[key].cnt += curr.cnt || 0;
      acc[key].cnt_quality += curr.cnt_quality || 0;
      acc[key].cnt_not_quality += curr.cnt_not_quality || 0;
    }
    return acc;
  }, {} as Record<string, F6Data>);
  
  return Object.values(grouped).sort((a, b) => b.cnt - a.cnt);
});

const chartOptions2 = computed(() => {
  return {
    chart: {
      type: "bar",
      height: "150%",
      backgroundColor: "transparent",
      spacingLeft: 10,
      spacingRight: 10,
      marginTop: 50,
      marginBottom: 50
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: filteredData.value.slice(0, 19).map(item => item.vname_oked),
      labels: {
        style: {
          color: "#fff",
          fontSize: "10px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: null
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: {
        color: '#fff',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const series = this.series;
        const point = this.point;
        const x = this.x;
        const y = this.y || 0;
        
        const categoryData = filteredData.value.find(item => item.vname_oked === x);
        const qualityCount = categoryData ? categoryData.cnt_quality : 0;
        const notQualityCount = categoryData ? categoryData.cnt_not_quality : 0;
        const totalCount = qualityCount + notQualityCount;
        
       
        const colorCircle = (color: string) => 
          `<div style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${color}; margin-right:6px; vertical-align:middle;"></div>`;
          
        return `<div><b>${x}</b><br/>
                <div style="display:flex; align-items:center; margin-top:5px;">
                  ${colorCircle(QUALITY_COLOR)}
                  <span>Качественные: ${Numeral(qualityCount)} (${((qualityCount / totalCount) * 100).toFixed(1)}%)</span>
                </div>
                <div style="display:flex; align-items:center; margin-top:3px;">
                  ${colorCircle(NOT_QUALITY_COLOR)}
                  <span>Некачественные: ${Numeral(notQualityCount)} (${((notQualityCount / totalCount) * 100).toFixed(1)}%)</span>
                </div>
                <div style="display:flex; align-items:center; margin-top:3px;">
                  ${colorCircle(TOTAL_COLOR)}
                  <span>Всего: ${Numeral(totalCount)}</span>
                </div></div>`;
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        borderWidth: 0,
        pointWidth: 30,
        minPointLength: 50,
        groupPadding: 0.1,
        pointPadding: 0.05,
        dataLabels: {
          enabled: true,
          formatter: function(this: Highcharts.PointLabelObject): string {
            if (this.y && this.y > 1000) {
              return Numeral(this.y);
            } else if (this.y && this.y > 0) {
              return this.y > 500 ? Numeral(this.y) : '';
            }
            return '';
          },
          style: {
            color: '#fff',
            textOutline: 'none',
            fontSize: '11px',
            fontWeight: 'normal'
          },
          inside: true,
          crop: false,
          overflow: 'allow'
        }
      }
    },
    colors: [QUALITY_COLOR, NOT_QUALITY_COLOR],
    series: [
      {
        name: 'Качественные',
        data: filteredData.value.slice(0, 19).map(item => ({
          y: item.cnt_quality,
          dataLabels: {
            enabled: item.cnt_quality > 500
          }
        })),
      },
      {
        name: 'Рабочие места',
        data: filteredData.value.slice(0, 19).map(item => ({
          y: item.cnt_not_quality,
          dataLabels: {
            enabled: item.cnt_not_quality > 500
          }
        })),
      }
    ]
  };
});

const list = computed(() => {
  const userRegions = authStore.getAllowedRegions;
  
  if (!data.value || data.value.length === 0) {
    return [];
  }
  
  let filtered = data.value;
  
  if (currentRegion.value !== null) {
    filtered = filtered.filter((item) => {
      return item.tip === 2 && item.id_reg === currentRegion.value;
    });
    
    if (filtered.length === 0) {
      filtered = data.value.filter((item) => {
        return item.tip === 3 && item.id_reg === currentRegion.value;
      });
    }
  } else {
    filtered = filtered.filter((item) => item.tip === 1);
    
    if (!userRegions.some(region => region.id_reg === 0)) {
      filtered = filtered.filter(item => 
        userRegions.some(region => region.id_reg === item.id_reg)
      );
    }
  }
  
  filtered = filtered.filter((item) => item.vname_oked !== "Окэд не указан");

  console.log(`Отфильтровано ${filtered.length} записей для региона ${currentRegion.value}`);

  return Object.values(
    filtered.reduce((acc, curr) => {
      if (!curr.vcode_oked) return acc;

      if (!acc[curr.vcode_oked]) {
        acc[curr.vcode_oked] = { ...curr };
        return acc;
      }

      acc[curr.vcode_oked].cnt_2023 += curr.cnt_2023;
      acc[curr.vcode_oked].cnt_2024 += curr.cnt_2024;
      acc[curr.vcode_oked].proc = ((acc[curr.vcode_oked].cnt_2024 - acc[curr.vcode_oked].cnt_2023) / acc[curr.vcode_oked].cnt_2023) * 100;
      return acc;
    }, {} as Record<string, F2Data>)
  ).sort((a, b) => b.cnt_2024 - a.cnt_2024);
});

const groupByRegion = computed(() =>
  data.value
    .filter((item) => item.tip === 1)
    .filter((item) =>
      currentRegion.value !== null ? item.id_reg === currentRegion.value : true
    )
    .reduce((acc, curr) => {
      if (!acc[curr.id_reg || '']) {
        acc[curr.id_reg || ''] = { ...curr };
        return acc;
      }

      acc[curr.id_reg || ''].cnt_2024 += curr.cnt_2024;
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
      spacingLeft: 10,
      spacingRight: 150,
      marginRight: 100,
    },
    title: {
      text: "",
      style: {
        color: "#fff",
        fontSize: "14px"
      }
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
          formatter: function(this: any): string {
            const item = list.value.find(i => i.cnt_2024 === this.point.y);
            const proc = item ? item.proc : 0;
            const bgColor = proc < 0 ? '#FE6A35' : '#109669';
            return this.point.price + ' <span style="font-weight: bold; background-color: ' + bgColor + '; padding: 2px 6px; border-radius: 4px; margin-left: 5px; display: inline-block;">' + proc.toFixed(1) + ' %</span>';
          },
          useHTML: true,
          enabled: true,
          crop: false,
          overflow: 'allow',
          style: {
            color: "#fff",
          },
        },
        showInLegend: true,
      },
    },
    xAxis: {
      categories: list.value.slice(0, 10).map((item) => item.vname_oked),
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
        maxPointWidth: 300,
        data: list.value.slice(0, 10).map((e) => ({
          y: e.cnt_2024,
          color: "#3090E8",
          price: Numeral(e.cnt_2024),
        })),
      },
    ],
  };
});

onMounted(() => {
  loadF2();
  
  setTimeout(() => {
    console.log(`Загружено записей: ${data.value.length}, отфильтровано: ${list.value.length}`);
    console.log(`Текущий регион: ${currentRegion.value}, доступные регионы:`, authStore.getAllowedRegions);
  }, 2000);
});

function getRegionName(regionId: number): string {
  const regions = authStore.getAllowedRegions;
  return regions.find(r => r.id_reg === regionId)?.name || `Регион ${regionId}`;
}
</script>