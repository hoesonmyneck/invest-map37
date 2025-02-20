<template>
    <BaseCard title="Инвестиционные проекты" number="F4" @open="openLink" :show-open-button="true">
        <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
            <a-spin />
        </div>
        <div v-else class="text-white grid grid-cols-[200px_1fr] gap-2">
            <div class="relative h-max">
                <highcharts class="hc map w-full" :options="chartOptions" />
                <div class="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <p class="text-2xl">{{ data.length }}</p>
                    <p class="text-gray-500 text-xs">Инвестпроекты</p>
                </div>
            </div>
            <div class="overflow-y-scroll h-[calc(50vh-65px)]">
                <ul>
                    <li class="flex text-[10px] items-center gap-2 mb-1 text-xs justify-between min-w-[200px]"
                        v-for="item in Object.values(list).sort((a, b) => b.count - a.count)"
                        :key="item.otrasl">
                        <div class="flex gap-2 items-center">
                            <p class="min-w-4 w-4 h-4 rounded-full" :style="{ backgroundColor: item.color }"></p>
                            <p>{{ item.otrasl }}</p>
                        </div>
                        <div class="flex gap-2 items-center">
                            <p>{{ item.count }}</p>
                            <p class="bg-black p-1 rounded px-2 w-[40px] text-center">{{ Numeral(item.count
                                / data.length * 100) }}%</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </BaseCard>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { getF4 } from '../../../entities/f/api';
import { randomColorGenerate } from '../../../shared/helpers/randomColorGenerate';
import { Numeral } from '../../../shared/helpers/numeral';

const loader = ref(true);
const data = ref([]);

async function loadF4() {
    data.value = await getF4().finally(() => {
        loader.value = false;
    })
}

loadF4()

function openLink() {
    window.open('https://map-invest-new.netlify.app/b', '_blank');
}

const list = computed(() => data.value.reduce((acc, curr) => {
    if (!acc[curr.otrasl]) {
        acc[curr.otrasl] = { ...curr, count: 1, color: randomColorGenerate() }
        return acc
    }

    acc[curr.otrasl].count += 1
    acc[curr.otrasl].count_inv_project += curr.count_inv_project
    return acc
}, {}))


const chartOptions = computed(() => ({
    chart: {
        type: "pie",
        custom: {},
        backgroundColor: "transparent",
        height: "100%",
    },
    title: {
        text: "",
    },
    tooltip: {
        pointFormat: "<b>{point.y:.0f}</b>",
    },
    legend: {
        enabled: false,
    },
    plotOptions: {
        series: {
            allowPointSelect: true,
            cursor: "pointer",
            borderRadius: 0,
            dataLabels: [
                {
                    enabled: false,
                },
            ],
            showInLegend: true,
        },
    },
    series: [
        {
            name: "Проекты",
            colorByPoint: true,
            innerSize: "85%",
            data: Object.values(list.value).map((e) => ({
                name: e.otrasl,
                y: e.count,
                color: e.color,
            })),
        },
    ],
}));
</script>