<template>
  <a-modal 
    :footer="null" 
    class="p-0 text-white" 
    width="70%" 
    height="80%" 
    :closable="false" 
    :centered="true" 
    :visible="visible"
    @cancel="$emit('close')"
  >
    <BaseCard 
      :title="title" 
      number="" 
      :show-close-button="true" 
      @close="$emit('close')"
    >
      <div class="p-3">
        <div class="mb-4">
          <a-input 
            v-model:value="searchQuery" 
            placeholder="Поиск по ИИН или ФИО" 
            class="w-full" 
            @input="onSearch"
          />
        </div>
        
        
        <div class="h-[400px] overflow-auto" ref="scrollContainer" @scroll="handleScroll">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="text-left py-2 px-3 font-bold text-xs text-white">ИИН</th>
                <th v-if="hasNames" class="text-left py-2 px-3 font-bold text-xs text-white">ФИО</th>
                <th v-if="hasPurposes" class="text-left py-2 px-3 font-bold text-xs text-white">Тип</th>
                <th v-if="hasAddresses" class="text-left py-2 px-3 font-bold text-xs text-white">Адрес</th>
                <th v-if="hasLoanPurposes" class="text-left py-2 px-3 font-bold text-xs text-white">Цель кредита</th>
                <th v-if="hasContracts" class="text-left py-2 px-3 font-bold text-xs text-white">Контракт</th>
                <th v-if="hasSupports" class="text-left py-2 px-3 font-bold text-xs text-white">Поддержка</th>
                <th v-if="hasCredits" class="text-left py-2 px-3 font-bold text-xs text-white">Кредит</th>
              </tr>
            </thead>
            
            <tbody>
              <tr v-for="(item, index) in displayedItems" 
                  :key="index" 
                  class="border-b border-gray-700 hover:bg-gray-800">
                <td class="py-2 px-3 text-white">{{ item.iin }}</td>
                <td v-if="hasNames" class="py-2 px-3 text-white">{{ item.name || '-' }}</td>
                <td v-if="hasPurposes" class="py-2 px-3 text-white">{{ item.purpose || '-' }}</td>
                <td v-if="hasAddresses" class="py-2 px-3 text-white">{{ item.address || '-' }}</td>
                <td v-if="hasLoanPurposes" class="py-2 px-3 text-white">{{ item.loanPurpose || '-' }}</td>
                <td v-if="hasContracts" class="py-2 px-3 text-white">{{ item.contract || '-' }}</td>
                <td v-if="hasSupports" class="py-2 px-3 text-white">{{ item.support || '-' }}</td>
                <td v-if="hasCredits" class="py-2 px-3 text-white">{{ item.credit || '-' }}</td>
                <td class="py-2 px-3 text-right">
                  <a-button 
                    type="text" 
                    class="copy-button !text-white"
                    @click="copyToClipboard(item.iin)"
                  >
                    Копировать
                  </a-button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div 
            v-if="displayedItems.length < filteredItems.length" 
            class="text-center py-4"
          >
            <a-button
              type="primary"
              @click="loadMore"
              :loading="loading"
              class="bg-blue-600"
            >
              Загрузить еще 500
            </a-button>
          </div>
        </div>
      </div>
    </BaseCard>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BaseCard from "../../../../shared/ui/BaseCard/BaseCard.vue";

interface PersonItem {
  iin: string;
  name?: string;
  purpose?: string;
  address?: string;
  loanPurpose?: string;
  contract?: string;
  support?: string;
  credit?: string;
}

const props = defineProps<{
  visible: boolean;
  iins: string[];
  title: string;
  categoryName: string;
  names?: string[];
  purposes?: string[];
  addresses?: string[];
  loanPurposes?: string[];
  contracts?: string[];
  supports?: string[];
  credits?: string[];
}>();

defineEmits(["close"]);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 500;
const loading = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);

const hasNames = computed(() => props.names && props.names.length > 0);
const hasPurposes = computed(() => props.purposes && props.purposes.length > 0);
const hasAddresses = computed(() => props.addresses && props.addresses.length > 0);
const hasLoanPurposes = computed(() => props.loanPurposes && props.loanPurposes.length > 0);
const hasContracts = computed(() => props.contracts && props.contracts.length > 0);
const hasSupports = computed(() => props.supports && props.supports.length > 0);
const hasCredits = computed(() => props.credits && props.credits.length > 0);

const allItems = computed((): PersonItem[] => {
  return props.iins.map((iin, index) => {
    const item: PersonItem = { iin };
    
    if (props.names && props.names[index]) {
      item.name = props.names[index];
    }
    
    if (props.purposes && props.purposes[index]) {
      item.purpose = props.purposes[index];
    }
    
    if (props.addresses && props.addresses[index]) {
      item.address = props.addresses[index];
    }
    
    if (props.loanPurposes && props.loanPurposes[index]) {
      item.loanPurpose = props.loanPurposes[index];
    }
    
    if (props.contracts && props.contracts[index]) {
      item.contract = props.contracts[index];
    }
    
    if (props.supports && props.supports[index]) {
      item.support = props.supports[index];
    }
    
    if (props.credits && props.credits[index]) {
      item.credit = props.credits[index];
    }
    
    return item;
  });
});

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return allItems.value;
  }
  const query = searchQuery.value.toLowerCase().trim();
  return allItems.value.filter(item => 
    String(item.iin).toLowerCase().includes(query) || 
    (item.name && String(item.name).toLowerCase().includes(query))
  );
});

const displayedItems = computed(() => {
  return filteredItems.value.slice(0, currentPage.value * itemsPerPage);
});

function onSearch() {
  currentPage.value = 1;
}

function loadMore() {
  loading.value = true;
  setTimeout(() => {
    currentPage.value += 1;
    loading.value = false;
  }, 300); 
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  
  if (scrollTop + clientHeight >= scrollHeight - 50 && 
      displayedItems.value.length < filteredItems.value.length && 
      !loading.value) {
    loadMore();
  }
}

function copyToClipboard(iin: string) {
  navigator.clipboard.writeText(iin)
    .then(() => {
    })
    .catch(err => {
      console.error('Не удалось скопировать текст: ', err);
    });
}

function getEndingWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "";
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "а";
  } else {
    return "ов";
  }
}


watch(() => props.iins, () => {
  currentPage.value = 1;
});


watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentPage.value = 1;
  }
});
</script>

<style scoped>
.copy-button,
.copy-button:hover,
.copy-button:focus,
.copy-button:active {
  color: white !important;
}

:deep(.ant-btn.copy-button span) {
  color: white !important;
}

table {
  border-spacing: 0;
}

table tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

table th {
  text-align: left;
  font-weight: bold;
}

table td, table th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}
</style> 