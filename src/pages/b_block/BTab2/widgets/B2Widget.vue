<template>
    <div class="text-white">
        <BaseCard title="«АУЫЛ АМАНАТЫ»" number="A2" :show-close-button="false" @close="$emit('close')">
            <div class="grid grid-cols-[200px_1fr] gap-2 items-start p-3 px-5">
                <div class="relative flex items-center justify-center">
                    <highcharts :options="chart" class="h-[170px] m-auto"></highcharts>
                    <p class="absolute text-2xl font-bold">
                        {{ Numeral((opv_has / total) * 100) }}%
                    </p>
                </div>
                <ul class="overflow-scroll h-[180px]">
                    <li class="grid grid-cols-[40px_1fr_80px_60px] w-full mb-2 pb-2 border-b border-gray-700">
                        <img class="w-4" src="/images/a_block/img_1.png" alt="" />
                        <p class="text-[10px]">Участники</p>
                        <p class="text-[10px]">{{ Numeral(total) }}</p>
                        <p class="text-[10px] text-end">100%</p>
                    </li>

                    <li v-for="(l, i) in listAulAmanati"
                        class="grid text-gray-400 grid-cols-[40px_1fr_80px_60px] w-full mb-4">
                        <img class="w-4" :src="`/images/a_block/a2_${i + 1}.png`" alt="" />
                        <p class="text-[10px]">{{ l.name }}</p>
                        <p class="text-[10px]">{{ Numeral(l.count) }}</p>
                        <p class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center">
                            {{ Numeral(l.percent) }}%
                        </p>
                    </li>
                </ul>
            </div>
        </BaseCard>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getAulAmanati } from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { chartOptions } from "../helpers/chartOption";

const loader = ref(true);
const data = ref<any[]>([]);

const programStore = useProgramStore();
const { aulAmanatiFilter } = storeToRefs(programStore);


const srok_5 = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.srok_5 || 0), 0))
const srok_7 = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.srok_7 || 0), 0))
const active_ip = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.active_ip || 0), 0))
const not_active = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.not_active || 0), 0))
const opv_has = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.opv_has || 0), 0))
const total = computed(() => aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0))

const listAulAmanati = computed(() => [
    {
        name: "Срок до 5 лет",
        count: srok_5.value,
        percent: (srok_5.value / total.value) * 100,
    },
    {
        name: "Срок до 7 лет",
        count: srok_7.value,
        percent: (srok_7.value / total.value) * 100,
    },
    {
        name: "Активное ИП",
        count: active_ip.value,
        percent: (active_ip.value / total.value) * 100,
    },
    {
        name: "Неактивное ИП",
        count: not_active.value,
        percent: (not_active.value / total.value) * 100,
    },
    {
        name: "Есть ОПВ",
        count: opv_has.value,
        percent: (opv_has.value / total.value) * 100,
    },
]);

async function loadSerpin() {
    data.value = await getAulAmanati().finally(() => {
        loader.value = false;
    });

    programStore.setAulAmanati(data.value);
}

loadSerpin()


const chart = computed(() =>
    chartOptions(
        [
            "Общее количество",
            "Работающие",
            "Безработные",
            "По трудовому договору",
            "Без трудового договора",
            "В других регионах",
            "На юге Казахстана",
        ],
        [
            {
                name: "Исполняющие",
                data: [(opv_has.value / total.value) * 100],
                color: "#3090E8",
            },

            {
                name: "",
                data: [100 - (opv_has.value / total.value) * 100],
                color: "#3090E820",
            },
        ]
    )
);
</script>

<style scoped lang="scss">
.block {
    padding: 4px 12px;
    height: max-content;
    background: #252a36;
    border-radius: 6px;
}

.header-grid-text3 {
    display: grid;
    grid-gap: 4px;
    padding: 8px;

    grid-template-columns: 170px 140px 170px 100px 80px 60px 100px 50px;
}

.header-grid-text {
    display: grid;
    grid-gap: 4px;
    padding: 8px;
    grid-template-columns: 170px 140px 170px 100px 80px 60px 100px 50px;
}
</style>
