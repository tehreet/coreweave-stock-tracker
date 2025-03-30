<template>
  <div>
    <h1>Hello World!</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  message: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
h1 {
  color: lightgreen;
}
p {
  color: lightblue;
}
</style>
