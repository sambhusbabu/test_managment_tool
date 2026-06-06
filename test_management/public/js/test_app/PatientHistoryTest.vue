<template>
  <div class="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
    <h1 class="text-2xl font-semibold mb-4">Dental Chart — SVG Dental Arch</h1>

    <div class="bg-white rounded-lg shadow p-6 w-full max-w-4xl">
        <svg viewBox="0 0 900 380" width="100%" height="380" role="img" aria-label="Dental chart">
          <defs>
            <!-- 3D gradients for tooth states -->
            <linearGradient id="grad-healthy" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="60%" stop-color="#f3f4f6" />
              <stop offset="100%" stop-color="#e6e7ea" />
            </linearGradient>
            <linearGradient id="grad-filled" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#fff7cc" />
              <stop offset="60%" stop-color="#fde68a" />
              <stop offset="100%" stop-color="#facc15" />
            </linearGradient>
            <linearGradient id="grad-missing" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#fecaca" />
              <stop offset="60%" stop-color="#fca5a5" />
              <stop offset="100%" stop-color="#ef4444" />
            </linearGradient>

            <!-- subtle inner shadow / bevel -->
            <filter id="bevel" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
              <feOffset in="blur" dx="0" dy="2" result="offset"/>
              <feComposite in="offset" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="comp"/>
              <feMerge>
                <feMergeNode in="comp"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Upper arch -->
          <g id="upper" transform="translate(0,40)">
            <text x="450" y="-10" text-anchor="middle" class="label">Upper Arch</text>
            <g v-for="(t) in upperTeeth" :key="t.number" class="tooth-group" :data-number="t.number">
              <g role="button" tabindex="0" @click="toggleTooth(t.number)" @keydown.enter.prevent="toggleTooth(t.number)">
                    <path :d="toothPath(t.x, t.y, t.w, t.h, t.number)"
                      :fill="`url(#${getFillId(t.number)})`"
                      :stroke="selected === t.number ? '#1e40af' : '#374151'" stroke-width="1.8" :filter="selected === t.number ? 'url(#bevel)' : ''"/>
                <path :d="occlusalPath(t.x, t.y, t.w, t.h)" :fill="'rgba(0,0,0,0.06)'" />
                <ellipse :cx="t.x + t.w*0.32" :cy="t.y + t.h*0.28" :rx="t.w*0.18" :ry="t.h*0.08" fill="rgba(255,255,255,0.85)" />
                <text :x="t.x + t.w/2" :y="t.y + t.h/2 + 4" text-anchor="middle" class="tooth-text">{{ t.label || t.number }}</text>
              </g>
            </g>
          </g>

          <!-- Lower arch -->
          <g id="lower" transform="translate(0,200)">
            <text x="450" y="-10" text-anchor="middle" class="label">Lower Arch</text>
            <g v-for="(t) in lowerTeeth" :key="t.number" class="tooth-group" :data-number="t.number">
              <g role="button" tabindex="0" @click="toggleTooth(t.number)" @keydown.enter.prevent="toggleTooth(t.number)">
                    <path :d="toothPath(t.x, t.y, t.w, t.h, t.number)"
                      :fill="`url(#${getFillId(t.number)})`"
                      :stroke="selected === t.number ? '#1e40af' : '#374151'" stroke-width="1.8" :filter="selected === t.number ? 'url(#bevel)' : ''"/>
                <path :d="occlusalPath(t.x, t.y, t.w, t.h)" :fill="'rgba(0,0,0,0.06)'" />
                <ellipse :cx="t.x + t.w*0.32" :cy="t.y + t.h*0.28" :rx="t.w*0.18" :ry="t.h*0.08" fill="rgba(255,255,255,0.85)" />
                <text :x="t.x + t.w/2" :y="t.y + t.h/2 + 4" text-anchor="middle" class="tooth-text">{{ t.label || t.number }}</text>
              </g>
            </g>
          </g>
        </svg>

      <div class="mt-4 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Click a tooth to cycle its state: <strong>Healthy → Filled → Missing</strong>.</p>
        </div>
        <div class="text-right">
          <p class="text-sm">Selected: <span class="font-medium text-primary-700">{{ selected || 'None' }}</span></p>
          <p class="text-sm">State: <span class="font-medium">{{ selectedStateLabel }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selected = ref(null)

// simple tooth states map: 0=healthy,1=filled,2=missing
const states = ref({})

// generate positions for 16 upper and 16 lower teeth
function makeTeeth(startNumber, count, yOffset) {
  const teeth = []
  const w = 36
  const h = 52
  const spacing = 8
  // center the row
  const totalWidth = count * w + (count - 1) * spacing
  const startX = 450 - totalWidth / 2

  for (let i = 0; i < count; i++) {
    const num = startNumber + i
    const x = startX + i * (w + spacing)
    teeth.push({ number: num, x, y: yOffset, w, h })
    if (states.value[num] === undefined) states.value[num] = 0
  }
  return teeth
}

// Universal numbering: upper 1-16, lower 17-32
const upperTeeth = makeTeeth(1, 16, 0)
const lowerTeeth = makeTeeth(17, 16, 0)

const toothType = (num) => {
  // Universal layout: 1-16 upper (right to left), 17-32 lower (left to right)
  const n = Number(num)
  // map to position within a quadrant (1..8 for each quadrant)
  let pos = n
  if (n >= 17) pos = 33 - n // lower left to right mapping (17->16..32->1)
  else pos = n
  // determine by common groups: molars(1,2,3 & 14,15,16), premolars(4,5 & 12,13), canines(6,11), incisors(7-10)
  if ([1,2,3,14,15,16,17,18,31,32].includes(n)) return 'molar'
  if ([4,5,12,13,20,21].includes(n)) return 'premolar'
  // more robust: use ranges
  if ((n >= 1 && n <= 3) || (n >= 14 && n <= 16) || (n >= 17 && n <= 19) || (n >= 30 && n <= 32)) return 'molar'
  if ((n === 4) || (n === 5) || (n === 12) || (n === 13) || (n === 20) || (n === 21) || (n === 28) || (n === 29)) return 'premolar'
  if (n === 6 || n === 11 || n === 22 || n === 27 || n === 18 || n === 23) return 'canine'
  return 'incisor'
}

// occlusal path: smaller inner shape to simulate occlusal surface shading
const occlusalPath = (x, y, w, h) => {
  const insetX = w * 0.12
  const insetY = h * 0.12
  return `M ${x + insetX} ${y + insetY + 4}
          Q ${x + w/2} ${y + insetY - 6} ${x + w - insetX} ${y + insetY + 4}
          Q ${x + w*0.85} ${y + h*0.45} ${x + w*0.6} ${y + h*0.5}
          Q ${x + w/2} ${y + h*0.44} ${x + w*0.4} ${y + h*0.5}
          Q ${x + insetX} ${y + h*0.45} ${x + insetX} ${y + insetY + 4}
          Z`
}

const getFillId = (num) => {
  const s = states.value[num] || 0
  if (s === 0) return 'grad-healthy'
  if (s === 1) return 'grad-filled'
  return 'grad-missing'
}

const toothPath = (x, y, w, h, num) => {
  const type = toothType(num)
  const cx = x + w / 2
  const top = y
  const mid = y + h * 0.45
  const bottom = y + h

  if (type === 'incisor') {
    // flatter, chisel-shaped crown
    return `M ${x + w*0.12} ${top + 6}
            Q ${cx} ${top - 4} ${x + w*0.88} ${top + 6}
            Q ${x + w*0.78} ${mid} ${x + w*0.6} ${bottom}
            L ${x + w*0.45} ${bottom}
            Q ${x + w*0.22} ${mid} ${x + w*0.12} ${top + 6}
            Z`
  }

  if (type === 'canine') {
    // pointed cusp
    return `M ${x + w*0.12} ${top + 6}
            Q ${cx} ${top - 8} ${x + w*0.88} ${top + 6}
            Q ${x + w*0.8} ${mid} ${x + w*0.65} ${bottom}
            L ${x + w*0.5} ${bottom}
            Q ${x + w*0.35} ${bottom} ${x + w*0.25} ${mid}
            Q ${x + w*0.18} ${mid*0.9} ${x + w*0.12} ${top + 6}
            Z`
  }

  if (type === 'premolar') {
    // two-cusp appearance
    return `M ${x + w*0.1} ${top + 8}
            Q ${x + w*0.35} ${top - 6} ${cx} ${top + 2}
            Q ${x + w*0.65} ${top - 6} ${x + w*0.9} ${top + 8}
            Q ${x + w*0.78} ${mid} ${x + w*0.62} ${bottom}
            L ${x + w*0.42} ${bottom}
            Q ${x + w*0.22} ${mid} ${x + w*0.1} ${top + 8}
            Z`
  }

  // molar (default): broad occlusal with rounded roots
  return `M ${x + w*0.08} ${top + 10}
          Q ${x + w*0.28} ${top - 6} ${x + w*0.5} ${top + 2}
          Q ${x + w*0.72} ${top - 6} ${x + w*0.92} ${top + 10}
          Q ${x + w*0.82} ${mid} ${x + w*0.68} ${bottom}
          L ${x + w*0.56} ${bottom}
          Q ${x + w*0.5} ${y + h*0.92} ${x + w*0.44} ${bottom}
          L ${x + w*0.32} ${bottom}
          Q ${x + w*0.18} ${mid} ${x + w*0.08} ${top + 10}
          Z`
}

const selectedStateLabel = computed(() => {
  if (!selected.value) return '—'
  const s = states.value[selected.value] || 0
  return s === 0 ? 'Healthy' : s === 1 ? 'Filled' : 'Missing'
})

const toggleTooth = (num) => {
  selected.value = num
  states.value[num] = ((states.value[num] || 0) + 1) % 3
}
</script>

<style scoped>
.label { font: 600 14px/1.2 'Inter', system-ui, -apple-system; fill: #374151 }
.tooth-text { font: 600 12px/1 'Inter', system-ui; fill: #111827; pointer-events: none }
.tooth-group { cursor: pointer }
.tooth-group:focus-within { outline: 3px solid rgba(59,130,246,0.15); border-radius: 6px }
.tooth-group:hover path { filter: brightness(0.98) }
.text-primary-700 { color: #1d4ed8 }
</style>