<template>
    <div class="overflow-scroll h-[27vh] text-white text-[12px]">
        <ul class="head text-white pb-1 mb-1 border-b border-gray-700 items-start w-[100%] sticky top-0 z-10 bg-[#1E2028]">
            <li class="w-[100%]">Отрасль</li>
            <li class="w-[100%]">К-во проектов<br><br>{{ Numeral(totalProjectsCount) }}</li>
            <li class="w-[100%]">Стоимость проекта<br><br>{{ Numeral(totalProjectPrice) }}</li>
            <li class="w-[100%]">% завершенных по сроку</li>
            <li class="w-[100%]">План раб.мест<br><br>{{ Numeral(totalWorkPlaces) }}</li>
            <li class="w-[100%]">Факт раб.мест<br><br>{{ Numeral(totalFactWork) }}</li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%]">План ФОТ<br><br>{{ Numeral(totalPlanFot) }}</li>
            <li class="w-[100%]">Факт ФОТ<br><br>{{ Numeral(totalFactFot) }}</li>
            <li class="w-[100%]">%</li>
            <li class="w-[100%]">СМЗ</li>
            <li class="w-[100%]">Риски КТР</li>
            <li class="w-[100%]">Высокий</li>
            <li class="w-[100%]">Средний</li>
            <li class="w-[100%]">Отсутствует</li>
        </ul>
        <div class="body">
            <template v-for="item in Object.values(groupByOtrasl).sort((a, b) => b.count - a.count)" :key="item">
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
                        <p class="absolute top-0 left-0 w-full h-full bg-[#059669] rounded"
                            :style="{ width: +item.finsihed / (+item.not_finsihed + item.finsihed) * 100 + '%' }">
                        </p>
                        <p class="z-10 relative w-full text-center">
                            {{ Numeral(item.finsihed / (+item.not_finsihed + item.finsihed) * 100) }} %
                        </p>
                    </div>

                    <p class="element truncate text-center">{{ Numeral(item.work_places) }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.fact_work) }}</p>
                    <p class="element truncate text-center"
                        :style="{ background: item.fact_work === 0 ? '#dc2626' : getColorFromGradient(Math.min(item.fact_work / item.work_places * 100, 100)) }">
                        {{ Numeral(Math.min(item.fact_work / item.work_places * 100, 100)) }}%
                    </p>

                    <p class="element truncate text-center">{{ Numeral(item.plan_fot) }}</p>
                    <p class="element truncate text-center">{{ Numeral(item.fact_fot) }}</p>

                    <p class="element truncate text-center"
                        :style="{ background: item.fact_fot === 0 ? '#dc2626' : getColorFromGradient(Math.min(item.fact_fot / item.plan_fot * 100, 100)) }">
                        {{ Numeral(Math.min(item.fact_fot / item.plan_fot * 100, 100)) }}%
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
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Numeral } from '../../../../shared/helpers/numeral';
import { useAStore } from '../../store';
import { storeToRefs } from 'pinia';
import { getColorFromGradient } from '../../../../shared/helpers/gradientColors';

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

const totalFactWork = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.fact_work || 0), 0);
});

const totalPlanFot = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.plan_fot || 0), 0);
});

const totalFactFot = computed(() => {
    return Object.values(groupByOtrasl.value).reduce((sum: number, item: any) => sum + Number(item.fact_fot || 0), 0);
});

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
        };
    } else {
        acc[curr.otrasl].count++;
        acc[curr.otrasl].sum_project_price += curr.project_price;
        acc[curr.otrasl].work_places += curr.work_places;
        acc[curr.otrasl].fact_work += curr.fact_work;
        acc[curr.otrasl].plan_fot += curr.plan_fot;
        acc[curr.otrasl].fact_fot += curr.fact_fot;
        acc[curr.otrasl].smz_12mes += curr.smz_12mes;

        acc[curr.otrasl].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
        acc[curr.otrasl].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
        acc[curr.otrasl].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;

        acc[curr.otrasl].finsihed += curr.project_status === 'Период завершенный' ? 1 : 0;
        acc[curr.otrasl].not_finsihed += curr.project_status !== 'Период завершенный' ? 1 : 0;
    }

    return acc;
}, {})))
</script>
<style scoped lang="scss">
.head {
    display: grid;
    grid-gap: 4px;
    grid-template-columns: 20% 6% 6% 6% 7% 7% 3% 6% 6% 3% 6% 5% 5% 5% 5% ;
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