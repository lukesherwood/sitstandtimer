<script>
  import SetTime from "./SetTime.svelte"
  import Timer from "./Timer.svelte"
  import {
    timerStore,
    resetTimer,
    completeCurrentTimer
  } from "../stores/timerStore.js"

  let timerState
  let showTimer = false

  timerStore.subscribe((value) => {
    timerState = value
    if (value.allTimersComplete) {
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
</script>

<div class="p-4 w-full max-h-fit">
  {#if showTimer}
    <Timer {timerState} on:complete={handleComplete} />
  {:else}
    <SetTime on:start={handleStart} />
  {/if}
</div>

<style>
</style>
