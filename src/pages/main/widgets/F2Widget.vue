<template>
  <div>
    <BaseCard title="Занятые по отраслям" number="F2" @open="visible = true" :show-open-button="true">
      <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
      <div class="flex gap-1 text-white mt-1 mb-1">
        <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn">
          По отраслям
        </div>
        <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn">
          Качественные рабочие места
        </div>
      </div>
      <div class="overflow-auto h-[calc(42vh-66px)]" v-if="tab === 0">
        <highcharts :options="chartOptions" class="w-full m-auto h-max"></highcharts>
      </div>
      <div v-if="tab === 1" class="overflow-auto h-[calc(42vh-66px)]">
          <highcharts :options="chartOptions2" class="w-full m-auto h-max"></highcharts>
        </div> 
    </BaseCard>

    <F2ModalWidget :data="data" :visible="visible" :dataF6="dataF6" :dataF6_2023="dataF6_2023" @close="visible = false" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { getF2_new, getF6, getF2_2023 } from "../../../entities/f/api";
import { Numeral } from "../../../shared/helpers/numeral";
import F2ModalWidget from "./modals/F2ModalWidget.vue";

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
  parent1_code: string | null;
  parent2_code: string | null;
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
  parent1_code: number | string | null;
  parent2_code: number | string | null;
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
const currentRegion = ref("");
const selectedYear = ref('2024');

async function loadF2() {
  try {
    const [f2Data, f6Data, f6Data2023] = await Promise.all([
      getF2_new(),
      getF6(),
      getF2_2023()
    ]);
    
    data.value = f2Data;
    dataF6.value = f6Data;
    dataF6_2023.value = f6Data2023.map((item: F2_2023_Data) => ({
      tp: item.TP,
      id_reg: item.REGID ? Number(item.REGID) : null,
      reg_ru: item.REG_RU || null,
      id_rai: item.IDRAI ? Number(item.IDRAI) : null,
      rai_ru: item.RAI_RU || null,
      vcode_oked: item.VCODE_OKED || '',
      vname_oked: item.VNAME_OKED || item.REG_RU || '',
      cnt: item.CNT,
      cnt_quality: item.CNT_QUALITY,
      cnt_not_quality: item.CNT - item.CNT_QUALITY,
      parent1_code: item.REGID ? Number(item.REGID) : null,
      parent2_code: item.IDRAI ? Number(item.IDRAI) : null
    }));
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
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
  return dataSource
    .filter(item => item.tp === 2)
    .filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
    .sort((a, b) => b.cnt_not_quality - a.cnt_not_quality);
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

const list = computed(() =>
  Object.values(
    data.value
      .filter((item) => item.tip === 1)
      .filter((item) =>
        !!currentRegion.value ? item.parent1_code === currentRegion.value : true
      )
      .filter((item) => item.vname_oked !== "Окэд не указан")
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
      spacingLeft: 10,
      spacingRight: 150,
      marginRight: 100,
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
        maxPointWidth: 300,
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
