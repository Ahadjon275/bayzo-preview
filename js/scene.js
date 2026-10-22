import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#bayzo-scene");
if (!canvas) {
  document.body.classList.add("scene-off");
} else {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (err) {
    document.body.classList.add("scene-off");
    renderer = null;
  }

  if (renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07110c);
    scene.fog = new THREE.Fog(0x07110c, 7, 16);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(-0.4, 0.85, 7.4);

    const cream = new THREE.MeshPhysicalMaterial({
      color: 0xf6f1e6,
      roughness: 0.38,
      metalness: 0.04,
      clearcoat: 0.75,
      clearcoatRoughness: 0.25
    });
    const leaf = new THREE.MeshPhysicalMaterial({
      color: 0x1e8a48,
      roughness: 0.28,
      metalness: 0.18,
      emissive: 0x0c3d22,
      emissiveIntensity: 0.55,
      clearcoat: 0.4
    });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xe2b15a, roughness: 0.4 });
    const combMat = new THREE.MeshStandardMaterial({ color: 0xc4483a, roughness: 0.45 });

    const bird = new THREE.Group();

    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), cream);
    body.scale.set(1.25, 0.92, 0.86);
    bird.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), cream);
    head.position.set(0.72, 0.62, 0.08);
    bird.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 20), beakMat);
    beak.position.set(1.12, 0.58, 0.08);
    beak.rotation.z = -Math.PI / 2;
    bird.add(beak);

    const comb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), combMat);
    comb.position.set(0.62, 0.98, 0.08);
    comb.scale.set(0.7, 1.1, 0.45);
    bird.add(comb);

    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 18), cream);
    wing.position.set(-0.05, 0.05, 0.55);
    wing.scale.set(1.15, 0.55, 0.22);
    bird.add(wing);

    const wing2 = wing.clone();
    wing2.position.z = -0.55;
    bird.add(wing2);

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 16), leaf);
    tail.position.set(-1.15, 0.35, 0);
    tail.rotation.z = Math.PI / 2.3;
    bird.add(tail);

    const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.7, 12);
    const leg = new THREE.Mesh(legGeo, beakMat);
    leg.position.set(0.15, -0.95, 0.18);
    bird.add(leg);
    const legB = leg.clone();
    legB.position.z = -0.18;
    bird.add(legB);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.012, 12, 90),
      new THREE.MeshBasicMaterial({ color: 0x6dffb0, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2.15;
    bird.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.006, 12, 90),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 })
    );
    ring2.rotation.x = Math.PI / 3.1;
    ring2.rotation.y = 0.6;
    bird.add(ring2);

    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x102018, roughness: 0.3 })
    );
    eye.position.set(0.98, 0.72, 0.28);
    bird.add(eye);

    bird.scale.setScalar(0.72);
    scene.add(bird);

    const dots = new Float32Array(80 * 3);
    for (let i = 0; i < dots.length; i += 3) {
      dots[i] = (Math.random() - 0.5) * 8;
      dots[i + 1] = Math.random() * 3.2 - 0.4;
      dots[i + 2] = (Math.random() - 0.5) * 6;
    }
    const spark = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(dots, 3)),
      new THREE.PointsMaterial({ color: 0xc8ffe0, size: 0.025, transparent: true, opacity: 0.75 })
    );
    scene.add(spark);

    scene.add(new THREE.AmbientLight(0xf2fff6, 0.55));
    const key = new THREE.DirectionalLight(0xfff4e4, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3dff8a, 1.6);
    rim.position.set(-4, 2, -2);
    scene.add(rim);
    const fill = new THREE.PointLight(0x7dffb3, 8, 12);
    fill.position.set(1.5, 0.2, 2);
    scene.add(fill);

    let baseX = 1.85;
    let baseY = -0.05;

    function fit() {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const narrow = width < 800;
      camera.aspect = width / Math.max(height, 1);
      camera.position.x = narrow ? 0 : -0.4;
      camera.updateProjectionMatrix();
      baseX = narrow ? 0.15 : 1.85;
      baseY = narrow ? 0.15 : -0.05;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.6));
      renderer.setSize(width, height, false);
    }

    fit();
    window.addEventListener("resize", fit);

    const clock = new THREE.Clock();
    function frame() {
      const t = clock.getElapsedTime();
      if (!reduced) {
        bird.rotation.y = t * 0.35;
        bird.position.set(baseX, baseY + Math.sin(t * 1.2) * 0.08, 0);
        ring.rotation.z = t * 0.25;
        ring2.rotation.z = -t * 0.18;
        spark.rotation.y = t * 0.05;
      }
      renderer.render(scene, camera);
      if (!reduced) requestAnimationFrame(frame);
    }
    frame();
    document.body.classList.add("scene-on");
  }
}
