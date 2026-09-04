# 🚀 ShopEasy — Full-Stack E-Commerce Mobile Application

**ShopEasy** is a modern, production-style Full-Stack E-Commerce Mobile Application built using **React Native (Expo)** on the frontend and **Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, and Cloudinary** on the backend.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Technology Stack](#-technology-stack)
3. [Project Directory Structure](#-project-directory-structure)
4. [Environment Setup](#-environment-setup)
5. [Backend Installation & Running](#-backend-installation--running)
6. [Database Seeder & Demo Credentials](#-database-seeder--demo-credentials)
7. [Mobile App Installation & Running](#-mobile-app-installation--running)
8. [REST API Documentation](#-rest-api-documentation)
9. [Postman Testing Guide](#-postman-testing-guide)
10. [Android Testing Guide](#-android-testing-guide)
11. [Security & Business Rules](#-security--business-rules)

---

## 🌟 Features

### 📱 Mobile Application (React Native / Expo)
* **Authentication**: Splash screen, User Registration with validation, User Login, Persistent JWT session using AsyncStorage, and Logout.
* **Home Screen**: Search bar, notification & cart icons with dynamic badge count, promotional banner, categories carousel, featured products, trending items, new arrivals, and best sellers.
* **Categories & Catalog**: Category browsing with high-resolution image cards, product filtering by category, brand, rating, and price.
* **Product Search & Filters**: Real-time keyword search, sorting (Newest, Price: Low to High, Price: High to Low, Top Rated), and multi-criteria filter chips.
* **Product Details**: Image gallery preview, brand, price & discount badges, rating breakdown, stock status indicator, quantity selector, add to cart, and instant "Buy Now".
* **Shopping Cart**: Real-time quantity steppers, item removal, clear cart, server-calculated totals, discount calculations, and delivery charges.
* **Wishlist**: Saved items list, duplicate prevention, and one-tap "Move to Cart".
* **Checkout & Payment**: Multi-step checkout with address selection, order cost review, and **Cash on Delivery (COD)** payment processing.
* **Orders Management**: Order history, order status badge chips (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), visual order timeline tracker, and order cancellation with automatic stock restoration.
* **User Profile & Addresses**: Profile details management, change password, delivery address book (Add, Edit, Delete, Set Default), and app settings.

### 🖥️ Backend REST API (Node.js & Express)
* **Secure Auth**: bcrypt password hashing, JSON Web Token (JWT) generation, and role-based access control (`user` vs `admin`).
* **Server-Side Validation**: Never trusts client-side prices or stock counts. All totals, discounts, and inventory availability are verified server-side.
* **Cloudinary Image Upload**: Multer multipart upload with streaming to Cloudinary, saving secure image URLs in MongoDB.
* **Admin APIs**: Admin dashboard metrics (Total Users, Products, Orders, Revenue), order status updates, and product management.
* **Centralized Error Handling**: Standardized JSON responses for validation errors, bad ObjectIds, and expired tokens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Mobile Client** | React Native, Expo (~v51), JavaScript (ES6+), React Navigation (Tabs & Stack), Context API, AsyncStorage, React Native StyleSheet, Expo Vector Icons |
| **Backend API** | Node.js, Express.js, REST APIs, JavaScript |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Media Storage** | Cloudinary, Multer |
| **Dev Tools** | Git, Postman, VS Code, Android Studio / Expo Go |

---

## 📂 Project Directory Structure

```text
ShopEasy/
│
├── mobile/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.js
│   │   │   ├── CategoryCard.js
│   │   │   ├── SearchBar.js
│   │   │   ├── CartItem.js
│   │   │   ├── WishlistItem.js
│   │   │   ├── ProductImage.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── EmptyState.js
│   │   │   └── CustomButton.js
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   └── RegisterScreen.js
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.js
│   │   │   │   └── CategoriesScreen.js
│   │   │   ├── products/
│   │   │   │   ├── ProductListScreen.js
│   │   │   │   ├── ProductDetailsScreen.js
│   │   │   │   └── SearchScreen.js
│   │   │   ├── cart/
│   │   │   │   ├── CartScreen.js
│   │   │   │   └── CheckoutScreen.js
│   │   │   ├── wishlist/
│   │   │   │   └── WishlistScreen.js
│   │   │   ├── orders/
│   │   │   │   ├── OrdersScreen.js
│   │   │   │   ├── OrderDetailsScreen.js
│   │   │   │   └── OrderSuccessScreen.js
│   │   │   └── profile/
│   │   │       ├── ProfileScreen.js
│   │   │       ├── EditProfileScreen.js
│   │   │       ├── AddressScreen.js
│   │   │       └── SettingsScreen.js
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   ├── MainNavigator.js
│   │   │   └── TabNavigator.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── CartContext.js
│   │   │   └── WishlistContext.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── wishlistService.js
│   │   │   └── orderService.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useWishlist.js
│   │   ├── constants/
│   │   │   ├── colors.js
│   │   │   ├── sizes.js
│   │   │   └── config.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── priceCalculator.js
│   │   │   └── storage.js
│   │   └── styles/
│   │       ├── commonStyles.js
│   │       └── screenStyles.js
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── apiResponse.js
│   ├── uploads/
│   ├── postman_collection.json
│   ├── seeder.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Setup

### 1. MongoDB Setup
You can use either a **Local MongoDB instance** or **MongoDB Atlas Cloud**:

* **Option A: MongoDB Atlas (Recommended)**
  1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  2. Create a free M0 cluster.
  3. Under **Database Access**, create a user (e.g. `shopeasy_user` / `password123`).
  4. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere).
  5. Copy your connection URI into `backend/.env`:
     ```env
     MONGO_URI=mongodb+srv://shopeasy_user:password123@cluster0.abcde.mongodb.net/shopeasy?retryWrites=true&w=majority
     ```

* **Option B: Local MongoDB**
  Ensure MongoDB service is running locally on port 27017:
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/shopeasy
  ```

### 2. Cloudinary Setup
1. Create a free account at [Cloudinary.com](https://cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the Cloudinary Console Dashboard.
3. Add them to `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   *(Note: If Cloudinary credentials are left empty during initial testing, the backend will safely fallback to high-resolution product images without crashing).*

---

## 🖥️ Backend Installation & Running

1. Open terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed sample categories, products, admin, and user accounts:
   ```bash
   npm run seed
   ```
4. Start the backend REST API server:
   ```bash
   npm start
   # or with auto-reload:
   npm run dev
   ```
   The API will be running at `http://localhost:5000` (or `http://10.0.2.2:5000` for Android Emulator).

---

## 👤 Database Seeder & Demo Credentials

When `npm run seed` is executed, the following pre-configured demo accounts are created:

| Role | Email | Password | Pre-populated Data |
|---|---|---|---|
| **Demo Customer** | `alex@shopeasy.com` | `UserPassword123!` | Sample Cart, Saved Wishlist, 2 Saved Addresses, Order History |
| **Admin User** | `admin@shopeasy.com` | `AdminPassword123!` | Full Admin privileges (dashboard stats, product/category management) |

*(Quick Fill buttons are also available right on the mobile app's Login Screen for convenient 1-tap testing).*

---

## 📱 Mobile App Installation & Running

1. Open terminal and navigate to `mobile`:
   ```bash
   cd mobile
   ```
2. Install mobile dependencies:
   ```bash
   npm install
   ```
3. Configure `mobile/src/constants/config.js` or `mobile/.env`:
   * **Android Emulator**: Uses `http://10.0.2.2:5000/api` (default automatically detected on Android).
   * **iOS Simulator / Web**: Uses `http://localhost:5000/api`.
   * **Physical Device via Expo Go**: Set your PC's Wi-Fi / LAN IP, e.g. `http://192.168.1.15:5000/api`.
4. Start the Expo development server:
   ```bash
   npm start
   ```
5. Press `a` in terminal to launch on Android Emulator, or scan the QR code with the **Expo Go** app on your physical Android/iOS phone.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `phone`, `password`) |
| `POST` | `/api/auth/login` | Public | Sign in user & receive JWT token |
| `GET` | `/api/auth/profile` | Private | Get authenticated user's profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile (`name`, `phone`, `profileImage`, `password`) |

### 2. Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products (with search `q`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `POST` | `/api/products` | Admin | Create product with Multer image upload to Cloudinary |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |

### 3. Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all product categories |
| `POST` | `/api/categories` | Admin | Create category (`name`, `image`, `description`) |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Admin | Delete category |

### 4. Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Private | Get user's cart with server-validated totals & stock |
| `POST` | `/api/cart` | Private | Add product to cart (`productId`, `quantity`) |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity in cart |
| `DELETE` | `/api/cart/:productId` | Private | Remove item from cart |
| `DELETE` | `/api/cart` | Private | Clear all items from cart |

### 5. Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/wishlist` | Private | Get user's wishlist products |
| `POST` | `/api/wishlist/:productId` | Private | Add or toggle product in wishlist |
| `DELETE` | `/api/wishlist/:productId` | Private | Remove product from wishlist |

### 6. Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Private | Place order from cart (`shippingAddress`, `paymentMethod: COD`) |
| `GET` | `/api/orders` | Private | Get logged-in user's orders |
| `GET` | `/api/orders/:id` | Private | Get order details |
| `PUT` | `/api/orders/:id/cancel`| Private | Cancel pending/confirmed order & restore stock |
| `GET` | `/api/orders/admin/stats` | Admin | Get dashboard statistics (users, products, orders, revenue) |
| `GET` | `/api/orders/admin/all` | Admin | List all orders in system |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |

### 7. User Addresses (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/address` | Private | List saved shipping addresses |
| `POST` | `/api/users/address` | Private | Add new address (`fullName`, `phone`, `houseFlat`, `street`, `city`, `state`, `pinCode`, `country`, `isDefault`) |
| `PUT` | `/api/users/address/:id` | Private | Update saved address |
| `DELETE` | `/api/users/address/:id` | Private | Delete saved address |

---

## 🧪 Postman Testing Guide

An importable Postman collection is included in the project:
`backend/postman_collection.json`

### Steps to Test in Postman:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select or drag-and-drop `backend/postman_collection.json`.
4. The collection contains all routes organized by folder (`Health Check`, `Auth`, `Products`, `Categories`, `Cart`, `Wishlist`, `Orders`, `Addresses`, `Admin`).
5. **Testing Flow**:
   - Send `Health Check` -> Returns 200 OK.
   - Send `Login User` (`alex@shopeasy.com` / `UserPassword123!`).
   - Copy the returned `data.token` and paste it into the Collection Variable `authToken`.
   - Send `Get Cart` or `Get All Products`.
   - Place an order with `Create Order (Checkout)`.
   - Check `Get My Orders`.

---

## 📱 Android Testing Guide

### Option 1: Testing on Android Emulator
1. Start Android Studio and launch any Android Virtual Device (AVD).
2. Start the backend:
   ```bash
   cd backend && npm start
   ```
3. Start the mobile app:
   ```bash
   cd mobile && npm run android
   ```
4. Expo CLI will detect the emulator and install/open the ShopEasy development client automatically.

### Option 2: Testing on Physical Android Phone with Expo Go
1. Install **Expo Go** from Google Play Store.
2. Connect your phone and your computer to the **same Wi-Fi network**.
3. In `mobile/src/constants/config.js`, set `apiBaseUrl` to your computer's local IP address (e.g. `http://192.168.1.15:5000/api`).
4. Run in `mobile`:
   ```bash
   npm start
   ```
5. Scan the QR code shown in your terminal using the Expo Go camera.

---

## 🔒 Security & Business Rules

1. **Server-Side Stock Validation**: Mobile client quantity changes and checkout requests are strictly validated against real database inventory. Out-of-stock items cannot be ordered.
2. **Server-Side Price Calculation**: Totals, subtotal, delivery charges, and discount amounts are calculated by backend controllers. The backend never accepts client-provided prices.
3. **Password Security**: Passwords are automatically hashed with bcrypt using 10 salt rounds before being written to MongoDB.
4. **JWT Protection**: Protected endpoints require standard `Bearer <token>` in the `Authorization` header.
5. **Admin Safeguards**: Non-admin users are strictly blocked with `403 Forbidden` from administrative endpoints.
6. **Secrets Isolation**: Cloudinary secrets, MongoDB credentials, and JWT signing keys are stored exclusively in `backend/.env` and are never exposed to the client application.

---

## 📄 License
This project is licensed under the MIT License. Built with ❤️ for ShopEasy.
