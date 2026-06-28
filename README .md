Btech Final year project 🚗 V-Motors Ultimate Engine | Enterprise EV AI Dashboard V-Motors Ultimate Engine is a next-generation Electric Vehicle (EV) routing and telemetry dashboard. Built as an advanced predictive modeling and reinforcement learning (RL) simulation, this application calculates precise battery drain, visualizes range anxiety, optimizes charging stops, and introduces live grid-balancing economics (V2G). It features a premium glassmorphism UI, interactive map-matching, and V-Bot, a context-aware, voice-enabled AI assistant.
✨ Comprehensive Feature List 🗺️ Advanced Routing & Mapping Multi-Stop Waypoint Routing: Seamlessly calculate trips from Origin 
→
 Waypoint 
→
 Destination. AI Route Alternatives: Automatically generates and visualizes 3 distinct paths: ⚡ Fastest, 🍃 Eco-Efficient, and 💰 Cheapest. Interactive Telemetry Map: Powered by Leaflet.js. Visualizes clear paths, traffic bypasses, and elevation slopes.
Sync-Hover Elevation Chart: An interactive Chart.js elevation profile. Hovering over a mountain/slope on the chart displays a live pulsing marker on the geographic map. Live ETA Calculator: Calculates accurate arrival times factoring in driving speed and mandatory charging delays. 🔋 EV & Battery Analytics Range Anxiety Monitor: Visualizes the exact "Safe Zone" vs "Risk Zone" on a dynamic progress bar based on live battery drain.

Thermal Engine: Simulates battery core temperatures based on weather, driving speed, and AC usage, warning the driver of critical overheating.

Dynamic Battery Drain: Calculates drain based on vehicle specific EV models (Tata Nexon, MG ZS, etc.), speed, climate, and real-time weather penalties.

🔌 Charging & Grid Economics (V2G) Smart Slot Booking: Predicts mandatory vs optional charging stops, estimates wait times, open slots, and generates "Book Slot" actions.

Live Grid Balancing (V2G): Simulates city power grid stress. During peak load, charging costs increase, but Vehicle-to-Grid (V2G) payout revenue doubles.

Charging Cost Calculator: Estimates the exact financial cost of electricity required to complete the trip.

Multi-Modal Wait Times: Suggests nearby tourist spots, cafes, or malls while the EV is charging, complete with Uber/Ola transit booking suggestions.

🤖 V-Bot: The Sassy Voice AI Assistant Voice-to-Text Recognition: Click the mic to speak your questions using native Web Speech API integration.

Context-Aware Logic: V-Bot reads the live dashboard. Ask "Will I overheat?" or "What's the cost?" and it replies based on actual simulation data.

Real LLM Integration: Fallback ready for the OpenAI API to handle complex, human-like conversational queries.

💎 Enterprise UI/UX & Gamification Eco-Driver Leaderboard: Saves lifetime user stats (Total CO2 Prevented, Total Money Saved) and assigns driver ranks via localStorage.

Trip History: Saves recent trips for 1-click "Repeat Trip" functionality.
🛠️ Technology Stack Frontend:

HTML5 / CSS3 (Custom Premium Dark Theme)

Vanilla JavaScript (ES6+)

Leaflet.js (Geospatial Mapping)

Chart.js (Data Visualization)

Web Speech API (Voice Recognition)

Backend:

Python 3.9+

FastAPI (High-performance API framework)

Uvicorn (ASGI Server)

Requests (For external API integrations)

External Integrations (Optional/Ready):

OpenWeather API

OpenAI API (GPT-3.5/4)

📂 Project Structure Plaintext v-motors-engine/ │ ├── api.py # The Python FastAPI backend (AI, RL, Thermal, Chatbot logic) ├── index.html # The main application layout and UI structure ├── style.css # Premium Glassmorphism and responsive design rules └── app.js # Frontend logic, API fetching, Map/Chart rendering, Voice Dictation 🚀 Setup & Installation Guide Prerequisites Ensure you have Python 3.8+ installed on your system.

Step 1: Install Backend Dependencies Open your terminal/command prompt and install FastAPI, Uvicorn, and Requests:

Bash pip install fastapi uvicorn requests pydantic Step 2: Configure API Keys (Optional) If you want to use real live weather and the real ChatGPT backend, open api.py and replace the placeholder strings at the top of the file:

Python OPENWEATHER_API_KEY = "your_openweather_key_here" OPENAI_API_KEY = "your_openai_key_here" (Note: If you leave these blank, the app will safely fallback to the advanced local simulation engine and will not crash).

Step 3: Start the Python Backend Run the following command in the folder where your api.py file is located:

Bash python -m uvicorn api:app --reload You should see output indicating the server is running on http://127.0.0.1:8000. Keep this terminal window open.

Step 4: Launch the Application Simply double-click the index.html file to open it in your web browser (Chrome, Edge, or Brave recommended for optimal Voice API support).

Step 5: Initiate Telemetry Select your EV Model, Origin, Waypoint, and Destination.

Adjust your Speed and AC settings.

Click Initiate Telemetry to generate the route.

Open the V-Bot Chatbot at the bottom right to talk to your new AI assistant!

Glassmorphism Dark Theme: A premium, Silicon Valley-aesthetic with neon glows, micro-interactions, and toast notifications.

PDF Export: 1-click generation of a clean, printable trip itinerary and report
