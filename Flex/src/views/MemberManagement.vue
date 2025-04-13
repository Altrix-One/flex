<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useVirtualList, useDebounceFn } from '@vueuse/core';

interface Member {
  id: string;
  name: string;
  email: string;
  status: string;
  membershipType: string;
  joinDate: string;
}

const viewMode = ref<'list' | 'grid'>('list');
const searchQuery = ref('');
const members = ref<Member[]>([]);
const selectedMembers = ref<Set<string>>(new Set());

// Virtual list setup for performance
const { list, containerProps, wrapperProps } = useVirtualList(
  members,
  {
    itemHeight: 64,
  }
);

// Filter members based on search query
const filteredMembers = computed(() => {
  return members.value.filter(member =>
    member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Debounced search
const debouncedSearch = useDebounceFn(async (query: string) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/method/gym_management.api.search_members?query=${query}`);
    const data = await response.json();
    members.value = data.message;
  } catch (error) {
    console.error('Error searching members:', error);
  }
}, 300);

// Bulk actions
const handleBulkAction = async (action: string) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    await fetch(`${apiUrl}/api/method/gym_management.api.bulk_member_action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        members: Array.from(selectedMembers.value)
      })
    });
    // Refresh member list
    await fetchMembers();
  } catch (error) {
    console.error('Error performing bulk action:', error);
  }
};

// Export functionality
const exportMembers = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/method/gym_management.api.export_members`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
  } catch (error) {
    console.error('Error exporting members:', error);
  }
};

// Initial fetch
const fetchMembers = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/method/gym_management.api.get_members`);
    const data = await response.json();
    members.value = data.message;
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<template>
  <!-- Template remains the same as before -->
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Member Management</h1>
      <div class="flex items-center space-x-4">
        <!-- View toggle -->
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded"
            :class="{ 'bg-primary text-white': viewMode === 'list' }"
          >
            List
          </button>
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded"
            :class="{ 'bg-primary text-white': viewMode === 'grid' }"
          >
            Grid
          </button>
        </div>
        <button @click="exportMembers" class="btn btn-secondary">
          Export
        </button>
      </div>
    </div>

    <!-- Search and filters -->
    <div class="bg-white rounded-lg shadow-soft p-4">
      <input
        v-model="searchQuery"
        @input="debouncedSearch(searchQuery)"
        type="text"
        placeholder="Search members..."
        class="input"
      />
    </div>

    <!-- Bulk actions -->
    <div v-if="selectedMembers.size > 0" class="bg-white rounded-lg shadow-soft p-4">
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">{{ selectedMembers.size }} members selected</span>
        <button
          v-for="action in ['Activate', 'Deactivate', 'Delete']"
          :key="action"
          @click="handleBulkAction(action.toLowerCase())"
          class="btn btn-secondary"
        >
          {{ action }}
        </button>
      </div>
    </div>

    <!-- Member list -->
    <div class="bg-white rounded-lg shadow-soft">
      <div v-if="viewMode === 'list'" v-bind="containerProps" class="overflow-auto max-h-[600px]">
        <div v-bind="wrapperProps">
          <div
            v-for="{ data: member } in list"
            :key="member.id"
            class="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              :checked="selectedMembers.has(member.id)"
              @change="
                selectedMembers.has(member.id)
                  ? selectedMembers.delete(member.id)
                  : selectedMembers.add(member.id)
              "
              class="mr-4"
            />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
              <p class="text-sm text-gray-500">{{ member.email }}</p>
            </div>
            <div class="text-sm">
              <span
                class="px-2 py-1 rounded-full"
                :class="{
                  'bg-success/20 text-success': member.status === 'active',
                  'bg-error/20 text-error': member.status === 'inactive'
                }"
              >
                {{ member.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="bg-gray-50 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <input
              type="checkbox"
              :checked="selectedMembers.has(member.id)"
              @change="
                selectedMembers.has(member.id)
                  ? selectedMembers.delete(member.id)
                  : selectedMembers.add(member.id)
              "
            />
            <span
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-success/20 text-success': member.status === 'active',
                'bg-error/20 text-error': member.status === 'inactive'
              }"
            >
              {{ member.status }}
            </span>
          </div>
          <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
          <p class="text-sm text-gray-500">{{ member.email }}</p>
          <p class="text-sm text-gray-500 mt-2">
            Membership: {{ member.membershipType }}
          </p>
          <p class="text-sm text-gray-500">
            Joined: {{ new Date(member.joinDate).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
