<template>
  <div class="text-white">
    <BaseCard
      title="«СЕРПIН»"
      number="A1"
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
      <div
        class="grid grid-cols-[200px_1fr] gap-2 items-start p-3 px-5 relative"
      >
        <div class="relative flex items-center justify-center">
          <highcharts
            :options="chartSerpin"
            class="h-[170px] m-auto"
          ></highcharts>
          <p class="absolute text-2xl font-bold">
            {{ Numeral((ispolnayet / total) * 100) }}%
          </p>
        </div>
        <ul class="">
          <li
            class="grid grid-cols-[40px_1fr_80px_60px] w-full mb-2 pb-2 border-b border-gray-700"
          >
            <img class="w-4" src="/images/a_block/img_1.png" alt="" />
            <p class="text-[10px]">Участники</p>
            <p class="text-[10px]">{{ Numeral(total) }}</p>
            <p class="text-[10px] text-end">{{ Numeral((total / totalBeforeFilter) * 100) }}%</p>
          </li>

          <li
            v-for="(l, i) in listSerpin"
            class="grid text-gray-400 grid-cols-[40px_1fr_80px_60px] w-full mb-2"
          >
            <img class="w-4" :src="`/images/a_block/img_${i + 2}.png`" alt="" />
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ l.name }}</p>
            <p 
              class="text-[10px] cursor-pointer hover:text-blue-400"
              @click="showIinPopup(l)"
            >{{ l.count }}</p>
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
        title="«СЕРПIН»"
        number="A1"
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

        <div class="grid grid-cols-[300px_1fr] gap-6 items-start p-5 px-8 relative">
          <div class="relative flex items-center justify-center">
            <highcharts
              :options="chartSerpin"
              class="h-[300px] m-auto"
            ></highcharts>
            <p class="absolute text-4xl font-bold">
              {{ Numeral((ispolnayet / total) * 100) }}%
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
              v-for="(l, i) in listSerpin"
              class="grid text-gray-400 grid-cols-[60px_1fr_120px_100px] w-full mb-4"
            >
              <img class="w-6" :src="`/images/a_block/img_${i + 2}.png`" alt="" />
              <p 
                class="text-base text-white cursor-pointer hover:text-blue-400"
                @click="showIinPopup(l)"
              >{{ l.name }}</p>
              <p 
                class="text-base text-white cursor-pointer hover:text-blue-400"
                @click="showIinPopup(l)"
              >{{ l.count }}</p>
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
      :iins="selectedCategory ? programStore.getIinsByCategory('serpin', selectedCategory.key) : []"
      :addresses="selectedCategory ? programStore.getAddressesByCategory('serpin', selectedCategory.key) : []"
      :contracts="selectedCategory ? programStore.getContractsByCategory('serpin', selectedCategory.key) : []"
      :title="`«СЕРПIН» - ${selectedCategory ? selectedCategory.name : ''}`"
      :category-name="selectedCategory ? selectedCategory.name : ''"
      @close="showPopup = false"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useProgramStore } from "../store";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";
import { Numeral } from "../../../../shared/helpers/numeral";
import { storeToRefs } from "pinia";
import { chartOptions } from "../helpers/chartOption";
import IinPopupWidget from "./IinPopupWidget.vue";
import { FullscreenOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { exportToExcel } from "../../../../shared/helpers/excelExport";

const programStore = useProgramStore();
const { serpinFilter, serpin } = storeToRefs(programStore);

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
  serpin.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const rabotaet = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.rabotaet || 0), 0)
);
const bezrabot = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.bezrabot || 0), 0)
);
const est_trud = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.est_trud || 0), 0)
);
const bez_trud = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.bez_trud || 0), 0)
);
const ispolnayet = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.ispolnayet || 0), 0)
);
const total = computed(() =>
  serpinFilter.value.reduce((acc, curr) => +acc + +(curr.total || 0), 0)
);

const listSerpin = computed(() => [
  {
    name: "Работающие",
    key: "rabotaet",
    count: rabotaet.value,
    percent: (rabotaet.value / total.value) * 100,
  },
  {
    name: "Безработные",
    key: "bezrabot",
    count: bezrabot.value,
    percent: (bezrabot.value / total.value) * 100,
  },
  {
    name: "С трудовым договором:",
    key: "est_trud",
    count: est_trud.value,
    percent: (est_trud.value / total.value) * 100,
  },
  {
    name: "Без трудового договора",
    key: "bez_trud",
    count: bez_trud.value,
    percent: (bez_trud.value / total.value) * 100,
  },
  {
    name: "Исполняющие",
    key: "ispolnayet",
    count: ispolnayet.value,
    percent: (ispolnayet.value / total.value) * 100,
  },
]);

function showIinPopup(category: { name: string, key: string, count: number, percent: number }) {
  selectedCategory.value = category;
  showPopup.value = true;
}

function downloadExcel() {
  const excelData = listSerpin.value.map(item => ({
    'Категория': item.name,
    'Количество': item.count,
    'Процент': `${Numeral(item.percent)}%`
  }));
  
  excelData.push({
    'Категория': 'Всего участников',
    'Количество': total.value,
    'Процент': '100%'
  });
  
  exportToExcel(excelData, 'Серпін_данные', 'Серпін');
}

const chartSerpin = computed(() =>
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
        data: [(ispolnayet.value / total.value) * 100],
        color: "#3090E8",
      },

      {
        name: "",
        data: [100 - (ispolnayet.value / total.value) * 100],
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
