<script setup lang="ts">
interface CardProps {
    title: string;
    number?: string;
    close?: boolean;
    show?: boolean;
}

interface CardEmits {
    (event: 'clear'): void;
    (event: 'show'): void;
}
import BaseIcon from "../BaseIcon/BaseIcon.vue";

defineProps<CardProps>();
defineEmits<CardEmits>();
</script>

<template>
    <div class="card bg-[#1C1F27] p-1 rounded">
        <div class="flex justify-between items-center h-8 bg-[#252A36] rounded">
            <div class="flex font-light h-full text-sm max-w-[80%] items-center text-xs">
                <p v-if="number" class="w-[50px] flex items-center justify-center border-r border-[#1C1F27]">
                    {{ number }}
                </p>
                <span class="px-3 items-center truncate block">{{ title }}</span>
            </div>
            <div class="flex h-full items-center font-light w-min">
                <button v-if="show" @click="$emit('show')"
                    class="px-3 flex items-center border-l border-[#1C1F27] h-full cursor-pointer w-[40px]">
                    <BaseIcon name="open" :width="14" />
                </button>
                <button v-if="close" @click="$emit('clear')"
                    class="px-3 flex items-center border-l border-[#1C1F27] h-full cursor-pointer w-[40px]">
                    <BaseIcon name="close" :width="14" />
                </button>
            </div>
        </div>
        <slot />
    </div>
</template>

<style scoped></style>
