<script>
  import Button from "./Button.svelte"

  let { 
    isPaused, 
    isTimerComplete = false,
    onreset,
    onpauseResume,
    onnewTimer
  } = $props()
</script>

<!-- Timer Controls Section -->
<div class="bg-teal-50 rounded-lg p-3 mx-4 mb-4 border border-teal-200 shadow-sm">
  <h3 class="text-sm font-semibold text-teal-900 text-center mb-3">Timer Controls</h3>
  
  <!-- Mobile-first layout: stacked on mobile, horizontal on desktop -->
  <div class="grid grid-cols-3 gap-3">
    
    <!-- Reset Button -->
    <div class="flex flex-col items-center" data-testid="reset-button">
      <Button 
        onclick={onreset} 
        tooltip="Reset Timer"
        clazz="w-12 h-12 mb-1 bg-teal-600 hover:bg-teal-700"
      >
        {#snippet children()}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        {/snippet}
      </Button>
      <span class="text-xs font-medium text-teal-800 text-center">Reset</span>
    </div>
    
    <!-- Pause/Resume Button -->
    <div class="flex flex-col items-center" data-testid="pause-resume-button">
      <Button
        onclick={onpauseResume}
        tooltip={isPaused ? "Resume Timer" : "Pause Timer"}
        disabled={isTimerComplete}
        disabledText="Timer has ended"
        clazz="w-12 h-12 mb-1 {isTimerComplete ? 'bg-gray-400' : isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}"
      >
        {#snippet children()}
          {#if isPaused}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-6 h-6"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          {:else}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          {/if}
        {/snippet}
      </Button>
      <span class="text-xs font-medium text-teal-800 text-center">
        {#if isTimerComplete}
          Ended
        {:else if isPaused}
          Resume
        {:else}
          Pause
        {/if}
      </span>
    </div>
    
    <!-- New Timer Button -->
    <div class="flex flex-col items-center" data-testid="new-timer-button">
      <Button 
        onclick={onnewTimer} 
        tooltip="Start New Timer"
        clazz="w-16 h-16 mb-3 bg-teal-600 hover:bg-teal-700"
      >
        {#snippet children()}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        {/snippet}
      </Button>
      <span class="text-xs font-medium text-teal-800 text-center">New Timer</span>
    </div>
    
  </div>
</div>