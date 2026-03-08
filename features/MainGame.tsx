"use client";
import { useDestorySubject } from "@/hooks/useDestorySubject";
import { createResizeObserver } from "@/utils/createResizeObserver";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { animationFrameScheduler, debounceTime, takeUntil } from "rxjs";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 基于 three.js 的简单旋转立方体示例
export function MainGame() {
  // 通过 ref 获取 three.js 渲染结果要挂载到的 DOM 容器
  const mainGameRef = useRef<HTMLDivElement>(null);
  const destorySubject$ = useDestorySubject();
  useEffect(() => {
    const gui = new GUI();

    // 仅在组件挂载完成后初始化 three.js 场景
    if (!mainGameRef.current) return;

    const container = mainGameRef.current;

    // 创建场景与透视相机
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    // 创建 WebGL 渲染器，并将画面尺寸设为当前窗口大小
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    // 使用 three.js 的 animationLoop，自动传入时间参数并与刷新率同步
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    const sun = new THREE.DirectionalLight(0xffffff, 1); // 创建一个平行光
    sun.position.set(1, 2, 3); // 设置平行光的位置
    scene.add(sun); // 将平行光添加到场景中

    const ambientLight = new THREE.AmbientLight(0x404040); // 创建一个环境光
    ambientLight.intensity = 0.5; // 设置环境光的强度
    scene.add(ambientLight); // 将环境光添加到场景中

    // 创建一个绿色立方体作为演示用模型
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const stats = new Stats(); // 创建一个统计信息对象
    document.body.appendChild(stats.dom); // 将统计信息对象添加到页面中

    // 稍微拉远相机，保证能看到立方体
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.update() must be called after any manual changes to the camera's transform
    controls.update(); // 更新控制器

    function animate(time: number) {
      controls.update(); // 更新控制器
      stats.update(); // 更新统计信息
      // 根据时间让立方体在两个轴上持续旋转
      cube.rotation.x = time / 2000;
      cube.rotation.y = time / 1000;

      // 每一帧重新渲染当前场景
      renderer.render(scene, camera);
    }

    // 由 takeUntil(destorySubject$) 在组件卸载时自动结束订阅并断开 ResizeObserver
    createResizeObserver(container)
      .pipe(
        debounceTime(100, animationFrameScheduler),
        takeUntil(destorySubject$),
      )
      .subscribe({
        next(entry) {
          const { width, height } = entry.contentRect;
          camera.aspect = width / height; // 更新相机纵横比
          camera.updateProjectionMatrix(); // 更新相机投影矩阵
          renderer.setSize(width, height); // 更新渲染器尺寸
        },
      });

      const folder = gui.addFolder("Cube"); // 添加一个文件夹 
      folder.add(cube.position, 'x', -2, 2, 0.1).name("x position");
      folder.addColor(cube.material, 'color').name("color");

    // 组件卸载时停止动画循环、移除 DOM 并释放 Three.js 资源
    return () => {
      renderer.setAnimationLoop(null);
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
      controls.dispose();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [destorySubject$]);
  // 只是作为 three.js canvas 的挂载容器，不渲染其他内容
  return <div ref={mainGameRef} className="flex w-full h-full flex-grow"></div>;
}
