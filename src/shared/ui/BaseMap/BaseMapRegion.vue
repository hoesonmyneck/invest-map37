<template>
  <l-map :zoom="zoom ?? 6" :max-zoom="10" :min-zoom="5" :center="mapCenter" :options="mapOptions" class="w-full"
    :use-global-leaflet="false">
    <template v-for="feature in polygonFeatures" :key="(feature as any).parent2_code + Math.random()">
      <l-polygon @click="handlePolygonClick((feature as any).properties.parent2_code)"
        v-if="!currentRegion ? true : +currentRegion === +(feature as any).properties.parent1_code"
        :lat-lngs="reverseCoordinates((feature as any).geometry.coordinates as [number, number][][])"
        v-bind="polygonStyles(+(feature as any).properties.parent2_code)">
        <l-tooltip class="p-0 bg-transparent rounded-md">
          <slot :data="(feature as any).properties" />
        </l-tooltip>
      </l-polygon>
    </template>
    <template v-for="p in a1FilterByProject" :key="p.id + p.coordinates + Math.random()">
      <l-marker @click="aStore.setCurrentProject(p.id), aStore.setProjectModalVisible(true)" v-if="!!p.coordinates"
        :lat-lng="p.coordinates?.split(',')">
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
import { useRegionStore } from "../../../entities/region/store";
import { computed, ref, watch } from "vue";
import { reverseCoordinates } from "../../helpers/reverseCoordinates";
import { useAStore } from "../../../pages/a_block/store";
import { storeToRefs } from "pinia";

const regionStore = useRegionStore();
const aStore = useAStore()
const { a1FilterByProject } = storeToRefs(aStore);

// Constants
const DEFAULT_MAP_CENTER = [49.213962, 67.109173] as [number, number]; // Запасные координаты центра Казахстана

const MAP_CENTER = () => {
  try {
    if (props.currentRegion === undefined) return DEFAULT_MAP_CENTER;
    
    const centroid = regionStore.regionCenteroid?.find((item) => +item.parent1_code === +props.currentRegion)?.centroid;
    if (!centroid || !Array.isArray(centroid) || centroid.length < 2) {
      console.warn(`Не найден центроид для региона ${props.currentRegion}, используем запасной центр`);
      return DEFAULT_MAP_CENTER;
    }
    
    return centroid.slice().reverse();
  } catch (error) {
    console.error('Ошибка при определении центра карты:', error);
    return DEFAULT_MAP_CENTER;
  }
};

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
const polygonFeatures = computed(() => {
  if (!raionPolygons) return [];
  if (typeof raionPolygons !== 'object') return [];
  
  try {
    const features = (raionPolygons as any).features;
    if (!features || typeof features !== 'object') {
      console.warn('Отсутствуют или некорректны данные raionPolygons.features');
      return [];
    }
    
    return Object.values(features);
  } catch (error) {
    console.error('Ошибка при получении полигонов:', error);
    return [];
  }
});

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

watch(() => props.currentRegion, (newRegion) => {
  console.log(`Изменен регион на: ${newRegion}, центр карты: ${mapCenter.value}`);
}, { immediate: true });
</script>
