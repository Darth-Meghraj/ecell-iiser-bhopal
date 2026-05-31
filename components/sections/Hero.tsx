"use client";

import React, { useRef, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";
import { siteConfig } from "@/config/site"; 

// ─────────────────────────────────────────────────────────────────────────────
// Procedural Texture Generator (Thin Lined Hollow Honeycombs)
// ─────────────────────────────────────────────────────────────────────────────
const createTextures = () => {
  if (typeof document === "undefined") return { mapHoney1: null, mapHoney2: null };

  const drawHollowHoneycomb = (
    ctx: CanvasRenderingContext2D,
    hexRadius: number,
    lineWidth: number,
    bgCol: string,
    lineCol: string
  ) => {
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = lineCol;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";

    const hSpacing = hexRadius * Math.sqrt(3);
    const vSpacing = hexRadius * 1.5;

    for (let y = 0; y < 512 + vSpacing; y += vSpacing) {
      const isOffset = Math.round(y / vSpacing) % 2 !== 0;
      for (let x = 0; x < 512 + hSpacing; x += hSpacing) {
        const xPos = isOffset ? x + hSpacing / 2 : x;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = xPos + hexRadius * Math.cos(angle);
          const py = y + hexRadius * Math.sin(angle);
          
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke(); 
      }
    }
  };

  const canvasH1 = document.createElement("canvas");
  canvasH1.width = 512;
  canvasH1.height = 512;
  const ctxH1 = canvasH1.getContext("2d");
  if (ctxH1) {
    drawHollowHoneycomb(
      ctxH1, 
      12, 
      1,  
      "#121e31", 
      "#080d1766" 
    );
  }

  const canvasH2 = document.createElement("canvas");
  canvasH2.width = 512;
  canvasH2.height = 512;
  const ctxH2 = canvasH2.getContext("2d");
  if (ctxH2) {
    drawHollowHoneycomb(
      ctxH2, 
      20, 
      1.5,
      "#1c2d4a", 
      "#080d17"  
    );
  }

  const mapHoney1 = new THREE.CanvasTexture(canvasH1);
  mapHoney1.wrapS = mapHoney1.wrapT = THREE.RepeatWrapping;
  mapHoney1.repeat.set(1.5, 1.5); 

  const mapHoney2 = new THREE.CanvasTexture(canvasH2);
  mapHoney2.wrapS = mapHoney2.wrapT = THREE.RepeatWrapping;
  mapHoney2.repeat.set(1, 1);

  return { mapHoney1, mapHoney2 };
};

// ─────────────────────────────────────────────────────────────────────────────
// Rubik's engine types & Config
// ─────────────────────────────────────────────────────────────────────────────

type Axis  = "x" | "y" | "z";
type Layer = -1 | 0 | 1;
type Dir   =  1 | -1;

interface LayerMove {
  layer: Layer;
  dir: Dir;
}

interface RubikMove {
  axis: Axis;
  moves: LayerMove[];
}

const TIMING_CONFIG = {
  minMoveSpeed: 0.85,
  maxMoveSpeed: 1.3,
  minPause: 0.2,
  maxPause: 0.6,
  userFlickSpeed: 0.5, 
};

const SOLVE_SEQUENCE: RubikMove[] = [
  { axis: "y", moves: [{ layer: 1, dir: 1 }, { layer: -1, dir: -1 }] }, 
  { axis: "x", moves: [{ layer: -1, dir: -1 }] }, 
  { axis: "z", moves: [{ layer: 1, dir: 1 }, { layer: 0, dir: 1 }] }, 
  { axis: "y", moves: [{ layer: 1, dir: -1 }] },
  { axis: "x", moves: [{ layer: 1, dir: 1 }, { layer: -1, dir: -1 }] }, 
  { axis: "z", moves: [{ layer: -1, dir: -1 }] },
  { axis: "y", moves: [{ layer: 0, dir: 1 }, { layer: 1, dir: 1 }] },
  { axis: "x", moves: [{ layer: 1, dir: -1 }] },
  { axis: "y", moves: [{ layer: -1, dir: -1 }, { layer: 1, dir: -1 }] }, 
  { axis: "z", moves: [{ layer: 0, dir: 1 }] },
  { axis: "x", moves: [{ layer: -1, dir: -1 }, { layer: 1, dir: 1 }] }, 
  { axis: "y", moves: [{ layer: -1, dir: 1 }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared Materials Hook
// ─────────────────────────────────────────────────────────────────────────────
const useCubeMaterials = () => {
  return useMemo(() => {
    const { mapHoney1, mapHoney2 } = createTextures();

    const matSmoothDark = new THREE.MeshPhysicalMaterial({
      color: "#121e31", 
      metalness: 0.3,
      roughness: 0.4, 
      clearcoat: 0.1,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.5,
    });

    const matSmoothLight = new THREE.MeshPhysicalMaterial({
      color: "#1c2d4a", 
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.05,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.4,
    });

    const matHollowHoney1 = new THREE.MeshPhysicalMaterial({
      map: mapHoney1,
      bumpMap: mapHoney1, 
      bumpScale: 0.01,
      metalness: 0.3,
      roughness: 0.6,
      clearcoat: 0.1, 
      clearcoatRoughness: 0.5,
      envMapIntensity: 0.4,
    });

    const matHollowHoney2 = new THREE.MeshPhysicalMaterial({
      map: mapHoney2,
      bumpMap: mapHoney2,
      bumpScale: 0.02,
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.05, 
      clearcoatRoughness: 0.6,
      envMapIntensity: 0.3,
    });

    return { matSmoothDark, matSmoothLight, matHollowHoney1, matHollowHoney2 };
  }, []);
};

// ─────────────────────────────────────────────────────────────────────────────
// Cubie Component
// ─────────────────────────────────────────────────────────────────────────────

interface CubieProps {
  initPos: [number, number, number];
  materials: { matSmoothDark: THREE.Material; matSmoothLight: THREE.Material; matHollowHoney1: THREE.Material; matHollowHoney2: THREE.Material };
  onHover: (mesh: THREE.Mesh | null) => void;
}

const Cubie = React.forwardRef<THREE.Mesh, CubieProps>(({ initPos, materials, onHover }, ref) => {
  const faceMaterials = useMemo(() => {
    const pool = [
      materials.matSmoothDark, 
      materials.matSmoothLight, 
      materials.matHollowHoney1, 
      materials.matHollowHoney2
    ];
    const getRandom = () => pool[Math.floor(Math.random() * pool.length)];

    return [
      materials.matSmoothDark, 
      getRandom(),  
      getRandom(),  
      getRandom(),  
      getRandom(),  
      getRandom(),  
    ];
  }, [materials]);

  return (
    <mesh
      ref={ref}
      position={initPos}
      castShadow
      receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerMove={(e) => { e.stopPropagation(); onHover(e.eventObject as THREE.Mesh); }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
    >
      <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.05} smoothness={4} material={faceMaterials} />
    </mesh>
  );
});
Cubie.displayName = "Cubie";

// ─────────────────────────────────────────────────────────────────────────────
// Rubik Engine 
// ─────────────────────────────────────────────────────────────────────────────

interface ActivePivot {
  group: THREE.Group;
  axis: Axis;
  dir: Dir;
  cubies: THREE.Mesh[];
}

function RubikGroup() {
  const outerRef = useRef<THREE.Group>(null!);
  const sceneRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  const cubieRefs = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useCubeMaterials();

  const targetRot  = useRef({ x: 0.35, y: -0.4 });
  const currentRot = useRef({ x: 0.35, y: -0.4 });
  const idleSpin   = useRef(0);

  const moveIdx             = useRef(0);
  const moveTimer           = useRef(0);
  const movePause           = useRef(1.5);
  const currentMoveDuration = useRef(0.35);

  const hoveredCubie     = useRef<THREE.Mesh | null>(null);
  const lastMousePos     = useRef({ x: 0, y: 0 });
  const userQueue        = useRef<RubikMove[]>([]);
  const interactionTimer = useRef(0);
  const isUserMove       = useRef(false);

  const activePivots = useRef<ActivePivot[]>([]);

  const cubieData = useMemo(() => {
    const list: { initPos: [number, number, number] }[] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          list.push({ initPos: [x, y, z] });
        }
    return list;
  }, []);

  const startMove = (move: RubikMove, userInitiated: boolean = false) => {
    if (!sceneRef.current) return;

    const newPivots: ActivePivot[] = [];

    move.moves.forEach((layerMove) => {
      const pivot = new THREE.Group();
      sceneRef.current!.add(pivot);

      const selected: THREE.Mesh[] = [];
      cubieRefs.current.forEach((mesh) => {
        if (!mesh) return;

        const target = new THREE.Vector3();
        mesh.getWorldPosition(target);
        sceneRef.current!.worldToLocal(target);

        const layerCoord = move.axis === "x" ? target.x : move.axis === "y" ? target.y : target.z;

        if (Math.round(layerCoord) === layerMove.layer) {
          selected.push(mesh);
          pivot.attach(mesh);
        }
      });

      newPivots.push({ group: pivot, axis: move.axis, dir: layerMove.dir, cubies: selected });
    });

    activePivots.current = newPivots;
    moveTimer.current    = 0;
    isUserMove.current   = userInitiated;

    if (userInitiated) {
      currentMoveDuration.current = TIMING_CONFIG.userFlickSpeed;
    } else {
      const { minMoveSpeed, maxMoveSpeed } = TIMING_CONFIG;
      currentMoveDuration.current = minMoveSpeed + Math.random() * (maxMoveSpeed - minMoveSpeed);
    }
  };

  const finishMove = () => {
    if (activePivots.current.length === 0 || !sceneRef.current) return;

    activePivots.current.forEach((pivotObj) => {
      const finalAngle = (Math.PI / 2) * pivotObj.dir;
      pivotObj.group.rotation[pivotObj.axis] = finalAngle;
      pivotObj.group.updateMatrixWorld(true);

      pivotObj.cubies.forEach((mesh) => {
        sceneRef.current!.attach(mesh);

        mesh.position.x = Math.round(mesh.position.x);
        mesh.position.y = Math.round(mesh.position.y);
        mesh.position.z = Math.round(mesh.position.z);

        mesh.rotation.x = Math.round(mesh.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
        mesh.rotation.y = Math.round(mesh.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
        mesh.rotation.z = Math.round(mesh.rotation.z / (Math.PI / 2)) * (Math.PI / 2);

        mesh.scale.set(1, 1, 1);
        mesh.updateMatrix();
      });

      sceneRef.current!.remove(pivotObj.group);
    });

    activePivots.current = [];

    if (!isUserMove.current) {
      moveIdx.current = (moveIdx.current + 1) % SOLVE_SEQUENCE.length;
    }

    const { minPause, maxPause } = TIMING_CONFIG;
    movePause.current = minPause + Math.random() * (maxPause - minPause);
  };

  useFrame((_, delta) => {
    idleSpin.current    += delta * 0.05;
    targetRot.current.y  = mouse.x * 1.2 + idleSpin.current;
    targetRot.current.x  = -mouse.y * 1.2 + 0.35;

    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, 0.03);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y, 0.03);

    if (outerRef.current) {
      outerRef.current.rotation.x = currentRot.current.x;
      outerRef.current.rotation.y = currentRot.current.y;
    }

    const deltaX = mouse.x - lastMousePos.current.x;
    const deltaY = mouse.y - lastMousePos.current.y;
    lastMousePos.current.x = mouse.x;
    lastMousePos.current.y = mouse.y;

    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (velocity > 0.008 && hoveredCubie.current) {
      interactionTimer.current = 1.0;

      if (userQueue.current.length === 0 && activePivots.current.length === 0) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        const target = new THREE.Vector3();
        hoveredCubie.current.getWorldPosition(target);
        sceneRef.current.worldToLocal(target);

        let axis: Axis;
        let layer: number;
        let dir: Dir;

        if (isHorizontal) {
          axis = "y";
          layer = Math.round(target.y);
          dir = deltaX > 0 ? 1 : -1;
        } else {
          axis = "x";
          layer = Math.round(target.x);
          dir = deltaY > 0 ? -1 : 1;
        }

        userQueue.current.push({ axis, moves: [{ layer: layer as Layer, dir: dir as Dir }] });
      }
    }

    if (activePivots.current.length > 0) {
      const TARGET_ANGLE = Math.PI / 2;
      
      moveTimer.current += delta;
      const progress = Math.min(moveTimer.current / currentMoveDuration.current, 1);

      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      activePivots.current.forEach((pivotObj) => {
        pivotObj.group.rotation[pivotObj.axis] = ease * TARGET_ANGLE * pivotObj.dir;
      });

      if (progress >= 1) finishMove();
      return;
    }

    if (userQueue.current.length > 0) {
      startMove(userQueue.current.shift()!, true);
      return;
    }

    if (interactionTimer.current > 0) {
      interactionTimer.current -= delta;
      return;
    }

    if (movePause.current > 0) {
      movePause.current -= delta;
      return;
    }

    startMove(SOLVE_SEQUENCE[moveIdx.current], false);
  });

  return (
    <group ref={outerRef}>
      <group ref={sceneRef}>
        {cubieData.map((d, i) => (
          <Cubie
            key={i}
            ref={(el) => { cubieRefs.current[i] = el; }}
            initPos={d.initPos}
            materials={materials}
            onHover={(mesh) => { hoveredCubie.current = mesh; }}
          />
        ))}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lighting & Scene
// ─────────────────────────────────────────────────────────────────────────────

function CubeScene() {
  return (
    <Canvas
      camera={{ position: [0, -1.2, 8.5], fov: 35 }}
      shadows={{ type: THREE.PCFShadowMap }} 
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      resize={{ debounce: 0 }}
    >
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} color="#cbd5e1" />
      
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1.5} 
        color="#e0f2fe" 
        castShadow 
      />
      
      <spotLight 
        position={[-10, -10, -5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1.0} 
        color="#3b82f6" 
      />
      
      <RubikGroup />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-transparent overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at 75% 50%, rgba(14, 30, 56, 0.5) 0%, transparent 60%)" }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 px-6 md:px-12 py-12 pt-24 lg:pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col items-start text-left min-w-0 max-w-2xl pointer-events-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={14} className="text-blue-400" />
              Incubating The Future
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            {/* SEO-optimized visually hidden H1 */}
            <h1 className="sr-only">Entrepreneurship Cell at IISER Bhopal — Student Startup Incubator</h1>
            
            {/* Changed from h1 to h2 for semantic HTML, keeping exact styling */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-white font-serif tracking-tight">
              <span className="block text-white/80 font-light italic">Turn Breakthroughs</span>
              <span className="block font-medium mt-1">Into Businesses.</span>
            </h2>

            <div className="mt-8 flex items-center gap-4">
              {/* Changed from h2 to h3 to follow the h1 -> h2 -> h3 semantic flow */}
              <h3 className="text-lg sm:text-xl text-white/70 font-light tracking-wide">
                At <span className="font-semibold text-white/90">IISER Bhopal</span>
              </h3>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg font-light"
          >
            {/* ✅ SEO FIX: Pulls the keyword-rich text from siteConfig instead of hardcoded string */}
            {siteConfig.hero.subheadline}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            <Link href="#pitch">
              <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-semibold text-sm transition-all hover:bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                Join the E-Cell
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            
            <Link href="#vision">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-white/80 font-medium text-sm hover:border-white/40 hover:text-white hover:bg-white/5 transition-all">
                Vision
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="flex-shrink-0 w-full max-w-[400px] lg:max-w-none lg:w-[400px] xl:w-[450px] aspect-square relative cursor-grab active:cursor-grabbing lg:ml-auto mt-4 lg:mt-0"
        >
          <div className="absolute inset-0 w-full h-full">
            <CubeScene />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 w-full max-w-4xl mx-auto px-6 md:px-12 pb-10 lg:pb-14"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          {siteConfig.hero.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#0f172a]/40 border border-cyan-400/10 rounded-xl py-5 px-3 flex flex-col items-center justify-center backdrop-blur-xl shadow-xl transition-all hover:border-cyan-400/20 hover:bg-[#0f172a]/60"
            >
              <div className="text-2xl sm:text-3xl font-black text-white/90 mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/40 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}