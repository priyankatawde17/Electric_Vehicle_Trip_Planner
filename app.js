// ==========================================
// 🌙 FORCE DARK THEME
// ==========================================
document.body.classList.remove('light-mode');

let currentUserEmail = localStorage.getItem('userEmail') || "";

function toggleAuth(showLogin) {
    document.getElementById('login-panel').classList.toggle('hidden', !showLogin);
    document.getElementById('register-panel').classList.toggle('hidden', showLogin);
    document.getElementById('auth-subtitle').innerText = showLogin ? "User Login" : "Create New Account";
}

// ==========================================
// 🔐 BULLETPROOF LOGIN LOGIC
// ==========================================
async function executeLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if(!email || !password) { 
        showToast("Error: Please complete both Email and Password fields.", "warning"); 
        return; 
    }

    try {
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        });
        
        const data = await res.json();
        
        // IF LOGIN IS SUCCESSFUL: Open the Dashboard
        if(res.status === 200 || res.ok) {
            
            // 1. Force hide the login overlay completely
            const authOverlay = document.getElementById('auth-overlay');
            authOverlay.classList.add('hidden');
            authOverlay.style.display = "none"; 
            
            // 2. Force show the main dashboard
            const appWrapper = document.getElementById('main-app-wrapper');
            appWrapper.classList.remove('hidden');
            appWrapper.style.display = "grid"; 
            
            // 3. Save user session
            currentUserEmail = email;
            localStorage.setItem('userEmail', email);
            
            // 4. Safe UI updates
            const userName = (data && data.user && data.user.fullname) ? data.user.fullname : "User";
            showToast(`Welcome back, ${userName}!`, "safe");

            try { renderHistory(); } catch(err) { console.error(err); }
            setTimeout(() => { if(typeof map !== 'undefined') map.invalidateSize(); }, 300);
            
        } else { 
            // IF LOGIN FAILS: Show Wrong Password/Email Error
            showToast(data.detail || "Error: Invalid Email or Password.", "critical"); 
        }
    } catch (e) { 
        showToast("Server is offline. Check backend.", "critical"); 
    }
}

function toggleLoginPassword() {
    const passInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggleLoginBtn');

    if (passInput.type === "password") {
        passInput.type = "text";
        toggleBtn.innerText = "Hide";
    } else {
        passInput.type = "password";
        toggleBtn.innerText = "Show";
    }
}   

// ==========================================
// 📝 STRICT REGISTRATION LOGIC WITH CUSTOM ERRORS
// ==========================================
async function executeRegistration() {
    const fname = document.getElementById('reg-fname') ? document.getElementById('reg-fname').value.trim() : "";
    const lname = document.getElementById('reg-lname') ? document.getElementById('reg-lname').value.trim() : "";
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!fname) { showToast("Error: First Name is missing.", "critical"); return; }
    if (!lname) { showToast("Error: Last Name is missing.", "critical"); return; }
    if (!email) { showToast("Error: Email Address is missing.", "critical"); return; }
    if (!phone) { showToast("Error: Phone Number is missing.", "critical"); return; }
    if (!password) { showToast("Error: Password is missing.", "critical"); return; }

    if (!email.includes('@')) { 
        showToast("Email Error: '@' symbol is missing.", "critical"); return; 
    }
    if (!email.toLowerCase().includes('gmail')) { 
        showToast("Email Error: 'gmail' domain is missing.", "critical"); return; 
    }
    if (!email.toLowerCase().includes('.com')) { 
        showToast("Email Error: '.com' is missing.", "critical"); return; 
    }

    if (!/^\d+$/.test(phone)) { 
        showToast("Phone Error: Please enter numbers only.", "critical"); return; 
    }
    if (phone.length < 10) { 
        showToast("Phone Error: Number is less than 10 digits.", "critical"); return; 
    }
    if (phone.length > 10) { 
        showToast("Phone Error: Number is more than 10 digits.", "critical"); return; 
    }

    if (!/[A-Z]/.test(password)) { 
        showToast("Password Error: Needs at least one uppercase letter.", "critical"); return; 
    }
    if (!/[a-z]/.test(password)) { 
        showToast("Password Error: Needs at least one lowercase letter.", "critical"); return; 
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) { 
        showToast("Password Error: Needs at least one special symbol.", "critical"); return; 
    }

    const fullname = fname + " " + lname;

    try {
        const res = await fetch("http://localhost:8000/auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullname: fullname, email: email, phone: phone, password: password })
        });
        const data = await res.json();
        
        if(res.status === 200 || res.ok) {
            showToast("Account created successfully! Proceeding to login.", "safe");
            toggleAuth(true); 
            document.getElementById('login-email').value = email; 
        } else { 
            showToast(data.detail || "Error creating account.", "critical"); 
        }
    } catch(e) { 
        showToast("Server is offline.", "critical"); 
    }
}

