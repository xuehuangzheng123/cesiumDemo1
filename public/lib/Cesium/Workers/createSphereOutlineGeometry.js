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
define(["./defaultValue-97284df2","./Matrix2-73789715","./RuntimeError-4f8ec8a2","./EllipsoidOutlineGeometry-fd03887d","./ComponentDatatype-e7fbe225","./WebGLConstants-6da700a2","./Transforms-d4da1631","./_commonjsHelpers-3aae1032-65601a27","./combine-d11b1f00","./GeometryAttribute-8163e7fe","./GeometryAttributes-734a3446","./GeometryOffsetAttribute-59b14f45","./IndexDatatype-65271ba3"],(function(e,i,t,n,o,r,s,a,d,l,u,c,m){"use strict";function p(t){const o=e.defaultValue(t.radius,1),r={radii:new i.Cartesian3(o,o,o),stackPartitions:t.stackPartitions,slicePartitions:t.slicePartitions,subdivisions:t.subdivisions};this._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(r),this._workerName="createSphereOutlineGeometry"}p.packedLength=n.EllipsoidOutlineGeometry.packedLength,p.pack=function(e,i,t){return n.EllipsoidOutlineGeometry.pack(e._ellipsoidGeometry,i,t)};const f=new n.EllipsoidOutlineGeometry,y={radius:void 0,radii:new i.Cartesian3,stackPartitions:void 0,slicePartitions:void 0,subdivisions:void 0};return p.unpack=function(t,o,r){const s=n.EllipsoidOutlineGeometry.unpack(t,o,f);return y.stackPartitions=s._stackPartitions,y.slicePartitions=s._slicePartitions,y.subdivisions=s._subdivisions,e.defined(r)?(i.Cartesian3.clone(s._radii,y.radii),r._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(y),r):(y.radius=s._radii.x,new p(y))},p.createGeometry=function(e){return n.EllipsoidOutlineGeometry.createGeometry(e._ellipsoidGeometry)},function(i,t){return e.defined(t)&&(i=p.unpack(i,t)),p.createGeometry(i)}}));
