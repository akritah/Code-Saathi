'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore - external modules don’t have types
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// @ts-ignore
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

interface ThreeJSLogoProps {
  onLoadComplete?: () => void;
}

export default function ThreeJSLogo({ onLoadComplete }: ThreeJSLogoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Group to hold text
    const textGroup = new THREE.Group();
    scene.add(textGroup);

    // Load font and create 3D text
    const fontLoader = new FontLoader();
    fontLoader.load(
      "/fonts/helvetiker_regular.typeface.json",
      (font) => {
        console.log("✅ Font loaded!");
        const textGeometry = new TextGeometry("Code-Saathi", {
          font,
          size: 1,
           depth: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.04,
          bevelSegments: 5,
        });
        textGeometry.center();

        // Main text
        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0x00d4ff,
          emissive: 0x003344,
          shininess: 120,
        });


        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
         textMesh.scale.set(0.2, 0.2, 0.2);
    textMesh.position.set(0, 0, 0);

        // Glowing edges
        const edges = new THREE.EdgesGeometry(textGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
        const edgeLines = new THREE.LineSegments(edges, lineMaterial);

        textGroup.add(textMesh);
        textGroup.add(edgeLines);
      },
      undefined,
      (err) => {
        console.error("Font failed to load:", err);
        // Fallback: rotating box
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(3, 1, 0.3),
          new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        textGroup.add(box);
      }
    );

    // Lights
    scene.add(new THREE.AmbientLight(0x404040, 0.8));
    const directional = new THREE.DirectionalLight(0x00d4ff, 1.2);
    directional.position.set(5, 5, 5);
    scene.add(directional);

    const point = new THREE.PointLight(0xff00ff, 1, 20);
    point.position.set(-5, -3, 3);
    scene.add(point);

    // Animation
    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;

      // Rotate & float
      textGroup.rotation.y = elapsed * 0.0015;
      textGroup.rotation.x = Math.sin(elapsed * 0.001) * 0.2;
      textGroup.position.y = Math.sin(elapsed * 0.002) * 0.3;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);

      // Finish after 3s
      if (elapsed > 3000 && onLoadComplete) {
        setTimeout(onLoadComplete, 1000);
      }
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      {/* Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading overlay */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-gray-300 text-lg">Find your dream dev team</p>
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    </div>
  );
}
