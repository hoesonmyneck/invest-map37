<template>
  <div class="relative text-white">
    <div class="flex mb-10">
      <ul class="top-1 left-5 flex gap-1 text-xs">
        <template v-for="item in listLabels" :key="item.name">
          <!--  Трудовой риск  -->
          <li v-if="item.key === 'project_duration'" class="btn mini block h-max"
            @click="aStore.setCurrentTypeKey(item.key)" :class="{ active: item.key === currentTypeKey }">
            <p class="">{{ item.name }}</p>
            <ul class="items-center gap-2 pt-1 pt-1 mt-1 pt-1 border-t border-gray-600"
              v-if="item.key === currentTypeKey">
              <li class="mb-1 flex items-center gap-2 justify-between"
                v-for="(s, idx) in Object.entries(project_duration)" :key="s[0]">
                <span class="flex gap-2 items-center">
                  <div class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: idx === 0 ? '#1de272' : idx === 1 ? '#544fc5' : '#2caffe' }"></div>
                  {{ s[0] }}
                </span> <span>{{ s[1] }}</span>
              </li>
            </ul>
          </li>

          <!--  Трудовой риск  -->
          <li v-else-if="item.key === 'percentage_risk_region'" class="btn mini block h-max"
            @click="aStore.setCurrentTypeKey(item.key)" :class="{ active: item.key === currentTypeKey }">
            <p class="">{{ item.name }}</p>
            <ul class="items-center gap-2 pt-1 mt-1 pt-1 border-t border-gray-600" v-if="item.key === currentTypeKey">
              <li class="mb-1 flex items-center gap-2 justify-between"
                v-for="(s, idx) in Object.entries(percentage_risk_region)" :key="s[0]">
                <span class="flex gap-2 items-center">
                  <div class="w-2 h-2 rounded-full"
                    :class="{ 'bg-red-500': idx === 1, 'bg-yellow-500': idx === 2, 'bg-green-500': idx === 0 }"></div>
                  {{ s[0] }}
                </span> <span>{{ s[1] }}</span>
              </li>
            </ul>
          </li>

          <!--  Остальные  -->
          <li v-else class="btn mini block h-max" @click="!item.key || aStore.setCurrentTypeKey(item.key)"
            :class="{ active: item.key === currentTypeKey }">
            <p class="mb-1 pb-1 border-b border-gray-600">{{ item.name }}</p>
            <p class="text-xs">{{ Numeral(item?.value) }}</p>
          </li>
        </template>
      </ul>
      <div v-if="!!currentRegion"
        class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
        @click="() => {
          if (!!currentRaion) {
            aStore.setCurrentRaion(null)
            return
          }
          currentRegion = null
          aStore.setCurrentRaion(null)
        }">
        <CloseOutlined />
      </div>
    </div>
    <div class="map h-[calc(45vh)]">
      <!-- Global Map -->
      <BaseMap v-if="!currentRegion" class="h-full" :current-region="currentRegion" :zoom="4" :fill-color="(v) => {
        if (!groupByRegion[v]) {
          return '#222732'
        }

        if (currentTypeKey === 'project_duration') {
          return getColorFromGradient((groupByRegion[v].sroki_dolg + groupByRegion[v].sroki_krat + groupByRegion[v].sroki_sred) / sroki * 100, false, false, 10)
        }

        if (currentTypeKey === 'percentage_risk_region') {
          const _color = getColorFromGradient((groupByRegion[v].risk_vysok + groupByRegion[v].risk_sred) / risk * 100, true, false, 10)
          return _color === '#222732' ? '#059669' : _color
        }

        const _gradientBlue = ['count', 'project_price', 'project_duration', 'act_exploitation'].includes(currentTypeKey)
        return getColorFromGradient(groupByRegion[v][currentTypeKey] / SumValues[currentTypeKey] * 100, false, _gradientBlue, 10)
      }" @click-polygon="clickPolygon" v-slot="slotProps">
        <div class="flex">
          <p>Регион: </p>
          <p class="font-bold">{{ slotProps.data.region }}</p>
        </div>
        <template v-if="currentTypeKey === 'percentage_risk_region'">
          <div class="flex">
            <p>Отсутствует: </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.risk_otsut) }}</p>
          </div>
          <div class="flex">
            <p>Высокий: </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.risk_vysok) }}</p>
          </div>
          <div class="flex">
            <p>Средний: </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.risk_sred) }}</p>
          </div>
        </template>
        <template v-else-if="currentTypeKey === 'project_duration'">
          <div class="flex">
            <p>Краткосрочные (0-5 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.sroki_dolg) }}</p>
          </div>
          <div class="flex">
            <p>Среднесрочные (6-10 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.sroki_sred) }}</p>
          </div>
          <div class="flex">
            <p>Долгосрочные (11-20 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.sroki_krat) }}</p>
          </div>
        </template>
        <div class="flex" v-else>
          <p>{{listLabels.find((item) => item.key === currentTypeKey)?.name}}: </p>
          <p class="font-bold">{{ Numeral(groupByRegion[slotProps.data.parent1_code]?.[currentTypeKey]) }}</p>
        </div>
      </BaseMap>

      <!-- Region Map -->
      <BaseMapRegion v-else class="h-full" :current-region="currentRegion" :current-raion="currentRaion" :zoom="getRegionZoom(currentRegion)"
        :fill-color="(v) => {
          if (!groupByRaion[v]) {
            return '#222732'
          }

          if (currentTypeKey === 'project_duration') {
            return getColorFromGradient((groupByRaion[v].sroki_dolg + groupByRaion[v].sroki_krat + groupByRaion[v].sroki_sred) / sroki * 100, false, false, 10)
          }

          if (currentTypeKey === 'percentage_risk_region') {
            if (groupByRaion[v].risk_vysok + groupByRaion[v].risk_sred + groupByRaion[v].risk_otsut === 0) return '#222732'
            const _color = getColorFromGradient((groupByRaion[v].risk_vysok + groupByRaion[v].risk_sred) / risk * 100, true, false, 10)
            return _color === '#222732' ? '#059669' : _color
          }

          const _gradientBlue = ['count', 'project_price', 'project_duration', 'act_exploitation'].includes(currentTypeKey)
          return getColorFromGradient(groupByRaion[v][currentTypeKey] / SumValues[currentTypeKey] * 100, false, _gradientBlue, 10)
        }" @click-polygon="aStore.setCurrentRaion" v-slot="slotProps">
        <div class="flex">
          <p>Район: </p>
          <p class="font-bold">{{ slotProps.data.region }}, {{ slotProps.data.raion }}</p>
        </div>
        <template v-if="currentTypeKey === 'percentage_risk_region'">
          <div class="flex">
            <p>Отсутствует: </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.risk_otsut) }}</p>
          </div>
          <div class="flex">
            <p>Высокий: </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.risk_vysok) }}</p>
          </div>
          <div class="flex">
            <p>Средний: </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.risk_sred) }}</p>
          </div>
        </template>
        <template v-else-if="currentTypeKey === 'project_duration'">
          <div class="flex">
            <p>Краткосрочные (0-5 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.sroki_dolg) }}</p>
          </div>
          <div class="flex">
            <p>Среднесрочные (6-10 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.sroki_sred) }}</p>
          </div>
          <div class="flex">
            <p>Долгосрочные (11-20 лет): </p>
            <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.sroki_krat) }}</p>
          </div>
        </template>
        <div class="flex" v-else>
          <p>{{listLabels.find((item) => item.key === currentTypeKey)?.name}}: </p>
          <p class="font-bold">{{ Numeral(groupByRaion[slotProps.data.parent2_code]?.[currentTypeKey]) }}</p>
        </div>
      </BaseMapRegion>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseMap from '../../../shared/ui/BaseMap/BaseMap.vue';
