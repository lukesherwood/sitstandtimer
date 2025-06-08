<script>
  import SetTime from "../components/SetTime.svelte"
  import Timer from "../components/Timer.svelte"
  import {
    timerStore,
    resetTimer,
    completeCurrentTimer,
    startNewTimer
  } from "../stores/timerStore.js"
  import { initializePWA } from "./pwa.js"
  import { showVisualAlert } from "./notifications.js"

  let showTimer = $state(false)

  $effect(() => {
    initializePWA()
    
    // Make notification functions globally available
    window.showVisualAlert = showVisualAlert
  })

  $effect(() => {
    if ($timerStore.allTimersComplete) {
      showTimer = false
    }
  })

  function handleComplete() {
    completeCurrentTimer()
  }

  function handleStart() {
    showTimer = true
    resetTimer()
  }

  function handleNewTimer() {
    startNewTimer()
    showTimer = false
  }

</script>

<div class="pt-5 w-full max-h-fit">
  {#if showTimer}
    <Timer
      oncomplete={handleComplete}
      onnewTimer={handleNewTimer}
    />
  {:else}
    <SetTime onstart={handleStart} />
  {/if}
</div>

<style>
</style>
