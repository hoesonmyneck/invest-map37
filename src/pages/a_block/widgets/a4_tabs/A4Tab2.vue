<template>
    <div class="overflow-scroll h-[27vh] text-white text-[12px] pt-3">
        <ul class="head text-white pb-1 mb-1 border-b border-gray-700 items-end w-min">
            <li></li>
            <li>Наименование</li>
            <li>Стоимость проекта</li>
            <li>Срок</li>
            <li>План раб.мест</li>
            <li>Факт раб.мест</li>
            <li>%</li>
            <li>План ФОТ</li>
            <li>Факт ФОТ</li>
            <li>%</li>
            <li>СМЗ</li>
            <li>Риски КТР</li>
            <li>Высокий</li>
            <li>Средний</li>
            <li>Отсутствует</li>
        </ul>
        <div class="body">
            <RecycleScroller class="scroller h-full" :min-item-size="10" :items="a1FilterByProject" :item-size="1"
                key-field="id" v-slot="{ item }">
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

const aStore = useAStore()
const { a1FilterByProject, currentProject } = storeToRefs(aStore);

function getProjectDatePrecent(item) {
    let _start = new Date(item.project_start_date).getFullYear()
    let _end = new Date(item.project_exploitation_date).getFullYear()
    const _current = new Date().getFullYear()

    if (_end === _current) return Numeral(100)
    if (_start === _current) _start = 2024

    const _year = Math.abs((_current - _start) / (_start - _end) * 100)
    return Numeral(_year > 100 ? 100 : _year)
}

</script>
<style scoped lang="scss">
.head {
    display: grid;
    grid-gap: 4px;
    grid-template-columns: 30px 150px 120px 150px 120px 120px 50px 140px 110px 50px 120px 90px 90px 90px 90px;
}

.element {
    position: relative;
    display: flex;
    background: #252A36;
    border-radius: 6px;
    width: 100%;
    height: 30px;
    padding: 0 12px;
    align-items: center;
}
</style>