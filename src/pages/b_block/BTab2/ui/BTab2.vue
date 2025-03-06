<template>
  <div class="text-white">
    <div class="flex p-10 justify-center items-center w-full" v-if="loader">
      <a-spin />
    </div>
    <div v-else class="grid grid-cols-2 h-[25vh]">
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
import {
  getSerpin,
  getAulAmanati,
  getDiplommenAulga,
  getAulBesigi,
} from "../../../../entities/b/api";
import { useProgramStore } from "../store";
import B1Widget from "../widgets/B1Widget.vue";
import B2Widget from "../widgets/B2Widget.vue";
import B3Widget from "../widgets/B3Widget.vue";
import B4Widget from "../widgets/B4Widget.vue";
import B5Widget from "../widgets/B5Widget.vue";

const loader = ref(true);
const programStore = useProgramStore();

async function loadSerpin() {
  Promise.all([
    getSerpin(),
    getAulAmanati(),
    getDiplommenAulga(),
    getAulBesigi(),
  ])
    .then(([serpin, aulAmanati, diplommenAulga, aulBesigi]) => {
      programStore.setSerpin(serpin);
      programStore.setAulAmanati(aulAmanati);
      programStore.setDiplommenAulga(diplommenAulga);
      programStore.setAulBesigi(aulBesigi);
    })
    .finally(() => {
      loader.value = false;
    });
}

loadSerpin();
</script>

<style scoped lang="scss"></style>
