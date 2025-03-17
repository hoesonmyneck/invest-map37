<template>
    <div>
        <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
            <a-spin />
        </div>
        <div class="grid grid-cols-2 h-[25vh]">
            <div class="text-white grid grid-cols-2 gap-2">
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
                        <li class="flex text-[10px] items-center gap-2 mb-3 text-lg justify-between"
                            v-for="item in list" :key="item.title">
                            <div class="flex gap-2 items-center">
                                <img :src="`/images/icons/${item.icon}.png`" alt="" class="h-4" />
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
            <BaseMap 
                v-if="!currentRegion"
                :current-region="currentRegion ? Number(currentRegion) : undefined" 
                :fill-color="(v) => {
                    const regionColors = getRegionColorByRank();
                    return regionColors[+v] || '#222732';
                }" 
                @click-polygon="clickPolygon" 
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
                                Numeral(
                                    getRegionUnemploymentRate(+slotProps.data.parent1_code)
                                ) + "%"
                            }}
                        </p>
                    </div>
                </div>
            </BaseMap>
            
            <BaseMapNoMarker
                v-else
                :current-region="currentRegion ? Number(currentRegion) : undefined"
                :current-raion="currentRaion ? Number(currentRaion) : undefined"
                :fill-color="(v) => {
                    if (!groupByRaion()[+v] || groupByRaion()[+v]?.parent1_code !== Number(currentRegion)) {
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
                                Numeral(getRaionUnemploymentRate(+slotProps.data.parent2_code)) + "%"
                            }}
                        </p>
                    </div>
                </div>
            </BaseMapNoMarker>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { getF1 } from "../../../../entities/f/api";
import { Numeral } from "../../../../shared/helpers/numeral";
import { getColorFromGradient } from "../../../../shared/helpers/gradientColors";
import { CloseOutlined } from "@ant-design/icons-vue";
import BaseMap from "../../../../shared/ui/BaseMap/BaseMap.vue";
import BaseMapNoMarker from "../../../../shared/ui/BaseMap/BaseMapNoMarker.vue";

const loader = ref(true);
const data = ref<any[]>([]);
const currentRegion = ref<string | null>(null);
const currentRaion = ref<string | null>(null);
const activeTab = ref('program1');
const visible = ref(false);

async function loadF1() {
    data.value = await getF1().finally(() => {
        loader.value = false;
    });
}

function clickPolygon(code: string) {
    currentRegion.value = code;
    currentRaion.value = null;
}

function clickRaion(code: string) {
    currentRaion.value = code;
}

loadF1();

const groupByRegion = () =>
    [...data.value].reduce((acc, curr) => {
        if (!acc[curr.parent1_code]) {
            acc[curr.parent1_code] = { 
                nezaniat: +curr.nezaniat,
                parent1_code: curr.parent1_code
            };
            return acc;
        }

        acc[curr.parent1_code].nezaniat += +curr.nezaniat;
        return acc;
    }, {} as any);

const groupByRaion = () =>
    [...data.value].reduce((acc, curr) => {
        if (!curr.parent2_code) return acc;
        
        if (!acc[curr.parent2_code]) {
            acc[curr.parent2_code] = { 
                nezaniat: +curr.nezaniat,
                parent1_code: curr.parent1_code,
                parent2_code: curr.parent2_code
            };
            return acc;
        }

        acc[curr.parent2_code].nezaniat += +curr.nezaniat;
        return acc;
    }, {} as any);

const getRegionUnemploymentRate = (regionCode: number) => {
    const regionData = data.value.filter(item => item.parent1_code === regionCode);
    const regionTrudo = regionData.reduce((acc, curr) => acc + +curr.trud_vozrast, 0);
    const regionNezaniat = regionData.reduce((acc, curr) => acc + +curr.nezaniat, 0);
    
    return regionTrudo > 0 ? (regionNezaniat / regionTrudo) * 100 : 0;
};

