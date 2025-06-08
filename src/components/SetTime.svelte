<script>
  import {
    timerStore,
    saveLastUsedTimes,
    updatePreferences
  } from "../stores/timerStore.js"
  import Button from "./Button.svelte"
  import NumberInput from "./NumberInput.svelte"
  import { requestNotificationPermission } from "../lib/notifications.js"

  let { onstart } = $props()

  let walkingTime = $state("")
  let standingTime = $state("")
  let sittingTime = $state("")
  let autoTransition = $state(false)
  let notificationSettings = $state({
    browser: false,
    audio: true,
    visual: true
  })
  let notificationSettingsExpanded = $state(false)

  // Load saved preferences on mount
  $effect(() => {
    const unsubscribe = timerStore.subscribe((state) => {
      if (state.preferences) {
        sittingTime = state.preferences.lastUsedSitting || ""
        standingTime = state.preferences.lastUsedStanding || ""
        walkingTime = state.preferences.lastUsedWalking || ""
        autoTransition = state.preferences.autoTransition ?? false
      }
      if (state.notifications) {
        notificationSettings = { ...state.notifications }
      }
    })
    return unsubscribe
  })

  const isStartEnabled = $derived(walkingTime > 0 || standingTime > 0 || sittingTime > 0)

  async function handleBrowserNotificationToggle() {
    if (
      notificationSettings.browser &&
      !("Notification" in window || Notification.permission === "granted")
    ) {
      const granted = await requestNotificationPermission()
      if (!granted) {
        notificationSettings.browser = false
        return
      }
    }

    timerStore.update((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        browser: notificationSettings.browser
      }
    }))
  }

  function updateNotificationSetting(key, value) {
    notificationSettings[key] = value
    timerStore.update((state) => ({
      ...state,
      notifications: { ...state.notifications, [key]: value }
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    saveLastUsedTimes(sittingTime, standingTime, walkingTime)
    updatePreferences({ autoTransition })

    timerStore.update((state) => ({
      ...state,
      currentTimer: (() => {
        if (sittingTime > 0) return "sitting"
        if (standingTime > 0) return "standing" 
        if (walkingTime > 0) return "walking"
        return "sitting" // fallback, shouldn't happen since start is disabled when all are 0
      })(),
      sittingTime: sittingTime * 60,
      standingTime: standingTime * 60,
      walkingTime: walkingTime * 60,
      needsReset: true,
      allTimersComplete: false,
      autoTransition: autoTransition
    }))
    onstart?.()
  }
</script>

<div data-testid="set-time">
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
      <!-- Notification Settings -->
      <div
        class="bg-teal-600 bg-opacity-20 rounded-lg mt-4 mb-4 border border-teal-300"
      >
        <button
          type="button"
          class="w-full p-4 text-left flex items-center justify-between hover:bg-opacity-30 hover:bg-teal-600 rounded-lg transition-colors"
          onclick={() => notificationSettingsExpanded = !notificationSettingsExpanded}
        >
          <h3 class="text-sm font-semibold">Notification Settings</h3>
          <svg
            class="w-4 h-4 transition-transform duration-200 {notificationSettingsExpanded ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {#if notificationSettingsExpanded}
          <div class="px-4 pb-4 border-t border-teal-300 border-opacity-30 pt-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={notificationSettings.browser}
                  onchange={handleBrowserNotificationToggle}
                  id="browserNotifications"
                  class="w-4 h-4 mr-2"
                />
                <label for="browserNotifications" class="text-sm"
                  >Browser Notifications</label
                >
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={notificationSettings.audio}
                  onchange={() =>
                    updateNotificationSetting("audio", notificationSettings.audio)}
                  id="audioNotifications"
                  class="w-4 h-4 mr-2"
                />
                <label for="audioNotifications" class="text-sm">Audio Alerts</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={notificationSettings.visual}
                  onchange={() =>
                    updateNotificationSetting(
                      "visual",
                      notificationSettings.visual
                    )}
                  id="visualNotifications"
                  class="w-4 h-4 mr-2"
                />
                <label for="visualNotifications" class="text-sm"
                  >Visual Alerts</label
                >
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div class="flex items-center mt-4 md:mt-0 w-full justify-center pt-5">
        <label for="autoTransition" class="text-center px-2"
          >Automatic timer start
        </label>
        <input
          type="checkbox"
          bind:checked={autoTransition}
          onchange={() => updatePreferences({ autoTransition })}
          id="autoTransition"
          class="w-4 h-4"
          data-testid="auto-transition-checkbox"
        />
      </div>
      <div
        class="p-4 flex flex-col md:flex-row justify-center items-center gap-5"
      >
        <form
          class="flex flex-col md:flex-row justify-center items-center gap-5"
          onsubmit={handleSubmit}
          data-testid="timer-form"
        >
          <div class="flex flex-col items-center">
            <label for="sittingTimeInput" class="text-center mb-2"
              >Sitting</label
            >
            <div data-testid="sitting-input">
              <NumberInput
                bind:value={sittingTime}
                placeholder="40 mins"
                id="sittingTimeInput"
              />
            </div>
          </div>
          <div class="flex flex-col items-center">
            <label for="standingTimeInput" class="text-center mb-2"
              >Standing</label
            >
            <div data-testid="standing-input">
              <NumberInput
                bind:value={standingTime}
                placeholder="15 mins"
                id="standingTimeInput"
              />
            </div>
          </div>
          <div class="flex flex-col items-center">
            <label for="walkingTimeInput" class="text-center mb-2"
              >Walking</label
            >
            <div data-testid="walking-input">
              <NumberInput
                bind:value={walkingTime}
                placeholder="5 mins"
                id="walkingTimeInput"
              />
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-center mb-2 text-teal-500">Submit</div>
            <div data-testid="start-timer-button">
              <Button
                type="submit"
                tooltip="Start Timer"
                disabledText="Fill out the timer"
                clazz="text-lg text-medium w-24 h-24 p-8"
                disabled={!isStartEnabled}
              >
                {#snippet children()}
                  Start Timer
                {/snippet}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</div>

<style>
</style>
