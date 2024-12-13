// @ts-nocheck

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SimulationParameters } from '../../types'

interface Props {
  parameters: SimulationParameters
}

export default function EcosystemVisualization({ parameters }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Set up scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth * 0.75, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Add planet
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshPhongMaterial({
      color: 0x33aa33,
      shininess: 0.5,
    })
    const planet = new THREE.Mesh(geometry, material)
    scene.add(planet)

    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32)
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaff,
      transparent: true,
      opacity: 0.2,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Add light
    const light = new THREE.PointLight(0xffffff, 1, 100)
    light.position.set(10, 10, 10)
    scene.add(light)

    // Set up camera and controls
    camera.position.z = 15
    const controls = new OrbitControls(camera, renderer.domElement)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      planet.rotation.y += 0.005
      atmosphere.rotation.y += 0.003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Clean up
    return () => {
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Update visualization based on parameters
  useEffect(() => {
    // TODO: Implement parameter-based updates to the visualization
    console.log('Updating visualization with parameters:', parameters)
  }, [parameters])

  return <div ref={mountRef} />
}

