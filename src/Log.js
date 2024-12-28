import * as THREE from 'three';

export class Log {
  constructor(radius = 0.2, length = 2) {
    this.mesh = new THREE.Group();

    // Main log cylinder
    const logGeometry = new THREE.CylinderGeometry(radius, radius, length, 8);
    const logMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4d2926,
      roughness: 0.9,
      metalness: 0.1
    });
    const log = new THREE.Mesh(logGeometry, logMaterial);
    log.rotation.z = -Math.PI / 2;
    log.castShadow = true;
    
    // Add end caps with rings
    const endCapGeometry = new THREE.CircleGeometry(radius, 8);
    const endCapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3d1916,
      roughness: 0.9,
      metalness: 0.1
    });

    const endCap1 = new THREE.Mesh(endCapGeometry, endCapMaterial);
    endCap1.position.x = length / 2;
    endCap1.rotation.y = Math.PI / 2;

    const endCap2 = new THREE.Mesh(endCapGeometry, endCapMaterial);
    endCap2.position.x = -length / 2;
    endCap2.rotation.y = -Math.PI / 2;

    this.mesh.add(log);
    this.mesh.add(endCap1);
    this.mesh.add(endCap2);

    // Add some bark texture detail
    const barkCount = 6;
    for (let i = 0; i < barkCount; i++) {
      const angle = (i / barkCount) * Math.PI * 2;
      const barkGeometry = new THREE.BoxGeometry(length * 0.8, radius * 0.1, radius * 0.1);
      const barkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3d1916,
        roughness: 1,
        metalness: 0
      });
      const bark = new THREE.Mesh(barkGeometry, barkMaterial);
      bark.position.y = Math.sin(angle) * (radius * 0.8);
      bark.position.z = Math.cos(angle) * (radius * 0.8);
      bark.rotation.z = -Math.PI / 2;
      this.mesh.add(bark);
    }
  }
}
