<template>
    <div :class="[isModal ? 'h-full' : 'h-[27vh]', 'overflow-x-hidden overflow-y-scroll text-white text-[12px]']">
        <ul class="head text-white pb-1 mb-1 border-b border-gray-700 items-start w-[100%] sticky top-0 z-[20] bg-[#1E2028]">
            <li class="w-[100%]">Отрасль</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('count')">
                К-во проектов
                <SortAscendingOutlined v-if="sortField === 'count' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'count' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalProjectsCount) }}
            </li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('project_price')">
                Стоимость проекта
                <SortAscendingOutlined v-if="sortField === 'project_price' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'project_price' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalProjectPrice) }}
            </li>
            <li class="w-[100%]">% завершенных по сроку</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('work_places')">
                План раб.мест
                <SortAscendingOutlined v-if="sortField === 'work_places' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'work_places' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalWorkPlaces) }}
            </li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('fact_work')">
                Факт раб.мест
                <SortAscendingOutlined v-if="sortField === 'fact_work' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'fact_work' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalRawFactWork) }}
            </li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('plan_fot')">
                План ФОТ
                <SortAscendingOutlined v-if="sortField === 'plan_fot' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'plan_fot' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalPlanFot) }}
            </li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('fact_fot')">
                Факт ФОТ
                <SortAscendingOutlined v-if="sortField === 'fact_fot' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'fact_fot' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>{{ Numeral(totalFactFot) }}
            </li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%]">СМЗ</li>
            <li class="w-[100%]">Риски КТР</li>
            <li class="w-[100%]">Высокий</li>
            <li class="w-[100%]">Средний</li>
            <li class="w-[100%]">Отсутствует</li>
        </ul>
        <div class="body">
            <template v-for="item in sortedOtraslItems" :key="item">
                <div class="head mt-1">
                    <a-tooltip placement="left" :title="item.otrasl">
                        <p class="element truncate cursor-pointer"
                            :class="{ 'text-[#3090e8]': currentOtrasl === item.otrasl }"
                            @click="aStore.setCurrentOtrasl(item.otrasl)">
                            {{ item.otrasl }}
                        </p>
                    </a-tooltip>
                    <p class="element truncate text-center">{{ item.count }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.project_price) }}</p>
                    <div class="element truncate text-center">
                        <p class="absolute top-0 left-0 w-full h-full bg-[#059669] rounded z-[5]"
                            :style="{ width: +item.finsihed / (+item.not_finsihed + item.finsihed) * 100 + '%' }">
                        </p>
                        <p class="z-[10] relative w-full text-center">
                            {{ Numeral(item.finsihed / (+item.not_finsihed + item.finsihed) * 100) }} %
                        </p>
                    </div>

                    <p class="element truncate text-center">{{ Numeral(item.work_places) }}</p>
                    <p class="element truncate text-center">{{ Numeral(isExploitationCompleteForItem(item) ? item.fact_work : (!isSMRActiveOrCompleteForItem(item) ? 0 : item.data_project_temporaryworkplacescount || 0)) }}</p>
                    <p class="element truncate text-center"
                        :style="{ background: getPercentBackgroundColor(item) }">
                        {{ getPercentText(item) }}
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.plan_fot) }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.fact_fot) }}</p>

                    <p class="element truncate text-center"
                        :style="{ background: item.fact_fot === 0 ? '#dc2626' : getColorFromGradient(Math.min(item.fact_fot / item.plan_fot * 100, 100)) }">
                        {{ Numeral(Math.min(item.fact_fot / item.plan_fot * 100, 100)) }}%
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.smz_count > 0 ? item.smz_12mes_sum / item.smz_count : 0) }}</p>
                    <p class="element truncate text-center border border-[#3090e8]">
                        {{ Numeral(item.risk_otsut + item.risk_vysok + item.risk_sred) }}
                    </p>
                    <p class="element truncate text-center border border-[#3090e8]">{{ Numeral(item.risk_vysok)
                        }}</p>
                    <p class="element truncate text-center border border-[#3090e8]">{{ Numeral(item.risk_sred)
                        }}</p>
                    <p class="element truncate text-center border border-[#3090e8]">{{ Numeral(item.risk_otsut)
                        }}</p>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, defineProps, defineExpose } from 'vue';
