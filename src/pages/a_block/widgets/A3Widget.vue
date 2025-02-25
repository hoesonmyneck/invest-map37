<template>
    <div class="h-[calc(50vh-105px)]">
        <BaseCard title="Показатели эффективности" number="">
            <template v-slot:actions>
                <div class="flex gap gap-1">
                    <p @click="tab = 0" :class="{ active: tab === 0 }" class="btn mini">Отрасль</p>
                    <p @click="tab = 1" :class="{ active: tab === 1 }" class="btn mini">Проекты ({{
                        a1FilterByOtrasl.length }})
                    </p>
                </div>
            </template>
            <template v-if="tab === 0">
                <A3Tab1 />
            </template>
            <template v-if="tab === 1">
                <A3Tab2 />
            </template>
        </BaseCard>
    </div>
</template>
<script setup lang="ts">
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { ref } from 'vue';
import A3Tab1 from './a3_tabs/A3Tab1.vue';
import A3Tab2 from './a3_tabs/A3Tab2.vue';
import { useAStore } from '../store';
import { storeToRefs } from 'pinia';
const tab = ref(0);

const { a1FilterByOtrasl } = storeToRefs(useAStore());
</script>
<style scoped lang="scss"></style>
