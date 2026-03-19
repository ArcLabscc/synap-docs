# Synap for iOS

The Synap iOS app is your personal cognitive system in your pocket. It captures your thinking, visualizes your knowledge graph, and reasons with you using your full life context — across iPhone, Apple Watch, CarPlay, and home screen widgets.

::: info
Requires iOS 17.0 or later. iPad and Mac (Apple Silicon) also supported.
:::

## Getting started

### Install from TestFlight

Synap is currently available through Apple TestFlight while the App Store submission is in progress.

1. Open [this TestFlight invite link](https://testflight.apple.com/join/synap) on your iPhone
2. Tap **Accept** and then **Install**
3. Synap appears on your home screen like any other app

TestFlight builds update automatically. You will receive a notification when new versions are available.

### Create an account

If you are new to Synap:

1. Open the app and tap **Create Account**
2. Enter your email, choose a password, and pick a username
3. Your knowledge graph is created instantly

### Log in

If you already use Synap through the CLI or another AI tool:

1. Open the app and tap **Log In**
2. Enter the same email and password you use with `synap login`
3. Your full knowledge graph loads automatically

You can also connect by scanning a QR code or using a deep link (`synap://arx-connect`). Both methods configure your server endpoint and API key in one step.

### Connecting to your server

By default, the app connects to `api.synap.ing` (Synap Cloud). If you self-host your ARX server, tap **Settings > Server** and enter your custom endpoint URL. The app works identically with any ARX-compatible server.

---

## Chat

The chat interface is the primary way to interact with your cognitive system. Unlike a generic AI chatbot, Synap's AI reads your entire knowledge graph before every response. It reasons across your full life context — decisions from months ago, patterns you have been tracking, health data, calendar events, and everything in between.

Ask it anything:

- "What have I been thinking about this week?"
- "Find connections between my project ideas and recent decisions"
- "What patterns do you see in my work over the past month?"
- "Summarize my momentum on the API redesign"

The AI uses 50+ cognitive tools behind the scenes: searching your graph, traversing connections, detecting patterns, checking your health signals, and surfacing insights you would not find on your own.

### AI providers

Synap supports multiple AI backends:

| Provider | Description |
|----------|-------------|
| **On-Device** | Apple's foundation model. Fully offline, zero API cost, complete privacy. Limited to 4096 token context. |
| **Claude** | Anthropic's Claude via OAuth or API key. Full agentic tool-calling with your knowledge graph. |
| **OpenAI** | GPT models via API key. |
| **Custom** | Any OpenAI-compatible endpoint (Ollama, self-hosted models). |

Switch providers in **Settings > AI Provider**. API keys are stored securely in the iOS Keychain.

---

## Knowledge graph

### Timeline

The timeline view shows your thoughts in chronological order. Each thought displays its type (insight, decision, pattern, task, milestone, question), creation date, and connection count. Tap any thought to see its full content and connected nodes.

Thoughts captured from any surface — the iOS app, Apple Watch, CarPlay, Claude Code, Cursor, the CLI — all appear here. Same account, same graph, everywhere.

### Search

Two ways to find what you are looking for:

- **Keyword search** — Type a query to find exact matches using BM25 ranking. Good when you remember specific words.
- **Semantic search** — Find thoughts by meaning, even when they share no keywords with your query. Powered by 768-dimensional vector embeddings. Good when you remember the gist but not the exact phrasing.

### Graph traversal

Tap any thought, then tap **Explore** to walk the graph outward from that node. See what it connects to, what those connections connect to, and discover chains of reasoning you may have forgotten.

---

## Voice capture

Tap the purple capture button (always visible at the bottom of the screen) to record a thought by voice. Synap transcribes your speech on-device using Apple's speech recognition, then:

1. Classifies the thought automatically (insight, decision, task, pattern, etc.)
2. Embeds it as a 768-dimensional vector
3. Searches for semantically similar existing thoughts
4. Creates edges to related nodes automatically (Hebbian auto-association)
5. Adds it to your graph with a SHA-256 content hash and timestamp

You never have to stop thinking to organize your thoughts. Just speak, and the system handles the rest.

### Share extension

Capture content from other apps without switching to Synap. Use the iOS share sheet from Safari, Notes, Mail, or any app — select **Synap** from the share menu to send text or images directly into your knowledge graph.

---

## 3D Brain visualization

The Brain view renders your entire knowledge graph as a 3D force-directed network. Thoughts appear as nodes, and edges are the connections between them. The layout is computed in real time — densely connected clusters pull together, isolated thoughts drift outward.

- **Rotate** — Drag to orbit around the graph
- **Zoom** — Pinch to zoom in and out
- **Tap a node** — See the thought's content, type, and connections
- **Fly to connections** — Tap a connected node to navigate through the graph spatially

The visualization supports up to 5,000 nodes. Larger graphs are sampled to maintain smooth performance.

---

## Widgets

Synap provides home screen and lock screen widgets so you can see your cognitive activity without opening the app.

### Home screen widgets

| Widget | Size | What it shows |
|--------|------|---------------|
| **Graph Pulse** | Small | Live activity indicator — how active your graph has been today |
| **Thought Stream** | Medium | Your most recent thoughts, scrolling in real time |
| **Daily Stats** | Small | Thought count, new connections, and graph growth for the day |
| **Quick Capture** | Small | Tap to open the voice capture sheet immediately |

### Lock screen widgets

| Widget | What it shows |
|--------|---------------|
| **Graph Pulse** | Compact activity indicator |
| **Daily Stats** | Today's thought count at a glance |
| **Quick Capture** | One-tap access to voice capture from the lock screen |

Add widgets by long-pressing your home screen or lock screen, tapping the **+** button, and searching for Synap.

---

## Apple Watch

The Synap Watch app puts voice capture and your recent thoughts on your wrist.

### Voice capture

Raise your wrist, open Synap, and tap **Capture**. Speak your thought. The watch records and queues it for sync. When connectivity is available, the thought is sent to your graph, classified, embedded, and linked automatically.

If you are offline (on a trail, in a tunnel), thoughts are stored in an on-watch queue and sync when your connection returns. Nothing is lost.

### Recent thoughts

Scroll through your most recent thoughts directly on the watch face. Useful for quick reference before a meeting or when an idea from earlier needs a follow-up.

### Complications

Add Synap to your watch face as a complication for:

- **Quick capture** — Tap to open voice capture instantly
- **Recent thoughts** — See your latest thought on the watch face

Complications are available in all standard sizes. Configure them through the watch face editor.

### How it connects

The watch syncs its server URL and API key from your iPhone via WatchConnectivity. No separate login needed — pair once and it stays connected.

---

## CarPlay

Synap's CarPlay integration is Apple-approved for use while driving. It provides a voice-first interface designed for capturing thoughts on the road.

### Voice capture while driving

When CarPlay is active, Synap presents a simplified, voice-only interface. Tap the microphone and speak your thought. The app transcribes, classifies, and queues it for sync — all without taking your eyes off the road.

This is designed for the moments when your best thinking happens: on a commute, between meetings, during a long drive. Thoughts are captured at the moment of impulse, when they are freshest.

### Trip recaps

After a drive, thoughts captured during the trip are batched and presented as a recap. The system links them to each other and to related thoughts already in your graph, creating a coherent narrative from a drive's worth of ideas.

### Offline handling

If you lose connectivity mid-drive (a tunnel, a rural stretch), thoughts are queued locally and sync when you are back online. The experience is seamless — you never need to worry about signal strength.

---

## HealthKit integration

Synap optionally reads health data from Apple Health to enrich your knowledge graph with wellness context. This gives the AI a fuller picture of your cognitive state when reasoning with you.

### What Synap reads

| Signal | How it is used |
|--------|---------------|
| **Sleep analysis** | Correlates sleep quality with thinking patterns and productivity |
| **Heart rate variability (HRV)** | Stress and recovery signals as context for cognitive output |
| **Steps** | Activity levels as part of your daily rhythm |
| **Cycling workouts** | Exercise context for wellbeing monitoring |

### How it works

Health data is injected into the AI's system prompt when you chat. The AI can cross-reference your health signals with your thinking patterns. For example: "You captured 12 thoughts last Tuesday, which was also your best sleep score of the week" or "Your HRV has been low this week — consider whether the pace is sustainable."

### Enabling HealthKit

1. Go to **Settings > Health Integration**
2. Toggle on the signals you want to share
3. iOS will prompt you for HealthKit permissions
4. Grant read access for the categories you selected

You control exactly which signals Synap can see. Disable any category at any time.

---

## Ambient signals

Beyond HealthKit, Synap integrates 15+ categories of ambient signals from your digital and physical life. These signals flow into your cognitive system passively, enriching the context available to the AI without requiring any manual input from you.

| Signal category | What it captures |
|-----------------|------------------|
| **Calendar** | Upcoming events, meeting context, schedule patterns |
| **Contacts** | People context for relationship-aware reasoning |
| **Location** | Where you are, location-based context triggers |
| **Motion** | Walking, driving, stationary — activity state awareness |
| **Music** | What you are listening to (mood signal via Shazam/Apple Music) |
| **Weather** | Current conditions at your location |
| **Reminders** | Active tasks and action items from Apple Reminders |
| **Journaling suggestions** | iOS journaling prompts that align with your graph activity |
| **NFC** | Physical context triggers from NFC tags (tap a tag to trigger a capture or context switch) |
| **Device state** | Battery, connectivity, screen state |
| **Focus modes** | Filters thoughts and notifications by your current iOS Focus (Work, Personal, Sleep, etc.) |
| **Document capture** | OCR via VisionKit — scan physical documents directly into your graph |
| **Entity extraction** | Automatic recognition of people, places, and dates in your thoughts |

Each signal category can be toggled independently in **Settings > Ambient Signals**. The AI uses these signals to provide richer, more contextual responses — but every category is opt-in and under your control.

---

## Multi-device sync

Your knowledge graph stays in sync across all your devices in real time.

### Real-time sync

When you capture a thought on any device, it appears on every other device within seconds. Sync is powered by WebSocket connections to the ARX server — changes push instantly to all connected clients.

- Capture a thought in Claude Code on your laptop, see it on your phone immediately
- Voice-capture an idea on your watch, find it in your timeline on iPad
- Add a thought via CarPlay, see it linked in your 3D brain view at home

### Offline and MAAP bundles

When a device is offline, it continues to work normally using its local graph. The on-device ARX engine (SurrealDB with ONNX embeddings) performs the same semantic search, graph operations, and auto-association as the cloud server. There is zero capability degradation offline.

When connectivity returns, changes sync via MAAP (Multi-Agent ARX Protocol) bundles. Each bundle carries thoughts, edges, and metadata as an atomic unit. Conflict resolution uses last-write-wins semantics. Embeddings are regenerated locally on the receiving device — vector data is never transmitted over the network.

---

## Cognitive features

### Overnight consolidation

When the app enters the background, a consolidation engine runs — modeled after how the brain processes experiences during sleep. It:

- Links orphan thoughts to related clusters
- Detects stalled tasks and surfaces them
- Clusters emerging patterns
- Applies recency decay to relevance scores (thoughts accessed less frequently fade in retrieval priority, just like biological memory)

Nothing is ever deleted. Connections may weaken over time, but your thoughts are permanent.

### Cognitive guardian

The AI continuously monitors your thinking patterns, productivity signals, and wellbeing indicators. It performs:

- **Gap analysis** — Questions without answers, decisions without evidence, patterns without explanation
- **Momentum detection** — Are you making progress or stuck? The system notices before you do.
- **Pattern surfacing** — Recurring themes across weeks or months that you may not have consciously connected
- **Wellbeing monitoring** — Cross-referencing thought velocity with sleep, HRV, and activity levels

### Daily digests

Synap sends a daily cognitive digest as a notification. It summarizes your graph activity: new thoughts, new connections, emerging patterns, and suggested actions. A quick snapshot of your cognitive health for the day.

### Prior art timestamping

Every thought you capture receives a SHA-256 content hash at creation, chained to the previous thought's hash. This creates a tamper-evident chronological record — a digital lab notebook that writes itself. If you capture ideas, inventions, or creative work in Synap, you automatically build a verifiable record of when each idea was documented.

---

## Settings and preferences

Access settings by tapping the gear icon or navigating to the **Settings** tab.

### Account

- **Server endpoint** — Cloud (`api.synap.ing`) or your self-hosted URL
- **API key** — Stored in iOS Keychain, not visible in plaintext
- **Username** — Your Synap identity

### Security

- **Face ID / Touch ID** — Lock the app behind biometric authentication
- **App lock** — Require authentication every time you open Synap

### AI provider

- Choose between On-Device, Claude, OpenAI, or custom endpoints
- Manage API keys and OAuth sessions
- Select specific models when multiple are available

### Storage mode

| Mode | Description |
|------|-------------|
| **Local only** | All data stays on-device in SQLite. No server communication. |
| **Remote only** | All data on the ARX cloud server. Requires internet. |
| **Hybrid** | Local-first with background sync to the server. Recommended. |

### Ambient signals

Toggle each signal category independently. Every integration is opt-in.

### Notifications

- Daily digest on/off and delivery time
- Orphan thought alerts
- Sync status notifications

### Appearance

- Font size
- Haptic feedback toggles
- Bell sound for terminal sessions

---

## Privacy

Synap is built on a privacy-by-architecture model. You own your graph. Always.

### What stays on your device

- **Local database** — SurrealDB with SQLite (WAL mode) runs entirely on-device, in a shared app group container accessible to the app, widgets, watch, and share extension
- **Vector embeddings** — ONNX 768-dimensional embeddings are generated on-device. The on-device engine is the same as the cloud server, not a lighter substitute. When offline, you have the same cognitive infrastructure as when connected.
- **API keys** — Stored in the iOS Keychain, never transmitted except as authentication headers to your configured server
- **Health data** — Read from HealthKit and used in-memory for the AI system prompt. Never stored in the graph or sent to third parties.
- **Biometric data** — Face ID / Touch ID authentication stays entirely within Apple's Secure Enclave. Synap never sees your biometric data.

### What syncs to the server

- Thought content, metadata, and edges (your knowledge graph)
- Sync happens over HTTPS with your API key as authentication
- Embeddings are never transmitted — they are regenerated locally on each device
- You choose which server: Synap Cloud, your own infrastructure, or local-only mode

### What Synap never does

- Sell, share, or aggregate your data
- Train models on your thoughts
- Access data from other users' graphs
- Store health data outside of in-memory chat context

---

## Troubleshooting

### App will not connect to the server

1. Check your internet connection
2. Go to **Settings > Server** and verify the endpoint URL
3. Tap **Test Connection** to confirm the server is reachable
4. If self-hosting, confirm your ARX server is running and accessible from your network

### Thoughts are not syncing

1. Check that you are in **Hybrid** or **Remote** storage mode (not Local Only)
2. Pull down on the timeline to force a sync
3. Check **Settings > Sync Status** for any queued items or errors
4. If on a slow connection, give it a moment — background sync retries automatically

### Voice capture is not transcribing

1. Go to **iOS Settings > Synap > Microphone** and confirm permission is granted
2. Go to **iOS Settings > Synap > Speech Recognition** and confirm permission is granted
3. Ensure you are not in a noisy environment that overwhelms the on-device speech recognizer
4. Try restarting the app

### Apple Watch is not connecting

1. Ensure the Synap Watch app is installed (check the Watch app on your iPhone)
2. Open Synap on your iPhone — the watch syncs its credentials via WatchConnectivity
3. On the watch, open Synap and check for a connection indicator
4. If the watch was recently paired or reset, re-open Synap on the iPhone to re-push credentials

### CarPlay is not showing Synap

1. Go to **iOS Settings > General > CarPlay** and select your vehicle
2. Ensure Synap appears in the list of available CarPlay apps
3. If it does not appear, try restarting your iPhone and reconnecting to CarPlay

### HealthKit data is not appearing in chat

1. Go to **Settings > Health Integration** and confirm the toggles are on
2. Go to **iOS Settings > Health > Data Access > Synap** and confirm read access is granted for each category
3. Health data is only injected when you start a new chat — it does not retroactively appear in existing conversations

### Widgets are not updating

1. Widgets refresh on a system-managed schedule — they may not update instantly
2. Try removing and re-adding the widget
3. Open the Synap app briefly — this triggers a widget timeline refresh
4. Ensure the app has background refresh enabled in **iOS Settings > General > Background App Refresh**

### 3D Brain view is slow

1. The visualization supports up to 5,000 nodes. If your graph is near this limit, rendering may be slower on older devices.
2. Try zooming out to reduce the visible node density
3. Close other apps to free up memory

### Need more help?

Reach out at [support@synap.ing](mailto:support@synap.ing) or visit [docs.synap.ing](https://docs.synap.ing).