import { Numeral } from '../../../../shared/helpers/numeral';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';
import { getColorFromGradient } from '../../../../shared/helpers/gradientColors';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    isModal: {
        type: Boolean,
        default: false
    }
});

const aStore = useAStore()
const { a1Filter, currentOtrasl } = storeToRefs(aStore);

interface OtraslItem {
    otrasl: string;
    count: number;
    project_price: number;
    finsihed: number;
    not_finsihed: number;
    work_places: number;
    fact_work: number;
    plan_fot: number;
    fact_fot: number;
    smz_12mes: number;
    risk_otsut: number;
    risk_vysok: number;
    risk_sred: number;
    data_project_roadmap_tasks: any[];
    data_project_temporaryworkplacescount: number;
    smz_12mes_sum: number;
    smz_count: number;
    [key: string]: any;
}

const totalProjectsCount = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.count || 0), 0);
});

const totalProjectPrice = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.project_price || 0), 0);
});

const totalWorkPlaces = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.work_places || 0), 0);
});

const totalRawFactWork = computed(() => {
    return a1Filter.value.reduce((sum: number, item: any) => sum + Number(item.fact_work || 0), 0);
});

const totalFactWork = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.fact_work || 0), 0);
});

const totalPlanFot = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.plan_fot || 0), 0);
});

const totalFactFot = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.fact_fot || 0), 0);
});

function isExploitationCompleteForItem(item: any) {
    const tasks = item.data_project_roadmap_tasks || [];
    const exploitationTask = tasks.find((task: any) => 
        task.task_name && task.task_name.toLowerCase().includes('ввод в эксплуатацию') && 
        (task.status === 'DONE' || task.status === 'IN_PROGRESS')
    );
    return !!exploitationTask;
}

function isSMRActiveOrCompleteForItem(item: any) {
    const tasks = item.data_project_roadmap_tasks || [];
    const smrTask = tasks.find((task: any) => 
        task.task_name && (
            task.task_name.toLowerCase().includes('смр') || 
            task.task_name.toLowerCase().includes('строительно-монтажные работы')
        ) && 
        (task.status === 'DONE' || task.status === 'IN_PROGRESS')
    );
    return !!smrTask;
}

function getPercentBackgroundColor(item: any) {
    if (isExploitationCompleteForItem(item)) {
        return item.fact_work === 0 ? '#dc2626' : getColorFromGradient(item.work_places === 0 ? 0 : Math.min(100, (item.fact_work / item.work_places * 100)));
    } else {
        const tempValue = !isSMRActiveOrCompleteForItem(item) ? 0 : (item.data_project_temporaryworkplacescount || 0);
        return tempValue === 0 ? '#dc2626' : getColorFromGradient(item.work_places === 0 ? 0 : Math.min(100, (tempValue / item.work_places * 100)));
    }
}

function getPercentText(item: any) {
    if (isExploitationCompleteForItem(item)) {
        return item.work_places === 0 ? '0%' : Numeral(Math.min(100, item.fact_work / item.work_places * 100)) + '%';
    } else {
        const tempValue = !isSMRActiveOrCompleteForItem(item) ? 0 : (item.data_project_temporaryworkplacescount || 0);
        return item.work_places === 0 ? '0%' : Numeral(Math.min(100, tempValue / item.work_places * 100)) + '%';
    }
}

