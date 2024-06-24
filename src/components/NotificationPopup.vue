<template>
  <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
    <q-card class="q-popup-plugin">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="notifications" /> 새소식
          <q-badge color="red">{{ unreadCount }}</q-badge>
        </div>
      </q-card-section>

      <q-list separator class="notifications-list">
        <q-item
          v-for="notification in notifications.slice(0, 7)"
          :key="notification.id"
          clickable
          v-ripple
          @click="markAsRead(notification)"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="notification.avatar" alt="Profile" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="notification-text">
              <strong>{{ notification.user }}</strong
              >님이 <strong>{{ notification.target }}</strong
              >에게 알림을 보냈습니다.
            </q-item-label>
            <q-item-label caption>{{ notification.time }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-badge v-if="!notification.read" color="red" floating />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn flat label="닫기" color="primary" @click="closePopup" />
      </q-card-actions>
    </q-card>
  </q-popup-proxy>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
});

const popup = ref(null);
const unreadCount = computed(
  () => props.notifications.filter(n => !n.read).length,
);

function closePopup() {
  if (popup.value) {
    popup.value.hide();
  }
}

function markAsRead(notification) {
  notification.read = true;
  // 트리거링하여 부모 컴포넌트에서 변경사항을 감지하게 함
  popup.value.$emit('notification-updated', unreadCount.value);
}
</script>

<style scoped>
.q-popup-plugin {
  width: 350px;
}

.q-badge {
  margin-left: 10px;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

.q-item-section[avatar] {
  width: 50px;
}

.q-item-section img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

.notification-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.q-item-label {
  display: block;
}

.q-item-label[caption] {
  font-size: 0.8rem;
  color: gray;
}
</style>