const evs = ["Tata Nexon EV LR", "Tata Punch EV LR", "Tata Tiago EV", "MG ZS EV", "MG Comet EV", "Hyundai IONIQ 5", "Kia EV6", "BYD Atto 3", "BYD Seal", "Mahindra XUV400 EL"];
const evSelect = document.getElementById('ev_model');
evs.forEach(ev => evSelect.add(new Option(ev, ev)));

const cities = ["Ahmednagar", "Akola", "Amravati", "Beldum", "Bhandara", "Bhiwandi", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Navi Mumbai", "Osmanabad", "Parbhani", "Pimpri-Chinchwad", "Pune", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"];
const startSelect = document.getElementById('start_city');
const endSelect = document.getElementById('end_city');
const waypointSelect = document.getElementById('waypoint');
cities.forEach(city => { startSelect.add(new Option(city, city)); endSelect.add(new Option(city, city)); waypointSelect.add(new Option(city, city)); });
startSelect.value = "Mumbai"; endSelect.value = "Pune";

document.getElementById('trip_date').valueAsDate = new Date();
const map = L.map('map').setView([19.7515, 75.7139], 6);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

let routeLayers = [], mapMarkers = [], elevChart = null;
let currentSimulationData = null, currentAltIndex = 0; 
let interactiveHoverMarker = null;

setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

function setUI(id, value) { const el = document.getElementById(id); if(el) el.innerText = value; }

function renderMapSegments(segments, accidents, isAlternative = false) {
    routeLayers.forEach(layer => map.removeLayer(layer)); routeLayers = [];
    let bounds = [];
    segments.forEach(seg => {
        if(seg.coords && seg.coords.length > 0) {
            let renderCoords = seg.coords;
            if (isAlternative) renderCoords = seg.coords.map(coord => [coord[0] + 0.005, coord[1] + 0.005]); 
            const line = L.polyline(renderCoords, {color: seg.color, weight: 6, opacity: 0.85}).addTo(map);
            routeLayers.push(line); renderCoords.forEach(coord => bounds.push(coord));
        }
    });

    if (accidents) {
        accidents.forEach(acc => {
            const iconHtml = `<div style="font-size: 20px; text-shadow: 0 0 10px red;">🚧</div>`;
            const accIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [20,20] });
            const m = L.marker([acc.lat, acc.lng], {icon: accIcon}).addTo(map).bindPopup(`<b style="color:red;">Live Alert:</b><br>${acc.type}`);
            routeLayers.push(m);
        });
    }
    if(bounds.length > 0) map.fitBounds(bounds, {padding: [30, 30]});
}

