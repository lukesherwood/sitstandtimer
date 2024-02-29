<script>
  import SetTime from "./SetTime.svelte";
  import { times } from "../stores/timeStore.js";
  import Timer from "./Timer.svelte";

  let currentTimes;

  $: currentTimes;

  times.subscribe((value) => {
    currentTimes = value;
  });

  $: timerType = null;
  $: countdown = null;

  $: if (currentTimes.sittingTime > 0) {
    countdown = currentTimes.sittingTime * 10;
    timerType = "sittingTime";
  } else if (currentTimes.standingTime > 0) {
    countdown = currentTimes.standingTime * 60;
    timerType = "standingTime";
  } else if (currentTimes.walkingTime > 0) {
    countdown = currentTimes.walkingTime * 60;
    timerType = "walkingTime";
  }
</script>

<div class="p-4 w-full max-h-fit">
  {#if countdown}
    <Timer
      type={timerType}
      on:complete={() => {
        times.set({ ...$times, [timerType]: 0 });
      }}
      on:new={() => {
        times.set({});
      }}
      {countdown}
    />
  {:else}
    <SetTime />
  {/if}
</div>

<style>
</style>
