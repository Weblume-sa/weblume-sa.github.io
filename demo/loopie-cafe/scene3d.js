/* Real 3D for the roast bean and the drinks glass.
   index.html drives both through window.T3; if WebGL is missing the SVG versions stay. */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener("pointermove", (e) => {
  mouse.tx = (e.clientX / innerWidth) * 2 - 1;
  mouse.ty = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });

function stage(host, fov, camPos, look) {
  const canvas = document.createElement("canvas");
  canvas.className = "gl";
  host.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const key = new THREE.DirectionalLight(0xfff3e6, 2.4);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(-4, 2, -3);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.25));
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 50);
  camera.position.set(...camPos);
  camera.lookAt(...look);
  const s = { renderer, scene, camera, canvas, host, visible: false, dirty: true };
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    s.dirty = true;
  };
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver((en) => { s.visible = en[0].isIntersecting; }).observe(host);
  size();
  return s;
}

/* ---------------- bean ---------------- */
function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 150, 120);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    let { x, y, z } = v;
    x *= 0.76; z *= 0.6;
    let shade = 1;
    if (z > 0) {
      z *= 0.72; /* the crease side is flatter */
      const cx = 0.15 * Math.sin(y * 2.5), d = x - cx;
      const ends = 1 - THREE.MathUtils.smoothstep(Math.abs(y), 0.72, 0.97);
      const groove = Math.exp(-(d * d) / 0.0065) * ends;
      z -= groove * 0.2;
      shade = 1 - groove * 0.75;
    }
    /* small irregularities so it reads as organic, not a pill */
    const n = Math.sin(x * 11 + y * 6.3) * Math.sin(y * 9.1 - z * 7.7) * 0.012;
    v.set(x * (1 + n), y, z * (1 + n));
    p.setXYZ(i, v.x, v.y, v.z);
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = shade;
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/* ---------------- glass ---------------- */
const BOT = -1.05, TOP = 1.36, RB = 0.6, RT = 0.79; /* liquid space inside the glass */
const liquidMat = new THREE.ShaderMaterial({
  uniforms: {
    c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
    t0: { value: 0.2 }, t1: { value: 0.4 }, lvl: { value: 0.6 }, soft: { value: 0.05 }
  },
  vertexShader: `
    varying float vh; varying vec3 vN; varying vec3 vV;
    void main(){
      vh = (position.y - (${BOT.toFixed(3)})) / (${(TOP - BOT).toFixed(3)});
      vec4 wp = modelMatrix * vec4(position,1.0);
      vN = normalize(mat3(modelMatrix) * normal);
      vV = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`,
  fragmentShader: `
    uniform vec3 c0; uniform vec3 c1; uniform vec3 c2;
    uniform float t0; uniform float t1; uniform float lvl; uniform float soft;
    varying float vh; varying vec3 vN; varying vec3 vV;
    void main(){
      if (vh > lvl) discard;
      float a = smoothstep(t0 - soft*.5, t0 + soft*.5, vh);
      float b = smoothstep(t1 - soft*.5, t1 + soft*.5, vh);
      vec3 c = mix(mix(c0, c1, a), c2, b);
      float l = .78 + .3 * max(dot(vN, normalize(vec3(.5,.6,.9))), 0.);
      float edge = pow(1. - max(dot(vN, vV), 0.), 2.);
      c = c * l * (1. - edge * .35);
      gl_FragColor = vec4(c, 1.);
      #include <colorspace_fragment>
    }`
});

