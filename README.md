# Truck & Load Hub

**Truck & Load Hub** is a full-stack web application designed for the logistics industry. The platform connects shippers and truckers by providing features such as load posting, bidding, load tracking, eligibility verification for truckers, and benefits management for truckers.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Acknowledgements](#acknowledgements)

## Features

### 1. Load Posting System
- **Shippers** can post loads by providing details like description, weight, and route.
- **Truckers** can view loads posted by shippers and filter them by route and date.
- **Real-Time Bidding:** Truckers can bid on loads using a bidding mechanism; the lowest bid wins.

### 2. Bidding Mechanism
- **Truckers** submit bids on available loads.
- A **lowest-bid selection** mechanism allows shippers to review and select the winning bid.
- **Bid Viewing:** Shippers can view all bids placed on a load before selecting the winning bid.

### 3. Eligibility Criteria for Truckers
- **Trucker Registration:** Truckers must meet eligibility criteria:
  - No accident history.
  - No theft complaints.
  - Truck age must not exceed 5 years.
  - Driver’s license must have been held for more than 5 years.
- Ineligible truckers are prevented from registering or placing bids.

### 4. Load Tracking
- **Real-Time Tracking:** Truckers update the load’s location in real-time using Socket.io.
- **Map Integration:** Shippers can view a live map (via React-Leaflet) showing the current location of their load.
- **Alert System:** Shippers receive alerts for significant events (e.g., delays or deviations).

### 5. Financial Management (Implied)
- A ledger system records transactions for shippers and truckers. *(This can be expanded further if required.)*

### 6. Benefits for Truckers
- **Benefits Overview:** Truckers can view a list of benefits such as:
  - Cheapest insurance options.
  - Discounts on tires, spare parts, service, lodging, food, fuel.
  - On-route claim system for additional benefits.
- **Claim Submission:** Truckers can submit claims for on-route benefits.

## Tech Stack

- **Frontend:** React (with Vite), Next.js (if used), Tailwind CSS, React Router, React-Leaflet, Socket.io-client
- **Backend:** Node.js, Express, MongoDB (via Mongoose), Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Docker/Heroku/AWS (choose your preferred option)

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account (or local MongoDB if preferred)

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
