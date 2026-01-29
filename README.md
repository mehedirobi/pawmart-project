# Project Name: PawMart – Pet Adoption & Supply Portal  

**Live Site:**   
https://assignment-10-pawmart.netlify.app/

---

## 🌐 Project Overview
**PawMart** is a community-driven platform where pet owners, breeders, and shops can list pets for adoption or sell pet-related products (food, toys, accessories, and care products).  
Users can explore listings, adopt pets, or order supplies directly through the platform.

---

## ⚙️ Key Features
- Browse and filter listings by category: Pets, Food, Accessories, and Care Products.  
- Firebase Authentication (Email/Password + Google Login).  
- Add, Update, and Delete user’s own listings.  
- Order/Adopt pets via dynamic modal with order form.  
- My Listings and My Orders dashboard for logged-in users.  
- Generate PDF report of orders using jsPDF & jsPDF-AutoTable.  
- Light/Dark mode toggle.  
- Fully responsive SPA built with React Router DOM.  
- ⚡ Toast notifications for all CRUD operations using react-hot-toast / SweetAlert2.

---

## 🔐 Authentication
- Firebase Authentication used (Email & Password, Google Login).  
- Password must include:
  - At least **1 uppercase letter**
  - At least **1 lowercase letter**
  - Minimum **6 characters**
- No lorem text used; meaningful UI messages shown via toasts.  

---

## 🧠 Tech Stack
### 🖥️ Frontend:
- React.js (Vite)
- React Router DOM
- Firebase Auth
- Tailwind CSS + DaisyUI
- React Hot Toast / SweetAlert2
- Framer Motion (for animations)

### ⚙️ Backend:
- Node.js + Express.js
- MongoDB + Mongoose
- dotenv for environment management
- CORS & JWT
