<script setup lang="ts">
import { onMounted } from "vue";
import { getRegion } from "../entities/region/api";
import { useRegionStore } from "../entities/region/store";
import { useAuthStore } from "../stores/auth.store";
import regionsPolygon from "./../data/region_polygon.json";
import regionsCentroids from "./../data/region_centroids.json";
import raionsPolygon from "./../data/raion_polygon.json";
import raionsCentroids from "./../data/raion_centroids.json";

const authStore = useAuthStore();

async function loadF1() {
  getRegion().then((res) => {
    useRegionStore().loadRegions(res);
  });

  useRegionStore().loadRegionPolygons(regionsPolygon);
  useRegionStore().loadRegionCenteroid(regionsCentroids);

  useRegionStore().loadRaionPolygons(raionsPolygon);
  useRegionStore().loadRaionCenteroid(raionsCentroids);
}

onMounted(() => {
  
  authStore.checkAuth();
  loadF1();
});
</script>

<template>
  <RouterView />
</template>
