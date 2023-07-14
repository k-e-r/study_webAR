import { loadGLTF } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/0fool.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    const AmbientLight = new THREE.AmbientLight(0x404040);
    scene.add(AmbientLight);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    // const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    const gltf = await loadGLTF('./Food-All.glb');
    console.log(gltf.scene); // returns true
    console.log('object3d', new THREE.Object3D());
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    // gltf.scene.position.set(0, -0.4, 0);
    gltf.scene.rotateX(Math.PI / 2);
    gltf.scene.position.set(0, 1, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);
    // directionalLight.target = gltf.scene;
    // scene.add( directionalLight.target );

    // const mixer = new THREE.AnimationMixer(gltf.scene);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();

    // const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      // const delta = clock.getDelta();
      // gltf.scene.rotation.set(gltf.scene.rotation.x+delta, gltf.scene.rotation.y, 0);
      // gltf.scene.rotation.set(1.25, gltf.scene.rotation.y+delta, 0);
      // mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
