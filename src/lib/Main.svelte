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
  import { onMount } from "svelte"

  let showTimer = false

  onMount(() => {
    // Initialize PWA features
    initializePWA()
    
    // Make notification functions globally available
    window.showVisualAlert = showVisualAlert
  })

  $: if ($timerStore.allTimersComplete) {
    showTimer = false
  }

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

  function handleNextTimer() {
    completeCurrentTimer()
  }
</script>

<div class="pt-5 w-full max-h-fit">
  {#if showTimer}
    <Timer
      on:complete={handleComplete}
      on:newTimer={handleNewTimer}
      on:nextTimer={handleNextTimer}
    />
  {:else}
    <SetTime on:start={handleStart} />
  {/if}
</div>

<style>
</style>
