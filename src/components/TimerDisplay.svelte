<script>
  import { fly } from "svelte/transition"
  import { tweened } from "svelte/motion"
  import { linear as easing } from "svelte/easing"

  export let countdown
  export let count
  export let h
  export let m
  export let s

  let offset = tweened(1, { duration: 1000, easing })
  let rotation = tweened(360, { duration: 1000, easing })

  $: offset.set(Math.max(count - 1, 0) / countdown)
  $: rotation.set((Math.max(count - 1, 0) / countdown) * 360)
</script>

<svg
  in:fly={{ y: -5 }}
  viewBox="-50 -50 100 100"
  width="250"
  height="250"
  class="mx-auto"
  data-testid="timer-circle"
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