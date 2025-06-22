<script>
  import {
    timerStore,
    updateSettings,
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
  let customTimerExpanded = $state(false)

  // Load saved preferences on mount
  $effect(() => {
    const unsubscribe = timerStore.subscribe((state) => {
      if (state.preferences) {
        sittingTime = state.preferences.lastUsedSitting || ""
        standingTime = state.preferences.lastUsedStanding || ""
        walkingTime = state.preferences.lastUsedWalking || ""
        autoTransition = state.autoTransition ?? false
      }
      if (state.notifications) {
        notificationSettings = { ...state.notifications }
      }
    })
    return unsubscribe
  })

  const isStartEnabled = $derived(
    walkingTime > 0 || standingTime > 0 || sittingTime > 0
  )

  function setRecommendedTimer(sitting, standing, walking) {
    sittingTime = sitting
    standingTime = standing
    walkingTime = walking

    // Start the timer immediately
    startTimer()
  }

  function startTimer() {
    const currentTimer =
      sittingTime > 0 ? "sitting" : standingTime > 0 ? "standing" : "walking"

    updateSettings({
      currentTimer,
      sittingTime: sittingTime * 60,
      standingTime: standingTime * 60,
      walkingTime: walkingTime * 60,
      needsReset: true,
      allTimersComplete: false,
      autoTransition
    })

    updatePreferences({
      lastUsedSitting: sittingTime,
      lastUsedStanding: standingTime,
      lastUsedWalking: walkingTime
    })

    onstart?.()
  }

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

    updateSettings({
      notifications: {
        ...$timerStore.notifications,
        browser: notificationSettings.browser
      }
    })
  }

  function updateNotificationSetting(key, value) {
    notificationSettings[key] = value
    updateSettings({
      notifications: { ...$timerStore.notifications, [key]: value }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    startTimer()
  }
</script>

<div data-testid="set-time">
  <div class="text-center mb-6">
    <h1
      class="text-3xl md:text-4xl font-bold text-teal-900 mb-4 tracking-tight"
    >
      Sit Stand Timer
    </h1>
    <p
      class="text-lg text-teal-800 max-w-2xl mx-auto px-4 mb-6 leading-relaxed"
    >
      Improve your health and productivity with regular movement breaks. This
      timer helps you alternate between sitting, standing, and walking
      throughout your day.
    </p>
    <div
      class="bg-teal-50 border-l-4 border-teal-300 p-4 mx-4 md:mx-auto md:max-w-xl shadow-sm rounded-xl"
    >
      <p class="text-sm text-teal-900 leading-relaxed">
        <strong class="font-semibold">Health tip:</strong> Standing for just 15
        minutes every hour can reduce back pain and boost energy levels.
        <a
          target="_blank"
          href="https://www.fitnessmadeclear.com/blog-1/2019/5/11/dr-stu-mcgills-10-best-habits-for-a-healthy-back#:~:text=Avoid%20Prolonged%20Sitting&text=Dr%20McGill%20recommends%20adjusting%20your,walking%20for%20a%20few%20minutes."
          class="inline-block mt-1 text-teal-700 underline hover:text-teal-900 focus:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded transition-colors"
          >Learn more →
        </a>
      </p>
    </div>
  </div>
  <section>
    <div class="text-center">
      <h2 class="text-xl font-semibold text-teal-900 mb-3">
        Set Your Timer Duration
      </h2>
      <p class="text-base text-teal-800 mb-8 px-4 max-w-3xl mx-auto">
        Enter minutes for each activity. You can use any combination - just
        sitting and standing, or include walking breaks too.
      </p>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto px-4">
        <!-- Recommended Timer Buttons -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-teal-900 mb-4 text-center">
            Quick Start Options
          </h3>
          <!-- Option 1: Card-style with vertical layout -->
          <!-- <div class="flex flex-wrap justify-center gap-6 mb-6">
            <button
              type="button"
              class="bg-white border-2 border-teal-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-teal-400 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onclick={() => setRecommendedTimer(40, 15, 5)}
              data-testid="recommended-40-15-5"
            >
              <div class="text-center">
                <div class="text-3xl mb-2">🪑 🧍 🚶</div>
                <div class="text-lg font-bold text-teal-900 mb-1">40-15-5</div>
                <div class="text-sm text-teal-600">minutes</div>
              </div>
            </button>
            <button
              type="button"
              class="bg-white border-2 border-teal-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-teal-400 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onclick={() => setRecommendedTimer(30, 10, 5)}
              data-testid="recommended-30-10-5"
            >
              <div class="text-center">
                <div class="text-3xl mb-2">🪑 🧍 🚶</div>
                <div class="text-lg font-bold text-teal-900 mb-1">30-10-5</div>
                <div class="text-sm text-teal-600">minutes</div>
              </div>
            </button>
            <button
              type="button"
              class="bg-white border-2 border-teal-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-teal-400 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onclick={() => setRecommendedTimer(20, 10, 5)}
              data-testid="recommended-20-10-5"
            >
              <div class="text-center">
                <div class="text-3xl mb-2">🪑 🧍 🚶</div>
                <div class="text-lg font-bold text-teal-900 mb-1">20-10-5</div>
                <div class="text-sm text-teal-600">minutes</div>
              </div>
            </button>
          </div> -->

          <!-- Option 2: Pill-style compact buttons -->
          <!-- 
          <div class="flex flex-wrap justify-center gap-3 mb-6">
            <button
              type="button"
              onclick={() => setRecommendedTimer(40, 15, 5)}
              class="px-6 py-2 bg-teal-100 hover:bg-teal-600 text-teal-800 hover:text-white border-2 border-teal-300 hover:border-teal-600 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              data-testid="recommended-40-15-5"
            >
              🪑40 🧍15 🚶5
            </button>
            <button
              type="button"
              onclick={() => setRecommendedTimer(30, 10, 5)}
              class="px-6 py-2 bg-teal-100 hover:bg-teal-600 text-teal-800 hover:text-white border-2 border-teal-300 hover:border-teal-600 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              data-testid="recommended-30-10-5"
            >
              🪑30 🧍10 🚶5
            </button>
            <button
              type="button"
              onclick={() => setRecommendedTimer(20, 10, 5)}
              class="px-6 py-2 bg-teal-100 hover:bg-teal-600 text-teal-800 hover:text-white border-2 border-teal-300 hover:border-teal-600 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              data-testid="recommended-20-10-5"
            >
              🪑20 🧍10 🚶5
            </button>
          </div> -->

          <!-- Option 3: Icon-style with individual activity breakdown -->

          <div class="flex flex-wrap justify-center gap-4 mb-6">
            <button
              type="button"
              onclick={() => setRecommendedTimer(40, 15, 5)}
              class="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-offset-2"
              data-testid="recommended-40-15-5"
            >
              <div class="flex items-center space-x-1 text-sm font-medium">
                <span class="text-lg">🪑</span><span>40m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🧍</span><span>15m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🚶</span><span>5m</span>
              </div>
            </button>
            <button
              type="button"
              onclick={() => setRecommendedTimer(30, 10, 5)}
              class="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-offset-2"
              data-testid="recommended-30-10-5"
            >
              <div class="flex items-center space-x-1 text-sm font-medium">
                <span class="text-lg">🪑</span><span>30m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🧍</span><span>10m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🚶</span><span>5m</span>
              </div>
            </button>
            <button
              type="button"
              onclick={() => setRecommendedTimer(45, 15, 0)}
              class="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-offset-2"
              data-testid="recommended-20-10-5"
            >
              <div class="flex items-center space-x-1 text-sm font-medium">
                <span class="text-lg">🪑</span><span>45m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🧍</span><span>15m</span>
                <span class="text-gray-200">•</span>
                <span class="text-lg">🚶</span><span>0m</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Custom Timer Toggle -->
        <div
          class="bg-teal-50 rounded-xl border border-teal-300 shadow-sm mb-8"
        >
          <button
            type="button"
            class="w-full p-4 text-left flex items-center text-teal-900 justify-between hover:bg-teal-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            onclick={() => (customTimerExpanded = !customTimerExpanded)}
            data-testid="custom-timer-toggle-button"
          >
            <h3 class="text-base font-semibold flex items-center gap-2">
              ⏰ Set Custom Timer
            </h3>
            <svg
              class="w-4 h-4 transition-transform duration-200 {customTimerExpanded
                ? 'rotate-180'
                : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if customTimerExpanded}
            <div class="px-4 pb-4 border-t border-teal-300 pt-4">
              <!-- Timer Inputs Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                <div class="flex flex-col items-center">
                  <label
                    for="sittingTimeInput"
                    class="text-center mb-3 font-semibold text-teal-900 text-lg"
                  >
                    🪑 Sitting
                  </label>
                  <div data-testid="sitting-input">
                    <NumberInput
                      bind:value={sittingTime}
                      placeholder="40"
                      id="sittingTimeInput"
                    />
                  </div>
                  <span class="text-sm text-teal-700 mt-2 font-medium"
                    >minutes</span
                  >
                </div>
                <div class="flex flex-col items-center">
                  <label
                    for="standingTimeInput"
                    class="text-center mb-3 font-semibold text-teal-900 text-lg"
                  >
                    🧍 Standing
                  </label>
                  <div data-testid="standing-input">
                    <NumberInput
                      bind:value={standingTime}
                      placeholder="15"
                      id="standingTimeInput"
                    />
                  </div>
                  <span class="text-sm text-teal-700 mt-2 font-medium"
                    >minutes</span
                  >
                </div>
                <div class="flex flex-col items-center">
                  <label
                    for="walkingTimeInput"
                    class="text-center mb-3 font-semibold text-teal-900 text-lg"
                  >
                    🚶 Walking
                  </label>
                  <div data-testid="walking-input">
                    <NumberInput
                      bind:value={walkingTime}
                      placeholder="5"
                      id="walkingTimeInput"
                    />
                  </div>
                  <span class="text-sm text-teal-700 mt-2 font-medium"
                    >minutes</span
                  >
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Combined Settings Section -->
        <div
          class="bg-teal-50 rounded-xl border border-teal-300 shadow-sm mb-8"
        >
          <button
            type="button"
            class="w-full p-4 text-teal-900 text-left flex items-center justify-between hover:bg-teal-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            onclick={() =>
              (notificationSettingsExpanded = !notificationSettingsExpanded)}
            data-testid="settings-toggle-button"
          >
            <h3 class="text-base font-semibold flex items-center gap-2">
              ⚙️ Timer Settings
            </h3>
            <svg
              class="w-4 h-4 transition-transform duration-200 {notificationSettingsExpanded
                ? 'rotate-180'
                : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if notificationSettingsExpanded}
            <div class="px-4 pb-4 border-t border-teal-200 pt-4 space-y-4">
              <!-- Auto-start Setting -->
              <div
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-teal-100"
              >
                <div>
                  <label
                    for="autoTransition"
                    class="font-medium text-teal-900 cursor-pointer"
                  >
                    Auto-start next timer
                  </label>
                  <p class="text-sm text-teal-600 mt-1">
                    Automatically begin the next timer when current one
                    completes
                  </p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={autoTransition}
                  onchange={() => updateSettings({ autoTransition })}
                  id="autoTransition"
                  class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 focus:ring-2"
                  data-testid="auto-transition-checkbox"
                />
              </div>

              <!-- Notification Settings -->
              <div class="space-y-3">
                <h4 class="font-medium text-teal-900 text-sm">
                  Notification Options
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    class="flex items-center p-3 bg-white rounded-lg border border-teal-100"
                  >
                    <input
                      type="checkbox"
                      bind:checked={notificationSettings.browser}
                      onchange={handleBrowserNotificationToggle}
                      id="browserNotifications"
                      class="w-4 h-4 mr-3 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <label
                      for="browserNotifications"
                      class="text-sm font-medium text-teal-900 cursor-pointer"
                    >
                      Browser Alerts
                    </label>
                  </div>
                  <div
                    class="flex items-center p-3 bg-white rounded-lg border border-teal-100"
                  >
                    <input
                      type="checkbox"
                      bind:checked={notificationSettings.audio}
                      onchange={() =>
                        updateNotificationSetting(
                          "audio",
                          notificationSettings.audio
                        )}
                      id="audioNotifications"
                      class="w-4 h-4 mr-3 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <label
                      for="audioNotifications"
                      class="text-sm font-medium text-teal-900 cursor-pointer"
                      >Audio Alerts</label
                    >
                  </div>
                  <div
                    class="flex items-center p-3 bg-white rounded-lg border border-teal-100"
                  >
                    <input
                      type="checkbox"
                      bind:checked={notificationSettings.visual}
                      onchange={() =>
                        updateNotificationSetting(
                          "visual",
                          notificationSettings.visual
                        )}
                      id="visualNotifications"
                      class="w-4 h-4 mr-3 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <label
                      for="visualNotifications"
                      class="text-sm font-medium text-teal-900 cursor-pointer"
                      >Visual Alerts</label
                    >
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
        <!-- Prominent Start Button -->
        <form onsubmit={handleSubmit} data-testid="timer-form" class="mb-6">
          <div class="flex justify-center">
            <div data-testid="start-timer-button">
              <Button
                type="submit"
                tooltip="Start Timer"
                disabledText="Enter at least one timer duration"
                clazz="text-2xl font-bold w-48 h-20 px-10 py-6 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300 focus:ring-offset-2 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
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
