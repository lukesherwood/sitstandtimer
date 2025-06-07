<script>
  import { createEventDispatcher } from "svelte"
  import Button from "./Button.svelte"

  const dispatch = createEventDispatcher()

  export let isPaused
</script>

<div class="flex justify-between items-center m-6">
  <div data-testid="reset-button">
    <Button on:click={() => dispatch('reset')} tooltip="Reset Timer">
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
  <div data-testid="pause-resume-button">
    <Button
      on:click={() => dispatch('pauseResume')}
      tooltip={isPaused ? "Resume Timer" : "Pause Timer"}
    >
    {#if isPaused}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="w-8 h-8"
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
        class="w-8 h-8"
      >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    {/if}
    </Button>
  </div>
  <div data-testid="new-timer-button">
    <Button on:click={() => dispatch('newTimer')} tooltip="New Timer">
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    </Button>
  </div>
</div>