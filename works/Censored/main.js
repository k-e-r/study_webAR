import { loadGLTF } from "../../libs/loader.js";
// import {mockWithVideo} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.FACE.THREE;

const capture = (mindarThree) => {
  const {video, renderer, scene, camera} = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
  const sw = video.videoWidth - sx * 2;
  const sh = video.videoHeight - sy * 2;

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL('image/png');
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    //mockWithVideo('../../assets/mock-videos/face1.mp4');

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(-0.5, 1, 1);
    scene.add(light);
    scene.add(light2);

    const occluder = await loadGLTF('../../assets/models/sparkar-occluder/headOccluder.glb');
    occluder.scene.scale.set(0.065, 0.065, 0.065);
    occluder.scene.position.set(0, -0.3, 0.15);
    occluder.scene.traverse((o) => {
      if (o.isMesh) {
        const occluderMaterial = new THREE.MeshPhongMaterial({colorWrite: false});
        o.material = occluderMaterial;
      }
    });
    occluder.scene.renderOrder = 0;

    const occluderAnchor = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);

    const censored = await loadGLTF('./20230713_NAKED_AR1_C-02.glb');
    censored.scene.scale.set(1.8, 1.8, 1.8);
    censored.scene.rotateX(Math.PI / 2);
    censored.scene.renderOrder = 1;
    const censoredAnchor = mindarThree.addAnchor(168);
    censoredAnchor.group.add(censored.scene);

    const text1 = await loadGLTF('./20230713_NAKED_AR1_green-03.glb');
    text1.scene.position.set(0, -0.4, 0);
    text1.scene.scale.set(1.8, 1.8, 1.8);
    text1.scene.rotateX(Math.PI / 2);
    text1.scene.renderOrder = 1;
    const text1Anchor = mindarThree.addAnchor(10);
    text1Anchor.group.add(text1.scene);

    const text2 = await loadGLTF('./20230713_NAKED_AR1_Dont-01.glb');
    text2.scene.position.set(0, -0.2, 0);
    text2.scene.scale.set(1.8, 1.8, 1.8);
    text2.scene.rotateX(Math.PI / 2);
    text2.scene.renderOrder = 1;
    const text2Anchor = mindarThree.addAnchor(168);
    text2Anchor.group.add(text2.scene);

    const text3 = await loadGLTF('./20230713_NAKED_AR1_privacy-04.glb');
    text3.scene.position.set(-0.2, -0.4, 0);
    text3.scene.scale.set(1.8, 1.8, 1.8);
    text3.scene.rotateX(Math.PI / 2);
    text3.scene.renderOrder = 1;
    const text3Anchor = mindarThree.addAnchor(10);
    text3Anchor.group.add(text3.scene);

    const buttons = ["#text1", "#censored", "#text2", "#text3"];
    const modelsArr = [[text1.scene], [censored.scene], [text2.scene], [text3.scene]];
    const visibles = [true, false, false, false];

    const setVisible = (button, models, visible) => {
      buttons.forEach((buttonId) => {
        const button = document.querySelector(buttonId);
        button.classList.remove("selected");
      })
      if (visible) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
      modelsArr.forEach((model) => {
        model.forEach((mod) => {
          mod.visible = false;
        })
      })
      models.forEach((model) => {
        model.visible = visible;
      });
    }
    buttons.forEach((buttonId, index) => {
      const button = document.querySelector(buttonId);
      if (index === 0) {
        modelsArr[index].forEach((model) => {
          model.visible = true;
          button.classList.add("selected");
        });
      } else {
        modelsArr[index].forEach((model) => {
          model.visible = false;
          button.classList.remove("selected");
        });
      }
      button.addEventListener('click', () => {
        visibles.fill(false);
        visibles[index] = !visibles[index];
        setVisible(button, modelsArr[index], visibles[index]);
      });
    });

    // const previewImage = document.querySelector("#preview-image");
    // const previewClose = document.querySelector("#preview-close");
    // const preview = document.querySelector("#preview");
    // const previewShare = document.querySelector("#preview-share");

    // document.querySelector("#capture").addEventListener("click", () => {
    //   const data = capture(mindarThree);
    //   preview.style.visibility = "visible";
    //   previewImage.src = data;
    // });

    // previewClose.addEventListener("click", () => {
    //   preview.style.visibility = "hidden";
    // });

    // previewShare.addEventListener("click", () => {
    //   const canvas = document.createElement('canvas');
    //   canvas.width = previewImage.width;
    //   canvas.height = previewImage.height;
    //   const context = canvas.getContext('2d');
    //   context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

    //   canvas.toBlob((blob) => {
    //     const file = new File([blob], "photo.png", {type: "image/png"});
    //     const files = [file];
    //     if (navigator.canShare && navigator.canShare({files})) {
    //       navigator.share({
    //         files: files,
    //         title: 'AR Photo',
    //       })
    //     } else {
    //       const link = document.createElement('a');
    //       link.download = 'photo.png';
    //       link.href = previewImage.src;
    //       link.click();
    //     }
    //   });
    // });

    const mixer = new THREE.AnimationMixer(text1.scene);
    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      text1.scene.rotation.set(1.25, text1.scene.rotation.y-delta*0.5, 0);
      mixer.update(delta);

      renderer.render(scene, camera);
    });
  }
  start();
});
