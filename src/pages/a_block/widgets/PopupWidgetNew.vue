<template>
    <a-modal :footer="null" class="p-0 text-white" width="100%" height="100%" :closable="false" :centered="true"
        :visible="true">
        <BaseCard title="" number="F1" :close="true"
            @close="aStore.setCurrentProject(null), aStore.setProjectModalVisible(false)" :show-close-button="true">
           
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

const risk_key = {
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
</script>