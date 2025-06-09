<script>
  let {
    value = $bindable(),
    min = 0,
    step = 1,
    placeholder = "",
    id = ""
  } = $props()

  function increment() {
    value = (value || 0) + step
  }

  function decrement() {
    const newValue = (value || 0) - step
    value = newValue < min ? min : newValue
  }

  function handleKeydown(event) {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      increment()
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      decrement()
    }
  }
</script>

<div class="flex flex-col items-center gap-3">
  <button
    type="button"
    onclick={increment}
    class="w-10 h-10 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-full flex items-center justify-center text-xl font-bold transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-teal-300 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
    tabindex="-1"
    aria-label="Increase value"
  >
    +
  </button>

  <input
    bind:value
    type="number"
    {min}
    {step}
    class="text-white bg-teal-700 text-2xl font-bold w-24 h-24 text-center rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-offset-2 hover:bg-teal-800 transition-all duration-200 shadow-lg border-2 border-teal-600 placeholder-teal-300"
    {placeholder}
    {id}
    onkeydown={handleKeydown}
    data-testid="number-input"
    aria-describedby="{id}-helper"
  />

  <button
    type="button"
    onclick={decrement}
    class="w-10 h-10 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-full flex items-center justify-center text-xl font-bold transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-teal-300 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
    tabindex="-1"
    aria-label="Decrease value"
  >
    −
  </button>
</div>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
</style>
