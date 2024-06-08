<script>
  import { createEventDispatcher, onDestroy } from "svelte"
  import { tweened } from "svelte/motion"
  import { linear as easing } from "svelte/easing"
  import { fly } from "svelte/transition"
  import Button from "./Button.svelte"

  const dispatch = createEventDispatcher()

  export let timerState

  let timerComplete = false
  let isPaused = false
  let audio
  let interval

  $: countdown = timerState[`${timerState.currentTimer}Time`]
  $: end = Date.now() + countdown * 1000
  $: if (timerState.needsReset) {
    handleReset()
  }

  $: count = Math.round((end - Date.now()) / 1000)
  $: h = Math.floor(count / 3600)
  $: m = Math.floor((count - h * 3600) / 60)
  $: s = count - h * 3600 - m * 60

  function updateTimer() {
    if (!isPaused) {
      count = Math.round((end - Date.now()) / 1000)
      if (count <= 0) {
        clearTimeout(interval)
        audio.play()
        timerComplete = true
        dispatch("complete")
      } else {
        interval = setTimeout(updateTimer, 1000)
      }
    }
  }

  function handleReset() {
    clearTimeout(interval)
    timerComplete = false
    end = Date.now() + countdown * 1000
    interval = setTimeout(updateTimer, 1000)
    timerState.needsReset = false // Reset needsReset so it can be set to true again by parent
  }

  function handlePauseResume() {
    isPaused = !isPaused
    if (!isPaused) {
      end = Date.now() + count * 1000
      interval = setTimeout(updateTimer, 1000)
    }
  }

  function handleNewTimer() {
    clearTimeout(interval)
    dispatch("newTimer")
  }

  let offset = tweened(1, { duration: 1000, easing })
  let rotation = tweened(360, { duration: 1000, easing })

  $: offset.set(Math.max(count - 1, 0) / countdown)
  $: rotation.set((Math.max(count - 1, 0) / countdown) * 360)

  onDestroy(() => {
    clearTimeout(interval)
  })
</script>

<main class="text-red-100 max-w-sm mx-auto">
  <audio src="alarm.wav" bind:this={audio}></audio>
  <h1 class="text-center py-8">
    {timerState.currentTimer} Timer ({parseInt(countdown / 60)} minutes)
  </h1>
  <svg
    in:fly={{ y: -5 }}
    viewBox="-50 -50 100 100"
    width="250"
    height="250"
    class="mx-auto"
  >
    <title>Remaining seconds: {count}</title>
    <g fill="none" stroke="currentColor" stroke-width="2">
      <circle stroke="currentColor" r="46" />
      <path
        stroke="#115E59"
        d="M 0 -46 a 46 46 0 0 0 0 92 46 46 0 0 0 0 -92"
        pathLength="1"
        stroke-dasharray="1"
        stroke-dashoffset={$offset}
      />
    </g>
    <g fill="#115E59" stroke="none">
      <g transform="rotate({$rotation})">
        <g transform="translate(0 -46)">
          <circle r="4" />
        </g>
      </g>
    </g>

    <g
      fill="currentColor"
      text-anchor="middle"
      dominant-baseline="baseline"
      font-size="13"
    >
      <text x="-3" y="6.5">
        {#each Object.entries({ h, m, s }) as [key, value], i}
          {#if countdown >= 60 ** (2 - i)}
            <tspan dx="3" font-weight="bold"
              >{value.toString().padStart(2, "0")}</tspan
            ><tspan dx="0.5" font-size="7">{key}</tspan>
          {/if}
        {/each}
      </text>
    </g>
  </svg>
  <div class="flex justify-between items-center m-6">
    <Button on:click={handleReset} tooltip="Reset Timer">
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
    <Button
      on:click={handlePauseResume}
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
    <Button on:click={handleNewTimer} tooltip="New Timer">
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
  {#if timerComplete}
    <div class="text-center p-4 m-5 bg-red-300 text-teal-800 rounded-full">
      <h2>Timer Complete</h2>
      <p>Get up and moving!</p>
    </div>
  {/if}
</main>
