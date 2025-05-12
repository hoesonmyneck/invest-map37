<template>
    <div>
        <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
            <a-spin />
        </div>
        <div class="grid grid-cols-2">
            <div class="flex items-center h-[100vh] w-[190%] ml-70">
                <div class="text-white   gap-2 mb-50">
                    <div class="relative">
                    <highcharts :options="chartOptions" class="h-[350px] w-full m-auto"></highcharts>
                    <div class="absolute text-center top-[150px] m-auto left-1/2 -translate-x-1/2">
                        <p class="text-[24px] mx-3">
                            {{ Intl.NumberFormat().format(naselenie) }}
                        </p>
                        <p class="text-[16px] text-[#818693]">Человек</p>
                        <p class="mt-6">Трудоспособные</p>
                        <ul class="flex gap-7 text-[16px] justify-center mt-5">
                            <li class="border-t-2 border-[#DF173B] pt-1">
                                {{ NumeralWithDecimal((bezrabot / trudo) * 100) }}%
                            </li>
                            <li class="border-t-2 border-[#3090E8] pt-1">
                                {{ NumeralWithDecimal((trudo / naselenie) * 100) }}%
                            </li>
                            <li class="border-t-2 border-[#0CCF89] pt-1">
                                {{ NumeralWithDecimal((working / naselenie) * 100) }}%
                            </li>
                        </ul>
                    </div>
                </div>

                <div>
                    <ul class="mt-10"   >
                        <li class="flex text-[15px] items-center gap-10 mb-3 text-lg justify-between"
                            v-for="item in list" :key="item.title">
                            <div class="flex gap-2 items-center">
                                <img :src="`/images/icons/${item.icon}.png`" alt="" class="h-4" />
                                <p>{{ item.title }}</p>
                            </div>
                            <div class="flex gap-2 items-center">
                                <p>{{ Numeral(item.value) }}</p>
                                <p class="bg-black p-1 rounded">
                                    {{ NumeralWithDecimal(item.percent) }}%
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
        <div class="map h-[calc(60vh)] relative mt-15">
            <div v-if="!!currentRegion || !!currentRaion"
                class="absolute top-5 z-10 right-5 rounded bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
                @click="() => {
                    if (!!currentRaion) {
                        currentRaion = null;
                        return;
                    }
                    currentRegion = null;
                }">
                <CloseOutlined />
            </div>
            <RegionAccessMap 
                v-if="!currentRegion"
                :current-region="currentRegion ? Number(currentRegion) : undefined" 
                :fill-color="(v) => {
                    const regionColors = getRegionColorByRank();
                    return regionColors[+v] || '#222732';
                }" 
                @click-polygon="clickPolygon" 
                @region-selected="handleRegionSelected"
                v-slot="slotProps">
                <div>
                    <div class="flex items-center gap-2">
                        <p>Регион:</p>
                        <p class="font-bold">{{ slotProps.data.region }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <p>Незанятые:</p>
                        <p class="font-bold">
                            {{
                                NumeralWithDecimal(
                                    getRegionUnemploymentRate(+slotProps.data.id_reg)
                                ) + "%"
                            }}
                        </p>
                    </div>
                </div>
            </RegionAccessMap>
            
            <BaseMapNoMarker
                v-else
                :current-region="currentRegion ? Number(currentRegion) : undefined"
                :current-raion="currentRaion ? Number(currentRaion) : undefined"
                :zoom="getCityZoom(currentRegion)"
                :fill-color="(v) => {
                    if (!groupByRaion()[+v] || groupByRaion()[+v]?.id_reg !== Number(currentRegion)) {
                        return '#222732'; 
                    }
                    
                    const raionColors = getRaionColorByRank(Number(currentRegion));
                    return raionColors[+v] || '#222732';
                }"
                @click-polygon="clickRaion"
                v-slot="slotProps">
                <div>
                    <div class="flex items-center gap-2">
                        <p>Район:</p>
                        <p class="font-bold">{{ slotProps.data.raion }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <p>Незанятые:</p>
                        <p class="font-bold">
                            {{
                                NumeralWithDecimal(getRaionUnemploymentRate(+slotProps.data.id_rai)) + "%"
                            }}  
                        </p>
                    </div>
                </div>
            </BaseMapNoMarker>
        </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF1 } from "../../../../entities/f/api";
