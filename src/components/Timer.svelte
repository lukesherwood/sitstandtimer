<script>
  import { createEventDispatcher, onDestroy } from "svelte"
  import { timerStore } from "../stores/timerStore.js"
  import TimerDisplay from "./TimerDisplay.svelte"
  import TimerControls from "./TimerControls.svelte"
  import TimerCompletion from "./TimerCompletion.svelte"

  const dispatch = createEventDispatcher()
  
  const AUTO_TRANSITION_DELAY = 10000 // 10 seconds
  const TIMER_INTERVAL = 1000 // 1 second
  
  export let timerState = null
  
  $: actualTimerState = timerState || $timerStore

  let timerComplete = false
  let isPaused = false
  let audio
  let interval

  function clearTimerInterval() {
    if (interval) {
      clearTimeout(interval)
      interval = null
    }
  }

  $: countdown = actualTimerState[`${actualTimerState.currentTimer}Time`]
  $: end = Date.now() + countdown * 1000
  $: if (actualTimerState.needsReset) {
    handleReset()
  }

  $: count = Math.round((end - Date.now()) / 1000)
  $: h = Math.floor(count / 3600)
  $: m = Math.floor((count - h * 3600) / 60)
  $: s = count - h * 3600 - m * 60
  
  $: isLastTimer = (() => {
    const timers = ["sitting", "standing", "walking"]
    const currentIndex = timers.indexOf(actualTimerState.currentTimer)
    return !timers.find(
      (timer, index) => index > currentIndex && actualTimerState[`${timer}Time`] > 0
    )
  })()

  function updateTimer() {
    if (!isPaused) {
      count = Math.round((end - Date.now()) / 1000)
      if (count <= 0) {
        clearTimerInterval()
        audio.play()
        timerComplete = true
        
        
        if (actualTimerState.autoTransition) {
          // Show message briefly before auto-transitioning
          setTimeout(() => {
            handleNextTimer()
          }, AUTO_TRANSITION_DELAY)
        }
      } else {
        interval = setTimeout(updateTimer, TIMER_INTERVAL)
      }
    }
  }

  function handleReset() {
    clearTimeout(interval)
    timerComplete = false
    end = Date.now() + countdown * 1000
    interval = setTimeout(updateTimer, TIMER_INTERVAL)
    timerStore.update(state => ({ ...state, needsReset: false }))
  }

  function handlePauseResume() {
    isPaused = !isPaused
    if (!isPaused) {
      end = Date.now() + count * 1000
      interval = setTimeout(updateTimer, TIMER_INTERVAL)
    } else {
      clearTimerInterval()
    }
  }

  function handleNewTimer() {
    clearTimerInterval()
    dispatch("newTimer")
  }

  function handleResetAllTimers() {
    clearTimerInterval()
    dispatch("newTimer")
  }

  function handleNextTimer() {
    clearTimerInterval()
    dispatch("nextTimer")
    timerComplete = false
  }


  onDestroy(() => {
    clearTimerInterval()
  })
</script>

<main class="text-red-100 max-w-sm mx-auto" data-testid="timer">
  <audio src="alarm.wav" bind:this={audio} data-testid="timer-audio"></audio>
  <h1 class="text-center py-8" data-testid="timer-title">
    {actualTimerState.currentTimer} Timer ({parseInt(countdown / 60)} minutes)
  </h1>
  
  <TimerDisplay {countdown} {count} {h} {m} {s} />
  
  <TimerControls 
    {isPaused}
    on:reset={handleReset}
    on:pauseResume={handlePauseResume}
    on:newTimer={handleNewTimer}
  />
  
  {#if timerComplete}
    <TimerCompletion 
      timerState={actualTimerState}
      {isLastTimer}
      on:resetAll={handleResetAllTimers}
      on:nextTimer={handleNextTimer}
    />
  {/if}
</main>
