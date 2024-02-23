<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let tooltip;
  export let disabled = false;
  export let disabledText = "Disabled";
  export let clazz = "";

  let showTooltip = false;
  function handleClick() {
    dispatch("click");
  }
  $: tooltipText = disabled ? disabledText : tooltip;
</script>

<div class="relative flex flex-col items-center group">
  <button
    class="w-12 h-12 flex justify-center items-center rounded-full bg-teal-800 shadow disabled:opacity-50 enabled:hover:bg-amber-500 transition ease-in-out duration-200 {clazz}"
    on:mouseover={() => (showTooltip = true)}
    on:mouseout={() => (showTooltip = false)}
    on:focus={() => (showTooltip = true)}
    on:blur={() => (showTooltip = false)}
    on:click={handleClick}
    {disabled}
  >
    <slot />
  </button>

  {#if showTooltip && tooltipText}
    <div
      class="absolute bottom-full mb-2 w-32 bg-black text-white text-sm text-center rounded p-2 shadow-md"
    >
      {tooltipText}
    </div>
  {/if}
</div>

<style>
</style>
