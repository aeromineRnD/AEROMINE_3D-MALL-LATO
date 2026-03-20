import { Viewer }     from './viewer.js';
import { TagManager } from './tag-manager.js';
import { Popup }      from './popup.js';

async function init() {
  const appEl     = document.getElementById('app');
  const spinnerEl = document.getElementById('spinner');

  // Fetch today's tonnage data — fails gracefully if file is missing
  let dailyData = {};
  try {
    const res = await fetch('/daily-data.json');
    if (res.ok) dailyData = await res.json();
  } catch (_) { /* no daily data — app still works */ }

  const viewer     = new Viewer(appEl);
  const popup      = new Popup(dailyData);
  const tagManager = new TagManager(viewer, popup);

  spinnerEl.style.display = '';

  try {
    await viewer.load();
    tagManager.buildTags();
  } catch (err) {
    console.error('[Aeromine] Failed to load model:', err);
    spinnerEl.style.display = 'none';
    appEl.innerHTML = `
      <div class="load-error">
        <div>
          <strong>Could not load 3D scene.</strong><br>
          Make sure <code>public/models/lato.gltf</code> and <code>lato.bin</code> exist.<br>
          <small>${err.message}</small>
        </div>
      </div>
    `;
    return;
  }

  spinnerEl.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);
