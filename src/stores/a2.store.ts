import { defineStore } from "pinia";

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