import { Numeral, NumeralWithDecimal } from "../../../../shared/helpers/numeral";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";
import RegionAccessMap from "../../../../shared/ui/BaseMap/RegionAccessMap.vue";
import { useAuthStore } from "../../../../stores/auth.store";

const loader = ref(true);
const data = ref<any[]>([]);
const currentRegion = ref<string | null>(null);
const currentRaion = ref<string | null>(null);
const activeTab = ref('program1');
const visible = ref(false);
const authStore = useAuthStore();

async function loadF1() {
    try {
        loader.value = true;
        const allData = await getF1();
        
        data.value = allData.map((item: any) => ({
            ...item,
            cnt: Number(item.cnt || 0),
            nasel: Number(item.nasel || 0),
            trud_vozrast: Number(item.trud_vozrast || 0),
            working: Number(item.working || 0),
            working_naem: Number(item.working_naem || 0),
            working_ip_naem: Number(item.working_ip_naem || 0),
            working_sam: Number(item.working_sam || 0),
            rt_unemployed: Number(item.rt_unemployed || 0),
            nezaniat: Number(item.nezaniat || 0)
        }));
        
        const userRegions = authStore.getAllowedRegions;
        
        if (!userRegions.some(region => region.id_reg === 0)) {
            data.value = data.value.filter(item => 
                userRegions.some(region => region.id_reg === Number(item.id_reg))
            );
            
            if (userRegions.length === 1) {
                currentRegion.value = String(userRegions[0].id_reg);
            }
        }
        
        console.log("Данные загружены успешно:", data.value.length, "записей");
    } catch (error) {
        console.error("Ошибка при загрузке данных F1:", error);
        data.value = [];
    } finally {
        loader.value = false;
    }
}

function clickPolygon(code: string) {
    if (!authStore.hasAccessToRegion(Number(code))) {
        return;
    }
    
    currentRegion.value = code;
    currentRaion.value = null;
}

function handleRegionSelected(regionId: number) {
    currentRegion.value = String(regionId);
    currentRaion.value = null;
}

function clickRaion(code: string) {
    currentRaion.value = code;
}

loadF1();
const getCityZoom = (regionCode: string | null): number => {
  if (regionCode === null) return 7;
  
  const regionCodeNum = Number(regionCode);
  
  if (
    regionCodeNum === 71 || // Астана
    regionCodeNum === 75 || // Алматы
    regionCodeNum === 79    // Шымкент
  ) {
    return 10; 
  }
  
  return 6; 
};

const groupByRegion = () =>
    [...data.value].reduce((acc, curr) => {
        if (!acc[curr.id_reg]) {
            acc[curr.id_reg] = { 
                nezaniat: +curr.nezaniat,
                id_reg: curr.id_reg
            };
            return acc;
        }

        acc[curr.id_reg].nezaniat += +curr.nezaniat;
        return acc;
    }, {} as any);

const groupByRaion = () =>
    [...data.value].reduce((acc, curr) => {
        if (!curr.id_rai) return acc;
        
        if (!acc[curr.id_rai]) {
            acc[curr.id_rai] = { 
                nezaniat: +curr.nezaniat,
                id_reg: curr.id_reg,
                id_rai: curr.id_rai
            };
            return acc;
        }

        acc[curr.id_rai].nezaniat += +curr.nezaniat;
        return acc;
    }, {} as any);

const getRegionUnemploymentRate = (regionCode: number) => {
    const regionData = data.value.filter(item => item.id_reg === regionCode);
    const regionTrudo = regionData.reduce((acc, curr) => acc + +curr.trud_vozrast, 0);
    const regionNezaniat = regionData.reduce((acc, curr) => acc + +curr.nezaniat, 0);
    
    return regionTrudo > 0 ? (regionNezaniat / regionTrudo) * 100 : 0;
};

