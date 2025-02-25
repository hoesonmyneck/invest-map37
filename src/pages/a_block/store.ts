import { defineStore } from "pinia";

export const useAStore = defineStore("a", {
    state: () => ({
        a1: [] as any[],
        a1Year: [] as any[],
        currentLabel: 3,
        currentTypeKey: 'count',
        currentRegion: null as number | null,
        currentOtrasl: null as string | null,
        currentProject: null as number | null,
    }), 
    getters: {
        a1Filter(): any[] {
            return this.a1.filter((item) =>  (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || item.parent1_code === this.currentRegion));
        },
        a1FilterByOtrasl(): any[] {
            return this.a1Filter.filter((item) =>  (!this.currentOtrasl || item.otrasl === this.currentOtrasl));
        },
        a1YearFilter(): any[] {
            return this.a1Year.filter((item) => (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || item.parent1_code === this.currentRegion));
        }
    },
    actions: {
        async setA1(payload: any[]) {
            this.a1 = payload;
        },
        setCurrentTypeKey(payload: string) {
            this.currentTypeKey = payload;
        },
        setCurrentLabel(payload: number) {
            this.currentLabel = payload;
        },
        async setA1Year(payload: any[]) {
            this.a1Year = payload;
        },
        setCurrentRegion(payload: number | null) {
            this.currentRegion = payload;
        },
        setCurrentOtrasl(payload: string | null) {
            this.currentOtrasl = payload;
        },
        setCurrentProject(payload: number | null) {
            this.currentProject = payload;
        }
    }
});