<template>
  <l-map ref="mapRef" :zoom="zoom ?? 6" :max-zoom="zoom ?? 6" :min-zoom="zoom ?? 6" :center="mapCenter"
    :options="mapOptions" class="w-full" :use-global-leaflet="false">
    <template v-for="feature in polygonFeatures" :key="feature.parent2_code">
      <l-polygon @click="handlePolygonClick(feature.properties.parent2_code)"
        v-if="!currentRegion ? true : +currentRegion === +feature.properties.parent1_code"
        :lat-lngs="reverseCoordinates(feature.geometry.coordinates as [number, number][][])"
        v-bind="polygonStyles(feature.properties.parent2_code)">
        <l-tooltip class="p-0 bg-transparent rounded-md">
          <slot :data="feature.properties" />
        </l-tooltip>
      </l-polygon>
    </template>
  </l-map>
</template>

<script setup lang="ts">
import { LMap, LPolygon, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { useRegionStore } from "../../../entities/region/store";
import { computed, ref } from "vue";
import { reverseCoordinates } from "../../helpers/reverseCoordinates";

const regionStore = useRegionStore();

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
  console.log(props.currentRaion, code);

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
