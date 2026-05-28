# CertChain Frontend

React + Vite frontend for the CertChain blockchain certificate MVP.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

## Setup

```bash
cd frontend
npm install
```

Create or update `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the app:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Backend Compatibility

The service layer targets:

- `POST /api/certificates/issue`
- `POST /api/certificates/verify`
- `POST /api/certificates/revoke`

It also includes fallbacks for the current backend routes in this repo:

- `GET /api/certificates/verify/:certificateId`
- `POST /api/certificates/revoke/:certificateId`

For issue requests, the frontend sends both `studentName/courseName/institutionName` and the current backend fields `recipientName/course`.

## Pages

- `/` landing page
- `/issue` certificate issuance
- `/verify` certificate verification
- `/revoke` certificate revocation

## Build

```bash
npm run build
```
