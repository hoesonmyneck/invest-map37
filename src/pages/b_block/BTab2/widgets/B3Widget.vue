<template>
  <div class="text-white">
    <BaseCard
      title="«ДИПЛОММЕН АУЫЛҒА»"
      number="A3"
      :show-close-button="false"
      @close="$emit('close')"
    >
      <template v-slot:actions>
        <div class="flex gap-1">
          <p @click="openFullScreenModal" class="btn mini flex items-center">
            <FullscreenOutlined />
          </p>
        </div>
      </template>
      <div class="grid grid-cols-[200px_1fr] gap-2 items-center p-3 px-5">
        <div class="relative flex items-center justify-center">
          <highcharts :options="chart" class="h-[170px] m-auto"></highcharts>
          <p class="absolute text-2xl font-bold">
            {{ ((rabotaet_aul / total) * 100).toFixed(0) }}%
          </p>
        </div>
        <ul>
          <li
            class="grid grid-cols-[40px_1fr_80px_70px] w-full mb-2 pb-2 border-b border-gray-700"
          >
            <img class="w-4" src="/images/a_block/img_1.png" alt="" />
            <p class="text-[10px]">Участники</p>
            <p class="text-[10px]">{{ Numeral(total) }}</p>
            <p class="text-[10px] text-end">{{ Numeral((total / totalBeforeFilter) * 100) }}%</p>
          </li>

          <li
            v-for="(l, i) in listDiplommenAulga"
            class="grid text-gray-400 grid-cols-[40px_1fr_80px_70px] w-full mb-4"
          >
            <img class="w-4" :src="`/images/a_block/a2_${i + 1}.png`" alt="" />
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ l.name }}</p>
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ Numeral(l.count) }}</p>
            <p
              class="text-[10px] p-1 bg-gray-800 rounded-lg w-full px-3 text-center"
            >
              {{ +l.percent.toFixed(2) }}%
            </p>
          </li>
        </ul>
      </div>
    </BaseCard>

    <!-- Модальное окно для полноэкранного режима -->
    <a-modal 
      v-model:visible="isFullScreenModalVisible" 
      :footer="null" 
      class="fullscreen-modal" 
      width="80%" 
      :centered="true"
      :closable="false"
    >
      <BaseCard
        title="«ДИПЛОММЕН АУЫЛҒА»"
        number="A3"
        :show-close-button="true"
        @close="closeFullScreenModal"
        class="h-full text-white"
      >
        <div class="flex justify-between items-center mb-2 px-8 mt-6">
          <h3 class="text-lg font-bold">Информация о программе</h3>
          <a-button 
            type="primary" 
            class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            @click="downloadExcel"
          >
            <DownloadOutlined />
            <span>Скачать в Excel</span>
          </a-button>
        </div>

        <div class="grid grid-cols-[300px_1fr] gap-6 items-center p-5 px-8">
          <div class="relative flex items-center justify-center">
            <highcharts :options="chart" class="h-[300px] m-auto"></highcharts>
            <p class="absolute text-4xl font-bold">
              {{ ((rabotaet_aul / total) * 100).toFixed(0) }}%
            </p>
          </div>
          <ul class="modal-list">
            <li
              class="grid grid-cols-[60px_1fr_120px_100px] w-full mb-4 pb-3 border-b border-gray-700"
            >
              <img class="w-6" src="/images/a_block/img_1.png" alt="" />
              <p class="text-base">Участники</p>
              <p class="text-base">{{ Numeral(total) }}</p>
              <p class="text-base text-end">{{ Numeral((total / totalBeforeFilter) * 100) }}%</p>
            </li>

            <li
              v-for="(l, i) in listDiplommenAulga"
              class="grid text-gray-400 grid-cols-[60px_1fr_120px_100px] w-full mb-4"
            >
              <img class="w-6" :src="`/images/a_block/a2_${i + 1}.png`" alt="" />
              <p 
                class="text-base text-white cursor-pointer hover:text-blue-400"
                @click="showIinPopup(l)"
              >{{ l.name }}</p>
              <p 
                class="text-base text-white cursor-pointer hover:text-blue-400"
                @click="showIinPopup(l)"
              >{{ Numeral(l.count) }}</p>
              <p
                class="text-base text-white p-2 bg-gray-800 rounded-lg w-full px-4 text-center"
              >
                {{ +l.percent.toFixed(2) }}%
              </p>
            </li>
          </ul>
        </div>
      </BaseCard>
    </a-modal>

    <IinPopupWidget
      v-if="showPopup"
      :visible="showPopup"
      :iins="selectedCategory ? programStore.getIinsByCategory('diplommenAulga', selectedCategory.key) : []"
      :names="selectedCategory ? programStore.getNamesByCategory('diplommenAulga', selectedCategory.key) : []"
      :addresses="selectedCategory ? programStore.getAddressesByCategory('diplommenAulga', selectedCategory.key) : []"
      :supports="selectedCategory ? programStore.getSupportsByCategory('diplommenAulga', selectedCategory.key) : []"
      :credits="selectedCategory ? programStore.getCreditsByCategory('diplommenAulga', selectedCategory.key) : []"
      :title="`«ДИПЛОММЕН АУЫЛҒА» - ${selectedCategory ? selectedCategory.name : ''}`"
      :category-name="selectedCategory ? selectedCategory.name : ''"
      @close="showPopup = false"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getDiplommenAulga } from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { chartOptions } from "../helpers/chartOption";
