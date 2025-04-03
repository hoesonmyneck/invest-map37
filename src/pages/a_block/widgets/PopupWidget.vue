<template>
    <a-modal :footer="null" class="p-0 text-white" width="100%" height="100%" :closable="false" :centered="true"
        :visible="true">
        <BaseCard title="" number="F1" :close="true"
            @close="aStore.setCurrentProject(null), aStore.setProjectModalVisible(false)" :show-close-button="true">
            <div class="grid grid-cols-4 gap-1 w-max m-auto items-end text-white">
                <div class="text-center relative">
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-3xl">
                        {{ !isSMRActiveOrComplete() ? '0%' : Numeral(Math.min(currentProjectPopup.data_project_temporaryworkplacescount / currentProjectPopup.work_places * 100, 100)) + '%' }}
                    </p>
                    <highcharts
                        :options="chartOptions2('ПЛАНОВЫЕ РАБОЧИЕ МЕСТА', 'Фактический рабочие места', !isSMRActiveOrComplete() ? 0 : Math.min(currentProjectPopup.data_project_temporaryworkplacescount / currentProjectPopup.work_places * 100, 100), currentProjectPopup.work_places, currentProjectPopup.work_places, !isSMRActiveOrComplete() ? 0 : currentProjectPopup.data_project_temporaryworkplacescount)"
                        class="h-[200px] w-[250px] m-auto mt-5"></highcharts>
                    <div class="-mt-7">
                        <p class="text-gray-400 text-[12px] flex justify-center">
                            <img src="/images/a_block/a1-1.png" alt="" class="w-[14px] h-[14px] mr-1 mb-2">
                            {{ Numeral(!isSMRActiveOrComplete() ? 0 : currentProjectPopup.data_project_temporaryworkplacescount) }}
                        </p>
                        <p class="text-[12px]">ВРЕМЕННЫЕ РАБОЧИЕ МЕСТА</p>
                    </div>
                </div>
                <div class="text-center relative">
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-3xl">
                        {{ !isExploitationComplete() ? '0%' : Numeral(Math.min(currentProjectPopup.fact_work / currentProjectPopup.work_places * 100, 100)) + '%' }}
                    </p>
                    <highcharts
                        :options="chartOptions('ПЛАНОВЫЕ РАБОЧИЕ МЕСТА', 'Фактический рабочие места', !isExploitationComplete() ? 0 : Math.min(currentProjectPopup.fact_work / currentProjectPopup.work_places * 100, 100), currentProjectPopup.work_places, currentProjectPopup.work_places, !isExploitationComplete() ? 0 : currentProjectPopup.fact_work)"
                        class="h-[200px] w-[250px] m-auto mt-5"></highcharts>
                    <div class="-mt-7">
                        <p class="text-gray-400 text-[12px] flex justify-center">
                            <img src="/images/a_block/a1-1.png" alt="" class="w-[14px] h-[14px] mr-1 mb-2">
                            {{ Numeral(currentProjectPopup.work_places) }}
                        </p>
                        <p class="text-[12px]">ПОСТОЯННЫЕ РАБОЧИЕ МЕСТА</p>
                    </div>
                </div>
                <div class="text-center relative">
                    <highcharts
                        :options="chartOptions('СТОИМОСТЬ ПРОЕКТА', 'СТОИМОСТЬ ПРОЕКТА', 100, 100, currentProjectPopup.project_price, currentProjectPopup.project_price)"
                        class="h-[210px] w-[250px] m-auto mt-5">
                    </highcharts>
                    <p class="absolute top-[130px] left-1/2 -translate-x-1/2 text-2xl">{{
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

            <div class=" mt-10 w-[850px] m-auto text-white">
                <div class="flex gap-1 text-xs p-1 mt-10">
                    <p @click="active = 0" :class="active === 0 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Общее</p>
                    <p @click="active = 4" :class="active === 4 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">График</p> 
                    <p @click="active = 5" :class="active === 5 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Стадия проекта</p>   
                    <p @click="active = 1" :class="active === 1 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Трудовой риск</p>
                    <p @click="active = 2" :class="active === 2 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">Финансовый риск</p>
                    <p @click="active = 3" :class="active === 3 ? 'border-[#3090E8]' : 'border-gray-700'"
                        class="cursor-pointer h-6 px-4 flex items-center border">ТиПО</p>
                    <div class="h-6 px-4 flex items-center gap-1">
                        <span class="text-xs w-[70px]">Подрядчик</span>
                        <div class="relative inline-flex h-5 w-10 items-center rounded-full" 
                             :class="toggleEnabled ? 'bg-[#3090E8]' : 'bg-gray-700'"
                             @click="toggleEnabled = !toggleEnabled">
                            <span class="h-4 w-4 transform rounded-full bg-white transition-transform"
                                  :class="toggleEnabled ? 'translate-x-5' : 'translate-x-1'"></span>
                        </div>
                        <span class="text-xs w-[50px] ml-3">Заказчик</span>
                    </div>
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
                    <div v-if="!isSMRActiveOrComplete() ? 0 : currentProjectPopup.data_project_temporaryworkplacescount > 0" class="mt-5 flex flex-col justify-center items-center  ">
                        <p class="text-lg mb-4">Динамика временных рабочих мест</p>
                        <highcharts :options="areaChartOptions" class="h-[300px] w-full"></highcharts>
                    </div>
                    <div v-if="isExploitationComplete()" class="mt-5 flex flex-col justify-center items-center  ">
                        <p class="text-lg mb-4">Динамика постоянных рабочих мест</p>
                        <highcharts :options="permanentChartOptions" class="h-[300px] w-full"></highcharts>
                    </div>
                </div>
                <div v-if="active === 5 ">
                    <div class="mt-5 flex flex-col justify-center">
                        <div class="text-white">
                            <!-- Преинвестиционная стадия -->
                            <div class="mb-6">
                                <div class="flex items-center cursor-pointer" @click="toggleSection('preinvest')">
                                    <div class="mr-2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12L0 6L6 0L7.05 1.05L2.85 5.25H12V6.75H2.85L7.05 10.95L6 12Z" fill="white" :transform="`rotate(${isOpenSection.preinvest ? 90 : 270} 6 6)`"/>
                                        </svg>
                                    </div>
                                    <span class="uppercase text-sm font-medium">ПРЕИНВЕСТИЦИОННАЯ СТАДИЯ</span>
                                </div>
                                
                                <div v-if="isOpenSection.preinvest" class="ml-6 mt-2">
                                    <div class="grid grid-cols-4 text-[11px] text-gray-400 mb-1">
                                        <div>Дата начала</div>
                                        <div>Задача</div>
                                        <div>Дата завершения</div>
                                        <div>Статус</div>
                                    </div>
                                    
                                    <!-- Элементы преинвестиционной стадии -->
                                    <div v-for="(item, index) in preInvestStages" :key="'pre-'+index" class="grid grid-cols-4 text-[12px] mb-4 items-center">
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.startDate }}</div>
                                            </div>
                                            <div v-if="item.hasStartFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factStartDate }}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-start h-full">{{ item.task }}</div>
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.endDate }}</div>
                                            </div>
                                            <div v-if="item.hasEndFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factEndDate }}</div>
                                            </div>
                                        </div>
                                        <div :class="getStatusClass(item.status)" class="flex items-center">{{ item.status }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Инвестиционная стадия -->
                            <div class="mb-6">
                                <div class="flex items-center cursor-pointer" @click="toggleSection('invest')">
                                    <div class="mr-2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12L0 6L6 0L7.05 1.05L2.85 5.25H12V6.75H2.85L7.05 10.95L6 12Z" fill="white" :transform="`rotate(${isOpenSection.invest ? 90 : 270} 6 6)`"/>
                                        </svg>
                                    </div>
                                    <span class="uppercase text-sm font-medium">ИНВЕСТИЦИОННАЯ СТАДИЯ</span>
                                </div>
                                
                                <div v-if="isOpenSection.invest" class="ml-6 mt-2">
                                    <div class="grid grid-cols-4 text-[11px] text-gray-400 mb-1">
                                        <div>Дата начала</div>
                                        <div>Задача</div>
                                        <div>Дата завершения</div>
                                        <div>Статус</div>
                                    </div>
                                    
                                    <!-- Элементы инвестиционной стадии -->
                                    <div v-for="(item, index) in investStages" :key="'inv-'+index" class="grid grid-cols-4 text-[12px] mb-4 items-center">
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.startDate }}</div>
                                            </div>
                                            <div v-if="item.hasStartFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factStartDate }}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-start h-full">{{ item.task }}</div>
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.endDate }}</div>
                                            </div>
                                            <div v-if="item.hasEndFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factEndDate }}</div>
                                            </div>
                                        </div>
                                        <div :class="getStatusClass(item.status)" class="flex items-center">{{ item.status }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Постинвестиционная стадия -->
                            <div>
                                <div class="flex items-center cursor-pointer" @click="toggleSection('postinvest')">
                                    <div class="mr-2">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12L0 6L6 0L7.05 1.05L2.85 5.25H12V6.75H2.85L7.05 10.95L6 12Z" fill="white" :transform="`rotate(${isOpenSection.postinvest ? 90 : 270} 6 6)`"/>
                                        </svg>
                                    </div>
                                    <span class="uppercase text-sm font-medium">ПОСТИНВЕСТИЦИОННАЯ СТАДИЯ</span>
                                </div>
                                
                                <div v-if="isOpenSection.postinvest" class="ml-6 mt-2">
                                    <div class="grid grid-cols-4 text-[11px] text-gray-400 mb-1">
                                        <div>Дата начала</div>
                                        <div>Задача</div>
                                        <div>Дата завершения</div>
                                        <div>Статус</div>
                                    </div>
                                    
                                    <!-- Элементы постинвестиционной стадии -->
                                    <div v-for="(item, index) in postInvestStages" :key="'post-'+index" class="grid grid-cols-4 text-[12px] mb-4 items-center">
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.startDate }}</div>
                                            </div>
                                            <div v-if="item.hasStartFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factStartDate }}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-start h-full">{{ item.task }}</div>
                                        <div>
                                            <div class="flex items-center">
                                                <div class="py-[2px] px-[4px] bg-[#189D19] text-white text-[10px]">ПЛАН</div>
                                                <div class="ml-1">{{ item.endDate }}</div>
                                            </div>
                                            <div v-if="item.hasEndFact" class="flex items-center mt-1">
                                                <div class="py-[2px] px-[4px] bg-[#41A0F5] text-white text-[10px]">ФАКТ</div>
                                                <div class="ml-1">{{ item.factEndDate }}</div>
                                            </div>
                                        </div>
                                        <div :class="getStatusClass(item.status)" class="flex items-center">{{ item.status }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
const toggleEnabled = ref(false)

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


const calculateKrmValues = (factValues: number[], krmValue: number) => {
    if (!factValues.length || !krmValue) return Array(factValues.length).fill(0);
    
    
    const firstFactValue = factValues[0] || 1;
    
  
    const ratio = krmValue / firstFactValue;
    
    
    return factValues.map(factValue => Math.round(factValue * ratio * 100) / 100);
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
            formatter: function(this: any) {
                const isFilled = this.point.series.index === 1;
                if (isFilled) {
                    return '<b>Фактические рабочие места:</b> ' + Numeral(value2);
                } else {
                    return '<b>Плановые рабочие места:</b> ' + Numeral(value);
                }
            }
        },
        yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
        plotOptions: { solidgauge: { dataLabels: { enabled: false, showInLegend: false } } },
        series: [
            { name: "", data: [{ name, radius: "80%", innerRadius: "100%", color: "rgba(48,144,232,0.2)", y: 100, value: Numeral(value) }] },
            { name: name ?? '', data: [{ name: name2, radius: "80%", innerRadius: "100%", color: "#3090E8", y: +percent.toFixed(0), value: Numeral(value2) }] },
        ],
    }
}
const chartOptions2 = (name: string, name2: string, percent: number, all: number, value: number, value2: number) => {
    return {
        chart: { type: "solidgauge", backgroundColor: "transparent", height: "100%" },
        title: { text: "" },
        pane: {
            startAngle: -125,
            endAngle: 125,
            background: [{ outerRadius: 0, innerRadius: 0, borderWidth: 0 }],
        },
        tooltip: {
            formatter: function(this: any) {
                // Определяем, на какую серию навели (заполненная или незаполненная)
                const isFilled = this.point.series.index === 1;
                const temporaryWorkplaces = !isSMRActiveOrComplete() ? 0 : currentProjectPopup.value.data_project_temporaryworkplacescount;
                
                if (isFilled) {
                    // Если навели на заполненную шкалу (синюю)
                    return '<b>Временные рабочие места:</b> ' + Numeral(temporaryWorkplaces);
                } else {
                    // Если навели на незаполненную шкалу (серую)
                    return '<b>Плановые рабочие места:</b> ' + Numeral(currentProjectPopup.value.work_places);
                }
            }
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
        categories: currentProjectPopup.value.fact_year_value.filter(
            (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
        ),
        labels: {
            style: {
                color: '#fff'
            }
        },
        lineColor: '#555'
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
                    
                    const firstYearIndex = currentProjectPopup.value.fact_year_value.findIndex(
                        (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
                    );
                    
                    
                    const firstYearValue = currentProjectPopup.value.fact_count_value[firstYearIndex] || 0;
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
        data: currentProjectPopup.value.fact_count_value.filter(
            (_: unknown, index: number): boolean => 
                currentProjectPopup.value.fact_year_value[index] >= 
                new Date(currentProjectPopup.value.project_start_date).getFullYear()
        ),
        color: '#3090E8',
    }, {
        name: 'Плановые рабочие места',
        type: 'line',
        data: Array(currentProjectPopup.value.fact_year_value.filter(
            (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
        ).length).fill(
            currentProjectPopup.value.data_project_temporaryworkplacescount + 
            (currentProjectPopup.value.fact_count_value[
                currentProjectPopup.value.fact_year_value.findIndex(
                    (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
                )
            ] || 0)
        ),
        color: '#B85DDA',
        dashStyle: 'solid',
        lineWidth: 2
    }, {
        name: 'Качественные рабочие места',
        type: 'line',
        data: calculateKrmValues(
            currentProjectPopup.value.fact_count_value.filter(
                (_: unknown, index: number): boolean => 
                    currentProjectPopup.value.fact_year_value[index] >= 
                    new Date(currentProjectPopup.value.project_start_date).getFullYear()
            ),
            currentProjectPopup.value.cnt_krm || 0
        ),
        color: '#FF9B42',
        dashStyle: 'shortdot',
        lineWidth: 2
    }]
}

const isOpenSection = ref({
    preinvest: true,
    invest: true,
    postinvest: true
})

const toggleSection = (section: string) => {
    isOpenSection.value[section as keyof typeof isOpenSection.value] = !isOpenSection.value[section as keyof typeof isOpenSection.value]
}


const getStatusClass = (status: string) => {
    switch(status) {
        case 'Завершено':
        case 'DONE':
            return 'text-[#00B212]'
        case 'Не начато':
        case 'CREATED':
            return 'text-[#B2B2B2]'
        case 'В процессе':
        case 'IN_PROGRESS':
            return 'text-[#3090E8]'
        default:
            return ''
    }
}


const mapStatus = (status: string) => {
    switch(status) {
        case 'DONE':
            return 'Завершено'
        case 'CREATED': 
            return 'Не начато'
        case 'IN_PROGRESS':
            return 'В процессе'
        default:
            return ''
    }
}


const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}


const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}


const processProjectStagesData = (apiData: any) => {
    if (!apiData) return { preInvestStages: [], investStages: [], postInvestStages: [] };
    
   
    interface Task {
        stage_id: number;
        task_name: string;
        startDate: string | null;
        finishDate: string | null;
        startedAt: string | null;
        executedAt: string | null;
        status: string;
        governmentAgency_name?: string;
    }
    
    const tasks = apiData.data_project_roadmap_tasks || [] as Task[];
    
   
    const preInvestTasks = tasks.filter((task: Task) => task.stage_id === 1);
    const investTasks = tasks.filter((task: Task) => task.stage_id === 2);
    const postInvestTasks = tasks.filter((task: Task) => task.stage_id === 3);
    

    const mapTaskToViewModel = (task: Task) => {
        return {
            startDate: formatDate(task.startDate),
            factStartDate: formatDate(task.startedAt),
            task: task.task_name,
            endDate: formatDate(task.finishDate),
            factEndDate: formatDate(task.executedAt),
            status: mapStatus(task.status),
            hasStartFact: !!task.startedAt,
            hasEndFact: !!task.executedAt,
            rawStartDate: task.startDate
        };
    };
    
    const sortByStartDate = (a: Task, b: Task) => {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        
        return dateA.getTime() - dateB.getTime();
    };
    
    const sortedPreInvestTasks = [...preInvestTasks].sort(sortByStartDate);
    const sortedInvestTasks = [...investTasks].sort(sortByStartDate);
    const sortedPostInvestTasks = [...postInvestTasks].sort(sortByStartDate);
    
    return {
        preInvestStages: sortedPreInvestTasks.map(mapTaskToViewModel),
        investStages: sortedInvestTasks.map(mapTaskToViewModel),
        postInvestStages: sortedPostInvestTasks.map(mapTaskToViewModel)
    };
};


const { preInvestStages, investStages, postInvestStages } = processProjectStagesData(currentProjectPopup.value);


const isExploitationComplete = () => {
    const allStages = [...preInvestStages, ...investStages, ...postInvestStages];
    const exploitationTask = allStages.find(task => 
        task.task && task.task.toLowerCase().includes('ввод в эксплуатацию') && 
        (task.status === 'Завершено' || task.status === 'DONE' || 
         task.status === 'В процессе' || task.status === 'IN_PROGRESS')
    );
    return !!exploitationTask;
}

const isSMRActiveOrComplete = () => {
    const allStages = [...preInvestStages, ...investStages, ...postInvestStages];
    const smrTask = allStages.find(task => 
        task.task && (
            task.task.toLowerCase().includes('смр') || 
            task.task.toLowerCase().includes('строительно-монтажные работы')
        ) && 
        (task.status === 'Завершено' || task.status === 'DONE' || 
         task.status === 'В процессе' || task.status === 'IN_PROGRESS')
    );
    return !!smrTask;
}

const getExploitationYear = () => {
    if (currentProjectPopup.value.project_exploitation_date) {
        return new Date(currentProjectPopup.value.project_exploitation_date).getFullYear();
    }
    
    return new Date().getFullYear();
}

const permanentChartOptions = {
    chart: {
        type: 'area',
        backgroundColor: 'transparent',
    },
    title: {
        text: '',
    },
    xAxis: {
        categories: isExploitationComplete() 
            ? currentProjectPopup.value.fact_year_value.filter(
                (year: number) => year >= getExploitationYear()
              )
            : currentProjectPopup.value.fact_year_value.filter(
                (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
              ),
        labels: {
            style: {
                color: '#fff'
            }
        },
        lineColor: '#555'
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
                    const firstYearToShow = isExploitationComplete() ? getExploitationYear() : 
                        new Date(currentProjectPopup.value.project_start_date).getFullYear();
                    
                    const firstYearIndex = currentProjectPopup.value.fact_year_value.findIndex(
                        (year: number) => year >= firstYearToShow
                    );
                    
                    const firstYearValue = currentProjectPopup.value.fact_count_value[firstYearIndex] || 0;
                    const currentValue = point.y;
                    const difference = currentValue - firstYearValue;
                    
                    let differenceText = '';
                    if (difference !== 0) {
                        differenceText = difference < 0 ? difference.toString() : '+' + difference;
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
        data: isExploitationComplete()
            ? currentProjectPopup.value.fact_count_value.filter(
                (_: unknown, index: number): boolean => 
                    currentProjectPopup.value.fact_year_value[index] >= getExploitationYear()
              )
            : currentProjectPopup.value.fact_count_value.filter(
                (_: unknown, index: number): boolean => 
                    currentProjectPopup.value.fact_year_value[index] >= 
                    new Date(currentProjectPopup.value.project_start_date).getFullYear()
              ),
        color: '#3090E8',
    }, {
        name: 'Плановые рабочие места',
        type: 'line',
        data: isExploitationComplete()
            ? Array(currentProjectPopup.value.fact_year_value.filter(
                (year: number) => year >= getExploitationYear()
              ).length).fill(
                currentProjectPopup.value.work_places + 
                (currentProjectPopup.value.fact_count_value[
                    currentProjectPopup.value.fact_year_value.findIndex(
                        (year: number) => year >= getExploitationYear()
                    )
                ] || 0)
              )
            : Array(currentProjectPopup.value.fact_year_value.filter(
                (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
              ).length).fill(
                currentProjectPopup.value.work_places + 
                (currentProjectPopup.value.fact_count_value[
                    currentProjectPopup.value.fact_year_value.findIndex(
                        (year: number) => year >= new Date(currentProjectPopup.value.project_start_date).getFullYear()
                    )
                ] || 0)
              ),
        color: '#B85DDA',
        dashStyle: 'solid',
        lineWidth: 2
    }, {
        name: 'Качественные рабочие места',
        type: 'line',
        data: calculateKrmValues(
            isExploitationComplete()
                ? currentProjectPopup.value.fact_count_value.filter(
                    (_: unknown, index: number): boolean => 
                        currentProjectPopup.value.fact_year_value[index] >= getExploitationYear()
                  )
                : currentProjectPopup.value.fact_count_value.filter(
                    (_: unknown, index: number): boolean => 
                        currentProjectPopup.value.fact_year_value[index] >= 
                        new Date(currentProjectPopup.value.project_start_date).getFullYear()
                  ),
            currentProjectPopup.value.cnt_krm || 0
        ),
        color: '#FF9B42',
        dashStyle: 'shortdot',
        lineWidth: 2
    }]
}

</script>