import { useAStore } from '../store';
import { Numeral } from '../../../shared/helpers/numeral';
import { storeToRefs } from 'pinia';
import { CloseOutlined } from '@ant-design/icons-vue';
import { getColorFromGradient } from '../../../shared/helpers/gradientColors';
import BaseMapRegion from '../../../shared/ui/BaseMap/BaseMapRegion.vue';

const aStore = useAStore();
const { currentRegion, currentRaion, a1FilterByProject, currentTypeKey } = storeToRefs(aStore);

const groupByProject = computed(() => Object.values(a1FilterByProject.value.reduce((acc, curr) => {
  acc[curr.id] = { ...curr };
  return acc;
}, {})))

const project_price = computed(() => groupByProject.value.reduce((acc, curr) => acc + curr.project_price, 0));
const work_places = computed(() => groupByProject.value.reduce((acc, curr) => acc + curr.work_places, 0));
const plan_fot = computed(() => groupByProject.value.reduce((acc, curr) => acc + curr.plan_fot, 0));
const risk = computed(() => groupByProject.value.reduce((acc: any, curr: any) => {
  if (['Не определено', 'Отсутствует'].includes(curr.ball_tip_name)) return acc;

  return acc += 1;
}, 0));
const sroki = computed(() => groupByProject.value.reduce((acc: number, curr: any) => {
  acc += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
  acc += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
  acc += curr.duration_label.includes('Краткосрочные') ? 1 : 0;

  return acc
}, 0));

