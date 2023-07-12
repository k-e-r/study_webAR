import { loadGLTF } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/0fool.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    const burger = await loadGLTF('./Burger-Only.glb');
    burger.scene.scale.set(1, 1, 1);
    burger.scene.rotation.set(1.25, 0, 0);
    burger.scene.position.set(-2, -2, 0);
    const ebiSushi = await loadGLTF('./Ebi-Sushi.glb');
    ebiSushi.scene.scale.set(1, 1, 1);
    ebiSushi.scene.rotation.set(1.25, 0, 0);
    ebiSushi.scene.position.set(-2, 2, 0);
    const ikuraSushi = await loadGLTF('./Ikura-Sushi.glb');
    ikuraSushi.scene.scale.set(1, 1, 1);
    ikuraSushi.scene.rotation.set(1.25, 0, 0);
    ikuraSushi.scene.position.set(-1, 2, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(burger.scene);
    anchor.group.add(ebiSushi.scene);
    anchor.group.add(ikuraSushi.scene);

    const mixer = new THREE.AnimationMixer(burger.scene);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      // gltf.scene.rotation.set(gltf.scene.rotation.x+delta, gltf.scene.rotation.y, 0);
      // gltf.scene.rotation.set(1.25, gltf.scene.rotation.y+delta, 0);
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
