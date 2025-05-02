import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import "../CSS/Simulation.css";

const Simulation = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gravityExoplanet, setGravityExoplanet] = useState(-4.5);
  const [isRunning, setIsRunning] = useState(false);
  const [customGravity, setCustomGravity] = useState("");
  const timeStep = 0.016;
  const initialHeight = 20;
  let timeElapsed = 0;
  let earthSphere: THREE.Mesh | undefined,
    exoplanetSphere: THREE.Mesh | undefined,
    animationFrameId: number | undefined;

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1f);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x4287f5,
      shininess: 90,
      emissive: 0x1a4c94,
      emissiveIntensity: 0.2,
    });
    const exoplanetMaterial = new THREE.MeshPhongMaterial({
      color: 0x9c42f5,
      shininess: 90,
      emissive: 0x4a1a94,
      emissiveIntensity: 0.2,
    });

    earthSphere = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthSphere.position.set(-3, initialHeight, 0);
    earthSphere.castShadow = true;
    scene.add(earthSphere);

    exoplanetSphere = new THREE.Mesh(sphereGeometry, exoplanetMaterial);
    exoplanetSphere.position.set(3, initialHeight, 0);
    exoplanetSphere.castShadow = true;
    scene.add(exoplanetSphere);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x404040, 0x404040);
    scene.add(gridHelper);

    camera.position.set(0, 17, 30);
    camera.lookAt(0, 10, 0);

    // Mount renderer and start basic animation
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRunning) {
        const earthFallDistance = 0.5 * -9.8 * Math.pow(timeElapsed, 2);
        const exoplanetFallDistance =
          0.5 * gravityExoplanet * Math.pow(timeElapsed, 2);

        if (earthSphere) {
          earthSphere.position.y = Math.max(
            initialHeight + earthFallDistance,
            0
          );
        }
        if (exoplanetSphere) {
          exoplanetSphere.position.y = Math.max(
            initialHeight + exoplanetFallDistance,
            0
          );
        }

        if (
          earthSphere &&
          exoplanetSphere &&
          earthSphere.position.y <= 0 &&
          exoplanetSphere.position.y <= 0
        ) {
          timeElapsed = 0;
          earthSphere.position.y = initialHeight;
          exoplanetSphere.position.y = initialHeight;
        }

        timeElapsed += timeStep;
      }

      // Always rotate spheres for visual interest, even when not running
      if (earthSphere && exoplanetSphere) {
        earthSphere.rotation.x += 0.01;
        exoplanetSphere.rotation.x += 0.01;
      }

      renderer.render(scene, camera);
    };

    // Start animation immediately
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [gravityExoplanet, isRunning]);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10 p-4 px-8 bg-[rgba(20,20,50,0.8)] backdrop-blur-lg border border-[rgba(255,255,255,0.2)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] rounded-2xl m-2">
        <h1 className="text-[1.75rem] font-bold mb-2 bg-gradient-to-r from-[#00f3ff] to-[#8000ff] text-transparent bg-clip-text">
          Gravity Simulator Pro
        </h1>
        <p className="text-[0.9rem] text-[#a0aec0] mb-6">
          Compare gravitational effects across celestial bodies
        </p>
        <div className="flex flex-col flex-wrap gap-4 items-stretch md:flex-row md:items-center sm:flex-col sm:items-stretch">
          <div className="flex flex-col gap-2">
            <label htmlFor="gravitySelect">Select Celestial Body</label>
            <select
              id="gravitySelect"
              onChange={(e) => setGravityExoplanet(parseFloat(e.target.value))}
              defaultValue="-4.5"
            >
              <option value="-1.6">Moon (1.6 m/s²)</option>
              <option value="-4.5">Exoplanet (4.5 m/s²)</option>
              <option value="-9.8">Earth (9.8 m/s²)</option>
              <option value="-24.8">Jupiter (24.8 m/s²)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="customGravityInput">Custom Gravity (m/s²)</label>
            <input
              type="number"
              id="customGravityInput"
              placeholder="Enter value..."
              value={customGravity}
              onChange={(e) => setCustomGravity(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              if (!isNaN(parseFloat(customGravity))) {
                setGravityExoplanet(parseFloat(customGravity));
              }
            }}
          >
            Apply
          </button>
          <button onClick={() => setIsRunning(true)}>Run</button>
          <button onClick={() => setIsRunning(false)}>Stop</button>
        </div>
      </div>
      <div className="fixed bottom-8 flex gap-4 items-center justify-center w-full">
        <div className="planet-info-card">
          <div className="planet-name">Earth</div>
          <div className="planet-info">
            <p>Gravity: 9.8 m/s²</p>
            <p>Reference planet for comparison</p>
          </div>
        </div>
        <div className="planet-info-card">
          <div className="planet-name">Variable Planet</div>
          <div className="planet-info">
            <p>Gravity: Variable</p>
            <p>Adjustable gravity for comparison</p>
          </div>
        </div>
      </div>
      <div ref={mountRef} />
    </div>
  );
};

export default Simulation;
