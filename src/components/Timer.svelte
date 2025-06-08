<script>
  import { timerStore } from "../stores/timerStore.js"
  import TimerDisplay from "./TimerDisplay.svelte"
  import TimerControls from "./TimerControls.svelte"
  import TimerCompletion from "./TimerCompletion.svelte"
  import { notifyTimerComplete } from "../lib/notifications.js"

  let { timerState = null, oncomplete, onnewTimer } = $props()
  
  const AUTO_TRANSITION_DELAY = 10000 // 10 seconds
  const TIMER_INTERVAL = 1000 // 1 second
  
  let timerComplete = $state(false)
  let isPaused = $state(false)
  let audio = $state()
  let interval = $state()
  
  const actualTimerState = $derived(timerState || $timerStore)

  function clearTimerInterval() {
    if (interval) {
      clearTimeout(interval)
      interval = null
    }
  }

  let end = $state(0)
  let count = $state(0)
  
  const countdown = $derived(actualTimerState[`${actualTimerState.currentTimer}Time`])
  const h = $derived(Math.floor(count / 3600))
  const m = $derived(Math.floor((count - h * 3600) / 60))
  const s = $derived(count - h * 3600 - m * 60)
  
  const isLastTimer = $derived.by(() => {
    const timers = ["sitting", "standing", "walking"]
    const currentIndex = timers.indexOf(actualTimerState.currentTimer)
    return !timers.find(
      (timer, index) => index > currentIndex && actualTimerState[`${timer}Time`] > 0
    )
  })
  
  $effect(() => {
    if (actualTimerState.needsReset) {
      handleReset()
    }
  })
  
  $effect(() => {
    end = Date.now() + countdown * 1000
  })

  function updateTimer() {
    if (!isPaused) {
      count = Math.round((end - Date.now()) / 1000)
      if (count <= 0) {
        clearTimerInterval()
        
        // Audio notification
        if (actualTimerState.notifications?.audio) {
          audio.play()
        }
        
        // Determine next timer
        const timers = ["sitting", "standing", "walking"]
        const currentIndex = timers.indexOf(actualTimerState.currentTimer)
        const nextTimer = timers.find(
          (timer, index) => index > currentIndex && actualTimerState[`${timer}Time`] > 0
        )
        
        // Send notifications
        notifyTimerComplete(
          actualTimerState.currentTimer, 
          nextTimer, 
          actualTimerState.notifications || { browser: false, audio: true, visual: true }
        )
        
        timerComplete = true
        
        if (actualTimerState.autoTransition) {
          oncomplete?.()
          setTimeout(() => {
            timerComplete = false
          }, AUTO_TRANSITION_DELAY)
        }
      } else {
        interval = setTimeout(updateTimer, TIMER_INTERVAL)
      }
    }
  }

  function handleReset() {
    clearTimeout(interval)
    if (!actualTimerState.autoTransition) {
      timerComplete = false
    }
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
    onnewTimer?.()
  }

  function handleResetAllTimers() {
    clearTimerInterval()
    onnewTimer?.()
  }

  function handleNextTimer() {
    clearTimerInterval()
    oncomplete?.()
    timerComplete = false
  }

  $effect(() => {
    return () => {
      clearTimerInterval()
    }
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
    isTimerComplete={timerComplete}
    onreset={handleReset}
    onpauseResume={handlePauseResume}
    onnewTimer={handleNewTimer}
  />
  
  {#if timerComplete}
    <TimerCompletion 
      timerState={actualTimerState}
      {isLastTimer}
      onresetAll={handleResetAllTimers}
      onnextTimer={handleNextTimer}
    />
  {/if}
</main>
