<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-primary-50 p-4">
    <!-- Frappe-compatible header -->
    <div class="max-w-7xl mx-auto">
      <header class="mb-8">
        <div class="flex justify-between items-center py-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <i class="fa fa-cube text-white"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">{{ appTitle }}</h1>
          </div>
          
          <!-- Frappe-style navigation -->
          <nav class="flex space-x-4">
            <button @click="showPage('dashboard')" 
                    :class="`px-4 py-2 rounded-lg font-medium ${activePage === 'dashboard' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`">
              Dashboard
            </button>
            <button @click="showPage('list')" 
                    :class="`px-4 py-2 rounded-lg font-medium ${activePage === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`">
              List View
            </button>
            <button @click="showPage('form')" 
                    :class="`px-4 py-2 rounded-lg font-medium ${activePage === 'form' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`">
              Form
            </button>
          </nav>
        </div>
      </header>

      <!-- Main content -->
      <main>
        <!-- Frappe-style breadcrumb -->
        <div class="mb-6">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
                  <i class="fa fa-home mr-2"></i>
                  Home
                </a>
              </li>
              <li aria-current="page">
                <div class="flex items-center">
                  <i class="fa fa-angle-right text-gray-400 mx-2"></i>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ activePageTitle }}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <!-- Dashboard Stats (Frappe-style) -->
        <div v-if="activePage === 'dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="stat in stats" :key="stat.label" 
               class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div :class="`p-3 rounded-lg ${stat.bgColor} mr-4`">
                <i :class="`fa fa-${stat.icon} text-white text-lg`"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                <p class="text-xs mt-1" :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'">
                  <i :class="`fa fa-${stat.trend === 'up' ? 'arrow-up' : 'arrow-down'} mr-1`"></i>
                  {{ stat.change }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Frappe-style Form -->
        <div v-if="activePage === 'form'" class="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Create New Record</h3>
          
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input v-model="form.title" 
                     type="text" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                     placeholder="Enter title...">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="form.status" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none">
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea v-model="form.description" 
                        rows="4" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                        placeholder="Enter description..."></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" 
                      @click="resetForm"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Reset
              </button>
              <button type="submit" 
                      class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                Submit
              </button>
            </div>
          </form>
        </div>

        <!-- Frappe-style List View -->
        <div v-if="activePage === 'list'" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Records</h3>
            <button @click="refreshList"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
              <i class="fa fa-refresh mr-2"></i>Refresh
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="col in columns" :key="col.key" 
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ col.label }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in listItems" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.title }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span :class="`px-2 py-1 text-xs rounded-full ${getStatusClass(item.status)}`">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.modified) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.owner }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editItem(item)" class="text-primary-600 hover:text-primary-900 mr-4">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button @click="deleteItem(item)" class="text-red-600 hover:text-red-900">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Frappe-style pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">{{ listItems.length }}</span> results
            </div>
            <div class="flex space-x-2">
              <button class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
                1
              </button>
              <button class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Frappe-style toast notification -->
    <div v-if="showToast" 
         :class="`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg flex items-center ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white max-w-sm`">
      <i :class="`fa fa-${toastType === 'success' ? 'check-circle' : 'exclamation-circle'} mr-3`"></i>
      <span>{{ toastMessage }}</span>
      <button @click="showToast = false" class="ml-4">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state
const activePage = ref('dashboard')
const appTitle = ref('Modern Frappe App')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const form = ref({
  title: '',
  status: 'Draft',
  description: ''
})

const stats = ref([
  { label: 'Total Records', value: '1,234', change: '+12%', trend: 'up', icon: 'file-text', bgColor: 'bg-blue-500' },
  { label: 'Active Users', value: '48', change: '+5%', trend: 'up', icon: 'users', bgColor: 'bg-green-500' },
  { label: 'Revenue', value: '$24.5K', change: '-1.2%', trend: 'down', icon: 'dollar', bgColor: 'bg-amber-500' },
  { label: 'Completion Rate', value: '78%', change: '+3%', trend: 'up', icon: 'check-circle', bgColor: 'bg-purple-500' }
])

const columns = ref([
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'modified', label: 'Last Modified' },
  { key: 'owner', label: 'Owner' }
])

const listItems = ref([
  { id: 1, title: 'Annual Report 2023', status: 'Submitted', modified: '2023-12-01', owner: 'Administrator' },
  { id: 2, title: 'Project Proposal', status: 'Draft', modified: '2023-12-02', owner: 'john.doe@example.com' },
  { id: 3, title: 'Meeting Minutes', status: 'Submitted', modified: '2023-12-03', owner: 'jane.doe@example.com' },
  { id: 4, title: 'Budget Planning', status: 'Cancelled', modified: '2023-12-04', owner: 'Administrator' },
  { id: 5, title: 'Client Presentation', status: 'Draft', modified: '2023-12-05', owner: 'john.doe@example.com' }
])

// Computed properties
const activePageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    list: 'List View',
    form: 'New Form'
  }
  return titles[activePage.value] || 'Dashboard'
})

// Methods
const showPage = (page) => {
  activePage.value = page
}

const submitForm = () => {
  if (!form.value.title.trim()) {
    showNotification('Please enter a title', 'error')
    return
  }
  
  // Simulate API call
  setTimeout(() => {
    showNotification('Record created successfully!', 'success')
    resetForm()
  }, 500)
}

const resetForm = () => {
  form.value = {
    title: '',
    status: 'Draft',
    description: ''
  }
}

const editItem = (item) => {
  showNotification(`Editing: ${item.title}`, 'success')
}

const deleteItem = (item) => {
  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
    showNotification(`Deleted: ${item.title}`, 'success')
  }
}

const refreshList = () => {
  showNotification('List refreshed', 'success')
}

const getStatusClass = (status) => {
  const classes = {
    'Draft': 'bg-yellow-100 text-yellow-800',
    'Submitted': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const showNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Lifecycle hooks
onMounted(() => {
  console.log('Modern Frappe component mounted with Twind CSS')
})
</script>

<style>
/* Custom styles that integrate with Frappe */
/* .frappe-card {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
}

.frappe-btn {
  @apply px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.frappe-btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.frappe-btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
} */
</style>