<script>
  import { timerStore } from "../stores/timerStore.js"
  import TimerDisplay from "./TimerDisplay.svelte"
  import TimerControls from "./TimerControls.svelte"
  import TimerCompletion from "./TimerCompletion.svelte"
  import { notifyTimerComplete } from "../lib/notifications.js"

  let { timerState = null, oncomplete, onnewTimer } = $props()

  const AUTO_TRANSITION_DELAY = 10000 // 10 seconds
  const TIMER_INTERVAL = 1000 // 1 second
  const TIMERS = ["sitting", "standing", "walking"]

  let timerComplete = $state(false)
  let isPaused = $state(false)
  let audio = $state()
  let interval = $state()

  // Use timerState prop if provided, otherwise use store
  const activeState = $derived(timerState || $timerStore)

  function clearTimerInterval() {
    if (interval) {
      clearTimeout(interval)
      interval = null
    }
  }

  let end = $state(0)
  let count = $state(0)

  const countdown = $derived(activeState[`${activeState.currentTimer}Time`])
  const h = $derived(Math.floor(count / 3600))
  const m = $derived(Math.floor((count - h * 3600) / 60))
  const s = $derived(count - h * 3600 - m * 60)

  const isLastTimer = $derived.by(() => {
    const timerToCheck = activeState.completedTimer || activeState.currentTimer
    const currentIndex = TIMERS.indexOf(timerToCheck)
    return !TIMERS.find(
      (timer, index) => index > currentIndex && activeState[`${timer}Time`] > 0
    )
  })

  $effect(() => {
    if ($timerStore.needsReset) {
      handleReset()
    }
  })

  $effect(() => {
    if ($timerStore.allTimersComplete) {
      timerComplete = true
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
        if (activeState.notifications?.audio) {
          audio.play()
        }

        // Determine next timer
        const currentIndex = TIMERS.indexOf(activeState.currentTimer)
        const nextTimer = TIMERS.find(
          (timer, index) =>
            index > currentIndex && activeState[`${timer}Time`] > 0
        )

        // Send notifications
        notifyTimerComplete(
          activeState.currentTimer,
          nextTimer,
          activeState.notifications || {
            browser: false,
            audio: true,
            visual: true
          }
        )

        timerComplete = true

        if (activeState.autoTransition) {
          oncomplete?.()
          if (nextTimer) {
            setTimeout(() => {
              timerComplete = false
            }, AUTO_TRANSITION_DELAY)
          }
        }
      } else {
        interval = setTimeout(updateTimer, TIMER_INTERVAL)
      }
    }
  }

  function handleReset() {
    clearTimeout(interval)
    if (!activeState.autoTransition) {
      timerComplete = false
    }
    end = Date.now() + countdown * 1000
    count = countdown
    if (!isPaused) {
      interval = setTimeout(updateTimer, TIMER_INTERVAL)
    }
    timerStore.update((state) => ({ ...state, needsReset: false }))
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

<main
  class="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-4"
  data-testid="timer"
>
  <audio src="alarm.wav" bind:this={audio} data-testid="timer-audio"></audio>

  <!-- Header Section -->
  {#if timerComplete}
    <TimerCompletion
      timerState={activeState}
      {isLastTimer}
      onresetAll={handleNewTimer}
      onnextTimer={handleNextTimer}
    />
  {:else}
    <div class="text-center py-2 px-4 flex-shrink-0">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-2"
      >
        {#if activeState.currentTimer === "sitting"}
          <span class="text-3xl">🪑</span>
        {:else if activeState.currentTimer === "standing"}
          <span class="text-3xl">🧍</span>
        {:else if activeState.currentTimer === "walking"}
          <span class="text-3xl">🚶</span>
        {/if}
      </div>
      <h1
        class="text-xl md:text-2xl font-bold text-teal-900 mb-1 capitalize"
        data-testid="timer-title"
      >
        {activeState.currentTimer} Timer
      </h1>
      <p class="text-base text-teal-700 font-medium">
        {parseInt(countdown / 60)} minute{parseInt(countdown / 60) !== 1
          ? "s"
          : ""} total
      </p>
    </div>
  {/if}

  <!-- Main content area that grows to fill space -->
  <div class="flex-1 flex flex-col justify-center">
    <TimerDisplay {countdown} {count} {h} {m} {s} />
  </div>

  <!-- Controls fixed at bottom -->
  <div class="flex-shrink-0">
    <TimerControls
      {isPaused}
      isTimerComplete={timerComplete}
      onreset={handleReset}
      onpauseResume={handlePauseResume}
      onnewTimer={handleNewTimer}
    />
  </div>
</main>
