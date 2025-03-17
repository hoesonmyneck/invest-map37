<template>
    <a-modal :footer="null" class="p-0 text-white" width="100%" height="100%" :closable="false" :centered="true"
        :visible="true">
        <BaseCard title="" number="F1" :close="true"
            @close="aStore.setCurrentProject(null), aStore.setProjectModalVisible(false)" :show-close-button="true">
            <div class="grid grid-cols-3 gap-1 w-max m-auto items-end text-white">
                <div class="text-center relative">
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-3xl">
                        {{ Numeral(currentProjectPopup.fact_work / currentProjectPopup.work_places * 100) }}%
                    </p>
                    <highcharts
                        :options="chartOptions('ПЛАНОВЫЕ РАБОЧИЕ МЕСТА', 'Фактический рабочие места', currentProjectPopup.fact_work / currentProjectPopup.work_places * 100, currentProjectPopup.work_places, currentProjectPopup.work_places, currentProjectPopup.fact_work)"
                        class="h-[200px] w-[250px] m-auto mt-5"></highcharts>
                    <div class="-mt-7">
                        <p class="text-gray-400 text-[12px] flex justify-center">
                            <img src="/images/a_block/a1-1.png" alt="" class="w-[14px] h-[14px] mr-1 mb-2">
                            {{ Numeral(currentProjectPopup.work_places) }}
                        </p>
                        <p class="text-[12px]">РАБОЧИЕ МЕСТА</p>
                    </div>
                </div>
                <div class="text-center relative">
                    <highcharts
                        :options="chartOptions('СТОИМОСТЬ ПРОЕКТА', 'СТОИМОСТЬ ПРОЕКТА', 100, 100, currentProjectPopup.project_price, currentProjectPopup.project_price)"
                        class="h-[250px] w-[300px] m-auto mt-5">
                    </highcharts>
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-3xl">{{
                        Numeral(currentProjectPopup.project_price) }}
                        <span class="block text-gray-400">₸</span>
                    </p>
                    <p class="-mt-5">СТОИМОСТЬ ПРОЕКТА</p>
                </div>
                <div class="text-center relative">
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-3xl">{{
                        Numeral(currentProjectPopup.fact_fot / currentProjectPopup.plan_fot * 100) }}%
                    </p>
                    <highcharts
                        :options="chartOptions('ПЛАНОВЫЙ ФОНД ОПЛАТЫ ТРУДА', 'Фактический фонд оплаты труда', currentProjectPopup.fact_fot / currentProjectPopup.plan_fot * 100, currentProjectPopup.plan_fot, currentProjectPopup.plan_fot, currentProjectPopup.fact_fot)"
                        class="h-[200px] w-[250px] m-auto mt-5">
                    </highcharts>
                    <div class="-mt-7">
                        <p class="text-gray-400 text-[12px] flex justify-center mb-2">₸ {{
                            Numeral(currentProjectPopup.plan_fot) }}
                        </p>
                        <p class="text-[12px]">ФОНД ОПЛАТЫ ТРУДА</p>
                    </div>
                </div>
            </div>

            <div class=" mt-10 w-[800px] m-auto text-white">
                <div class="flex gap-1 text-xs p-1 mt-10">
                    <p @click="active = 0" :class="active === 0 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Общее</p>
                    <p @click="active = 4" :class="active === 4 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">График</p>    
                    <p @click="active = 1" :class="active === 1 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Трудовой риск</p>
                    <p @click="active = 2" :class="active === 2 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Финансовый риск</p>
                    <p @click="active = 3" :class="active === 3 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">ТиПО</p>
                </div>
                <div v-if="active === 0" class="mt-5 grid grid-cols-[300px_1fr] gap-3">
                    <div>
                        <img :src="`/img/project/${currentProjectPopup.id}.png`" alt=""
                            class="w-[300px] h-[200px] m-auto object-cover mb-5">
                        <p>{{ currentProjectPopup.comment }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-1 text-sm max-h-[calc(50vh)] overflow-auto mb-10">
                        <p>Наименование проекта:</p>
                        <p>{{ currentProjectPopup.project_name }}</p>
                        <p>Наименование:</p>
                        <p>{{ currentProjectPopup.name }}</p>
                        <p>БИН:</p>
                        <p>{{ `${currentProjectPopup.bin.toString()}` }}</p>
                        <p>Адрес:</p>
                        <p>{{ currentProjectPopup.region }}, {{ currentProjectPopup.raion }}</p>
                        <p>Отрасль: </p>
                        <p>{{ currentProjectPopup.otrasl }}</p>

                        <div class="my-1 border-t border-gray-700 col-span-2"></div>

                        <p>Дата начала и окончания: </p>
                        <p>{{ new Date(currentProjectPopup.project_start_date).toLocaleDateString() }} - {{ new
                            Date(currentProjectPopup.project_exploitation_date).toLocaleDateString() }}</p>
                        <!-- <p>Местные средства: </p>
                        <p>{{ Numeral(currentProjectPopup.local_funds_updated) }}</p> -->
                        <!-- <p>Тип проекта: </p>
                        <p>{{ currentProjectPopup.project_type === 'GREENFIELD' ? 'С нуля' : 'Модернизация' }}</p>
                        <p>Наличие бизнес плана: </p>
                        <p>{{ currentProjectPopup.has_business_plan ? 'Да' : 'Нет' }}</p>
                        <p>Наличие земельного участка: </p>
                        <p>{{ currentProjectPopup.has_land_plot ? 'Да' : 'Нет' }}</p> -->

                        <div class="my-1 border-t border-gray-700 col-span-2"></div>

                        <p>СМЗ: </p>
                        <p>{{ Numeral(currentProjectPopup.smz_12mes) }}</p>
                        <p>кол-во сотрудников: </p>
                        <p>{{ Numeral(currentProjectPopup['12mes_kol']) }}</p>
                        <p>Кол активных договоров: </p>
                        <p>{{ Numeral(currentProjectPopup.esutd_akt_td) }}</p>

                        <div class="my-1 border-t border-gray-700 col-span-2"></div>
                        <p>Трудовой риск: </p>
                        <p>{{ risk_key[`k_${currentProjectPopup.ball_trud_tip}`] }}</p>
                        <p>Финансовый риск: </p>
                        <p>{{ risk_key[`k_${currentProjectPopup.ball_finance_tip}`] }}</p>
                        <p>Финальный риск: </p>
                        <p>{{ risk_key[`k_${currentProjectPopup.ball_tip}`] }}</p>
                    </div>
                </div>
                <div v-if="active === 1"
                    class="grid grid-cols-2 gap-1 mt-5 text-sm max-h-[calc(50vh)] overflow-auto mb-10">
                    <template v-for="r in tab1_risk" :key="r[0]">
                        <p>{{ r[0] }}: </p>
                        <p>
                            <span :style="`color: ${getColorRisk(`k_${r[2]}`)}`">{{
                                risk_key[`k_${r[2] ?? ''}`] }}</span>
                        </p>
                    </template>
                </div>
                <div v-if="active === 2"
                    class="grid grid-cols-2 gap-1 mt-5 text-sm max-h-[calc(50vh)] overflow-auto mb-10">
                    <template v-for="r in tab2_risk" :key="r[0]">
                        <p>{{ r[0] }}: </p>
                        <p>
                            <span :style="`color: ${getColorRisk(`k_${r[2]}`)}`">{{
                                risk_key[`k_${r[2] ?? ''}`] }}</span>
                        </p>
                    </template>
                </div>

                <div v-if="active === 3">
                    <div class="grid grid-cols-1 gap-2 text-xs my-5">
                        
                        <p class="mt-5 text-lg">Потребность</p>
                        <div class="border border-gray-700 rounded w-[110%]">
                            <div class="head grid grid-cols-5 gap-2 p-2 text-gray-400 text-[14px]">
                                <p class="border-r border-gray-700 mr-2 pr-2">Профессия</p>
                                <!-- <p class="border-r border-gray-700 mr-2 pr-2">Кол-во</p> -->
                                <p class="border-r border-gray-700 mr-2 pr-2">ТиПО</p>
                                <!-- <p class="border-r border-gray-700 mr-2 pr-2">Адрес</p> -->
                                <p class="border-r border-gray-700 mr-2 pr-2">Квалификация</p>
                                <p class="border-r border-gray-700 mr-2 pr-2">Специальность</p>
                                <p>Кол-во выпускников в этом году</p>
                            </div>
                            <div class="overflow-scroll h-[calc(39vh)]">
                                <template v-for="(r, idx) in currentProjectPopup.list_of_tipo" :key="r[0]">
                                    <template v-for="(a, index) in r" :key="a[0]">
                                        <div v-if="!currentProfession ? true : currentProfession === currentProjectPopup.nkz_code_2_name[idx]"
                                            class="item border-t border-gray-700 grid grid-cols-5 gap-2 p-2">
                                            <p class="border-r border-gray-700 mr-2 pr-2">
                                                {{ currentProjectPopup.nkz_code_2_name[idx] }}
                                            </p>
                                            <!-- <p class="border-r border-gray-700 mr-2 pr-2">
                
                                            </p> -->
                                            <p class="border-r border-gray-700 mr-2 pr-2">
                                                {{ a }}
                                            </p>
                                            <!-- <p class="border-r border-gray-700 mr-2 pr-2">
                                                {{ currentProjectPopup.list_of_address[idx][index] }}
                                            </p> -->
                                            <p class="border-r border-gray-700 mr-2 pr-2">
                                                {{ currentProjectPopup.list_of_qualifications[idx][index] }}
                                            </p>
                                            <p class="border-r border-gray-700 mr-2 pr-2">
                                                {{ currentProjectPopup.list_of_specializations[idx][index] }}
                                            </p>
                                            <p>
                                                {{ currentProjectPopup.list_of_stu[idx][index] }}
                                            </p>
                                        </div>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="active === 4">
                    <div class="mt-5 flex flex-col justify-center items-center  ">
                        <p class="text-lg mb-4">Динамика рабочих мест</p>
                        <highcharts :options="areaChartOptions" class="h-[300px] w-full"></highcharts>
                    </div>
                </div>
            </div>
        </BaseCard>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAStore } from '../store';
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { Numeral } from '../../../shared/helpers/numeral';

