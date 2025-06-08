<script>
  import Button from "./Button.svelte"

  let { timerState, isLastTimer, onresetAll, onnextTimer } = $props()
</script>

<!-- Timer Completion Section -->
<div class="mx-4 mb-4">
  {#if isLastTimer}
    <!-- All Timers Complete -->
    <div class="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-4 text-center shadow-lg" data-testid="all-complete-message">
      <div class="flex justify-center mb-3">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <span class="text-2xl">🎉</span>
        </div>
      </div>
      <h2 class="text-xl font-bold text-teal-900 mb-2">Congratulations!</h2>
      <p class="text-base text-teal-800 mb-4">You've completed all your movement timers. Well done!</p>
      
      <div class="flex flex-col items-center" data-testid="reset-all-button">
        <Button 
          onclick={onresetAll} 
          tooltip="Start New Session"
          clazz="w-16 h-16 mb-2 bg-green-600 hover:bg-green-700 text-lg"
        >
          {#snippet children()}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          {/snippet}
        </Button>
        <span class="text-sm font-semibold text-teal-800">Start New Session</span>
      </div>
    </div>
    
  {:else}
    <!-- Single Timer Complete -->
    <div class="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-4 text-center shadow-lg" data-testid="timer-complete-message">
      <div class="flex justify-center mb-3">
        <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
          {#if timerState.currentTimer === 'sitting'}
            <span class="text-2xl">🪑</span>
          {:else if timerState.currentTimer === 'standing'}
            <span class="text-2xl">🧍</span>
          {:else if timerState.currentTimer === 'walking'}
            <span class="text-2xl">🚶</span>
          {/if}
        </div>
      </div>
      
      <h2 class="text-xl font-bold text-teal-900 mb-2 capitalize">
        {timerState.currentTimer} Timer Complete!
      </h2>
      
      <div class="text-base text-teal-800 mb-4">
        {#if timerState.currentTimer === 'sitting'}
          <p>Great job! Time to stand up and move your body.</p>
        {:else if timerState.currentTimer === 'standing'}
          <p>Excellent! You've given your body a good stretch.</p>
        {:else if timerState.currentTimer === 'walking'}
          <p>Well done! You've completed your movement break.</p>
        {/if}
        
        {#if timerState.autoTransition}
          <div class="mt-4 p-3 bg-teal-100 rounded-lg">
            <p class="text-sm font-medium text-teal-800">
              ⏱️ Automatically starting next timer in a few seconds...
            </p>
          </div>
        {/if}
      </div>
      
      {#if !timerState.autoTransition}
        <div class="flex flex-col items-center" data-testid="next-timer-button">
          <Button 
            onclick={onnextTimer} 
            tooltip="Continue to Next Timer"
            clazz="w-16 h-16 mb-2 bg-teal-600 hover:bg-teal-700 text-lg"
          >
            {#snippet children()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
                class="w-10 h-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7 4.5l7.5 7.5-7.5 7.5M13 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            {/snippet}
          </Button>
          <span class="text-sm font-semibold text-teal-800">Continue</span>
        </div>
      {/if}
    </div>
  {/if}
</div>