function glassScene(host) {
  const s = stage(host, 26, [0, 1.7, 10.4], [0, 0.05, 0]);
  const group = new THREE.Group();
  s.scene.add(group);

  /* tumbler: outer wall up, rim, inner wall down, thick base */
  const prof = [
    [0, -1.36], [0.55, -1.36], [0.64, -1.32], [0.67, -1.22], [0.86, 1.42], [0.85, 1.45],
    [0.82, 1.45], [0.81, 1.42], [0.63, -1.02], [0.58, -1.07], [0, -1.07]
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.1,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.2, side: THREE.DoubleSide, depthWrite: false
  });
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), glassMat);
  glass.renderOrder = 2;

  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(RT, RB, TOP - BOT, 96, 64, true), liquidMat);
  liquid.position.y = (TOP + BOT) / 2;
  const cap = new THREE.Mesh(new THREE.CircleGeometry(1, 96), new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0 }));
  cap.rotation.x = -Math.PI / 2;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(RB, 64), new THREE.MeshBasicMaterial());
  floor.rotation.x = -Math.PI / 2; floor.position.y = BOT + 0.001;

  const iceMat = new THREE.MeshPhysicalMaterial({ color: 0xf2f8ff, roughness: 0.1, transparent: true, opacity: 0.72, clearcoat: 1, envMapIntensity: 2, depthWrite: false });
  const ice = [[-0.22, 0.05, 0.12, 0.4, 0.3], [0.26, -0.06, -0.1, -0.5, 0.2], [0.02, -0.28, 0.25, 0.9, -0.3]].map(([x, dy, z, rx, rz]) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.4, 0.42, 4, 0.07), iceMat);
    m.userData = { x, dy, z }; m.rotation.set(rx, rz * 2, rz); m.renderOrder = 1;
    return m;
  });
  group.add(floor, liquid, cap, ...ice, glass);

  const blob = new THREE.Mesh(new THREE.CircleGeometry(1.25, 64), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.09, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; blob.position.y = -1.37; blob.scale.set(0.82, 0.45, 1);
  s.scene.add(blob);

  let wob = 0;
  return {
    s,
    set(L, soft, lvl, iceAmt, w) {
      liquidMat.uniforms.c0.value.set(L[0].c); liquidMat.uniforms.c1.value.set(L[1].c); liquidMat.uniforms.c2.value.set(L[2].c);
      liquidMat.uniforms.t0.value = L[0].top; liquidMat.uniforms.t1.value = L[1].top;
      liquidMat.uniforms.lvl.value = lvl; liquidMat.uniforms.soft.value = Math.max(soft, 0.005);
      floor.material.color.set(L[0].c);
      const y = BOT + (TOP - BOT) * lvl, r = RB + (RT - RB) * lvl;
      cap.position.y = y; cap.scale.setScalar(r);
      cap.material.color.set(L[2].c).lerp(new THREE.Color(0xffffff), 0.12);
      ice.forEach((m) => { m.scale.setScalar(Math.max(iceAmt, 0.001)); m.visible = iceAmt > 0.02; m.position.set(m.userData.x, y - 0.12 + m.userData.dy, m.userData.z); });
      wob = w; s.dirty = true;
    },
    tick(t) {
      group.rotation.y = Math.sin(t * 0.0004) * 0.25 + mouse.x * 0.35;
      group.rotation.z = -wob * 0.06;
      group.rotation.x = mouse.y * 0.08;
      group.position.y = wob * 0.12;
    }
  };
}

function beanScene(host) {
  const s = stage(host, 26, [0, 0, 6.6], [0, 0, 0]);
  const mat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.7, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.35, sheen: 0.4, sheenRoughness: 0.6 });
  const bean = new THREE.Mesh(beanGeometry(), mat);
  const holder = new THREE.Group();
  holder.add(bean);
  s.scene.add(holder);
  let p = 0, jolt = 0;
  return {
    s,
    set(pp, mid, j) {
      p = pp; jolt = j;
      mat.color.set(mid);
      mat.roughness = THREE.MathUtils.lerp(0.72, 0.3, THREE.MathUtils.smoothstep(pp, 0.4, 0.95));
      mat.clearcoat = THREE.MathUtils.lerp(0, 0.55, THREE.MathUtils.smoothstep(pp, 0.6, 0.95));
      s.dirty = true;
    },
    tick(t) {
      holder.rotation.y = THREE.MathUtils.lerp(-0.7, 0.7, p) + Math.sin(t * 0.0006) * 0.12 + mouse.x * 0.4;
      holder.rotation.x = 0.18 + mouse.y * 0.25;
      holder.rotation.z = THREE.MathUtils.lerp(-0.28, 0.24, p) + jolt * 0.02;
      holder.scale.setScalar(THREE.MathUtils.lerp(0.92, 1.1, p));
    }
  };
}

const STILL = /[?&]still/.test(location.search); /* test hook: draw only on change */
try {
  const gl = document.createElement("canvas").getContext("webgl2");
  if (!gl) throw new Error("no webgl2");
  const bh = document.getElementById("bean3d"), gh = document.getElementById("glass3d");
  const B = beanScene(bh), G = glassScene(gh);
  const loop = (t) => {
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    for (const o of [B, G]) {
      if (!o.s.visible || (STILL && !o.s.dirty)) continue;
      o.s.dirty = false;
      o.tick(STILL ? 0 : t);
      o.s.renderer.render(o.s.scene, o.s.camera);
    }
    requestAnimationFrame(loop);
  };
  window.T3 = { roast: (p, mid, j) => B.set(p, mid, j), glass: (L, soft, lvl, ice, w) => G.set(L, soft, lvl, ice, w) };
  document.documentElement.classList.add("has3d");
  if (window.__req) window.__req();
  requestAnimationFrame(loop);
} catch (e) {
  /* the SVG bean and glass stay in place */
}
