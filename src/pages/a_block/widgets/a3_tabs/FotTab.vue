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
    console.log(curr.plan_fot);

    if (!acc[curr.region]) {
        acc[curr.region] = { plan_fot: curr.plan_fot, fact_fot: curr.fact_fot }
    } else {
        acc[curr.region].plan_fot += curr.plan_fot
        acc[curr.region].fact_fot += curr.fact_fot
    }

    return acc
}, {})).sort((a, b) => b[1].fact_fot - a[1].fact_fot))

const groupByYear = computed(() => Object.entries(a1YearFilter.value.filter((item) => item.year < 2026).reduce((acc, curr) => {
    console.log(curr.fact_fot);

    if (!acc[curr.year]) {
        acc[curr.year] = { plan_fot_by_year: curr.plan_fot_by_year, fact_fot: curr.fact_fot }
    } else {
        acc[curr.year].plan_fot_by_year += curr.plan_fot_by_year
        acc[curr.year].fact_fot += curr.fact_fot
    }

    return acc
}, {})).sort((a, b) => b[0] - a[0]))

const options = (categories: string[], data: any[], data2: any[], first = true) => {
    return {
        chart: {
            type: "bar",
            backgroundColor: "transparent",
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
                grouping: true,
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

        tooltip: {
            shared: true,
            pointFormat:
                '<span style="color:{series.color}"><b>{point.fot}</b><br/>',
        },
        xAxis: {
            categories,
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
        y: el[1].plan_fot,
        fot: Numeral(el[1].plan_fot),
        percent: Numeral((el[1].fact_fot / el[1].plan_fot) * 100)
    })),
    groupByRegion.value.map(el => ({
        y: el[1].fact_fot,
        fot: Numeral(el[1].fact_fot),
    })),
))

const chartByYear = computed(() => options(
    groupByYear.value.map(el => el[0]),
    groupByYear.value.map(el => ({
        y: el[1].plan_fot_by_year,
        fot: Numeral(el[1].plan_fot_by_year),
        percent: Numeral((el[1].fact_fot / el[1].plan_fot_by_year) * 100)
    })),
    groupByYear.value.map(el => ({
        y: el[1].fact_fot,
        fot: Numeral(el[1].fact_fot),
    })),
    false
))
</script>
<style scoped lang="scss"></style>