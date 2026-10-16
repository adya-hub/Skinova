import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Shield, Droplets, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SkinLayer3DExplorer() {
  const { perfMode } = useApp();
  const containerRef = useRef(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const selectedLayerRef = useRef(selectedLayerIndex);

  useEffect(() => {
    selectedLayerRef.current = selectedLayerIndex;
  }, [selectedLayerIndex]);

  const layersInfo = [
    {
      name: 'Stratum Corneum (Skin Barrier)',
      depth: '10–20 μm',
      role: 'Protective lipid matrix & acid mantle',
      keyComponents: 'Ceramides (50%), Cholesterol (25%), Free Fatty Acids (15%)',
      activesWorkHere: 'Ceramides, Squalane, Petrolatum, High-MW Hyaluronic Acid',
      color: 0x48cae4,
      desc: 'The outermost defensive shield preventing transepidermal water loss (TEWL) and pathogen ingress.'
    },
    {
      name: 'Viable Epidermis',
      depth: '50–100 μm',
      role: 'Cellular differentiation & melanin regulation',
      keyComponents: 'Keratinocytes, Melanocytes, Langerhans immune cells',
      activesWorkHere: 'Niacinamide, Azelaic Acid, Salicylic Acid (BHA), Vitamin C',
      desc: 'Dynamic living layer with a 28-day turnover cycle responsible for skin tone and smoothness.'
    },
    {
      name: 'Dermis (Collagen & Elastin Matrix)',
      depth: '1–4 mm',
      role: 'Structural elasticity, bounce & firming',
      keyComponents: 'Type I & III Collagen, Elastin fibers, Glycosaminoglycans (GAGs)',
      activesWorkHere: 'Retinol / Retinoids, Copper Peptides, Low-MW Hyaluronic Acid',
      desc: 'The dense fibrous scaffold produced by fibroblasts giving skin youthfulness and tensile resilience.'
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 340;
    const isSmooth = perfMode === 'smooth';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSmooth,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSmooth ? 1 : Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0xa5ffd6, 2.0);
    dir1.position.set(4, 6, 4);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x70c1b3, 1.2);
    dir2.position.set(-4, -2, -3);
    scene.add(dir2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Create 3 stacked cross-section slabs representing skin layers
    const layerMeshes = [];
    const layerConfigs = [
      { y: 0.65, height: 0.28, color: 0x58ffc4, em: 0x1f5c43, opacity: 0.9 }, // Corneum
      { y: 0.05, height: 0.48, color: 0x48cae4, em: 0x1b4965, opacity: 0.85 }, // Epidermis
      { y: -0.75, height: 0.75, color: 0x9b5de5, em: 0x3c096c, opacity: 0.8 }  // Dermis
    ];

    layerConfigs.forEach((cfg, idx) => {
      const slabGeom = new THREE.BoxGeometry(3.2, cfg.height, 2.2);
      const slabMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.em,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: cfg.opacity
      });
      const slab = new THREE.Mesh(slabGeom, slabMat);
      slab.position.y = cfg.y;

      // Add wireframe edge highlights
      const edges = new THREE.EdgesGeometry(slabGeom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
      const wire = new THREE.LineSegments(edges, lineMat);
      slab.add(wire);

      slab.userData = { index: idx, baseHeight: cfg.y };
      rootGroup.add(slab);
      layerMeshes.push(slab);
    });

    // Floating Bioactive Drops entering the skin (Adaptive count)
    const dropCount = isSmooth ? 8 : 16;
    const dropGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const drops = [];
    for (let i = 0; i < dropCount; i++) {
      const dropMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x58ffc4 : 0x00f5d4,
        transparent: true,
        opacity: 0.85
      });
      const drop = new THREE.Mesh(dropGeom, dropMat);
      drop.position.set(
        (Math.random() - 0.5) * 2.6,
        1.2 + Math.random() * 0.8,
        (Math.random() - 0.5) * 1.8
      );
      drop.userData = { speed: 0.015 + Math.random() * 0.02, minY: -1.2, startY: 1.8 };
      rootGroup.add(drop);
      drops.push(drop);
    }

    // Interactive Drag
    let isDown = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = 0.4;
    let targetRotX = 0.2;

    const onDown = (e) => {
      isDown = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      targetRotX = Math.max(-0.4, Math.min(0.6, targetRotX));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => { isDown = false; };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let frameId = null;
    let clock = new THREE.Clock();
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const render = () => {
      const elapsed = clock.getElapsedTime();

      if (!isDown) {
        targetRotY += isSmooth ? 0.002 : 0.003;
      }
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;

      // Highlight active layer by lifting it up slightly
      const currentActiveIndex = selectedLayerRef.current;
      layerMeshes.forEach((mesh, idx) => {
        const isSelected = idx === currentActiveIndex;
        const targetLift = isSelected ? 0.22 : 0;
        const targetY = mesh.userData.baseHeight + targetLift;
        mesh.position.y += (targetY - mesh.position.y) * 0.12;

        if (isSelected) {
          mesh.material.emissiveIntensity = 0.65 + Math.sin(elapsed * 4) * 0.2;
        } else {
          mesh.material.emissiveIntensity = 0.2;
        }
      });

      // Bioactive drops permeating downward
      drops.forEach((d) => {
        d.position.y -= d.userData.speed;
        if (d.position.y < d.userData.minY) {
          d.position.y = d.userData.startY;
          d.position.x = (Math.random() - 0.5) * 2.6;
          d.position.z = (Math.random() - 0.5) * 1.8;
        }
      });

      renderer.render(scene, camera);
    };

    const animate = () => {
      if (!isIntersecting || !isTabVisible) {
        frameId = null;
        return;
      }
      frameId = requestAnimationFrame(animate);
      render();
    };

    const startAnimation = () => {
      if (!frameId && isIntersecting && isTabVisible) {
        clock.start();
        frameId = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    // Pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    startAnimation();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', handleResize);

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

  const activeLayer = layersInfo[selectedLayerIndex];

  return (
    <div
      className="card card-hover"
      style={{
        background: 'linear-gradient(135deg, #0d1e16 0%, #132a1f 100%)',
        border: '1px solid rgba(88, 255, 196, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        color: '#FFFFFF'
      }}
    >
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
            <Layers size={11} /> 3D CUTANEOUS STRATIGRAPHY
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '6px' }}>
            Interactive Skin Cross-Section
          </h3>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.65)' }}>
            Select a skin layer to inspect cellular architecture and bioactive ingredient penetration.
          </p>
        </div>

        {/* Layer Selector Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {layersInfo.map((layer, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLayerIndex(idx)}
              style={{
                background: selectedLayerIndex === idx ? 'linear-gradient(135deg, #2D5A46 0%, #4FA37D 100%)' : 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: selectedLayerIndex === idx ? '1px solid #58FFC4' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {idx === 0 && '1. Stratum Corneum'}
              {idx === 1 && '2. Epidermis'}
              {idx === 2 && '3. Dermis'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Cross-Section Canvas */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.3)' }}>
        <div ref={containerRef} style={{ width: '100%', height: '320px', cursor: 'grab' }} />

        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Compass size={12} /> Drag to orbit 3D cross-section
        </div>
      </div>

      {/* Active Layer Details */}
      <div
        style={{
          marginTop: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid rgba(88, 255, 196, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#58FFC4', boxShadow: '0 0 10px #58FFC4' }} />
            <strong style={{ fontSize: '15px', color: '#58FFC4' }}>{activeLayer.name}</strong>
          </div>
          <span style={{ fontSize: '11.5px', background: 'rgba(88, 255, 196, 0.15)', color: '#58FFC4', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Depth: {activeLayer.depth}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '12px' }}>
          {activeLayer.desc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '2px' }}>Structural Constituents</div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{activeLayer.keyComponents}</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ color: '#58FFC4', fontSize: '11px', marginBottom: '2px' }}>✨ Actives Targeting This Layer</div>
            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{activeLayer.activesWorkHere}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
