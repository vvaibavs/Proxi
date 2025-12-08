<h1>🚀 Project Overview</h1>

The Raspberry Pi continuously captures camera frames, performs local object detection, determines whether a phone/tablet/laptop is present, and sends the processed results over MQTT to a local server.

The backend stores session data (screen time, last seen, device state) in MongoDB, and the frontend displays analytics to the user.

Full Workflow

1. Pi runs YOLO locally to detect phones, tablets, laptops, etc.

2. Pi publishes detection results (not raw images) via MQTT

3. A Flask server receives the time metrics and exposes REST endpoints

4. A Node.js backend stores screen-time logs in MongoDB

5. A React Native / Web app displays real-time and historical metrics

<h2>🏗️ System Architecture </h2>
[Raspberry Pi]
    |
    → Runs YOLO locally
    → Publishes detection results via MQTT
                 |
                 v
          [Flask Server]
                 ^
                 |
         Frontend fetches detection results
                 |
                 v
        [React Native / Web Frontend]
                 |
                 v
        [Node.js Backend API]
                 |
                 v
               [MongoDB]

 <h2>Components</h2>
 
<h3> 1️⃣ Raspberry Pi Processing </h3>

- Scans surroundings using Picamera2

- Runs YOLO locally for object detection

- Computes screen-time usage intervals

- Publishes detection metadata through MQTT

- No raw images are transmitted → privacy-friendly

<h3>2️⃣ Flask Server</h3>

- Subscribes to MQTT topic

- Receives processed detections from the Pi

- Exposes REST API endpoints for the frontend and backend

<h3>3️⃣ Node.js Backend</h3>

- Connects to MongoDB

- Stores time sessions, device information, and analytics

- Handles authentication and API routes

<h3>4️⃣ React Native / Web Frontend</h3>

- Displays each device’s status

- Shows real-time detection results

- Visualizes historical screen-time trends

- Works on mobile and web through Expo
