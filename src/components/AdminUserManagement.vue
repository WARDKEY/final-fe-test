<template>
  <div class="user-management">
    <q-table :rows="users" :columns="columns" row-key="userId">
      <template v-slot:body-cell-isActive="props">
        <q-toggle
          v-model="props.row.isActive"
          @update:model-value="toggleUserStatus(props.row)"
          color="primary"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';

const users = ref([]);
const columns = [
  {
    name: 'userId',
    required: true,
    label: 'User ID',
    align: 'left',
    field: row => row.userId,
  },
  {
    name: 'username',
    label: 'Username',
    align: 'left',
    field: row => row.username,
  },
  {
    name: 'prefLocation',
    label: 'Preferred Location',
    align: 'left',
    field: row => row.prefLocation,
  },
  {
    name: 'prefJob',
    label: 'Preferred Job',
    align: 'left',
    field: row => row.prefJob,
  },
  {
    name: 'isActive',
    label: 'Active',
    align: 'center',
    field: row => row.isActive,
    sortable: true,
  },
];

const fetchUsers = async () => {
  try {
    const response = await customApi.get('/admin/users');
    users.value = response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const toggleUserStatus = async user => {
  try {
    await customApi.patch(`/admin/user/${user.userId}`, {
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Failed to update user status:', error);
    user.isActive = !user.isActive; // Revert toggle on error
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
