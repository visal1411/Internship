# CowFit Dashboard - API Requirements Report

This document outlines all the backend endpoints that the React frontend currently expects in order to function properly. If you are building a real backend (e.g., Node.js, Python, or directly on the ESP32), you should implement these routes.

---

## 1. Devices API
These endpoints manage the hardware scales connected to the system.

### `GET /api/devices`
- **Purpose:** Polled by the dashboard every 3 seconds to get the real-time list of connected devices.
- **Response Format:**
  ```json
  [
    {
      "id": "ESP32-A1B2",
      "name": "Barn Door Scale",
      "status": "online",
      "battery": 95,
      "lastSync": "Just now",
      "currentReading": "0 lbs"
    }
  ]
  ```

### `POST /api/devices`
- **Purpose:** Used by the actual hardware (or Postman) to register a new device to the system. The frontend doesn't call this directly, but it expects the backend to handle it so the device shows up on the next `GET` poll.
- **Request Body Format:**
  ```json
  {
    "id": "ESP32-NEW",
    "name": "Pasture Scale 2",
    "status": "online",
    "battery": 100,
    "lastSync": "Just now",
    "currentReading": "120 lbs"
  }
  ```

### `DELETE /api/devices/:id`
- **Purpose:** Called by the frontend when a user clicks the "Trash" icon to remove a device from the dashboard.
- **URL Parameter:** `:id` (e.g., `/api/devices/ESP32-A1B2`)
- **Response:** `200 OK` (Empty body is fine).

---

## 2. WiFi Configuration API
These endpoints handle network configuration, specifically bridging the browser UI to the host OS/Hardware's actual WiFi interfaces.

### `GET /api/wifi/scan`
- **Purpose:** Called by the `Settings` tab when the user navigates to the WiFi Configuration section. It requests the backend/hardware to perform an actual network scan.
- **Response Format:**
  ```json
  {
    "currentConnection": {
      "ssid": "Farm_Network_5G",
      "strength": 85,
      "status": "connected"
    },
    "networks": [
      {
        "ssid": "Farm_Network_5G",
        "strength": 85,
        "isSecure": true
      },
      {
        "ssid": "Barn_Guest",
        "strength": 40,
        "isSecure": false
      }
    ]
  }
  ```

---

## Next Steps for Backend Integration
When you are ready to replace `json-server` with your real backend:
1. Ensure your backend handles these specific routes and matches the JSON shapes above.
2. If your backend runs on a different port than `4000`, simply update `vite.config.js` to proxy `/api` to your new backend URL.
