# 🧳 Travel Buddy – Frontend

A modern social-travel web platform that helps travelers find compatible travel buddies, share travel plans, and connect with like-minded explorers. This frontend application delivers a smooth, secure, and engaging user experience for discovering and planning shared journeys.

---

## 🌍 Project Overview

**Travel Buddy & Meetup** is a subscription-based travel networking platform where users can:
- Create detailed travel profiles
- Share upcoming travel plans
- Discover and match with travelers heading to similar destinations
- Leave reviews after completed trips
- Access premium features through secure payment integration

This repository contains the **frontend** of the application, built with modern web technologies and best UI/UX practices.

---

## 🔗 Live Links
- **Frontend:** [tripbuddy-frontend.vercel.app](https://tripbuddy-frontend.vercel.app/)



---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript / TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **State Management:** Context API 
- **Forms:** React Hook Form /Custom Form
- **Authentication:** JWT (via backend)
- **Payments:** Stripe
- **Image Upload:** Cloudinary / ImgBB
- **UI Enhancements:**  SweetAlert2
- **Deployment:** Vercel 

---

## ✨ Core Features

### 🔐 Authentication & Roles
- Email & password login / registration
- Role-based access (User & Admin)
- Secure session handling using JWT

### 👤 User Profile Management
- Create & edit travel profiles
- Upload profile image
- Add bio, interests, visited countries, and location
- Public profile viewing

### ✈️ Travel Plan Management
- Create, edit, and delete travel plans
- Add destination, date range, budget, and travel type
- View plan details and host profile

### 🔍 Search & Matching
- Search travelers by destination, date, and travel type
- Explore matched travel buddies dynamically

### ⭐ Reviews & Ratings
- Leave reviews after trip completion
- Edit or delete own reviews
- View average ratings on profiles
- After Travel got pasted joined travel will get review notification automatically and can review by going to plan details page . 

### 💳 Subscription & Payments
- weekly /Monthly / yearly subscription plans
- Verified badge for premium users
- Secure payment flow via integrated gateway

### 🧑‍💼 Admin Dashboard
- Manage users
- Manage travel plans
- Platform overview and controls

---

## 📄 Pages & Routes

| Route | Description |
|------|------------|
| `/` | Home / Landing page |
| `/login` | User login |
| `/register` | User registration |
| `/explore` | Search & match travelers |
| `/profile/[id]` | Public user profile |
| `/dashboard/profile` | User 
| `/adminDashboard/adminProfile` | Admin
| `/travel-plans` | User travel plans |
| `/travel-plans/add` | Add new travel plan |
| `/travel-plans/[id]` | Travel plan details |