defineEmits(['clear']);

const aStore = useAStore();
const { currentProjectPopup } = storeToRefs(aStore);
const active = ref(0)

const currentProfession = ref()

const risk_key: { [key: string]: string } = {
    'k_': "Не определено",
    'k_0': "Отсутствует",
    'k_3': "Средний",
    'k_5': "Высокий"
}

const tab1_risk = [
    ['Проверки ЕРСОП', currentProjectPopup.value.koef_ersop, currentProjectPopup.value.risk_ersop],
    ['Прирост/сокращение штата', currentProjectPopup.value.koef_stat, currentProjectPopup.value.risk_stat],
    ['Наличие среднего и тяжелого травматизма', currentProjectPopup.value.koef_travma, currentProjectPopup.value.risk_travma],
    ['Текучесть кадров', currentProjectPopup.value.koef_tek_kadrov, currentProjectPopup.value.risk_tek_kadrov],
    ['Доля ИРС', currentProjectPopup.value.koef_irs, currentProjectPopup.value.risk_irs],
    ['ОСМС', currentProjectPopup.value.koef_insurance, currentProjectPopup.value.risk_insurance],
    ['Сведения спецорганов', currentProjectPopup.value.koef_list1, currentProjectPopup.value.risk_list1],
    ['Разница по ТД и ОПВ', currentProjectPopup.value.koef_esutd_opv, currentProjectPopup.value.risk_esutd_opv],
    ['Коллективный договор', currentProjectPopup.value.koef_kol_dogovor, currentProjectPopup.value.risk_kol_dogovor],
]

