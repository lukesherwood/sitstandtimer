# Sit Stand Timer

A modern, responsive timer application designed to promote healthy movement habits throughout your workday. Alternate between sitting, standing, and walking with customizable intervals and smart notifications.

## 🚀 Features

### ⏱️ **Flexible Timer Options**
- **Sitting Timer**: Track seated work periods
- **Standing Timer**: Encourage regular standing breaks  
- **Walking Timer**: Promote movement and activity
- **Any Combination**: Use any mix of the three timer types
- **Custom Durations**: Set each timer from 1 minute to hours

### 🎯 **Smart Workflow**
- **Sequential Progression**: Timers advance automatically through sitting → standing → walking
- **Auto-Transition Mode**: Seamlessly move between timers without manual intervention
- **Manual Control**: Choose when to start each timer phase
- **Session Tracking**: Complete timer sequences count as full sessions

### 🔔 **Multi-Modal Notifications**
- **Browser Notifications**: Desktop alerts when timers complete
- **Audio Alerts**: Sound notifications with customizable alarm
- **Visual Notifications**: On-screen completion messages and celebrations
- **Smart Permissions**: Graceful handling of notification permissions

### 📊 **Progress Tracking**
- **Real-Time Display**: Large, clear countdown with minutes:seconds format
- **Circular Progress**: Visual progress indicator with animated completion dot
- **Percentage Complete**: Live percentage tracking
- **Session Statistics**: Track total time spent in each position
- **Usage Analytics**: Monitor daily/weekly movement patterns

### 🎨 **Modern UI/UX**
- **Mobile-First Design**: Fully responsive across all devices
- **Accessible Interface**: WCAG AA compliant with screen reader support
- **Intuitive Controls**: Clear icons with descriptive labels for mobile users
- **Teal Theme**: Calming, professional color scheme
- **Smooth Animations**: Polished transitions and micro-interactions

### ⚙️ **Customization Options**
- **Persistent Settings**: Preferences saved across sessions
- **Notification Controls**: Granular control over alert types
- **Auto-Transition Toggle**: Enable/disable automatic timer progression
- **Timer Memory**: Remembers your last used timer durations
- **Collapsible Settings**: Clean interface with expandable configuration panel

### 📱 **Progressive Web App (PWA)**
- **Offline Capable**: Works without internet connection
- **Install on Device**: Add to home screen on mobile/desktop
- **Native-Like Experience**: App-style interface and behavior
- **Background Notifications**: Alerts work even when app is minimized

## 🏗️ Technology Stack

- **Frontend Framework**: [Astro](https://astro.build/) with [Svelte 5](https://svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design
- **State Management**: Svelte stores with localStorage persistence
- **Testing**: [Vitest](https://vitest.dev/) with [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/)
- **PWA Features**: Service worker with offline capabilities
- **Build Tool**: Vite for fast development and optimized builds

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation & Development

```bash
# Clone the repository
git clone <repository-url>
cd sitstandtimer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:4321
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📖 Usage Guide

### Basic Setup
1. **Set Timer Durations**: Enter minutes for sitting, standing, and/or walking
2. **Configure Settings**: 
   - Toggle auto-transition mode
   - Enable desired notification types (browser, audio, visual)
3. **Start Session**: Click the prominent "🚀 Start Timer" button

### During Timer Sessions
- **Monitor Progress**: Watch the countdown and circular progress indicator
- **Control Playback**: Use pause/resume, reset, or start new timer buttons
- **View Completion**: See celebration messages when timers complete
- **Navigate Sequence**: In manual mode, click "Continue" to advance timers

### Timer Completion Flow
- **Individual Completion**: Each timer shows specific completion message
- **All Timers Complete**: Final celebration with session summary
- **Auto Return**: Automatically returns to setup screen when session ends
- **Session Statistics**: Tracks total time and session count

### Settings & Preferences
- **Persistent Storage**: All settings automatically saved to localStorage
- **Notification Permissions**: Browser will request permission for desktop alerts
- **Timer Memory**: Last used durations are remembered for convenience
- **Accessibility**: Full keyboard navigation and screen reader support

## 🧪 Testing Coverage

- **Unit Tests**: All components, stores, and utilities
- **Integration Tests**: Timer flow scenarios and state management
- **Accessibility Tests**: Keyboard navigation and screen reader compatibility
- **Edge Cases**: Zero-time timers, permission handling, storage failures
- **67 Comprehensive Tests**: Covering all functionality and user scenarios

## 🏛️ Architecture

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── SetTime.svelte   # Timer configuration interface
│   ├── Timer.svelte     # Main timer display and controls
│   ├── TimerDisplay.svelte      # Countdown and progress visualization
│   ├── TimerControls.svelte     # Play/pause/reset controls
│   ├── TimerCompletion.svelte   # Completion messages and navigation
│   ├── NumberInput.svelte       # Enhanced numeric input with +/- buttons
│   └── Button.svelte           # Accessible button with tooltips
├── stores/              # State management
│   └── timerStore.js   # Central state store with localStorage persistence
├── lib/                # Utilities and main app logic
│   ├── Main.svelte     # Root application component
│   ├── notifications.js # Notification system (browser, visual, audio)
│   └── pwa.js          # Progressive Web App functionality
└── styles/             # Global styles and theming
    └── custom.css      # Tailwind customizations
```

### State Management
- **Centralized Store**: Single source of truth for all timer state
- **Reactive Updates**: All components automatically update when state changes
- **Persistent Data**: Settings, preferences, and statistics saved to localStorage
- **Type Safety**: Well-defined state shape with clear data flow

### Notification System
- **Multi-Channel**: Browser notifications, audio alerts, and visual feedback
- **Graceful Degradation**: Handles permission denials and unsupported features
- **Customizable**: Users can enable/disable each notification type independently
- **Accessible**: Screen reader announcements and visual indicators

## 🔧 Configuration

### Environment Variables
No environment variables required - the app runs entirely client-side.

### PWA Configuration
- **Manifest**: `/public/manifest.json` - App metadata and icons
- **Service Worker**: `/public/sw.js` - Offline functionality and caching
- **Icons**: App icons for various devices and platforms

### Build Configuration
- **Astro Config**: `astro.config.mjs` - Framework and integration settings
- **Tailwind Config**: `tailwind.config.mjs` - Design system and theming
- **Vite Config**: `vite.config.test.js` - Test environment configuration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Build and verify: `npm run build`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- **ES6+ JavaScript**: Modern syntax and features
- **Svelte 5**: Latest Svelte features including runes and snippets
- **Tailwind CSS**: Utility-first styling approach
- **Semantic HTML**: Accessible markup with proper ARIA attributes
- **Comprehensive Testing**: All new features must include tests

## 📋 Roadmap

### Potential Future Enhancements
- **TypeScript Migration**: Add type safety throughout the application
- **Advanced Statistics**: Detailed analytics and trend tracking
- **Custom Themes**: Multiple color schemes and dark mode
- **Sound Library**: Additional notification sounds and themes
- **Export Data**: Download usage statistics as CSV/JSON
- **Team Features**: Share timer sessions with colleagues
- **Integration**: Calendar and productivity app connections

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Health Research**: Based on ergonomic research about movement and productivity
- **Accessibility Guidelines**: Follows WCAG AA standards for inclusive design
- **Modern Web Standards**: Built with latest web platform capabilities
- **Community**: Inspired by the need for better workplace wellness tools

---

**Health Tip**: Standing for just 15 minutes every hour can reduce back pain and boost energy levels. This timer makes it easy to build healthy movement habits into your daily routine.