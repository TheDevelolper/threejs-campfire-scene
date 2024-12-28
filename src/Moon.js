import * as THREE from 'three';

export class Moon {
  constructor() {
    this.group = new THREE.Group();

    // Moon geometry
    const moonGeometry = new THREE.SphereGeometry(3, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffae6,
      emissive: 0xfffae6,
      emissiveIntensity: 0.2,
      roughness: 0.5,
      metalness: 0
    });

    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Glow effect
    const glowGeometry = new THREE.SphereGeometry(3.2, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        coefficient: { value: 0.5 },
        color: { value: new THREE.Color(0xfffae6) },
        power: { value: 2.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float coefficient;
        uniform float power;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          float intensity = pow(coefficient - dot(vPositionNormal, vNormal), power);
          gl_FragColor = vec4(color, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });

    const moonGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // Add both moon and glow to group
    this.group.add(this.moon);
    this.group.add(moonGlow);

    // Position the moon
    this.group.position.set(30, 25, -20);

    // Create moon light
    this.light = new THREE.DirectionalLight(0xfffae6, 1);
    this.light.position.copy(this.group.position);
    this.light.castShadow = true;
    
    // Adjust shadow properties
    this.light.shadow.mapSize.width = 2048;
    this.light.shadow.mapSize.height = 2048;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 100;
    this.light.shadow.camera.left = -20;
    this.light.shadow.camera.right = 20;
    this.light.shadow.camera.top = 20;
    this.light.shadow.camera.bottom = -20;
  }
}
