import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import { loadGLTF } from "../../libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera();
  camera.position.set(1, 1, 5);

  const renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(500, 500);
  renderer.render(scene, camera);

  const video = document.createElement("video");
  navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
    video.srcObject = stream;
    video.play();
  });

  video.style.position = "absolute";
  video.style.width = renderer.domElement.width;
  video.style.height = renderer.domElement.height;
  renderer.domElement.style.position = "absolute";

  document.body.appendChild(video);
  document.body.appendChild(renderer.domElement);

  const start = async() => {
    // const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    // scene.add(light);

    const aLight = new THREE.AmbientLight(0x404040, 15);
    aLight.position.set(0,10,10)
    scene.add(aLight);

    const pLight = new THREE.PointLight(0xFFFFFF, 15);
    pLight.position.set(0,5,0)
    scene.add(pLight);

    // const gltf2 = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    const gltf = await loadGLTF('./Dog_Icon.glb');
    // console.log(gltf, gltf2);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -0.4, 0);
    scene.add(gltf.scene);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();

    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      gltf.scene.rotation.set(0, gltf.scene.rotation.y+delta, 0);
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
