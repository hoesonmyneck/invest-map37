import { defineStore } from 'pinia'
import type { Region } from './types'

export const useRegionStore = defineStore('region', {
    state: () => ({
        currentRegion: null as Region | null,
        regions: [] as Region[],
        regionPolygons: [] as any[]
    }),

    actions: {
        loadRegions(payload: Region[]) {
            this.regions = payload
        },

        setCurrentRegion(payload: Region) {
            this.currentRegion = payload
        },

        loadRegionPolygons(payload: any[]) {
            this.regionPolygons = payload
        },
    }
})