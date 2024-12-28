import * as THREE from 'three';

export class Fox {
  constructor() {
    this.mesh = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.ConeGeometry(0.4, 1, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd35400 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.4;
    this.mesh.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xd35400 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.5, 0.5, 0);
    this.mesh.add(head);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.1, 0.2, 4);
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0xd35400 });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.5, 0.8, 0.15);
    this.mesh.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.5, 0.8, -0.15);
    this.mesh.add(rightEar);

    // Snout
    const snoutGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    const snoutMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
    snout.position.set(0.7, 0.4, 0);
    this.mesh.add(snout);

    // Tail
    const tailGeometry = new THREE.ConeGeometry(0.15, 0.6, 4);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xd35400 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-0.6, 0.4, 0);
    tail.rotation.z = -Math.PI / 4;
    this.mesh.add(tail);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.15);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });

    const positions = [
      { x: 0.2, z: 0.2 },
      { x: 0.2, z: -0.2 },
      { x: -0.2, z: 0.2 },
      { x: -0.2, z: -0.2 }
    ];

    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, 0.2, pos.z);
      this.mesh.add(leg);
    });

    // Cast shadows
    this.mesh.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }
}
