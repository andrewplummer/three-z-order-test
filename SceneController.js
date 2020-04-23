
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
            // Disabling this won't produce the trasparency issue
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
    this.camera.position.set(0, 20, 100);
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
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
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
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onAnimationFrame = () => {
    this.render();
    requestAnimationFrame(this.onAnimationFrame);
  };

}