function renderChargingStops(chargingPlan) {
    mapMarkers.forEach(m => map.removeLayer(m)); mapMarkers = [];
    const chargeContainer = document.getElementById('charging-container');
    if (!chargeContainer) return;
    
    chargeContainer.innerHTML = ""; 
    chargingPlan.forEach(stop => {
        const isFast = stop.type === "FAST";
        const isRequired = stop.required;
        const markerColor = isRequired ? '#ef4444' : '#a855f7'; 
        const iconHtml = `<div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px ${markerColor};" class="${isRequired ? 'pulse-fast' : ''}"></div>`;
        const markerIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [18,18] });
        
        const marker = L.marker([stop.lat, stop.lng], {icon: markerIcon}).addTo(map).bindPopup(`<b>${stop.station}</b>`);
        mapMarkers.push(marker);

        const reqBadge = isRequired ? `<span class="badge bg-red">MUST STOP</span>` : `<span class="badge bg-green" style="color: #d8b4fe;">SUGGESTED</span>`;
        const typeBadge = isFast ? `<span class="badge bg-red">⚡ FAST</span>` : `<span class="badge bg-green">🔌 MEDIUM</span>`;
        const transitBtn = stop.transit_option ? `<button class="transit-btn" onclick="event.stopPropagation(); openHotelBooking('${stop.station}')">${stop.transit_option}</button>` : '';
        const slotColor = stop.slots > 0 ? "bg-green" : "bg-orange";
        
        chargeContainer.innerHTML += `
            <div class="charge-card" onclick="map.flyTo([${stop.lat}, ${stop.lng}], 13, {duration: 1.5})" style="border-left: 5px solid ${markerColor}; opacity: 1;">
                <div style="display: flex; gap: 5px; margin-bottom: 8px;">${reqBadge} ${typeBadge} <span class="badge bg-grey">🔌 ${stop.plug_type}</span></div>
                <h4>${stop.station}</h4>
                <div class="km-highlight">📍 Route Location: ${stop.km_mark} km mark</div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 8px; margin-top: 5px;">
                    <span class="badge ${slotColor}">🟢 ${stop.slots} Slots</span> 
                    <span class="badge bg-grey">💰 ${stop.price}</span>
                </div>
                <div style="font-size: 0.8rem; color: #cbd5e1; margin-bottom:8px;">${stop.wait_prediction}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:0.75rem; color:#10b981;">🛡️ Safety Score: ${stop.safety_score}%</div>
                    <button onclick="event.stopPropagation(); openCCTV('${stop.cctv_feed}', '${stop.station}')" style="background:transparent; border:1px solid #334155; color:#cbd5e1; border-radius:4px; padding:4px 8px; font-size:0.75rem; cursor:pointer;">📹 Live Cam</button>
                </div>
                <div class="charge-activity" style="font-size: 0.85rem; color: #fbbf24; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; margin-top: 10px;">${stop.activity}</div>
                ${transitBtn}
                <button class="book-btn" onclick="event.stopPropagation(); openPaymentGateway('${stop.station}', ${stop.rate_per_kwh}, false, ${stop.kwh_taken})">Reserve Slot Now</button>
            </div>`;
    });
    if(chargingPlan.length === 0) chargeContainer.innerHTML = `<p style="color: #10b981; font-weight: bold;">No highway charging stops found.</p>`;
}

window.changeRoute = function(index) {
    currentAltIndex = index;
    const selectedRoute = currentSimulationData.route_alternatives[index];
    const isAlternative = index > 0;
    renderMapSegments(selectedRoute.segments, selectedRoute.accidents, isAlternative);
    renderAlternatives();
    renderChargingStops(selectedRoute.charging_plan); 
    if (selectedRoute.segments) drawChart(currentSimulationData.advanced.elevations[index], selectedRoute.segments);
}

function renderAlternatives() {
    const altContainer = document.getElementById('route-alts-container');
    if (altContainer && currentSimulationData) {
        altContainer.innerHTML = "";
        currentSimulationData.route_alternatives.forEach((alt, index) => {
            const isActive = index === currentAltIndex;
            const borderStyle = isActive ? `border-left: 6px solid ${alt.color}; background: rgba(30, 41, 59, 0.9); box-shadow: 0 0 20px ${alt.color}40; transform: scale(1.02);` : `border-left: 4px solid ${alt.color};`;
            altContainer.innerHTML += `<div class="charge-card" onclick="changeRoute(${index})" style="${borderStyle} transition: 0.3s;"><h4 style="color:${alt.color}; font-size:1.1rem; margin-bottom:5px;">${alt.name} ${isActive ? '✅' : ''}</h4><p style="font-size:0.8rem; margin-bottom:10px; color:#cbd5e1;">${alt.desc}</p><div style="margin-top:8px;"><span class="badge bg-grey">⏳ ${alt.time}</span> <span class="badge bg-grey">💰 ${alt.cost}</span> <span class="badge bg-grey">🔋 ${alt.drain}</span></div></div>`;
        });
    }
}

function updateETA(driveMins, chargeMins) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + driveMins + chargeMins);
    document.getElementById('live-eta').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

