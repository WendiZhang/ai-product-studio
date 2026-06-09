# AI-Product-Studio
An AI-powered full-stack web application that generates product descriptions using AI and manages them in a product dashboard. Built with React, Flask, and JWT authentication.

Features
- User authentication (Register/Login with JWT)
- AI-powered product description generator
- Save generated content to product database
- Full CRUD operations for products
- Generation history dashboard
- Inline product editing (SaaS-style UI)
- Delete single or all history
- Search history by product name
- Responsive modern UI (Tailwind CSS)
- Protected API routes using JWT

Tech Stack
- Frontend
- React (Hooks, Router)
- Tailwind CSS
- Fetch / Axios
Backend
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- SQLite
- Flask-CORS

Project Structure
```
frontend/
  src/
    pages/
      Dashboard.jsx
      Products.jsx
      Generate.jsx
      Login.jsx
      Register.jsx
    components/
      Navbar.jsx

backend/
  routes.py
  models.py
  app.py
  ai.py
```

How to Run
Backend:
```
cd backend
pip install -r requirements.txt
source venv/bin/activate
python app.py
```

Frontend:
```
cd frontend
npm install
npm run dev
```



