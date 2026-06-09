# MongoDB Connection Diagnostics & Fix Guide

## 📊 Current Status

The application has **enhanced MongoDB connection diagnostics**. When it fails to connect, it now provides detailed error messages and solutions.

## 🔍 Current Errors Detected

### Error 1: MongoDB Atlas Connection Failed
```
Error Code: ECONNREFUSED
Error Message: querySrv ECONNREFUSED _mongodb._tcp.cluster0.a9ltzxv.mongodb.net
```

**Root Cause Options:**
1. **Atlas Cluster is Paused** - Most Common
2. Network connectivity issue
3. IP address not whitelisted in MongoDB Atlas
4. Invalid cluster DNS name

### Error 2: Local MongoDB Fallback Failed
```
Error Code: ECONNREFUSED
Error Message: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Root Cause:**
- MongoDB is not running locally
- MongoDB service is stopped

---

## ✅ SOLUTION 1: Start Local MongoDB (Easiest)

### Step 1: Install MongoDB Community Edition
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

### Step 2: Start MongoDB Server
```bash
# Windows (from MongoDB bin folder)
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 3: Verify MongoDB is Running
```bash
mongosh
# or older versions:
mongo
```

You should see a connection message. If successful, exit with `exit`.

### Step 4: Start Your Application
```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Contacts API listening on port 3000
```

---

## ✅ SOLUTION 2: Fix MongoDB Atlas Connection

### Step 1: Verify MongoDB Atlas Cluster is Running

1. Go to **https://cloud.mongodb.com**
2. Login to your account
3. Navigate to **Clusters** section
4. Look for cluster named **"cluster0"**
5. **Check if cluster is PAUSED** (green RESUME button = cluster is paused)
   - If paused: Click **RESUME** to start it
6. **Wait 2-3 minutes** for cluster to fully start

### Step 2: Verify Network Access

1. In MongoDB Atlas, go to **Network Access** (left sidebar)
2. Check if your IP address is whitelisted
3. **Option A:** Add your IP:
   - Click **+ Add IP Address**
   - Click **Add Current IP Address**
   - Or click **Add Access From Anywhere** (0.0.0.0/0) for development
4. Click **Confirm**

### Step 3: Verify Connection String Credentials

1. In MongoDB Atlas, go to **Databases** (left sidebar)
2. Click **Connect** next to your cluster
3. Select **Connect your application**
4. Choose **Node.js** driver
5. Copy the connection string
6. The format should be:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```

7. Update `.env` file with the correct credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=yourStrongSecretKeyHere
   PORT=3000
   ```

### Step 4: Handle Special Characters in Password

If your MongoDB password contains special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`

**Example:**
```
Password: Pass@word#123
Encoded: Pass%40word%23123
```

Update in `.env`:
```env
MONGODB_URI=mongodb+srv://username:Pass%40word%23123@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```

### Step 5: Start Your Application
```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Contacts API listening on port 3000
```

---

## 🔧 Enhanced Diagnostics in server.js

The following improvements have been added to `server.js`:

### 1. **Configuration Logging**
```
=== MongoDB Configuration ===
MONGODB_URI from .env: ✓ Loaded
MONGODB_DB from .env: ✓ Set to: contactsDB
Using MongoDB URI: [ATLAS] mongodb+srv://...
```

### 2. **Connection Attempt Logging**
```
Starting Contacts API server...
Attempting MongoDB connection...
URI: mongodb+srv://...
```

### 3. **Detailed Error Diagnostics**
- **Error Code** (ECONNREFUSED, ENOTFOUND, etc.)
- **Error Type** (Atlas vs Local)
- **Possible Causes** (formatted list)
- **Solutions** (formatted list with specific steps)

### 4. **Automatic Fallback to Local**
If Atlas fails, automatically tries local MongoDB at `mongodb://localhost:27017`

### 5. **Clear Next Steps**
If both connections fail, displays:
```
=== NEXT STEPS ===
1. Start MongoDB locally: mongod
2. OR configure Atlas in .env
3. Then restart the server: npm run dev
```

---

## 📋 Troubleshooting Checklist

- [ ] **Atlas Only:**
  - [ ] MongoDB Atlas cluster is RUNNING (not paused)
  - [ ] Your IP is in Network Access whitelist
  - [ ] Connection string credentials are correct
  - [ ] Password special characters are URL-encoded
  - [ ] Connection string has `?retryWrites=true&w=majority`

