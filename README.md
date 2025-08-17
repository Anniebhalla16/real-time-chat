# Realtime Chat App (Socket.IO + Redux + Three.js + React )

A minimal real‑time chat application:

* **Frontend:** React, Redux Toolkit, MUI/Tailwind-ready styling
* **Backend:** Node.js, Express, Socket.IO
* **RPC:** JSON‑RPC 2.0 over a single Socket.IO event
* **3D Icon:** Lightweight Three.js “bubble burst” animation on **send**
* **Cross‑browser:** Chrome, Firefox, Edge 

---

## Prerequisites

* **Node.js 18+** 
* **npm** or **yarn**

---

## Frontend — Setup & Run

From `web-ui/`:

```bash
# install
npm i

# env (Vite)
# The backend URL you want the client to connect to
# e.g., http://localhost:3001
VITE_SERVER_URL=http://localhost:3001

# run dev
npm run dev            # Vite (default http://localhost:5173)

# build
npm run build
```
