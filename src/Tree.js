import * as THREE from 'three';

export class Tree {
  constructor() {
    this.mesh = new THREE.Group();

    // Tree trunk with more detail
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4d2926,
      roughness: 0.9,
      metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.position.y = 1;
    this.mesh.add(trunk);

    // Create multiple leaf layers for a fuller look
    const createLeafLayer = (y, scale) => {
      const leafGeometry = new THREE.ConeGeometry(1, 2, 8);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0b5345,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
      leaves.position.y = y;
      leaves.scale.set(scale, scale, scale);
      leaves.castShadow = true;
      // Randomly rotate each layer slightly
      leaves.rotation.y = Math.random() * Math.PI * 2;
      return leaves;
    };

    // Add multiple layers of leaves
    const leafLayers = [
      { y: 2.5, scale: 1.0 },
      { y: 3.5, scale: 0.8 },
      { y: 4.3, scale: 0.6 },
      { y: 5.0, scale: 0.4 }
    ];

    leafLayers.forEach(layer => {
      this.mesh.add(createLeafLayer(layer.y, layer.scale));
    });

    // Add some random smaller cones for more detail
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 0.3;
      const smallCone = createLeafLayer(3.5, 0.3);
      smallCone.position.x = Math.cos(angle) * radius;
      smallCone.position.z = Math.sin(angle) * radius;
      this.mesh.add(smallCone);
    }
  }
}
