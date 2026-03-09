import * as THREE from "three";

export class Terrain extends THREE.Mesh {
  width: number;
  height: number;
  color: THREE.Color;
  constructor(
    width: number,
    height: number,
    color: THREE.Color = new THREE.Color(0x00ff00),
  ) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color });
    // Mesh 的父类构造函数接受 geometry 和 material
    super(geometry, material);
    this.rotation.x = -Math.PI / 2;
    this.width = width;
    this.height = height;
    this.color = color;
    this.position.set(this.width / 2, 0, this.height / 2); // 将地形放置在中心位置
  }

  public updateGeometry() {
    this.geometry.dispose();
    this.geometry = new THREE.PlaneGeometry(this.width, this.height);
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
    });
    this.position.set(this.width / 2, 0, this.height / 2); // 将地形放置在中心位置
  }
}
