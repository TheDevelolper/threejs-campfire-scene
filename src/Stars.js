import * as THREE from 'three';

export class Stars {
  constructor() {
    const starCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Create different star sizes with specific probabilities
      const sizeProbability = Math.random();
      let starSize;
      if (sizeProbability > 0.995) {
        // Super bright stars (0.5%)
        starSize = Math.random() * 0.5 + 0.8;
      } else if (sizeProbability > 0.98) {
        // Bright stars (1.5%)
        starSize = Math.random() * 0.3 + 0.5;
      } else if (sizeProbability > 0.95) {
        // Medium stars (3%)
        starSize = Math.random() * 0.2 + 0.3;
      } else {
        // Regular small stars (95%)
        starSize = Math.random() * 0.15 + 0.1;
      }
      sizes[i] = starSize;

      // Vary star colors slightly based on size
      const starColor = Math.random();
      if (starSize > 0.8) {
        // Brightest stars have slight blue tint
        colors[i3] = 0.95;
        colors[i3 + 1] = 0.95;
        colors[i3 + 2] = 1;
      } else if (starSize > 0.5) {
        // Bright stars are pure white
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        // Smaller stars have slight variation
        colors[i3] = 1;
        colors[i3 + 1] = starColor > 0.5 ? 1 : 0.9;
        colors[i3 + 2] = starColor > 0.8 ? 1 : 0.8;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.mesh = new THREE.Points(geometry, material);
    this.initialSizes = sizes.slice();
    this.time = 0;
  }

  update() {
    this.time += 0.002;
    const sizes = this.mesh.geometry.attributes.size.array;

    for (let i = 0; i < sizes.length; i++) {
      // Larger stars twinkle more slowly and subtly
      const twinkleSpeed = this.initialSizes[i] > 0.5 ? 0.5 : 1;
      const twinkleAmount = this.initialSizes[i] > 0.5 ? 0.1 : 0.2;
      sizes[i] = this.initialSizes[i] * (0.8 + Math.sin(this.time * twinkleSpeed + i) * twinkleAmount);
    }

    this.mesh.geometry.attributes.size.needsUpdate = true;
  }
}
