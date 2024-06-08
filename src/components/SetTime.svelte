<script>
  import { timerStore } from "../stores/timerStore.js"
  import Button from "./Button.svelte"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let walkingTime = ""
  let standingTime = ""
  let sittingTime = ""
  let autoTransition = false

  $: isStartEnabled = walkingTime > 0 || standingTime > 0 || sittingTime > 0

  function handleSubmit() {
    timerStore.set({
      currentTimer:
        sittingTime > 0 ? "sitting" : standingTime > 0 ? "standing" : "walking",
      sittingTime: sittingTime * 10, // Change later to Convert to seconds
      standingTime: standingTime * 10, // Change later to Convert to seconds
      walkingTime: walkingTime * 10, // Change later to Convert to seconds
      needsReset: true,
      allTimersComplete: false,
      autoTransition: autoTransition
    })
    dispatch("start")
  }
</script>

<div>
  <div class="pb-6 text-center">
    <h2>Select Timer Duration</h2>
    <small>
      It is recommended that you get up and stand at least every 50 minutes
      <a
        target="_blank"
        href="https://www.fitnessmadeclear.com/blog-1/2019/5/11/dr-stu-mcgills-10-best-habits-for-a-healthy-back#:~:text=Avoid%20Prolonged%20Sitting&text=Dr%20McGill%20recommends%20adjusting%20your,walking%20for%20a%20few%20minutes."
        >*
      </a>
    </small>
  </div>
  <section>
    <div>
      <h3 class="text-center">Sit, Stand, Walk Timer (minutes)</h3>
      <div class="p-4 flex flex-col md:flex-row justify-center gap-5">
        <form
          class="flex flex-col md:flex-row justify-center gap-5"
          on:submit|preventDefault={handleSubmit}
        >
          <label for="sittingTimeInput">
            Sitting
            <NumberInput
              bind:value={sittingTime}
              placeholder="40 mins"
              id="sittingTimeInput"
            />
          </label>
          <label for="standingTimeInput">
            Standing
            <NumberInput
              bind:value={standingTime}
              placeholder="15 mins"
              id="standingTimeInput"
            />
          </label>
          <label for="walkingTimeInput">
            Walking
            <NumberInput
              bind:value={walkingTime}
              placeholder="5 mins"
              id="walkingTimeInput"
            />
          </label>
          <label>
            <input type="checkbox" bind:checked={autoTransition} />
            Automatic Transition
          </label>
          <Button
            type="submit"
            tooltip="Set Custom Timer"
            clazz="text-lg text-medium w-24 h-24 p-8"
            disabled={!isStartEnabled}
          >
            Start Timer
          </Button>
        </form>
      </div>
    </div>
  </section>
</div>

<style>
</style>
