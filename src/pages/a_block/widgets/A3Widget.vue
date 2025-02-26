<template>
    <div class="text-white">
        <BaseCard title="Аналитика показателей" number="A3">
            <div class="h-[calc(30vh-30px)]">
                <template v-if="currentTypeKey === 'count'">
                    <InvestProjectTab />
                </template>
                <template v-if="currentTypeKey === 'project_price'">
                    <InvestTab />
                </template>
            </div>
        </BaseCard>
    </div>
</template>
<script setup lang="ts">
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import InvestProjectTab from './a3_tabs/InvestProjectTab.vue';
import { useAStore } from '../store';
import { storeToRefs } from 'pinia';
import InvestTab from './a3_tabs/InvestTab.vue';

const aStore = useAStore();
const { currentTypeKey } = storeToRefs(aStore);
</script>
<style scoped lang="scss"></style>

<style scoped lang="scss"></style>