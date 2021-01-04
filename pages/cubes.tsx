import React, { RefObject } from 'react'
import * as THREE from 'three'
import styled, { CSSProperties } from 'styled-components'

const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background-color: grey;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
`;

const initialize = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGL1Renderer({canvas});

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

  const scene = new THREE.Scene();
  
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const makeCube = (geometry: THREE.BoxGeometry, color: CSSProperties["color"], x: number) => {
    const material = new THREE.MeshPhongMaterial({color})
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeCube(cubeGeometry, "green", -2),
    makeCube(cubeGeometry, "dodgerblue", 0),
    makeCube(cubeGeometry, "yellow", 2),
  ]

  renderer.render(scene, camera);

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const resizeRendererToDisplaySize = (threeRenderer: THREE.Renderer) => {
    const {clientHeight, clientWidth} = canvas;
    const needResize = canvas.width !== clientWidth || canvas.height !== clientHeight;
    if (needResize) threeRenderer.setSize(clientWidth, clientHeight, false);
    return needResize;
  }

  const step = (time: number) => {
    const sec = time * 0.001;
    cubes.forEach((cube, i) => {
      const speed = 1 + i * 0.1;
      const rot = sec * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
      cube.rotation.z = rot;
    })
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const basic1 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) initialize(canvasRef.current);

  })

  return (
    <Container>
      <Canvas ref={canvasRef} />
    </Container>
  )
}

export default basic1
