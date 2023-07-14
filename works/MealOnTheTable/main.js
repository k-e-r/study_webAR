// import { loadGLTF } from "../../libs/loader.js";
// const THREE = window.MINDAR.IMAGE.THREE;

// document.addEventListener('DOMContentLoaded', () => {
//   const start = async() => {
//     const mindarThree = new window.MINDAR.IMAGE.MindARThree({
//       container: document.body,
//       imageTargetSrc: '../../assets/targets/pattern-marker.mind',
//     });
//     const {renderer, scene, camera} = mindarThree;

//     const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
//     scene.add(light);

//     // const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
//     const burger = await loadGLTF('./Burger-Only.glb');
//     burger.scene.scale.set(1, 1, 1);
//     burger.scene.rotation.set(1.25, 0, 0);
//     burger.scene.position.set(-2, -2, 0);
//     const ebiSushi = await loadGLTF('./Ebi-Sushi.glb');
//     ebiSushi.scene.scale.set(1, 1, 1);
//     ebiSushi.scene.rotation.set(1.25, 0, 0);
//     ebiSushi.scene.position.set(-2, 2, 0);
//     const ikuraSushi = await loadGLTF('./Ikura-Sushi.glb');
//     ikuraSushi.scene.scale.set(1, 1, 1);
//     ikuraSushi.scene.rotation.set(1.25, 0, 0);
//     ikuraSushi.scene.position.set(-1, 2, 0);

//     const anchor = mindarThree.addAnchor(0);
//     anchor.group.add(burger.scene);
//     anchor.group.add(ebiSushi.scene);
//     anchor.group.add(ikuraSushi.scene);
//     scene.add(burger.scene)

//     const mixer = new THREE.AnimationMixer(burger.scene);
//     // const action = mixer.clipAction(gltf.animations[0]);
//     // action.play();

//     const clock = new THREE.Clock();

//     await mindarThree.start();
//     renderer.setAnimationLoop(() => {
//       const delta = clock.getDelta();
//       // gltf.scene.rotation.set(gltf.scene.rotation.x+delta, gltf.scene.rotation.y, 0);
//       // gltf.scene.rotation.set(1.25, gltf.scene.rotation.y+delta, 0);
//       mixer.update(delta);
//       renderer.render(scene, camera);
//     });
//   }
//   start();
// });

import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import { ARButton } from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';
import { loadGLTF } from "../../libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const initialize = async() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry( 0.6, 0.8, 64 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial();
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', async () => {
      if (count > 0) return;
      // console.log('mesh.position 1:', new THREE.Vector3().setFromMatrixPosition(reticle.matrix).y);
      // if (Math.abs(Math.floor(new THREE.Vector3().setFromMatrixPosition(reticle.matrix).y)) > 1) return;
      const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random()});
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.setFromMatrixPosition(reticle.matrix);
      // console.log('mesh.position',mesh.position, new THREE.Vector3().setFromMatrixPosition(reticle.matrix));
      // mesh.scale.y = Math.random() * 2 + 1;
      // scene.add(mesh);

      // const gltf = await loadGLTF('./Dog_Icon.glb');
      const gltf = await loadGLTF('./Food-All.glb');
      gltf.scene.scale.set(0.06, 0.06, 0.06);
      gltf.scene.position.set(mesh.position.x-0.05, mesh.position.y-0.2, mesh.position.z+0.4);
      // gltf.scene.rotation.set(0, -1.25, 0);
      gltf.scene.rotation.set(0, Math.PI, 0);
      // gltf.scene.rotation.set(0, (Math.abs(new THREE.Vector3().setFromMatrixPosition(reticle.matrix).x) * -1 + 0.5) * -1, 0);
      scene.add(gltf.scene);

      // const burger = await loadGLTF('./Burger-Only.glb');
      // burger.scene.scale.set(1, 1, 1);
      // // burger.scene.rotation.set(1.25, 0, 0);
      // gltf.scene.position.set(mesh.position.x, mesh.position.y, mesh.position.z);

      // scene.add(burger.scene);
      count++;
    });

    renderer.xr.addEventListener("sessionstart", async (e) => {
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});

      renderer.setAnimationLoop((timestamp, frame) => {
        if (!frame) return;

        const hitTestResults = frame.getHitTestResults(hitTestSource);

        if (hitTestResults.length) {
          const hit = hitTestResults[0];
          const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
          const hitPose = hit.getPose(referenceSpace);

          reticle.visible = true;
          reticle.matrix.fromArray(hitPose.transform.matrix);
        } else {
          reticle.visible = false;
        }

        if (count > 0) reticle.visible = false;

        renderer.render(scene, camera);
      });
    });

    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });

  }

  initialize();
});
