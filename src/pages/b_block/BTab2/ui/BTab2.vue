<template>
    <div class="text-white">
        <div class="flex pt-10 justify-center items-center w-full" v-if="loader">
            <a-spin />
        </div>
        <div class="grid grid-cols-2 h-[25vh]">
            <div>
                <B1Widget />
                <B2Widget />
                <B3Widget />
                <B4Widget />
            </div>

            <B5Widget />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getSerpin } from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import B1Widget from "../widgets/B1Widget.vue";
import B2Widget from "../widgets/B2Widget.vue";
import B3Widget from "../widgets/B3Widget.vue";
import B4Widget from "../widgets/B4Widget.vue";
import B5Widget from "../widgets/B5Widget.vue";

const loader = ref(true);
const programStore = useProgramStore();

async function loadSerpin() {
    const data = await getSerpin().finally(() => {
        loader.value = false;
    });

    programStore.setSerpin(data.value);
}

loadSerpin()
</script>

<style scoped lang="scss"></style>
