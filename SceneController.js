
class SceneController {

  constructor(el, gltf) {
    this.el = el;
    this.init(gltf);
  }

  init(gltf) {
    this.createScene();
    this.createLights();
    this.createCamera();
    this.createRenderer();
    this.createControls();

    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      gltf,
      // called when the resource is loaded
      ( gltf ) => {

        this.scene.add( gltf.scene );

        this.scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.material = new THREE.MeshToonMaterial({
              transparent: true,
              opacity: obj.material.opacity,
              color: obj.material.color.getHex(),
            });
          }
        });

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      },
      // called while loading is progressing
      function ( xhr ) {

        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {
        console.info(error);
      }
    );
    this.animate();
  }

  // Scene

  createScene() {
    this.scene = new THREE.Scene();
  }

  // Lighting

  createLights() {
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.addLight(new THREE.DirectionalLight(0xffffff, 0.3), 100, 200, 100);
    this.addLight(new THREE.DirectionalLight(0xffffff, 0.3), 100, -200, 100);
  }

  addLight(light, x, y, z) {
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  // Camera

  createCamera() {
    const { width, height } = this.getDimensions();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 10, 10000);
    this.camera.up = new THREE.Vector3(0, 0, 1);
  }

  // Renderer

  createRenderer() {
    const { width, height } = this.getDimensions();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.setDimensions();
    this.el.appendChild(this.renderer.domElement);
  }

  setDimensions() {
    const { width, height } = this.getDimensions();
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // Controls

  createControls() {
    CameraControls.install({ THREE });
    this.controls = new CameraControls(this.camera, this.el);
    this.clock = new THREE.Clock();
    this.controls.minDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.dampingFactor = .15;
    this.controls.draggingDampingFactor = .15;
    this.controls.verticalDragToForward = true;
    this.controls.truckSpeed = 2;
  }

  getDimensions() {
    return {
      width: this.el.clientWidth,
      height: this.el.clientHeight,
    };
  }

  // Rendering

  animate() {
    this.render();
    this.onAnimationFrame();
  }

  render = () => {
    const delta = this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
    this.controls.update(delta);
  }

  onAnimationFrame = () => {
    this.render();
    requestAnimationFrame(this.onAnimationFrame);
  };

}
