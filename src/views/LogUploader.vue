<template>
  <div class="uploader-container">
    <h2>Upload Log File</h2>

    <form @submit.prevent="uploadFile">
      <!-- Optional Log Name -->
      <div class="form-group">
        <label for="logName">Log Name (optional)</label>
        <input
          type="text"
          id="logName"
          v-model="logName"
          placeholder="Enter log name"
        />
      </div>

      <!-- File Input -->
      <div class="form-group">
        <label for="file">Select a log file:</label>
        <input
          type="file"
          id="file"
          @change="handleFileChange"
          accept=".txt,.log"
          required
        />
      </div>

      <button class="button" type="submit" :disabled="isUploading">
        {{ isUploading ? "Uploading..." : "Upload" }}
      </button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const selectedFile = ref(null)
const logName = ref('') // 👈 new optional field
const message = ref('')
const isUploading = ref(false)

function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}

async function uploadFile() {
  if (!selectedFile.value) {
    message.value = 'Please select a file first.'
    return
  }

  try {
    isUploading.value = true
    message.value = ''

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    if (logName.value.trim()) {
      formData.append('logName', logName.value.trim()) 
    }
 
    const response = await fetch('/api/log/upload', {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${auth.token}`, 
      }
    })

    if (!response.ok) throw new Error('Upload failed.')

    const data = await response.json()
    message.value = data.message || 'Upload successful!'
    router.push({ name: 'log', params: { logId: data.logId } })
  } catch (error) {
    console.error(error)
    message.value = 'Upload failed. Please try again.'
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.uploader-container {
  background-color: #1e1e1e;
  color: #f1f1f1;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  margin: 2rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
}

input[type='text'],
input[type='file'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #fff;
}

button {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

p {
  margin-top: 1rem;
  text-align: center;
}
</style>