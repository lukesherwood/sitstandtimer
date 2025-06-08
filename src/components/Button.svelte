<script>
  let {
    tooltip,
    disabled = false,
    disabledText = "Disabled",
    clazz = "",
    type = "button",
    onclick,
    children
  } = $props()

  let showTooltip = $state(false)
  
  function handleClick() {
    onclick?.()
  }
  
  const tooltipText = $derived(disabled ? disabledText : tooltip)
</script>

<div class="relative flex flex-col items-center group">
  <button
    class="w-12 h-12 flex justify-center items-center rounded-full bg-teal-800 shadow disabled:opacity-50 enabled:hover:bg-amber-500 transition ease-in-out duration-200 {clazz}"
    onmouseover={() => (showTooltip = true)}
    onmouseout={() => (showTooltip = false)}
    onfocus={() => (showTooltip = true)}
    onblur={() => (showTooltip = false)}
    onclick={handleClick}
    {disabled}
    {type}
    data-testid="button"
  >
    {@render children?.()}
  </button>

  {#if showTooltip && tooltipText}
    <div
      class="absolute bottom-full mb-2 w-32 bg-black text-sm text-center rounded p-2 shadow-md"
      data-testid="tooltip"
    >
      {tooltipText}
    </div>
  {/if}
</div>

<style>
</style>
