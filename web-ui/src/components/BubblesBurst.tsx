import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type Bubble = {
  mesh: THREE.Mesh;
  vy: number;
  r: number;
  mat: THREE.MeshPhysicalMaterial;
};

export default function BubblesBurst({
  trigger,
  bottomInset = 64,
  count = 7, // number of bubbles
  minR = 0.5, // min radius
  maxR = 0.7, // max radius
  minSpeed = 0.03, // min upward speed
  maxSpeed = 0.08, // max upward speed
}: {
  trigger: number;
  bottomInset?: number;
  count?: number;
  minR?: number;
  maxR?: number;
  minSpeed?: number;
  maxSpeed?: number;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = null; // transparent
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    return () => {
      ro.disconnect();
      renderer.dispose();
      pmrem.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!mount || !renderer || !scene || !camera) return;

    const unitSphere = new THREE.SphereGeometry(1, 64, 64);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x66aaff, // bluish tint
      transparent: true,
      opacity: 1,
      transmission: 1.0,
      thickness: 0.25,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      ior: 1.33,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 380],
      attenuationDistance: 2.0,
      attenuationColor: new THREE.Color(0x66aaff),
      depthWrite: true,
    });

    const halfY =
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfX = halfY * camera.aspect;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const bubbles: Bubble[] = [];

    for (let i = 0; i < count; i++) {
      const r = rand(minR, maxR);
      const mat = baseMat.clone(); // per-bubble for independent opacity
      mat.opacity = 1.0;

      const mesh = new THREE.Mesh(unitSphere, mat);
      mesh.scale.setScalar(r);

      mesh.position.set(
        rand(-halfX * 0.9, halfX * 0.9),
        rand(-halfY, -halfY * 1.8),
        0
      );

      const vy = rand(minSpeed, maxSpeed);
      scene.add(mesh);
      bubbles.push({ mesh, vy, r, mat });
    }

    let raf = 0;
    let exited = 0;
    const fadeBand = halfY * 0.25;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      for (const b of bubbles) {
        if (!b.mesh.visible) continue;
        b.mesh.position.y += b.vy;

        const distToTop = halfY - (b.mesh.position.y - b.r);

        // Fade in the top band
        if (distToTop <= fadeBand) {
          const t = THREE.MathUtils.clamp(distToTop / fadeBand, 0, 1);
          b.mat.opacity = t * t; // ease-out fade
        } else {
          b.mat.opacity = 1.0;
        }

        // Hide when fully out
        if (b.mesh.position.y - b.r > halfY) {
          b.mesh.visible = false;
          exited++;
        }
      }

      renderer.render(scene, camera);

      // Stop when one round finishes
      if (exited >= bubbles.length) {
        cancelAnimationFrame(raf);
        // cleanup meshes/materials from this burst
        for (const b of bubbles) {
          scene.remove(b.mesh);
          b.mesh.geometry.dispose(); // geometry is shared; safe to skip if using unitSphere
          b.mat.dispose();
        }
        unitSphere.dispose();
        baseMat.dispose();
      }
    };

    if (trigger > 0) animate();

    return () => {
      cancelAnimationFrame(raf);
      for (const b of bubbles) {
        scene.remove(b.mesh);
        b.mat.dispose();
      }
      unitSphere.dispose();
      baseMat.dispose();
    };
  }, [trigger, count, minR, maxR, minSpeed, maxSpeed]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        bottom: bottomInset,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
