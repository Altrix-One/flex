<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex">
      <!-- Left side with illustration -->
      <div class="w-1/2 bg-primary-gradient hidden md:block relative">
      <img 
      src="https://www.cohenix.com/pexels-goumbik-669585.jpg" 
      alt="Fitness illustration"
      class="w-full h-full object-cover"
    />
      </div>

      <!-- Right side with login form -->
      <div class="w-full md:w-1/2 p-8 md:p-12">
        <div class="space-y-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p class="text-gray-500 mt-2">Sign in to your account below</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                v-model="email"
                type="text"
                required
                class="input"
                placeholder="Enter username (Admin)"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="input"
                placeholder="Enter password (admin)"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary/20">
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" class="text-sm text-primary hover:text-primary-dark">Forgot password?</a>
            </div>

            <div v-if="error" class="p-3 rounded-lg bg-error/10 text-error text-sm">
              {{ error }}
            </div>

            <button
              type="submit"
              class="btn w-full bg-primary-gradient hover:opacity-90 text-white font-medium py-2.5"
              :disabled="loading"
            >
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>

            <p class="text-center text-sm text-gray-500">
              Don't have an account? 
              <a href="#" class="text-primary hover:text-primary-dark font-medium">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = 'Invalid credentials. Use Admin/admin to login';
  } finally {
    loading.value = false;
  }
};
</script>