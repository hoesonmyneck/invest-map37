<template>
    <div>
        <div class="flex gap-1">
            <p @click="tab = 0" :class="{ active: tab === 0 }" class="btn mini">По регионам</p>
            <p @click="tab = 1" :class="{ active: tab === 1 }" class="btn mini">По годам</p>
        </div>
        <highcharts v-if="tab === 0" class="h-[400px]" :options="chartByRegion" />
        <highcharts v-if="tab === 1" class="h-[200px]" :options="chartByYear" />
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAStore } from '../../store';
import { computed, ref } from 'vue';
import { Numeral } from '../../../../shared/helpers/numeral';

const aStore = useAStore();
const { a1YearFilter, a1FilterByOtrasl } = storeToRefs(aStore);

const tab = ref(0);

const groupByRegion = computed(() => Object.entries(a1FilterByOtrasl.value.reduce((acc, curr) => {
    if (!acc[curr.region]) {
        acc[curr.region] = { work_places: curr.work_places, fact_work: curr.fact_work }
    } else {
        acc[curr.region].work_places += curr.work_places
        acc[curr.region].fact_work += curr.fact_work
    }

    return acc
}, {})).sort((a, b) => b[1].fact_work - a[1].fact_work))

const groupByYear = computed(() => Object.entries(a1YearFilter.value.filter((item) => item.year < 2026).reduce((acc, curr) => {
    if (!acc[curr.year]) {
        acc[curr.year] = { plan_work_by_year: curr.plan_work_by_year, fact_work: curr.fact_work }
    } else {
        acc[curr.year].plan_work_by_year += curr.plan_work_by_year
        acc[curr.year].fact_work += curr.fact_work
    }

    return acc
}, {})).sort((a, b) => b[0] - a[0]))

const options = (categories: string[], data: any[], data2: any[], first = true) => {
    return {
        chart: {
            type: "bar",
            backgroundColor: "transparent",
            height: first ? "120%" : "",
        },
        title: {
            text: "",
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: '#fff'
            }
        },
        plotOptions: {
            column: {
                grouping: false,
                borderWidth: 0,
            },
            series: {
                borderRadius: 0,
                dataLabels: [
                    {
                        enabled: false,
                    },
                ],
            },
        },
        xAxis: {
            categories,
            tickmarkPlacement: "on",
            labels: {
                enabled: true,
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
                name: "План",
                data,
                dataLabels: [
                    {
                        format: '{point.percent}%',
                        enabled: true,
                        style: {
                            color: '#fff'
                        }
                    },
                ],
                pointPadding: 0.3,
                pointPlacement: -0.2,
                pointWidth: 12
            },
            {
                name: "Факт",
                pointWidth: 10,
                color: '#DC3140',
                data: data2,
                pointPlacement: 0.1
            },
        ],
    }
}

const chartByRegion = computed(() => options(
    groupByRegion.value.map(el => el[0]),
    groupByRegion.value.map(el => ({
        y: el[1].work_places,
        percent: Numeral((el[1].fact_work / el[1].work_places) * 100)
    })),
    groupByRegion.value.map(el => el[1].fact_work),
))

const chartByYear = computed(() => options(
    groupByYear.value.map(el => el[0]),
    groupByYear.value.map(el => ({
        y: el[1].plan_work_by_year,
        percent: Numeral((el[1].fact_work / el[1].plan_work_by_year) * 100)
    })),
    groupByYear.value.map(el => el[1].fact_work),
    false
))
</script>
<style scoped lang="scss"></style>