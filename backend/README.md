# Backend README

Setup:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run dev server:

```powershell
npm run dev
```

API:
- POST /auth/identify { email } -> { token, user }

