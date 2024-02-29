<script>
  import { times } from "../stores/timeStore.js";
  import Button from "./Button.svelte";
  import NumberInput from "./NumberInput.svelte";

  let customTime = "";
  let walkingTime = 5;
  let standingTime = 15;
  let sittingTime = 40;

  function handleSubmit() {
    times.set({
      customTime: parseFloat(customTime),
      sittingTime: parseFloat(sittingTime),
      standingTime: parseFloat(standingTime),
      walkingTime: parseFloat(walkingTime),
    });
    customTime = "";
  }
</script>

<div>
  <div class="pb-6 text-center">
    <h2>Select Timer Duration</h2>
    <small>
      It is recommended that you get up and stand at least every 50 minutes<a
        target="_blank"
        href="https://www.fitnessmadeclear.com/blog-1/2019/5/11/dr-stu-mcgills-10-best-habits-for-a-healthy-back#:~:text=Avoid%20Prolonged%20Sitting&text=Dr%20McGill%20recommends%20adjusting%20your,walking%20for%20a%20few%20minutes."
        >*</a
      >
    </small>
  </div>
  <section>
    <!-- allows a user to setup an hour period of time where the time can be split between sitting standing and walking -->
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
          <Button
            type="submit"
            tooltip="Set Custom Timer"
            clazz="text-lg text-medium w-24 h-24 p-8"
          >
            Start Timer
          </Button>
        </form>
      </div>
    </div>
  </section>
  <section>
    <h3 class="text-center">Quick Time Set</h3>
    <div class="p-4 flex flex-col md:flex-row justify-center gap-5">
      <Button
        on:click={() =>
          submitTime({
            customTime: parseFloat(0.16 * 60),
          })}
        tooltip="New Timer"
        clazz="text-lg font-medium w-24 h-24 p-8"
      >
        10 Seconds
      </Button>
      <Button
        on:click={() =>
          submitTime({
            customTime: parseFloat(30 * 60),
          })}
        tooltip="New Timer"
        clazz="text-lg font-medium w-24 h-24 p-8"
      >
        30 Minutes
      </Button>
      <Button
        on:click={() =>
          submitTime({
            customTime: parseFloat(50 * 60),
          })}
        tooltip="New Timer"
        clazz="text-lg font-medium w-24 h-24 p-8"
      >
        50 Minutes
      </Button>
      <Button
        on:click={() =>
          submitTime({
            customTime: parseFloat(60 * 60),
          })}
        tooltip="New Timer"
        clazz="text-lg font-medium w-24 h-24 p-8"
      >
        60 Minutes
      </Button>
    </div>
  </section>
  <section>
    <div>
      <h3 class="text-center">Custom Time Set (minutes)</h3>
      <div class="p-4 flex flex-col md:flex-row justify-center gap-5">
        <form
          class="flex flex-col md:flex-row justify-center gap-5"
          on:submit|preventDefault={handleSubmit}
        >
          <NumberInput bind:value={customTime} placeholder="0 mins" />
          <Button
            type="submit"
            tooltip="Set Custom Timer"
            clazz="text-lg text-medium w-24 h-24 p-8"
          >
            Start Timer
          </Button>
        </form>
      </div>
    </div>
  </section>
</div>
