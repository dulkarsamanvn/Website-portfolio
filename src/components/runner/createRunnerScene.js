import {
  ACESFilmicToneMapping, CapsuleGeometry, Color, DirectionalLight, Group,
  HemisphereLight, Mesh, MeshStandardMaterial, OrthographicCamera, Scene,
  SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';

export function createRunnerScene(canvas) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(new Color('#ffffff'), 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1.4, -1.2, 0.1, 30);
  camera.position.set(0, 2.9, 7);
  camera.lookAt(0, 1.15, 0);
  scene.add(new HemisphereLight('#fff6e6', '#64715e', 2.3));
  const key = new DirectionalLight('#fff7e9', 3.4);
  key.position.set(-3, 5, 5);
  scene.add(key);
  const rim = new DirectionalLight('#d9e6ec', 2);
  rim.position.set(3, 3, -4);
  scene.add(rim);

  const sphere = new SphereGeometry(1, 16, 12);
  const geometries = new Set([sphere]);
  const materials = new Set();
  const material = (color, roughness = 0.8) => {
    const result = new MeshStandardMaterial({ color, roughness, metalness: 0 });
    materials.add(result);
    return result;
  };
  const skin = material('#d6ad83');
  const shirt = material('#606e54');
  const seam = material('#869276');
  const pants = material('#34413f');
  const hair = material('#222823', 0.92);
  const shoes = material('#f7f5e9', 0.65);
  const sole = material('#bac4b5');
  const dark = material('#242b26');
  const bag = material('#454f3d');
  const mouth = material('#95684d');
  const character = new Group();
  scene.add(character);

  function ball(parent, surface, position, scale) {
    const mesh = new Mesh(sphere, surface);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }
  function capsule(parent, surface, radius, length, position) {
    const geometry = new CapsuleGeometry(radius, Math.max(0.001, length - 2 * radius), 5, 12);
    geometries.add(geometry);
    const mesh = new Mesh(geometry, surface);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  const upper = new Group();
  upper.position.y = 1;
  character.add(upper);
  const torso = capsule(upper, shirt, 0.25, 0.76, [0, 0.36, 0]);
  torso.scale.set(1.15, 1, 0.76);
  ball(character, pants, [0, 0.98, 0], [0.26, 0.16, 0.18]);
  capsule(upper, skin, 0.105, 0.18, [0, 0.79, 0.02]);
  ball(upper, skin, [0, 1.07, 0.025], [0.295, 0.325, 0.275]);
  ball(upper, skin, [-0.288, 1.06, 0.02], [0.065, 0.085, 0.055]);
  ball(upper, skin, [0.288, 1.06, 0.02], [0.065, 0.085, 0.055]);
  ball(upper, skin, [0, 1.04, 0.301], [0.055, 0.07, 0.065]);
  for (const side of [-1, 1]) {
    ball(upper, dark, [side * 0.105, 1.105, 0.28], [0.021, 0.034, 0.018]);
    const brow = capsule(upper, hair, 0.012, 0.075, [side * 0.105, 1.17, 0.266]);
    brow.rotation.z = Math.PI / 2 + side * 0.08;
  }
  const smile = capsule(upper, mouth, 0.009, 0.067, [0, 0.945, 0.278]);
  smile.rotation.z = Math.PI / 2;
  ball(upper, hair, [0, 1.26, -0.025], [0.31, 0.22, 0.285]);
  [
    [-0.22, 1.3, 0.13, 0.13], [-0.09, 1.39, 0.11, 0.15],
    [0.07, 1.38, 0.14, 0.15], [0.21, 1.3, 0.1, 0.125],
    [-0.23, 1.15, -0.08, 0.11], [0.23, 1.16, -0.08, 0.11],
    [0, 1.35, -0.2, 0.16], [-0.15, 1.32, -0.17, 0.14],
  ].forEach(([x, y, z, radius]) => ball(upper, hair, [x, y, z], [radius, radius * 0.85, radius]));

  const backpack = capsule(upper, bag, 0.17, 0.47, [0, 0.37, -0.245]);
  backpack.scale.set(1.05, 1, 0.65);
  for (const side of [-1, 1]) {
    capsule(upper, seam, 0.024, 0.42, [side * 0.18, 0.41, 0.19]);
  }
  capsule(upper, seam, 0.015, 0.3, [0, 0.39, -0.365]);

  function arm(side) {
    const shoulder = new Group();
    shoulder.position.set(side * 0.32, 0.62, 0.01);
    upper.add(shoulder);
    ball(shoulder, shirt, [0, -0.015, 0], [0.105, 0.12, 0.105]);
    capsule(shoulder, shirt, 0.082, 0.22, [0, -0.11, 0]);
    capsule(shoulder, skin, 0.064, 0.15, [0, -0.245, 0]);
    const elbow = new Group();
    elbow.position.y = -0.3;
    shoulder.add(elbow);
    ball(elbow, skin, [0, 0, 0], [0.064, 0.064, 0.064]);
    capsule(elbow, skin, 0.06, 0.28, [0, -0.14, 0]);
    ball(elbow, skin, [0, -0.29, 0], [0.073, 0.08, 0.068]);
    return { shoulder, elbow };
  }
  function leg(side) {
    const hip = new Group();
    hip.position.set(side * 0.145, 0.98, 0);
    character.add(hip);
    capsule(hip, pants, 0.105, 0.4, [0, -0.2, 0]);
    const knee = new Group();
    knee.position.y = -0.38;
    hip.add(knee);
    ball(knee, pants, [0, 0, 0], [0.088, 0.088, 0.088]);
    capsule(knee, pants, 0.08, 0.38, [0, -0.19, 0]);
    const foot = new Group();
    foot.position.set(0, -0.38, 0.075);
    knee.add(foot);
    ball(foot, shoes, [0, 0.015, 0.035], [0.11, 0.09, 0.21]);
    ball(foot, sole, [0, -0.047, 0.038], [0.114, 0.035, 0.213]);
    return { hip, knee, foot };
  }
  const leftArm = arm(-1);
  const rightArm = arm(1);
  const leftLeg = leg(-1);
  const rightLeg = leg(1);
  const leftFoot = new Vector3();
  const rightFoot = new Vector3();
  let disposed = false;
  let lastPhase = 0.6;
  let lastHeading = 0;

  function render(phase = lastPhase, heading = lastHeading) {
    if (disposed) return;
    lastPhase = phase;
    lastHeading = heading;
    const stride = Math.sin(phase);
    const lift = value => ((value + Math.sqrt(value * value + 0.015)) / 2) ** 2;
    character.position.y = 0;
    character.rotation.y = heading;
    upper.rotation.x = 0.075;
    upper.rotation.z = Math.sin(phase) * 0.018;
    leftLeg.hip.rotation.x = stride * 0.62;
    rightLeg.hip.rotation.x = -stride * 0.62;
    leftLeg.knee.rotation.x = 0.15 + lift(stride) * 1.05;
    rightLeg.knee.rotation.x = 0.15 + lift(-stride) * 1.05;
    leftArm.shoulder.rotation.x = -stride * 0.5;
    rightArm.shoulder.rotation.x = stride * 0.5;
    leftArm.elbow.rotation.x = -1.08 + stride * 0.08;
    rightArm.elbow.rotation.x = -1.08 - stride * 0.08;
    character.updateMatrixWorld(true);
    leftLeg.foot.getWorldPosition(leftFoot);
    rightLeg.foot.getWorldPosition(rightFoot);
    const ground = (leftFoot.y + rightFoot.y - Math.sqrt((leftFoot.y - rightFoot.y) ** 2 + 0.006)) / 2;
    character.position.y = 0.075 - ground + Math.sqrt(stride * stride + 0.02) * 0.015;
    renderer.render(scene, camera);
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const halfWidth = (camera.top - camera.bottom) * width / height / 2;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  resize();

  return {
    render, resize,
    dispose() {
      disposed = true;
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(surface => surface.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
