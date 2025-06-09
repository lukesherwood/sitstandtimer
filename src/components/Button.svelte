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
    class="w-12 h-12 flex justify-center items-center rounded-full bg-teal-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-teal-800 enabled:active:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-offset-2 transition-all duration-200 {clazz}"
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
      class="absolute bottom-full mb-2 w-40 bg-teal-900 text-white text-sm text-center rounded-lg p-3 shadow-lg border border-teal-700"
      data-testid="tooltip"
    >
      {tooltipText}
    </div>
  {/if}
</div>

<style>
</style>
