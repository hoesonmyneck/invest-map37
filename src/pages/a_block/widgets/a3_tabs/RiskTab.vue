<template>
    <div>
        <highcharts :options="chartOptions" class="h-[200px]" />
        <div class="grid grid-cols-3 gap-3 text-xs text-center">
            <template v-for="(value, key) in _groupByYear" :key="key">
                <div>
                    <div class="flex justify-between items-center">
                        <p>{{ key }}</p>
                        <p class="text-[10px] h-4 flex items-center justify-center px-1 rounded bg-opacity-10 bg-gray-600"
                            :style="{ backgroundColor: key === 'Высокий' ? '#dc2626' : (key === 'Средний' ? '#d97706' : '#059669') }">
                            {{ Numeral(+value /
                                _filterNotDefined.length *
                                100) }}%</p>
                    </div>
                    <div class="w-full mt-1 relative bg-opacity-10 rounded flex justify-center items-center h-6"
                        :style="{ backgroundColor: key === 'Высокий' ? '#dc262650' : (key === 'Средний' ? '#d9770650' : '#05966950') }">
                        <p class="relative z-10">{{ +value }}</p>
                        <div class="w-[50%] h-full absolute top-0 left-0 rounded"
                            :style="{ minWidth: '10px', width: `${+value / _filterNotDefined.length * 100}%`, backgroundColor: key === 'Высокий' ? '#dc2626' : (key === 'Средний' ? '#d97706' : '#059669') }">
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';
import { Numeral } from '../../../../shared/helpers/numeral';

const aStore = useAStore();
const { a1FilterByProject } = storeToRefs(aStore);

const _filterNotDefined = computed(() => a1FilterByProject.value.filter((item) => item.ball_tip_name !== 'Не определено'))
const _groupByYear = computed(() => _filterNotDefined.value.reduce((acc, curr) => {
    if (curr.ball_tip_name === 'Не определено') return acc;
    !acc[curr.ball_tip_name] ? acc[curr.ball_tip_name] = 1 : acc[curr.ball_tip_name] += 1;

    return acc
}, {}))

const chartOptions = computed(() => ({
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        backgroundColor: 'transparent',
    },
    title: {
        text: '',
    },
    tooltip: {
        outside: true
    },
    legend: {
        enabled: false
    },
    pane: {
        innerSize: '50%',
    },
    xAxis: {
        labels: {
            enabled: false
        },
        lineWidth: 0,
        gridLineWidth: 0,
    },
    yAxis: {
        labels: {
            enabled: false,
        },
        lineWidth: 0,
        tickInterval: 25,
        reversedStacks: false,
        endOnTick: true,
        showLastLabel: true,
        gridLineWidth: 0
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15,
            borderRadius: '50%'
        }
    },
    series: [{
        name: '',
        colorByPoint: true,
        data: Object.entries(_groupByYear.value).map(([key, value]) => {
            return {
                name: key,
                color: key === 'Высокий' ? '#dc2626' : (key === 'Средний' ? '#d97706' : '#059669'),
                y: value
            }
        })
    }]
}))
</script>
<style scoped lang="scss"></style>