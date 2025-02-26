<template>
    <highcharts :options="chartOptions" class="h-full" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';
import { Numeral } from '../../../../shared/helpers/numeral';

const aStore = useAStore();
const { a1FilterByOtrasl } = storeToRefs(aStore);

const groupByRegion = computed(() => Object.entries(a1FilterByOtrasl.value.reduce((acc, curr) => {
    if (!acc[curr.region]) {
        acc[curr.region] = curr.project_price;
    } else {
        acc[curr.region] += curr.project_price;
    }

    return acc
}, {})).sort((a, b) => b[1] - a[1]))

const chartOptions = computed(() => ({
    chart: {
        type: "bar",
        backgroundColor: "transparent",
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
                format: '{point.price}',
                enabled: true,
                style: {
                    color: '#fff'
                }
            },
            showInLegend: true,
        },
    },
    xAxis: {
        categories: groupByRegion.value.map(item => item[0]),
        tickmarkPlacement: "on",
        labels: {
            style: {
                color: "#fff"
            }
        }
    },
    yAxis: {
        title: {
            text: null,
        },
        labels: {
            enabled: false,
            style: {
                color: '#fff'
            }
        }
    },
    series: [
        {
            name: "",
            colorByPoint: true,
            pointWidth: 12,
            data: groupByRegion.value.map(item => ({
                y: item[1],
                color: '#3090E8',
                price: Numeral(+item[1])
            })),
        },
    ],
}))
</script>
<style scoped lang="scss"></style>