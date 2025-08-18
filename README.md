# Realtime Chat App (Socket.IO + Redux + Three.js + React)

A minimal real-time chat application.

- **Frontend:** React, Redux Toolkit, Tailwind (MUI-ready)
- **Backend:** Node.js, Express, Socket.IO
- **RPC:** JSON-RPC 2.0 over a single Socket.IO event
- **3D Icon:** Three.js “bubble burst” animation on **send**
- **Cross-browser:** Chrome, Firefox, Edge

[▶️ Demo-Video](https://drive.google.com/file/d/1OFXPGQqIf_Ku8WwyxRXxiBB088h-1fyd/view?usp=sharing)

---

## Demo (Local Quickstart)

Open two terminals:

**Terminal A — Backend**
```bash
cd web-api
npm i
npm run dev    
# Server starts on http://localhost:3001
```

**Terminal B — Frontend**
```bash
cd web-ui
npm i

echo 'VITE_SERVER_URL=http://localhost:3001' > .env
npm run dev     
# opens http://localhost:5173
```

Open **two browser tabs** at `http://localhost:5173`, type messages in one tab, and watch them appear in both. 🎈

---

## Requirements

- **Node.js 18+**
- **npm** 

Tested on Chrome, Firefox, and Edge (latest).

--- 

## 3D Icon (Three.js)

- A lightweight Three.js scene renders a **bubble-burst** style animation on **send**.
- The animation is triggered from the message send action (Redux dispatch → UI side-effect).
- You can tweak the effect in `web-ui/src/components/BubbleBurst.tsx` (particle count, lifespan, easing).

---

## Dev Tips

- Open **two separate browsers** (e.g., Chrome + Firefox) to verify cross-browser behavior.
- Use Redux DevTools to inspect the `messages` slice and incoming socket actions.
- Log the raw JSON-RPC payloads on the server while developing to confirm routing.

---

### Personal-Workflow 

* Step 1: Setup React UI
* Step 2: Redux Store - messages setup (local working of msg send etc)
* Step 3: Threejs bubbles animation
* Step 4: Integrate bubbles animation on click send
* Step 5: Setup backend
* Step 6: Integrate backend with frontend
