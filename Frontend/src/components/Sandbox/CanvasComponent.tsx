import { OrbitControls, Stars, Text } from "@react-three/drei";
import Star from "./Star";
import Planet from "./Planet";
import Asteroid from "./Asteroid";
import { Canvas } from "@react-three/fiber";
import { CanvasProps } from "@/types/types";

const CanvasComponent = ({ asteroids, planets, planetPositions, handleAsteroidImpact, updatePlanetPosition, handlePlanetClick, selectedPlanetId }: CanvasProps) => {
    return (
        <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
            <fog attach="fog" args={['#070710', 20, 40]} />
            <OrbitControls
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.05}
            />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#fff8e0" />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* Enhanced background stars */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0.5}
                fade
            />

            {/* Central star with glow effect */}
            <Star size={3} color="yellow" />

            {/* Asteroid belt visualization */}
            {asteroids.map((asteroid) => (
                <Asteroid
                    key={asteroid.id}
                    id={asteroid.id}
                    position={asteroid.position}
                    velocity={asteroid.velocity}
                    planets={planetPositions}
                    onImpact={handleAsteroidImpact}
                />
            ))}

            {/* Render planets with enhanced visuals */}
            {planets.map((planet, index) => (
                <Planet
                    key={planet.id}
                    planetData={planet}
                    index={index}
                    updatePlanetPosition={updatePlanetPosition}
                    onPlanetClick={handlePlanetClick}
                    isSelected={selectedPlanetId === planet.id}
                />
            ))}

            {/* Text labels in 3D space */}
            <Text
                position={[0, 5, 0]}
                color="white"
                fontSize={0.5}
                anchorX="center"
                anchorY="middle"
            >
                SOLAR SYSTEM
            </Text>
        </Canvas>
    )
}

export default CanvasComponent