<template>
    <l-map :zoom="zoom ?? 6" :max-zoom="10" :min-zoom="5" :center="mapCenter" :options="mapOptions" class="w-full"
      :use-global-leaflet="false">
      <template v-for="feature in polygonFeatures" :key="feature.parent2_code + Math.random()">
        <l-polygon @click="handlePolygonClick(feature.properties.parent2_code)"
          v-if="!currentRegion ? true : +currentRegion === +feature.properties.parent1_code"
          :lat-lngs="reverseCoordinates(feature.geometry.coordinates as [number, number][][])"
          v-bind="polygonStyles(feature.properties.parent2_code)">
          <l-tooltip class="p-0 bg-transparent rounded-md">
            <slot :data="feature.properties" />
          </l-tooltip>
        </l-polygon>
      </template>
      <template v-for="p in a1FilterByProject" :key="p.id + p.coordinates + Math.random()">
        
      </template>
    </l-map>
  </template>
  
  <script setup lang="ts">
  import { LMap, LPolygon, LTooltip, LMarker } from "@vue-leaflet/vue-leaflet";
  import { useRegionStore } from "../../../entities/region/store";
  import { computed, ref } from "vue";
  import { reverseCoordinates } from "../../helpers/reverseCoordinates";
  import { useAStore } from "../../../pages/a_block/store";
  import { storeToRefs } from "pinia";
  
  const regionStore = useRegionStore();
  const aStore = useAStore()
  const { a1FilterByProject } = storeToRefs(aStore);
  
  // Constants
  const MAP_CENTER = () => regionStore.regionCenteroid?.find((item) => +item.parent1_code === +props.currentRegion)?.centroid.reverse();
  const MAP_OPTIONS = { zoomControl: false };
  const DEFAULT_POLYGON_STYLES = {
    color: "white",
    opacity: 1,
    weight: 1,
    fillOpacity: 1,
  };
  
  // Props and Emits
  interface Props {
    fillColor: (data: any) => string;
    markerClick?: (data: any) => void;
    currentRegion?: number;
    currentRaion?: number;
    zoom?: number;
  }
  
  const props = defineProps<Props>();
  
  const emit = defineEmits<{
    (e: "clickPolygon", value: string): void;
  }>();
  
  // Store
  const { raionPolygons } = useRegionStore();
  
  // Computed
  const polygonFeatures = computed(() => Object.values(raionPolygons.features));
  
  const mapCenter = computed(() => MAP_CENTER());
  const mapOptions = computed(() => MAP_OPTIONS);
  
  // Methods
  const getColor = (code: number): string => {
    if (!props.currentRaion) return props.fillColor(code);
    return props.currentRaion === code ? props.fillColor(code) : "#252A36";
  };
  
  const polygonStyles = (code: number) => ({
    ...DEFAULT_POLYGON_STYLES,
    fillColor: getColor(+code),
  });
  
  const handlePolygonClick = (code: string) => {
    emit("clickPolygon", code);
  };
  
  // Refs
  const mapRef = ref(null);
  </script>
  