(()=>{"use strict";var e={148:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"black.png"},580:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"buttonRed.png"},121:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"laserRed08.png"},238:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"laserRed16.png"},389:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"playerLife2_red.png"},594:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"playerShip2_red.png"},453:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"powerupBlue_star.png"},720:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"powerupRed_star.png"},656:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"powerupYellow_bolt.png"},422:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceEffects_002.png"},822:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceEffects_013.png"},679:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceEffects_014.png"},294:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceEffects_015.png"},208:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceEffects_016.png"},660:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceMeteors_001.png"},825:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceMeteors_002.png"},701:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceMeteors_003.png"},744:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceMeteors_004.png"},160:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceMissiles_012.png"},492:(e,t,a)=>{a.r(t),a.d(t,{default:()=>s});const s=a.p+"spaceRockets_001.png"},32:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.collideLaserWithMeteors=t.collideProjectilesAndMeteors=t.collidePlayerWithMeteors=void 0;const s=a(352),i=a(512),r=a(112),n=a(775),o=a(882);t.collidePlayerWithMeteors=function(){const e=s.Game.meteors.filter((e=>(0,o.euclDistance)(s.Game.player.x,s.Game.player.y,e.x,e.y)<s.Game.player.size+e.size()));e.length>0&&(s.Game.meteors=s.Game.meteors.filter((t=>!e.includes(t))),e.forEach((e=>{s.Game.smokes.push(new i.Smoke(e.x,e.y))})),s.Game.score+=10*e.length,s.Game.player.hit()),s.Game.gameOver=s.Game.player.isDead()},t.collideProjectilesAndMeteors=function(){(0,o.arrayCrossProduct)(s.Game.meteors,s.Game.projectiles).forEach((([e,t])=>{const a=e.x-t.x,r=e.y-t.y;if(Math.sqrt(a*a+r*r)<e.size()+t.size){const a=e.takeDamage(n.Projectile.DAMAGE);s.Game.score+=a,e.isDead()&&(s.Game.smokes.push(new i.Smoke(e.x,e.y)),s.Game.meteors=s.Game.meteors.filter((t=>t!==e))),s.Game.projectiles=s.Game.projectiles.filter((e=>e!==t))}}))},t.collideLaserWithMeteors=function(e,t){e.hit=null;let a=1/0,n=null;e.isFiring()&&s.Game.meteors.forEach((t=>{const s=e.getPosition(),i=(0,o.intersectRayAndCircle)(s.x,s.y,e.getAngle(),t.x,t.y,t.size());if(null!==i){const l=(0,o.euclDistance)(s.x,s.y,i.x,i.y);l<a&&(e.hit=new r.LaserHit(i.x,i.y,e),a=l,n=t)}}));const l=null==n?void 0:n.takeDamage(s.Game.player.laser.getDps()*t);s.Game.score+=null!=l?l:0,(null==n?void 0:n.isDead())&&(s.Game.meteors=s.Game.meteors.filter((e=>e!==n)),s.Game.smokes.push(new i.Smoke(n.x,n.y)))}},913:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.FORCE_GAME_OVER=t.DEBUG_DIFFICULTY=t.FORCE_POWERUP=t.INVINCIBILITY=t.DEBUG_HP=t.DEBUG_COLLISIONS=void 0,t.DEBUG_COLLISIONS=!1,t.DEBUG_HP=!1,t.INVINCIBILITY=!1,t.FORCE_POWERUP=!0,t.DEBUG_DIFFICULTY=!1,t.FORCE_GAME_OVER=!1},611:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.drawGameOver=t.drawHud=void 0;const s=a(913),i=a(352),r=a(850);function n(e,t,a,s){e.drawImage(s,t,a,24,24)}t.drawHud=function(){const e=20;var t,a;if(t=i.Game.ctx,e,40,a=i.Game.score,t.font="24px Arial",t.fillStyle="white",t.fillText(`Score: ${a.toFixed(0)}`,20,40),function(e,t,a,s){for(let t=0;t<s;t++)e.drawImage(r.default.SHIP,20+34*t,60,24,24)}(i.Game.ctx,0,0,i.Game.player.lives),function(e,t,a,s){s.isLaserEquipped()?e.drawImage(r.default.LASER_HIT,20,105,24,24):e.drawImage(r.default.PROJECTILE,20,105,24,24)}(i.Game.ctx,0,0,i.Game.player),null!==i.Game.projectileBurstAttack&&!i.Game.projectileBurstAttack.isActive){const t=110;n(i.Game.ctx,e,40+t,r.default.POWERUP_RED_STAR)}if(null!==i.Game.rocketLaser&&!i.Game.rocketLaser.isActive){const t=110,a=40;n(i.Game.ctx,e+a,40+t,r.default.POWERUP_BLUE_STAR)}if(i.Game.player.isWeaponUpgraded()){const t=180;!function(e,t,a,s){e.drawImage(r.default.POWERUP_YELLOW_BOLT,t,20,24,24),e.font="24px Arial",e.fillStyle="white",e.fillText((s/1e3).toFixed(1),t+35,40)}(i.Game.ctx,e+t,0,i.Game.player.getWeaponUpgradeTimeLeft())}if(s.DEBUG_DIFFICULTY){const e=300;!function(e,t,a,s){e.font="24px Arial",e.fillStyle="white",e.fillText(`Difficulty: ${s}`,t,40)}(i.Game.ctx,i.Game.canvas.width-e,0,i.Game.meteorSpawner.getDifficultyMultiplier())}},t.drawGameOver=function(){const e=i.Game.canvas.width/2,t=i.Game.canvas.height/2;i.Game.ctx.drawImage(r.default.BUTTON_RED,e-175,t-75-150,350,150),i.Game.ctx.fillStyle="black",i.Game.ctx.font="48px Arial",i.Game.ctx.fillText("Game Over",e-175+45,t-75-150+70),i.Game.ctx.font="24px Arial",i.Game.ctx.fillText("Click to restart",e-175+90,t-75-150+110)}},352:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.runGameLoop=t.initGame=t.shakeScreen=t.initCanvas=t.Game=void 0;const s=a(374),i=a(52),r=a(850),n=a(590),o=a(644),l=a(611),c=a(32),u=a(913);class h{}function p(){var e,t,a,s;h.ctx.clearRect(0,0,h.canvas.width,h.canvas.height);const i=h.ctx.createPattern(r.default.BLACK_BACKGROUND,"repeat");h.ctx.fillStyle=i,h.ctx.fillRect(0,0,h.canvas.width,h.canvas.height),h.projectiles.forEach((e=>e.draw(h.ctx))),h.meteors.forEach((e=>e.draw(h.ctx))),h.smokes.forEach((e=>e.draw(h.ctx))),h.player.draw(h.ctx),null===(e=h.projectileBurstPowerup)||void 0===e||e.draw(h.ctx),null===(t=h.rocketLaserPowerup)||void 0===t||t.draw(h.ctx),null===(a=h.weaponUpgradePowerup)||void 0===a||a.draw(h.ctx),null===(s=h.rocketLaser)||void 0===s||s.draw(h.ctx),(0,l.drawHud)()}function d(e,t,a){return e+a<-100||e-a>h.canvas.width+100||t+a<-100||t-a>h.canvas.height+100}t.Game=h,h.lastTimestamp=0,h.gameOver=!1,h.score=0,h.projectileBurstAttack=null,h.projectiles=[],h.meteors=[],h.smokes=[],h.projectileBurstPowerup=null,h.rocketLaserPowerup=null,h.weaponUpgradePowerup=null,h.rocketLaser=null,t.initCanvas=function(){h.canvas=document.getElementById("canvas"),h.canvas.width=window.innerWidth,h.canvas.height=window.innerHeight,h.ctx=h.canvas.getContext("2d")},t.shakeScreen=function(){const e=Date.now()+200;let t=0,a=0;const s=setInterval((()=>{h.ctx.translate(-t,-a),Date.now()>=e?clearInterval(s):(t=10*Math.random()*2-10,a=10*Math.random()*2-10,h.ctx.translate(t,a))}),10)},t.initGame=function(){h.player=new s.Player(h.canvas.width/2,h.canvas.height/2),h.meteorSpawner=new i.MeteorSpawner(h.canvas.width,h.canvas.height,h.player),h.powerupSpawner=new o.PowerupSpawner(h.canvas.width,h.canvas.height,h.player),h.lastTimestamp=0,h.gameOver=!1,h.score=0,h.projectileBurstAttack=null,h.projectiles=[],h.meteors=[],h.smokes=[],h.projectileBurstPowerup=null,h.rocketLaserPowerup=null,h.weaponUpgradePowerup=null,h.rocketLaser=null},t.runGameLoop=function e(){if(u.FORCE_GAME_OVER||h.gameOver)return p(),void(0,l.drawGameOver)();requestAnimationFrame(e);const t=(Date.now()-h.lastTimestamp)/1e3;var a;!function(e){var t,a,s,i;h.player.update(e),h.projectiles.forEach((t=>t.update(e))),h.meteors.forEach((t=>t.update(e))),h.smokes.forEach((t=>t.update(e))),null===(t=h.projectileBurstPowerup)||void 0===t||t.update(e),null===(a=h.rocketLaserPowerup)||void 0===a||a.update(e),null===(s=h.weaponUpgradePowerup)||void 0===s||s.update(e),null===(i=h.rocketLaser)||void 0===i||i.update(e)}(t),h.lastTimestamp=Date.now(),function(e){(0,c.collidePlayerWithMeteors)(),(0,c.collideProjectilesAndMeteors)(),(0,c.collideLaserWithMeteors)(h.player.laser,e),null!==h.rocketLaser&&(0,c.collideLaserWithMeteors)(h.rocketLaser.laser,e)}(t),h.meteors=h.meteors.filter((e=>!d(e.x,e.y,e.size()))),h.projectiles=h.projectiles.filter((e=>!d(e.x,e.y,e.size))),h.smokes=h.smokes.filter((e=>!e.isDead())),(null===(a=h.projectileBurstAttack)||void 0===a?void 0:a.isDone())&&(h.projectileBurstAttack=null),null!==h.rocketLaser&&d(h.rocketLaser.x,h.rocketLaser.y,n.RocketLaser.LENGTH)&&(h.rocketLaser=null),function(){var e;h.meteorSpawner.shouldSpawn()&&h.meteorSpawner.spawn(),h.powerupSpawner.shouldSpawn()&&h.powerupSpawner.spawn(),null===(e=h.projectileBurstAttack)||void 0===e||e.use()}(),p()}},575:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AnimatedObject=void 0,t.AnimatedObject=class{}},112:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LaserHit=t.Laser=void 0;const s=a(850),i=a(882),r=a(575);class n extends r.AnimatedObject{constructor(e){super(),this.canFitLaser=e,this.isActive=!1,this.hit=null}activate(){this.isActive=!0}deactivate(){this.isActive=!1}isFiring(){return this.isActive&&this.canFitLaser.isLaserEquipped()}getDps(){return this.canFitLaser.getLaserDps()}getPosition(){return this.canFitLaser.getLaserPosition()}getAngle(){return this.canFitLaser.getLaserAngle()}draw(e){var t;if(!this.isActive)return;const a=this.canFitLaser.getLaserPosition(),r=this.canFitLaser.getLaserAngle();e.translate(a.x,a.y),e.rotate(r-Math.PI/2);const o=this.hit?(0,i.euclDistance)(this.hit.x,this.hit.y,a.x,a.y):2e3,l=this.getDps()>300?n.WIDTH_L:n.WIDTH_S;e.drawImage(s.default.LASER,-l/2,0,l,o),e.rotate(-r+Math.PI/2),e.translate(-a.x,-a.y),null===(t=this.hit)||void 0===t||t.draw(e)}update(e){var t;null===(t=this.hit)||void 0===t||t.update(e)}}t.Laser=n,n.WIDTH_S=10,n.WIDTH_L=30;class o extends r.AnimatedObject{constructor(e,t,a){super(),this.x=e,this.y=t,this.laser=a}draw(e){const t=this.laser.getDps()>300?o.UPGRADED_SIZE:o.SIZE;e.drawImage(s.default.LASER_HIT,this.x-t,this.y-t,2*t,2*t)}update(e){}}t.LaserHit=o,o.SIZE=20,o.UPGRADED_SIZE=40},512:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Smoke=t.Meteor=void 0;const s=a(913),i=a(850),r=a(882),n=a(575);class o extends n.AnimatedObject{constructor(e,t,a,s,i){super(),this.x=e,this.y=t,this.hp=a,this.velocity=s,this.angle=i,this.meteorType=Math.floor(4*Math.random())}draw(e){let t;switch(this.meteorType){case 0:default:t=i.default.METEOR_1;break;case 1:t=i.default.METEOR_2;break;case 2:t=i.default.METEOR_3;break;case 3:t=i.default.METEOR_4}const a=this.size();e.drawImage(t,this.x-a,this.y-a,2*a,2*a),s.DEBUG_COLLISIONS&&(0,r.drawCircle)(e,this.x,this.y,this.size(),null,"blue"),s.DEBUG_HP&&(e.fillStyle="red",e.font="18px Arial",e.fillText(this.hp.toFixed(0).toString(),this.x-10,this.y))}update(e){this.x+=this.velocity*Math.cos(this.angle)*e,this.y+=this.velocity*Math.sin(this.angle)*e}takeDamage(e){const t=Math.min(this.hp,e);return this.hp-=e,t}size(){return this.hp/2+o.MIN_SIZE}isDead(){return this.hp<=0}}t.Meteor=o,o.MIN_SIZE=20;class l extends n.AnimatedObject{constructor(e,t,a=20,s=1e3){super(),this.x=e,this.y=t,this.size=a,this.ttl=s,this.createdTimestamp=Date.now(),this.smokeType=Math.floor(4*Math.random())}draw(e){if(this.isDead())return;let t;switch(this.smokeType){case 0:default:t=i.default.SMOKE_1;break;case 1:t=i.default.SMOKE_2;break;case 2:t=i.default.SMOKE_3;break;case 3:t=i.default.SMOKE_4}e.drawImage(t,this.x-this.size,this.y-this.size,2*this.size,2*this.size)}update(e){}isDead(){return Date.now()-this.createdTimestamp>this.ttl}}t.Smoke=l},374:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Player=void 0;const s=a(882),i=a(850),r=a(913),n=a(575),o=a(352),l=a(112),c=a(775);var u;!function(e){e[e.LASER=0]="LASER",e[e.PROJECTILE=1]="PROJECTILE"}(u||(u={}));class h extends n.AnimatedObject{constructor(e,t,a=50,s=0){super(),this.x=e,this.y=t,this.size=a,this.angle=s,this.activeWeapon=u.PROJECTILE,this.weaponUpgradeStartTime=0,this.lives=3,this.lastHitTimestamp=0,this.laser=new l.Laser(this)}draw(e){e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),this.isInvincible()&&(e.globalAlpha=.4),e.drawImage(i.default.SHIP,-this.size,-this.size,2*this.size,2*this.size),e.globalAlpha=1,e.rotate(-this.angle-Math.PI/2),e.translate(-this.x,-this.y),r.DEBUG_COLLISIONS&&(0,s.drawCircle)(e,this.x,this.y,this.size,null,"blue"),this.laser.draw(e)}update(e){this.laser.update(e)}isLaserEquipped(){return this.activeWeapon===u.LASER}isProjectileEquipped(){return this.activeWeapon===u.PROJECTILE}isDead(){return this.lives<=0}isInvincible(){return r.INVINCIBILITY||Date.now()-this.lastHitTimestamp<h.INVINCIBILITY_DURATION}isWeaponUpgraded(){return Date.now()-this.weaponUpgradeStartTime<h.WEAPON_UPGRADE_TIME}getWeaponUpgradeTimeLeft(){return h.WEAPON_UPGRADE_TIME-(Date.now()-this.weaponUpgradeStartTime)}faceMouse(e,t){this.angle=Math.atan2(t-this.y,e-this.x)}hit(){this.isInvincible()||(this.lives--,this.lastHitTimestamp=Date.now(),(0,o.shakeScreen)())}fireProjectile(){const e=this.size,t=this.x+e*Math.cos(this.angle),a=this.y+e*Math.sin(this.angle);if(this.isWeaponUpgraded()){const e=.3;o.Game.projectiles.push(new c.Projectile(t,a,this.angle-2*e),new c.Projectile(t,a,this.angle-e),new c.Projectile(t,a,this.angle),new c.Projectile(t,a,this.angle+e),new c.Projectile(t,a,this.angle+2*e))}else o.Game.projectiles.push(new c.Projectile(t,a,this.angle))}fireProjectileBurst(){const e=2*Math.PI/40,t=[];for(let a=0;a<40;a++){const s=this.angle+(a-20)*e;t.push(new c.Projectile(this.x,this.y,s))}o.Game.projectiles.push(...t)}changeWeapon(){this.activeWeapon===u.PROJECTILE?this.activeWeapon=u.LASER:this.activeWeapon=u.PROJECTILE}upgradeWeapon(){this.weaponUpgradeStartTime=Date.now()}getLaserDps(){return this.isWeaponUpgraded()?h.LASER_UPGRADED_DPS:h.LASER_DPS}getLaserPosition(){return{x:this.x,y:this.y}}getLaserAngle(){return this.angle}isLaserFiring(){return this.isLaserEquipped()&&this.laser.isActive}}t.Player=h,h.INVINCIBILITY_DURATION=2e3,h.WEAPON_UPGRADE_TIME=1e4,h.LASER_DPS=180,h.LASER_UPGRADED_DPS=360},586:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RocketLaserPowerup=t.WeaponUpgradePowerup=t.ProjectileBurstPowerup=void 0;const s=a(850),i=a(882),r=a(575);class n extends r.AnimatedObject{constructor(e,t,a=n.MIN_SIZE){super(),this.x=e,this.y=t,this.size=a,this.isIncreasing=!0}isClicked(e,t){return(0,i.euclDistance)(this.x,this.y,e,t)<this.size}draw(e){e.drawImage(this.image,this.x-this.size,this.y-this.size,2*this.size,2*this.size)}update(e){this.isIncreasing?(this.size+=.3,this.size>=n.MAX_SIZE&&(this.isIncreasing=!1)):(this.size-=.3,this.size<=n.MIN_SIZE&&(this.isIncreasing=!0))}}n.MIN_SIZE=15,n.MAX_SIZE=25,t.ProjectileBurstPowerup=class extends n{constructor(){super(...arguments),this.image=s.default.POWERUP_RED_STAR}},t.WeaponUpgradePowerup=class extends n{constructor(){super(...arguments),this.image=s.default.POWERUP_YELLOW_BOLT}},t.RocketLaserPowerup=class extends n{constructor(){super(...arguments),this.image=s.default.POWERUP_BLUE_STAR}}},775:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Projectile=void 0;const s=a(913),i=a(850),r=a(882),n=a(575);class o extends n.AnimatedObject{constructor(e,t,a,s=300,i=10){super(),this.x=e,this.y=t,this.angle=a,this.velocity=s,this.size=i}draw(e){e.translate(this.x,this.y),e.rotate(this.angle+Math.PI/2),e.drawImage(i.default.PROJECTILE,.8*-this.size,-this.size,2*this.size*.8,2*this.size),e.drawImage(i.default.PROJECTILE_TRAIL,.6*-this.size,this.size,2*this.size*.6,2*this.size*1.5),e.rotate(-this.angle-Math.PI/2),e.translate(-this.x,-this.y),s.DEBUG_COLLISIONS&&(0,r.drawCircle)(e,this.x,this.y,this.size,null,"red")}update(e){this.x+=this.velocity*Math.cos(this.angle)*e,this.y+=this.velocity*Math.sin(this.angle)*e}}t.Projectile=o,o.DAMAGE=35},850:function(e,t,a){var s=this&&this.__awaiter||function(e,t,a,s){return new(a||(a=Promise))((function(i,r){function n(e){try{l(s.next(e))}catch(e){r(e)}}function o(e){try{l(s.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,o)}l((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=a(594),r=a(160),n=a(422),o=a(822),l=a(679),c=a(294),u=a(208),h=a(660),p=a(825),d=a(701),m=a(744),f=a(238),w=a(121),E=a(389),v=a(148),P=a(720),g=a(453),_=a(656),y=a(492),L=a(580);function S(e){return s(this,void 0,void 0,(function*(){return new Promise(((t,a)=>{const s=new Image;s.onload=()=>t(s),s.onerror=()=>a(),s.src=e}))}))}class I{static initialize(){return s(this,void 0,void 0,(function*(){[I.SHIP,I.PROJECTILE,I.PROJECTILE_TRAIL,I.SMOKE_1,I.SMOKE_2,I.SMOKE_3,I.SMOKE_4,I.METEOR_1,I.METEOR_2,I.METEOR_3,I.METEOR_4,I.LASER,I.LASER_HIT,I.PLAYER_LIFE,I.BLACK_BACKGROUND,I.POWERUP_RED_STAR,I.POWERUP_BLUE_STAR,I.POWERUP_YELLOW_BOLT,I.ROCKET,I.BUTTON_RED]=yield Promise.all([S(i.default),S(r.default),S(n.default),S(o.default),S(l.default),S(c.default),S(u.default),S(h.default),S(p.default),S(d.default),S(m.default),S(f.default),S(w.default),S(E.default),S(v.default),S(P.default),S(g.default),S(_.default),S(y.default),S(L.default)])}))}}t.default=I},607:function(e,t,a){var s=this&&this.__awaiter||function(e,t,a,s){return new(a||(a=Promise))((function(i,r){function n(e){try{l(s.next(e))}catch(e){r(e)}}function o(e){try{l(s.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,o)}l((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const i=a(850),r=a(352),n=a(483);!function(){s(this,void 0,void 0,(function*(){yield i.default.initialize(),(0,r.initCanvas)(),(0,n.setupInputs)(),(0,r.initGame)(),(0,r.runGameLoop)()}))}()},483:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.setupInputs=void 0;const s=a(352),i=a(590);t.setupInputs=function(){s.Game.canvas.addEventListener("mouseup",(e=>{s.Game.player.isLaserEquipped()&&s.Game.player.laser.deactivate()})),s.Game.canvas.addEventListener("mousedown",(e=>{if(2!==e.button)return s.Game.gameOver?((0,s.initGame)(),void(0,s.runGameLoop)()):void(s.Game.weaponUpgradePowerup&&s.Game.weaponUpgradePowerup.isClicked(e.clientX,e.clientY)?(s.Game.weaponUpgradePowerup=null,s.Game.player.upgradeWeapon()):s.Game.projectileBurstPowerup&&s.Game.projectileBurstPowerup.isClicked(e.clientX,e.clientY)?(s.Game.projectileBurstPowerup=null,s.Game.projectileBurstAttack=new i.ProjectileBurstAttack(s.Game.player)):s.Game.rocketLaserPowerup&&s.Game.rocketLaserPowerup.isClicked(e.clientX,e.clientY)?(s.Game.rocketLaserPowerup=null,s.Game.rocketLaser=new i.RocketLaser):s.Game.player.isProjectileEquipped()?s.Game.player.fireProjectile():s.Game.player.isLaserEquipped()&&s.Game.player.laser.activate())})),s.Game.canvas.addEventListener("mousemove",(e=>{s.Game.player.faceMouse(e.clientX,e.clientY)})),s.Game.canvas.addEventListener("contextmenu",(e=>{var t,a;e.preventDefault(),null===(t=s.Game.projectileBurstAttack)||void 0===t||t.activate(),null===(a=s.Game.rocketLaser)||void 0===a||a.activate()})),s.Game.canvas.addEventListener("wheel",(e=>{e.preventDefault(),s.Game.player.changeWeapon()}))}},52:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MeteorSpawner=void 0;const s=a(352),i=a(512);t.MeteorSpawner=class{constructor(e,t,a){this.canvasWidth=e,this.canvasHeight=t,this.player=a,this.lastSpawnTimestamp=0,this.nextSpawnInterval=0,this.startTime=Date.now()}shouldSpawn(){return Date.now()-this.lastSpawnTimestamp>this.nextSpawnInterval}getDifficultyMultiplier(){return Math.min(Math.floor((Date.now()-this.startTime)/1e4),5)}spawn(){const e=150*Math.random()+50,t=80*Math.random()+20;let a=0,r=0;switch(Math.floor(4*Math.random())){case 0:a=Math.random()*this.canvasWidth,r=-100;break;case 1:a=this.canvasWidth+100,r=Math.random()*this.canvasHeight;break;case 2:a=Math.random()*this.canvasWidth,r=this.canvasHeight+100;break;case 3:a=-100,r=Math.random()*this.canvasHeight}const n=Math.atan2(this.player.y-r,this.player.x-a);this.lastSpawnTimestamp=Date.now();const o=this.getDifficultyMultiplier(),l=500*(1-o/10),c=2e3*(1-o/10);this.nextSpawnInterval=Math.random()*(c-l)+l,s.Game.meteors.push(new i.Meteor(a,r,t,e,n))}}},644:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PowerupSpawner=void 0;const s=a(913),i=a(352),r=a(586),n=a(882);class o{constructor(e,t,a){this.canvasWidth=e,this.canvasHeight=t,this.player=a,this.nextSpawnInterval=0,this.lastSpawnTimestamp=Date.now(),this.resetNextSpawnInterval()}resetNextSpawnInterval(){this.nextSpawnInterval=Math.random()*(o.MAX_TIME_BETWEEN_SPAWNS-o.MIN_TIME_BETWEEN_SPAWNS)+o.MIN_TIME_BETWEEN_SPAWNS}shouldSpawnProjectileBurst(){return null===i.Game.projectileBurstAttack&&null===i.Game.projectileBurstPowerup}shouldSpawnWeaponUpgrade(){return null===i.Game.weaponUpgradePowerup&&!this.player.isWeaponUpgraded()}shouldSpawnRocketLaser(){return null===i.Game.rocketLaser&&null===i.Game.rocketLaserPowerup}shouldSpawn(){return(this.shouldSpawnProjectileBurst()||this.shouldSpawnWeaponUpgrade()||this.shouldSpawnRocketLaser())&&(s.FORCE_POWERUP||Date.now()-this.lastSpawnTimestamp>this.nextSpawnInterval)}spawn(){this.lastSpawnTimestamp=Date.now(),this.resetNextSpawnInterval();let e,t;for(;e=Math.random()*(this.canvasWidth-200)+100,t=Math.random()*(this.canvasHeight-200)+100,!((0,n.euclDistance)(e,t,this.player.x,this.player.y)>2*this.player.size););const a=Math.random();this.shouldSpawnProjectileBurst()&&a<.33?i.Game.projectileBurstPowerup=new r.ProjectileBurstPowerup(e,t):this.shouldSpawnWeaponUpgrade()&&a<.66?i.Game.weaponUpgradePowerup=new r.WeaponUpgradePowerup(e,t):this.shouldSpawnRocketLaser()&&(i.Game.rocketLaserPowerup=new r.RocketLaserPowerup(e,t))}}t.PowerupSpawner=o,o.MIN_TIME_BETWEEN_SPAWNS=15e3,o.MAX_TIME_BETWEEN_SPAWNS=3e4},590:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RocketLaser=t.ProjectileBurstAttack=void 0;const s=a(352),i=a(575),r=a(112),n=a(850);class o{constructor(e){this.player=e,this.remainingShots=3,this.lastShotTimestamp=0,this.isActive=!1}use(){this.isActive&&this.remainingShots>0&&Date.now()-this.lastShotTimestamp>o.DELAY&&(this.remainingShots--,this.lastShotTimestamp=Date.now(),this.player.fireProjectileBurst())}activate(){this.isActive=!0}isDone(){return this.remainingShots<=0}}t.ProjectileBurstAttack=o,o.DELAY=500;class l extends i.AnimatedObject{constructor(){super(),this.isActive=!1,this.isLeft=Math.random()<.5,this.x=this.isLeft?l.OFFSET_X:s.Game.canvas.width-l.OFFSET_X,this.y=s.Game.canvas.height,this.laser=new r.Laser(this)}activate(){this.isActive=!0}draw(e){e.translate(this.x,this.y),e.rotate(l.ANGLE+Math.PI/2),e.drawImage(n.default.ROCKET,0,0,l.WIDTH,l.LENGTH),e.rotate(-l.ANGLE-Math.PI/2),e.translate(-this.x,-this.y),this.laser.draw(e),this.laser.activate()}update(e){this.isActive&&(this.x+=Math.cos(l.ANGLE)*l.VELOCITY*e,this.y+=Math.sin(l.ANGLE)*l.VELOCITY*e)}getLaserDps(){return l.LASER_DPS}getLaserPosition(){return{x:this.x+l.WIDTH/2,y:this.y+l.LENGTH/2}}getLaserAngle(){const e=this.isLeft?1:-1;return l.ANGLE+e*Math.PI/2}isLaserEquipped(){return!0}}t.RocketLaser=l,l.ANGLE=3*Math.PI/2,l.OFFSET_X=200,l.LENGTH=180,l.WIDTH=60,l.VELOCITY=50,l.LASER_DPS=360},882:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.euclDistance=t.intersectRayAndCircle=t.drawRoundRect=t.drawCircle=t.arrayCrossProduct=void 0,t.arrayCrossProduct=function(e,t){const a=[];for(const s of e)for(const e of t)a.push([s,e]);return a},t.drawCircle=function(e,t,a,s,i=null,r=null){e.beginPath(),e.arc(t,a,s,0,2*Math.PI,!1),null!==i&&(e.fillStyle=i,e.fill()),null!==r&&(e.strokeStyle=r,e.stroke())},t.drawRoundRect=function(e,t,a,s,i,r=5,n=!1,o=!0){e.beginPath(),e.moveTo(t+r,a),e.lineTo(t+s-r,a),e.quadraticCurveTo(t+s,a,t+s,a+r),e.lineTo(t+s,a+i-r),e.quadraticCurveTo(t+s,a+i,t+s-r,a+i),e.lineTo(t+r,a+i),e.quadraticCurveTo(t,a+i,t,a+i-r),e.lineTo(t,a+r),e.quadraticCurveTo(t,a,t+r,a),e.closePath(),n&&e.fill(),o&&e.stroke()},t.intersectRayAndCircle=function(e,t,a,s,i,r){const n=e+1e4*Math.cos(a)-e,o=e-s,l=t+1e4*Math.sin(a)-t,c=t-i,u=n*n+l*l,h=2*(n*o+l*c),p=h*h-4*u*(o*o+c*c-r*r);if(p<0)return null;const d=(-h+Math.sqrt(p))/(2*u),m=(-h-Math.sqrt(p))/(2*u);return d>=0&&d<=1||m>=0&&m<=1?{x:e+n*m,y:t+l*m}:null},t.euclDistance=function(e,t,a,s){return Math.sqrt(Math.pow(e-a,2)+Math.pow(t-s,2))}}},t={};function a(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s].call(r.exports,r,r.exports,a),r.exports}a.d=(e,t)=>{for(var s in t)a.o(t,s)&&!a.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;a.g.importScripts&&(e=a.g.location+"");var t=a.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var s=t.getElementsByTagName("script");s.length&&(e=s[s.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),a.p=e})(),a(607)})();