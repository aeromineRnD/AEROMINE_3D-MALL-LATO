# AEROMINE 3D — Lato Mining Site Viewer

An interactive 3D facility map for the **Lato open pit mining site**, built with [Three.js](https://threejs.org/) and Vite. Click on any building to fly the camera in and view facility details.

---

## Features

- **Photogrammetry-based 3D model** — real-world scan of the Lato mining site
- **Interactive building tags** — floating labels anchored above each facility
- **Smooth camera animation** — click a tag to fly the camera to the selected building
- **Info panel** — slide-in panel with building name, category, description, hours, and contact
- **Orbit controls** — pan, rotate, and zoom freely after any animation

---

## Facilities

| Building | Type | Description |
|---|---|---|
| **Apothiki 1** | Tool Storage | Hand tools, drills, PPE and safety gear |
| **Apothiki 2** | Maintenance Equipment | Heavy machinery parts, welding units, servicing supplies |
| **Apothiki 3** | Materials & Consumables | Lubricants, hydraulic fluids, blasting accessories |
| **Kaminada** | Processing Stack | Exhaust/ventilation stack, ore processing emissions management |

---

## Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — build tooling and dev server
- CSS2DRenderer — HTML tag overlays in 3D space
- OrbitControls — camera interaction
- GLTFLoader — photogrammetry model loading

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The model files (`lato.gltf` + `lato.bin`) must be present in `public/models/`.

---

## Project Structure

```
├── public/
│   └── models/
│       ├── lato.gltf       # 3D scene graph
│       ├── lato.bin        # Binary geometry data
│       └── images/         # Texture maps
├── src/
│   ├── main.js             # App entry point
│   ├── viewer.js           # Three.js scene, renderer, camera, controls
│   ├── tag-manager.js      # Building tag creation and placement
│   ├── popup.js            # Info panel
│   └── site-data.js        # Facility configuration
├── index.html
└── style.css
```

---

## About

Developed by **[Aeromine RnD](https://www.aeromine.info/)**

- Website: [www.aeromine.info](https://www.aeromine.info/)
- LinkedIn: [linkedin.com/company/aeromine-info](https://www.linkedin.com/company/aeromine-info)
