# Mugi Tattoo Web

React + Tailwind CSS frontend for Mugi Tattoo Studio.

## Design
- Blackcurrant and white theme
- Bold premium look, clean grid, smooth transitions
- Responsive layout, reusable components

## Pages
- Home (hero, latest work, Instagram embeds)
- Gallery (grid with image zoom modal)
- Booking (form with alternative time selection)
- Contact
- Admin Login
- Admin Dashboard (manage bookings)

## Setup
```bash
cd client
npm install
# copy env
cp .env.example .env
# edit .env if needed
npm run dev
```

## Config
- API base: `VITE_API_BASE` (default http://localhost:3000)

## Notes
- Booking alternative time is appended in `notes` to align backend model.
- Instagram embeds require public posts; update links in Home page.
