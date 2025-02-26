<template>
    <div class="text-white">
        <BaseCard title="Аналитика показателей" number="A3">
            <div class="h-[calc(30vh-30px)] overflow-y-scroll">
                <template v-if="currentTypeKey === 'count'">
                    <InvestProjectTab />
                </template>
                <template v-if="currentTypeKey === 'project_price'">
                    <InvestTab />
                </template>
                <template v-if="currentTypeKey === 'work_places'">
                    <WorkPlacesTab />
                </template>
                <template v-if="currentTypeKey === 'plan_fot'">
                    <FotTab />
                </template>
                <template v-if="currentTypeKey === 'project_duration'">
                    <SrokiTab />
                </template>
                <template v-if="currentTypeKey === 'percentage_risk_region'">
                    <RiskTab />
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
import WorkPlacesTab from './a3_tabs/WorkPlacesTab.vue';
import FotTab from './a3_tabs/FotTab.vue';
import SrokiTab from './a3_tabs/SrokiTab.vue';
import RiskTab from './a3_tabs/RiskTab.vue';

const aStore = useAStore();
const { currentTypeKey } = storeToRefs(aStore);
</script>
<style scoped lang="scss"></style>

<style scoped lang="scss"></style>