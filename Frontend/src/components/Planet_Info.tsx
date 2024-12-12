import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Planet } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const PlanetInfo: React.FC = () => {
  const [planets, setPlanets] = useState < Planet[] > ([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState < string | null > (null);
  const { planetName } = useParams < { planetName: string } > ();

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
    return <div>Loading planet details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!planet) {
    return <div>Planet not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#0d1117] to-[#161b22] text-white p-4">
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 px-4 py-2 bg-[#1a2027] text-white rounded hover:bg-[#22272e]"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold mb-4 text-center">{planet.name}</h1>
      <p className="text-lg mb-8 text-center max-w-3xl">{planet.smallDescription}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-[400px] bg-gradient-to-b from-[#1a2027] to-[#161b22] rounded-lg shadow-lg">
            <Canvas camera={{ position: [0, 0, 10], near: 0.1, far: 1000 }}>
              <PerspectiveCamera makeDefault />
              <OrbitControls />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              {/* <Gltf src={planet.gltfModel} /> */}
            </Canvas>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>About {planet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{planet.largeDescription}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-5xl">
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Radius</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.radius} km</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Mass</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.mass} kg</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.volume} km³</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Circumference</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.circumference} km</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Orbital Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.orbitalSpeed} km/s</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Time to Orbit</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.timeToOrbit} Earth days</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Closest Star</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.closestStar.name}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a2027]/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Distance to Closest Star</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{planet.closestStar.proximity} million km</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanetInfo;