const getRaionUnemploymentRate = (raionCode: number) => {
    const raionData = data.value.filter(item => item.parent2_code === raionCode);
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
    console.log('Зеленые регионы (должно быть 7):', greenRegions);
    greenRegions.forEach(region => {
        regionColors[region.regionCode] = '#0CCF89'; 
    });
    
    
    const redRegions = regionsWithRates.slice(-6);
    console.log('Красные регионы (должно быть 6):', redRegions);
    redRegions.forEach(region => {
        regionColors[region.regionCode] = '#DF173B'; 
    });
    
    
    const orangeRegions = regionsWithRates.slice(7, regionsWithRates.length - 6);
    console.log('Оранжевые регионы:', orangeRegions);
    orangeRegions.forEach(region => {
        regionColors[region.regionCode] = '#F59D0E'; 
    });
    
    
    const greenCount = Object.entries(regionColors).filter(([_, color]) => color === '#0CCF89').length;
    console.log('Итоговое количество зеленых регионов:', greenCount);
    
 
    if (greenCount < 7 && orangeRegions.length > 0) {
        const neededCount = 7 - greenCount;
        console.log(`Не хватает ${neededCount} зеленых регионов, добавляем из оранжевых`);
        
        for (let i = 0; i < Math.min(neededCount, orangeRegions.length); i++) {
            regionColors[orangeRegions[i].regionCode] = '#0CCF89';
        }
    }
    
    return regionColors;
};


const getRaionColorByRank = (currentRegionCode: number): Record<number, string> => {
   
    const raionsWithRates = Object.values(groupByRaion())
        .filter((raion: any) => raion.parent1_code === currentRegionCode)
        .map((raion: any) => ({
            raionCode: +raion.parent2_code,
            rate: getRaionUnemploymentRate(+raion.parent2_code)
        }))
        .filter(raion => !isNaN(raion.raionCode) && raion.raionCode > 0);
    
    
    raionsWithRates.sort((a, b) => a.rate - b.rate);
    
    
    console.log('Все районы с процентами незанятых (после фильтрации):', raionsWithRates);
    
    
    const raionColors: Record<number, string> = {};
    
   
    const lowCount = Math.min(7, raionsWithRates.length);
    const greenRaions = raionsWithRates.slice(0, lowCount);
    console.log('Зеленые районы (должно быть до 7):', greenRaions);
    greenRaions.forEach(raion => {
        raionColors[raion.raionCode] = '#0CCF89'; // Зеленый
    });
    
    
    const highCount = Math.min(6, Math.max(0, raionsWithRates.length - lowCount));
    const redRaions = raionsWithRates.slice(-highCount);
    console.log('Красные районы (должно быть до 6):', redRaions);
    if (highCount > 0) {
        redRaions.forEach(raion => {
            raionColors[raion.raionCode] = '#DF173B';
        });
    }
    
    
    const orangeRaions = raionsWithRates.slice(lowCount, raionsWithRates.length - highCount);
    console.log('Оранжевые районы:', orangeRaions);
    orangeRaions.forEach(raion => {
        raionColors[raion.raionCode] = '#F59D0E'; 
    });
    
   
    const greenCount = Object.entries(raionColors).filter(([_, color]) => color === '#0CCF89').length;
    console.log('Итоговое количество зеленых районов:', greenCount);
    
    if (greenCount < 7 && orangeRaions.length > 0) {
        const neededCount = Math.min(7 - greenCount, orangeRaions.length);
        console.log(`Не хватает ${neededCount} зеленых районов, добавляем из оранжевых`);
        
        for (let i = 0; i < neededCount; i++) {
            raionColors[orangeRaions[i].raionCode] = '#0CCF89';
        }
    }
    
    return raionColors;
};

const regionBezrabot = computed(() => {
    if (!currentRegion.value) return 0;
    return data.value
        .filter(item => item.parent1_code === Number(currentRegion.value))
        .reduce((acc, curr) => acc + +curr.nezaniat, 0);
});

const _filter = computed(() => {
    if (currentRaion.value) {
        return [...data.value].filter(e => e.parent2_code === Number(currentRaion.value));
    }
    return [...data.value].filter(e => 
        !currentRegion.value ? true : e.parent1_code === Number(currentRegion.value)
    );
});

const allBezrabot = computed(() =>
    data.value.reduce((acc, curr) => acc + +curr.rt_unemployed, 0)
);
const naselenie = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.cnt, 0)
);
const bezrabot = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.rt_unemployed, 0)
);
const trudo = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.trud_vozrast, 0)
);
const working = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.working, 0)
);
const allNezaniat = computed(() =>
    data.value.reduce((acc, curr) => acc + +curr.nezaniat, 0)
);
const nezaniat = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.nezaniat, 0)
);
const workingNaem = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.working_naem, 0)
);
const workingIpNaem = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.working_ip_naem, 0)
);
const workingSam = computed(() =>
    _filter.value.reduce((acc, curr) => acc + +curr.working_sam, 0)
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
        value: nezaniat.value,
        percent: (nezaniat.value / trudo.value) * 100,
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
                        y: (working.value / trudo.value) * 100,
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
