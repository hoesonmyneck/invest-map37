<template>
    <div class="overflow-scroll h-[27vh] text-white text-[12px]">
        <ul class="head text-white pb-1 mb-1 border-b border-gray-700 items-start w-[100%] sticky top-0 z-10 bg-[#1E2028]">
            <li class="w-[100%]"></li>
            <li class="w-[100%]">Наименование</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('project_price')">
                Стоимость проекта
                <SortAscendingOutlined v-if="sortField === 'project_price' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'project_price' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>Общее: {{ Numeral(totalProjectPrice) }}
            </li>
            <li class="w-[100%]">Срок</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('work_places')">
                План раб.мест
                <SortAscendingOutlined v-if="sortField === 'work_places' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'work_places' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>Общее: {{ Numeral(totalWorkPlaces) }}
            </li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('fact_work')">
                Факт раб.мест
                <SortAscendingOutlined v-if="sortField === 'fact_work' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'fact_work' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>Общее: {{ Numeral(totalFactWork) }}
            </li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('plan_fot')">
                План ФОТ
                <SortAscendingOutlined v-if="sortField === 'plan_fot' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'plan_fot' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>Общее: {{ Numeral(totalPlanFot) }}
            </li>
            <li class="w-[100%] cursor-pointer" @click="toggleSort('fact_fot')">
                Факт ФОТ
                <SortAscendingOutlined v-if="sortField === 'fact_fot' && sortOrder === 'asc'" class="text-blue-400 ml-1" />
                <SortDescendingOutlined v-if="sortField === 'fact_fot' && sortOrder === 'desc'" class="text-blue-400 ml-1" />
                <br><br>Общее: {{ Numeral(totalFactFot) }}
            </li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%]">СМЗ</li>
            <li class="w-[100%]">Риски КТР</li>
            <li class="w-[100%]">Высокий</li>
            <li class="w-[100%]">Средний</li>
            <li class="w-[100%]">Отсутствует</li>
        </ul>
        <div class="body">
            <RecycleScroller class="scroller h-full" :min-item-size="1" :items="sortedProjects" :item-size="1"
                key-field="id" v-slot="{ item }" page-mode="contain">
                <div class="head mt-1 min-h-[30px]">
                    <p class="w-full h-full flex items-center justify-center rounded bg-[#252A36] cursor-pointer">
                        <img src="/images/icons/map.png" alt="" class="w-[16px]" v-if="!!item.coordinates"
                            @click="aStore.setCurrentProject(item.id), aStore.setCurrentRegion(item.parent1_code), aStore.setCurrentRaion(item.parent2_code), aStore.setCurrentOtrasl(item.otrasl)">
                    </p>
                    <a-tooltip placement="left" :title="item.project_name">
                        <p class="element break-words cursor-pointer"
                            :class="{ 'text-[#3090e8]': currentProject === item.id }"
                            @click="aStore.setCurrentProject(item.id), aStore.setProjectModalVisible(true)">
                            {{ item.project_name }}
                        </p>
                    </a-tooltip>
                    <p class="element truncate text-center">{{ Numeral(item.project_price) }}</p>
                    <div class="flex flex-col justify-center h-full">
                        <div class="w-full h-[14px] bg-[#252A36] rounded mt-[3px]">
                            <div class="progress h-[14px] flex justify-center rounded bg-[#3090e8]"
                                :style="{ 'width': getProjectDatePrecent(item) + '%' }">
                                <p class="text-[10px]">{{ new Date().getFullYear() }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between text-[10px]">
                            <p>{{ new Date(item.project_start_date).getFullYear() }}</p>
                            <p>{{ new Date(item.project_exploitation_date).getFullYear() }}</p>
                        </div>
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
                        :style="{ background: item.fact_fot === 0 ? '#dc2626' : getColorFromGradient(item.fact_fot / item.plan_fot * 100) }">
                        {{ Numeral(item.fact_fot / item.plan_fot * 100) }}%
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.smz_12mes) }}</p>
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
            </RecycleScroller>
            <!-- <template v-for="item in a1FilterByProject" :key="item.id">
                <div class="head mt-1">
                    <p class="w-full h-full flex items-center justify-center rounded bg-[#252A36] cursor-pointer">
                        <img src="/images/icons/map.png" alt="" class="w-[16px]" v-if="!!item.coordinates"
                            @click="aStore.setCurrentProject(item.id), aStore.setCurrentRegion(item.parent1_code), aStore.setCurrentRaion(item.parent2_code), aStore.setCurrentOtrasl(item.otrasl)">
                    </p>
                    <a-tooltip placement="left" :title="item.project_name">
                        <p class="element truncate cur cursor-pointer"
                            :class="{ 'text-[#3090e8]': currentProject === item.id }"
                            @click="aStore.setCurrentProject(item.id), aStore.setProjectModalVisible(true)">
                            {{ item.project_name }}
                        </p>
                    </a-tooltip>
                    <p class="element truncate text-center">{{ Numeral(item.project_price) }}</p>
                    <div>
                        <div class="w-full h-[14px] bg-[#252A36] rounded mt-[3px]">
                            <div class="progress h-[14px] flex justify-center rounded bg-[#3090e8]"
                                :style="{ 'width': getProjectDatePrecent(item) + '%' }">
                                <p class="text-[10px]">{{ new Date().getFullYear() }}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between text-[10px]">
                            <p>{{ new Date(item.project_start_date).getFullYear() }}</p>
                            <p>{{ new Date(item.project_exploitation_date).getFullYear() }}</p>
                        </div>
                    </div>
                    <p class="element truncate text-center">{{ Numeral(item.work_places) }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.fact_work) }}</p>
                    <p class="element truncate text-center"
                        :style="{ background: getColorFromGradient(item.fact_work / item.work_places * 100) }">
                        {{ Numeral(item.fact_work / item.work_places * 100) }}%
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.plan_fot) }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.fact_fot) }}</p>

                    <p class="element truncate text-center"
                        :style="{ background: getColorFromGradient(item.fact_fot / item.plan_fot * 100) }">
                        {{ Numeral(item.fact_fot / item.plan_fot * 100) }}%
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.smz_12mes) }}</p>
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
            </template> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { Numeral } from '../../../../shared/helpers/numeral';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';