const groupByOtrasl = computed(() => Object.values(a1Filter.value.reduce((acc, curr) => {
    if (!acc[curr.otrasl]) {
        acc[curr.otrasl] = {
            ...curr,
            count: 1,
            finsihed: curr.project_status === 'Период завершенный' ? 1 : 0,
            not_finsihed: curr.project_status !== 'Период завершенный' ? 1 : 0,
            risk_otsut: curr.ball_tip_name.includes('Отсутствует') ? 1 : 0,
            risk_vysok: curr.ball_tip_name.includes('Высокий') ? 1 : 0,
            risk_sred: curr.ball_tip_name.includes('Средний') ? 1 : 0,
            data_project_roadmap_tasks: curr.data_project_roadmap_tasks || [],
            data_project_temporaryworkplacescount: curr.data_project_temporaryworkplacescount || 0,
            smz_12mes_sum: curr.smz_12mes || 0,
            smz_count: curr.smz_12mes ? 1 : 0
        };
    } else {
        acc[curr.otrasl].count++;
        acc[curr.otrasl].project_price += curr.project_price;
        acc[curr.otrasl].work_places += curr.work_places;
        
        const isExploitationComplete = isExploitationCompleteForItem(curr);
        const isSMRActive = isSMRActiveOrCompleteForItem(curr);
        const factWorkValue = isExploitationComplete 
            ? curr.fact_work 
            : (!isSMRActive ? 0 : (curr.data_project_temporaryworkplacescount || 0));
        
        acc[curr.otrasl].fact_work += factWorkValue;
        
        if (curr.data_project_roadmap_tasks) {
            acc[curr.otrasl].data_project_roadmap_tasks = [
                ...(acc[curr.otrasl].data_project_roadmap_tasks || []),
                ...curr.data_project_roadmap_tasks
            ];
        }
        
        acc[curr.otrasl].data_project_temporaryworkplacescount += 
            (curr.data_project_temporaryworkplacescount || 0);
        
        acc[curr.otrasl].plan_fot += curr.plan_fot;
        acc[curr.otrasl].fact_fot += curr.fact_fot;
        
        if (curr.smz_12mes) {
            acc[curr.otrasl].smz_12mes_sum = (acc[curr.otrasl].smz_12mes_sum || 0) + curr.smz_12mes;
            acc[curr.otrasl].smz_count = (acc[curr.otrasl].smz_count || 0) + 1;
        }

        acc[curr.otrasl].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
        acc[curr.otrasl].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
        acc[curr.otrasl].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;

        acc[curr.otrasl].finsihed += curr.project_status === 'Период завершенный' ? 1 : 0;
        acc[curr.otrasl].not_finsihed += curr.project_status !== 'Период завершенный' ? 1 : 0;
    }

    return acc;
}, {})))

const sortField = ref('count');
const sortOrder = ref('desc');

const toggleSort = (field: string) => {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortOrder.value = 'desc';
    }
};

const sortedOtraslItems = computed(() => {
    const items = Object.values(groupByOtrasl.value) as OtraslItem[];
    
    if (!sortField.value) {
        return items.sort((a: OtraslItem, b: OtraslItem) => b.count - a.count);
    }
    
    return [...items].sort((a: OtraslItem, b: OtraslItem) => {
        let valA, valB;
        
        if (sortField.value === 'count') {
            valA = Number(a.count || 0);
            valB = Number(b.count || 0);
        } else if (sortField.value === 'project_price') {
            valA = Number(a.project_price || 0);
            valB = Number(b.project_price || 0);
        } else if (sortField.value === 'work_places') {
            valA = Number(a.work_places || 0);
            valB = Number(b.work_places || 0);
        } else if (sortField.value === 'fact_work') {
            valA = isExploitationCompleteForItem(a) ? Number(a.fact_work || 0) : (!isSMRActiveOrCompleteForItem(a) ? 0 : Number(a.data_project_temporaryworkplacescount || 0));
            valB = isExploitationCompleteForItem(b) ? Number(b.fact_work || 0) : (!isSMRActiveOrCompleteForItem(b) ? 0 : Number(b.data_project_temporaryworkplacescount || 0));
        } else if (sortField.value === 'plan_fot') {
            valA = Number(a.plan_fot || 0);
            valB = Number(b.plan_fot || 0);
        } else if (sortField.value === 'fact_fot') {
            valA = Number(a.fact_fot || 0);
            valB = Number(b.fact_fot || 0);
        } else {
            valA = a[sortField.value] || 0;
            valB = b[sortField.value] || 0;
        }
        
        return sortOrder.value === 'asc' ? valA - valB : valB - valA;
    });
});

