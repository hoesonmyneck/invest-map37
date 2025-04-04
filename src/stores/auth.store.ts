import { defineStore } from 'pinia';

interface AuthState {
  isAuthenticated: boolean;
  expiresAt: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    expiresAt: null
  }),
  
  getters: {
    isLoggedIn(): boolean {
      if (!this.isAuthenticated || !this.expiresAt) return false;
      return this.isAuthenticated && Date.now() < this.expiresAt;
    }
  },
  
  actions: {
    login(username: string, password: string): boolean {
      if (username === 'admin' && password === '2025') {
        this.isAuthenticated = true;
    
        this.expiresAt = Date.now() + 2 * 60 * 60 * 1000;
        
        
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: this.isAuthenticated,
          expiresAt: this.expiresAt
        }));
        
        return true;
      }
      return false;
    },
    
    logout() {
      this.isAuthenticated = false;
      this.expiresAt = null;
      localStorage.removeItem('auth');
    },
    
    checkAuth() {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const { isAuthenticated, expiresAt } = JSON.parse(savedAuth);
        if (isAuthenticated && expiresAt && Date.now() < expiresAt) {
          this.isAuthenticated = true;
          this.expiresAt = expiresAt;
          return true;
        } else {
          this.logout();
        }
      }
      return false;
    }
  }
}); 