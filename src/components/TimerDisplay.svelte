<script>
  import { fly } from "svelte/transition"

  let { countdown, count, h, m, s } = $props()

  let offset = $state(1)
  let rotation = $state(360)

  $effect(() => {
    if (countdown > 0) {
      const progress = Math.max(0, count / countdown)
      offset = progress
      rotation = progress * 360
    } else {
      offset = 0
      rotation = 0
    }
  })
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
      stroke-dashoffset={offset}
      style="transition: stroke-dashoffset 0.8s ease-out;"
    />
  </g>
  <g fill="#115E59" stroke="none">
    <g transform="rotate({rotation})" style="transition: transform 0.8s ease-out;">
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