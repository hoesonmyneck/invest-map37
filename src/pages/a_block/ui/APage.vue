<template>
    <BaseCard title="" number="" :show-close-button="true" @close="$emit('close')">
        <div class="flex justify-center items-center w-full px-10" v-if="loader">
            <a-spin />
        </div>
        <div v-else class="gap-1 h-[93vh]">
            <div class="grid grid-cols-[1fr_2fr]">
                <div class="grid">
                    <A1Widget />
                    <A3Widget />
                </div>
                <A2Widget />
            </div>
            <A4Widget />
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getA2 } from '../../../entities/a/api';
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import A1Widget from '../widgets/A1Widget.vue';
import A2Widget from '../widgets/A2Widget.vue';
import A4Widget from '../widgets/A4Widget.vue';
import { useAStore } from '../store';
import A3Widget from '../widgets/A3Widget.vue';

const loader = ref(true);

function fetch() {
    getA2().then((v) => {
        useAStore().setA1Year(v);
    }).finally(() => {
        loader.value = false
    })
}

fetch()
</script>

<style scoped lang="scss"></style>