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
            return this.a1.filter((item) =>  (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || +item.parent1_code === +this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        a1FilterByOtrasl(): any[] {
            return this.a1Filter.filter((item) =>  (!this.currentOtrasl || item.otrasl === this.currentOtrasl));
        },
        a1FilterByProject(): any[] {
            return this.a1FilterByOtrasl.filter((item) =>  (!this.currentProject || item.id === this.currentProject));
        },
        a1YearFilter(): any[] {
            return this.a1Year.filter((item) => +item.year > 2019 && (!this.currentProject || item.id === this.currentProject) && (!this.currentOtrasl || item.otrasl === this.currentOtrasl) && (!this.currentLabel || +item.label === this.currentLabel) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
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

interface State {
  a1: [],
  a2: [],
  a3: [],
  a4: [],
  a5: [],
  a5_diplom: [],
  a5_serpin: [],
  a_map_current_key: any,
  current_year: number,
}

export const useA2Store = defineStore("a2_store", {
  state: (): State => ({
    a1: [],
    a2: [],
    a3: [],
    a4: [],
    a5: [],
    a5_diplom: [],
    a5_serpin: [],
    a_map_current_key: 'serpin',
    current_year: 0
  }),
  actions: {
    setA1(popup: any) {
      this.a1 = popup;
    },
    setA2(popup: any) {
      this.a2 = popup;
    },
    setA3(popup: any) {
      this.a3 = popup;
    },
    setA4(popup: any) {
      this.a4 = popup;
    },
    setA5(popup: any) {
      this.a5 = popup;
    },
    setA5Diplom(popup: any) {
      this.a5_diplom = popup;
    },
    setA5Serpin(popup: any) {
      this.a5_serpin = popup;
    },
    setAMapCurrentKey(key: any) {
      this.a_map_current_key = key;
    },
    setCurrentYear(year: number) {
      this.current_year = year;
    }
  },
});
