# 🚀 Quick Start: Access Swagger API Documentation

## ⚡ 3 Steps to View Your API Documentation

### Step 1: Start the Backend Server

Choose one of these options:

**Option A - Using Docker (Recommended)**
```bash
docker-compose up --build
```

**Option B - Local Development**
```bash
cd backend
npm install
npm run migrate
npm run dev
```

### Step 2: Open Swagger UI

Once the server is running, open your browser and go to:

```
🌐 http://localhost:3001/api-docs
```

### Step 3: Explore and Test!

You'll see the **Swagger UI** interface with:

- 📚 **Health** section
  - GET /health - Check server status

- 👥 **Customers** section
  - GET /api/customers - List all customers
  - POST /api/customers - Create a customer
  - GET /api/customers/{id} - Get customer by ID
  - PUT /api/customers/{id} - Update a customer
  - DELETE /api/customers/{id} - Delete a customer

---

## 🧪 Try It Out!

1. **Click on any endpoint** to expand it
2. **Click "Try it out"** button
3. **Fill in the parameters** (if required)
4. **Click "Execute"**
5. **See the response** below!

---

## 📚 Additional Resources

| Resource | URL |
|----------|-----|
| **Swagger UI** | http://localhost:3001/api-docs |
| **OpenAPI JSON** | http://localhost:3001/api-docs.json |
| **Health Check** | http://localhost:3001/health |
| **API Base** | http://localhost:3001/api |
| **Frontend** | http://localhost:3000 |

---

## 📖 Documentation Files

- **README.md** - Full project documentation
- **API_DOCUMENTATION.md** - Comprehensive API reference
- **SWAGGER_UPDATE_SUMMARY.md** - Details about Swagger implementation

---

## ✅ What You Can Do

- ✅ View all API endpoints
- ✅ See request/response schemas
- ✅ Test endpoints directly from browser
- ✅ Copy cURL commands
- ✅ Download OpenAPI spec
- ✅ Import into Postman
- ✅ Generate client code

---

## 🎯 Example: Create a Customer

1. In Swagger UI, go to **POST /api/customers**
2. Click **"Try it out"**
3. Edit the request body:
   ```json
   {
     "first_name": "John",
     "last_name": "Doe",
     "email": "john.doe@example.com",
     "phone_number": "+1234567890",
     "city": "New York"
   }
   ```
4. Click **"Execute"**
5. See the newly created customer in the response!

---

## 🔧 Troubleshooting

**Can't access Swagger UI?**
- ✅ Check if backend is running: `docker-compose ps` or check terminal
- ✅ Verify port 3001 is not in use
- ✅ Try accessing health check first: http://localhost:3001/health

**Need help?**
- 📖 See README.md for full setup instructions
- 📝 See API_DOCUMENTATION.md for detailed API info

---

**That's it! You now have full interactive API documentation! 🎉**

