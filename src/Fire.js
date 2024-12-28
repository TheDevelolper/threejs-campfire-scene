import * as THREE from 'three';

export class Fire {
  constructor() {
    this.particles = [];
    const particleCount = 300; // More particles for better effect with tiny size
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 0.1; // Very tight spread
      positions[i3 + 1] = Math.random() * 0.2; // Lower initial height
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1; // Very tight spread
      
      this.particles.push({
        velocity: Math.random() * 0.003 + 0.002, // Slower upward movement
        initialY: positions[i3 + 1],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.8 + 0.2,
        size: Math.random() * 0.004 + 0.002, // Extremely small particles
        horizontalVelocity: {
          x: (Math.random() - 0.5) * 0.0001, // Very subtle horizontal movement
          z: (Math.random() - 0.5) * 0.0001
        }
      });
      
      // Warmer fire colors
      const t = Math.random();
      colors[i3] = 1;  // R
      colors[i3 + 1] = t * 0.2 + 0.1;  // G (more orange)
      colors[i3 + 2] = t * 0.02;  // B (very little blue)
      
      sizes[i] = this.particles[i].size;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    this.mesh = new THREE.Points(geometry, material);
    this.mesh.position.y = 0.3;
  }
  
  update() {
    const positions = this.mesh.geometry.attributes.position.array;
    const sizes = this.mesh.geometry.attributes.size.array;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < this.particles.length; i++) {
      const i3 = i * 3;
      const particle = this.particles[i];
      
      // Primarily vertical movement
      positions[i3 + 1] += particle.velocity;
      
      // Very subtle horizontal movement that decreases with height
      const heightFactor = 1 - positions[i3 + 1] / 1.2;
      positions[i3] += particle.horizontalVelocity.x * heightFactor;
      positions[i3 + 2] += particle.horizontalVelocity.z * heightFactor;
      
      // Extremely subtle wobble
      const wobble = Math.sin(time * particle.wobbleSpeed + particle.wobble) * 0.002;
      positions[i3] += wobble;
      positions[i3 + 2] += wobble;
      
      // Size reduction with height
      sizes[i] = particle.size * (1 - positions[i3 + 1] / 1.2);
      
      // Reset particle
      if (positions[i3 + 1] > 0.8 || sizes[i] < 0.001) {
        positions[i3] = (Math.random() - 0.5) * 0.1;
        positions[i3 + 1] = particle.initialY;
        positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
        sizes[i] = particle.size;
      }
    }
    
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.size.needsUpdate = true;
  }
}
