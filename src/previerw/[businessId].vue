<template>
  <div class="preview-container" :style="themeStyles">
    <!-- Preview Header Banner -->
    <div class="preview-banner">
      <span>🎨 Theme Preview Mode</span>
      <button @click="applyTheme" class="apply-btn">Apply Theme</button>
      <button @click="closePreview" class="close-btn">Close</button>
    </div>

    <!-- Your actual booking page content here -->
    <div class="preview-content">
      <!-- Logo Preview -->
      <header class="preview-header">
        <img 
          v-if="theme?.logo?.url" 
          :src="theme.logo.url" 
          :alt="theme.logo.alt || 'Logo'"
          :style="{ width: theme.logo.width + 'px', height: theme.logo.height + 'px' }"
          class="logo"
        />
        <h1>{{ businessName || 'Your Business Name' }}</h1>
      </header>

      <!-- Sample UI Elements to Preview Theme -->
      <main class="preview-main">
        <section class="preview-section">
          <h2>Theme Preview</h2>
          <p>This is how your booking page will look with the selected theme.</p>
          
          <!-- Color Swatches -->
          <div class="color-swatches">
            <div class="swatch" :style="{ backgroundColor: theme?.colors?.primary }">
              <span>Primary</span>
            </div>
            <div class="swatch" :style="{ backgroundColor: theme?.colors?.secondary }">
              <span>Secondary</span>
            </div>
            <div class="swatch" :style="{ backgroundColor: theme?.colors?.accent }">
              <span>Accent</span>
            </div>
            <div class="swatch" :style="{ backgroundColor: theme?.colors?.success }">
              <span>Success</span>
            </div>
            <div class="swatch" :style="{ backgroundColor: theme?.colors?.error }">
              <span>Error</span>
            </div>
          </div>

          <!-- Sample Buttons -->
          <div class="button-preview">
            <button class="btn-primary">Book Appointment</button>
            <button class="btn-secondary">View Services</button>
            <button class="btn-accent">Special Offer</button>
          </div>

          <!-- Sample Card -->
          <div class="sample-card">
            <h3>Sample Service</h3>
            <p>This is how service cards will appear on your booking page.</p>
            <div class="card-footer">
              <span class="price">$99.00</span>
              <button class="btn-primary">Book Now</button>
            </div>
          </div>

          <!-- Typography Preview -->
          <div class="typography-preview">
            <h1>Heading 1 - {{ theme?.typography?.headingFont }}</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Body text using {{ theme?.typography?.bodyFont }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  error: string
  success: string
}

interface ThemeTypography {
  fontFamily: string
  headingFont: string
  bodyFont: string
}

interface ThemeLogo {
  url: string
  width: number
  height: number
  alt: string
}

interface Theme {
  colors: ThemeColors
  typography: ThemeTypography
  logo?: ThemeLogo
  favicon?: { url: string }
  customCss?: { enabled: boolean; cssCode: string }
}

const route = useRoute()
const router = useRouter()

const theme = ref<Theme | null>(null)
const businessId = computed(() => route.params.businessId as string)
const businessName = ref('Your Business')

// Parse theme from base64 URL parameter
onMounted(() => {
  const themeParam = route.query.theme as string
  
  if (themeParam) {
    try {
      const decoded = atob(themeParam)
      theme.value = JSON.parse(decoded)
      
      // Apply favicon if present
      if (theme.value?.favicon?.url) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
        link.type = 'image/x-icon'
        link.rel = 'shortcut icon'
        link.href = theme.value.favicon.url
        document.getElementsByTagName('head')[0].appendChild(link)
      }
      
      // Inject custom CSS if enabled
      if (theme.value?.customCss?.enabled && theme.value?.customCss?.cssCode) {
        const style = document.createElement('style')
        style.id = 'theme-custom-css'
        style.textContent = theme.value.customCss.cssCode
        document.head.appendChild(style)
      }
    } catch (e) {
      console.error('Failed to parse theme:', e)
    }
  }
})

// Generate inline CSS variables
const themeStyles = computed(() => {
  if (!theme.value) return {}
  
  const { colors, typography } = theme.value
  
  return {
    '--color-primary': colors?.primary || '#3B82F6',
    '--color-secondary': colors?.secondary || '#10B981',
    '--color-accent': colors?.accent || '#F59E0B',
    '--color-background': colors?.background || '#FFFFFF',
    '--color-text': colors?.text || '#1F2937',
    '--color-error': colors?.error || '#EF4444',
    '--color-success': colors?.success || '#10B981',
    '--font-family': typography?.fontFamily || 'Inter, sans-serif',
    '--font-heading': typography?.headingFont || 'Inter, sans-serif',
    '--font-body': typography?.bodyFont || 'Inter, sans-serif',
    backgroundColor: colors?.background || '#FFFFFF',
    color: colors?.text || '#1F2937',
    fontFamily: typography?.fontFamily || 'Inter, sans-serif',
  }
})

// Apply theme (save to backend)
const applyTheme = async () => {
  if (!theme.value) return
  
  try {
    // Call your API to save the theme
    // await $fetch('/api/branding/theme', {
    //   method: 'POST',
    //   body: theme.value
    // })
    
    alert('Theme applied successfully!')
    window.close() // Close preview window
  } catch (e) {
    console.error('Failed to apply theme:', e)
  }
}

// Close preview
const closePreview = () => {
  window.close()
  // Or navigate back
  // router.back()
}
</script>

<style scoped>
.preview-container {
  min-height: 100vh;
  padding-top: 50px;
}

.preview-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 9999;
  font-weight: 600;
}

.preview-banner .apply-btn {
  background: #10B981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.preview-banner .close-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.preview-header {
  text-align: center;
  padding: 40px 20px;
  border-bottom: 1px solid #eee;
}

.preview-header .logo {
  margin-bottom: 20px;
  object-fit: contain;
}

.preview-header h1 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin: 0;
}

.preview-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.preview-section h2 {
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-bottom: 20px;
}

.color-swatches {
  display: flex;
  gap: 16px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.swatch {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.swatch span {
  background: rgba(255,255,255,0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.button-preview {
  display: flex;
  gap: 16px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.sample-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin: 30px 0;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.sample-card h3 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.sample-card p {
  font-family: var(--font-body);
  color: #6b7280;
  margin: 0 0 20px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.typography-preview {
  margin-top: 40px;
  padding: 30px;
  background: #f9fafb;
  border-radius: 16px;
}

.typography-preview h1 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview h2 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview h3 {
  font-family: var(--font-heading);
  color: var(--color-text);
}

.typography-preview p {
  font-family: var(--font-body);
  color: var(--color-text);
  line-height: 1.6;
}
</style>