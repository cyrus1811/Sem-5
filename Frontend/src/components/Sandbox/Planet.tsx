import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SandboxPlanetData } from "@/types/types";

interface PlanetProps {
    planetData: SandboxPlanetData;
    index: number;
    updatePlanetPosition: (index: number, x: number, z: number) => void;
    onPlanetClick: (id: number) => void;
    isSelected: boolean;
}

const Planet = ({
    planetData,
    index,
    updatePlanetPosition,
    onPlanetClick,
    isSelected
}: PlanetProps) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const orbitRef = useRef<THREE.Line>(null);
    const moonRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Mesh>(null);

    const texturePaths: Record<string, string> = {};
    if (planetData.texture) texturePaths.map = planetData.texture;
    if (planetData.bumpMap) texturePaths.bumpMap = planetData.bumpMap;
    if (planetData.specularMap) texturePaths.specularMap = planetData.specularMap;
    if (planetData.cloudTexture) texturePaths.cloudsMap = planetData.cloudTexture;
    if (planetData.moons?.[0]?.texture) texturePaths.moonMap = planetData.moons[0].texture;
    if (planetData.moons?.[0]?.bumpMap) texturePaths.moonBumpMap = planetData.moons[0].bumpMap;

    const textures = useTexture(texturePaths) as Record<string, THREE.Texture>;

    const planetMaterial = useMemo(() => {
        if (planetData.texture) {
            return new THREE.MeshStandardMaterial({
                map: textures.map,
                bumpMap: textures.bumpMap,
                bumpScale: 0.05,
                metalness: 0.1,
                roughness: 0.8,
            });
        } else {
            return new THREE.MeshStandardMaterial({
                color: planetData.color,
                metalness: 0.1,
                roughness: 0.8
            });
        }
    }, [planetData.texture, planetData.color, textures]);


    const moonMaterial = useMemo(() => {
        if (planetData.moons?.[0]?.texture) {
            return new THREE.MeshStandardMaterial({
                map: textures.moonMap,
                bumpMap: textures.moonBumpMap,
                bumpScale: 0.03,
                metalness: 0.1,
                roughness: 0.8,
            });
        } else {
            return new THREE.MeshStandardMaterial({
                color: planetData.moons?.[0]?.color || "#aaaaaa",
                metalness: 0.1,
                roughness: 0.8
            });
        }
    }, [planetData.moons, textures]);

    const cloudMaterial = useMemo(() => {
        if (textures.cloudsMap) {
            return new THREE.MeshStandardMaterial({
                map: textures.cloudsMap,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
            });
        }
        return null;
    }, [textures.cloudsMap]);

    const atmosphereMaterial = useMemo(() => {
        if (planetData.hasAtmosphere) {
            return new THREE.MeshStandardMaterial({
                color: new THREE.Color(planetData.color).lerp(new THREE.Color("#ffffff"), 0.5),
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide,
            });
        }
        return null;
    }, [planetData.hasAtmosphere, planetData.color]);

    const ringMaterial = useMemo(() => {
        if (planetData.hasRings) {
            return new THREE.MeshStandardMaterial({
                color: planetData.ringColor || "#a8a8a8",
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
            });
        }
        return null;
    }, [planetData.hasRings, planetData.ringColor]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const orbitSpeed = planetData.speed * 0.1;
        const orbitRadius = planetData.distance;
        const planetX = Math.sin(time * orbitSpeed) * orbitRadius;
        const planetZ = Math.cos(time * orbitSpeed) * orbitRadius;

        if (planetRef.current) {
            planetRef.current.position.set(planetX, 0, planetZ);
            planetRef.current.rotation.y += 0.005;

            updatePlanetPosition(index, planetX, planetZ);

            if (cloudsRef.current) {
                cloudsRef.current.position.copy(planetRef.current.position);
                cloudsRef.current.rotation.y += 0.007;
            }

            if (atmosphereRef.current) {
                atmosphereRef.current.position.copy(planetRef.current.position);
            }

            if (moonRef.current && planetData.moons?.[0]) {
                const moonSpeed = planetData.moons[0].speed * 0.5;
                const moonDistance = planetData.moons[0].distance;

                const moonX = Math.sin(time * moonSpeed) * moonDistance;
                const moonZ = Math.cos(time * moonSpeed) * moonDistance;

                moonRef.current.position.set(planetX + moonX, 0, planetZ + moonZ);
                moonRef.current.rotation.y += 0.01;
            }

            if (ringsRef.current && planetData.hasRings) {
                ringsRef.current.position.copy(planetRef.current.position);
                ringsRef.current.rotation.x = Math.PI / 6;
            }
        }
    });

    const orbitLine = useMemo(() => {
        const orbitGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const radius = planetData.distance;
        const segments = 128;

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            vertices.push(Math.sin(theta) * radius, 0, Math.cos(theta) * radius);
        }

        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return orbitGeometry;
    }, [planetData.distance]);

    return (
        <>
            <primitive
                ref={orbitRef}
                object={new THREE.Line(orbitLine, new THREE.LineBasicMaterial({
                    color: "#ffffff",
                    transparent: true,
                    opacity: 0.2
                }))}
            />
            
            <mesh
                ref={planetRef}
                onClick={() => onPlanetClick(planetData.id)}
                scale={isSelected ? [1.1, 1.1, 1.1] : [1, 1, 1]}
                material={planetMaterial}
            >
                <sphereGeometry args={[planetData.size, 32, 32]} />
                {isSelected && (
                    <mesh>
                        <sphereGeometry args={[planetData.size * 1.05, 32, 32]} />
                        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
                    </mesh>
                )}
            </mesh>

            {planetData.cloudTexture && cloudMaterial && (
                <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]} material={cloudMaterial}>
                    <sphereGeometry args={[planetData.size, 32, 32]} />
                </mesh>
            )}

            {planetData.hasAtmosphere && atmosphereMaterial && (
                <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]} material={atmosphereMaterial}>
                    <sphereGeometry args={[planetData.size, 32, 32]} />
                </mesh>
            )}

            {planetData.hasRings && ringMaterial && (
                <mesh ref={ringsRef} material={ringMaterial}>
                    <ringGeometry
                        args={[
                            planetData.ringInnerRadius || planetData.size * 1.5,
                            planetData.ringOuterRadius || planetData.size * 2.5,
                            64
                        ]}
                    />
                </mesh>
            )}

            {planetData.moons?.[0] && (
                <mesh ref={moonRef} material={moonMaterial}>
                    <sphereGeometry args={[planetData.moons[0].size, 16, 16]} />
                </mesh>
            )}
        </>
    );
};

export default Planet;