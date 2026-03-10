import * as THREE from "three";

export class Terrain extends THREE.Mesh {
  width: number;
  height: number;
  color: THREE.Color;
  treeCount = 10;
  constructor(
    width: number,
    height: number,
    color: THREE.Color = new THREE.Color(0x00ff00),
  ) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color });
    // Mesh 的父类构造函数接受 geometry 和 material
    super(geometry, material);
    // 绕自身 X 轴旋转 -90°，平面从 XY 变成水平 XZ；子物体坐标都是相对 this 的本地坐标，会随父节点一起变换
    this.rotation.x = -Math.PI / 2;
    this.width = width;
    this.height = height;
    this.color = color;
    this.position.set(this.width / 2, 0, this.height / 2); // 将地形放置在中心位置
    this.createTrees();
  }

  public updateGeometry() {
    this.geometry.dispose();
    this.geometry = new THREE.PlaneGeometry(this.width, this.height);
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
    });
    this.position.set(this.width / 2, 0, this.height / 2); // 将地形放置在中心位置
  }
  public createTrees() {
    for (let treeIndex = 0; treeIndex < this.treeCount; treeIndex++) {
      const tree = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 1, 8),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(0x00ff00) }),
      );
      // 锥体默认沿自身 Y 轴，旋转 90° 让锥体沿地形“上”（即世界 Y）竖立
      tree.rotation.x = Math.PI / 2;
      // 以下都是相对地形 this 的本地坐标：地形旋转后本地 XY 为水平面，本地 Z 为“上”，所以 z=0.5 表示抬升 0.5
      tree.position.set(
        Math.random() * this.width - this.width / 2,
        Math.random() * this.height - this.height / 2,
        0.5,
      );

      this.add(tree);
    }
  }
}
