import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Skinova3DHero({ onHotspotClick }) {
  const { perfMode } = useApp();
  const containerRef = useRef(null);
  const [activeMode, setActiveMode] = useState('face'); // 'face' | 'dermal' | 'molecule'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeMolecule, setActiveMolecule] = useState('niacinamide');
  const [isInteracting, setIsInteracting] = useState(false);

  const activeModeRef = useRef(activeMode);
  const activeMoleculeRef = useRef(activeMolecule);
  const onHotspotClickRef = useRef(onHotspotClick);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    activeMoleculeRef.current = activeMolecule;
  }, [activeMolecule]);

  useEffect(() => {
    onHotspotClickRef.current = onHotspotClick;
  }, [onHotspotClick]);

  // Hotspots data for the 3D Face Scan mode
  const hotspotsData = [
    {
      id: 'forehead',
      name: 'Forehead & Glabella',
      zone: 'Upper T-Zone',
      metrics: { sebum: 'Balanced (44%)', barrier: '92% Healthy', texture: 'Smooth', need: 'Hydration Mist' },
      position: [0, 1.25, 1.2]
    },
    {
      id: 'rightCheek',
      name: 'Malar Cheek (Right)',
      zone: 'Lateral Dermis',
      metrics: { redness: 'Mild Flush (12%)', hydration: '89%', barrier: 'Optimal', need: 'Centella / Cica' },
      position: [1.2, 0.2, 0.9]
    },
    {
      id: 'leftCheek',
      name: 'Malar Cheek (Left)',
      zone: 'Lateral Dermis',
      metrics: { redness: 'Minimal (6%)', hydration: '94%', barrier: 'Intact', need: 'Ceramides' },
      position: [-1.2, 0.2, 0.9]
    },
    {
      id: 'nose',
      name: 'Nasal Apex & Ala',
      zone: 'Central Congestion Zone',
      metrics: { pores: 'Mildly Visible', sebum: 'Moderate (68%)', clarity: 'Good', need: '2% BHA (Salicylic)' },
      position: [0, 0.05, 1.55]
    },
    {
      id: 'chin',
      name: 'Mental Region (Chin)',
      zone: 'Hormonal Baseline',
      metrics: { breakouts: 'Zero Active', elasticity: 'High', turnover: 'Standard', need: 'Zinc PCA' },
      position: [0, -1.2, 1.1]
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f1c16, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    const isSmooth = perfMode === 'smooth';
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSmooth,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    // In Smooth Mode, cap to 1.0 (saving 75% GPU fragment overhead on high-DPI). In Enhanced, cap to 1.5.
    renderer.setPixelRatio(isSmooth ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xd4eee2, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x5b8e7d, 2.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa5d6b8, 1.5);
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    const cyanLight = new THREE.PointLight(0x40e0d0, 2.5, 9);
    cyanLight.position.set(0, 2, 2.5);
    scene.add(cyanLight);

    // Root Group for interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Background Particle Cloud (Adaptive count)
    const particleCount = isSmooth ? 60 : 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x68b394,
      size: 0.055,
      transparent: true,
      opacity: isSmooth ? 0.4 : 0.55,
      blending: THREE.AdditiveBlending
    });
    const bgParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(bgParticles);

    // -------------------------------------------------------------
    // BUILD MODE 1: 3D Holographic Head / Skin Biometric Model
    // -------------------------------------------------------------
    const faceGroup = new THREE.Group();
    rootGroup.add(faceGroup);

    // Organic Facioid Wireframe + Points Geometry
    const headGeom = new THREE.SphereGeometry(1.6, 32, 28);
    const pos = headGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Morph into a stylized sculpted head geometry
      const headDist = Math.sqrt(x * x + y * y + z * z);
      // Taper the jaw / chin
      if (y < -0.2) {
        const factor = 1 + (y * 0.32);
        x *= Math.max(factor, 0.55);
        z *= Math.max(factor * 1.1, 0.7);
      }
      // Forehead roundness
      if (y > 0.5) {
        z *= 1.05;
        x *= 0.98;
      }
      // Cheekbone projection
      if (y > -0.2 && y < 0.6 && z > 0) {
        z += 0.18 * (1 - Math.abs(x - 0.9));
      }
      // Nose bridge protrusion
      if (Math.abs(x) < 0.35 && y > -0.3 && y < 0.4 && z > 0.8) {
        z += 0.38 * (1 - Math.abs(x) / 0.35);
      }
      pos.setXYZ(i, x, y, z);
    }
    headGeom.computeVertexNormals();

    // Wireframe Mesh (Holographic Green)
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5a46,
      emissive: 0x1f4735,
      emissiveIntensity: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.3
    });
    const faceMesh = new THREE.Mesh(headGeom, wireMaterial);
    faceGroup.add(faceMesh);

    // Luminous Hologram Inner Shell (Optimized lightweight shader without transmission multi-pass)
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x58ffc4,
      emissive: 0x1f4735,
      emissiveIntensity: 0.38,
      transparent: true,
      opacity: 0.22,
      roughness: 0.3,
      blending: THREE.AdditiveBlending
    });
    const innerGeom = headGeom.clone().scale(0.97, 0.97, 0.97);
    const glowInnerMesh = new THREE.Mesh(innerGeom, glowMaterial);
    faceGroup.add(glowInnerMesh);

    // Glowing Vertex Dots
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x48e5b4,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const facePoints = new THREE.Points(headGeom, dotMaterial);
    faceGroup.add(facePoints);

    // Vertical Laser Scanning Ring
    const scanRingGeom = new THREE.TorusGeometry(1.85, 0.02, 16, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x58ffc4,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    faceGroup.add(scanRing);

    // Orbiting Data Ring
    const orbitRingGeom = new THREE.RingGeometry(2.1, 2.14, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x3d7b5f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    orbitRing.rotation.y = Math.PI / 6;
    faceGroup.add(orbitRing);

    // Hotspots 3D Meshes
    const hotspotMeshes = [];
    hotspotsData.forEach((hs) => {
      const hsGroup = new THREE.Group();
      hsGroup.position.set(...hs.position);

      // Core pulsating sphere
      const coreGeom = new THREE.SphereGeometry(0.09, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x55ffc0,
        transparent: true,
        opacity: 0.95
      });
      const core = new THREE.Mesh(coreGeom, coreMat);
      hsGroup.add(core);

      // Halo ring
      const ringGeom = new THREE.RingGeometry(0.12, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2ae8a4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      hsGroup.add(ring);

      hsGroup.userData = { id: hs.id, data: hs, ring };
      faceGroup.add(hsGroup);
      hotspotMeshes.push(hsGroup);
    });

    // -------------------------------------------------------------
    // BUILD MODE 2: Dermal Cellular Matrix (Bilayer & Aquaporin Spheres)
    // -------------------------------------------------------------
    const dermalGroup = new THREE.Group();
    rootGroup.add(dermalGroup);
    dermalGroup.visible = false;

    // Stratum Corneum lipid bilayer spheres (Adaptive count)
    const dermalCount = isSmooth ? 36 : 75;
    const dermalSpheres = [];
    const sphereGeom = new THREE.SphereGeometry(0.18, isSmooth ? 12 : 16, isSmooth ? 12 : 16);

    for (let i = 0; i < dermalCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.35 + (Math.random() - 0.5) * 0.45;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const isWater = Math.random() > 0.6;
      const dMat = new THREE.MeshStandardMaterial({
        color: isWater ? 0x48cae4 : 0x52b788,
        emissive: isWater ? 0x0077b6 : 0x2d6a4f,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.82
      });
      const dMesh = new THREE.Mesh(sphereGeom, dMat);
      dMesh.position.set(x, y, z);
      dMesh.userData = {
        basePos: [x, y, z],
        speed: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      };
      dermalGroup.add(dMesh);
      dermalSpheres.push(dMesh);
    }

    // Connective Collagen / Elastin Helix Mesh
    const curvePoints = [];
    for (let i = 0; i < 70; i++) {
      const angle = i * 0.25;
      const y = (i - 35) * 0.055;
      const radius = 1.1 + Math.sin(i * 0.3) * 0.2;
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const helixCurve = new THREE.CatmullRomCurve3(curvePoints);
    const helixGeom = new THREE.TubeGeometry(helixCurve, isSmooth ? 45 : 75, 0.04, 6, false);
    const helixMat = new THREE.MeshStandardMaterial({
      color: 0x80ed99,
      emissive: 0x38b000,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });
    const helixMesh = new THREE.Mesh(helixGeom, helixMat);
    dermalGroup.add(helixMesh);

    // -------------------------------------------------------------
    // BUILD MODE 3: 3D Bioactive Molecule (Niacinamide / Hyaluronic Acid)
    // -------------------------------------------------------------
    const moleculeGroup = new THREE.Group();
    rootGroup.add(moleculeGroup);
    moleculeGroup.visible = false;

    // Molecular configurations (Atoms & Covalent Bonds)
    const molecules = {
      niacinamide: {
        name: 'Niacinamide (Vitamin B3)',
        formula: 'C₆H₆N₂O',
        benefit: 'Sebum regulation · Barrier ceramide synthesis · Pore refining',
        atoms: [
          // Pyridine ring: 5 carbons, 1 nitrogen
          { type: 'N', pos: [0, 0.9, 0], col: 0x3a86ff, r: 0.22 },
          { type: 'C', pos: [0.75, 0.45, 0], col: 0x495057, r: 0.24 },
          { type: 'C', pos: [0.75, -0.45, 0], col: 0x495057, r: 0.24 },
          { type: 'C', pos: [0, -0.9, 0], col: 0x495057, r: 0.24 },
          { type: 'C', pos: [-0.75, -0.45, 0], col: 0x495057, r: 0.24 },
          { type: 'C', pos: [-0.75, 0.45, 0], col: 0x495057, r: 0.24 },
          // Amide group attached at C3
          { type: 'C', pos: [1.65, 0.95, 0.2], col: 0x495057, r: 0.24 },
          { type: 'O', pos: [2.35, 0.55, 0.8], col: 0xe63946, r: 0.25 },
          { type: 'N', pos: [1.85, 2.0, -0.2], col: 0x3a86ff, r: 0.22 },
          // Hydrogen markers
          { type: 'H', pos: [-1.4, 0.8, 0], col: 0xf8f9fa, r: 0.14 },
          { type: 'H', pos: [-1.4, -0.8, 0], col: 0xf8f9fa, r: 0.14 },
          { type: 'H', pos: [0, -1.6, 0], col: 0xf8f9fa, r: 0.14 },
          { type: 'H', pos: [1.4, -0.8, 0], col: 0xf8f9fa, r: 0.14 },
          { type: 'H', pos: [2.6, 2.3, 0.1], col: 0xf8f9fa, r: 0.14 }
        ],
        bonds: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
          [1, 6], [6, 7], [6, 8],
          [5, 9], [4, 10], [3, 11], [2, 12], [8, 13]
        ]
      },
      hyaluronic: {
        name: 'Hyaluronic Acid Segment',
        formula: '(C₁₄H₂₁NO₁₁)ₙ',
        benefit: 'Draws 1000x weight in water · Plumps extracellular matrix',
        atoms: [
          { type: 'O', pos: [-1.6, 0, 0], col: 0xe63946, r: 0.25 },
          { type: 'C', pos: [-1.0, 0.8, 0.2], col: 0x495057, r: 0.24 },
          { type: 'C', pos: [-0.2, 0.7, -0.4], col: 0x495057, r: 0.24 },
          { type: 'O', pos: [0.3, 1.4, 0], col: 0xe63946, r: 0.25 },
          { type: 'C', pos: [0.6, -0.1, -0.2], col: 0x495057, r: 0.24 },
          { type: 'O', pos: [1.4, -0.1, 0.5], col: 0xe63946, r: 0.25 },
          { type: 'C', pos: [-0.3, -0.8, 0.3], col: 0x495057, r: 0.24 },
          { type: 'N', pos: [-0.7, -1.8, -0.1], col: 0x3a86ff, r: 0.22 },
          { type: 'C', pos: [0.2, -2.5, -0.3], col: 0x495057, r: 0.24 },
          { type: 'O', pos: [1.2, -2.4, 0.3], col: 0xe63946, r: 0.25 }
        ],
        bonds: [
          [0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [6, 1], [6, 7], [7, 8], [8, 9]
        ]
      }
    };

    const buildMolecule = (molKey) => {
      // Clear existing
      while (moleculeGroup.children.length > 0) {
        moleculeGroup.remove(moleculeGroup.children[0]);
      }

      const mol = molecules[molKey] || molecules.niacinamide;
      const atomMeshes = [];

      mol.atoms.forEach((atm) => {
        const aGeom = new THREE.SphereGeometry(atm.r, 20, 20);
        const aMat = new THREE.MeshStandardMaterial({
          color: atm.col,
          roughness: 0.2,
          metalness: 0.3,
          emissive: atm.col,
          emissiveIntensity: 0.25
        });
        const mesh = new THREE.Mesh(aGeom, aMat);
        mesh.position.set(...atm.pos);
        moleculeGroup.add(mesh);
        atomMeshes.push(mesh);
      });

      // Bonds as cylinders
      mol.bonds.forEach(([idxA, idxB]) => {
        const posA = new THREE.Vector3(...mol.atoms[idxA].pos);
        const posB = new THREE.Vector3(...mol.atoms[idxB].pos);
        const dist = posA.distanceTo(posB);
        const bondGeom = new THREE.CylinderGeometry(0.045, 0.045, dist, 12);
        const bondMat = new THREE.MeshStandardMaterial({
          color: 0xced4da,
          roughness: 0.4
        });
        const bondMesh = new THREE.Mesh(bondGeom, bondMat);

        // Position and orient cylinder halfway between atoms
        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        bondMesh.position.copy(mid);
        bondMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(posB, posA).normalize()
        );
        moleculeGroup.add(bondMesh);
      });
    };

    buildMolecule(activeMoleculeRef.current);

    // -------------------------------------------------------------
    // Mouse Interaction & Raycasting
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.05;
    let targetRotationY = -0.2;

    const handlePointerDown = (e) => {
      isMouseDown = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.007;
        targetRotationX += deltaY * 0.007;
        // Limit pitch
        targetRotationX = Math.max(-0.8, Math.min(0.8, targetRotationX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const handleClick = () => {
      if (activeModeRef.current !== 'face') return;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        hotspotMeshes.map((g) => g.children[0]),
        false
      );
      if (intersects.length > 0) {
        const parentGroup = intersects[0].object.parent;
        if (parentGroup && parentGroup.userData.data) {
          setSelectedHotspot(parentGroup.userData.data);
          if (onHotspotClickRef.current) onHotspotClickRef.current(parentGroup.userData.data);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('click', handleClick);

    // -------------------------------------------------------------
    // Performance-Aware Animation Loop (Intersection & Tab Visibility)
    // -------------------------------------------------------------
    let animationFrameId = null;
    let clock = new THREE.Clock();
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth damping rotation
      if (!isMouseDown) {
        targetRotationY += isSmooth ? 0.0025 : 0.0035; // Gentle auto-rotate
      }
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

      const currentMode = activeModeRef.current;

      // Mode-specific animations
      if (currentMode === 'face') {
        // Laser scan oscillation
        scanRing.position.y = Math.sin(elapsed * 1.8) * 1.3;
        scanRing.rotation.z = elapsed * 0.6;
        orbitRing.rotation.z = -elapsed * 0.25;

        // Hotspots pulsing
        hotspotMeshes.forEach((hs, i) => {
          const ring = hs.userData.ring;
          const s = 1 + Math.sin(elapsed * 4 + i) * 0.22;
          ring.scale.set(s, s, s);
          // Face camera
          hs.quaternion.copy(camera.quaternion);
        });

      } else if (currentMode === 'dermal') {
        dermalSpheres.forEach((d) => {
          const [bx, by] = d.userData.basePos;
          d.position.x = bx + Math.sin(elapsed * d.userData.speed + d.userData.phase) * 0.08;
          d.position.y = by + Math.cos(elapsed * d.userData.speed + d.userData.phase) * 0.08;
        });
        helixMesh.rotation.y = elapsed * 0.4;

      } else if (currentMode === 'molecule') {
        moleculeGroup.rotation.y = elapsed * 0.5;
        moleculeGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.25;
      }

      // Background particle drift
      bgParticles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    const animate = () => {
      if (!isIntersecting || !isTabVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      renderFrame();
    };

    const startAnimation = () => {
      if (!animationFrameId && isIntersecting && isTabVisible) {
        clock.start();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Pause rendering when scrolled out of view (saves ~95% GPU when user is reading down the page)
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Pause rendering when browser tab is inactive
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Save references for mode updates
    container._updateMode = (mode) => {
      faceGroup.visible = mode === 'face';
      dermalGroup.visible = mode === 'dermal';
      moleculeGroup.visible = mode === 'molecule';
      if (!animationFrameId) renderer.render(scene, camera);
    };
    container._updateMolecule = (m) => {
      buildMolecule(m);
      if (!animationFrameId) renderer.render(scene, camera);
    };

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      // Deep WebGL resource cleanup
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [perfMode]);

  // Update modes inside existing Three.js context
  useEffect(() => {
    if (containerRef.current?._updateMode) {
      containerRef.current._updateMode(activeMode);
    }
  }, [activeMode]);

  useEffect(() => {
    if (containerRef.current?._updateMolecule) {
      containerRef.current._updateMolecule(activeMolecule);
    }
  }, [activeMolecule]);

  return (
    <div className="hero-3d-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      {/* 3D Glass Card Container */}
      <div
        className="glass-card-3d"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 30%, rgba(36, 75, 58, 0.16) 0%, rgba(18, 38, 29, 0.42) 100%), #0D1813',
          border: '1px solid rgba(91, 142, 125, 0.35)',
          boxShadow: '0 20px 50px rgba(10, 25, 18, 0.35), 0 0 35px rgba(64, 224, 180, 0.12)'
        }}
      >
        {/* Top HUD Bar */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 30, 23, 0.82)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(88, 255, 196, 0.3)',
              fontSize: '12px',
              color: '#58FFC4',
              fontWeight: 600,
              letterSpacing: '0.04em'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#58FFC4',
                boxShadow: '0 0 8px #58FFC4',
                animation: 'pulse 1.4s infinite'
              }}
            />
            <span>3D LIVE DERMAL ENGINE</span>
          </div>

          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.65)',
              background: 'rgba(15, 30, 23, 0.6)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            60 FPS · WebGL 2.0
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '460px',
            cursor: isInteracting ? 'grabbing' : 'grab'
          }}
        />

        {/* Floating Hotspot Telemetry Card (When user clicks node) */}
        {selectedHotspot && activeMode === 'face' && (
          <div
            style={{
              position: 'absolute',
              bottom: '76px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 28, 22, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(88, 255, 196, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              color: '#FFFFFF',
              zIndex: 15,
              animation: 'fadeIn 0.25s ease-out',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#58FFC4', boxShadow: '0 0 8px #58FFC4' }} />
                <strong style={{ fontSize: '13.5px', color: '#58FFC4' }}>{selectedHotspot.name}</strong>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  {selectedHotspot.zone}
                </span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', fontSize: '12px' }}>
              {Object.entries(selectedHotspot.metrics).map(([key, val]) => (
                <div key={key} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 10px', borderRadius: '6px' }}>
                  <div style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', fontSize: '10.5px' }}>{key}</div>
                  <div style={{ fontWeight: 600, color: '#E8F5EE' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode Selector HUD Pills */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            zIndex: 10,
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              display: 'flex',
              background: 'rgba(12, 24, 18, 0.88)',
              backdropFilter: 'blur(10px)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <button
              onClick={() => { setActiveMode('face'); setSelectedHotspot(null); }}
              className="btn btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 13px',
                fontSize: '11.5px',
                fontWeight: 600,
                background: activeMode === 'face' ? 'linear-gradient(135deg, #2D5A46 0%, #468669 100%)' : 'transparent',
                color: activeMode === 'face' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                border: 'none',
                boxShadow: activeMode === 'face' ? '0 2px 8px rgba(45, 90, 70, 0.5)' : 'none'
              }}
            >
              👤 Dermal Biometrics
            </button>

            <button
              onClick={() => { setActiveMode('dermal'); setSelectedHotspot(null); }}
              className="btn btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 13px',
                fontSize: '11.5px',
                fontWeight: 600,
                background: activeMode === 'dermal' ? 'linear-gradient(135deg, #2D5A46 0%, #468669 100%)' : 'transparent',
                color: activeMode === 'dermal' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                border: 'none',
                boxShadow: activeMode === 'dermal' ? '0 2px 8px rgba(45, 90, 70, 0.5)' : 'none'
              }}
            >
              🧬 Cellular Matrix
            </button>

            <button
              onClick={() => { setActiveMode('molecule'); setSelectedHotspot(null); }}
              className="btn btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 13px',
                fontSize: '11.5px',
                fontWeight: 600,
                background: activeMode === 'molecule' ? 'linear-gradient(135deg, #2D5A46 0%, #468669 100%)' : 'transparent',
                color: activeMode === 'molecule' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                border: 'none',
                boxShadow: activeMode === 'molecule' ? '0 2px 8px rgba(45, 90, 70, 0.5)' : 'none'
              }}
            >
              ⚗️ 3D Formulation
            </button>
          </div>

          {/* Secondary Sub-control */}
          {activeMode === 'molecule' ? (
            <div
              style={{
                display: 'flex',
                background: 'rgba(12, 24, 18, 0.88)',
                padding: '3px 6px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                gap: '4px'
              }}
            >
              <button
                onClick={() => setActiveMolecule('niacinamide')}
                style={{
                  background: activeMolecule === 'niacinamide' ? '#2D5A46' : 'transparent',
                  color: '#FFF',
                  border: 'none',
                  fontSize: '10.5px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                B3 (Niacinamide)
              </button>
              <button
                onClick={() => setActiveMolecule('hyaluronic')}
                style={{
                  background: activeMolecule === 'hyaluronic' ? '#2D5A46' : 'transparent',
                  color: '#FFF',
                  border: 'none',
                  fontSize: '10.5px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                HA (Hyaluronic)
              </button>
            </div>
          ) : (
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Compass size={12} />
              <span>Drag to inspect in 3D</span>
            </div>
          )}
        </div>
      </div>

      {/* Under-canvas Interactive Legend */}
      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          padding: '0 6px'
        }}
      >
        <span>💡 Click any glowing node to view cutaneous layer biometrics</span>
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Skinova 3D Dermal Core</span>
      </div>
    </div>
  );
}
