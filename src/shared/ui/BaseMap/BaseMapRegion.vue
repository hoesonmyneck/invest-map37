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
    <template v-for="p in a1FilterByOtrasl" :key="p.id + p.coordinates">
      <l-marker @click="aStore.setCurrentProject(p.id)" :lat-lng="p.coordinates?.split(',')">
        <l-tooltip class="p-0 bg-transparent rounded-md" :options="{ direction: 'right' }">
          <div class="py-2 px-3 gap-2 items-center">
            <p>Наименование проектов: <b><span class="font-bold">{{
              p.project_name }}</span></b></p>
            <p>Отрасль: <b><span class="font-bold">{{
              p.otrasl }}</span></b></p>
            <p>Район: <b>{{ p.raion }}</b></p>
          </div>
        </l-tooltip>
      </l-marker>
    </template>
  </l-map>
</template>

<script setup lang="ts">
import { LMap, LPolygon, LTooltip, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { useRegionStore } from "../../../entities/region/store";
import { computed, ref } from "vue";
import { reverseCoordinates } from "../../helpers/reverseCoordinates";
import { useAStore } from "../../../pages/a_block/store";
import { storeToRefs } from "pinia";

const regionStore = useRegionStore();
const aStore = useAStore()
const { a1FilterByOtrasl } = storeToRefs(aStore);

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
  markerClick: (data: any) => void;
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
