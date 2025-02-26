<template>
    <highcharts :options="chartOptions" class="h-full" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';

const aStore = useAStore();
const { a1YearFilter } = storeToRefs(aStore);

const _groupByYear = (data: any) => Object.entries(data.reduce((acc, curr) => {
    !acc[curr.year] ? acc[curr.year] = 1 : acc[curr.year] += 1;

    return acc
}, { 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 0, 2027: 0, 2028: 0, 2029: 0, 2030: 0 })).sort((a, b) => +a[0] - +b[0]);


const statusFinished = computed(() => _groupByYear(a1YearFilter.value.filter(e => e.status === 'Завершенные')))
const statusWorking = computed(() => _groupByYear(a1YearFilter.value.filter(e => e.status === 'Действующие')))
const statusNew = computed(() => _groupByYear(a1YearFilter.value.filter(e => e.status === 'Новые')))
const statusOthod = computed(() => _groupByYear(a1YearFilter.value.filter(e => e.status === 'Отходы')))


const chartOptions = computed(() => ({
    chart: {
        type: "column",
        custom: {},
        backgroundColor: "transparent",
    },
    title: {
        text: "",
    },
    xAxis: {
        categories: statusFinished.value.map(e => e[0]),
        accessibility: { rangeDescription: "" },
        labels: {
            enabled: true,
            style: { color: "#fff" },
        },
        maxPadding: 0,
    },
    yAxis: {
        title: { text: "" },
        stackLabels: {
            enabled: true,
            style: {
                color: "#fff",
            },
        },
        labels: {
            padding: 0,
            style: {
                fontSize: "10px",
                color: "#fff",
            },
        },
    },
    legend: {
        enabled: true,
        itemStyle: { color: "#fff", fontSize: "12px" },
    },
    credits: {
        enabled: false,
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            point: {
                events: {
                    click: function (e) {
                        console.log(e);

                        // if (e.point.color === "#2caffe") {
                        //     useBStore().setActiveStatus('zaver_status')
                        //     useBStore().setActiveStatusYear(e.point.category)
                        // }
                        // if (e.point.color === "#544fc5") {
                        //     useBStore().setActiveStatus('deistv_status')
                        //     useBStore().setActiveStatusYear(e.point.category)
                        // }
                        // if (e.point.color === "#00e272") {
                        //     useBStore().setActiveStatus('novi_status')
                        //     useBStore().setActiveStatusYear(e.point.category)
                        // }
                    }
                }
            }
        }
    },
    series: [
        {
            name: "Завершение",
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/> Годовые:<b> {point.othod} </b>',
            },
            data: statusFinished.value.map((e, idx) => {
                return {
                    y: e[1] - statusOthod.value[idx][1],
                    othod: statusOthod.value[idx][1]
                }
            }),
        },
        {
            name: "Реализация",
            data: statusWorking.value.map(e => e[1]),
        },
        {
            name: "Новые",
            data: statusNew.value.map(e => e[1]),
        },
    ],
}))
</script>
<style scoped lang="scss"></style>