const getRaionUnemploymentRate = (raionCode: number) => {
    const raionData = data.value.filter(item => item.id_rai === raionCode);
    const raionTrudo = raionData.reduce((acc, curr) => acc + +curr.trud_vozrast, 0);
    const raionNezaniat = raionData.reduce((acc, curr) => acc + +curr.nezaniat, 0);
    
    return raionTrudo > 0 ? (raionNezaniat / raionTrudo) * 100 : 0;
};


const getRegionColorByRank = (): Record<number, string> => {
    
    const regionsWithRates = Object.keys(groupByRegion())
        .map(regionCode => ({
            regionCode: +regionCode,
            rate: getRegionUnemploymentRate(+regionCode)
        }))
        .filter(region => !isNaN(region.regionCode) && region.regionCode > 0);
    
    
    regionsWithRates.sort((a, b) => a.rate - b.rate);
    
    
    const regionColors: Record<number, string> = {};
    
  
   
    
 
    const greenRegions = regionsWithRates.slice(0, 7);
    greenRegions.forEach(region => {
        regionColors[region.regionCode] = '#0CCF89'; 
    });
    
    
    const redRegions = regionsWithRates.slice(-6);
    redRegions.forEach(region => {
        regionColors[region.regionCode] = '#DF173B'; 
    });
    
    
    const orangeRegions = regionsWithRates.slice(7, regionsWithRates.length - 6);
    orangeRegions.forEach(region => {
        regionColors[region.regionCode] = '#F59D0E'; 
    });
    
    
    const greenCount = Object.entries(regionColors).filter(([_, color]) => color === '#0CCF89').length;
    
 
    if (greenCount < 7 && orangeRegions.length > 0) {
        const neededCount = 7 - greenCount;
        
        for (let i = 0; i < Math.min(neededCount, orangeRegions.length); i++) {
            regionColors[orangeRegions[i].regionCode] = '#0CCF89';
        }
    }
    
    return regionColors;
};


const getRaionColorByRank = (currentRegionCode: number): Record<number, string> => {
   
    const raionsWithRates = Object.values(groupByRaion())
        .filter((raion: any) => raion.id_reg === currentRegionCode)
        .map((raion: any) => ({
            raionCode: +raion.id_rai,
            rate: getRaionUnemploymentRate(+raion.id_rai)
        }))
        .filter(raion => !isNaN(raion.raionCode) && raion.raionCode > 0);
    
    
    raionsWithRates.sort((a, b) => a.rate - b.rate);
    
    
    const raionColors: Record<number, string> = {};

   
    if (currentRegionCode === 71 || 
        currentRegionCode === 75 || 
        currentRegionCode === 79 ||
        currentRegionCode === 62 ||
        currentRegionCode === 47) {
        
        const greenCount = Math.min(2, raionsWithRates.length);
        const greenRaions = raionsWithRates.slice(0, greenCount);
        greenRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#0CCF89';
        });
        
        const redCount = Math.min(2, Math.max(0, raionsWithRates.length - greenCount));
        const redRaions = raionsWithRates.slice(-redCount);
        redRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#DF173B';
        });
        
        const orangeRaions = raionsWithRates.slice(greenCount, raionsWithRates.length - redCount);
        orangeRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#F59D0E';
        });
    } 
    else {
        const lowCount = Math.min(7, raionsWithRates.length);
        const greenRaions = raionsWithRates.slice(0, lowCount);
        greenRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#0CCF89';
        });
        
        const highCount = Math.min(6, Math.max(0, raionsWithRates.length - lowCount));
        const redRaions = raionsWithRates.slice(-highCount);
        if (highCount > 0) {
            redRaions.forEach(raion => {
                raionColors[raion.raionCode] = '#DF173B';
            });
        }
        
        const orangeRaions = raionsWithRates.slice(lowCount, raionsWithRates.length - highCount);
        orangeRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#F59D0E';
        });
        
        const greenCount = Object.entries(raionColors).filter(([_, color]) => color === '#0CCF89').length;
        
        if (greenCount < 7 && orangeRaions.length > 0) {
            const neededCount = Math.min(7 - greenCount, orangeRaions.length);
            
            for (let i = 0; i < neededCount; i++) {
                raionColors[orangeRaions[i].raionCode] = '#0CCF89';
            }
        }
    }
    
    return raionColors;
};