const project_duration = computed(() => groupByProject.value.reduce((acc, curr: any) => {
  if (acc[curr.duration_label])
    acc[curr.duration_label] += 1;
  else
    acc[curr.duration_label] = 1;

  return acc;
}, {}));

const percentage_risk_region = computed(() => groupByProject.value.reduce((acc: any, curr: any) => {
  if (['Не определено'].includes(curr.ball_tip_name)) return acc;

  if (acc[curr.ball_tip_name])
    acc[curr.ball_tip_name] += 1;
  else
    acc[curr.ball_tip_name] = 1;

  return acc;
}, {}));

const SumValues = computed(() => ({
  count: groupByProject.value.length,
  project_price: project_price.value,
  work_places: work_places.value,
  plan_fot: plan_fot.value,
  project_duration: project_duration.value,
  percentage_risk_region: percentage_risk_region.value,
}))

const listLabels = computed(() => [
  { name: 'Инвестпроекты', icon: '/img/m1-4.png', percent: 0, key: 'count', value: groupByProject.value.length },
  { name: 'Инвестиции', icon: '/img/m1-4.png', percent: 0, key: 'project_price', value: project_price.value },
  { name: 'Рабочие места', icon: '/img/m1-2.png', percent: 0, key: 'work_places', value: work_places.value },
  { name: 'ФОТ', icon: '/img/m2-1.png', percent: 0, key: 'plan_fot', value: plan_fot.value },
  { name: 'Сроки', icon: '/img/m1-4.png', percent: 0, key: 'project_duration', value: project_duration.value },
  { name: 'Трудовой риск', icon: '/img/m1-3.png', percent: 0, key: 'percentage_risk_region', value: percentage_risk_region.value },
  // { name: 'Этап проекта', icon: '/img/m1-4.png', },
]);

const clickPolygon = (code: string) => {
  currentRegion.value = +code;
}

const groupByRegion = computed(() => a1FilterByProject.value.reduce((acc, curr) => {
  if (!acc[curr.parent1_code]) {
    acc[curr.parent1_code] = {
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

  acc[curr.parent1_code].project_price += curr.project_price;
  acc[curr.parent1_code].work_places += curr.work_places;
  acc[curr.parent1_code].plan_fot += curr.plan_fot;
  acc[curr.parent1_code].count += 1;

  acc[curr.parent1_code].sroki_dolg += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
  acc[curr.parent1_code].sroki_sred += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
  acc[curr.parent1_code].sroki_krat += curr.duration_label.includes('Краткосрочные') ? 1 : 0;

  acc[curr.parent1_code].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
  acc[curr.parent1_code].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
  acc[curr.parent1_code].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;

  return acc;
}, {}))


const groupByRaion = computed(() => a1FilterByProject.value.reduce((acc, curr) => {
  if (!acc[curr.parent2_code]) {
    acc[curr.parent2_code] = {
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

  acc[curr.parent2_code].project_price += curr.project_price;
  acc[curr.parent2_code].work_places += curr.work_places;
  acc[curr.parent2_code].plan_fot += curr.plan_fot;
  acc[curr.parent2_code].count += 1;

  acc[curr.parent2_code].sroki_dolg += curr.duration_label.includes('Долгосрочные') ? 1 : 0;
  acc[curr.parent2_code].sroki_sred += curr.duration_label.includes('Среднесрочные') ? 1 : 0;
  acc[curr.parent2_code].sroki_krat += curr.duration_label.includes('Краткосрочные') ? 1 : 0;

  acc[curr.parent2_code].risk_otsut += curr.ball_tip_name.includes('Отсутствует') ? 1 : 0;
  acc[curr.parent2_code].risk_vysok += curr.ball_tip_name.includes('Высокий') ? 1 : 0;
  acc[curr.parent2_code].risk_sred += curr.ball_tip_name.includes('Средний') ? 1 : 0;

  return acc;
}, {}))

const getRegionZoom = (regionCode: number | null): number => {
  if (regionCode === null) return 6;
  
  // Города республиканского значения имеют больший зум
  if (
    regionCode === 710000000 || // Алматы
    regionCode === 750000000 || // Астана
    regionCode === 790000000    // Шымкент
  ) {
    return 10; 
  }
  
  return 6; // Стандартный зум для областей
}
</script>

<style scoped lang="scss"></style>