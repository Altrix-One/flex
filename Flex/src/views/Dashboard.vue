<template>
  <div class="space-y-6 transition-all duration-300" :class="{ 'dark': isDark }">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" 
           class="stat-card backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 transform hover:scale-102 transition-all duration-300">
        <div class="flex items-center justify-between">
          <span class="stat-label dark:text-gray-300">{{ stat.label }}</span>
          <component :is="stat.icon" class="w-6 h-6 text-primary" />
        </div>
        <div v-if="loading" class="animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <span v-else class="stat-value dark:text-white">
          {{ stat.prefix }}{{ stat.value }}{{ stat.suffix }}
        </span>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}% from last month
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Membership Growth -->
      <div class="card backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Membership Growth</h3>
        <div v-if="loading" class="animate-pulse">
          <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <apexchart
          v-else
          type="line"
          height="320"
          :options="membershipChartOptions"
          :series="membershipChartSeries"
        />
      </div>

      <!-- Payment Distribution -->
      <div class="card backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Payment Distribution</h3>
        <div v-if="loading" class="animate-pulse">
          <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <apexchart
          v-else
          type="donut"
          height="320"
          :options="paymentChartOptions"
          :series="paymentChartSeries"
        />
      </div>
    </div>

    <!-- Class Attendance Heatmap -->
    <div class="card backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">Weekly Class Attendance</h3>
      <div v-if="loading" class="animate-pulse">
        <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <apexchart
        v-else
        type="heatmap"
        height="320"
        :options="attendanceChartOptions"
        :series="attendanceChartSeries"
      />
    </div>

    <!-- Quick Actions -->
    <div class="card backdrop-blur-xl bg-white/70 dark:bg-gray-800/70">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.name"
          class="btn btn-primary transform hover:scale-102 transition-all duration-300"
          @click="handleQuickAction(action.route)"
        >
          <component :is="action.icon" class="w-5 h-5" />
          {{ action.name }}
        </button>
      </div>
    </div>
  </div>

  <!-- Theme Toggle -->
  <button
    @click="toggleTheme"
    class="fixed bottom-4 right-4 p-3 rounded-full bg-primary-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <SunIcon v-if="isDark" class="w-6 h-6" />
    <MoonIcon v-else class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline';
import { useStorage } from '@vueuse/core';

// Theme
const isDark = useStorage('isDark', false);
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// Router
const router = useRouter();

// Loading state
const loading = ref(true);

// Stats data
const stats = ref([
  {
    label: 'Total Members',
    value: 150,
    prefix: '',
    suffix: '',
    change: 12,
    icon: UserGroupIcon
  },
  {
    label: 'Active Classes',
    value: 12,
    prefix: '',
    suffix: '',
    change: 8,
    icon: CalendarIcon
  },
  {
    label: 'Monthly Revenue',
    value: 15000,
    prefix: '$',
    suffix: '',
    change: 15,
    icon: CurrencyDollarIcon
  },
  {
    label: "Today's Attendance",
    value: 45,
    prefix: '',
    suffix: '%',
    change: 5,
    icon: ClockIcon
  }
]);

// Quick actions
const quickActions = [
  { name: 'Add Member', route: '/members', icon: UserPlusIcon },
  { name: 'Schedule Class', route: '/classes', icon: CalendarDaysIcon },
  { name: 'Record Payment', route: '/payments', icon: CreditCardIcon },
  { name: 'Generate Report', route: '/reports', icon: DocumentChartBarIcon }
];

// Chart configurations
const membershipChartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false
    },
    foreColor: isDark.value ? '#fff' : '#374151'
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  }
};

const membershipChartSeries = [{
  name: 'Members',
  data: [30, 40, 45, 50, 49, 60]
}];

const paymentChartOptions = {
  labels: ['Paid', 'Pending', 'Overdue'],
  colors: ['#4169E1', '#F8CA57', '#CE181E'],
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  }
};

const paymentChartSeries = [65, 25, 10];

const attendanceChartOptions = {
  chart: {
    type: 'heatmap',
    toolbar: {
      show: false
    },
    foreColor: isDark.value ? '#fff' : '#374151'
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
};

const attendanceChartSeries = [
  {
    name: 'Morning',
    data: generateHeatmapData()
  },
  {
    name: 'Afternoon',
    data: generateHeatmapData()
  },
  {
    name: 'Evening',
    data: generateHeatmapData()
  }
];

function generateHeatmapData() {
  return Array.from({ length: 7 }, () => ({
    x: '',
    y: Math.floor(Math.random() * 50) + 10
  }));
}

// Navigation
const handleQuickAction = (route: string) => {
  router.push(route);
};

// Lifecycle
onMounted(async () => {
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});
</script>

<style>
.scale-102 {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>