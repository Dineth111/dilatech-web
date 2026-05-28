# diLA Tech — MERN Stack

## Tech Stack
- Frontend: React + Vite → Vercel
- Backend: Express + Node.js → Render
- Database: MongoDB Atlas

## Local Setup
1. `cd dilatech-mern/backend && npm install`
2. `cd ../frontend && npm install`
3. Copy `dilatech-mern/backend/.env.example` to `.env` and fill in the values.
4. Run the backend with `npm run dev` inside `dilatech-mern/backend`.
5. Run the frontend with `npm run dev` inside `dilatech-mern/frontend`.

## Deploy
1. Push the repo to GitHub.
2. Create a free MongoDB Atlas cluster and copy the `MONGO_URI` into Render.
3. On Render, create a Web Service from `dilatech-mern/backend`.
4. On Vercel, import `dilatech-mern/frontend`.
5. Set `VITE_API_URL=https://your-render-url.onrender.com/api` in Vercel.

## Admin Access
- Visit `/admin/login` on the Vercel frontend.
- Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values configured on Render.

## Upload Team Photos
- `POST https://your-render-url.onrender.com/api/team/photo/dilshan`
- Use form-data field `photo` with an image file.
- Supported IDs: `dilshan`, `sachin`, `dineth`.
