/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define(["exports","./Transforms-ac54558c","./ComponentDatatype-6ff7d2c3","./defaultValue-6ed27e8d","./RuntimeError-17a7ed3d","./Matrix2-735f0ea9","./GeometryAttribute-f542c9a2","./GeometryAttributes-cb1bf806","./GeometryPipeline-87dd0e0a","./IndexDatatype-d42fd89c","./WebMercatorProjection-4d21b562"],(function(e,t,n,r,o,i,s,c,a,d,p){"use strict";function u(e,t,n){e=r.defaultValue(e,0),t=r.defaultValue(t,0),n=r.defaultValue(n,0),this.value=new Float32Array([e,t,n])}function f(e,t){const r=e.attributes,o=r.position,i=o.values.length/o.componentsPerAttribute;r.batchId=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:1,values:new Float32Array(i)});const c=r.batchId.values;for(let e=0;e<i;++e)c[e]=t}function l(e){const o=e.instances,s=e.projection,c=e.elementIndexUintSupported,d=e.scene3DOnly,p=e.vertexCacheOptimize,u=e.compressVertices,l=e.modelMatrix;let m,h,g=o.length;for(m=0;m<g;++m)if(r.defined(o[m].geometry)){o[m].geometry.primitiveType;break}if(function(e,t,n){let o=!n;const s=e.length;let c;if(!o&&s>1){const t=e[0].modelMatrix;for(c=1;c<s;++c)if(!i.Matrix4.equals(t,e[c].modelMatrix)){o=!0;break}}if(o)for(c=0;c<s;++c)r.defined(e[c].geometry)&&a.GeometryPipeline.transformToWorldCoordinates(e[c]);else i.Matrix4.multiplyTransformation(t,e[0].modelMatrix,t)}(o,l,d),!d)for(m=0;m<g;++m)r.defined(o[m].geometry)&&a.GeometryPipeline.splitLongitude(o[m]);if(function(e){const t=e.length;for(let n=0;n<t;++n){const t=e[n];r.defined(t.geometry)?f(t.geometry,n):r.defined(t.westHemisphereGeometry)&&r.defined(t.eastHemisphereGeometry)&&(f(t.westHemisphereGeometry,n),f(t.eastHemisphereGeometry,n))}}(o),p)for(m=0;m<g;++m){const e=o[m];r.defined(e.geometry)?(a.GeometryPipeline.reorderForPostVertexCache(e.geometry),a.GeometryPipeline.reorderForPreVertexCache(e.geometry)):r.defined(e.westHemisphereGeometry)&&r.defined(e.eastHemisphereGeometry)&&(a.GeometryPipeline.reorderForPostVertexCache(e.westHemisphereGeometry),a.GeometryPipeline.reorderForPreVertexCache(e.westHemisphereGeometry),a.GeometryPipeline.reorderForPostVertexCache(e.eastHemisphereGeometry),a.GeometryPipeline.reorderForPreVertexCache(e.eastHemisphereGeometry))}let y=a.GeometryPipeline.combineInstances(o);for(g=y.length,m=0;m<g;++m){h=y[m];const e=h.attributes;if(d)for(const t in e)e.hasOwnProperty(t)&&e[t].componentDatatype===n.ComponentDatatype.DOUBLE&&a.GeometryPipeline.encodeAttribute(h,t,`${t}3DHigh`,`${t}3DLow`);else for(const o in e)if(e.hasOwnProperty(o)&&e[o].componentDatatype===n.ComponentDatatype.DOUBLE){const e=`${o}3D`,n=`${o}2D`;a.GeometryPipeline.projectTo2D(h,o,e,n,s),r.defined(h.boundingSphere)&&"position"===o&&(h.boundingSphereCV=t.BoundingSphere.fromVertices(h.attributes.position2D.values)),a.GeometryPipeline.encodeAttribute(h,e,`${e}High`,`${e}Low`),a.GeometryPipeline.encodeAttribute(h,n,`${n}High`,`${n}Low`)}u&&a.GeometryPipeline.compressVertices(h)}if(!c){let e=[];for(g=y.length,m=0;m<g;++m)h=y[m],e=e.concat(a.GeometryPipeline.fitToUnsignedShortIndices(h));y=e}return y}function m(e,t,n,o){let i,s,c;const a=o.length-1;if(a>=0){const e=o[a];i=e.offset+e.count,c=e.index,s=n[c].indices.length}else i=0,c=0,s=n[c].indices.length;const d=e.length;for(let a=0;a<d;++a){const d=e[a][t];if(!r.defined(d))continue;const p=d.indices.length;i+p>s&&(i=0,s=n[++c].indices.length),o.push({index:c,offset:i,count:p}),i+=p}}Object.defineProperties(u.prototype,{componentDatatype:{get:function(){return n.ComponentDatatype.FLOAT}},componentsPerAttribute:{get:function(){return 3}},normalize:{get:function(){return!1}}}),u.fromCartesian3=function(e){return new u(e.x,e.y,e.z)},u.toValue=function(e,t){return r.defined(t)||(t=new Float32Array([e.x,e.y,e.z])),t[0]=e.x,t[1]=e.y,t[2]=e.z,t};const h={};function g(e,t){const n=e.attributes;for(const e in n)if(n.hasOwnProperty(e)){const o=n[e];r.defined(o)&&r.defined(o.values)&&t.push(o.values.buffer)}r.defined(e.indices)&&t.push(e.indices.buffer)}function y(e,t){const n=e.length,o=new Float64Array(1+19*n);let s=0;o[s++]=n;for(let t=0;t<n;t++){const n=e[t];if(i.Matrix4.pack(n.modelMatrix,o,s),s+=i.Matrix4.packedLength,r.defined(n.attributes)&&r.defined(n.attributes.offset)){const e=n.attributes.offset.value;o[s]=e[0],o[s+1]=e[1],o[s+2]=e[2]}s+=3}return t.push(o.buffer),o}function b(e){const n=e.length,o=1+(t.BoundingSphere.packedLength+1)*n,i=new Float32Array(o);let s=0;i[s++]=n;for(let o=0;o<n;++o){const n=e[o];r.defined(n)?(i[s++]=1,t.BoundingSphere.pack(e[o],i,s)):i[s++]=0,s+=t.BoundingSphere.packedLength}return i}function x(e){const n=new Array(e[0]);let r=0,o=1;for(;o<e.length;)1===e[o++]&&(n[r]=t.BoundingSphere.unpack(e,o)),++r,o+=t.BoundingSphere.packedLength;return n}h.combineGeometry=function(e){let n,o;const i=e.instances,s=i.length;let c,d,p=!1;s>0&&(n=l(e),n.length>0&&(o=a.GeometryPipeline.createAttributeLocations(n[0]),e.createPickOffsets&&(c=function(e,t){const n=[];return m(e,"geometry",t,n),m(e,"westHemisphereGeometry",t,n),m(e,"eastHemisphereGeometry",t,n),n}(i,n))),r.defined(i[0].attributes)&&r.defined(i[0].attributes.offset)&&(d=new Array(s),p=!0));const u=new Array(s),f=new Array(s);for(let e=0;e<s;++e){const n=i[e],o=n.geometry;r.defined(o)&&(u[e]=o.boundingSphere,f[e]=o.boundingSphereCV,p&&(d[e]=n.geometry.offsetAttribute));const s=n.eastHemisphereGeometry,c=n.westHemisphereGeometry;r.defined(s)&&r.defined(c)&&(r.defined(s.boundingSphere)&&r.defined(c.boundingSphere)&&(u[e]=t.BoundingSphere.union(s.boundingSphere,c.boundingSphere)),r.defined(s.boundingSphereCV)&&r.defined(c.boundingSphereCV)&&(f[e]=t.BoundingSphere.union(s.boundingSphereCV,c.boundingSphereCV)))}return{geometries:n,modelMatrix:e.modelMatrix,attributeLocations:o,pickOffsets:c,offsetInstanceExtend:d,boundingSpheres:u,boundingSpheresCV:f}},h.packCreateGeometryResults=function(e,n){const o=new Float64Array(function(e){let n=1;const o=e.length;for(let i=0;i<o;i++){const o=e[i];if(++n,!r.defined(o))continue;const s=o.attributes;n+=7+2*t.BoundingSphere.packedLength+(r.defined(o.indices)?o.indices.length:0);for(const e in s)s.hasOwnProperty(e)&&r.defined(s[e])&&(n+=5+s[e].values.length)}return n}(e)),i=[],s={},c=e.length;let a=0;o[a++]=c;for(let n=0;n<c;n++){const c=e[n],d=r.defined(c);if(o[a++]=d?1:0,!d)continue;o[a++]=c.primitiveType,o[a++]=c.geometryType,o[a++]=r.defaultValue(c.offsetAttribute,-1);const p=r.defined(c.boundingSphere)?1:0;o[a++]=p,p&&t.BoundingSphere.pack(c.boundingSphere,o,a),a+=t.BoundingSphere.packedLength;const u=r.defined(c.boundingSphereCV)?1:0;o[a++]=u,u&&t.BoundingSphere.pack(c.boundingSphereCV,o,a),a+=t.BoundingSphere.packedLength;const f=c.attributes,l=[];for(const e in f)f.hasOwnProperty(e)&&r.defined(f[e])&&(l.push(e),r.defined(s[e])||(s[e]=i.length,i.push(e)));o[a++]=l.length;for(let e=0;e<l.length;e++){const t=l[e],n=f[t];o[a++]=s[t],o[a++]=n.componentDatatype,o[a++]=n.componentsPerAttribute,o[a++]=n.normalize?1:0,o[a++]=n.values.length,o.set(n.values,a),a+=n.values.length}const m=r.defined(c.indices)?c.indices.length:0;o[a++]=m,m>0&&(o.set(c.indices,a),a+=m)}return n.push(o.buffer),{stringTable:i,packedData:o}},h.unpackCreateGeometryResults=function(e){const r=e.stringTable,o=e.packedData;let i;const a=new Array(o[0]);let p=0,u=1;for(;u<o.length;){if(!(1===o[u++])){a[p++]=void 0;continue}const e=o[u++],f=o[u++];let l,m,h=o[u++];-1===h&&(h=void 0);1===o[u++]&&(l=t.BoundingSphere.unpack(o,u)),u+=t.BoundingSphere.packedLength;let g,y,b;1===o[u++]&&(m=t.BoundingSphere.unpack(o,u)),u+=t.BoundingSphere.packedLength;const x=new c.GeometryAttributes,G=o[u++];for(i=0;i<G;i++){const e=r[o[u++]],t=o[u++];b=o[u++];const i=0!==o[u++];g=o[u++],y=n.ComponentDatatype.createTypedArray(t,g);for(let e=0;e<g;e++)y[e]=o[u++];x[e]=new s.GeometryAttribute({componentDatatype:t,componentsPerAttribute:b,normalize:i,values:y})}let S;if(g=o[u++],g>0){const e=y.length/b;for(S=d.IndexDatatype.createTypedArray(e,g),i=0;i<g;i++)S[i]=o[u++]}a[p++]=new s.Geometry({primitiveType:e,geometryType:f,boundingSphere:l,boundingSphereCV:m,indices:S,attributes:x,offsetAttribute:h})}return a},h.packCombineGeometryParameters=function(e,n){const r=e.createGeometryResults,o=r.length;for(let e=0;e<o;e++)n.push(r[e].packedData.buffer);return{createGeometryResults:e.createGeometryResults,packedInstances:y(e.instances,n),ellipsoid:e.ellipsoid,isGeographic:e.projection instanceof t.GeographicProjection,elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:e.modelMatrix,createPickOffsets:e.createPickOffsets}},h.unpackCombineGeometryParameters=function(e){const n=function(e){const t=e,n=new Array(t[0]);let o=0,s=1;for(;s<t.length;){const e=i.Matrix4.unpack(t,s);let c;s+=i.Matrix4.packedLength,r.defined(t[s])&&(c={offset:new u(t[s],t[s+1],t[s+2])}),s+=3,n[o++]={modelMatrix:e,attributes:c}}return n}(e.packedInstances),o=e.createGeometryResults,s=o.length;let c=0;for(let e=0;e<s;e++){const t=h.unpackCreateGeometryResults(o[e]),r=t.length;for(let e=0;e<r;e++){const r=t[e];n[c].geometry=r,++c}}const a=i.Ellipsoid.clone(e.ellipsoid);return{instances:n,ellipsoid:a,projection:e.isGeographic?new t.GeographicProjection(a):new p.WebMercatorProjection(a),elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:i.Matrix4.clone(e.modelMatrix),createPickOffsets:e.createPickOffsets}},h.packCombineGeometryResults=function(e,t){r.defined(e.geometries)&&function(e,t){const n=e.length;for(let r=0;r<n;++r)g(e[r],t)}(e.geometries,t);const n=b(e.boundingSpheres),o=b(e.boundingSpheresCV);return t.push(n.buffer,o.buffer),{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:n,boundingSpheresCV:o}},h.unpackCombineGeometryResults=function(e){return{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:x(e.boundingSpheres),boundingSpheresCV:x(e.boundingSpheresCV)}},e.PrimitivePipeline=h}));
