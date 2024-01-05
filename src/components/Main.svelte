<script>
  import Keypad from "./SetTime.svelte";
  import Timer from "./Timer.svelte";

  let countdown;
</script>

<div class="max-w-xs mx-auto p-4">
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
