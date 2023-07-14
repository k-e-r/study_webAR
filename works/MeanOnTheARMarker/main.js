import { loadGLTF } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/0fool.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    // light.position.set(0.5, 1, 0.25);
    // scene.add(light);

    // const color = new THREE.Color("rgb(255, 0, 0");
    // const spotLight = new THREE.SpotLight(color, 9, 20, 0.2);
    // spotLight.position.set(0, 0, 1);
    // scene.add(spotLight);

    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);

    // spotLight.castShadow = true;
    const AmbientLight = new THREE.AmbientLight(0x404040);
    scene.add(AmbientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);

    // for shadow
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    // geometry.rotateX(-Math.PI / 2);
    // const planeMaterial = new THREE.ShadowMaterial();
    // material.opacity = 0.2;
    // const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
    const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
    // const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // plane.visible = false;
    // plane.matrixAutoUpdate = false;
    plane.position.set(0, 0, -2);
    scene.add(plane);


    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: "#0000FF"});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -1);
    cube.rotation.set(0, Math.PI / 4, 0);
    cube.castShadow = true;
    // scene.add(cube);

    // const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    const gltf = await loadGLTF('./Food-All.glb');
    console.log(gltf.scene); // returns true
    console.log('object3d', new THREE.Object3D());
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    // gltf.scene.position.set(0, -0.4, 0);
    gltf.scene.rotation.set(Math.PI / 2, Math.PI, 0);
    gltf.scene.position.set(0, -0.5, 0);
    gltf.scene.castShadow = true;

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    anchor.group.add(cube);
    anchor.group.add(gltf.scene);
    // directionalLight.target = gltf.scene;
    // scene.add( directionalLight.target );

    // const mixer = new THREE.AnimationMixer(gltf.scene);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();

    // const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
