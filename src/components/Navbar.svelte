<script>
  let isOpen = false

  // Handle navigation in PWA mode
  function handleNavigation(event, url) {
    // Check if we're in PWA mode
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://")

    if (isPWA) {
      // In PWA mode, use the browser's navigation but ensure it stays in-app
      event.preventDefault()

      // Use window.location to stay within the PWA context
      window.location.href = url
    }
    // If not in PWA mode, let the default navigation happen
  }
</script>

<nav class="bg-teal-800 text-red-100 shadow-lg">
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex justify-between items-center">
      <!-- Home button -->
      <div class="flex items-center">
        <a
          href="/"
          class="flex items-center py-5 px-2 hover:text-amber-500"
          onclick={(e) => handleNavigation(e, "/")}
        >
          <svg
            class="h-6 w-6 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="font-bold">SitStandTimer</span>
        </a>
        <!-- Desktop Links - Shown inline with Home button on larger screens -->
        <div class="hidden md:flex space-x-4 items-center">
          <a
            href="/about"
            class="py-2 px-3 font-bold hover:text-amber-500"
            onclick={(e) => handleNavigation(e, "/about")}>About</a
          >
        </div>
      </div>
      <!-- Toggle Button -->
      <button class="md:hidden px-2 py-5" onclick={() => (isOpen = !isOpen)}>
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {#if isOpen}
            <!-- Icon for "close" when menu is open -->
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <!-- Hamburger icon when menu is closed -->
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          {/if}
        </svg>
      </button>
    </div>
    <!-- Mobile Links Container -->
    <div
      class={`md:hidden ${isOpen ? "flex" : "hidden"} flex-col items-center`}
    >
      <a
        href="/"
        class="py-5 px-3 font-bold hover:text-gray-900"
        onclick={(e) => handleNavigation(e, "/")}>Home</a
      >
      <a
        href="/about"
        class="py-5 px-3 font-bold hover:text-gray-900"
        onclick={(e) => handleNavigation(e, "/about")}>About</a
      >
    </div>
  </div>
</nav>
