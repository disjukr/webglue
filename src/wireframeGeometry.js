import Geometry from './geometry';

export default class WireframeGeometry extends Geometry {
  constructor(geometry, name) {
    super(name);
    this.attributes = geometry.getAttributes();
    this.vertexCount = geometry.getVertexCount();
    this.type = [];
    let originalTypes = [];
    let indicesPos = 0;
    // First, calculate the size of indices buffer and set the position.
    if (Array.isArray(geometry.type)) {
      for (let i = 0; i < geometry.type.length; ++i) {
        let originalType = geometry.type[i];
        if (originalType.type === 'triangles') {
          this.type.push({
            first: indicesPos,
            count: originalType.count * 2,
            type: 'lines'
          });
          indicesPos += originalType.count * 2;
        } else {
          this.type.push({
            first: indicesPos,
            count: originalType.count,
            type: originalType.type
          });
          indicesPos += originalType.count;
        }
      }
      originalTypes = geometry.type;
    } else {
      if (geometry.type === 'triangles') {
        this.type.push({
          first: indicesPos,
          count: geometry.indices.length * 2,
          type: 'lines'
        });
        indicesPos += geometry.indices.length * 2;
      } else {
        this.type.push({
          first: indicesPos,
          count: geometry.indices.length,
          type: geometry.type
        });
        indicesPos += geometry.indices.length;
      }
      originalTypes.push({
        first: 0,
        count: geometry.indices.length,
        type: geometry.type
      });
    }
    // Then, write the indices onto it.
    let indices = new Uint16Array(indicesPos);
    for (let i = 0; i < this.type.length; ++i) {
      let destType = this.type[i];
      let origType = originalTypes[i];
      if (origType.type === 'triangles') {
        // If it's a triangle, iterate through whole array and copy it...
        let size = (origType.count / 3) | 0;
        let destFirst = destType.first;
        let origFirst = origType.first;
        for (let j = 0; j < size; ++j) {
          let origPos = origFirst + j * 3;
          let pos = destFirst + j * 6;
          indices[pos] = geometry.indices[origPos];
          indices[pos + 1] = geometry.indices[origPos + 1];
          indices[pos + 2] = geometry.indices[origPos + 1];
          indices[pos + 3] = geometry.indices[origPos + 2];
          indices[pos + 4] = geometry.indices[origPos + 2];
          indices[pos + 5] = geometry.indices[origPos];
        }
      } else {
        // If it's not a triangle, just copy the buffer.
        // Slice copys the whole buffer, so we should avoid it
        indices.set(geometry.indices.subarray(
          origType.first, origType.count + origType.first), destType.first);
      }
    }
    // Done
    this.indices = indices;
  }
  getAttributes() {
    return this.attributes;
  }
  getVertexCount() {
    return this.vertexCount;
  }
}
