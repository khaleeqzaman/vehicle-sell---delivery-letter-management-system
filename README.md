# Showroom Management & Vehicle Delivery Letter System

A comprehensive web application for auto showrooms to manage vehicle inventory, generate 2-page print vehicle sell/delivery letters (with Urdu undertaking), manage client ledgers, track payment balances, and export account statements.

---

## 📋 System Requirements

To run this application locally on your computer or local server, you need:

1. **Node.js**: Version 18.x or higher (Download from [nodejs.org](https://nodejs.org/))
2. **npm** (Node Package Manager): Included automatically with Node.js
3. **XAMPP** (Optional): If you want to run Apache as a reverse proxy, host under `http://localhost/showroom`, or manage local DNS domain virtual hosts.

---

## 🚀 Quick Setup & Installation (Localhost)

### Step 1: Download / Extract Code
Extract the project source code files into a local folder, for example:
`C:\xampp\htdocs\showroom-app` or `C:\showroom-app`.

### Step 2: Open Terminal / Command Prompt
Open Command Prompt (cmd) or Terminal and navigate to your project directory:
```bash
cd C:\xampp\htdocs\showroom-app
```

### Step 3: Install Dependencies
Run the following command to install all required npm packages:
```bash
npm install
```

---

## 💻 Running the Application

### Option A: Development Mode (Recommended for Local Use)
Start the development server with live reload:
```bash
npm run dev
```
- Open your browser and go to: **`http://localhost:3000`**

---

### Option B: Production Build (Node.js Server)
To compile and run the production-optimized build:

1. Build the frontend and server bundle:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
- Access the application at: **`http://localhost:3000`**

---

## 🐘 Hosting with XAMPP Apache (Reverse Proxy Integration)

If you want the app accessible via XAMPP's Apache web server (e.g., `http://localhost/showroom` or a custom virtual host like `http://showroom.local`):

### 1. Enable Proxy Modules in XAMPP Apache
1. Open XAMPP Control Panel and click **Config** -> **httpd.conf** for Apache.
2. Ensure the following lines are uncommented (remove `#` if present):
   ```apache
   LoadModule proxy_module modules/mod_proxy.so
   LoadModule proxy_http_module modules/mod_proxy_http.so
   ```

### 2. Configure Virtual Host in XAMPP
Open `C:\xampp\apache\conf\extra\httpd-vhosts.conf` and add:

```apache
<VirtualHost *:80>
    ServerName showroom.local
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

### 3. Update Hosts File (Windows)
Open `C:\Windows\System32\drivers\etc\hosts` in Notepad (as Administrator) and add:
```text
127.0.0.1   showroom.local
```

### 4. Restart Apache & Start Node App
1. Restart Apache from XAMPP Control Panel.
2. Ensure the Node.js application is running (`npm start` or `npm run dev`).
3. Visit **`http://showroom.local`** in your web browser.

---

## 🗄️ Database & Storage Architecture

### 1. Built-in Embedded Persistence (`db_storage.json`)
The application comes pre-configured with a **built-in, persistent JSON document storage engine** (`db_storage.json`) located in the root folder.

- **Zero Configuration Required**: You **do NOT need to create or install MySQL databases** manually to start using the app.
- **Automatic Saving**: Every sell letter created, client added, vehicle inventory update, or showroom configuration change is instantly serialized and saved to `db_storage.json` on your local disk.
- **Data Backups**: To back up your showroom database, simply make a copy of `db_storage.json`.

---

### 2. Optional: Converting to XAMPP MySQL / MariaDB Database
If your organization requires a traditional relational MySQL database in XAMPP (e.g., managed via **phpMyAdmin** at `http://localhost/phpmyadmin`):

#### MySQL Table Schemas:
You can create the tables in phpMyAdmin under a database named `showroom_db`:

```sql
CREATE DATABASE IF NOT EXISTS showroom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE showroom_db;

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    cnic VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(50),
    phone2 VARCHAR(50),
    address TEXT,
    role ENUM('purchaser', 'seller', 'both') DEFAULT 'both',
    total_transactions INT DEFAULT 0,
    total_volume DECIMAL(15,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicle Inventory Table
CREATE TABLE IF NOT EXISTS vehicle_inventory (
    id VARCHAR(100) PRIMARY KEY,
    registration_no VARCHAR(50),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    colour VARCHAR(50),
    chassis_no VARCHAR(100),
    engine_no VARCHAR(100),
    engine_capacity VARCHAR(50),
    cost_price DECIMAL(15,2) DEFAULT 0.00,
    demand_price DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('Available', 'Reserved', 'Sold') DEFAULT 'Available',
    biometric_status ENUM('Available', 'Pending', 'N/A') DEFAULT 'Available',
    original_plates_available BOOLEAN DEFAULT TRUE,
    seller_cnic VARCHAR(50),
    buyer_cnic VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sell & Delivery Letters Table
CREATE TABLE IF NOT EXISTS sell_letters (
    id VARCHAR(100) PRIMARY KEY,
    serial_no VARCHAR(100) UNIQUE NOT NULL,
    cplc_operator_no VARCHAR(100),
    date DATE NOT NULL,
    time VARCHAR(20),
    purchaser_cnic VARCHAR(50),
    seller_cnic VARCHAR(50),
    payment_digits DECIMAL(15,2) DEFAULT 0.00,
    balance DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('completed', 'pending_balance', 'draft') DEFAULT 'pending_balance',
    letter_data_json LONGTEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Connecting Node.js to XAMPP MySQL (optional package `mysql2`):
If you wish to query MySQL directly in `server.ts`:
1. Install mysql2: `npm install mysql2`
2. Configure credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=showroom_db
   ```

---

## ⚙️ Features Included

- **2-Page Print Delivery Letters**: Includes complete vehicle specs, buyer/seller details, payment breakdown, and Urdu undertaking statement with thumb impression boxes.
- **2 Mobile Numbers Support**: Primary & Secondary phone fields for buyers, sellers, and clients.
- **Client Ledger & Statements**: View transaction history, export itemized ledgers to **CSV Excel**, copy summary text, or print official PDF statements.
- **Showroom Customization**: Update logo, address, tagline, contacts, and custom Urdu rules.
- **Vehicle Inventory Tracker**: Manage available/reserved stock with demanded prices.
