import { Box3, Vector3 }  from 'three';
import { CSS2DObject }    from 'three/addons/renderers/CSS2DRenderer.js';
import { BUILDINGS }      from './site-data.js';

// How far above a building's highest point the tag floats (world units)
const TAG_Y_OFFSET = 2;

export class TagManager {
  constructor(viewer, popup) {
    this.viewer = viewer;
    this.popup  = popup;
    this._tags  = [];
  }

  /**
   * Call once after viewer.load() resolves.
   * Traverses the scene, matches nodes by name, and places a CSS2DObject tag
   * above each building.
   */
  buildTags() {
    const root = this.viewer.content;
    if (!root) {
      console.warn('[TagManager] No content loaded.');
      return;
    }

    const buildingMap = new Map(BUILDINGS.map(b => [b.meshName, b]));

    root.traverse((node) => {
      const building = buildingMap.get(node.name);
      if (!building) return;

      node.updateWorldMatrix(true, true);

      const anchor = this._computeAnchor(node);
      const tagObj = this._createTag(building, node, anchor);

      // Add to scene root so positions are in world space
      this.viewer.scene.add(tagObj);
      this._tags.push({ building, object3d: tagObj });

      console.log(`[TagManager] Tag placed for "${node.name}" at`, anchor);
    });

    if (this._tags.length === 0) {
      console.warn('[TagManager] No nodes matched. Check meshName values in site-data.js match GLTF node names exactly.');
    }
  }

  _computeAnchor(node) {
    const box = new Box3().setFromObject(node);
    return new Vector3(
      (box.min.x + box.max.x) / 2,
      box.max.y + TAG_Y_OFFSET,
      (box.min.z + box.max.z) / 2
    );
  }

  _createTag(building, node, anchorPosition) {
    const el = document.createElement('div');
    el.className = 'building-tag';
    el.innerHTML = `
      <span class="tag-icon">${building.icon}</span>
      <span class="tag-name">${building.name}</span>
    `;
    el.style.pointerEvents = 'auto';

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewer.focusOn(node);
      this.popup.show(building);
    });

    const obj = new CSS2DObject(el);
    obj.position.copy(anchorPosition);
    obj.center.set(0.5, 1.0);

    return obj;
  }

  dispose() {
    this._tags.forEach(({ object3d }) => {
      if (object3d.parent) object3d.parent.remove(object3d);
    });
    this._tags = [];
  }
}
