import pandas as pd
import numpy as np

np.random.seed(42)
num_trips = 1000

print(f"Generating synthetic telemetry for {num_trips} EV trips...")

distances_km = np.random.uniform(50, 350, num_trips)
speeds_kmh = np.random.uniform(40, 120, num_trips)
ac_status = np.random.choice([0, 1], num_trips)

# The Physics Logic
base_drain = distances_km * 0.285
speed_penalty = np.where(speeds_kmh > 80, (speeds_kmh - 80) * 0.15, 0)
ac_penalty = base_drain * 0.12 * ac_status

total_drain_percentage = base_drain + speed_penalty + ac_penalty
total_drain_percentage = np.clip(total_drain_percentage, 0, 100)

ev_data = pd.DataFrame({
    'Distance_km': np.round(distances_km, 2),
    'Average_Speed_kmh': np.round(speeds_kmh, 2),
    'AC_Turned_On': ac_status,
    'Battery_Drained_%': np.round(total_drain_percentage, 2)
})

ev_data.to_csv('v_motors_telemetry_data.csv', index=False)
print("Success! Data saved to v_motors_telemetry_data.csv")