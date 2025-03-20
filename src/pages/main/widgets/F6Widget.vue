<template>
    <div>
    <BaseCard title="Качественные рабочие места" number="F6" @open="visible = true" :show-open-button="true">
      <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
    <div v-else class="text-white">
      <div class="flex gap-1">
        <div :class="{ active: tab === 0 }" @click="tab = 0" class="btn">
          По отраслям
        </div>
        <div :class="{ active: tab === 1 }" @click="tab = 1" class="btn">
          По регионам
        </div>
      </div>
        <div v-if="tab === 0" class="overflow-auto h-[calc(50vh-66px)]">
          <highcharts :options="chartOptions" class="w-full m-auto h-max"></highcharts>
        </div> 
        <div v-if="tab === 1" class="overflow-auto h-[calc(50vh-66px)]">
          <highcharts :options="chartOptionsRegions" class="w-full m-auto h-max"></highcharts>
        </div> 
    </div>
    </BaseCard>

    <F6ModalWidget :data="data" :visible="visible" @close="visible = false" />
  </div>
</template>
<script setup lang="ts"> 
import { computed, ref, onMounted } from "vue";
import BaseCard from "../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../shared/helpers/numeral";
import { getF6 } from "../../../entities/f/api";
import F6ModalWidget from "./modals/F6ModalWidget.vue";

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
  parent1_code: string | null;
  parent2_code: string | null;
}

const loader = ref(true);
const data = ref<F6Data[]>([]);
const visible = ref(false);
const tab = ref(0);


const EXCLUDED_OKED_CATEGORIES = [
  "Окэд не указан", 
  "Дея-ть экстерриториальных организаций", 
  "Дея-ть домашних хозяйств"
];

async function loadF6() {
  try {
    data.value = await getF6();
  } catch (error) {
    console.error("Ошибка при загрузке данных F6:", error);
  } finally {
    loader.value = false;
  }
}

onMounted(() => {
  loadF6();
});

const filteredData = computed(() => {
  return data.value
    .filter(item => item.tp === 2)
    .filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
    .sort((a, b) => b.cnt_not_quality - a.cnt_not_quality);
});

const filteredDataRegions = computed(() => {
  return data.value
    .filter(item => item.tp === 1)
    .filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
    .sort((a, b) => b.cnt_not_quality - a.cnt_not_quality);
});

const chartOptions = computed(() => {
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
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const series = this.series;
        const point = this.point;
        const x = this.x;
        const y = this.y || 0;
        
        const categoryData = filteredData.value.find(item => item.vname_oked === x);
        const qualityCount = categoryData ? categoryData.cnt_quality : 0;
        const notQualityCount = categoryData ? categoryData.cnt_not_quality : 0;
        const totalCount = qualityCount + notQualityCount;
        
        return `<b>${x}</b><br/>
                Качественные: ${Numeral(qualityCount)} (${((qualityCount / totalCount) * 100).toFixed(1)}%)<br/>
                Рабочие места: ${Numeral(notQualityCount)} (${((notQualityCount / totalCount) * 100).toFixed(1)}%)<br/>
                Всего: ${Numeral(totalCount)}`;
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
    colors: ['#109669', '#3090E8'],
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

const chartOptionsRegions = computed(() => {
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
      categories: filteredDataRegions.value.slice(0, 19).map(item => item.reg_ru),
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
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const series = this.series;
        const point = this.point;
        const x = this.x;
        const y = this.y || 0;
        
        const categoryData = filteredDataRegions.value.find(item => item.reg_ru === x);
        const qualityCount = categoryData ? categoryData.cnt_quality : 0;
        const notQualityCount = categoryData ? categoryData.cnt_not_quality : 0;
        const totalCount = qualityCount + notQualityCount;
        
        return `<b>${x}</b><br/>
                Качественные: ${Numeral(qualityCount)} (${((qualityCount / totalCount) * 100).toFixed(1)}%)<br/>
                Рабочие места: ${Numeral(notQualityCount)} (${((notQualityCount / totalCount) * 100).toFixed(1)}%)<br/>
                Всего: ${Numeral(totalCount)}`;
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
    colors: ['#109669', '#3090E8'],
    series: [
      {
        name: 'Качественные',
        data: filteredDataRegions.value.slice(0, 19).map(item => ({
          y: item.cnt_quality,
          dataLabels: {
            enabled: item.cnt_quality > 500
          }
        })),
      },
      {
        name: 'Рабочие места',
        data: filteredDataRegions.value.slice(0, 19).map(item => ({
          y: item.cnt_not_quality,
          dataLabels: {
            enabled: item.cnt_not_quality > 500
          }
        })),
      }
    ]
  };
});
</script>
