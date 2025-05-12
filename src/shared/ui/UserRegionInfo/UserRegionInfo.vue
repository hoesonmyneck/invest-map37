<template>
  <div class="user-region-info p-2 rounded-md bg-gray-800 text-white flex items-center">
    <div class="mr-3">
      <UserOutlined class="text-gray-300" />
    </div>
    <div class="flex flex-col text-sm">
      <div class="font-medium">{{ userName }}</div>
      <div class="text-xs text-gray-400">
        Доступ к регионам: 
        <a-tooltip v-if="allowedRegions.length" placement="bottom">
          <template #title>
            <div class="text-xs max-w-xs">
              <div v-for="region in allowedRegions" :key="region.id_reg">
                {{ region.name }}
              </div>
            </div>
          </template>
          <span class="text-blue-400 cursor-help">{{ allowedRegionsText }}</span>
        </a-tooltip>
        <span v-else>Нет доступа</span>
      </div>
    </div>
    <div class="ml-3">
      <a-button type="text" size="small" @click="logout" class="text-gray-300 hover:text-white">
        <LogoutOutlined />
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.store';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const router = useRouter();

const userName = computed(() => {
  return authStore.getUserName || 'Гость';
});

const allowedRegions = computed(() => {
  return authStore.getAllowedRegions || [];
});

const allowedRegionsText = computed(() => {
  if (allowedRegions.value.length === 0) {
    return 'Нет доступа';
  }
  
  if (allowedRegions.value.some(region => region.id_reg === 0)) {
    return 'Все регионы';
  }
  
  if (allowedRegions.value.length === 1) {
    return allowedRegions.value[0].name;
  }
  
  return `${allowedRegions.value.length} регионов`;
});

const logout = () => {
  authStore.logout();
  router.push('/auth');
};
</script>

<style scoped>
.user-region-info {
  min-width: 200px;
}
</style> 