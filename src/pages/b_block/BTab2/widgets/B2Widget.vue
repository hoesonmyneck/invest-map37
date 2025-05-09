<template>
  <div class="text-white">
    <BaseCard
      title="«АУЫЛ АМАНАТЫ»"
      number="A2"
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
      <div class="grid grid-cols-[200px_1fr] gap-2 items-start p-3 px-5">
        <div class="relative flex items-center justify-center">
          <highcharts :options="chart" class="h-[170px] m-auto"></highcharts>
          <p class="absolute text-2xl font-bold">
            {{ Numeral((opv_has / total) * 100) }}%
          </p>
        </div>
        <ul class="overflow-scroll h-[180px]">
          <li
            class="grid grid-cols-[40px_1fr_80px_60px] w-full mb-2 pb-2 border-b border-gray-700"
          >
            <img class="w-4" src="/images/a_block/img_1.png" alt="" />
            <p class="text-[10px]">Участники</p>
            <p class="text-[10px]">{{ Numeral(total) }}</p>
            <p class="text-[10px] text-end">{{ Numeral((total / totalBeforeFilter) * 100) }}%</p>
          </li>

          <li
            v-for="(l, i) in listAulAmanati"
            class="grid text-gray-400 grid-cols-[40px_1fr_80px_60px] w-full mb-4"
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
              {{ Numeral(l.percent) }}%
            </p>
          </li>
        </ul>
      </div>
    </BaseCard>

    <a-modal 
      v-model:visible="isFullScreenModalVisible" 
      :footer="null" 
      class="fullscreen-modal" 
      width="80%" 
      :centered="true"
      :closable="false"
    >
      <BaseCard
        title="«АУЫЛ АМАНАТЫ»"
        number="A2"
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

        <div class="grid grid-cols-[300px_1fr] gap-6 items-start p-5 px-8">
          <div class="relative flex items-center justify-center">
            <highcharts :options="chart" class="h-[300px] m-auto"></highcharts>
            <p class="absolute text-4xl font-bold">
              {{ Numeral((opv_has / total) * 100) }}%
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
              v-for="(l, i) in listAulAmanati"
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
                {{ Numeral(l.percent) }}%
              </p>
            </li>
          </ul>
        </div>
      </BaseCard>
    </a-modal>

    <IinPopupWidget
      v-if="showPopup"
      :visible="showPopup"
      :iins="selectedCategory ? programStore.getIinsByCategory('aulAmanati', selectedCategory.key) : []"
      :names="selectedCategory ? programStore.getNamesByCategory('aulAmanati', selectedCategory.key) : []"
      :purposes="selectedCategory ? programStore.getPurposesByCategory('aulAmanati', selectedCategory.key) : []"
      :loan-purposes="selectedCategory ? programStore.getLoanPurposesByCategory('aulAmanati', selectedCategory.key) : []"
      :title="`«АУЫЛ АМАНАТЫ» - ${selectedCategory ? selectedCategory.name : ''}`"
      :category-name="selectedCategory ? selectedCategory.name : ''"
      @close="showPopup = false"
    />
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
import IinPopupWidget from "./IinPopupWidget.vue";
import { FullscreenOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { exportToExcel, exportToExcelMultiSheet } from "../../../../shared/helpers/excelExport";

const loader = ref(true);
const data = ref<any[]>([]);

const showPopup = ref(false);
const selectedCategory = ref<{ name: string, key: string } | null>(null);
const isFullScreenModalVisible = ref(false);

const openFullScreenModal = () => {
  isFullScreenModalVisible.value = true;
};

const closeFullScreenModal = () => {
  isFullScreenModalVisible.value = false;
};

const programStore = useProgramStore();
const { aulAmanatiFilter, aulAmanati } = storeToRefs(programStore);

const totalBeforeFilter = computed(() =>
  aulAmanati.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const srok_5 = computed(() =>
  aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.srok_5 || 0), 0)
);
const srok_7 = computed(() =>
  aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.srok_7 || 0), 0)
);
const active_ip = computed(() =>
  aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.active_ip || 0), 0)
);
const not_active = computed(() =>
  aulAmanatiFilter.value.reduce(
    (acc, curr) => +acc + +(curr.not_active || 0),
    0
  )
);
const opv_has = computed(() =>
  aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.opv_has || 0), 0)
);
const total = computed(() =>
  aulAmanatiFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const listAulAmanati = computed(() => [
  {
    name: "Срок до 5 лет",
    key: "srok_5",
    count: srok_5.value,
    percent: (srok_5.value / total.value) * 100,
  },
  {
    name: "Срок до 7 лет",
    key: "srok_7",
    count: srok_7.value,
    percent: (srok_7.value / total.value) * 100,
  },
  {
    name: "Активное ИП",
    key: "active_ip",
    count: active_ip.value,
    percent: (active_ip.value / total.value) * 100,
  },
  {
    name: "Неактивное ИП",
    key: "not_active",
    count: not_active.value,
    percent: (not_active.value / total.value) * 100,
  },
  {
    name: "Есть ОПВ",
    key: "opv_has",
    count: opv_has.value,
    percent: (opv_has.value / total.value) * 100,
  },
]);

function showIinPopup(category: { name: string, key: string, count: number, percent: number }) {
  selectedCategory.value = category;
  showPopup.value = true;
}

function downloadExcel() {
  const sheetsData = listAulAmanati.value.map(item => {
    const iins = programStore.getIinsByCategory('aulAmanati', item.key) || [];
    const names = programStore.getNamesByCategory('aulAmanati', item.key) || [];
    const purposes = programStore.getPurposesByCategory('aulAmanati', item.key) || [];
    const loanPurposes = programStore.getLoanPurposesByCategory('aulAmanati', item.key) || [];
    
    const sheetData = iins.map((iin, index) => {
      return {
        'ИИН': iin,
        'ФИО': names[index] || '-',
        'Тип': purposes[index] || '-',
        'Цель кредита': loanPurposes[index] || '-'
      };
    });
    
    return {
      name: item.name,
      data: sheetData
    };
  });
  
  const summaryData = listAulAmanati.value.map(item => ({
    'Категория': item.name,
    'Количество': item.count,
    'Процент': `${Numeral(item.percent)}%`
  }));
  
  summaryData.push({
    'Категория': 'Всего участников',
    'Количество': total.value,
    'Процент': '100%'
  });
  
  sheetsData.unshift({
    name: 'Общие данные',
    data: summaryData as any[]
  });
  
  exportToExcelMultiSheet(sheetsData, 'Ауыл_Аманаты_детальные_данные');
}

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
