import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

interface StarProps {
    size: number;
    color: string;
}

const Star: React.FC<StarProps> = ({ size, color }) => {
    const starRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const coronaRef = useRef<THREE.Mesh>(null);
    
    // Pulsing animation
    useEffect(() => {
        if (glowRef.current) {
            gsap.to(glowRef.current.scale, {
                x: 1.1,
                y: 1.1,
                z: 1.1,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            gsap.to(glowRef.current.material, {
                opacity: 0.6,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        if (coronaRef.current) {
            gsap.to(coronaRef.current.rotation, {
                y: Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
        }
    }, []);
    
    // Star rotation
    useFrame((_, delta) => {
        if (starRef.current) {
            starRef.current.rotation.y += delta * 0.1;
        }
    });
    
    return (
        <group>
            {/* Core star */}
            <mesh ref={starRef}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Inner glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[size * 1.2, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent={true}
                    opacity={0.3}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[size * 1.5, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent={true}
                    opacity={0.1}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Corona effect */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[size * 2, 8, 8]} />
                <meshBasicMaterial
                    color={color}
                    wireframe={true}
                    transparent={true}
                    opacity={0.05}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Sparkle effect */}
            <Sparkles
                count={100}
                scale={[size * 4, size * 4, size * 4]}
                size={0.1}
                speed={0.2}
                opacity={0.3}
                color={color}
            />
            
            {/* Point light for illumination */}
            <pointLight color={color} intensity={2} distance={50} decay={2} />
        </group>
    );
};

export default Star;