const tab2_risk = [
    ['Диспропорция между макс и мин зарплатой', currentProjectPopup.value.koef_dispr, currentProjectPopup.value.risk_dispr],
    ['Разница в оплате труда руководителей нерезидентов и граждан РК', currentProjectPopup.value.koef_zp_ruk, currentProjectPopup.value.risk_zp_ruk],
    ['Темп роста ЗП', currentProjectPopup.value.koef_temp_rosta_zp, currentProjectPopup.value.risk_temp_rosta_zp],
    ['СМЗ меньше чем в регионе и отрасли', currentProjectPopup.value.koef_region_oked_smz, currentProjectPopup.value.risk_region_oked_smz],
    ['Несвоевременное перечисление ОПВ', currentProjectPopup.value.koef_zaderjka_opv, currentProjectPopup.value.risk_zaderjka_opv],
    ['Уменьшение количества сотрудников по ОПВ', currentProjectPopup.value.koef_minus_zaderjka_opv, currentProjectPopup.value.risk_minus_zaderjka_opv],
    ['Задержка ОПВ за 6 мес', currentProjectPopup.value.koef_dinamica_zaderjka_opv, currentProjectPopup.value.risk_dinamica_zaderjka_opv],
    ['Несвоевременное перечисление СО', currentProjectPopup.value.koef_zaderjka_so, currentProjectPopup.value.risk_zaderjka_so],
    ['Уменьшение количества сотрудников по СО', currentProjectPopup.value.koef_minus_zaderjka_so, currentProjectPopup.value.risk_minus_zaderjka_so],
    ['Задержка СО', currentProjectPopup.value.koef_dinamica_zaderjka_so, currentProjectPopup.value.risk_dinamica_zaderjka_so],
    ['Несвоевременное перечисление ОСМС', currentProjectPopup.value.koef_zaderjka_osms, currentProjectPopup.value.risk_zaderjka_osms],
    ['Уменьшение количества сотрудников по ОСМС', currentProjectPopup.value.koef_minus_zaderjka_osms, currentProjectPopup.value.risk_minus_zaderjka_osms],
    ['Задержка ОСМС', currentProjectPopup.value.koef_dinamica_zaderjka_osms, currentProjectPopup.value.risk_dinamica_zaderjka_osms],
]

