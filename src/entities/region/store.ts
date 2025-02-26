import { defineStore } from "pinia";
import type { Region } from "./types";

export const useRegionStore = defineStore("region", {
  state: () => ({
    currentRegion: null as Region | null,
    regions: [] as Region[],
    regionCenteroid: null as {parent1_code: number, centroid: any[]}[]| null,
    regionPolygons: [] as any[],

    currentRaion: null as Region | null,
    raions: [] as Region[],
    raionCenteroid: null as {parent1_code: number, centroid: any}[]| null,
    raionPolygons: [] as any[],
  }),

  actions: {
    loadRegions(payload: Region[]) {
      this.regions = payload;
    },

    setCurrentRegion(payload: Region) {
      this.currentRegion = payload;
    },

    loadRegionPolygons(payload: any[]) {
      this.regionPolygons = payload;
    },

    loadRegionCenteroid(payload: {parent1_code: number, centroid: any[]}[]) {
      this.regionCenteroid = payload;
    },

    loadRaions(payload: Region[]) {
      this.raions = payload;
    },

    loadRaionPolygons(payload: any[]) {
      this.raionPolygons = payload;
    },

    setCurrentRaion(payload: Region) {
      this.currentRaion = payload;
    },

    loadRaionCenteroid(payload: {parent1_code: number, centroid: any}[]) {
      this.raionCenteroid = payload;
    },  
  },
});
