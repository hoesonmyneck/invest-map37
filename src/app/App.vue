<script setup lang="ts">
import { onMounted } from 'vue';
import { getRegion } from '../entities/region/api';
import { useRegionStore } from '../entities/region/store';
import regionsPolygon from './../data/region_polygon.json';

async function loadF1() {
  getRegion().then(res => {
    useRegionStore().loadRegions(res)
  })

  useRegionStore().loadRegionPolygons(regionsPolygon)
}

onMounted(() => {
  loadF1()
})
</script>

<template>
  <RouterView />
</template>
