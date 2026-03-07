import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

const MODEL_URL = '/models/lato.gltf';

export class Viewer {
  constructor(container) {
    this.container = container;
    this.content   = null;
    this._init();
    this._addLights();
    this._startLoop();
    window.addEventListener('resize', () => this._onResize());
  }

  // -------------------------------------------------------------------------
  // Setup
  // -------------------------------------------------------------------------

  _init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new Scene();
    this.scene.background = new Color('#c8c5b8');

    this.camera = new PerspectiveCamera(50, w / h, 0.1, 5000);

    // WebGL renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // CSS2DRenderer — overlaid on top for building tags
    this.css2d = new CSS2DRenderer();
    this.css2d.setSize(w, h);
    this.css2d.domElement.style.position      = 'absolute';
    this.css2d.domElement.style.top           = '0';
    this.css2d.domElement.style.pointerEvents = 'none';
    this.container.appendChild(this.css2d.domElement);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = true;
    this.controls.enableDamping      = true;
    this.controls.dampingFactor      = 0.05;
    this.controls.minDistance        = 5;
    this.controls.maxDistance        = 2000;
    this.controls.maxPolarAngle      = Math.PI / 2.05; // prevent going below ground
  }

  _addLights() {
    // Sky/ground hemisphere — warm daylight feel
    const hemi = new HemisphereLight('#c9deff', '#8a7560', 1.2);
    this.scene.add(hemi);

    // Main sun light from upper-right
    const sun = new DirectionalLight('#fffaf0', 1.8);
    sun.position.set(1, 2, 1);
    this.scene.add(sun);
  }

  // -------------------------------------------------------------------------
  // Model loading
  // -------------------------------------------------------------------------

  load() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => {
          this.content = gltf.scene ?? gltf.scenes[0];
          this.scene.add(this.content);
          this._fitCamera(this.content);
          resolve(this.content);
        },
        undefined,
        reject
      );
    });
  }

  // -------------------------------------------------------------------------
  // Camera fit — centers model and positions camera for a top-down overview
  // -------------------------------------------------------------------------

  _fitCamera(object) {
    object.updateMatrixWorld();

    const box    = new Box3().setFromObject(object);
    const size   = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());

    // Re-center model at origin
    object.position.x -= center.x;
    object.position.y -= center.y;
    object.position.z -= center.z;

    this.controls.reset();
    this.controls.target.set(0, 0, 0);

    this.camera.near = size / 100;
    this.camera.far  = size * 10;
    this.camera.updateProjectionMatrix();

    // Position camera at ~45° above and slightly to the side
    this.camera.position.set(size * 0.6, size * 0.5, size * 0.6);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.controls.maxDistance = size * 5;
    this.controls.minDistance = size * 0.05;
  }

  // -------------------------------------------------------------------------
  // Render loop
  // -------------------------------------------------------------------------

  _startLoop() {
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.css2d.render(this.scene, this.camera);
    });
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.css2d.setSize(w, h);
  }
}
