import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Planet } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ChevronLeft, Maximize2 } from 'lucide-react';
import * as THREE from 'three';

// Meteor Background Component
const MeteorBackground = () => {
  const [meteors, setMeteors] = useState<{ id: number, x: number, y: number, speed: number }[]>([]);

  useEffect(() => {
    const createMeteors = () => {
      const newMeteors = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50,
        speed: Math.random() * 5 + 2
      }));
      setMeteors(newMeteors);
    };

    createMeteors();
    const interval = setInterval(createMeteors, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {meteors.map(meteor => (
        <div
          key={meteor.id}
          className="absolute w-[2px] h-[50px] bg-white/50 opacity-70 animate-meteor"
          style={{
            left: `${meteor.x}px`,
            top: `${meteor.y}px`,
            animationDuration: `${meteor.speed}s`
          }}
        />
      ))}
    </div>
  );
};

// Dynamic Card Size Hook
const useDynamicCardSize = () => {
  return useMemo(() => {
    const sizes = [
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1'
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }, []);
};

const TexturedModel = ({ gltfModel, thumbnail }: { gltfModel: string, thumbnail: string }) => {
  const { scene } = useGLTF(gltfModel);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(thumbnail);
  }, [thumbnail]);

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} scale={[1, 1, 1]} />;
};

const PlanetInfo: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { planetName } = useParams<{ planetName: string }>();

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('/celestial_bodies.json');
        if (!response.ok) {
          throw new Error('Failed to fetch planets');
        }
        const data = await response.json();
        setPlanets(data.planets);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };
    fetchPlanets();
  }, []);

  const planet = planets.find(p => p.name === planetName);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#0d1117] text-white">
        <div className="animate-pulse text-2xl">Loading cosmic details...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Cosmic Error: {error}</div>;
  }

  if (!planet) {
    return <div className="text-white">Planet not found in the universe</div>;
  }

  const PlanetFeatureCard: React.FC<{ title: string, value: string }> = ({ title, value }) => {
    const cardSize = useDynamicCardSize();
    return (
      <Card
        className={`${cardSize} bg-[#1a2027]/60 backdrop-blur-sm border-[#22272e] border-2 shadow-2xl transform transition-all hover:scale-105`}
      >
        <CardHeader>
          <CardTitle className="text-xl text-white/80">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-white font-bold text-lg">
          <p>{value}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white overflow-hidden">
      <MeteorBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 bg-[#1a2027] text-white rounded-full p-2 hover:bg-[#22272e] transition-colors"
        >
          <ChevronLeft />
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {planet.name}
          </h1>
          <p className="text-xl mt-4 max-w-3xl mx-auto text-white/80">
            {planet.smallDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="w-full aspect-square bg-[#1a2027]/50 rounded-2xl overflow-hidden">
              <Canvas camera={{ position: [0, 4, 0], near: 0.1, far: 1000 }}>
                <OrbitControls enableZoom={true} maxDistance={100} minDistance={0.1} />
                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <TexturedModel thumbnail={planet.thumbnail} gltfModel={planet.gltfModel} />
                </Suspense>
              </Canvas>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute bottom-4 right-4 bg-[#1a2027] text-white p-2 rounded-full hover:bg-[#22272e] transition-colors">
                  <Maximize2 />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-full w-[95vw] h-[95vh] bg-[#0d1117] rounded-2xl overflow-hidden p-0">
                <DialogHeader />
                <div className="relative w-full h-full">
                  <Canvas
                    camera={{ position: [0, 5, 0], near: 0.1, far: 1000 }}
                  >
                    <OrbitControls enableZoom={true} maxDistance={100} minDistance={1} />
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <Suspense fallback={null}>
                      <TexturedModel thumbnail={planet.thumbnail} gltfModel={planet.gltfModel} />
                    </Suspense>
                  </Canvas>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-[#1a2027]/60 backdrop-blur-sm border-[#22272e] border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">About {planet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">{planet.largeDescription}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <PlanetFeatureCard title="Radius" value={`${planet.radius} km`} />
          <PlanetFeatureCard title="Mass" value={`${planet.mass} kg`} />
          <PlanetFeatureCard title="Volume" value={`${planet.volume} km³`} />
          <PlanetFeatureCard title="Circumference" value={`${planet.circumference} km`} />
          <PlanetFeatureCard title="Orbital Speed" value={`${planet.orbitalSpeed} km/s`} />
          <PlanetFeatureCard title="Time to Orbit" value={`${planet.timeToOrbit} days`} />
          <PlanetFeatureCard title="Closest Star" value={planet.closestStar.name} />
          <PlanetFeatureCard
            title="Distance to Closest Star"
            value={`${planet.closestStar.proximity} million km`}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;

