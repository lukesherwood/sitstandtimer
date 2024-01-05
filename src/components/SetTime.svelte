<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function submitTime(minutes) {
    dispatch("countdown", minutes * 60);
  }
</script>

<div class="p-4 max-w-sm mx-auto flex flex-col space-y-4 text-red-200">
  <button
    on:click={() => submitTime(15)}
    class="p-2 border border-transparent shadow-sm text-lg font-medium rounded bg-teal-800 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    15 Minutes
  </button>
  <button
    on:click={() => submitTime(30)}
    class="p-2 border border-transparent shadow-sm text-lg font-medium rounded bg-teal-800 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    30 Minutes
  </button>
  <button
    on:click={() => submitTime(45)}
    class="p-2 border border-transparent shadow-sm text-lg font-medium rounded bg-teal-800 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    45 Minutes
  </button>
  <button
    on:click={() => submitTime(60)}
    class="p-2 border border-transparent shadow-sm text-lg font-medium rounded bg-teal-800 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    60 Minutes
  </button>
</div>