- [ ] **Local MongoDB Only:**
  - [ ] MongoDB is installed
  - [ ] `mongod` process is running
  - [ ] MongoDB is listening on port 27017
  - [ ] Can connect with: `mongosh` or `mongo`

- [ ] **Both Options:**
  - [ ] `.env` file exists in project root
  - [ ] `MONGODB_URI` is set in `.env`
  - [ ] No spaces around `=` in `.env`
  - [ ] Server is restarted after `.env` changes
  - [ ] Node.js can read `.env` (verified by `MONGODB_URI from .env: ✓ Loaded`)

---

## 🧪 Testing Connection Without Starting Server

### Test Atlas Connection
```bash
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('✓ Atlas connection successful');
  process.exit(0);
}).catch(err => {
  console.error('✗ Atlas connection failed:', err.message);
  process.exit(1);
});
"
```

### Test Local Connection
```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/contactsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('✓ Local connection successful');
  process.exit(0);
}).catch(err => {
  console.error('✗ Local connection failed:', err.message);
  process.exit(1);
});
"
```

---

## 📝 Configuration Reference

### .env File Structure
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority

# Or Local MongoDB Database Name
MONGODB_DB=contactsDB

# Port for API Server
PORT=3000

# Base URL for Swagger
BASE_URL=http://localhost:3000

# JWT Secret for Authentication
JWT_SECRET=yourStrongSecretKeyHere
```

### Connection Priority
1. If `MONGODB_URI` is set → Use Atlas
2. If only `MONGODB_DB` is set → Use `mongodb://localhost:27017/${MONGODB_DB}`
3. If neither is set → Use `mongodb://localhost:27017/contactsDB`

### Mongoose Connection Options
```javascript
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000
}
```

---

## 🔗 Useful Links

- **MongoDB Atlas**: https://cloud.mongodb.com
- **MongoDB Community Download**: https://www.mongodb.com/try/download/community
- **MongoDB Connection String Format**: https://docs.mongodb.com/manual/reference/connection-string/
- **Mongoose Connection**: https://mongoosejs.com/docs/connections.html
- **URL Encoding Reference**: https://www.w3schools.com/tags/ref_urlencode.asp

---

## 📞 Common Issues & Solutions

### Issue: "querySrv ECONNREFUSED"
**Cause:** Cannot resolve MongoDB Atlas DNS name
**Solution:** 
- Verify cluster exists in Atlas dashboard
- Check internet connection
- Try: `nslookup _mongodb._tcp.cluster0.a9ltzxv.mongodb.net`

### Issue: "connect ECONNREFUSED 127.0.0.1:27017"
**Cause:** Local MongoDB not running
**Solution:** Start MongoDB with `mongod`

### Issue: "Authentication failed"
**Cause:** Wrong username/password
**Solution:** Verify credentials in MongoDB Atlas Users section

### Issue: "IP not whitelisted"
**Cause:** Your IP is not in Network Access
**Solution:** Add your IP to Network Access in Atlas

### Issue: "Command 'mongod' not found"
**Cause:** MongoDB not installed
**Solution:** Install MongoDB Community Edition from mongodb.com

---

## ✨ Next Steps After Connection is Fixed

Once MongoDB is connected and `npm run dev` shows:
```
✓ MongoDB connected successfully
✓ Contacts API listening on port 3000
```

You can test the API:

1. **Register a user:**
   ```
   POST http://localhost:3000/auth/register
   Body: {"username":"testuser","email":"test@example.com","password":"testpass123"}
   ```

2. **Login:**
   ```
   POST http://localhost:3000/auth/login
   Body: {"email":"test@example.com","password":"testpass123"}
   Response: {"token":"eyJ..."}
   ```

3. **Create a company (with token):**
   ```
   POST http://localhost:3000/companies
   Headers: Authorization: Bearer <token>
   Body: {"name":"Acme Corp","website":"https://acme.com","...": "..."}
   ```

---

## 📋 Modified Files

- **server.js**
  - Added MongoDB configuration logging
  - Enhanced `connectToMongo()` with timeout options
  - Added `parseMongoError()` function with detailed diagnostics
  - Improved error messages with specific solutions
  - Added connection success indicators

**No other files were modified** - All authentication, routes, controllers, and Swagger configurations remain unchanged.

---

**Last Updated:** 2026-06-08
**Status:** ✅ Diagnostics Complete - Awaiting MongoDB Connection

