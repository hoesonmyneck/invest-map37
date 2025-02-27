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
                </div>
            </template>
            <template v-if="tab === 0">
                <A4Tab1 />
            </template>
            <template v-if="tab === 1">
                <A4Tab2 />
            </template>
        </BaseCard>
    </div>
</template>
<script setup lang="ts">
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { ref } from 'vue';
import A4Tab1 from './a4_tabs/A4Tab1.vue';
import A4Tab2 from './a4_tabs/A4Tab2.vue';
import { useAStore } from '../store';
import { storeToRefs } from 'pinia';
const tab = ref(0);

const aStore = useAStore()
const { a1FilterByOtrasl, currentOtrasl, currentProject } = storeToRefs(aStore);
</script>
<style scoped lang="scss"></style>