function getExportData() {
    const exportData = sortedOtraslItems.value.map(item => {
        const finishedPercent = item.finsihed / (+item.not_finsihed + item.finsihed) * 100;
        const factWorkPercent = item.work_places === 0 ? 0 : 
            (isExploitationCompleteForItem(item) ? 
                Math.min(100, item.fact_work / item.work_places * 100) : 
                Math.min(100, (!isSMRActiveOrCompleteForItem(item) ? 0 : 
                    item.data_project_temporaryworkplacescount / item.work_places * 100)));
        const fotPercent = item.plan_fot === 0 ? 0 : Math.min(100, item.fact_fot / item.plan_fot * 100);
        const avgSMZ = item.smz_count > 0 ? item.smz_12mes_sum / item.smz_count : 0;
        
        return {
            'Отрасль': item.otrasl,
            'Количество проектов': item.count,
            'Стоимость проекта': item.project_price,
            '% завершенных по сроку': finishedPercent.toFixed(2) + '%',
            'План раб.мест': item.work_places,
            'Факт раб.мест': isExploitationCompleteForItem(item) ? 
                item.fact_work : 
                (!isSMRActiveOrCompleteForItem(item) ? 0 : item.data_project_temporaryworkplacescount),
            '% рабочих мест': factWorkPercent.toFixed(2) + '%',
            'План ФОТ': item.plan_fot,
            'Факт ФОТ': item.fact_fot,
            '% ФОТ': fotPercent.toFixed(2) + '%',
            'СМЗ': avgSMZ,
            'Риски КТР': item.risk_otsut + item.risk_vysok + item.risk_sred,
            'Высокий': item.risk_vysok,
            'Средний': item.risk_sred,
            'Отсутствует': item.risk_otsut
        };
    });
    
    exportData.push({
        'Отрасль': 'ИТОГО',
        'Количество проектов': totalProjectsCount.value,
        'Стоимость проекта': totalProjectPrice.value,
        '% завершенных по сроку': '-' as any,
        'План раб.мест': totalWorkPlaces.value,
        'Факт раб.мест': totalRawFactWork.value,
        '% рабочих мест': '-' as any,
        'План ФОТ': totalPlanFot.value,
        'Факт ФОТ': totalFactFot.value,
        '% ФОТ': '-' as any,
        'СМЗ': '-' as any,
        'Риски КТР': '-' as any,
        'Высокий': '-' as any,
        'Средний': '-' as any,
        'Отсутствует': '-' as any
    });
    
    return exportData;
}

defineExpose({
    getExportData
});
</script>
<style scoped lang="scss">
.head {
    display: grid;
    grid-gap: 4px;
    grid-template-columns: 17% 8% 8% 6% 7% 7% 3% 6% 5% 3% 6% 5% 5% 5% 5%;
    li {
        padding: 4px 8px;
    }
}

.body {
    .head {
        display: grid;
        grid-gap: 4px;
        grid-template-columns: 17% 8% 8% 6% 7% 7% 3% 6% 5% 3% 6% 5% 5% 5% 5%;
        position: relative;
        z-index: 1;
    }
}

.element {
    position: relative;
    display: flex;
    background: #252A36;
    border-radius: 6px;
    width: 100%;
    min-height: 30px;
    height: 100%;
    padding: 4px 8px;
    align-items: center;
    white-space: nowrap;
}
</style>