import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. GERANDO AS BOLINHAS FORA DO COMPONENTE
const TOTAL_BOLINHAS = 20;
const CORES_DISPONIVEIS = ['#ff4d4d', '#4da6ff', '#33cc33', '#ffcc00', '#cc66ff', '#ff9933'];

const dadosBolinhasEstaticas = Array.from({ length: TOTAL_BOLINHAS }).map(() => ({
  posicao: new THREE.Vector3(
    (Math.random() - 0.5) * 1.4,
    (Math.random() - 0.5) * 1.4,
    (Math.random() - 0.5) * 1.4
  ),
  cor: CORES_DISPONIVEIS[Math.floor(Math.random() * CORES_DISPONIVEIS.length)]
}));

function Bolinhas() {
  const meshRef = useRef();

  useFrame((state) => {
    const tempo = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = tempo * 0.5;
      meshRef.current.rotation.x = tempo * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {dadosBolinhasEstaticas.map((bola, index) => (
        <mesh key={index} position={bola.posicao}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={bola.cor} roughness={0.1} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function Globo3D() {
  return (
    <div style={{ width: '100%', height: '300px', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 60 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-5, -5, -5]} intensity={1} />

        {/* O Globo de Vidro Principal */}
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.25}
            roughness={0}
            transmission={0.6}
            thickness={0.5}
            clearcoat={1.0}
          />
        </mesh>

        {/* Suporte/Base do Globo */}
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.2, 32]} />
          <meshStandardMaterial color="#444444" roughness={0.4} />
        </mesh>

        {/* Renderiza as bolinhas */}
        <Bolinhas />

        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