async function runSimulation() {
    const btn = document.getElementById('run-btn'); btn.innerText = "Searching Routes...";
    const payload = {
        start_city: startSelect.value, waypoint: waypointSelect.value, end_city: endSelect.value,
        ev_model: evSelect.value, speed: 80, ac_on: parseInt(document.getElementById('ac_on').value), 
        trip_date: document.getElementById('trip_date').value, neural_routing: true
    };
    if(payload.start_city === payload.end_city) { alert("Origin and Destination cannot be the same."); btn.innerText = "SEARCH ROUTES"; return; }

    try {
        const response = await fetch("http://localhost:8000/analyze_trip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json();
        currentSimulationData = result; currentAltIndex = 0; 
        
        saveTripToHistory(payload);

        setUI('save-money', result.savings.money); setUI('charge-cost', result.savings.charging_cost);
        setUI('save-fuel', result.savings.fuel); setUI('save-co2', result.savings.co2);
        setUI('opt-dist', result.route.distance); setUI('opt-drain', result.ev_data.drain);
        setUI('v2g-money', result.advanced.v2g_revenue); 
        setUI('grid-status', result.grid.status); setUI('grid-stress', result.grid.stress);

        updateETA(result.route.drive_time_mins, result.route.charge_time_mins);

        const batTempUi = document.getElementById('bat-temp'); const thermalAlertUi = document.getElementById('thermal-alert');
        if (batTempUi) batTempUi.innerText = result.environment.battery_temp + "°C";
        if(batTempUi && thermalAlertUi) { batTempUi.className = "big-val text-green"; thermalAlertUi.className = "badge bg-green"; thermalAlertUi.innerText = "✅ Thermal Stable"; }

        setUI('w-icon', result.environment.weather.icon); 
        setUI('w-temp', result.environment.weather.temp + "°C"); 
        setUI('w-desc', result.environment.weather.desc); 
        setUI('w-impact', "Impact on range: " + result.environment.weather.impact);

        const insightsList = document.getElementById('smart-insights-list');
        if (insightsList) { 
            insightsList.innerHTML = ""; 
            result.smart_insights.forEach(insight => { insightsList.innerHTML += `<li style="margin-bottom: 8px;">${insight}</li>`; }); 
        }

        const statusBadge = document.getElementById('charge-status-badge');
        if (statusBadge) {
            if(result.ev_data.charging_required) { 
                statusBadge.innerText = `⚠️ STOP REQUIRED AT ${result.ev_data.next_charge_km} KM MARK`; 
                statusBadge.className = "status-badge req-true"; 
                showToast("⚠️ Charging Required for this trip.", "critical");
            } else { 
                statusBadge.innerText = "✅ SUFFICIENT BATTERY"; 
                statusBadge.className = "status-badge req-false"; 
                showToast("✅ Sufficient Range for this trip. No charging required.", "safe");
            }
        }

        const firstRoute = result.route_alternatives[0];
        renderMapSegments(firstRoute.segments, firstRoute.accidents, false); 
        renderAlternatives();
        renderChargingStops(firstRoute.charging_plan); 

        if(result.city_stations) {
            result.city_stations.forEach(st => {
                const iconHtml = `<div style="background-color: #a855f7; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(168,85,247,0.8);"></div>`;
                const cityMarkerIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [14,14] });
                const marker = L.marker([st.lat, st.lng], {icon: cityMarkerIcon}).addTo(map)
                    .bindPopup(`<b style="color: #a855f7;">${st.name} (City Hub)</b><br>Available Slots: ${st.slots}`);
                mapMarkers.push(marker);
            });
        }

        drawChart(result.advanced.elevations[0], firstRoute.segments);
        
        const elevText = document.getElementById('elev-analysis-text');
        if (elevText) {
            const totalElevationGain = result.advanced.elevations[0][result.advanced.elevations[0].length - 1] - result.advanced.elevations[0][0];
            if (totalElevationGain > 300) {
                elevText.innerHTML = `⚠️ High Elevation Detected (+${totalElevationGain}m). Battery drain will be higher.`;
                elevText.style.color = "#ef4444"; 
            } else {
                elevText.innerHTML = `✅ Flat Route (+${totalElevationGain}m). Optimal battery efficiency.`;
                elevText.style.color = "#10b981"; 
            }
        }

        setTimeout(() => { map.invalidateSize(); }, 300);

    } catch (error) { console.error("Simulation crashed:", error); alert("System encountered an error finding routes."); }
    btn.innerText = "SEARCH ROUTES";
}

