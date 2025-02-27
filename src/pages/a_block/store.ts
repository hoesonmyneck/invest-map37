import { defineStore } from "pinia";

export const useAStore = defineStore("a", {
    state: () => ({
        a1: [] as any[],
        a1Year: [] as any[],
        currentLabel: 3,
        currentTypeKey: 'count',
        currentRegion: null as number | null,
        currentRaion: null as number | null,
        currentOtrasl: null as string | null,
        currentProject: null as number | null,
        projectModalVisible: false,
        popup: null as any[] | null,
    }), 
    getters: {
        a1Filter(): any[] {
            return this.a1.filter((item) =>  (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        a1FilterByOtrasl(): any[] {
            return this.a1Filter.filter((item) =>  (!this.currentOtrasl || item.otrasl === this.currentOtrasl));
        },
        a1FilterByProject(): any[] {
            return this.a1FilterByOtrasl.filter((item) =>  (!this.currentProject || item.id === this.currentProject));
        },
        a1YearFilter(): any[] {
            return this.a1Year.filter((item) => +item.year > 2019 && (!this.currentOtrasl || item.otrasl === this.currentOtrasl) && (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        currentProjectPopup(): any | undefined {
            return this.popup?.find(e => e.id === this.currentProject);
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
        setCurrentRaion(payload: number | null) {
            this.currentRaion = payload;
        },
        setCurrentOtrasl(payload: string | null) {
            this.currentOtrasl = payload;
        },
        setCurrentProject(payload: number | null) {
            this.currentProject = payload;
        },
        setProjectModalVisible(payload: boolean) {
            this.projectModalVisible = payload;
        },
        setPopup(payload: any[] | null) {
            this.popup = payload;
        }
    }
});