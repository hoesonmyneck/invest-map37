import { defineStore } from "pinia";

export const useProgramStore = defineStore("program", {
    state: () => ({
        serpin: [] as any[],
        aulAmanati: [] as any[],
        diplommenAulga: [] as any[],
        aulBesigi: [] as any[],
        currentTypeKey: 'count',
        currentRegion: null as number | null,
        currentRaion: null as number | null,
        current_key: 'serpin',
        currentYear: 'Все'
    }), 
    getters: {
        serpinFilter(): any[] {
            return this.serpin.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        aulAmanatiFilter(): any[] {
            return this.aulAmanati.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        diplommenAulgaFilter(): any[] {
            return this.diplommenAulga.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        aulBesigiFilter(): any[] {
            return this.aulBesigi.filter((item) => (this.currentYear === 'Все' ? true : +item.start_date === this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
    },
    actions: {
        async setSerpin(payload: any[]) {
            this.serpin = payload;
        },
        async setAulAmanati(payload: any[]) {
            this.aulAmanati = payload;
        },
        async setDiplommenAulga(payload: any[]) {
            this.diplommenAulga = payload;
        },
        async setAulBesigi(payload: any[]) {
            this.aulBesigi = payload;
        },
        setCurrentKey(key: string) {
            this.current_key = key;
        },
        setCurrentRegion(code: string) {
            this.currentRegion = +code;
        }
    }
});
