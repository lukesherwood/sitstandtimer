<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { tweened } from "svelte/motion";
  import { linear as easing } from "svelte/easing";
  import { fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let countdown;

  let now = Date.now();
  let end = now + countdown * 1000;

  $: count = Math.round((end - now) / 1000);
  $: h = Math.floor(count / 3600);
  $: m = Math.floor((count - h * 3600) / 60);
  $: s = count - h * 3600 - m * 60;

  function updateTimer() {
    now = Date.now();
  }

  let interval = setInterval(updateTimer, 1000);
  $: if (count === 0) clearInterval(interval);

  let isPaused;
  let isResetting;
  const duration = 1000;

  let offset = tweened(1, { duration, easing });
  let rotation = tweened(360, { duration, easing });

  $: offset.set(Math.max(count - 1, 0) / countdown);
  $: rotation.set((Math.max(count - 1, 0) / countdown) * 360);

  function handleNew() {
    clearInterval(interval);
    dispatch("new");
  }

  function handleStart() {
    now = Date.now();
    end = now + count * 1000;
    interval = setInterval(updateTimer, 1000);
    offset.set(Math.max(count - 1, 0) / countdown);
    rotation.set((Math.max(count - 1, 0) / countdown) * 360);
    isPaused = false;
  }

  function handlePause() {
    offset.set(count / countdown);
    rotation.set((count / countdown) * 360);
    clearInterval(interval);
    isPaused = true;
  }

  function handleReset() {
    clearInterval(interval);
    isResetting = true;
    isPaused = false;
    Promise.all([offset.set(1), rotation.set(360)]).then(() => {
      isResetting = false;
      now = Date.now();
      end = now + countdown * 1000;
      interval = setInterval(updateTimer, 1000);
    });
  }

  function padValue(value, length = 2, char = "0") {
    const { length: currentLength } = value.toString();
    if (currentLength >= length) return value.toString();
    return `${char.repeat(length - currentLength)}${value}`;
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<main class="py-0 px-4 text-red-200">
  <svg in:fly={{ y: -5 }} viewBox="-50 -50 100 100" width="250" height="250">
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
            <tspan dx="3" font-weight="bold">{padValue(value)}</tspan><tspan
              dx="0.5"
              font-size="7">{key}</tspan
            >
          {/if}
        {/each}
      </text>
    </g>
  </svg>

  <div
    class="flex justify-between items-center mt-4"
    in:fly={{ y: -10, delay: 120 }}
  >
    <button
      on:click={handleNew}
      class="w-12 h-12 flex justify-center items-center rounded-full bg-teal-800 shadow hover:bg-amber-500 transition ease-in-out duration-200"
    >
      <span>New</span>
    </button>

    {#if isPaused}
      <button
        disabled={isResetting || count === 0}
        on:click={handleStart}
        class="w-24 h-24 flex justify-center items-center rounded-full bg-teal-800 shadow hover:bg-amber-500 transition ease-in-out duration-200"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
    {:else}
      <button
        disabled={isResetting || count === 0}
        on:click={handlePause}
        class="w-24 h-24 flex justify-center items-center rounded-full bg-teal-800 shadow hover:bg-amber-500 transition ease-in-out duration-200"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6"
        >
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
    {/if}

    <button
      on:click={handleReset}
      class="w-12 h-12 flex justify-center items-center rounded-full bg-teal-800 shadow hover:bg-amber-500 transition ease-in-out duration-200"
    >
      <span>Reset</span>
    </button>
  </div>
</main>
