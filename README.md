# 🌊 FloodGuard

**Predict. Explain. Warn. Route. Crowdsource.**

> An intelligent flood-risk platform combining geospatial intelligence, machine learning, real-time alerts, safe routing, and community-driven incident reporting.

---

## 🚀 Live Demo

### 🌐 Try FloodGuard

**[Open FloodGuard →](https://floodguard-eta.vercel.app)**

### Backend API

**[FloodGuard API →](https://floodguard-api-h1bf.onrender.com)**

### Backend Health Check

**[API Health →](https://floodguard-api-h1bf.onrender.com/health)**

> The frontend is deployed on Vercel and the backend API is deployed on Render.

---

## 🎯 Problem Statement

Urban areas face increasing flood risks due to climate change, rapid urbanization, inadequate drainage infrastructure, and limited localized information.

During flooding, citizens often lack:

- Real-time information about nearby flood risks
- Safe routes that avoid flooded areas
- Reliable incident reports from other citizens
- Actionable warnings
- Explainable information about why an area is considered risky

Traditional systems often provide broad weather or disaster information without enough **localized, actionable intelligence**.

---

## 💡 Solution Overview

**FloodGuard** is a flood-risk intelligence platform designed to help citizens and authorities **understand, report, and respond to localized flooding.**

The platform combines:

- 🧠 Machine Learning
- 🗺️ Geospatial intelligence
- 📍 Real-time location detection
- 🚨 Risk alerts
- 🛣️ Safe route comparison
- 👥 Crowdsourced incident reporting
- 📸 Image-based incident evidence
- 🔐 Authentication and role-based access
- ☁️ Cloud-ready AWS architecture

---

## ✨ Key Features

### 🧠 Predict

ML-powered local flood-risk assessment based on environmental and geographical factors.

### 🔍 Explain

Explainable AI insights help users understand **why** a particular area has a higher flood risk.

Example factors include:

- Rainfall intensity
- Drainage conditions
- Historical flood patterns
- Elevation
- Local risk zones

---

### 🚨 Warn

Localized flood alerts help users stay informed about potentially dangerous areas.

The architecture supports event-driven alert delivery using AWS services such as:

- Amazon EventBridge
- AWS Lambda
- Amazon SNS

---

### 🛣️ Route

Compare multiple routes while considering flood-risk zones.

Instead of simply finding the shortest route, FloodGuard is designed to help users find a **safer route**.

```text
Route A → Shortest but HIGH flood risk
Route B → Slightly longer but LOW flood risk
Route C → Moderate risk

          ↓

Recommended Route → Route B
