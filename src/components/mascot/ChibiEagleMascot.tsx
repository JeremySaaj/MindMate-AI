/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useMascotStore } from '../../store/mascotStore';
import { MascotMode } from '../../types/mascot';

// The 3D Eagle model component
function ChibiEagle() {
  const mode = useMascotStore((state) => state.mode);
  const sizeLevel = useMascotStore((state) => state.sizeLevel);
  const glowLevel = useMascotStore((state) => state.glowLevel);
  const fitnessStage = useMascotStore((state) => state.bodyFitnessStage);

  // Mesh/Group refs for animating specific body parts
  const eagleGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const beakLowerRef = useRef<THREE.Mesh>(null);
  const beakUpperRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  
  // Custom sweat state and food/dumbbell visibility
  const [showSweat, setShowSweat] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showDumbbells, setShowDumbbells] = useState(false);

  // Sync state variables to mode triggers
  useEffect(() => {
    setShowSweat(mode === 'stressed');
    setShowFood(mode === 'idleEating');
    setShowDumbbells(mode === 'quizWorkout');
  }, [mode]);

  // Frame animation loop to keep 60FPS fluid motions
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (!eagleGroupRef.current) return;

    // Base properties starting points
    let posY = 0;
    let scaleX = 1;
    let scaleY = 1;
    let scaleZ = 1;
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    let lWingRotZ = -0.4;
    let rWingRotZ = 0.4;
    let lWingRotY = 0;
    let rWingRotY = 0;

    let eyeScaleY = 1; // Used for blinking/sleeping eyelids

    // 1. Temporary Animation Profiles based on MascotMode
    switch (mode) {
      case 'idleSleeping':
        // Slow rocking respiratory breath
        posY = Math.sin(elapsed * 1.5) * 0.05 - 0.1;
        scaleY = 1 + Math.sin(elapsed * 1.5) * 0.03;
        rotZ = Math.sin(elapsed * 0.8) * 0.05; // slow tilt
        rotX = 0.1; // Head downward slight tilt
        lWingRotZ = -0.15;
        rWingRotZ = 0.15;
        eyeScaleY = 0.08; // sleepy slits
        break;

      case 'idleEating':
        // Tiny chewing horizontal wiggle and slow mouth breathing
        posY = Math.sin(elapsed * 4.0) * 0.02 - 0.1;
        lWingRotZ = -0.6 + Math.sin(elapsed * 6.0) * 0.1; // holding food trigger
        rWingRotZ = 0.6 - Math.sin(elapsed * 6.0) * 0.1;
        
        // Jaws moving up and down chew chew
        if (beakLowerRef.current) {
          beakLowerRef.current.position.y = -0.05 - Math.abs(Math.sin(elapsed * 12.0)) * 0.08;
        }
        break;

      case 'stressed':
        // Shaking, panicking jitter
        posY = -0.1 + Math.sin(elapsed * 50) * 0.02;
        rotZ = Math.cos(elapsed * 60) * 0.04;
        lWingRotZ = -0.8 + Math.sin(elapsed * 20) * 0.2;
        rWingRotZ = 0.8 - Math.sin(elapsed * 20) * 0.2;
        eyeScaleY = 0.6; // widened anxious look
        break;

      case 'quizWorkout':
        // Jumping jacks: vertical movement synchronized with wing flaps
        const workCycle = Math.sin(elapsed * 7.5);
        posY = Math.abs(workCycle) * 0.25 - 0.1;
        lWingRotZ = -0.4 + workCycle * 0.7;
        rWingRotZ = 0.4 - workCycle * 0.7;
        lWingRotY = workCycle * 0.3;
        rWingRotY = -workCycle * 0.3;
        break;

      case 'congratulating':
        // Huge ecstatic circular bounces
        const happyCycle = Math.sin(elapsed * 12.0);
        posY = Math.abs(happyCycle) * 0.5 - 0.05;
        scaleY = 1.0 - Math.max(0, -happyCycle) * 0.15; // stretch squish
        rotY = elapsed * 4.0; // spinning joyfully!
        lWingRotZ = -1.2 + Math.sin(elapsed * 25.0) * 0.4;
        rWingRotZ = 1.2 - Math.sin(elapsed * 25.0) * 0.4;
        break;

      case 'supportive':
        // Gentle comforting swaying
        posY = Math.sin(elapsed * 2.5) * 0.03 - 0.1;
        rotZ = Math.sin(elapsed * 2.5) * 0.08;
        lWingRotZ = -0.3 + Math.sin(elapsed * 2.5) * 0.1;
        rWingRotZ = 0.3 - Math.sin(elapsed * 2.5) * 0.1;
        break;

      case 'active':
      default:
        // Default micro-bounce breathe
        posY = Math.sin(elapsed * 3.0) * 0.03 - 0.05;
        scaleY = 1.0 + Math.sin(elapsed * 3.0) * 0.015;
        lWingRotZ = -0.4 + Math.sin(elapsed * 3.0) * 0.05;
        rWingRotZ = 0.4 - Math.sin(elapsed * 3.0) * 0.05;
        break;
    }

    // 2. Adjust physical appearance based on Persistent bodyFitnessStage
    // Fitness stages slightly broaden or buffer the chibi character, or add a slight heroic angle
    let fitnessScaleX = 1;
    let fitnessScaleZ = 1;
    if (fitnessStage === 2) {
      fitnessScaleX = 1.05;
      fitnessScaleZ = 1.02;
    } else if (fitnessStage === 3) {
      fitnessScaleX = 1.12;
      fitnessScaleZ = 1.05;
    } else if (fitnessStage >= 4) {
      fitnessScaleX = 1.18;
      fitnessScaleZ = 1.10;
    }

    // 3. Commit translations & scales to refs
    eagleGroupRef.current.position.y = posY;
    
    // Apply final size = sizeLevel (eating) * animation scale * fitness Stage body buffer
    eagleGroupRef.current.scale.set(
      sizeLevel * scaleX * fitnessScaleX,
      sizeLevel * scaleY,
      sizeLevel * scaleZ * fitnessScaleZ
    );
    
    eagleGroupRef.current.rotation.set(rotX, rotY, rotZ);

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = lWingRotZ;
      leftWingRef.current.rotation.y = lWingRotY;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = rWingRotZ;
      rightWingRef.current.rotation.y = rWingRotY;
    }

    // Blink eyes slightly on active modes (random intervals)
    if (mode !== 'idleSleeping') {
      const isBlinking = Math.floor(elapsed % 4) === 0 && (elapsed % 4 < 0.15);
      const targetEyeScale = isBlinking ? 0.1 : 1.0;
      eyeScaleY = THREE.MathUtils.lerp(eyeScaleY, targetEyeScale, 0.4);
    }

    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;

    // Sweat dropping translation
    const sweat0 = eagleGroupRef.current.getObjectByName('sweat-drop-0');
    const sweat1 = eagleGroupRef.current.getObjectByName('sweat-drop-1');
    if (sweat0 && sweat1 && mode === 'stressed') {
      const dripY = 0.35 - ((elapsed * 1.5) % 0.8);
      sweat0.position.y = dripY;
      sweat1.position.y = dripY;
    }
  });

  // Calculate emissive head glow representing active learning points
  const activeGlowIntensity = Math.max(0.1, glowLevel * 0.8);

  return (
    <group>
      {/* Lights inside the canvas wrapper for vivid highlights */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} castShadow />
      <pointLight position={[-2, -1, -2]} intensity={0.5} />

      {/* R3F Sparles particle effect overlay with customizable color for congratulating level */}
      {mode === 'congratulating' && (
        <Sparkles count={40} scale={2} size={6} speed={1.5} color="#fbbf24" />
      )}

      {/* COMPONENT BODY CONSTRUCTION */}
      <group ref={eagleGroupRef} position={[0, -0.1, 0]}>
        
        {/* Future .glb container loading target placement anchor comments:
            If importing GLTF, load from "/src/assets/eagle_mascot.glb"
            and assign animations from model hooks inside react-three-fiber */}

        {/* 1. Large cute chibi head */}
        <mesh ref={headRef} position={[0, 0.35, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.54, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.2}
            emissive={new THREE.Color('#cbd5e1')}
            emissiveIntensity={activeGlowIntensity}
          />
        </mesh>

        {/* 2. Beak Upper & Lower (for eating chew movements) */}
        <group position={[0, 0.22, 0.46]}>
          <mesh ref={beakUpperRef} castShadow>
            <coneGeometry args={[0.10, 0.18, 4]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              roughness={0.3} 
              // Point cone forward
            />
          </mesh>
          <mesh ref={beakLowerRef} position={[0, -0.05, 0.02]} castShadow>
            <coneGeometry args={[0.07, 0.12, 4]} />
            <meshStandardMaterial color="#d97706" roughness={0.3} />
          </mesh>
        </group>

        {/* 3. High quality responsive Eyes */}
        <group ref={leftEyeRef} position={[-0.18, 0.42, 0.4]}>
          {/* Eye background (white) */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Pupil (black) */}
          <mesh position={[0.01, 0.01, 0.04]} castShadow>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Shiny Highlight */}
          <mesh position={[-0.02, 0.03, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group ref={rightEyeRef} position={[0.18, 0.42, 0.4]}>
          {/* Eye background (white) */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Pupil (black) */}
          <mesh position={[-0.01, 0.01, 0.04]} castShadow>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Shiny Highlight */}
          <mesh position={[0.02, 0.03, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 4. Small red shirt body */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <sphereGeometry args={[0.38, 32, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} /> {/* Red Shirt */}
        </mesh>

        {/* Trobeez Badge Logo on shirt */}
        <mesh position={[0, -0.20, 0.32]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.14, 0.07]} />
          <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>

        {/* Super Learner confidence emblem for fitness stage 4 */}
        {fitnessStage >= 4 && (
          <mesh position={[0.12, -0.15, 0.3]} scale={[0.06, 0.06, 0.06]}>
            <octahedronGeometry />
            <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.8} />
          </mesh>
        )}

        {/* 5. Left wing & Right wing */}
        <mesh ref={leftWingRef} position={[-0.44, -0.16, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} /> {/* Brown Wings */}
        </mesh>

        <mesh ref={rightWingRef} position={[0.44, -0.16, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>

        {/* 6. Yellow legs and cute feet box-pads */}
        <group position={[-0.14, -0.52, 0]}>
          {/* Leg cylinder */}
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.14]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Foot pad */}
          <mesh position={[0, -0.07, 0.05]} castShadow>
            <boxGeometry args={[0.09, 0.04, 0.12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.3} />
          </mesh>
        </group>

        <group position={[0.14, -0.52, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.14]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, -0.07, 0.05]} castShadow>
            <boxGeometry args={[0.09, 0.04, 0.12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.3} />
          </mesh>
        </group>

        {/* ====== CONDITIONAL PROPS IN GROUP ====== */}

        {/* Food item (Apple) when idleEating */}
        {showFood && (
          <group position={[0, -0.15, 0.34]}>
            {/* Apple body */}
            <mesh castShadow>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.2} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.04]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
        )}

        {/* Dumbbells when training/working out */}
        {showDumbbells && (
          <group>
            {/* Left dumbbell */}
            <group position={[-0.56, -0.1, 0.1]} rotation={[0, 0, 1.5]}>
              <mesh castShadow><cylinderGeometry args={[0.014, 0.014, 0.22]} /><meshStandardMaterial color="#7f8c8d" /></mesh>
              <mesh position={[0, 0.11, 0]} castShadow><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#2c3e50" roughness={0.8} /></mesh>
              <mesh position={[0, -0.11, 0]} castShadow><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#2c3e50" roughness={0.8} /></mesh>
            </group>
            {/* Right dumbbell */}
            <group position={[0.56, -0.1, 0.1]} rotation={[0, 0, -1.5]}>
              <mesh castShadow><cylinderGeometry args={[0.014, 0.014, 0.22]} /><meshStandardMaterial color="#7f8c8d" /></mesh>
              <mesh position={[0, 0.11, 0]} castShadow><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#2c3e50" roughness={0.8} /></mesh>
              <mesh position={[0, -0.11, 0]} castShadow><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#2c3e50" roughness={0.8} /></mesh>
            </group>
          </group>
        )}

        {/* Sweat Drop Meshes during stress */}
        {showSweat && (
          <group>
            <mesh name="sweat-drop-0" position={[-0.38, 0.35, 0.2]} scale={[0.03, 0.06, 0.03]}>
              <sphereGeometry />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.8} />
            </mesh>
            <mesh name="sweat-drop-1" position={[0.38, 0.35, 0.2]} scale={[0.03, 0.06, 0.03]}>
              <sphereGeometry />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.8} />
            </mesh>
          </group>
        )}

      </group>
    </group>
  );
}

interface ChibiEagleMascotProps {
  mode: MascotMode;
}

export default function ChibiEagleMascot({ mode }: ChibiEagleMascotProps) {
  return (
    <div className="w-full h-full relative" id="mascot-three-container">
      {/* 3D Canvas wrapper */}
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ChibiEagle />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={1.0} 
          maxPolarAngle={1.8} 
        />
      </Canvas>
      
      {/* 2D HTML absolute animations matching 3D triggers */}
      {mode === 'idleSleeping' && (
        <div className="absolute top-2 left-4 pointer-events-none text-slate-400 font-bold select-none animate-bounce text-sm flex gap-1 z-10">
          <span className="delay-100 duration-1000 animate-pulse text-xs">Z</span>
          <span className="delay-300 duration-1000 animate-pulse text-sm">z</span>
          <span className="delay-500 duration-1000 animate-pulse text-base">z</span>
          <span className="text-[10px] select-none ml-1">😴</span>
        </div>
      )}

      {mode === 'idleEating' && (
        <div className="absolute top-1 right-2 pointer-events-none text-xs text-rose-500 font-semibold select-none z-10 animate-pulse">
          *Crunch* *Chew* 🍎
        </div>
      )}
    </div>
  );
}