import IinPopupWidget from "./IinPopupWidget.vue";
import { FullscreenOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { exportToExcel } from "../../../../shared/helpers/excelExport";

const programStore = useProgramStore();
const { diplommenAulgaFilter, diplommenAulga } = storeToRefs(programStore);

const showPopup = ref(false);
const selectedCategory = ref<{ name: string, key: string } | null>(null);
const isFullScreenModalVisible = ref(false);

const openFullScreenModal = () => {
  isFullScreenModalVisible.value = true;
};

const closeFullScreenModal = () => {
  isFullScreenModalVisible.value = false;
};

const totalBeforeFilter = computed(() =>
  diplommenAulga.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const rabotaet_aul = computed(() =>
  diplommenAulgaFilter.value.reduce(
    (acc, curr) => +acc + +(curr.rabotaet_aul || 0),
    0
  )
);
const bezrabot = computed(() =>
  diplommenAulgaFilter.value.reduce(
    (acc, curr) => +acc + +(curr.bezrabot || 0),
    0
  )
);
const total = computed(() =>
  diplommenAulgaFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const listDiplommenAulga = computed(() => [
  {
    name: "Работающие в селе",
    key: "rabotaet_aul",
    count: rabotaet_aul.value,
    percent: (rabotaet_aul.value / total.value) * 100,
  },
  {
    name: "Безработные",
    key: "bezrabot",
    count: bezrabot.value,
    percent: (bezrabot.value / total.value) * 100,
  },
]);

function showIinPopup(category: { name: string, key: string, count: number, percent: number }) {
  selectedCategory.value = category;
  showPopup.value = true;
}

function downloadExcel() {
  const excelData = listDiplommenAulga.value.map(item => ({
    'Категория': item.name,
    'Количество': item.count,
    'Процент': `${+item.percent.toFixed(2)}%`
  }));
  
  excelData.push({
    'Категория': 'Всего участников',
    'Количество': total.value,
    'Процент': '100%'
  });
  
  exportToExcel(excelData, 'Дипломмен_Ауылға_данные', 'Дипломмен Ауылға');
}

const chart = computed(() =>
  chartOptions(
    [
      "Общее количество",
      "Работающие",
      "Безработные",
      "В других регионах",
      "На юге Казахстана",
    ],
    [
      {
        name: "Исполняющие",
        data: [(rabotaet_aul.value / total.value) * 100],
        color: "#3090E8",
      },
      {
        name: "",
        data: [100 - (rabotaet_aul.value / total.value) * 100],
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

:deep(.fullscreen-modal) {
  width: 100vw !important;
  max-width: 100vw !important;
  top: 0 !important;
  height: 100vh !important;
  margin: 0;
  padding: 0;
  
  .ant-modal-content {
    height: 100vh;
    padding: 0;
    margin: 0;
    border-radius: 0;
  }
  
  .ant-modal-body {
    height: 100vh;
    padding: 0;
    margin: 0;
  }
}

.modal-list {
  min-height: 400px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
