!function(t){var i={};function s(e){if(i[e])return i[e].exports;var h=i[e]={i:e,l:!1,exports:{}};return t[e].call(h.exports,h,h.exports,s),h.l=!0,h.exports}s.m=t,s.c=i,s.d=function(t,i,e){s.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:e})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,i){if(1&i&&(t=s(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(s.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var h in t)s.d(e,h,function(i){return t[i]}.bind(null,h));return e},s.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(i,"a",i),i},s.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},s.p="",s(s.s=0)}([function(t,i,s){"use strict";s.r(i);class e{constructor(t=0,i=0){this.x=t,this.y=i}static fromPolar(t,i,s=i){const e=i*Math.cos(t),h=s*Math.sin(t);return new this(Math.floor(e),Math.floor(h))}static add(t,i){return new this(t.x+i.x,t.y+i.y)}static sub(t,i){return new this(t.x-i.x,t.y-i.y)}static eq(t,i){return t.x===i.x&&t.y===i.y}add(t){return this.x+=t.x,this.y+=t.y,this}addX(t){return this.x+=t,this}addY(t){return this.y+=t,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subX(t){return this.x-=t,this}subY(t){return this.y-=t,this}mul(t){return this.x=this.x*t,this.y=this.y*t,this}div(t){if(0!==t)return this.x=this.x/t,this.y=this.y/t,this}get magnitude(){return Math.hypot(this.x,this.y)}normalize(){return this.div(this.magnitude),this}getDistance(t={x:0,y:0}){const i=t.x-this.x,s=t.y-this.y;return Math.hypot(i,s)}getAngle(t={x:0,y:0}){return Math.atan2(this.y-t.y,this.x-t.x)}getMiddle(t){const i=.5*(this.x+t.x),s=.5*(this.y+t.y);return new e(i,s)}eq(t){return this.x===t.x&&this.y===t.y}isOpposite(t){return!this.eq(t)&&(this.x===-t.x&&this.y===-t.y)}copy(){return new e(this.x,this.y)}set(t){return this.x=t.x,this.y=t.y,this}change(t,i){return this.x=t,this.y=i,this}}function h(t,i,s=!0){return s?Math.floor(Math.random()*(i-t+1)+t):Math.random()*(i-t)+t}function r(t,i,s=4,e=1){let h=0;for(let t=s;t>0;t--)h+=Math.random();return(h=Math.pow(h/s,e))*(i-t)+t}class n{constructor({h:t,s:i,l:s,a:e=1}){this.original={h:t,s:i,l:s,a:e},[this.h,this.s,this.l,this.a]=[t,i,s,e]}static getRandom(){return{h:h(0,300),s:h(0,100),l:h(0,100),a:Math.random()}}reset(){return[this.h,this.s,this.l,this.a]=this.original,this}toOpposite(){return this.h=(this.h+180)%300,this.s=(this.s+50)%100,this.l=(this.l+50)%100,this.a=(this.a+.5)%1,this}randomize({maxH:t=150,maxS:i=10,maxL:s=10,maxA:e=.2}={}){return this.h=(h(0,t)+this.h)%300,this.s=(h(0,i)+this.s)%100,this.l=(h(0,s)+this.l)%100,this.a=(h(0,e)+this.a)%1,this}addH(t){return this.h=(this.h+t)%300,this}addS(t){return this.s=(this.s+t)%100,this}addL(t){return this.l=(this.l+t)%100,this}addA(t){return this.a=(this.a+t)%1,this}get hsl(){return`hsl(${this.h}, ${this.s}%, ${this.l}%)`}get hsla(){return`hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`}hslToRgb(){let t,i,s;if(0==this.s)t=i=s=this.l;else{function e(t,i,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?t+6*(i-t)*s:s<.5?i:s<2/3?t+(i-t)*(2/3-s)*6:t}const h=this.l<.5?this.l*(1+this.s):this.l+this.s-this.l*this.s,r=2*this.l-h;t=e(r,h,this.h+1/3),i=e(r,h,this.h),s=e(r,h,this.h-1/3)}return{r:255*t,g:255*i,b:255*s,a:this.a}}}class a{constructor({ctx:t,radius:i,position:s,velocity:h=new e,damping:r=.9,fixed:n=!1,boundaries:a={n:0,s:t.canvas.clientHeight,w:0,e:t.canvas.clientWidth},G:o=4,minDistance:l=5,maxDistance:c=25}){this.ctx=t,this.boundaries=a,this.radius=i,this.fixed=n,this.position=s,this.velocity=h,this.acceleration=new e,this.damping=r,this.G=o,this.minDistance=l,this.maxDistance=c}applyForce(t){this.acceleration.add(t)}update(){this.fixed||(this.velocity.add(this.acceleration),this.velocity.mul(this.damping),this.position.add(this.velocity),this.checkEdges(),this.acceleration.mul(0))}draw(){!function(t,i,s){t.beginPath(),t.arc(s.x,s.y,i,0,2*Math.PI,!1),t.closePath()}(this.ctx,this.radius,this.position),this.ctx.fill()}checkEdges(){(this.position.x>this.boundaries.e||this.position.x<this.boundaries.w)&&(this.position.x=this.position.x>this.boundaries.e?this.boundaries.e:this.boundaries.w,this.velocity.x*=-1),(this.position.y>this.boundaries.s||this.position.y<this.boundaries.n)&&(this.position.y=this.position.y>this.boundaries.s?this.boundaries.s:this.boundaries.n,this.velocity.y*=-1)}attract(t){let i=e.sub(this.position,t.position),s=i.magnitude;s=function(t,i,s){return Math.min(Math.max(t,i),s)}(s,this.minDistance,this.maxDistance);const h=this.G/(s*s);return i.normalize().mul(h),i}}class o{constructor({ctx:t,a:i,b:s,restLength:e=i.getDistance(s),strength:h=.1}){this.ctx=t,this.a=i,this.b=s,this.restLength=e,this.strength=h}update(){let t=e.sub(this.a.position,this.b.position),i=t.magnitude-this.restLength;t.normalize().mul(-1*this.strength*i),this.a.dragging||this.a.applyForce(t),this.b.dragging||(t.mul(-1),this.b.applyForce(t))}draw(){this.ctx.beginPath(),this.ctx.moveTo(this.a.position.x,this.a.position.y),this.ctx.lineTo(this.b.position.x,this.b.position.y),this.ctx.stroke()}}class l{constructor({ctx:t,rowNumber:i,colNumber:s=i,sep:h,radius:r,origin:n,boundaries:o=null}){this.ctx=t,this.origin=n,this.sep=h,this.rowNumber=i,this.colNumber=s,this.width=s*h,this.height=i*h;const l=new e(i/2-.5,i/2-.5);this.particles=Array.from({length:i*i},(i,s)=>{let c=new a({ctx:t,radius:r,position:new e((this.col(s)-l.x)*h+n.x,(this.row(s)-l.y)*h+n.y)});return o&&(c.boundaries=o),c}),this.structuralSprings=[],this.shearSprings=[],this.bendSprings=[]}col(t){return t%this.rowNumber}row(t){return Math.floor(t/this.rowNumber)}lockParticles(...t){t.length>0&&t.forEach(t=>this.particles[t].fixed=!0)}setStructuralSprings(t,i=this.sep){for(let[s,e]of this.particles.entries())this.col(s)<this.rowNumber-1&&this.structuralSprings.push(new o({ctx:this.ctx,restLength:i,strength:t,a:e,b:this.particles[s+1]})),this.row(s)<this.rowNumber-1&&this.structuralSprings.push(new o({ctx:this.ctx,restLength:i,strength:t,a:e,b:this.particles[s+this.rowNumber]}))}setShearSprings(t,i=this.sep*Math.SQRT2){for(let[s,e]of this.particles.entries())this.col(s)>0&&this.row(s)<this.rowNumber-1&&this.shearSprings.push(new o({ctx:this.ctx,restLength:i,strength:t,a:e,b:this.particles[s+this.rowNumber-1]})),this.col(s)<this.rowNumber-1&&this.row(s)<this.rowNumber-1&&this.shearSprings.push(new o({ctx:this.ctx,restLength:i,strength:t,a:e,b:this.particles[s+this.rowNumber+1]}))}setBendSprings(t){for(let[i,s]of this.particles.entries())this.col(i)<this.rowNumber-2&&this.bendSprings.push(new o({ctx:this.ctx,restLength:2*this.sep,strength:t,a:s,b:this.particles[i+2]})),this.row(i)<this.rowNumber-2&&this.bendSprings.push(new o({ctx:this.ctx,restLength:2*this.sep,strength:t,a:s,b:this.particles[i+2*this.rowNumber]}))}update(...t){this.structuralSprings.forEach(t=>t.update()),this.shearSprings.length>0&&this.shearSprings.forEach(t=>t.update()),this.bendSprings.length>0&&this.bendSprings.forEach(t=>t.update()),this.particles.forEach(i=>{t.length>0&&t.forEach(t=>i.applyForce(t)),i.update()})}drawStructuralSprings(){this.structuralSprings.forEach(t=>t.draw())}drawShearSprings(){this.shearSprings.forEach(t=>t.draw())}drawBendSprings(){this.bendSprings.forEach(t=>t.draw())}drawSprings(){this.drawStructuralSprings(),this.shearSprings.length>0&&this.drawShearSprings(),this.bendSprings.length>0&&this.drawBendSprings()}drawParticles(){this.particles.forEach(t=>t.draw())}}class c{constructor({type:t="sin",amp:i,freq:s=1,phase:e=0,vShift:h=0,angleVel:r,angle:n=0}){this.type=t,this.amp=i,this.freq=s,this.phase=e,this.vShift=h,this.angle=n,this.angleVel=r,this.orig={amp:i,freq:s,phase:e,vShift:h,angle:n,angleVel:r}}oscillate(t=this.angleVel){return this.angle+=t,this.amp*Math.cos(this.freq*this.angle+this.phase)+this.vShift}reset(){return Object.entries(this.orig).forEach((t,i)=>this[t]=i),this}copy(){return new this({amp:this.amp,freq:this.freq,phase:this.phase,vShift:this.vShift,angle:this.angle,angleVel:this.angleVel,type:this.type})}}(function({ctx:t}){const i=t.canvas.clientHeight,s=t.canvas.clientWidth,a=new e(s/2,i/2);new e(0,.1);let o=new l({ctx:t,rowNumber:10,origin:a,sep:s<500?22:40,radius:s<500?2:3}),u=new n({h:0,s:0,l:0,a:.3}),d=new n({h:5,s:40,l:0,a:.4});const p=new c({amp:10,vShift:10,angleVel:.008,angle:Math.PI}),g=new c({amp:10,vShift:70,angleVel:.04,angle:Math.PI}),f=Array(o.rowNumber).fill(0).map((t,i)=>{let s=o.rowNumber,e=o.sep;return{i:h(i*s,i*s+s-1),str:h(e/5,e,!1)}});o.setStructuralSprings(.4),t.fillStyle="#fff",t.fillRect(0,0,t.canvas.width,t.canvas.height),t.fillStyle=d.hsla,t.strokeStyle=u.hsla,t.lineWidth=.3;const x=t=>{o.drawStructuralSprings(),o.drawParticles()},y=i=>{u.l=p.oscillate(),t.strokeStyle=u.hsla,d.l=g.oscillate(),t.fillStyle=d.hsla;for(let{i:t,str:i}of f)o.particles[t].position.addX(r(-i,i)).addY(r(-i,i));o.update(new e(r(-.1,.1),r(-.1,.1)))},w=function(t,i=0,s=(t=>void 0)){let e,h=!1;const r=function(t){let i=0,s=0;const e=t;return t=>{let h=t-i;if(i=t,(s+=h)>e)return s=0,!0}}(i),n=t=>{h||(h=!0),e=window.requestAnimationFrame(o)},a=t=>{e&&(window.cancelAnimationFrame(e),e=void 0,h=!1)},o=(i=0)=>{s()?a():(r(i)&&t(),n())};return{start:n,stop:a,toggle:t=>{(h=!h)?n():a()},get animating(){return h}}}(t=>{x(),y()},0);return document.addEventListener("keyup",t=>{" "==t.key&&w.toggle()}),document.querySelector(".fig-caption button").addEventListener("click",t=>{w.toggle()}),{clean:e=>{t.clearRect(0,0,s,i)},draw:x,update:y,animation:w}})({ctx:function({selector:t="canvas",height:i=window.innerHeight,width:s=window.innerWidth}={}){const e=window.devicePixelRatio,h=document.querySelector(t);h.width=s*e,h.height=i*e;const r=h.getContext("2d");return r.scale(e,e),r}({width:document.body.clientWidth,height:document.body.clientWidth<500?280:455})}).animation.start()}]);