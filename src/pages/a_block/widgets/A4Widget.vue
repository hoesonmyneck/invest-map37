<template>
    <div class="">
        <BaseCard title="Показатели эффективности" number="A4" :show-close-button="!!currentOtrasl" @close="() => {
            if (currentProject) {
                aStore.setCurrentProject(null)
                aStore.setCurrentRaion(null)
                return;
            }
            aStore.setCurrentOtrasl(null)
        }">
            <template v-slot:actions>
                <div class="flex gap gap-1">
                    <p @click="downloadExcel" class="btn mini flex items-center gap-1">
                        <DownloadOutlined />
                        <span>Скачать в Excel</span>
                    </p>
                    <p @click="tab = 0" :class="{ active: tab === 0 }" class="btn mini">Отрасль</p>
                    <p @click="tab = 1" :class="{ active: tab === 1 }" class="btn mini">Проекты ({{
                        a1FilterByOtrasl.length }})
                    </p>
                    <p @click="openFullScreenModal" class="btn mini flex items-center">
                        <FullscreenOutlined />
                    </p>
                </div>
            </template>
            <div>
                <div v-show="tab === 0">
                    <A4Tab1 :isModal="false" ref="tab1Component" />
                </div>
                <div v-show="tab === 1">
                    <A4Tab2 :isModal="false" ref="tab2Component" />
                </div>
            </div>
        </BaseCard>

        <a-modal 
            v-model:visible="isFullScreenModalVisible" 
            :footer="null" 
            class="fullscreen-modal" 
            width="100%" 
            :centered="true"
            :closable="false"
        >
            <BaseCard title="Показатели эффективности" number="A4" :show-close-button="true" @close="closeFullScreenModal" class="h-full">
                <div class="flex gap-2 mb-3 justify-between">
                    <div class="flex gap-2">
                        <div class="btn mini text-white h-8" :class="{ 'bg-blue-500 active': modalTab === 0 }" @click="modalTab = 0">
                            Отрасль
                        </div>
                        <div class="btn mini text-white h-8" :class="{ 'bg-blue-500 active': modalTab === 1 }" @click="modalTab = 1">
                            Проекты ({{ a1FilterByOtrasl.length }})
                        </div>
                    </div>
                    <a-button 
                        type="primary" 
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 h-8"
                        @click="downloadExcel"
                    >
                        <DownloadOutlined />
                        <span>Скачать в Excel</span>
                    </a-button>
                </div>

                <div class="h-[calc(100vh-150px)] overflow-hidden">
                    <div>
                        <div v-show="modalTab === 0">
                            <A4Tab1 :isModal="true" ref="modalTab1Component" />
                        </div>
                        <div v-show="modalTab === 1">
                            <A4Tab2 :isModal="true" ref="modalTab2Component" />
                        </div>
                    </div>
                </div>
            </BaseCard>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { ref, onMounted } from 'vue';
import A4Tab1 from './a4_tabs/A4Tab1.vue';
import A4Tab2 from './a4_tabs/A4Tab2.vue';
import { useAStore } from '../store';
import { storeToRefs } from 'pinia';
import { FullscreenOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { exportToExcelMultiSheet } from "../../../shared/helpers/excelExport";

const tab = ref(0);
const modalTab = ref(0);
const isFullScreenModalVisible = ref(false);
const tab1Component = ref<InstanceType<typeof A4Tab1> | null>(null);
const tab2Component = ref<InstanceType<typeof A4Tab2> | null>(null);
const modalTab1Component = ref<InstanceType<typeof A4Tab1> | null>(null);
const modalTab2Component = ref<InstanceType<typeof A4Tab2> | null>(null);

const openFullScreenModal = () => {
    modalTab.value = tab.value; 
    isFullScreenModalVisible.value = true;
};

const closeFullScreenModal = () => {
    isFullScreenModalVisible.value = false;
};

const downloadExcel = async () => {
    try {
        const isModal = isFullScreenModalVisible.value;
        
        const tab1 = isModal ? modalTab1Component.value : tab1Component.value;
        const tab2 = isModal ? modalTab2Component.value : tab2Component.value;
        
        if (!tab1 || !tab2) {
            console.error('Компоненты вкладок не инициализированы');
            return;
        }
        
        const tab1DataMethod = tab1?.getExportData;
        const tab2DataMethod = tab2?.getExportData;
        
        if (!tab1DataMethod || !tab2DataMethod) {
            console.error('Методы экспорта данных не найдены');
            return;
        }
        
        const tab1Data = tab1DataMethod();
        const tab2Data = tab2DataMethod();
        
        if (!tab1Data.length && !tab2Data.length) {
            console.log('Нет данных для экспорта');
            return;
        }
        
        const fileName = currentOtrasl.value 
            ? `Показатели_эффективности_${currentOtrasl.value}` 
            : 'Показатели_эффективности';
       
        const sheetsData = [
            {
                name: 'Отрасль',
                data: tab1Data
            },
            {
                name: 'Проекты',
                data: tab2Data
            }
        ];
        
        exportToExcelMultiSheet(sheetsData, fileName);
        
        console.log('Экспорт выполнен успешно');
    } catch (error) {
        console.error('Ошибка при экспорте в Excel:', error);
    }
};

const aStore = useAStore()
const { a1FilterByOtrasl, currentOtrasl, currentProject } = storeToRefs(aStore);
</script>
<style scoped lang="scss">
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

    .overflow-y-scroll {
        max-height: calc(100vh - 150px);
    }
}
</style>
