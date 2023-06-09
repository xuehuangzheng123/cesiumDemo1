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
define(["exports","./Matrix2-73789715","./RuntimeError-4f8ec8a2","./OrientedBoundingBox-5ee9ed67"],(function(n,t,e,r){"use strict";const i={},a=new t.Cartesian3,o=new t.Cartesian3,u=new t.Cartesian3,s=new t.Cartesian3,c=new r.OrientedBoundingBox;function C(n,e,r,i,o){const u=t.Cartesian3.subtract(n,e,a),s=t.Cartesian3.dot(r,u),c=t.Cartesian3.dot(i,u);return t.Cartesian2.fromElements(s,c,o)}i.validOutline=function(n){const e=r.OrientedBoundingBox.fromPoints(n,c).halfAxes,i=t.Matrix3.getColumn(e,0,o),a=t.Matrix3.getColumn(e,1,u),C=t.Matrix3.getColumn(e,2,s),m=t.Cartesian3.magnitude(i),g=t.Cartesian3.magnitude(a),l=t.Cartesian3.magnitude(C);return!(0===m&&(0===g||0===l)||0===g&&0===l)},i.computeProjectTo2DArguments=function(n,e,i,a){const C=r.OrientedBoundingBox.fromPoints(n,c),m=C.halfAxes,g=t.Matrix3.getColumn(m,0,o),l=t.Matrix3.getColumn(m,1,u),d=t.Matrix3.getColumn(m,2,s),f=t.Cartesian3.magnitude(g),x=t.Cartesian3.magnitude(l),B=t.Cartesian3.magnitude(d),M=Math.min(f,x,B);if(0===f&&(0===x||0===B)||0===x&&0===B)return!1;let P,w;return M!==x&&M!==B||(P=g),M===f?P=l:M===B&&(w=l),M!==f&&M!==x||(w=d),t.Cartesian3.normalize(P,i),t.Cartesian3.normalize(w,a),t.Cartesian3.clone(C.center,e),!0},i.createProjectPointsTo2DFunction=function(n,t,e){return function(r){const i=new Array(r.length);for(let a=0;a<r.length;a++)i[a]=C(r[a],n,t,e);return i}},i.createProjectPointTo2DFunction=function(n,t,e){return function(r,i){return C(r,n,t,e,i)}},n.CoplanarPolygonGeometryLibrary=i}));
