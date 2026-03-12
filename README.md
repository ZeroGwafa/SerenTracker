Lucky Rings Tracker (LOTD & Hazelmere)
📋 DESCRIPTION
Ring Tracker is an Alt1 Toolkit app that automatically monitors and records all special drops from the Luck of the Dwarves (LOTD) and Hazelmere's Signet Ring in RuneScape.

Credits: Based on the original SerenTracker by ZeroGwafa

✨ MAIN FEATURES
1️⃣ DROP MONITORING
✅ Automatically detects drop messages in chat

✅ Recognizes 3 different message types:

LOTD: "Your Luck of the Dwarves shines brightly and you receive:"

Hazelmere Normal: "Your Hazelmere's signet ring shines brightly. You receive:"

Hazelmere Double: "The power of Hazelmere blesses your drop and doubles it before your very eyes:"

2️⃣ VISUAL INTERFACE
📊 Drop History
Chronological list of all detected drops

Identification icons:

💎 = LOTD Drop

👑 = Hazelmere Drop

Mouse over shows:

Exact date and time of the drop

Ring type that generated the drop

📈 Item Totals
Total accumulated quantity of each item

Clear separation between:

LOTD drops

Hazelmere drops

Alphabetical item sorting

3️⃣ CONTROLS
🎯 Chat Selection
Automatically detects all visible chats on screen

Dropdown menu to select which chat to monitor

Visual overlay (cyan rectangle) confirming selected chat

Selection persists between sessions

📤 CSV Export
History Mode: Exports detailed list with:

Item

Quantity

Ring Type

Date

Time

Totals Mode: Exports summary with:

Item

Total Quantity

Quantity from LOTD

Quantity from Hazelmere

Auto-adjusting filename

🔄 Factory Reset
Clears all drop history

Resets chat configuration

Returns to fresh install state

4️⃣ TECHNICAL FEATURES
💾 Data Storage
Local storage (localStorage) for persistence

Automatic backup of old data during migration

Chat history maintained in sessionStorage

🌐 Discord Integration
Optional webhook for notifications

Custom messages with emojis

Automatic sending when new drops are detected

🎨 Color Detection
Orange (#F57C01): LOTD drops

Gold (#FFD700): Hazelmere drops

Multiple colors supported simultaneously

5️⃣ USABILITY FEATURES
🔍 Duplicate Prevention
History system prevents registering the same drop multiple times

Verification of already processed lines

Keeps only last 100 chats in temporary history

⚡ Optimized Performance
Chat checking every 600ms

Efficient line processing

Real-time interface updates

🛡️ Fault Tolerance
Null/undefined checks

Try/catch on critical operations

Fallbacks for missing data

6️⃣ SETTINGS
⚙️ System Requirements
RuneScape timestamps enabled

Interface transparency at 0%

Chat filter turned off

Loot chat visible on screen

🔧 Customization Options
Adjustable colors in code

Expandable regex for new patterns

Modular data structure

7️⃣ USAGE EXAMPLES
📝 Detected Messages:
text
[14:30:45] Your Luck of the Dwarves shines brightly and you receive: 500 x Dragonstone bolt tips
[14:32:12] Your Hazelmere's signet ring shines brightly. You receive: 100 x Uncut diamond
[14:35:30] The power of Hazelmere blesses your drop and doubles it: 200 x Onyx bolts
📊 Saved Data:
javascript
{
  item: "500 x Dragonstone bolt tips",
  quantity: 500,
  name: "Dragonstone bolt tips",
  type: "LOTD",
  time: "2024-01-15T14:30:45.000Z"
}
8️⃣ KNOWN LIMITATIONS
Requires chat to be visible on screen

Does not detect messages prior to app opening

Depends on standard game message formatting

9️⃣ FUTURE IMPROVEMENTS (SUGGESTIONS)
📊 Statistical graphs

📱 Multiple profile support

🔔 Configurable sound alerts

📈 Drops per hour rates

💰 Market value calculation

🔟 TECHNOLOGIES USED
TypeScript/JavaScript

Alt1 Toolkit API

HTML5/CSS3

LocalStorage/SessionStorage

Webhooks (Discord)

📦 INSTALLATION
Option 1 - Direct Link:
Copy and paste the following link in Alt1 browser:

text
alt1://addapp/https://YOUR_USERNAME.github.io/RingTracker/appconfig.json
Option 2 - Alt1 Browser:
Navigate to in Alt1 browser:

text
https://YOUR_USERNAME.github.io/RingTracker/
⚙️ INITIAL SETUP
Open the app with RuneScape window visible

Select the correct chat:

Ensure chat filter is OFF

Timestamps must be ON

Interface transparency at 0% (slider fully left in UI Customisation)

📝 CHANGELOG
Version 2.0 (January 2024)

Added support for Hazelmere's Signet Ring

Added double drop detection

Enhanced CSV export with ring type separation

Improved visual interface with ring icons

Discord webhook integration

Version 1.0 (Original)

Basic LOTD tracking

Based on ZeroGwafa's SerenTracker

Version: 2.0
Last Update: January 2024
Compatibility: RuneScape 3 + Alt1 Toolkit
Original Author: ZeroGwafa
Adapted by: Your Name

For support or suggestions, please open an issue on the project repository.