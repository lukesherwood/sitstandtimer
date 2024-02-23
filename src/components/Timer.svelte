<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { tweened } from "svelte/motion";
  import { linear as easing } from "svelte/easing";
  import { fly } from "svelte/transition";
  import Button from "./Button.svelte";

  const dispatch = createEventDispatcher();

  export let times;

  // TODO: need to create a function that will take the times and set the timer
  // will need to iterate through the times and set the timer for each of the time, and for them to automatically display the next in the series

  let countdown = times?.customTime;

  let timerComplete = false;
  let audio;

  let end = Date.now() + countdown * 1000;

  $: count = Math.round((end - Date.now()) / 1000);
  $: h = Math.floor(count / 3600);
  $: m = Math.floor((count - h * 3600) / 60);
  $: s = count - h * 3600 - m * 60;

  let interval;

  function updateTimer() {
    count = Math.round((end - Date.now()) / 1000);
    if (count === 0) {
      clearTimeout(interval);
      audio.play();
      timerComplete = true;
    } else {
      interval = setTimeout(updateTimer, 1000);
    }
  }

  interval = setTimeout(updateTimer, 1000);

  let isPaused;
  let isResetting;
  const duration = 1000;

  let offset = tweened(1, { duration, easing });
  let rotation = tweened(360, { duration, easing });

  $: offset.set(Math.max(count - 1, 0) / countdown);
  $: rotation.set((Math.max(count - 1, 0) / countdown) * 360);

  function handleNew() {
    clearTimeout(interval);
    dispatch("new");
  }

  function handleStart() {
    end = Date.now() + count * 1000;
    interval = setTimeout(updateTimer, 1000);
    offset.set(Math.max(count - 1, 0) / countdown);
    rotation.set((Math.max(count - 1, 0) / countdown) * 360);
    isPaused = false;
  }

  function handlePause() {
    offset.set(count / countdown);
    rotation.set((count / countdown) * 360);
    clearTimeout(interval);
    isPaused = true;
  }

  function handleReset() {
    clearTimeout(interval);
    timerComplete = false;
    isResetting = true;
    isPaused = false;
    Promise.all([offset.set(1), rotation.set(360)]).then(() => {
      isResetting = false;
      end = Date.now() + countdown * 1000;
      interval = setTimeout(updateTimer, 1000);
    });
  }

  onDestroy(() => {
    clearTimeout(interval);
  });
</script>

<main class="text-red-100 max-w-sm mx-auto">
  <audio src="alarm.wav" bind:this={audio}></audio>
  <h1 class="text-center py-8">
    {#if countdown > 60}
      {Math.floor(countdown / 60)} Minute Timer
    {:else}
      {Math.round(countdown)}s Timer
    {/if}
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
    <Button on:click={handleNew} tooltip="New Timer">
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
    {#if isPaused}
      <Button
        disabled={isResetting || count === 0}
        on:click={handleStart}
        tooltip="Start Timer"
        clazz="w-24 h-24"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-8 h-8"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </Button>
    {:else}
      <Button
        disabled={isResetting || count === 0}
        on:click={handlePause}
        tooltip="Pause Timer"
        clazz="w-24 h-24"
      >
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
      </Button>
    {/if}
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
  </div>
  {#if timerComplete}
    <div class="text-center p-4 m-5 bg-red-300 text-teal-800 rounded-full">
      <h2>Timer Complete</h2>
      <!-- TODO: make this change based on what timer is is, for example if walking timer say walking over you can feel good about sitting now -->
      <p>Get up and moving!</p>
    </div>
  {/if}
</main>
