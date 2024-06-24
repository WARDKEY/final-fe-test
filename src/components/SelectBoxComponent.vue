<template>
  <q-select
    v-model="innerValue"
    :options="options"
    :label="label"
    dense
    outlined
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number], // `String` 또는 `Number` 타입을 허용
  options: {
    type: Array,
    required: true,
  },
  label: String,
});

const emit = defineEmits(['update:modelValue']);
const innerValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  newValue => {
    innerValue.value = newValue;
  },
);
</script>

<style scoped>
.q-mt-md {
  margin-top: 1rem;
}
.full-width {
  width: 100%;
}
</style>