import { getColorFromGradient } from '../../../../shared/helpers/gradientColors';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons-vue';
import { ref, computed } from 'vue';

const aStore = useAStore()
const { a1FilterByProject, currentProject } = storeToRefs(aStore);

const sortField = ref('');
const sortOrder = ref('asc');

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const totalProjectPrice = computed(() => {
  return a1FilterByProject.value.reduce((sum, item) => sum + Number(item.project_price || 0), 0);
});

const totalWorkPlaces = computed(() => {
  return a1FilterByProject.value.reduce((sum, item) => sum + Number(item.work_places || 0), 0);
});

const totalFactWork = computed(() => {
  return a1FilterByProject.value.reduce((sum, item) => {
    const value = isExploitationCompleteForItem(item) 
      ? Number(item.fact_work || 0) 
      : (!isSMRActiveOrCompleteForItem(item) ? 0 : Number(item.data_project_temporaryworkplacescount || 0));
    return sum + value;
  }, 0);
});

const totalPlanFot = computed(() => {
  return a1FilterByProject.value.reduce((sum, item) => sum + Number(item.plan_fot || 0), 0);
});

const totalFactFot = computed(() => {
  return a1FilterByProject.value.reduce((sum, item) => sum + Number(item.fact_fot || 0), 0);
});

const sortedProjects = computed(() => {
  if (!sortField.value) {
    return a1FilterByProject.value;
  }

  return [...a1FilterByProject.value].sort((a, b) => {
    let valA, valB;

    if (sortField.value === 'project_price') {
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

interface ProjectItem {
    project_start_date: string;
    project_exploitation_date: string;
    work_places: number;
    fact_work: number;
    data_project_temporaryworkplacescount?: number;
    data_project_roadmap_tasks?: Array<{
        stage_id: number;
        task_name: string;
        startDate: string | null;
        finishDate: string | null;
        startedAt: string | null;
        executedAt: string | null;
        status: string;
    }>;
    [key: string]: any;
}

function getProjectDatePrecent(item: ProjectItem) {
    let _start = new Date(item.project_start_date).getFullYear()
    let _end = new Date(item.project_exploitation_date).getFullYear()
    const _current = new Date().getFullYear()

    if (_end === _current) return Numeral(100)
    if (_start === _current) _start = 2024

    const _year = Math.abs((_current - _start) / (_start - _end) * 100)
    return Numeral(_year > 100 ? 100 : _year)
}

function isExploitationCompleteForItem(item: ProjectItem) {
    const tasks = item.data_project_roadmap_tasks || [];
    const exploitationTask = tasks.find(task => 
        task.task_name && task.task_name.toLowerCase().includes('ввод в эксплуатацию') && 
        (task.status === 'DONE' || task.status === 'IN_PROGRESS')
    );
    return !!exploitationTask;
}

function isSMRActiveOrCompleteForItem(item: ProjectItem) {
    const tasks = item.data_project_roadmap_tasks || [];
    const smrTask = tasks.find(task => 
        task.task_name && (
            task.task_name.toLowerCase().includes('смр') || 
            task.task_name.toLowerCase().includes('строительно-монтажные работы')
        ) && 
        (task.status === 'DONE' || task.status === 'IN_PROGRESS')
    );
    return !!smrTask;
}

function getPercentBackgroundColor(item: ProjectItem) {
    if (isExploitationCompleteForItem(item)) {
        return item.fact_work === 0 ? '#dc2626' : getColorFromGradient(item.work_places === 0 ? 0 : Math.min(100, (item.fact_work / item.work_places * 100)));
    } else {
        const tempValue = !isSMRActiveOrCompleteForItem(item) ? 0 : (item.data_project_temporaryworkplacescount || 0);
        return tempValue === 0 ? '#dc2626' : getColorFromGradient(item.work_places === 0 ? 0 : Math.min(100, (tempValue / item.work_places * 100)));
    }
}

function getPercentText(item: ProjectItem) {
    if (isExploitationCompleteForItem(item)) {
        return item.work_places === 0 ? '0%' : Numeral(Math.min(100, item.fact_work / item.work_places * 100)) + '%';
    } else {
        const tempValue = !isSMRActiveOrCompleteForItem(item) ? 0 : (item.data_project_temporaryworkplacescount || 0);
        return item.work_places === 0 ? '0%' : Numeral(Math.min(100, tempValue / item.work_places * 100)) + '%';
    }
}

</script>
<style scoped lang="scss">
.head {
    display: grid;
    grid-gap: 4px;
    grid-template-columns: 2% 26% 7% 7% 6% 6% 3% 8% 8% 3% 5% 4% 4% 4% 4%;
}

.element {
    position: relative;
    display: flex;
    background: #252A36;
    border-radius: 6px;
    width: 100%;
    min-height: 30px;
    height: auto;
    padding: 4px 12px;
    align-items: center;
}

.element.break-words {
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    height: 100%;
}


.head > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}
</style>