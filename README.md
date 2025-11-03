# AccessIQ - ABAC System

A complete **Attribute-Based Access Control (ABAC)** web application with admin-controlled permissions and self-registration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create MySQL database and run setup script
mysql -u root -p < setup_database.sql
```

### 3. Configure Database
Edit `config/db.js` with your MySQL credentials:
```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'accessiq_pro'
};
```

### 4. Start Application
```bash
npm start
# or for development
npm run dev
```

### 5. Access Application
- **URL:** http://localhost:4000
- **Admin:** `admin_user` / `Admin@123`
- **Professor:** `prof_smith` / `Prof@123`
- **Student:** `mary_student` / `Stud@123`

## 🧩 System Features

### ✅ Self-Registration
- Users register as Professor or Student
- Stored with `access_granted = false`
- Cannot login until admin approval

### 🔐 Admin Control
- Admin approves/rejects users
- Assigns resource permissions
- Sets sensitivity access levels
- Views access logs

### 📊 ABAC Policy Engine
- **Admin:** Full access to everything
- **Professor:** Time-based access (9-17 hrs) + sensitivity level
- **Student:** Department match + sensitivity level

### 🎯 Access Evaluation
- Real-time policy evaluation
- Detailed decision explanations
- Complete audit logging

## 📁 Project Structure

```
AccessIQ_Pro/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── setup_database.sql     # Database setup
├── config/
│   └── db.js             # MySQL connection
├── routes/
│   ├── auth.js           # Login/logout
│   ├── register.js       # Registration
│   ├── admin.js          # Admin dashboard
│   ├── access.js         # ABAC evaluation
│   └── resources.js      # User dashboard
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── admin_dashboard.ejs
│   ├── admin_user.ejs
│   └── access.ejs
└── public/css/
    └── style.css         # Modern UI styles
```

## 🗄️ Database Schema

- **users:** User accounts with roles and approval status
- **permissions:** Admin-assigned resource access levels
- **resources:** Available resources with sensitivity levels
- **access_logs:** Complete audit trail of all access attempts

## 🎨 UI Features

- Modern blue-white theme
- Responsive design
- Tabbed admin interface
- Real-time access evaluation
- Comprehensive logging dashboard

## 🔧 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MySQL
- **Frontend:** EJS + CSS3
- **Session:** Express-session
- **Styling:** Custom CSS with Poppins font