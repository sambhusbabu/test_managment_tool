<template>
    <section class="home">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>

        <label>
            Message
            <input v-model="message" placeholder="Type a message" />
        </label>

        <div class="controls">
            <button @click="reset">Reset</button>
            <span class="meta">Length: {{ messageLength }}</span>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const title = 'Test App — Home'
const subtitle = 'A minimal Vue single-file component'
const message = ref('Welcome to the test app')

const reset = () => (message.value = 'Welcome to the test app')
const messageLength = computed(() => message.value.length)
</script>

<style scoped>
.home {
    max-width: 640px;
    margin: 24px auto;
    padding: 16px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #333;
}

h1 {
    margin: 0 0 8px;
    font-size: 1.5rem;
}

.subtitle {
    margin: 0 0 16px;
    color: #666;
    font-size: 0.95rem;
}

label {
    display: block;
    margin-bottom: 12px;
}

input {
    display: block;
    width: 100%;
    padding: 8px;
    margin-top: 6px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
}

button {
    padding: 8px 12px;
    border: none;
    background: #0069ff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #0057d9;
}

.meta {
    color: #666;
    font-size: 0.9rem;
}
</style>