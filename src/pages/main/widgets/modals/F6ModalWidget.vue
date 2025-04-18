<template>
    <a-modal
      :footer="null"
      class="p-0"
      width="100%"
      height="100%"
      :closable="false"
      :centered="true"
      :visible="visible"
    >
      <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
        <a-spin />
      </div>
  
      <BaseCard
        v-else
        title="Трудовые ресурсы"
        number="F6"
        :show-close-button="true"
        @close="$emit('close')"
        class="text-white"
      >
      
      <div class="flex justify-around mb-4">
        <div class="text-xl font-semibold">ИНВЕСТПРОЕКТ</div>
        <div class="text-xl font-semibold">ТиПО</div>
      </div>

      <div class="flex space-x-6 mb-6 h-[calc(40vh)]">
        
        <div class="w-1/2">
          <div class="grid grid-cols-3 text-sm mb-2">
            <div class="font-medium">Наименование инвестпроекта</div>
            <div class="font-medium">Профессия</div>
            <div class="font-medium text-center">Кол-во</div>
          </div>

          <div class="max-h-[400px] overflow-y-auto">
            <div v-for="(item, index) in investProjects" :key="index" class="grid grid-cols-3 text-sm py-2">
              <div>{{ item.name }}</div>
              <div>{{ item.profession }}</div>
              <div class="text-center relative">
                {{ item.count }}
                <div class="absolute right-4 top-0 px-2 py-0.5 text-white text-xs rounded"
                  :class="item.percent >= 70 ? 'bg-\[\#00ca72\]' : 'bg-\[\#ff3b30\]'">
                  {{ item.percent }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="w-1/2">
          <div class="grid grid-cols-3 text-sm mb-2">
            <div class="font-medium">Наименование ТиПО</div>
            <div class="font-medium">Специальность</div>
            <div class="font-medium text-center">Кол-во</div>
          </div>

          <div class="max-h-[400px] overflow-y-auto">
            <div v-for="(item, index) in tipoItems" :key="index" class="grid grid-cols-3 text-sm py-2">
              <div>{{ item.name }}</div>
              <div>{{ item.specialty }}</div>
              <div class="text-center">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
     

      <div class="map h-[calc(45vh)] relative">
       
        <div v-if="!!currentRegion"
          class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
          @click="() => {
            if (!!currentRaion) {
              aStore.setCurrentRaion(null);
              return;
            }
            currentRegion = null;
            aStore.setCurrentRaion(null);
          }">
          <CloseOutlined />
        </div>
        
       
        <BaseMap v-if="!currentRegion" class="h-full" :current-region="undefined" :zoom="4" :fill-color="(v: string) => {
          if (!groupByRegion[v]) {
            return '#222732'
          }

          if (currentTypeKey === 'project_duration') {
            return getColorFromGradient((groupByRegion[v].sroki_dolg + groupByRegion[v].sroki_krat + groupByRegion[v].sroki_sred) / (sroki || 1) * 100, false, false, 10)
          }

          if (currentTypeKey === 'percentage_risk_region') {
            const _color = getColorFromGradient((groupByRegion[v].risk_vysok + groupByRegion[v].risk_sred) / (risk || 1) * 100, true, false, 10)
            return _color === '#222732' ? '#059669' : _color
          }

          const _gradientBlue = ['count', 'project_price', 'project_duration', 'act_exploitation'].includes(currentTypeKey || '')
          const sum = SumValues[currentTypeKey || ''] || 1
          return getColorFromGradient(groupByRegion[v][currentTypeKey || ''] / sum * 100, false, _gradientBlue, 10)
        }" @click-polygon="clickPolygon" v-slot="slotProps">
          <div class="flex">
            <p>Регион: </p>
            <p class="font-bold">{{ slotProps.data.region }}</p>
          </div>
          <template v-if="currentTypeKey === 'percentage_risk_region'">
            <div class="flex">
              <p>Отсутствует: </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.risk_otsut) }}</p>
            </div>
            <div class="flex">
              <p>Высокий: </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.risk_vysok) }}</p>
            </div>
            <div class="flex">
              <p>Средний: </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.risk_sred) }}</p>
            </div>
          </template>
          <template v-else-if="currentTypeKey === 'project_duration'">
            <div class="flex">
              <p>Краткосрочные (0-5 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.sroki_dolg) }}</p>
            </div>
            <div class="flex">
              <p>Среднесрочные (6-10 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.sroki_sred) }}</p>
            </div>
            <div class="flex">
              <p>Долгосрочные (11-20 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.sroki_krat) }}</p>
            </div>
          </template>
          <div class="flex" v-else>
            <p>{{listLabels.find((item) => item.key === currentTypeKey)?.name}}: </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.id_reg]?.[currentTypeKey || '']) }}</p>
          </div>
        </BaseMap>

      
        <BaseMapRegion v-else class="h-full" :current-region="currentRegion as number" :current-raion="currentRaion as number" :zoom="6"
          :fill-color="(v: string) => {
            if (!groupByRaion[v]) {
              return '#222732'
            }

            if (currentTypeKey === 'project_duration') {
              return getColorFromGradient((groupByRaion[v].sroki_dolg + groupByRaion[v].sroki_krat + groupByRaion[v].sroki_sred) / (sroki || 1) * 100, false, false, 10)
            }

            if (currentTypeKey === 'percentage_risk_region') {
              if (groupByRaion[v].risk_vysok + groupByRaion[v].risk_sred + groupByRaion[v].risk_otsut === 0) return '#222732'
              const _color = getColorFromGradient((groupByRaion[v].risk_vysok + groupByRaion[v].risk_sred) / (risk || 1) * 100, true, false, 10)
              return _color === '#222732' ? '#059669' : _color
            }

            const _gradientBlue = ['count', 'project_price', 'project_duration', 'act_exploitation'].includes(currentTypeKey || '')
            const sum = SumValues[currentTypeKey || ''] || 1
            return getColorFromGradient(groupByRaion[v][currentTypeKey || ''] / sum * 100, false, _gradientBlue, 10)
          }" @click-polygon="(code: string) => aStore.setCurrentRaion(+code)" v-slot="slotProps">
          <div class="flex">
            <p>Район: </p>
            <p class="font-bold">{{ slotProps.data.region }}, {{ slotProps.data.raion }}</p>
          </div>
          <template v-if="currentTypeKey === 'percentage_risk_region'">
            <div class="flex">
              <p>Отсутствует: </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.risk_otsut) }}</p>
            </div>
            <div class="flex">
              <p>Высокий: </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.risk_vysok) }}</p>
            </div>
            <div class="flex">
              <p>Средний: </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.risk_sred) }}</p>
            </div>
          </template>
          <template v-else-if="currentTypeKey === 'project_duration'">
            <div class="flex">
              <p>Краткосрочные (0-5 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.sroki_dolg) }}</p>
            </div>
            <div class="flex">
              <p>Среднесрочные (6-10 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.sroki_sred) }}</p>
            </div>
            <div class="flex">
              <p>Долгосрочные (11-20 лет): </p>
              <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.sroki_krat) }}</p>
            </div>
          </template>
          <div class="flex" v-else>
            <p>{{listLabels.find((item) => item.key === currentTypeKey)?.name}}: </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.id_rai]?.[currentTypeKey || '']) }}</p>
          </div>
        </BaseMapRegion>
      </div>
      </BaseCard>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  import BaseMap from '../../../../shared/ui/BaseMap/BaseMap.vue';
  import BaseMapRegion from '../../../../shared/ui/BaseMap/BaseMapRegion.vue';
  import { useAStore } from '../../../a_block/store';
  import { Numeral } from '../../../../shared/helpers/numeral';
  import { storeToRefs } from 'pinia';
  import { getColorFromGradient } from '../../../../shared/helpers/gradientColors';
  import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
  import { CloseOutlined } from '@ant-design/icons-vue';
  
  const props = defineProps<{
    visible: boolean;
  }>();
  
  defineEmits(['close']);
  
  const loader = ref(false);
  const aStore = useAStore();
  const { currentRegion, currentRaion, a1FilterByProject, currentTypeKey } = storeToRefs(aStore);
  
  // Моковые данные для таблиц
  const investProjects = ref([
    { name: 'Строительство нового ГПЗ', profession: 'Инженер', count: 7, percent: 32 },
    { name: 'Переработка зерна', profession: 'Агроном', count: 12, percent: 74 },
    { name: 'Строительство нового ГПЗ', profession: 'Инженер', count: 7, percent: 32 },
    { name: 'Переработка зерна', profession: 'Агроном', count: 12, percent: 74 },
    { name: 'Строительство нового ГПЗ', profession: 'Инженер', count: 7, percent: 32 },
    { name: 'Переработка зерна', profession: 'Агроном', count: 12, percent: 74 },
    { name: 'Строительство нового ГПЗ', profession: 'Инженер', count: 7, percent: 32 },
    { name: 'Переработка зерна', profession: 'Агроном', count: 12, percent: 74 },
  ]);
  
  const tipoItems = ref([
    { name: 'Политехнический колледж', specialty: 'Токарь', count: 2 },
    { name: 'Агроколледж', specialty: 'Технолог', count: 10 },
    { name: 'Политехнический колледж', specialty: 'Токарь', count: 2 },
    { name: 'Агроколледж', specialty: 'Технолог', count: 10 },
    { name: 'Политехнический колледж', specialty: 'Токарь', count: 2 },
    { name: 'Агроколледж', specialty: 'Технолог', count: 10 },
    { name: 'Политехнический колледж', specialty: 'Токарь', count: 2 },
    { name: 'Агроколледж', specialty: 'Технолог', count: 10 },
  ]);
  
  type ProjectItem = {
    id: string;
    project_price: number;
    work_places: number;
    plan_fot: number;
    ball_tip_name: string;
    duration_label: string;
    id_reg: string;
    id_rai: string;
    [key: string]: any;
  };
  
  const groupByProject = computed(() => {
    return Object.values(a1FilterByProject.value.reduce<Record<string, ProjectItem>>((acc, curr) => {
      acc[curr.id] = { ...curr };
      return acc;
    }, {}));
  });
  
  const project_price = computed(() => {
    return groupByProject.value.reduce<number>((acc, curr) => acc + curr.project_price, 0);
  });
  
  const work_places = computed(() => {
    return groupByProject.value.reduce<number>((acc, curr) => acc + curr.work_places, 0);
  });
  
  const plan_fot = computed(() => {
    return groupByProject.value.reduce<number>((acc, curr) => acc + curr.plan_fot, 0);
  });
  
  const risk = computed(() => {
    return groupByProject.value.reduce<number>((acc, curr) => {
      if (['Не определено', 'Отсутствует'].includes(curr.ball_tip_name)) return acc;
      return acc + 1;
    }, 0);
  });
  
  const sroki = computed(() => {
    return groupByProject.value.reduce<number>((acc, curr) => {
      acc += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
      acc += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
      acc += curr.duration_label.includes('Краткосрочные') ? 1 : 0;
      return acc;
    }, 0);
  });
  
  const project_duration = computed(() => {
    return groupByProject.value.reduce<Record<string, number>>((acc, curr) => {
      if (acc[curr.duration_label])
        acc[curr.duration_label] += 1;
      else
        acc[curr.duration_label] = 1;
      return acc;
    }, {});
  });
  
  const percentage_risk_region = computed(() => {
    return groupByProject.value.reduce<Record<string, number>>((acc, curr) => {
      if (['Не определено'].includes(curr.ball_tip_name)) return acc;
      if (acc[curr.ball_tip_name])
        acc[curr.ball_tip_name] += 1;
      else
        acc[curr.ball_tip_name] = 1;
      return acc;
    }, {});
  });
  
  interface SumValuesType {
    count: number;
    project_price: number;
    work_places: number;
    plan_fot: number;
    project_duration: Record<string, number>;
    percentage_risk_region: Record<string, number>;
    [key: string]: any;
  }
  
  const SumValues = computed<SumValuesType>(() => {
    return {
      count: groupByProject.value.length,
      project_price: project_price.value,
      work_places: work_places.value,
      plan_fot: plan_fot.value,
      project_duration: project_duration.value,
      percentage_risk_region: percentage_risk_region.value,
    };
  });
  
  const listLabels = computed(() => [
    { name: 'Инвестпроекты', icon: '/img/m1-4.png', percent: 0, key: 'count', value: groupByProject.value.length },
    { name: 'Инвестиции', icon: '/img/m1-4.png', percent: 0, key: 'project_price', value: project_price.value },
    { name: 'Рабочие места', icon: '/img/m1-2.png', percent: 0, key: 'work_places', value: work_places.value },
    { name: 'ФОТ', icon: '/img/m2-1.png', percent: 0, key: 'plan_fot', value: plan_fot.value },
    { name: 'Сроки', icon: '/img/m1-4.png', percent: 0, key: 'project_duration', value: project_duration.value },
    { name: 'Трудовой риск', icon: '/img/m1-3.png', percent: 0, key: 'percentage_risk_region', value: percentage_risk_region.value },
  ]);
  
  const clickPolygon = (code: string) => {
    currentRegion.value = +code;
  };
  
  type RegionData = ProjectItem & {
    count: number;
    sroki_dolg: number;
    sroki_sred: number;
    sroki_krat: number;
    risk_otsut: number;
    risk_vysok: number;
    risk_sred: number;
  };
  
  const groupByRegion = computed(() => {
    return a1FilterByProject.value.reduce<Record<string, RegionData>>((acc, curr) => {
      if (!acc[curr.id_reg]) {
        acc[curr.id_reg] = {
          ...curr,
          count: 1,
          sroki_dolg: curr.duration_label.includes('Долгосрочные') ? 1 : 0,
          sroki_sred: curr.duration_label.includes('Среднесрочные') ? 1 : 0,
          sroki_krat: curr.duration_label.includes('Краткосрочные') ? 1 : 0,
          risk_otsut: curr.ball_tip_name.includes('Отсутствует') ? 1 : 0,
          risk_vysok: curr.ball_tip_name.includes('Высокий') ? 1 : 0,
          risk_sred: curr.ball_tip_name.includes('Средний') ? 1 : 0,
        };
        return acc;
      }
  
      acc[curr.id_reg].project_price += curr.project_price;
      acc[curr.id_reg].work_places += curr.work_places;
      acc[curr.id_reg].plan_fot += curr.plan_fot;
      acc[curr.id_reg].count += 1;
  
      acc[curr.id_reg].sroki_dolg += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
      acc[curr.id_reg].sroki_sred += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
      acc[curr.id_reg].sroki_krat += curr.duration_label.includes('Краткосрочные') ? 1 : 0;
  
      acc[curr.id_reg].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
      acc[curr.id_reg].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
      acc[curr.id_reg].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;
  
      return acc;
    }, {});
  });
  
  const groupByRaion = computed(() => {
    return a1FilterByProject.value.reduce<Record<string, RegionData>>((acc, curr) => {
      if (!acc[curr.id_rai]) {
        acc[curr.id_rai] = {
          ...curr,
          count: 1,
          sroki_dolg: curr.duration_label.includes('Долгосрочные') ? 1 : 0,
          sroki_sred: curr.duration_label.includes('Среднесрочные') ? 1 : 0,
          sroki_krat: curr.duration_label.includes('Краткосрочные') ? 1 : 0,
          risk_otsut: curr.ball_tip_name.includes('Отсутствует') ? 1 : 0,
          risk_vysok: curr.ball_tip_name.includes('Высокий') ? 1 : 0,
          risk_sred: curr.ball_tip_name.includes('Средний') ? 1 : 0,
        };
        return acc;
      }
  
      acc[curr.id_rai].project_price += curr.project_price;
      acc[curr.id_rai].work_places += curr.work_places;
      acc[curr.id_rai].plan_fot += curr.plan_fot;
      acc[curr.id_rai].count += 1;
  
      acc[curr.id_rai].sroki_dolg += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
      acc[curr.id_rai].sroki_sred += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
      acc[curr.id_rai].sroki_krat += curr.duration_label.includes('Краткосрочные') ? 1 : 0;
  
      acc[curr.id_rai].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
      acc[curr.id_rai].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
      acc[curr.id_rai].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;
  
      return acc;
    }, {});
  });
  </script>
  
  <style scoped>
  .bg-\[\#00ca72\] {
    background-color: #00ca72;
  }
  
  .bg-\[\#ff3b30\] {
    background-color: #ff3b30;
  }
  </style>
  