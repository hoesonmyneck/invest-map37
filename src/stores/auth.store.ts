import { defineStore } from 'pinia';

interface RegionAccess {
  id_reg: number;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  expiresAt: number | null;
  allowedRegions: RegionAccess[];
  username: string;
}

const REGION_MAP: Record<string, RegionAccess> = {
  'akmolinskaya': { id_reg: 11, name: 'Акмолинская область' },
  'aktubinskaya': { id_reg: 15, name: 'Актюбинская область' },
  'almatinskaya': { id_reg: 19, name: 'Алматинская область' },
  'atyrauskaya': { id_reg: 23, name: 'Атырауская область' },
  'vko': { id_reg: 63, name: 'Восточно-Казахстанская область' },
  'zhambylskaya': { id_reg: 31, name: 'Жамбылская область' },
  'zko': { id_reg: 27, name: 'Западно-Казахстанская область' },
  'karagandinskaya': { id_reg: 35, name: 'Карагандинская область' },
  'kostanayskaya': { id_reg: 39, name: 'Костанайская область' },
  'kyzylordinskaya': { id_reg: 43, name: 'Кызылординская область' },
  'mangistauskaya': { id_reg: 47, name: 'Мангистауская область' },
  'pavlodarskaya': { id_reg: 55, name: 'Павлодарская область' },
  'sko': { id_reg: 59, name: 'Северо-Казахстанская область' },
  'yuzhno-kazahstanskaya': { id_reg: 61, name: 'Туркестанская область' },
  'abay': { id_reg: 10, name: 'Абайская область' },
  'ulytau': { id_reg: 62, name: 'Улытауская область' },
  'zhetysu': { id_reg: 19, name: 'Жетысуская область' },
  'almaty': { id_reg: 75, name: 'г. Алматы' },
  'astana': { id_reg: 71, name: 'г. Астана' },
  'shymkent': { id_reg: 79, name: 'г. Шымкент' },
  'admin': { id_reg: 0, name: 'Все регионы' }
};

const REGION_CREDENTIALS = {
  'admin': { password: 'admin2025', regions: [REGION_MAP['admin']] },
  'akmolinskaya': { password: 'akm2025', regions: [REGION_MAP['akmolinskaya']] },
  'aktubinskaya': { password: 'akt2025', regions: [REGION_MAP['aktubinskaya']] },
  'almatinskaya': { password: 'alm2025', regions: [REGION_MAP['almatinskaya']] },
  'atyrauskaya': { password: 'atr2025', regions: [REGION_MAP['atyrauskaya']] },
  'vko': { password: 'vko2025', regions: [REGION_MAP['vko']] },
  'zhambylskaya': { password: 'zham2025', regions: [REGION_MAP['zhambylskaya']] },
  'zko': { password: 'zko2025', regions: [REGION_MAP['zko']] },
  'karagandinskaya': { password: 'kar2025', regions: [REGION_MAP['karagandinskaya']] },
  'kostanayskaya': { password: 'kos2025', regions: [REGION_MAP['kostanayskaya']] },
  'kyzylordinskaya': { password: 'kyz2025', regions: [REGION_MAP['kyzylordinskaya']] },
  'mangistauskaya': { password: 'man2025', regions: [REGION_MAP['mangistauskaya']] },
  'pavlodarskaya': { password: 'pav2025', regions: [REGION_MAP['pavlodarskaya']] },
  'sko': { password: 'sko2025', regions: [REGION_MAP['sko']] },
  'yuzhno-kazahstanskaya': { password: 'yuz2025', regions: [REGION_MAP['yuzhno-kazahstanskaya']] },
  'abay': { password: 'abay2025', regions: [REGION_MAP['abay']] },
  'ulytau': { password: 'uly2025', regions: [REGION_MAP['ulytau']] },
  'zhetysu': { password: 'zhet2025', regions: [REGION_MAP['zhetysu']] },
  'almaty': { password: 'alm2025', regions: [REGION_MAP['almaty']] },
  'astana': { password: 'ast2025', regions: [REGION_MAP['astana']] },
  'shymkent': { password: 'shy2025', regions: [REGION_MAP['shymkent']] },
  'user': { password: 'user2025', regions: [REGION_MAP['admin']] }
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    expiresAt: null,
    allowedRegions: [],
    username: ''
  }),
  
  getters: {
    isLoggedIn(): boolean {
      if (!this.isAuthenticated || !this.expiresAt) return false;
      return this.isAuthenticated && Date.now() < this.expiresAt;
    },
    
    getAllowedRegions(): RegionAccess[] {
      return this.allowedRegions;
    },
    
    hasAccessToRegion() {
      return (regionId: number): boolean => {
        if (this.allowedRegions.some(region => region.id_reg === 0)) {
          return true;
        }
        return this.allowedRegions.some(region => region.id_reg === regionId);
      };
    },
    
    getUserName(): string {
      return this.username;
    }
  },
  
  actions: {
    login(username: string, password: string): boolean {
      if (REGION_CREDENTIALS[username as keyof typeof REGION_CREDENTIALS]?.password === password) {
        this.isAuthenticated = true;
        this.expiresAt = Date.now() + 2 * 60 * 60 * 1000;
        this.allowedRegions = REGION_CREDENTIALS[username as keyof typeof REGION_CREDENTIALS].regions;
        this.username = username;
        
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: this.isAuthenticated,
          expiresAt: this.expiresAt,
          allowedRegions: this.allowedRegions,
          username: this.username
        }));
        
        return true;
      }
      return false;
    },
    
    logout() {
      this.isAuthenticated = false;
      this.expiresAt = null;
      this.allowedRegions = [];
      this.username = '';
      localStorage.removeItem('auth');
    },
    
    checkAuth() {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const { isAuthenticated, expiresAt, allowedRegions, username } = JSON.parse(savedAuth);
        if (isAuthenticated && expiresAt && Date.now() < expiresAt) {
          this.isAuthenticated = true;
          this.expiresAt = expiresAt;
          this.allowedRegions = allowedRegions || [];
          this.username = username || '';
          return true;
        } else {
          this.logout();
        }
      }
      return false;
    }
  }
}); 