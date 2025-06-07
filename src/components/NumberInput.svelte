<script>
  export let value
  export let min = 0
  export let step = 1
  export let placeholder = ""
  export let id = ""
</script>

<input
  bind:value
  type="number"
  {min}
  {step}
  class="text-red-100 bg-teal-600 text-xl font-medium w-24 h-24 text-center rounded-full focus:outline-none focus:ring focus:ring-amber-500"
  {placeholder}
  {id}
  data-testid="number-input"
/>

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
