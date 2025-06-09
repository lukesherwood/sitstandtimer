<script>
  import { fly } from "svelte/transition"

  let { countdown, count, h, m, s } = $props()

  let offset = $state(1)
  let rotation = $state(360)

  $effect(() => {
    if (countdown > 0) {
      // Progress from 0 (start) to 1 (complete)
      const progressComplete = Math.max(0, (countdown - count) / countdown)

      offset = 1 - progressComplete

      rotation = progressComplete * 360
    } else {
      offset = 0
      rotation = 360
    }
  })
</script>

<!-- Timer Display Section -->
<div class="flex flex-col items-center">
  <!-- Large Time Display -->
  <div class="bg-white rounded-3xl p-8 mb-6 shadow-xl border-4 border-teal-100">
    <div class="text-center">
      <div
        class="text-6xl md:text-7xl font-bold text-teal-900 font-mono tracking-wider mb-2"
      >
        {#if countdown >= 3600}
          {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s
            .toString()
            .padStart(2, "0")}
        {:else}
          {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
        {/if}
      </div>
      <div class="text-teal-700 text-lg font-medium">
        {#if countdown >= 3600}
          hours : minutes : seconds
        {:else}
          minutes : seconds
        {/if}
      </div>
    </div>
  </div>

  <!-- Circular Progress Indicator -->
  <div class="relative">
    <svg
      in:fly={{ y: -5 }}
      viewBox="-50 -50 100 100"
      width="220"
      height="220"
      class="mx-auto transform rotate-[-90deg]"
      data-testid="timer-circle"
      aria-hidden="true"
    >
      <!-- Background Circle -->
      <circle
        stroke="#d1fae5"
        stroke-width="6"
        fill="none"
        r="40"
        opacity="0.3"
      />

      <!-- Progress Circle -->
      <circle
        stroke="#0f766e"
        stroke-width="6"
        fill="none"
        r="40"
        stroke-linecap="round"
        pathLength="1"
        stroke-dasharray="1"
        stroke-dashoffset={offset}
        style="transition: stroke-dashoffset 0.8s ease-out;"
        class="drop-shadow-sm"
      />

      <!-- Progress Indicator Dot -->
      <g fill="#0f766e" stroke="none">
        <g
          transform="rotate({rotation + 90})"
          style="transition: transform 0.8s ease-out;"
        >
          <g transform="translate(0 -40)">
            <circle r="5" class="drop-shadow" />
          </g>
        </g>
      </g>
    </svg>

    <!-- Progress Percentage -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div class="text-xl font-bold text-teal-800">
          {Math.round((1 - offset) * 100) || 0}%
        </div>
        <div class="text-xs text-teal-600 font-medium">complete</div>
      </div>
    </div>
  </div>

  <!-- Screen Reader Announcements -->
  <div class="sr-only" aria-live="polite" aria-atomic="true">
    Time remaining: {#if countdown >= 3600}{h} hours,
    {/if}{m} minutes, {s} seconds
  </div>
</div>
