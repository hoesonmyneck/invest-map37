<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.store';

const username = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();
const showRegionHelp = ref(false);

const availableRegions = reactive([
  { key: 'admin', label: 'Администратор (все регионы)' },
  { key: 'user', label: 'Пользователь (все регионы)' },
  { key: 'akmolinskaya', label: 'Акмолинская область' },
  { key: 'aktubinskaya', label: 'Актюбинская область' },
  { key: 'almatinskaya', label: 'Алматинская область' },
  { key: 'atyrauskaya', label: 'Атырауская область' },
  { key: 'vko', label: 'Восточно-Казахстанская область' },
  { key: 'zhambylskaya', label: 'Жамбылская область' },
  { key: 'zko', label: 'Западно-Казахстанская область' },
  { key: 'karagandinskaya', label: 'Карагандинская область' },
  { key: 'kostanayskaya', label: 'Костанайская область' },
  { key: 'kyzylordinskaya', label: 'Кызылординская область' },
  { key: 'mangistauskaya', label: 'Мангистауская область' },
  { key: 'pavlodarskaya', label: 'Павлодарская область' },
  { key: 'sko', label: 'Северо-Казахстанская область' },
  { key: 'yuzhno-kazahstanskaya', label: 'Туркестанская область' },
  { key: 'almaty', label: 'г. Алматы' },
  { key: 'astana', label: 'г. Астана' },
  { key: 'shymkent', label: 'г. Шымкент' },
]);

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

const selectRegion = (region: string) => {
  username.value = region;
  password.value = '';
};

const toggleRegionHelp = () => {
  showRegionHelp.value = !showRegionHelp.value;
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
        
        <div class="mt-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300 cursor-pointer hover:text-blue-400" @click="toggleRegionHelp">
              Выбрать регион для входа
            </span>
          </div>
          
          <div v-if="showRegionHelp" class="mt-3 bg-gray-700 p-3 rounded-md">
            <h3 class="text-white text-sm font-medium mb-2">Выберите регион:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              <button
                v-for="region in availableRegions"
                :key="region.key"
                @click="selectRegion(region.key)"
                class="text-xs text-left text-white bg-gray-600 hover:bg-blue-600 px-2 py-1 rounded"
              >
                {{ region.label }}
              </button>
            </div>
            <div class="mt-2 text-xs text-gray-400">
              После выбора региона, нажмите "Войти" для авторизации. Вы получите доступ только к данным выбранного региона.
            </div>
            <div class="mt-2 text-xs text-white bg-blue-800 p-2 rounded">
              <b>Важно:</b> При входе с учетной записью определенной области, вы будете видеть данные только по этой области во всех отчетах и картах.
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 