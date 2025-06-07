<script>
  import { createEventDispatcher } from "svelte"
  import Button from "./Button.svelte"

  const dispatch = createEventDispatcher()

  export let timerState
  export let isLastTimer
</script>

{#if isLastTimer}
  <div class="text-center p-4 m-5 bg-green-300 text-teal-800 rounded-full" data-testid="all-complete-message">
    <h2>Well done, all timers completed. Start again?</h2>
  </div>
  <div data-testid="reset-all-button">
    <Button on:click={() => dispatch('resetAll')} tooltip="Reset All Timers">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-8 h-8"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
    </Button>
  </div>
{:else}
  <div class="text-center p-4 m-5 bg-red-300 text-teal-800 rounded-full" data-testid="timer-complete-message">
    <h2>{timerState.currentTimer.charAt(0).toUpperCase() + timerState.currentTimer.slice(1)} Timer Complete!</h2>
    <p>
      {#if timerState.currentTimer === 'sitting'}
        Time to stand up and move!
      {:else if timerState.currentTimer === 'standing'}
        Great! Time for the next activity.
      {:else if timerState.currentTimer === 'walking'}
        Well done! Time to continue.
      {/if}
      {#if timerState.autoTransition}
        <br><small>Automatically moving to next timer...</small>
      {/if}
    </p>
  </div>
  {#if !timerState.autoTransition}
    <div data-testid="next-timer-button">
      <Button on:click={() => dispatch('nextTimer')} tooltip="Next Timer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        class="w-8 h-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7 4.5l7.5 7.5-7.5 7.5M13 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
      </Button>
    </div>
  {/if}
{/if}