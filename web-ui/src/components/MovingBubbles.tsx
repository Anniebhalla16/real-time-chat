import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type Bubble = { mesh: THREE.Mesh; vy: number; r: number };

export default function MovingBubbles({
  count = 12, // number of bubbles
  minR = 0.08, // min radius
  maxR = 0.28, // max radius
  minSpeed = 0.01, // min upward speed
  maxSpeed = 0.03, // max upward speed
}: {
  count?: number;
  minR?: number;
  maxR?: number;
  minSpeed?: number;
  maxSpeed?: number;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Simple lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    // Environment for nice refractions/reflections
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const unitSphere = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhysicalMaterial({
      // bluish transparent bubble
      color: 0x66aaff,
      transmission: 1.0,
      transparent: true,
      opacity: 1.0,
      thickness: 0.25,
      roughness: 0.06,
      metalness: 0.0,
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

    // Visible bounds at z=0 so we can respawn cleanly
    const halfY =
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfX = halfY * camera.aspect;

    // Helpers
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const bubbles: Bubble[] = [];

    const makeBubble = () => {
      const r = rand(minR, maxR);
      const mesh = new THREE.Mesh(unitSphere, material);
      mesh.scale.setScalar(r);
      mesh.position.set(
        rand(-halfX * 0.9, halfX * 0.9),
        rand(-halfY, -halfY * 1.8),
        0
      );
      const vy = rand(minSpeed, maxSpeed);
      scene.add(mesh);
      bubbles.push({ mesh, vy, r });
    };

    for (let i = 0; i < count; i++) makeBubble();

    // Animate
    let raf = 0;
    let exitedCount = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      for (const b of bubbles) {
        b.mesh.position.y += b.vy;
        if (b.mesh.visible) {
          b.mesh.position.y += b.vy;

          // check if bubble is fully above view if yes we stop
          if (b.mesh.position.y - b.r > halfY) {
            b.mesh.visible = false;
            exitedCount++;
          }
        }
      }

      renderer.render(scene, camera);
      // if all bubbles have exited -> stop animating
      if (exitedCount >= bubbles.length) {
        cancelAnimationFrame(raf);
        console.log('All bubbles finished one round 🚀');
      }
    };
    animate();

    // Resize handling
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      unitSphere.dispose();
      material.dispose();
      renderer.dispose();
      const canvas = renderer.domElement;
      if (canvas.parentElement === mount) mount.removeChild(canvas);
      pmrem.dispose();
    };
  }, [count, minR, maxR, minSpeed, maxSpeed]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}
