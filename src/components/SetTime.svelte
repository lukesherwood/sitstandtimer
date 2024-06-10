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
  <div class="text-center">
    <h2>Select Timer Duration</h2>
  </div>
  <section>
    <div class="text-center">
      <small>
        It is recommended that you get up and stand at least every 50 minutes
        <a
          target="_blank"
          href="https://www.fitnessmadeclear.com/blog-1/2019/5/11/dr-stu-mcgills-10-best-habits-for-a-healthy-back#:~:text=Avoid%20Prolonged%20Sitting&text=Dr%20McGill%20recommends%20adjusting%20your,walking%20for%20a%20few%20minutes."
          >*
        </a>
      </small>
      <div class="flex items-center mt-4 md:mt-0 w-full justify-center pt-5">
        <label for="autoTransition" class="text-center px-2"
          >Automatic timer start
        </label>
        <input
          type="checkbox"
          bind:checked={autoTransition}
          id="autoTransition"
          class="w-4 h-4"
        />
      </div>
      <div
        class="p-4 flex flex-col md:flex-row justify-center items-center gap-5"
      >
        <form
          class="flex flex-col md:flex-row justify-center items-center gap-5"
          on:submit|preventDefault={handleSubmit}
        >
          <div class="flex flex-col items-center">
            <label for="sittingTimeInput" class="text-center mb-2"
              >Sitting</label
            >
            <NumberInput
              bind:value={sittingTime}
              placeholder="40 mins"
              id="sittingTimeInput"
              class="text-center"
            />
          </div>
          <div class="flex flex-col items-center">
            <label for="standingTimeInput" class="text-center mb-2"
              >Standing</label
            >
            <NumberInput
              bind:value={standingTime}
              placeholder="15 mins"
              id="standingTimeInput"
              class="text-center"
            />
          </div>
          <div class="flex flex-col items-center">
            <label for="walkingTimeInput" class="text-center mb-2"
              >Walking</label
            >
            <NumberInput
              bind:value={walkingTime}
              placeholder="5 mins"
              id="walkingTimeInput"
              class="text-center"
            />
          </div>
          <div class="flex flex-col items-center">
            <div class="text-center mb-2 text-teal-500">Submit</div>
            <Button
              type="submit"
              tooltip="Set Custom Timer"
              clazz="text-lg text-medium w-24 h-24 p-8"
              disabled={!isStartEnabled}
            >
              Start Timer
            </Button>
          </div>
        </form>
      </div>
    </div>
  </section>
</div>

<style>
</style>
