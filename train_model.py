import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

print("Loading EV Telemetry Data...")
# 1. Load the generated data
df = pd.read_csv('v_motors_telemetry_data.csv')

# 2. Define our Features (Inputs) and Target (Output to predict)
X = df[['Distance_km', 'Average_Speed_kmh', 'AC_Turned_On']]
y = df['Battery_Drained_%']

# 3. Split data into Training (80%) and Testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training the Random Forest Machine Learning Model...")
# 4. Initialize and Train the Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Test the Model's Accuracy
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n--- Model Evaluation ---")
print(f"Accuracy Score (R-squared): {r2 * 100:.2f}%")
print(f"Average Error Margin: {mae:.2f}% battery drain")

# 6. Make a Live Prediction!
print("\n--- Simulating a New Trip ---")
# Example: 150km trip, driving fast at 100km/h, with AC On (1)
new_trip = pd.DataFrame({'Distance_km': [150], 'Average_Speed_kmh': [100], 'AC_Turned_On': [1]})
predicted_drain = model.predict(new_trip)[0]

print(f"Trip Details: 150 km distance, 100 km/h speed, AC On.")
print(f"AI Prediction: This trip will consume {predicted_drain:.2f}% of the battery.")

# Save the trained model to a file
joblib.dump(model, 'ev_battery_model.pkl')
print("Model saved successfully as 'ev_battery_model.pkl'")