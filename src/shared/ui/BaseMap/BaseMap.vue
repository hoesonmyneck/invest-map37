<template>
  <l-map ref="mapRef" :zoom="zoom ?? 5" :max-zoom="5" :min-zoom="4" :center="mapCenter" :options="mapOptions"
    class="w-full" :use-global-leaflet="false">
    <l-polygon v-for="feature in polygonFeatures" :key="(feature as any).parent1_code"
      @click="handlePolygonClick((feature as any).properties.parent1_code)"
      :lat-lngs="reverseCoordinates((feature as any).geometry.coordinates as [number, number][][])"
      v-bind="polygonStyles((feature as any).properties.parent1_code)">
      <l-tooltip class="p-0 bg-transparent rounded-md">
        <slot :data="(feature as any).properties" />
      </l-tooltip>
    </l-polygon>
  </l-map>
</template>

<script setup lang="ts">
import { LMap, LPolygon, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { useRegionStore } from "../../../entities/region/store";
import { computed, ref, watch } from "vue";
import { reverseCoordinates } from "../../helpers/reverseCoordinates";

// Constants
const DEFAULT_MAP_CENTER = [49.213962, 67.109173] as [number, number];
const MAP_OPTIONS = { 
  zoomControl: false,
  dragging: false, 
  doubleClickZoom: false,
  scrollWheelZoom: false,
  touchZoom: false,
  boxZoom: false
};
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
  zoom?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "clickPolygon", value: string): void;
}>();

// Store
const { regionPolygons } = useRegionStore();

// Computed
const polygonFeatures = computed(() => {
  if (!regionPolygons) return [];
  if (typeof regionPolygons !== 'object') return [];
  
  try {
    const features = (regionPolygons as any).features;
    if (!features || typeof features !== 'object') {
      console.warn('Отсутствуют или некорректны данные regionPolygons.features');
      return [];
    }
    
    return Object.values(features);
  } catch (error) {
    console.error('Ошибка при получении полигонов:', error);
    return [];
  }
});

const mapCenter = computed(() => DEFAULT_MAP_CENTER);
const mapOptions = computed(() => MAP_OPTIONS);

// Methods
const getColor = (code: number): string => {
  if (!props.currentRegion) return props.fillColor(code);
  return props.currentRegion === code ? props.fillColor(code) : "#252A36";
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

// Слежение за изменениями
watch(() => props.currentRegion, (newRegion) => {
  console.log(`Изменен регион на: ${newRegion}`);
}, { immediate: true });
</script>
