<script>
  import SetTime from "./SetTime.svelte";
  import Timer from "./Timer.svelte";

  let times;
</script>

<div class="p-4 w-full max-h-fit">
  {#if times}
    <Timer
      on:new={() => {
        times = null;
      }}
      {times}
    />
  {:else}
    <SetTime
      on:setTimer={(e) => {
        times = e.detail;
      }}
    />
  {/if}
</div>

<style>
</style>
