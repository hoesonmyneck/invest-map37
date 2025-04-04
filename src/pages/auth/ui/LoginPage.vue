<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.store';

const username = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const login = () => {
  if (username.value.trim() === '' || password.value.trim() === '') {
    error.value = 'Пожалуйста, введите логин и пароль';
    return;
  }
  
  if (authStore.login(username.value, password.value)) {
    router.push('/');
  } else {
    error.value = 'Неверный логин или пароль';
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6 text-white">Авторизация</h1>
      
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300">Логин</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите логин"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите пароль"
          />
        </div>
        
        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>
        
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 