# IoT-Based-Real-Time-Temperature-Monitoring-and-Alert-System-for-Vaccine-Cold-Chain-Management-
This project is an IoT-based system that monitors vaccine storage temperatures in real time and sends alerts via SMS or mobile app when they go outside the safe range (2°C–8°C). It uses sensors, cloud connectivity, and a dashboard to support quick response, ensure safe storage, and reduce vaccine wastage.
## To run the Project
---
### Run the Frontend
1. Open the vaxtrack in terminal.
2. type code . (to open in vscode)
3. open the vscode terminal and cd into the frontend folder
4. type "npm install" to install the packages
5. then npm start (to start the UI)
6. it should on port localhost:3000


#### Run the backend.
1. Open the project in terminal,
2. Activate your virtual enviroment
3. cd in the backend folder
4. pip install -r requirements.txt
5. pip install dotenv
6. uvicorn app.main:app --reload
---

Project Scope
The system integrates IoT hardware, cloud computing, backend services, and machine learning to provide real-time monitoring, prediction, visualization, and alerting for vaccine cold chain management.

Tech Stack
Hardware
Arduino / ESP32
DS18B20 Temperature Sensor
Wi-Fi / GSM Module
Buzzer & Battery system

Software & Backend
Arduino IDE (Embedded C)
Python
Node.js (optional backend server)
Firebase / ThingSpeak
REST APIs
Machine Learning
Python (Scikit-learn / TensorFlow)
Time series forecasting model (LSTM / Regression models)
Anomaly detection for early warning

Frontend
Web Dashboard (HTML, CSS, JavaScript)
Mobile App (Flutter)

System Overview
Sensor Module: Captures temperature using DS18B20
Microcontroller: Sends data via Wi-Fi/GSM
Backend: Stores and processes real-time data
Machine Learning Engine: Predicts future temperature trends and detects anomalies
Dashboard: Displays real-time and predicted temperature graphs
Mobile App: Shows alerts and live data
Alert System: Sends notifications for both real-time and predicted risks

How It Works
Sensor reads temperature from vaccine storage
ESP32/Arduino transmits data to cloud
Backend stores and processes data
ML model analyzes historical data and predicts future temperature trends
Alerts are triggered for:
Real-time unsafe temperatures
Predicted risk of temperature violation
Users monitor system via web dashboard or mobile app

Expected Outcomes
Real-time + predictive temperature monitoring
Early warning for potential cold chain failures
Reduced vaccine spoilage and wastage
Improved decision-making using data insights
Scalable smart IoT healthcare solution

Deliverables
IoT hardware prototype
Backend API system
Machine learning prediction model
Web dashboard with analytics
Mobile application
Alert system (real-time + predictive)lementation

Tinkercad Sumulation Link
https://www.tinkercad.com/things/aEamlKJULS9-vax-track/editel?sharecode=ApA8drkSKtTM6_Ja3CRju9G8B8pjFrUq7_zSNrQnu10
