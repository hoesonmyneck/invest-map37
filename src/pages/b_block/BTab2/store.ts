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
            if(!this.serpin) return [];
            return this.serpin.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === +this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        aulAmanatiFilter(): any[] {
            return this.aulAmanati.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === +this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        diplommenAulgaFilter(): any[] {
            return this.diplommenAulga.filter((item) => (this.currentYear === 'Все' ? true : +item.year_contract === +this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
        },
        aulBesigiFilter(): any[] {
            return this.aulBesigi.filter((item) => (this.currentYear === 'Все' ? true : +item.start_date === +this.currentYear) && (!this.currentRegion || item.parent1_code === this.currentRegion) && (!this.currentRaion || item.parent2_code === this.currentRaion));
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
        setCurrentRegion(code: string | null) {
            this.currentRegion = code ? +code : null;
            this.currentRaion = null;
        },
        setCurrentRaion(code: string | null) {
            this.currentRaion = code ? +code : null;
        },
        getIinsByCategory(program: string, category: string): string[] {
            let filteredData: any[] = [];
            
            switch (program) {
                case 'serpin':
                    filteredData = this.serpinFilter;
                    break;
                case 'aulAmanati':
                    filteredData = this.aulAmanatiFilter;
                    break;
                case 'diplommenAulga':
                    filteredData = this.diplommenAulgaFilter;
                    break;
                case 'aulBesigi':
                    filteredData = this.aulBesigiFilter;
                    break;
                default:
                    return [];
            }
            
            const allIins: string[] = [];
            filteredData.forEach(item => {
                if (item[category] && item.iin_people && Array.isArray(item.iin_people)) {
                    if (category === 'total') {
                        allIins.push(...item.iin_people);
                    } else {
                        const count = parseInt(item[category], 10);
                        if (!isNaN(count) && count > 0 && count <= item.iin_people.length) {
                            allIins.push(...item.iin_people.slice(0, count));
                        }
                    }
                }
            });
            
            return [...new Set(allIins)];
        },
        
        getNamesByCategory(program: string, category: string): string[] {
            let filteredData: any[] = [];
            
            switch (program) {
                case 'serpin':
                    filteredData = this.serpinFilter;
                    break;
                case 'aulAmanati':
                    filteredData = this.aulAmanatiFilter;
                    break;
                case 'diplommenAulga':
                    filteredData = this.diplommenAulgaFilter;
                    break;
                case 'aulBesigi':
                    filteredData = this.aulBesigiFilter;
                    break;
                default:
                    return [];
            }
            
            const allNames: string[] = [];
            filteredData.forEach(item => {
                if (item[category] && item.name_people && Array.isArray(item.name_people)) {
                    if (category === 'total') {
                        allNames.push(...item.name_people);
                    } else {
                        const count = parseInt(item[category], 10);
                        if (!isNaN(count) && count > 0 && count <= item.name_people.length) {
                            allNames.push(...item.name_people.slice(0, count));
                        }
                    }
                }
            });
            
            return allNames;
        },
        
        getPurposesByCategory(program: string, category: string): string[] {
            if (program !== 'aulAmanati') return [];
            
            const filteredData = this.aulAmanatiFilter;
            
            const allPurposes: string[] = [];
            filteredData.forEach(item => {
                if (item[category] && item.purpose_type_people && Array.isArray(item.purpose_type_people)) {
                    if (category === 'total') {
                        allPurposes.push(...item.purpose_type_people);
                    } else {
                        const count = parseInt(item[category], 10);
                        if (!isNaN(count) && count > 0 && count <= item.purpose_type_people.length) {
                            allPurposes.push(...item.purpose_type_people.slice(0, count));
                        }
                    }
                }
            });
            
            return allPurposes;
        },
        
        getAddressesByCategory(program: string, category: string): string[] {
            if (program !== 'diplommenAulga' && program !== 'serpin') return [];
            
            let filteredData: any[] = [];
            
            if (program === 'diplommenAulga') {
                filteredData = this.diplommenAulgaFilter;
            } else if (program === 'serpin') {
                filteredData = this.serpinFilter;
            } else {
                return [];
            }
            
            const allAddresses: string[] = [];
            filteredData.forEach(item => {
                if (item[category] && item.address_people && Array.isArray(item.address_people)) {
                    if (category === 'total') {
                        allAddresses.push(...item.address_people);
                    } else {
                        const count = parseInt(item[category], 10);
                        if (!isNaN(count) && count > 0 && count <= item.address_people.length) {
                            allAddresses.push(...item.address_people.slice(0, count));
                        }
                    }
                }
            });
            
            return allAddresses;
        }
    }
});
