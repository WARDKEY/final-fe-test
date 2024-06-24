<template>
  <div class="pagination-container">
    <q-btn
      dense
      flat
      round
      icon="first_page"
      @click="toFirstPage"
      :disable="currentPage === 1"
    />
    <q-btn
      dense
      flat
      round
      icon="chevron_left"
      @click="prevPage"
      :disable="currentPage === 1"
    />

    <q-btn
      v-for="n in pagesInSet"
      :key="n"
      dense
      flat
      round
      :label="startPage + n"
      @click="setPage(startPage + n)"
      :color="currentPage === startPage + n ? 'primary' : 'grey'"
    />

    <q-btn
      dense
      flat
      round
      icon="chevron_right"
      @click="nextPage"
      :disable="currentPage === totalPages"
    />
    <q-btn
      dense
      flat
      round
      icon="last_page"
      @click="toLastPage"
      :disable="currentPage === totalPages"
    />
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },
  computed: {
    currentPage() {
      return this.modelValue;
    },
    startPage() {
      return Math.floor((this.currentPage - 1) / 5) * 5;
    },
    pagesInSet() {
      return Math.min(5, this.totalPages - this.startPage + 1);
    },
  },
  methods: {
    setPage(page) {
      this.$emit('update:modelValue', page);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    },
    toFirstPage() {
      this.setPage(1);
    },
    toLastPage() {
      this.setPage(this.totalPages);
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