function drawChart(elevationData, routeSegments) {
    const ctx = document.getElementById('elevationChart').getContext('2d');
    if(elevChart) elevChart.destroy();
    
    let flatCoords = [];
    if(routeSegments) {
        routeSegments.forEach(seg => {
            if(seg.coords) flatCoords.push(...seg.coords);
        });
    }
    let mappedCoords = [];
    for(let i=0; i<11; i++) {
        if(flatCoords.length > 0) {
            let idx = Math.floor((i/10) * (flatCoords.length - 1));
            mappedCoords.push(flatCoords[idx]);
        }
    }

    elevChart = new Chart(ctx, { 
        type: 'line', 
        data: { 
            labels: ['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%'], 
            datasets: [{ label: 'Elevation (m)', data: elevationData, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true, tension: 0.4 }] 
        }, 
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { labels: { color: '#f1f5f9' } } }, 
            scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } },
            onHover: (event, chartElement) => {
                if(chartElement.length > 0 && mappedCoords.length > 0) {
                    const index = chartElement[0].index;
                    const coord = mappedCoords[index];
                    if(!interactiveHoverMarker) {
                        interactiveHoverMarker = L.marker(coord, { icon: L.divIcon({ className: 'pulse-fast', iconSize: [20,20] }) }).addTo(map);
                    } else {
                        interactiveHoverMarker.setLatLng(coord);
                    }
                }
            }
        } 
    });
}

function showToast(message, level) {
    const container = document.getElementById('toast-container'); if(!container) return;
    const toast = document.createElement('div'); toast.className = `toast ${level}`; toast.innerText = message;
    container.appendChild(toast); 
    
    toast.style.display = 'block';
    toast.style.opacity = '1';
    
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 5000);
}

async function saveTripToHistory(payload) {
    if(!currentUserEmail) return;
    const tripName = payload.waypoint !== "None" ? `${payload.start_city} > ${payload.waypoint} > ${payload.end_city}` : `${payload.start_city} > ${payload.end_city}`;
    try {
        await fetch("http://localhost:8000/db/save_trip", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUserEmail, trip_name: tripName, date: new Date().toLocaleTimeString(), ev_model: payload.ev_model })
        });
        renderHistory();
    } catch(e) { console.error("DB Save failed", e); }
}

async function renderHistory() {
    const list = document.getElementById('history-list'); if(!list) return;
    if(!currentUserEmail) { list.innerHTML = "<p style='color:#64748b; font-size:0.8rem;'>Login to view history.</p>"; return; }
    try {
        const res = await fetch(`http://localhost:8000/db/get_trips/${currentUserEmail}`);
        const data = await res.json();
        list.innerHTML = "";
        if(data.history.length === 0) { list.innerHTML = "<p style='color:#64748b; font-size:0.8rem;'>No recent trips in DB.</p>"; return; }
        
        data.history.forEach((trip) => { 
            list.innerHTML += `<div class="history-item"><div><strong>${trip.name}</strong><br><span style="color:#9ca3af; font-size:0.7rem;">${trip.date} | ${trip.ev_model}</span></div></div>`; 
        });
    } catch(e) { console.error(e); }
}

function loadTrip(index) {
    let history = JSON.parse(localStorage.getItem('vmotors_history')) || [];
    const payload = history[index].payload;
    document.getElementById('start_city').value = payload.start_city; 
    document.getElementById('waypoint').value = payload.waypoint; 
    document.getElementById('end_city').value = payload.end_city; 
    document.getElementById('ev_model').value = payload.ev_model; 
    if (document.getElementById('ac_on')) { document.getElementById('ac_on').value = payload.ac_on; }
    runSimulation();
}

