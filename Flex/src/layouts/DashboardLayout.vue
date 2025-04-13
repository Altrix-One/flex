<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div 
      class="bg-white border-r border-gray-100 shadow-sm transition-all duration-300 flex flex-col"
      :class="[isSidebarOpen ? 'w-64' : 'w-20']"
    >
      <!-- Logo Section -->
      <div class="p-4 flex items-center justify-center border-b border-gray-100">
        <div class="flex items-center gap-3">
          <img src="../assets/logo.svg" alt="Fitness Logo" class="w-10 h-10" />
          <h1 
            class="text-xl font-bold bg-primary-gradient bg-clip-text text-transparent transition-opacity duration-300"
            :class="[isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0']"
          >
            Gym Manager
          </h1>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          v-for="link in navigationLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link group relative"
          :class="{ 'nav-link-active': $route.path === link.path }"
        >
          <component :is="link.icon" class="w-6 h-6" />
          <span 
            class="transition-all duration-300"
            :class="[isSidebarOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0']"
          >
            {{ link.name }}
          </span>
          
          <!-- Tooltip for collapsed state -->
          <div
            v-if="!isSidebarOpen"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          >
            {{ link.name }}
          </div>
        </router-link>
      </nav>

      <!-- Sidebar Toggle -->
      <div class="p-4 border-t border-gray-100">
        <button 
          @click="toggleSidebar"
          class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronDoubleLeftIcon 
            class="w-6 h-6 text-gray-600 transition-transform duration-300"
            :class="{ 'rotate-180': !isSidebarOpen }"
          />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navigation -->
      <header class="bg-white border-b border-gray-100 shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span class="font-medium text-gray-900">{{ $route.name }}</span>
          </div>

          <!-- User Profile Dropdown -->
          <Menu as="div" class="relative">
            <MenuButton class="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
              <img
                :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=4169E1&color=fff`"
                class="w-8 h-8 rounded-lg"
                alt="User avatar"
              />
              <span class="font-medium">{{ authStore.user?.name }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </MenuButton>

            <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign out
              </button>
            </MenuItems>
          </Menu>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isSidebarOpen = ref(true);

const navigationLinks = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Members', path: '/members', icon: UserGroupIcon },
  { name: 'Classes', path: '/classes', icon: CalendarIcon },
  { name: 'Payments', path: '/payments', icon: CreditCardIcon }
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = async () => {
  await authStore.logout();
};
</script>