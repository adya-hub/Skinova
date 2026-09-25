import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Layers, ShieldCheck, Zap, Info, Compass } from 'lucide-react';

export default function Molecule3DViewer({ initialMolecule = 'salicylic' }) {
  const containerRef = useRef(null);
  const [selectedKey, setSelectedKey] = useState(initialMolecule);
  const [isRotating, setIsRotating] = useState(true);

  const moleculesData = {
    salicylic: {
      name: 'Salicylic Acid (BHA)',
      formula: 'C₇H₆O₃',
      weight: '138.12 g/mol',
      type: 'Lipophilic Beta-Hydroxy Acid',
      penetration: 'Deep Follicular / Sebaceous Glands',
      benefit: 'Dissolves oily impactions within pores, regulates hyperkeratinization, anti-inflammatory.',
      colorTheme: '#58FFC4',
      atoms: [
        // Benzene Ring (6 Carbons)
        { t: 'C', pos: [0, 1.1, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0.95, 0.55, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0.95, -0.55, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0, -1.1, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.95, -0.55, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.95, 0.55, 0], col: 0x495057, r: 0.22 },
        // Carboxylic acid group (-COOH)
        { t: 'C', pos: [1.9, 1.1, 0.1], col: 0x495057, r: 0.22 },
        { t: 'O', pos: [2.5, 0.7, 0.7], col: 0xe63946, r: 0.24 }, // Double bond O
        { t: 'O', pos: [2.2, 2.1, -0.2], col: 0xe63946, r: 0.24 }, // OH
        { t: 'H', pos: [3.0, 2.3, 0.1], col: 0xf8f9fa, r: 0.13 },
        // Hydroxyl group (-OH ortho)
        { t: 'O', pos: [1.9, -1.1, 0.2], col: 0xe63946, r: 0.24 },
        { t: 'H', pos: [2.3, -1.7, -0.1], col: 0xf8f9fa, r: 0.13 },
        // Hydrogens on ring
        { t: 'H', pos: [0, -1.9, 0], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [-1.7, -0.95, 0], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [-1.7, 0.95, 0], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [0, 1.9, 0], col: 0xf8f9fa, r: 0.13 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
        [1, 6], [6, 7], [6, 8], [8, 9],
        [2, 10], [10, 11],
        [3, 12], [4, 13], [5, 14], [0, 15]
      ]
    },
    niacinamide: {
      name: 'Niacinamide (Vitamin B3)',
      formula: 'C₆H₆N₂O',
      weight: '122.12 g/mol',
      type: 'Water-Soluble Bioactive Amide',
      penetration: 'Epidermal & Stratum Basale',
      benefit: 'Stimulates ceramide and filaggrin production, downregulates sebum, brightens hyperpigmentation.',
      colorTheme: '#3A86FF',
      atoms: [
        { t: 'N', pos: [0, 1.0, 0], col: 0x3a86ff, r: 0.23 },
        { t: 'C', pos: [0.85, 0.5, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0.85, -0.5, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0, -1.0, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.85, -0.5, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.85, 0.5, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [1.8, 1.0, 0.2], col: 0x495057, r: 0.22 },
        { t: 'O', pos: [2.5, 0.6, 0.8], col: 0xe63946, r: 0.24 },
        { t: 'N', pos: [2.0, 2.1, -0.3], col: 0x3a86ff, r: 0.23 },
        { t: 'H', pos: [2.7, 2.4, 0.1], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [-1.5, 0.9, 0], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [-1.5, -0.9, 0], col: 0xf8f9fa, r: 0.13 },
        { t: 'H', pos: [0, -1.7, 0], col: 0xf8f9fa, r: 0.13 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
        [1, 6], [6, 7], [6, 8], [8, 9],
        [5, 10], [4, 11], [3, 12]
      ]
    },
    retinol: {
      name: 'All-Trans Retinol (Vitamin A)',
      formula: 'C₂₀H₃₀O',
      weight: '286.45 g/mol',
      type: 'Lipid-Soluble Diterpenoid',
      penetration: 'Deep Dermis Fibroblasts',
      benefit: 'Accelerates cellular mitosis, upregulates collagen I & III gene synthesis, reduces wrinkle depth.',
      colorTheme: '#FFB703',
      atoms: [
        // Beta-ionone ring
        { t: 'C', pos: [-2.2, 0.8, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-1.5, 1.4, 0.2], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.8, 0.7, 0], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.9, -0.6, -0.2], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-1.8, -1.1, -0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-2.5, -0.3, 0.2], col: 0x495057, r: 0.22 },
        // Polyene conjugated chain
        { t: 'C', pos: [0.0, 1.3, 0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0.9, 0.7, -0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [1.7, 1.3, 0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [2.6, 0.7, -0.1], col: 0x495057, r: 0.22 },
        // Terminal alcohol
        { t: 'C', pos: [3.4, 1.3, 0.1], col: 0x495057, r: 0.22 },
        { t: 'O', pos: [4.2, 0.8, 0.4], col: 0xe63946, r: 0.24 },
        { t: 'H', pos: [4.7, 1.3, 0.2], col: 0xf8f9fa, r: 0.13 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
        [2, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12]
      ]
    },
    vitaminc: {
      name: 'L-Ascorbic Acid (Vitamin C)',
      formula: 'C₆H₈O₆',
      weight: '176.12 g/mol',
      type: 'Hydrophilic Powerful Antioxidant',
      penetration: 'Upper Dermis & Epidermal Layer',
      benefit: 'Scavenges free radical reactive oxygen species (ROS), co-factor for prolyl hydroxylase in collagen.',
      colorTheme: '#FB8500',
      atoms: [
        // Furanone ring
        { t: 'O', pos: [0, 0.9, 0], col: 0xe63946, r: 0.24 },
        { t: 'C', pos: [0.9, 0.3, 0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [0.6, -0.8, -0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.6, -0.8, -0.1], col: 0x495057, r: 0.22 },
        { t: 'C', pos: [-0.9, 0.3, 0.1], col: 0x495057, r: 0.22 },
        // Carbonyl and enediol hydroxyls
        { t: 'O', pos: [1.9, 0.6, 0.4], col: 0xe63946, r: 0.24 },
        { t: 'O', pos: [1.2, -1.8, 0], col: 0xe63946, r: 0.24 },
        { t: 'O', pos: [-1.2, -1.8, 0], col: 0xe63946, r: 0.24 },
        // Dihydroxyethyl tail
        { t: 'C', pos: [-2.0, 0.9, 0.2], col: 0x495057, r: 0.22 },
        { t: 'O', pos: [-2.8, 0.4, 0.8], col: 0xe63946, r: 0.24 },
        { t: 'C', pos: [-2.3, 2.1, -0.3], col: 0x495057, r: 0.22 },
        { t: 'O', pos: [-3.3, 2.5, 0.3], col: 0xe63946, r: 0.24 }
      ],
      bonds: [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
        [1, 5], [2, 6], [3, 7],
        [4, 8], [8, 9], [8, 10], [10, 11]
      ]
    }
  };

  const currentMol = moleculesData[selectedKey] || moleculesData.salicylic;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);

    const dl1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dl1.position.set(5, 5, 5);
    scene.add(dl1);

    const dl2 = new THREE.DirectionalLight(0x80ed99, 1.5);
    dl2.position.set(-5, -5, -3);
    scene.add(dl2);

    // Molecule Group
    const molGroup = new THREE.Group();
    scene.add(molGroup);

    // Orbiting halo
    const haloGeom = new THREE.TorusGeometry(2.4, 0.015, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x48e5b4,
      transparent: true,
      opacity: 0.35
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    scene.add(halo);

    const renderMoleculeModel = (data) => {
      while (molGroup.children.length > 0) {
        molGroup.remove(molGroup.children[0]);
      }

      data.atoms.forEach((atm) => {
        const geom = new THREE.SphereGeometry(atm.r, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: atm.col,
          roughness: 0.25,
          metalness: 0.2,
          emissive: atm.col,
          emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(...atm.pos);
        molGroup.add(mesh);
      });

      data.bonds.forEach(([a, b]) => {
        if (!data.atoms[a] || !data.atoms[b]) return;
        const posA = new THREE.Vector3(...data.atoms[a].pos);
        const posB = new THREE.Vector3(...data.atoms[b].pos);
        const dist = posA.distanceTo(posB);
        const geom = new THREE.CylinderGeometry(0.045, 0.045, dist, 12);
        const mat = new THREE.MeshStandardMaterial({ color: 0xadb5bd, roughness: 0.4 });
        const bond = new THREE.Mesh(geom, mat);

        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        bond.position.copy(mid);
        bond.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(posB, posA).normalize()
        );
        molGroup.add(bond);
      });
    };

    renderMoleculeModel(currentMol);

    // Interaction Drag
    let isDown = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    const onDown = (e) => {
      isDown = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDown = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDown && isRotating) {
        rotY += 0.006;
      }

      molGroup.rotation.y += (rotY - molGroup.rotation.y) * 0.1;
      molGroup.rotation.x += (rotX - molGroup.rotation.x) * 0.1;

      halo.rotation.x = elapsed * 0.2;
      halo.rotation.y = elapsed * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedKey, isRotating]);

  return (
    <div
      className="card card-hover"
      style={{
        background: 'linear-gradient(145deg, #0e1e17 0%, #152b21 100%)',
        border: '1px solid rgba(88, 255, 196, 0.25)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow orb background */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(64, 224, 180, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#58FFC4',
              background: 'rgba(88, 255, 196, 0.12)',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Sparkles size={11} /> 3D FORMULATION LAB
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            {currentMol.name}
          </h3>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            Formula: <strong style={{ color: '#58FFC4' }}>{currentMol.formula}</strong> · Molecular Wt: {currentMol.weight}
          </div>
        </div>

        {/* Molecule Pill Selectors */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.keys(moleculesData).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              style={{
                background: selectedKey === key ? 'linear-gradient(135deg, #2D5A46 0%, #4FA37D 100%)' : 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: selectedKey === key ? '1px solid #58FFC4' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 11px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {key === 'salicylic' && 'Salicylic (BHA)'}
              {key === 'niacinamide' && 'Niacinamide (B3)'}
              {key === 'retinol' && 'Retinol (Vit A)'}
              {key === 'vitaminc' && 'Vitamin C'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.25)' }}>
        <div ref={containerRef} style={{ width: '100%', height: '320px', cursor: 'grab' }} />

        {/* Atom Key */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 20, 15, 0.85)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#495057' }} /> Carbon
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E63946' }} /> Oxygen
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3A86FF' }} /> Nitrogen
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F8F9FA' }} /> Hydrogen
          </span>
        </div>

        {/* Drag Hint */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Compass size={12} /> Drag to rotate 3D bonds
        </div>
      </div>

      {/* Mechanism & Penetration Card */}
      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          fontSize: '12.5px'
        }}
      >
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#58FFC4', fontWeight: 600, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} /> Penetration Depth
          </div>
          <div style={{ color: '#FFFFFF' }}>{currentMol.penetration}</div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#58FFC4', fontWeight: 600, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} /> Cutaneous Action
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{currentMol.benefit}</div>
        </div>
      </div>
    </div>
  );
}
