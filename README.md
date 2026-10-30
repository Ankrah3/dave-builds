# dave-builds (React + react-three-fiber)

An animated 3D portfolio site. The background scene (wireframe core, torus knot, rings and particles)
reacts to mouse movement and scroll. Project cards tilt in 3D on hover.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build and deploy

```bash
npm run build   # outputs to dist/
```

- **Vercel / Netlify:** import the GitHub repo. Build command `npm run build`, output directory `dist`.
- **GitHub Pages:** set `base: '/<repo-name>/'` in `vite.config.js`, then deploy the `dist` folder.

## Customise

- Projects, skills and links: `src/projects.js`
- Page layout and sections: `src/App.jsx`
- 3D scene: `src/Scene.jsx`
- Colours and styling: `src/styles.css` (the 3D colours follow the `--accent` and `--accent2` variables)

## Stack

React 18, Vite, three.js, @react-three/fiber
