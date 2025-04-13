import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Trail, Sparkles } from "@react-three/drei";
import { gsap } from "gsap";
import { PlanetPositionData } from "@/types/types";
import * as THREE from "three";

interface AsteroidProps {
    id: number;
    position: [number, number, number];
    velocity: [number, number, number];
    planets: PlanetPositionData[];
    onImpact: (id: number) => void;
}

const Asteroid: React.FC<AsteroidProps> = ({
    id,
    position,
    velocity,
    planets,
    onImpact,
}) => {
    const asteroidRef = useRef<THREE.Mesh>(null);
    const [pos, setPos] = useState<[number, number, number]>(position);
    const [vel, setVel] = useState<[number, number, number]>(velocity);
    const [size] = useState(() => Math.random() * 0.2 + 0.1);
    const [impacted, setImpacted] = useState(false);
    const [impactTimer, ] = useState<NodeJS.Timeout | null>(null);
    const [hovered, setHovered] = useState(false);

    // Animation spring for hover effect
    const { scale } = useSpring({
        scale: hovered ? 1.5 : 1.0,
        config: { tension: 300, friction: 10 }
    });

    // Random asteroid rotation
    const rotationSpeed = useRef({
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01,
    });

    // Check for planet collision
    const checkPlanetCollision = () => {
        return planets.some((planet) => {
            const dx = pos[0] - planet.x;
            const dz = pos[2] - planet.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            // If distance is less than combined radii, we have a collision
            if (distance < (planet.size + size)) {
                // Create explosion effect
                createExplosion();
                return true;
            }
            return false;
        });
    };

    // Explosion effect
    const createExplosion = () => {
        if (asteroidRef.current && !impacted) {
            setImpacted(true);
            
            // Scale up quickly then fade out
            gsap.to(asteroidRef.current.scale, {
                x: 3,
                y: 3,
                z: 3,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(asteroidRef.current.material, {
                opacity: 0,
                emissiveIntensity: 2,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    // Notify parent of impact after animation
                    onImpact(id);
                }
            });
            
            // Change color to explosion color
            gsap.to(asteroidRef.current.material, {
                color: "#ff9500",
                emissive: new THREE.Color("#ff5500"),
                duration: 0.2
            });
        }
    };

    useFrame(() => {
        if (asteroidRef.current && !impacted) {
            // Update position
            const newPos: [number, number, number] = [
                pos[0] + vel[0],
                pos[1] + vel[1],
                pos[2] + vel[2]
            ];
            
            setPos(newPos);
            
            // Update mesh position
            asteroidRef.current.position.set(newPos[0], newPos[1], newPos[2]);
            
            // Rotate asteroid for visual interest
            asteroidRef.current.rotation.x += rotationSpeed.current.x;
            asteroidRef.current.rotation.y += rotationSpeed.current.y;
            asteroidRef.current.rotation.z += rotationSpeed.current.z;
            
            // Check for collision with planets
            if (checkPlanetCollision()) {
                return;
            }
            
            // Check boundaries - if asteroid goes too far, bounce it back
            const bound = 15;
            let bounced = false;
            
            if (Math.abs(newPos[0]) > bound) {
                setVel([vel[0] * -0.8, vel[1], vel[2]]);
                bounced = true;
            }
            
            if (Math.abs(newPos[2]) > bound) {
                setVel([vel[0], vel[1], vel[2] * -0.8]);
                bounced = true;
            }
            
            // Add some visual feedback when asteroid bounces off boundary
            if (bounced && asteroidRef.current) {
                gsap.to(asteroidRef.current.scale, {
                    x: 1.5,
                    y: 1.5, 
                    z: 1.5,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    });
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (impactTimer) clearTimeout(impactTimer);
        };
    }, [impactTimer]);
    
    // Random asteroid geometry
    const geomType = Math.floor(Math.random() * 3);
    let geometry;
    
    switch (geomType) {
        case 0:
            geometry = <octahedronGeometry args={[size, 1]} />;
            break;
        case 1:
            geometry = <dodecahedronGeometry args={[size, 0]} />;
            break;
        default:
            geometry = <icosahedronGeometry args={[size, 0]} />;
    }
    
    // Random asteroid color
    const asteroidColor = new THREE.Color().setHSL(
        Math.random() * 0.1 + 0.05, // slight color variation in brown/gray range
        Math.random() * 0.3 + 0.3,  // saturation
        Math.random() * 0.3 + 0.3   // lightness
    );
    
    return (
        <>
            {/* Particle trail */}
            <Trail
                width={2}
                color={new THREE.Color('#ffffff')}
                length={5}
                decay={1}
                local={false}
                stride={0}
                interval={1}
                attenuation={(width) => width}
            >
                <animated.mesh
                    ref={asteroidRef}
                    position={[pos[0], pos[1], pos[2]]}
                    scale={scale}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {geometry}
                    <meshStandardMaterial
                        color={asteroidColor}
                        emissive={impacted ? "#ff5500" : "#000000"}
                        emissiveIntensity={impacted ? 1 : 0}
                        roughness={0.8}
                        metalness={0.2}
                        transparent={impacted}
                        opacity={1}
                    />
                </animated.mesh>
            </Trail>
            
            {/* Sparks for visual interest */}
            <Sparkles
                count={10}
                scale={[size * 3, size * 3, size * 3]}
                position={[pos[0], pos[1], pos[2]]}
                size={0.05}
                speed={0.3}
                color={impacted ? "#ff5500" : "#aaaaff"}
                opacity={impacted ? 1 : 0.5}
            />
        </>
    );
};

export default Asteroid;