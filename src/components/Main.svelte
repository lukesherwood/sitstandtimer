<script>
  import Keypad from "./SetTime.svelte";
  import Timer from "./Timer.svelte";

  let countdown;
</script>

<div class="p-4 w-full max-h-fit">
  {#if countdown}
    <Timer
      on:new={() => {
        countdown = null;
      }}
      {countdown}
    />
  {:else}
    <Keypad
      on:countdown={(e) => {
        countdown = e.detail;
      }}
    />
  {/if}
</div>

<style>
</style>