const getFilteredData = () => {
  if (currentRaion.value) {
    return data.value.filter(item => item.id_rai === Number(currentRaion.value));
  } 
  else if (currentRegion.value) {
    return data.value.filter(item => item.id_reg === Number(currentRegion.value));
  } 
  else if (!authStore.getAllowedRegions.some(region => region.id_reg === 0)) {
    return data.value.filter(item => 
      authStore.getAllowedRegions.some(region => region.id_reg === Number(item.id_reg))
    );
  } 
  else {
    return data.value;
  }
};

const _filter = computed(() => {
  return getFilteredData();
});

const naselenie = computed(() => {
  try {
    return getFilteredData().reduce((sum, curr) => sum + Number(curr.cnt || 0), 0);
  } catch (error) {
    console.error("Ошибка при вычислении населения:", error);
    return 0;
  }
});

const trudo = computed(() => {
  try {
    return getFilteredData().reduce((sum, curr) => sum + Number(curr.trud_vozrast || 0), 0);
  } catch (error) {
    console.error("Ошибка при вычислении трудоспособного населения:", error);
    return 0;
  }
});

const bezrabot = computed(() => {
  try {
    return getFilteredData().reduce((sum, curr) => sum + Number(curr.rt_unemployed || 0), 0);
  } catch (error) {
    console.error("Ошибка при вычислении безработных:", error);
    return 0;
  }
});

const working = computed(() => {
  try {
    return getFilteredData().reduce((sum, curr) => sum + Number(curr.working || 0), 0);
  } catch (error) {
    console.error("Ошибка при вычислении работающих:", error);
    return 0;
  }
});

const workingNaem = computed(() => {
    try {
        return _filter.value.reduce((acc, curr) => acc + Number(curr.working_naem || 0), 0);
    } catch (error) {
        console.error("Ошибка при вычислении работающих в ЮЛ:", error);
        return 0;
    }
});

const workingIpNaem = computed(() => {
    try {
        return _filter.value.reduce((acc, curr) => acc + Number(curr.working_ip_naem || 0), 0);
    } catch (error) {
        console.error("Ошибка при вычислении работающих в ИП:", error);
        return 0;
    }
});

const workingSam = computed(() => {
    try {
        return _filter.value.reduce((acc, curr) => acc + Number(curr.working_sam || 0), 0);
    } catch (error) {
        console.error("Ошибка при вычислении самозанятых:", error);
        return 0;
    }
});

const nezaniatValue = computed(() => {
    try {
        return _filter.value.reduce((acc, curr) => acc + Number(curr.nezaniat || 0), 0);
    } catch (error) {
        console.error("Ошибка при вычислении незанятых:", error);
        return 0;
    }
});

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
        percent: (workingNaem.value / working.value) * 100,
        icon: "work",
    },
    {
        title: "Наемные в ИП",
        value: workingIpNaem.value,
        percent: (workingIpNaem.value / working.value) * 100,
        icon: "work",
    },
    {
        title: "Самозанятые",
        value: workingSam.value,
        percent: (workingSam.value / working.value) * 100,
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
        value: nezaniatValue.value,
        percent: ((nezaniatValue.value / trudo.value) * 100),
        icon: "work_not",
    },
    {
        title: "Неактивные по причине",
        value: naselenie.value - (trudo.value + nezaniatValue.value + bezrabot.value),
        percent: ((naselenie.value - (trudo.value + nezaniatValue.value + bezrabot.value)) / naselenie.value) * 100,
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
                        y: (working.value / naselenie.value) * 100,
                    },
                ],
            },
        ],
    };
});

watch([currentRegion, currentRaion], () => {
  console.log("Изменился регион/район:", currentRegion.value, currentRaion.value);
  
  console.log("Новые данные:", {
    населениеTotal: naselenie.value,
    трудоспособныеTotal: trudo.value,
    работающиеTotal: working.value,
    безработныеTotal: bezrabot.value,
    регионыДоступа: authStore.getAllowedRegions.map(r => r.id_reg)
  });
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