const getColorRisk = (risk: string) => {
    if (risk === 'k_5') return 'red'
    if (risk === 'k_0') return 'green'
    if (risk === 'k_3') return 'yellow'
    return 'white'
}

const chartOptions = (name: string, name2: string, percent: number, all: number, value: number, value2: number) => {
    return {
        chart: { type: "solidgauge", backgroundColor: "transparent", height: "100%" },
        title: { text: "" },
        pane: {
            startAngle: -125,
            endAngle: 125,
            background: [{ outerRadius: 0, innerRadius: 0, borderWidth: 0 }],
        },
        tooltip: {
            format: '{point.name}: {point.value}',
        },
        yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
        plotOptions: { solidgauge: { dataLabels: { enabled: false, showInLegend: false } } },
        series: [
            { name: "", data: [{ name, radius: "80%", innerRadius: "100%", color: "rgba(48,144,232,0.2)", y: 100, value: Numeral(value) }] },
            { name: name ?? '', data: [{ name: name2, radius: "80%", innerRadius: "100%", color: "#3090E8", y: +percent.toFixed(0), value: Numeral(value2) }] },
        ],
    }
}

const areaChartOptions = {
    chart: {
        type: 'area',
        backgroundColor: 'transparent',
    },
    title: {
        text: '',
    },
    xAxis: {
        categories: currentProjectPopup.value.fact_year_value,
        labels: {
            style: {
                color: '#fff'
            }
        },
        lineColor: '#555',
    },
    yAxis: {
        title: {
            text: 'Количество рабочих мест',
            style: {
                color: '#fff'
            }
        },
        labels: {
            style: {
                color: '#fff'
            }
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
    },
    tooltip: {
        shared: true,
        valueSuffix: ' мест',
        formatter: function(this: any): string {
            const points = this.points || [];
            let tooltipText = '<span style="font-size: 10px">' + this.x + '</span><br/>';
            
            points.forEach(function(point: any) {
                if (point.series.name === 'Фактические рабочие места') {
                    const firstYearValue = currentProjectPopup.value.fact_count_value[0] || 0;
                    const currentValue = point.y;
                    const difference = currentValue - firstYearValue;
                    
                    let differenceText = '';
                    if (difference !== 0) {
                        differenceText = difference < 0 ? difference.toString() : '' + difference;
                    }
                    
                    tooltipText += '<span style="color:' + point.color + '">●</span> ' + 
                        point.series.name + ': <b>' + 
                        (differenceText ? differenceText + ' (' + currentValue + ' мест)' : currentValue + ' мест') + 
                        '</b><br/>';
                } else {
                    tooltipText += '<span style="color:' + point.color + '">●</span> ' + 
                        point.series.name + ': <b>' + point.y + ' мест</b><br/>';
                }
            });
            
            return tooltipText;
        }
    },
    credits: {
        enabled: false
    },
    legend: {
        itemStyle: {
            color: '#fff'
        },
        itemHoverStyle: {
            color: '#ccc'
        }
    },
    plotOptions: {
        area: {
            fillOpacity: 0.5,
            marker: {
                radius: 4,
                lineWidth: 1
            }
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        name: 'Фактические рабочие места',
        type: 'area',
        data: currentProjectPopup.value.fact_count_value,
        color: '#3090E8',
    }, {
        name: 'Плановые рабочие места',
        type: 'line',
        data: Array(currentProjectPopup.value.fact_year_value.length).fill(
            currentProjectPopup.value.work_places + 
            (currentProjectPopup.value.fact_count_value[0] || 0)
        ),
        color: '#B85DDA',
        dashStyle: 'solid',
        lineWidth: 2
    }, {
        name: 'Начальное значение (2021)',
        type: 'line',
        data: Array(currentProjectPopup.value.fact_year_value.length).fill(
            currentProjectPopup.value.fact_count_value[0] || 0
        ),
        color: 'rgba(150, 150, 150, 0.7)',
        dashStyle: 'solid',
        lineWidth: 2,
        marker: {
            enabled: false
        }
    }]
}
</script>