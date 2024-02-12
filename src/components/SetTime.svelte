<script>
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";

  const dispatch = createEventDispatcher();

  function submitTime(minutes) {
    dispatch("countdown", minutes * 60);
  }
</script>

<div>
  <div class="pb-4">
    <h2 class="font-bold text-xl text-center">Select Timer Duration:</h2>
  </div>
  <div class="p-4 flex flex-col md:flex-row justify-center gap-5 text-red-100">
    <Button
      on:click={() => submitTime(0.16)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      10 seconds
    </Button>
    <Button
      on:click={() => submitTime(5)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      5 Minutes
    </Button>
    <Button
      on:click={() => submitTime(15)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      15 Minutes
    </Button>
    <Button
      on:click={() => submitTime(30)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      30 Minutes
    </Button>
    <Button
      on:click={() => submitTime(45)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      45 Minutes
    </Button>
    <Button
      on:click={() => submitTime(60)}
      tooltip="New Timer"
      clazz="text-lg font-medium w-24 h-24 p-8"
    >
      60 Minutes
    </Button>
  </div>
</div>