function toggleChat() {
    const chat = document.getElementById('chatbot-window'); chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
}
function askBot(topic) {
    const input = document.getElementById('chat-input'); input.value = `Tell me about the ${topic}`; sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input'); const msg = input.value.trim();
    if(!msg) return;

    const body = document.getElementById('chat-body');
    body.innerHTML += `<div class="user-msg">${msg}</div>`; input.value = ''; body.scrollTop = body.scrollHeight;

    const typingId = 'typing-' + Date.now();
    body.innerHTML += `<div class="bot-msg typing-anim" id="${typingId}">Thinking<span class="dots">...</span></div>`; body.scrollTop = body.scrollHeight;

    try {
        const response = await fetch("http://localhost:8000/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, context: currentSimulationData }) });
        const data = await response.json();
        document.getElementById(typingId).remove();
        body.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
    } catch(e) { document.getElementById(typingId).remove(); body.innerHTML += `<div class="bot-msg" style="color:#f87171;">Connection lost. Try again.</div>`; }
    body.scrollTop = body.scrollHeight;
}
function handleChatEnter(e) { if(e.key === 'Enter') sendChatMessage(); }

function openPaymentGateway(stationName, unitRate, isHotel = false, kwhOrDuration = 0) {
    document.getElementById('pay-station-name').innerText = stationName;
    const breakdownDiv = document.getElementById('pay-math-breakdown');
    let totalPrice = 0;
    if (!isHotel) {
        totalPrice = Math.round(unitRate * kwhOrDuration);
        breakdownDiv.innerHTML = `⚡ Energy Needed: <b>${kwhOrDuration} kWh</b><br>💵 Cost Per unit: <b>₹${unitRate}/kWh</b>`;
    } else {
        totalPrice = unitRate;
        breakdownDiv.innerHTML = `🏨 Stay Tier: <b>Standard Fresh-up Suite</b><br>⏱️ Allocated Time: <b>${kwhOrDuration}</b>`;
    }
    document.getElementById('pay-amount').innerText = `₹${totalPrice}`;
    document.getElementById('payment-modal').classList.remove('hidden');
    togglePaymentFields(); 
}

window.togglePaymentFields = function() {
    const method = document.getElementById('pay_method').value;
    document.getElementById('card-payment-fields').classList.toggle('hidden', method !== 'card');
    document.getElementById('online-payment-fields').classList.toggle('hidden', method !== 'online');
    document.getElementById('cash-payment-fields').classList.toggle('hidden', method !== 'cash');
}

function processPayment() {
    const method = document.getElementById('pay_method').value;
    if (method === 'card') {
        const num = document.getElementById('card_num').value;
        const exp = document.getElementById('card_exp').value;
        const svc = document.getElementById('card_svc').value;
        if (!num || !exp || !svc) { alert("Please input valid card transaction values."); return; }
    }
    const btn = document.getElementById('pay-btn');
    const originalText = btn.innerText;
    btn.innerText = "Authorizing Transaction...";
    btn.style.background = "#f59e0b"; 
    setTimeout(() => {
        btn.innerText = "Success! ✅";
        btn.style.background = "#10b981"; 
        setTimeout(() => {
            closeModals();
            showToast(`Transaction verified successfully via ${method.toUpperCase()}!`, "safe");
            btn.innerText = originalText;
            btn.style.background = "#3b82f6";
        }, 1200);
    }, 1500);
}

window.openHotelBooking = function(stationName) {
    document.getElementById('hotel-station-name').innerText = stationName;
    const box = document.getElementById('hotel-listings-box');
    box.innerHTML = `
        <div style="background:rgba(30,41,59,0.8); padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h4 style="color:white; margin:0;">🏨 OYO Smart Stay Rooms</h4>
                <p style="color:#f59e0b; font-size:0.8rem; margin:4px 0;">⏱️ Required Time: 1 Hour (Quick Fresh-up)</p>
                <b style="color:#10b981;">₹600 Flat Rate</b>
            </div>
            <button class="history-btn" onclick="bookHotel('OYO Smart Stay', 600, '1 Hour Quick Session')">Select</button>
        </div>
        <div style="background:rgba(30,41,59,0.8); padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h4 style="color:white; margin:0;">🏨 Executive Plaza Highway Lounge</h4>
                <p style="color:#f59e0b; font-size:0.8rem; margin:4px 0;">⏱️ Required Time: 2 Hours (Rest & Freshen Up)</p>
                <b style="color:#10b981;">₹950 Flat Rate</b>
            </div>
            <button class="history-btn" onclick="bookHotel('Executive Plaza', 950, '2 Hours Rest Stay')">Select</button>
        </div>
    `;
    document.getElementById('hotel-modal').classList.remove('hidden');
}

window.bookHotel = function(hotelName, rate, durationText) {
    document.getElementById('hotel-modal').classList.add('hidden');
    setTimeout(() => { openPaymentGateway(hotelName, rate, true, durationText); }, 400);
}

window.openCCTV = function(imgUrl, stationName) {
    document.getElementById('cctv-station-name').innerText = stationName;
    document.getElementById('cctv-feed-img').src = imgUrl;
    document.getElementById('cctv-modal').classList.remove('hidden');
}

window.closeModals = function() {
    document.getElementById('payment-modal').classList.add('hidden');
    document.getElementById('hotel-modal').classList.add('hidden');
    document.getElementById('cctv-modal').classList.add('hidden');
}