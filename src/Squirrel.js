import * as THREE from 'three';

export class Squirrel {
  constructor() {
    this.mesh = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.SphereGeometry(0.2, 8, 6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    this.mesh.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.15, 0.5, 0);
    this.mesh.add(head);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.05, 0.1, 4);
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.15, 0.7, 0.08);
    this.mesh.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.15, 0.7, -0.08);
    this.mesh.add(rightEar);

    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.05, 0.15, 0.4, 4);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-0.2, 0.4, 0);
    tail.rotation.z = Math.PI / 3;
    this.mesh.add(tail);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.08, 0.2, 0.08);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

    const positions = [
      { x: 0.1, z: 0.1 },
      { x: 0.1, z: -0.1 },
      { x: -0.1, z: 0.1 },
      { x: -0.1, z: -0.1 }
    ];

    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, 0.1, pos.z);
      this.mesh.add(leg);
    });

    // Cast shadows
    this.mesh.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // Scale down the squirrel
    this.mesh.scale.set(0.7, 0.7, 0.7);
  }
}
