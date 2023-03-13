/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.95
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
define(["./defaultValue-97284df2","./Transforms-d4da1631","./Matrix2-73789715","./RuntimeError-4f8ec8a2","./ComponentDatatype-e7fbe225","./FrustumGeometry-a6f9f16a","./GeometryAttribute-8163e7fe","./GeometryAttributes-734a3446","./_commonjsHelpers-3aae1032-65601a27","./combine-d11b1f00","./WebGLConstants-6da700a2","./Plane-e916220d","./VertexFormat-9886cb81"],(function(e,t,r,n,a,u,i,o,s,c,p,m,f){"use strict";const d=0,h=1;function l(n){const a=n.frustum,i=n.orientation,o=n.origin,s=e.defaultValue(n._drawNearPlane,!0);let c,p;a instanceof u.PerspectiveFrustum?(c=d,p=u.PerspectiveFrustum.packedLength):a instanceof u.OrthographicFrustum&&(c=h,p=u.OrthographicFrustum.packedLength),this._frustumType=c,this._frustum=a.clone(),this._origin=r.Cartesian3.clone(o),this._orientation=t.Quaternion.clone(i),this._drawNearPlane=s,this._workerName="createFrustumOutlineGeometry",this.packedLength=2+p+r.Cartesian3.packedLength+t.Quaternion.packedLength}l.pack=function(n,a,i){i=e.defaultValue(i,0);const o=n._frustumType,s=n._frustum;return a[i++]=o,o===d?(u.PerspectiveFrustum.pack(s,a,i),i+=u.PerspectiveFrustum.packedLength):(u.OrthographicFrustum.pack(s,a,i),i+=u.OrthographicFrustum.packedLength),r.Cartesian3.pack(n._origin,a,i),i+=r.Cartesian3.packedLength,t.Quaternion.pack(n._orientation,a,i),a[i+=t.Quaternion.packedLength]=n._drawNearPlane?1:0,a};const g=new u.PerspectiveFrustum,_=new u.OrthographicFrustum,k=new t.Quaternion,y=new r.Cartesian3;return l.unpack=function(n,a,i){a=e.defaultValue(a,0);const o=n[a++];let s;o===d?(s=u.PerspectiveFrustum.unpack(n,a,g),a+=u.PerspectiveFrustum.packedLength):(s=u.OrthographicFrustum.unpack(n,a,_),a+=u.OrthographicFrustum.packedLength);const c=r.Cartesian3.unpack(n,a,y);a+=r.Cartesian3.packedLength;const p=t.Quaternion.unpack(n,a,k),m=1===n[a+=t.Quaternion.packedLength];if(!e.defined(i))return new l({frustum:s,origin:c,orientation:p,_drawNearPlane:m});const f=o===i._frustumType?i._frustum:void 0;return i._frustum=s.clone(f),i._frustumType=o,i._origin=r.Cartesian3.clone(c,i._origin),i._orientation=t.Quaternion.clone(p,i._orientation),i._drawNearPlane=m,i},l.createGeometry=function(e){const r=e._frustumType,n=e._frustum,s=e._origin,c=e._orientation,p=e._drawNearPlane,m=new Float64Array(24);u.FrustumGeometry._computeNearFarPlanes(s,c,r,n,m);const f=new o.GeometryAttributes({position:new i.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:m})});let d,h;const l=p?2:1,g=new Uint16Array(8*(l+1));let _=p?0:1;for(;_<2;++_)d=p?8*_:0,h=4*_,g[d]=h,g[d+1]=h+1,g[d+2]=h+1,g[d+3]=h+2,g[d+4]=h+2,g[d+5]=h+3,g[d+6]=h+3,g[d+7]=h;for(_=0;_<2;++_)d=8*(l+_),h=4*_,g[d]=h,g[d+1]=h+4,g[d+2]=h+1,g[d+3]=h+5,g[d+4]=h+2,g[d+5]=h+6,g[d+6]=h+3,g[d+7]=h+7;return new i.Geometry({attributes:f,indices:g,primitiveType:i.PrimitiveType.LINES,boundingSphere:t.BoundingSphere.fromVertices(m)})},function(t,r){return e.defined(r)&&(t=l.unpack(t,r)),l.createGeometry(t)}}));
