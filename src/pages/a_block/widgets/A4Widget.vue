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
                    <p @click="tab = 0" :class="{ active: tab === 0 }" class="btn mini">Отрасль</p>
                    <p @click="tab = 1" :class="{ active: tab === 1 }" class="btn mini">Проекты ({{
                        a1FilterByOtrasl.length }})
                    </p>
                    <p @click="openFullScreenModal" class="btn mini flex items-center">
                        <FullscreenOutlined />
                    </p>
                </div>
            </template>
            <template v-if="tab === 0">
                <A4Tab1 :isModal="false" />
            </template>
            <template v-if="tab === 1">
                <A4Tab2 :isModal="false" />
            </template>
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
                <div class="flex gap-2 mb-3">
                    <div class="btn mini text-white h-8" :class="{ 'bg-blue-500 active': modalTab === 0 }" @click="modalTab = 0">
                        Отрасль
                    </div>
                    <div class="btn mini text-white h-8" :class="{ 'bg-blue-500 active': modalTab === 1 }" @click="modalTab = 1">
                        Проекты ({{ a1FilterByOtrasl.length }})
                    </div>
                </div>

                <div class="h-[calc(100vh-150px)] overflow-hidden">
                    <template v-if="modalTab === 0">
                        <A4Tab1 :isModal="true" />
                    </template>
                    <template v-if="modalTab === 1">
                        <A4Tab2 :isModal="true" />
                    </template>
                </div>
            </BaseCard>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { ref } from 'vue';
import A4Tab1 from './a4_tabs/A4Tab1.vue';
import A4Tab2 from './a4_tabs/A4Tab2.vue';
import { useAStore } from '../store';
import { storeToRefs } from 'pinia';
import { FullscreenOutlined } from "@ant-design/icons-vue";

const tab = ref(0);
const modalTab = ref(0);
const isFullScreenModalVisible = ref(false);

const openFullScreenModal = () => {
    modalTab.value = tab.value; 
    isFullScreenModalVisible.value = true;
};

const closeFullScreenModal = () => {
    isFullScreenModalVisible.value = false;
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
