# Phishing Attacks Checker

## Overview
The **Phishing Attacks Checker** is a full-stack web application designed to evaluate URLs and Email addresses for common phishing and social engineering patterns. 

By utilizing a high-speed, local heuristic engine on the backend and a responsive, user-friendly interface on the frontend, this tool helps users identify typo-squatting, spoofed emails, and malicious links before they click.

---

## Project Architecture
This project is divided into two main directories:
1. `backend/`: The Node.js/Express API that powers the heuristic analysis.
2. `frontend/`: The client-facing application where users can test links and emails.

---

## Backend Documentation

The backend provides a fast, locally-driven API that evaluates inputs against a robust set of heuristic rules without relying purely on rate-limited external APIs.

### Tech Stack
* **Runtime:** Node.js (v22+)
* **Framework:** Express.js
* **Architecture:** ES Modules (`"type": "module"`)
* **Development:** Nodemon

### API Features
* **Typo-squatting Detection:** Catches misspelled domains mimicking popular brands (e.g., `paypa1.com`).
* **Spoofing Detection:** Flags emails using free providers combined with official-sounding prefixes.
* **High-Risk TLDs & IP Checks:** Warns against emails/URLs originating from cheap top-level domains or bare IP addresses.

### Setup & Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```

### API Endpoints

#### 1. Check URL
**POST** `/check/url`  
**Body:**
```json
{
  "url": "http://paypa1.com/login"
}
```
**Response (Malicious):**
```json
{
  "safe": false,
  "message": "Danger: Detected known fake or misspelled domain (typo-squatting)."
}
```

#### 2. Check Email
**POST** `/check/email`  
**Body:**
```json
{
  "email": "john.doe123@gmail.com"
}
```
**Response (Safe):**
```json
{
  "safe": true,
  "message": "Email format and domain heuristics appear standard."
}
```