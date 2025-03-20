<template>
    <a-modal
      :footer="null"
      class="p-0"
      width="100%"
      height="100%"
      :closable="false"
      :centered="true"
      :visible="visible"
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
      >
        <div class="overflow-auto h-[calc(94vh)] grid grid-cols-2">
          <div class="grid">
           
            
            <highcharts :options="chartOptions" class="w-full m-auto h-max"></highcharts>
          </div>
          <div class="map h-[calc(90vh)] relative w-[calc(100%)] ml-[5px]">
            <div
            v-if="!!currentRegion"
            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="() => {
              if (!!currentRaion) {
                currentRaion = null;
                return;
              }
              currentRegion = null;
            }"
          >
            <CloseOutlined />
          </div>
          
          <div v-if="!isMapActive" class="absolute inset-0 flex items-center justify-center bg-[#222732] bg-opacity-80 z-10">
            <div class="text-center p-6 bg-[#252A36] rounded-lg shadow-lg">
              <p class="text-lg text-amber-400 mb-2">Нет данных для карты</p>
              <p class="text-sm text-gray-300">В предоставленных данных отсутствует информация о регионах и районах</p>
            </div>
          </div>
          
          <BaseMap
            v-if="!currentRegion"
            :current-region="currentRegion ? Number(currentRegion) : undefined"
            :fill-color="
              (v) => {
                const totalProc = groupByRegion[v]?.totalProc || 0;
                const sortedRegions = Object.values(groupByRegion).sort((a, b) => b.totalProc - a.totalProc);
                const index = sortedRegions.findIndex(region => region === groupByRegion[v]);

                if (index < 6) {
                  return getColorFromGradient(100); // Зеленый
                } else if (index >= sortedRegions.length - 6) {
                  return getColorFromGradient(10); // Красный
                } else {
                  return getColorFromGradient(50); // Оранжевый
                }
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
                <p>Процент качественных рабочих мест:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRegion[slotProps.data.parent1_code?.toString()]?.totalProc || 0) >= 0 
                    ? '#109669' 
                    : '#FE6A35'
                }`">
                  {{ ((groupByRegion[slotProps.data.parent1_code?.toString()]?.totalProc || 0) + 50).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMap>

          <BaseMapNoMarker
            v-else
            :current-region="currentRegion ? Number(currentRegion) : 0"
            :current-raion="currentRaion ? Number(currentRaion) : undefined"
            :zoom="currentRegion ? getCityZoom(currentRegion) : 7"
            :fill-color="(v) => {
              if (!groupByRaion[v] || groupByRaion[v].parent1_code !== Number(currentRegion)) {
                return '#222732'; 
              }

              const totalProc = groupByRaion[v].totalProc || 0;
              const sortedRaions = Object.values(groupByRaion)
                .filter(raion => raion.parent1_code === Number(currentRegion)) 
                .sort((a, b) => b.totalProc - a.totalProc);
              const index = sortedRaions.findIndex(raion => raion === groupByRaion[v]);

              if (index < 6) {
                return getColorFromGradient(100); // Зеленый
              } else if (index >= sortedRaions.length - 6) {
                return getColorFromGradient(10); // Красный
              } else {
                return getColorFromGradient(50); // Оранжевый
              }
            }"
            @click-polygon="clickRaion"
            v-slot="slotProps"
          >
            <div>
              <div class="flex items-center gap-2">
                <p>Район:</p>
                <p class="font-bold">{{ slotProps.data.raion }}</p>
              </div>
              <div class="flex items-center gap-2">
                <p>Процент качественных рабочих мест:</p>
                <p class="font-bold" :style="`color: ${
                  (groupByRaion[slotProps.data.parent2_code?.toString()]?.totalProc || 0) >= 0 
                    ? '#109669' 
                    : '#FE6A35'
                }`">
                  {{ ((groupByRaion[slotProps.data.parent2_code?.toString()]?.totalProc || 0) + 50).toFixed(1) }}%
                </p>
              </div>
            </div>
          </BaseMapNoMarker>
          </div>
        </div>
      </BaseCard>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
  import { CloseOutlined } from "@ant-design/icons-vue";
  import { computed, ref, watch } from "vue";
  import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
  import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
  import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";
  import { Numeral } from "../../../../shared/helpers/numeral";

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

  const props = defineProps<{
    data: F6Data[];
    visible: boolean;
  }>();

  const currentRegion = ref<string | null>(null);
  const currentRaion = ref<string | null>(null);
  const loader = ref(false);

  defineEmits(['close']);

  
  const getCityZoom = (regionCode: string | null): number => {
    if (regionCode === null) return 7;
    
    
    const regionNumber = Number(regionCode);
    if (
      regionNumber === 710000000 || 
      regionNumber === 750000000 || 
      regionNumber === 790000000
    ) {
      return 10; 
    }
    
    return 7; 
  };


  function clickPolygon(code: string) {
    console.log('Выбран регион с кодом:', code);
    currentRegion.value = code;
    currentRaion.value = null;
  }

  function clickRaion(code: string) {
    console.log('Выбран район с кодом:', code);
    
    
    const raionData = props.data.find(item => 
      item.tp === 4 && safeCompare(item.parent2_code, code)
    );
    
   
    if (raionData && raionData.parent1_code) {
     
      if (!currentRegion.value) {
        currentRegion.value = raionData.parent1_code.toString();
      }
    }
    
    currentRaion.value = code;
  }


 

 
  const EXCLUDED_OKED_CATEGORIES = [
    "Окэд не указан", 
    "Дея-ть экстерриториальных организаций", 
    "Дея-ть домашних хозяйств"
  ];

  function safeCompare(value1: string | number | null | undefined, value2: string | number | null | undefined): boolean {
    if (value1 === null || value1 === undefined || value2 === null || value2 === undefined) {
      return false;
    }
    
    const str1 = String(value1).trim();
    const str2 = String(value2).trim();
    
    if (str1 === str2) {
      return true;
    }
    
    const norm1 = str1.replace(/^0+/, '');
    const norm2 = str2.replace(/^0+/, '');
    
    return norm1 === norm2;
  }

  const filteredData = computed(() => {
    let filtered = props.data;
    console.log('Всего записей:', props.data.length);

    if (currentRaion.value) {
      filtered = filtered.filter(item => {
        const matchCode = safeCompare(item.parent2_code, currentRaion.value);
        const match = (item.tp === 4) && matchCode;
        return match;
      });
      console.log('После фильтрации по району:', filtered.length);
    } else if (currentRegion.value) {
      filtered = filtered.filter(item => {
        const matchCode = safeCompare(item.parent1_code, currentRegion.value);
        
        const match = (item.tp === 3 || item.tp === 1) && matchCode;
        return match;
      });
      console.log('После фильтрации по региону:', filtered.length);
      
      if (filtered.length < 3) {
        console.log('Мало данных, пробуем альтернативный подход');
        
        const regionInfo = props.data.find(item => 
          item.parent1_code?.toString() === currentRegion.value && item.reg_ru
        );
        
        if (regionInfo && regionInfo.reg_ru) {
          console.log('Пробуем фильтровать по имени региона:', regionInfo.reg_ru);
          
          const regionName = regionInfo.reg_ru;
          const regionRecords = props.data.filter(item => 
            (item.tp === 3 || item.tp === 1) && item.reg_ru === regionName
          );
          
          if (regionRecords.length > 0) {
            filtered = regionRecords;
            console.log('Найдено записей по имени региона:', filtered.length);
          }
        }
      }
    } else {
      filtered = filtered.filter(item => item.tp === 3);
      
      if (filtered.length === 0) {
        filtered = props.data.filter(item => item.tp === 1);
        console.log('Используем данные tp=1:', filtered.length);
      }
      
      console.log('Общие данные:', filtered.length);
    }

    filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked));
    console.log('После исключения категорий:', filtered.length);
    
    if (filtered.length === 0) {
      console.warn('Данных не найдено, используем запасной вариант');
      
      if (currentRaion.value) {
        filtered = props.data.filter(item => item.tp === 4);
      } else if (currentRegion.value) {
        filtered = props.data.filter(item => item.tp === 3 || item.tp === 1);
      } else {
        filtered = props.data;
      }
      
      filtered = filtered.filter(item => !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked));
      console.log('Запасной вариант, записей:', filtered.length);
    }

    const grouped = filtered.reduce((acc, curr) => {
      if (!curr.vcode_oked) return acc;

      if (!acc[curr.vcode_oked]) {
        acc[curr.vcode_oked] = {
          ...curr,
          cnt: curr.cnt,
          cnt_quality: curr.cnt_quality,
          cnt_not_quality: curr.cnt_not_quality
        };
        return acc;
      }

      acc[curr.vcode_oked].cnt += curr.cnt;
      acc[curr.vcode_oked].cnt_quality += curr.cnt_quality;
      acc[curr.vcode_oked].cnt_not_quality += curr.cnt_not_quality;
      
      return acc;
    }, {} as Record<string, F6Data>);

    return Object.values(grouped).sort((a, b) => b.cnt - a.cnt);
  });

  const groupByRegion = computed(() => {
    const result = props.data
      .filter(item => item.tp === 3 && !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
      .reduce((acc, curr) => {
        const regionCode = curr.parent1_code?.toString() || "";
        
        if (!acc[regionCode]) {
          const qualityPercent = curr.cnt > 0 
            ? (curr.cnt_quality / curr.cnt) * 100 - 50 
            : 0;
            
          acc[regionCode] = { 
            ...curr,
            totalProc: qualityPercent
          };
          return acc;
        }

        acc[regionCode].cnt += curr.cnt;
        acc[regionCode].cnt_quality += curr.cnt_quality;
        acc[regionCode].cnt_not_quality += curr.cnt_not_quality;
        
        const totalCnt = acc[regionCode].cnt;
        const qualityCnt = acc[regionCode].cnt_quality;
        acc[regionCode].totalProc = totalCnt > 0 
          ? (qualityCnt / totalCnt) * 100 - 50 
          : 0;
        
        return acc;
      }, {} as Record<string, F6Data & { totalProc: number }>);

    return result;
  });

  const groupByRaion = computed(() => {
    const result = props.data
      .filter(item => item.tp === 4 && !EXCLUDED_OKED_CATEGORIES.includes(item.vname_oked))
      .reduce((acc, curr) => {
        const raionCode = curr.parent2_code?.toString() || "";
        const parent1Code = curr.parent1_code ? Number(curr.parent1_code) : null;
        
        if (!acc[raionCode]) {
          const qualityPercent = curr.cnt > 0 
            ? (curr.cnt_quality / curr.cnt) * 100 - 50 
            : 0;
            
          acc[raionCode] = { 
            ...curr,
            parent1_code: parent1Code,
            totalProc: qualityPercent
          };
          return acc;
        }

        acc[raionCode].cnt += curr.cnt;
        acc[raionCode].cnt_quality += curr.cnt_quality;
        acc[raionCode].cnt_not_quality += curr.cnt_not_quality;
        
        const totalCnt = acc[raionCode].cnt;
        const qualityCnt = acc[raionCode].cnt_quality;
        acc[raionCode].totalProc = totalCnt > 0 
          ? (qualityCnt / totalCnt) * 100 - 50 
          : 0;
        
        return acc;
      }, {} as Record<string, F6Data & { parent1_code: number | null, totalProc: number }>);

    return result;
  });

  const selectedAreaStats = computed(() => {
    let qualityTotal = 0;
    let notQualityTotal = 0;
    let allTotal = 0;
    
    filteredData.value.forEach(item => {
      qualityTotal += item.cnt_quality;
      notQualityTotal += item.cnt_not_quality;
      allTotal += item.cnt;
    });
    
    const qualityPercent = allTotal > 0 ? (qualityTotal / allTotal) * 100 : 0;
    const notQualityPercent = allTotal > 0 ? (notQualityTotal / allTotal) * 100 : 0;
    
    return {
      qualityTotal,
      notQualityTotal,
      allTotal,
      qualityPercent,
      notQualityPercent
    };
  });

  const selectedRegionName = computed(() => {
    if (!currentRegion.value) return '';
    
    const regionData = props.data.find(item => 
      (item.tp === 3 || item.tp === 1) && safeCompare(item.parent1_code, currentRegion.value) && item.reg_ru
    );
    
    return regionData?.reg_ru || '';
  });

  const selectedRaionName = computed(() => {
    if (!currentRaion.value) return '';
    
    const raionData = props.data.find(item => 
      item.tp === 4 && safeCompare(item.parent2_code, currentRaion.value) && item.rai_ru
    );
    
    return raionData?.rai_ru || '';
  });

  const getFullTerritoryName = computed(() => {
    if (currentRaion.value && selectedRaionName.value) {
      if (selectedRegionName.value) {
        return `${selectedRegionName.value}, ${selectedRaionName.value}`;
      } else {
        return selectedRaionName.value;
      }
    } else if (currentRegion.value && selectedRegionName.value) {
      return selectedRegionName.value;
    }
    return "Республика Казахстан";
  });

  const chartOptions = computed(() => {
    let chartTitle = getFullTerritoryName.value;
    
    return {
      chart: {
        type: "bar",
        height: "150%",
        backgroundColor: "transparent",
        spacingLeft: 10,
        spacingRight: 10,
        marginTop: 50,
        marginBottom: 50,
        animation: {
          duration: 500
        }
      },
      title: {
        text: chartTitle,
        style: {
          color: "#fff",
          fontSize: "16px"
        }
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
                  Некачественные: ${Numeral(notQualityCount)} (${((notQualityCount / totalCount) * 100).toFixed(1)}%)<br/>
                  Всего: ${Numeral(totalCount)}`;
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          borderWidth: 0,
          pointWidth: 30,
          minPointLength: 1,
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

  const isMapActive = computed(() => {
    return props.data.some(item => item.parent1_code || item.parent2_code);
  });

  const hasChartData = computed(() => {
    return filteredData.value.length > 0;
  });
  </script>
  