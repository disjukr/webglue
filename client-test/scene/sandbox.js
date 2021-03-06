import PhongMaterial from '../phongMaterial';
import Texture2D from 'webglue/texture2D';
import BoxGeometry from 'webglue/boxGeometry';
import QuadGeometry from 'webglue/quadGeometry';
// import UVSphereGeometry from 'webglue/uvSphereGeometry';
import Mesh from 'webglue/mesh';
import Camera from 'webglue/camera';
import Container from 'webglue/container';
// import AmbientLight from 'webglue/light/ambient';
// import DirectionalLightMesh from './directionalLightMesh';
import PointLightMesh from '../pointLightMesh';

import { quat } from 'gl-matrix';

function createMaterial(image) {
  let texture = Texture2D.fromImage(image);
  let material = new PhongMaterial({
    diffuseMap: texture,
    specular: new Float32Array([0.4, 0.4, 0.4]),
    diffuse: new Float32Array([1, 1, 1]),
    ambient: new Float32Array([0.2, 0.2, 0.2]),
    shininess: 10.0
  });
  return material;
}

export default function createScene() {
  let container = new Container();

  let geometry = new BoxGeometry();
  let quadGeom = new QuadGeometry();

  let camera = new Camera();
  container.appendChild(camera);

  quat.rotateY(camera.transform.rotation, camera.transform.rotation,
    Math.PI / 4);
  quat.rotateX(camera.transform.rotation, camera.transform.rotation,
    -Math.PI / 3);
  camera.transform.invalidate();

  let mesh = new Mesh(geometry,
    createMaterial(require('../texture/tile.jpg')));
  container.appendChild(mesh);

  let mesh2 = new Mesh(quadGeom,
    createMaterial(require('../texture/sand.jpg')));
  container.appendChild(mesh2);
  mesh2.transform.position[1] = -1;
  mesh2.transform.scale[0] = 5;
  mesh2.transform.scale[2] = 5;
  mesh2.transform.invalidate();

  let mesh3 = new Mesh(quadGeom,
    createMaterial(require('../texture/brick.jpg')));
  container.appendChild(mesh3);
  quat.rotateX(mesh3.transform.rotation, mesh3.transform.rotation,
    -Math.PI / 2);
  quat.rotateZ(mesh3.transform.rotation, mesh3.transform.rotation,
    Math.PI);
  mesh3.transform.position[2] = -5;
  mesh3.transform.position[1] = 4;
  mesh3.transform.scale[0] = 5;
  mesh3.transform.scale[2] = 5;
  mesh3.transform.invalidate();

  let mesh4 = new Mesh(quadGeom,
    createMaterial(require('../texture/brick.jpg')));
  container.appendChild(mesh4);
  quat.rotateX(mesh4.transform.rotation, mesh4.transform.rotation,
    -Math.PI / 2);
  quat.rotateZ(mesh4.transform.rotation, mesh4.transform.rotation,
    -Math.PI / 2);
  mesh4.transform.position[0] = -5;
  mesh4.transform.position[1] = 4;
  mesh4.transform.scale[0] = 5;
  mesh4.transform.scale[2] = 5;
  mesh4.transform.invalidate();

  let directionalLight = new PointLightMesh({
    color: new Float32Array([1, 1, 1]),
    ambient: 1,
    diffuse: 1,
    specular: 0.8,
    attenuation: 0.0008
  });
  container.appendChild(directionalLight);

  directionalLight.transform.position[1] = 10;
  directionalLight.transform.position[2] = 8;
  directionalLight.transform.position[0] = 8;
  quat.rotateY(directionalLight.transform.rotation,
    directionalLight.transform.rotation, Math.PI / 4 * 3);
  quat.rotateZ(directionalLight.transform.rotation,
    directionalLight.transform.rotation, -Math.PI / 3);
  directionalLight.transform.invalidate();

  return {
    container, camera, update: (delta) => {
      quat.rotateY(mesh.transform.rotation, mesh.transform.rotation,
          Math.PI / 180 * 120 * delta);
      mesh.transform.invalidate();
    }
  };
}
