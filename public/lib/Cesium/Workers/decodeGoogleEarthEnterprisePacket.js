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
define(["./RuntimeError-4f8ec8a2","./defaultValue-97284df2","./_commonjsHelpers-3aae1032-65601a27","./createTaskProcessorWorker"],(function(e,t,n,i){"use strict";const r=1953029805,a=2917034100;function o(t,n){if(o.passThroughDataForTesting)return n;const i=t.byteLength;if(0===i||i%4!=0)throw new e.RuntimeError("The length of key must be greater than 0 and a multiple of 4.");const s=new DataView(n),f=s.getUint32(0,!0);if(f===r||f===a)return n;const l=new DataView(t);let d=0;const c=n.byteLength,h=c-c%8,u=i;let w,b=8;for(;d<h;)for(b=(b+8)%24,w=b;d<h&&w<u;)s.setUint32(d,s.getUint32(d,!0)^l.getUint32(w,!0),!0),s.setUint32(d+4,s.getUint32(d+4,!0)^l.getUint32(w+4,!0),!0),d+=8,w+=24;if(d<c)for(w>=u&&(b=(b+8)%24,w=b);d<c;)s.setUint8(d,s.getUint8(d)^l.getUint8(w)),d++,w++}function s(e,t){return 0!=(e&t)}o.passThroughDataForTesting=!1;const f=[1,2,4,8];function l(e,t,n,i,r,a){this._bits=e,this.cnodeVersion=t,this.imageryVersion=n,this.terrainVersion=i,this.imageryProvider=r,this.terrainProvider=a,this.ancestorHasTerrain=!1,this.terrainState=void 0}l.clone=function(e,n){return t.defined(n)?(n._bits=e._bits,n.cnodeVersion=e.cnodeVersion,n.imageryVersion=e.imageryVersion,n.terrainVersion=e.terrainVersion,n.imageryProvider=e.imageryProvider,n.terrainProvider=e.terrainProvider):n=new l(e._bits,e.cnodeVersion,e.imageryVersion,e.terrainVersion,e.imageryProvider,e.terrainProvider),n.ancestorHasTerrain=e.ancestorHasTerrain,n.terrainState=e.terrainState,n},l.prototype.setParent=function(e){this.ancestorHasTerrain=e.ancestorHasTerrain||this.hasTerrain()},l.prototype.hasSubtree=function(){return s(this._bits,16)},l.prototype.hasImagery=function(){return s(this._bits,64)},l.prototype.hasTerrain=function(){return s(this._bits,128)},l.prototype.hasChildren=function(){return s(this._bits,15)},l.prototype.hasChild=function(e){return s(this._bits,f[e])},l.prototype.getChildBitmask=function(){return 15&this._bits};var d=n.createCommonjsModule((function(e,t){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;function i(e,t){return Object.prototype.hasOwnProperty.call(e,t)}t.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(var r in n)i(n,r)&&(e[r]=n[r])}}return e},t.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var r={arraySet:function(e,t,n,i,r){if(t.subarray&&e.subarray)e.set(t.subarray(n,n+i),r);else for(var a=0;a<i;a++)e[r+a]=t[n+a]},flattenChunks:function(e){var t,n,i,r,a,o;for(i=0,t=0,n=e.length;t<n;t++)i+=e[t].length;for(o=new Uint8Array(i),r=0,t=0,n=e.length;t<n;t++)a=e[t],o.set(a,r),r+=a.length;return o}},a={arraySet:function(e,t,n,i,r){for(var a=0;a<i;a++)e[r+a]=t[n+a]},flattenChunks:function(e){return[].concat.apply([],e)}};t.setTyped=function(e){e?(t.Buf8=Uint8Array,t.Buf16=Uint16Array,t.Buf32=Int32Array,t.assign(t,r)):(t.Buf8=Array,t.Buf16=Array,t.Buf32=Array,t.assign(t,a))},t.setTyped(n)}));var c=function(e,t,n,i){for(var r=65535&e|0,a=e>>>16&65535|0,o=0;0!==n;){n-=o=n>2e3?2e3:n;do{a=a+(r=r+t[i++]|0)|0}while(--o);r%=65521,a%=65521}return r|a<<16|0};var h=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var i=0;i<8;i++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();var u=function(e,t,n,i){var r=h,a=i+n;e^=-1;for(var o=i;o<a;o++)e=e>>>8^r[255&(e^t[o])];return-1^e},w=function(e,t){var n,i,r,a,o,s,f,l,d,c,h,u,w,b,m,g,k,_,v,p,y,E,x,S,T;n=e.state,i=e.next_in,S=e.input,r=i+(e.avail_in-5),a=e.next_out,T=e.output,o=a-(t-e.avail_out),s=a+(e.avail_out-257),f=n.dmax,l=n.wsize,d=n.whave,c=n.wnext,h=n.window,u=n.hold,w=n.bits,b=n.lencode,m=n.distcode,g=(1<<n.lenbits)-1,k=(1<<n.distbits)-1;e:do{w<15&&(u+=S[i++]<<w,w+=8,u+=S[i++]<<w,w+=8),_=b[u&g];t:for(;;){if(u>>>=v=_>>>24,w-=v,0===(v=_>>>16&255))T[a++]=65535&_;else{if(!(16&v)){if(0==(64&v)){_=b[(65535&_)+(u&(1<<v)-1)];continue t}if(32&v){n.mode=12;break e}e.msg="invalid literal/length code",n.mode=30;break e}p=65535&_,(v&=15)&&(w<v&&(u+=S[i++]<<w,w+=8),p+=u&(1<<v)-1,u>>>=v,w-=v),w<15&&(u+=S[i++]<<w,w+=8,u+=S[i++]<<w,w+=8),_=m[u&k];n:for(;;){if(u>>>=v=_>>>24,w-=v,!(16&(v=_>>>16&255))){if(0==(64&v)){_=m[(65535&_)+(u&(1<<v)-1)];continue n}e.msg="invalid distance code",n.mode=30;break e}if(y=65535&_,w<(v&=15)&&(u+=S[i++]<<w,(w+=8)<v&&(u+=S[i++]<<w,w+=8)),(y+=u&(1<<v)-1)>f){e.msg="invalid distance too far back",n.mode=30;break e}if(u>>>=v,w-=v,y>(v=a-o)){if((v=y-v)>d&&n.sane){e.msg="invalid distance too far back",n.mode=30;break e}if(E=0,x=h,0===c){if(E+=l-v,v<p){p-=v;do{T[a++]=h[E++]}while(--v);E=a-y,x=T}}else if(c<v){if(E+=l+c-v,(v-=c)<p){p-=v;do{T[a++]=h[E++]}while(--v);if(E=0,c<p){p-=v=c;do{T[a++]=h[E++]}while(--v);E=a-y,x=T}}}else if(E+=c-v,v<p){p-=v;do{T[a++]=h[E++]}while(--v);E=a-y,x=T}for(;p>2;)T[a++]=x[E++],T[a++]=x[E++],T[a++]=x[E++],p-=3;p&&(T[a++]=x[E++],p>1&&(T[a++]=x[E++]))}else{E=a-y;do{T[a++]=T[E++],T[a++]=T[E++],T[a++]=T[E++],p-=3}while(p>2);p&&(T[a++]=T[E++],p>1&&(T[a++]=T[E++]))}break}}break}}while(i<r&&a<s);i-=p=w>>3,u&=(1<<(w-=p<<3))-1,e.next_in=i,e.next_out=a,e.avail_in=i<r?r-i+5:5-(i-r),e.avail_out=a<s?s-a+257:257-(a-s),n.hold=u,n.bits=w},b=15,m=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],g=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],k=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],_=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64],v=function(e,t,n,i,r,a,o,s){var f,l,c,h,u,w,v,p,y,E=s.bits,x=0,S=0,T=0,R=0,A=0,B=0,U=0,Z=0,I=0,D=0,O=null,N=0,C=new d.Buf16(16),F=new d.Buf16(16),L=null,H=0;for(x=0;x<=b;x++)C[x]=0;for(S=0;S<i;S++)C[t[n+S]]++;for(A=E,R=b;R>=1&&0===C[R];R--);if(A>R&&(A=R),0===R)return r[a++]=20971520,r[a++]=20971520,s.bits=1,0;for(T=1;T<R&&0===C[T];T++);for(A<T&&(A=T),Z=1,x=1;x<=b;x++)if(Z<<=1,(Z-=C[x])<0)return-1;if(Z>0&&(0===e||1!==R))return-1;for(F[1]=0,x=1;x<b;x++)F[x+1]=F[x]+C[x];for(S=0;S<i;S++)0!==t[n+S]&&(o[F[t[n+S]]++]=S);if(0===e?(O=L=o,w=19):1===e?(O=m,N-=257,L=g,H-=257,w=256):(O=k,L=_,w=-1),D=0,S=0,x=T,u=a,B=A,U=0,c=-1,h=(I=1<<A)-1,1===e&&I>852||2===e&&I>592)return 1;for(;;){v=x-U,o[S]<w?(p=0,y=o[S]):o[S]>w?(p=L[H+o[S]],y=O[N+o[S]]):(p=96,y=0),f=1<<x-U,T=l=1<<B;do{r[u+(D>>U)+(l-=f)]=v<<24|p<<16|y|0}while(0!==l);for(f=1<<x-1;D&f;)f>>=1;if(0!==f?(D&=f-1,D+=f):D=0,S++,0==--C[x]){if(x===R)break;x=t[n+o[S]]}if(x>A&&(D&h)!==c){for(0===U&&(U=A),u+=T,Z=1<<(B=x-U);B+U<R&&!((Z-=C[B+U])<=0);)B++,Z<<=1;if(I+=1<<B,1===e&&I>852||2===e&&I>592)return 1;r[c=D&h]=A<<24|B<<16|u-a|0}}return 0!==D&&(r[u+D]=x-U<<24|64<<16|0),s.bits=A,0},p=0,y=1,E=2,x=4,S=5,T=6,R=0,A=1,B=2,U=-2,Z=-3,I=-4,D=-5,O=8,N=1,C=2,F=3,L=4,H=5,z=6,P=7,M=8,V=9,K=10,j=11,Y=12,G=13,Q=14,W=15,X=16,q=17,J=18,$=19,ee=20,te=21,ne=22,ie=23,re=24,ae=25,oe=26,se=27,fe=28,le=29,de=30,ce=31,he=852,ue=592,we=15;function be(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function me(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new d.Buf16(320),this.work=new d.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function ge(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=N,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new d.Buf32(he),t.distcode=t.distdyn=new d.Buf32(ue),t.sane=1,t.back=-1,R):U}function ke(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,ge(e)):U}function _e(e,t){var n,i;return e&&e.state?(i=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?U:(null!==i.window&&i.wbits!==t&&(i.window=null),i.wrap=n,i.wbits=t,ke(e))):U}function ve(e,t){var n,i;return e?(i=new me,e.state=i,i.window=null,(n=_e(e,t))!==R&&(e.state=null),n):U}var pe,ye,Ee=!0;function xe(e){if(Ee){var t;for(pe=new d.Buf32(512),ye=new d.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(v(y,e.lens,0,288,pe,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;v(E,e.lens,0,32,ye,0,e.work,{bits:5}),Ee=!1}e.lencode=pe,e.lenbits=9,e.distcode=ye,e.distbits=5}function Se(e,t,n,i){var r,a=e.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new d.Buf8(a.wsize)),i>=a.wsize?(d.arraySet(a.window,t,n-a.wsize,a.wsize,0),a.wnext=0,a.whave=a.wsize):((r=a.wsize-a.wnext)>i&&(r=i),d.arraySet(a.window,t,n-i,r,a.wnext),(i-=r)?(d.arraySet(a.window,t,n-i,i,0),a.wnext=i,a.whave=a.wsize):(a.wnext+=r,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=r))),0}var Te={inflateReset:ke,inflateReset2:_e,inflateResetKeep:ge,inflateInit:function(e){return ve(e,we)},inflateInit2:ve,inflate:function(e,t){var n,i,r,a,o,s,f,l,h,b,m,g,k,_,he,ue,we,me,ge,ke,_e,ve,pe,ye,Ee=0,Te=new d.Buf8(4),Re=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;(n=e.state).mode===Y&&(n.mode=G),o=e.next_out,r=e.output,f=e.avail_out,a=e.next_in,i=e.input,s=e.avail_in,l=n.hold,h=n.bits,b=s,m=f,ve=R;e:for(;;)switch(n.mode){case N:if(0===n.wrap){n.mode=G;break}for(;h<16;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(2&n.wrap&&35615===l){n.check=0,Te[0]=255&l,Te[1]=l>>>8&255,n.check=u(n.check,Te,2,0),l=0,h=0,n.mode=C;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&l)<<8)+(l>>8))%31){e.msg="incorrect header check",n.mode=de;break}if((15&l)!==O){e.msg="unknown compression method",n.mode=de;break}if(h-=4,_e=8+(15&(l>>>=4)),0===n.wbits)n.wbits=_e;else if(_e>n.wbits){e.msg="invalid window size",n.mode=de;break}n.dmax=1<<_e,e.adler=n.check=1,n.mode=512&l?K:Y,l=0,h=0;break;case C:for(;h<16;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(n.flags=l,(255&n.flags)!==O){e.msg="unknown compression method",n.mode=de;break}if(57344&n.flags){e.msg="unknown header flags set",n.mode=de;break}n.head&&(n.head.text=l>>8&1),512&n.flags&&(Te[0]=255&l,Te[1]=l>>>8&255,n.check=u(n.check,Te,2,0)),l=0,h=0,n.mode=F;case F:for(;h<32;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.head&&(n.head.time=l),512&n.flags&&(Te[0]=255&l,Te[1]=l>>>8&255,Te[2]=l>>>16&255,Te[3]=l>>>24&255,n.check=u(n.check,Te,4,0)),l=0,h=0,n.mode=L;case L:for(;h<16;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.head&&(n.head.xflags=255&l,n.head.os=l>>8),512&n.flags&&(Te[0]=255&l,Te[1]=l>>>8&255,n.check=u(n.check,Te,2,0)),l=0,h=0,n.mode=H;case H:if(1024&n.flags){for(;h<16;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.length=l,n.head&&(n.head.extra_len=l),512&n.flags&&(Te[0]=255&l,Te[1]=l>>>8&255,n.check=u(n.check,Te,2,0)),l=0,h=0}else n.head&&(n.head.extra=null);n.mode=z;case z:if(1024&n.flags&&((g=n.length)>s&&(g=s),g&&(n.head&&(_e=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Array(n.head.extra_len)),d.arraySet(n.head.extra,i,a,g,_e)),512&n.flags&&(n.check=u(n.check,i,g,a)),s-=g,a+=g,n.length-=g),n.length))break e;n.length=0,n.mode=P;case P:if(2048&n.flags){if(0===s)break e;g=0;do{_e=i[a+g++],n.head&&_e&&n.length<65536&&(n.head.name+=String.fromCharCode(_e))}while(_e&&g<s);if(512&n.flags&&(n.check=u(n.check,i,g,a)),s-=g,a+=g,_e)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=M;case M:if(4096&n.flags){if(0===s)break e;g=0;do{_e=i[a+g++],n.head&&_e&&n.length<65536&&(n.head.comment+=String.fromCharCode(_e))}while(_e&&g<s);if(512&n.flags&&(n.check=u(n.check,i,g,a)),s-=g,a+=g,_e)break e}else n.head&&(n.head.comment=null);n.mode=V;case V:if(512&n.flags){for(;h<16;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(l!==(65535&n.check)){e.msg="header crc mismatch",n.mode=de;break}l=0,h=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=Y;break;case K:for(;h<32;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}e.adler=n.check=be(l),l=0,h=0,n.mode=j;case j:if(0===n.havedict)return e.next_out=o,e.avail_out=f,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=h,B;e.adler=n.check=1,n.mode=Y;case Y:if(t===S||t===T)break e;case G:if(n.last){l>>>=7&h,h-=7&h,n.mode=se;break}for(;h<3;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}switch(n.last=1&l,h-=1,3&(l>>>=1)){case 0:n.mode=Q;break;case 1:if(xe(n),n.mode=ee,t===T){l>>>=2,h-=2;break e}break;case 2:n.mode=q;break;case 3:e.msg="invalid block type",n.mode=de}l>>>=2,h-=2;break;case Q:for(l>>>=7&h,h-=7&h;h<32;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if((65535&l)!=(l>>>16^65535)){e.msg="invalid stored block lengths",n.mode=de;break}if(n.length=65535&l,l=0,h=0,n.mode=W,t===T)break e;case W:n.mode=X;case X:if(g=n.length){if(g>s&&(g=s),g>f&&(g=f),0===g)break e;d.arraySet(r,i,a,g,o),s-=g,a+=g,f-=g,o+=g,n.length-=g;break}n.mode=Y;break;case q:for(;h<14;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(n.nlen=257+(31&l),l>>>=5,h-=5,n.ndist=1+(31&l),l>>>=5,h-=5,n.ncode=4+(15&l),l>>>=4,h-=4,n.nlen>286||n.ndist>30){e.msg="too many length or distance symbols",n.mode=de;break}n.have=0,n.mode=J;case J:for(;n.have<n.ncode;){for(;h<3;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.lens[Re[n.have++]]=7&l,l>>>=3,h-=3}for(;n.have<19;)n.lens[Re[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,pe={bits:n.lenbits},ve=v(p,n.lens,0,19,n.lencode,0,n.work,pe),n.lenbits=pe.bits,ve){e.msg="invalid code lengths set",n.mode=de;break}n.have=0,n.mode=$;case $:for(;n.have<n.nlen+n.ndist;){for(;ue=(Ee=n.lencode[l&(1<<n.lenbits)-1])>>>16&255,we=65535&Ee,!((he=Ee>>>24)<=h);){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(we<16)l>>>=he,h-=he,n.lens[n.have++]=we;else{if(16===we){for(ye=he+2;h<ye;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(l>>>=he,h-=he,0===n.have){e.msg="invalid bit length repeat",n.mode=de;break}_e=n.lens[n.have-1],g=3+(3&l),l>>>=2,h-=2}else if(17===we){for(ye=he+3;h<ye;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}h-=he,_e=0,g=3+(7&(l>>>=he)),l>>>=3,h-=3}else{for(ye=he+7;h<ye;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}h-=he,_e=0,g=11+(127&(l>>>=he)),l>>>=7,h-=7}if(n.have+g>n.nlen+n.ndist){e.msg="invalid bit length repeat",n.mode=de;break}for(;g--;)n.lens[n.have++]=_e}}if(n.mode===de)break;if(0===n.lens[256]){e.msg="invalid code -- missing end-of-block",n.mode=de;break}if(n.lenbits=9,pe={bits:n.lenbits},ve=v(y,n.lens,0,n.nlen,n.lencode,0,n.work,pe),n.lenbits=pe.bits,ve){e.msg="invalid literal/lengths set",n.mode=de;break}if(n.distbits=6,n.distcode=n.distdyn,pe={bits:n.distbits},ve=v(E,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,pe),n.distbits=pe.bits,ve){e.msg="invalid distances set",n.mode=de;break}if(n.mode=ee,t===T)break e;case ee:n.mode=te;case te:if(s>=6&&f>=258){e.next_out=o,e.avail_out=f,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=h,w(e,m),o=e.next_out,r=e.output,f=e.avail_out,a=e.next_in,i=e.input,s=e.avail_in,l=n.hold,h=n.bits,n.mode===Y&&(n.back=-1);break}for(n.back=0;ue=(Ee=n.lencode[l&(1<<n.lenbits)-1])>>>16&255,we=65535&Ee,!((he=Ee>>>24)<=h);){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(ue&&0==(240&ue)){for(me=he,ge=ue,ke=we;ue=(Ee=n.lencode[ke+((l&(1<<me+ge)-1)>>me)])>>>16&255,we=65535&Ee,!(me+(he=Ee>>>24)<=h);){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}l>>>=me,h-=me,n.back+=me}if(l>>>=he,h-=he,n.back+=he,n.length=we,0===ue){n.mode=oe;break}if(32&ue){n.back=-1,n.mode=Y;break}if(64&ue){e.msg="invalid literal/length code",n.mode=de;break}n.extra=15&ue,n.mode=ne;case ne:if(n.extra){for(ye=n.extra;h<ye;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.length+=l&(1<<n.extra)-1,l>>>=n.extra,h-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=ie;case ie:for(;ue=(Ee=n.distcode[l&(1<<n.distbits)-1])>>>16&255,we=65535&Ee,!((he=Ee>>>24)<=h);){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(0==(240&ue)){for(me=he,ge=ue,ke=we;ue=(Ee=n.distcode[ke+((l&(1<<me+ge)-1)>>me)])>>>16&255,we=65535&Ee,!(me+(he=Ee>>>24)<=h);){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}l>>>=me,h-=me,n.back+=me}if(l>>>=he,h-=he,n.back+=he,64&ue){e.msg="invalid distance code",n.mode=de;break}n.offset=we,n.extra=15&ue,n.mode=re;case re:if(n.extra){for(ye=n.extra;h<ye;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}n.offset+=l&(1<<n.extra)-1,l>>>=n.extra,h-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg="invalid distance too far back",n.mode=de;break}n.mode=ae;case ae:if(0===f)break e;if(g=m-f,n.offset>g){if((g=n.offset-g)>n.whave&&n.sane){e.msg="invalid distance too far back",n.mode=de;break}g>n.wnext?(g-=n.wnext,k=n.wsize-g):k=n.wnext-g,g>n.length&&(g=n.length),_=n.window}else _=r,k=o-n.offset,g=n.length;g>f&&(g=f),f-=g,n.length-=g;do{r[o++]=_[k++]}while(--g);0===n.length&&(n.mode=te);break;case oe:if(0===f)break e;r[o++]=n.length,f--,n.mode=te;break;case se:if(n.wrap){for(;h<32;){if(0===s)break e;s--,l|=i[a++]<<h,h+=8}if(m-=f,e.total_out+=m,n.total+=m,m&&(e.adler=n.check=n.flags?u(n.check,r,m,o-m):c(n.check,r,m,o-m)),m=f,(n.flags?l:be(l))!==n.check){e.msg="incorrect data check",n.mode=de;break}l=0,h=0}n.mode=fe;case fe:if(n.wrap&&n.flags){for(;h<32;){if(0===s)break e;s--,l+=i[a++]<<h,h+=8}if(l!==(4294967295&n.total)){e.msg="incorrect length check",n.mode=de;break}l=0,h=0}n.mode=le;case le:ve=A;break e;case de:ve=Z;break e;case ce:return I;default:return U}return e.next_out=o,e.avail_out=f,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=h,(n.wsize||m!==e.avail_out&&n.mode<de&&(n.mode<se||t!==x))&&Se(e,e.output,e.next_out,m-e.avail_out),b-=e.avail_in,m-=e.avail_out,e.total_in+=b,e.total_out+=m,n.total+=m,n.wrap&&m&&(e.adler=n.check=n.flags?u(n.check,r,m,e.next_out-m):c(n.check,r,m,e.next_out-m)),e.data_type=n.bits+(n.last?64:0)+(n.mode===Y?128:0)+(n.mode===ee||n.mode===W?256:0),(0===b&&0===m||t===x)&&ve===R&&(ve=D),ve},inflateEnd:function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,R},inflateGetHeader:function(e,t){var n;return e&&e.state?0==(2&(n=e.state).wrap)?U:(n.head=t,t.done=!1,R):U},inflateSetDictionary:function(e,t){var n,i=t.length;return e&&e.state?0!==(n=e.state).wrap&&n.mode!==j?U:n.mode===j&&c(1,t,i,0)!==n.check?Z:Se(e,t,i,i)?(n.mode=ce,I):(n.havedict=1,R):U},inflateInfo:"pako inflate (from Nodeca project)"},Re=!0,Ae=!0;try{String.fromCharCode.apply(null,[0])}catch(e){Re=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){Ae=!1}for(var Be=new d.Buf8(256),Ue=0;Ue<256;Ue++)Be[Ue]=Ue>=252?6:Ue>=248?5:Ue>=240?4:Ue>=224?3:Ue>=192?2:1;Be[254]=Be[254]=1;function Ze(e,t){if(t<65534&&(e.subarray&&Ae||!e.subarray&&Re))return String.fromCharCode.apply(null,d.shrinkBuf(e,t));for(var n="",i=0;i<t;i++)n+=String.fromCharCode(e[i]);return n}var Ie={string2buf:function(e){var t,n,i,r,a,o=e.length,s=0;for(r=0;r<o;r++)55296==(64512&(n=e.charCodeAt(r)))&&r+1<o&&56320==(64512&(i=e.charCodeAt(r+1)))&&(n=65536+(n-55296<<10)+(i-56320),r++),s+=n<128?1:n<2048?2:n<65536?3:4;for(t=new d.Buf8(s),a=0,r=0;a<s;r++)55296==(64512&(n=e.charCodeAt(r)))&&r+1<o&&56320==(64512&(i=e.charCodeAt(r+1)))&&(n=65536+(n-55296<<10)+(i-56320),r++),n<128?t[a++]=n:n<2048?(t[a++]=192|n>>>6,t[a++]=128|63&n):n<65536?(t[a++]=224|n>>>12,t[a++]=128|n>>>6&63,t[a++]=128|63&n):(t[a++]=240|n>>>18,t[a++]=128|n>>>12&63,t[a++]=128|n>>>6&63,t[a++]=128|63&n);return t},buf2binstring:function(e){return Ze(e,e.length)},binstring2buf:function(e){for(var t=new d.Buf8(e.length),n=0,i=t.length;n<i;n++)t[n]=e.charCodeAt(n);return t},buf2string:function(e,t){var n,i,r,a,o=t||e.length,s=new Array(2*o);for(i=0,n=0;n<o;)if((r=e[n++])<128)s[i++]=r;else if((a=Be[r])>4)s[i++]=65533,n+=a-1;else{for(r&=2===a?31:3===a?15:7;a>1&&n<o;)r=r<<6|63&e[n++],a--;a>1?s[i++]=65533:r<65536?s[i++]=r:(r-=65536,s[i++]=55296|r>>10&1023,s[i++]=56320|1023&r)}return Ze(s,i)},utf8border:function(e,t){var n;for((t=t||e.length)>e.length&&(t=e.length),n=t-1;n>=0&&128==(192&e[n]);)n--;return n<0||0===n?t:n+Be[e[n]]>t?n:t}},De={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8},Oe={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};var Ne=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};var Ce=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1},Fe=Object.prototype.toString;function Le(e){if(!(this instanceof Le))return new Le(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new Ne,this.strm.avail_out=0;var n=Te.inflateInit2(this.strm,t.windowBits);if(n!==De.Z_OK)throw new Error(Oe[n]);if(this.header=new Ce,Te.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=Ie.string2buf(t.dictionary):"[object ArrayBuffer]"===Fe.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(n=Te.inflateSetDictionary(this.strm,t.dictionary))!==De.Z_OK))throw new Error(Oe[n])}function He(e,t){var n=new Le(t);if(n.push(e,!0),n.err)throw n.msg||Oe[n.err];return n.result}Le.prototype.push=function(e,t){var n,i,r,a,o,s=this.strm,f=this.options.chunkSize,l=this.options.dictionary,c=!1;if(this.ended)return!1;i=t===~~t?t:!0===t?De.Z_FINISH:De.Z_NO_FLUSH,"string"==typeof e?s.input=Ie.binstring2buf(e):"[object ArrayBuffer]"===Fe.call(e)?s.input=new Uint8Array(e):s.input=e,s.next_in=0,s.avail_in=s.input.length;do{if(0===s.avail_out&&(s.output=new d.Buf8(f),s.next_out=0,s.avail_out=f),(n=Te.inflate(s,De.Z_NO_FLUSH))===De.Z_NEED_DICT&&l&&(n=Te.inflateSetDictionary(this.strm,l)),n===De.Z_BUF_ERROR&&!0===c&&(n=De.Z_OK,c=!1),n!==De.Z_STREAM_END&&n!==De.Z_OK)return this.onEnd(n),this.ended=!0,!1;s.next_out&&(0!==s.avail_out&&n!==De.Z_STREAM_END&&(0!==s.avail_in||i!==De.Z_FINISH&&i!==De.Z_SYNC_FLUSH)||("string"===this.options.to?(r=Ie.utf8border(s.output,s.next_out),a=s.next_out-r,o=Ie.buf2string(s.output,r),s.next_out=a,s.avail_out=f-a,a&&d.arraySet(s.output,s.output,r,a,0),this.onData(o)):this.onData(d.shrinkBuf(s.output,s.next_out)))),0===s.avail_in&&0===s.avail_out&&(c=!0)}while((s.avail_in>0||0===s.avail_out)&&n!==De.Z_STREAM_END);return n===De.Z_STREAM_END&&(i=De.Z_FINISH),i===De.Z_FINISH?(n=Te.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===De.Z_OK):i!==De.Z_SYNC_FLUSH||(this.onEnd(De.Z_OK),s.avail_out=0,!0)},Le.prototype.onData=function(e){this.chunks.push(e)},Le.prototype.onEnd=function(e){e===De.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg};var ze={Inflate:Le,inflate:He,inflateRaw:function(e,t){return(t=t||{}).raw=!0,He(e,t)},ungzip:He};const Pe=Uint16Array.BYTES_PER_ELEMENT,Me=Int32Array.BYTES_PER_ELEMENT,Ve=Uint32Array.BYTES_PER_ELEMENT,Ke={METADATA:0,TERRAIN:1,DBROOT:2};Ke.fromString=function(e){return"Metadata"===e?Ke.METADATA:"Terrain"===e?Ke.TERRAIN:"DbRoot"===e?Ke.DBROOT:void 0};const je=32301;const Ye=5,Ge=4;const Qe=1953029805,We=2917034100;return i((function(t,n){const i=Ke.fromString(t.type);let r=t.buffer;o(t.key,r);const a=function(t){const n=new DataView(t);let i=0;const r=n.getUint32(i,!0);if(i+=Ve,r!==Qe&&r!==We)throw new e.RuntimeError("Invalid magic");const a=n.getUint32(i,r===Qe);i+=Ve;const o=new Uint8Array(t,i),s=ze.inflate(o);if(s.length!==a)throw new e.RuntimeError("Size of packet doesn't match header");return s}(r);r=a.buffer;const s=a.length;switch(i){case Ke.METADATA:return function(t,n,i){const r=new DataView(t);let a=0;const o=r.getUint32(a,!0);if(a+=Ve,o!==je)throw new e.RuntimeError("Invalid magic");const s=r.getUint32(a,!0);if(a+=Ve,1!==s)throw new e.RuntimeError("Invalid data type. Must be 1 for QuadTreePacket");const f=r.getUint32(a,!0);if(a+=Ve,2!==f)throw new e.RuntimeError("Invalid QuadTreePacket version. Only version 2 is supported.");const d=r.getInt32(a,!0);a+=Me;const c=r.getInt32(a,!0);if(a+=Me,32!==c)throw new e.RuntimeError("Invalid instance size.");const h=r.getInt32(a,!0);a+=Me;const u=r.getInt32(a,!0);a+=Me;const w=r.getInt32(a,!0);if(a+=Me,h!==d*c+a)throw new e.RuntimeError("Invalid dataBufferOffset");if(h+u+w!==n)throw new e.RuntimeError("Invalid packet offsets");const b=[];for(let e=0;e<d;++e){const e=r.getUint8(a);++a,++a;const t=r.getUint16(a,!0);a+=Pe;const n=r.getUint16(a,!0);a+=Pe;const i=r.getUint16(a,!0);a+=Pe,a+=Pe,a+=Pe,a+=Me,a+=Me,a+=8;const o=r.getUint8(a++),s=r.getUint8(a++);a+=Pe,b.push(new l(e,t,n,i,o,s))}const m=[];let g=0;function k(e,t,n){let i=!1;if(4===n){if(t.hasSubtree())return;i=!0}for(let r=0;r<4;++r){const a=e+r.toString();if(i)m[a]=null;else if(n<4)if(t.hasChild(r)){if(g===d)return void console.log("Incorrect number of instances");const e=b[g++];m[a]=e,k(a,e,n+1)}else m[a]=null}}let _=0;const v=b[g++];""===i?++_:m[i]=v;return k(i,v,_),m}(r,s,t.quadKey);case Ke.TERRAIN:return function(t,n,i){const r=new DataView(t),a=function(t){for(let i=0;i<Ge;++i){const i=r.getUint32(t,!0);if(t+=Ve,(t+=i)>n)throw new e.RuntimeError("Malformed terrain packet found.")}return t};let o=0;const s=[];for(;s.length<Ye;){const e=o;o=a(o);const n=t.slice(e,o);i.push(n),s.push(n)}return s}(r,s,n);case Ke.DBROOT:return n.push(r),{buffer:r}}}))}));