import { MagicBall } from "./MagicBall.js";

export class FireBall extends MagicBall {
  constructor(params) {
    super(params);
    this.particles = [];
    this.particleSpeed = 0;
    this.particlesAmmount = params.particlesAmmount || 100;
    this.createInMoment = params.createInMoment || 5;
    this.particleLifeTime = params.particleLifeTime || 200;
    this.stream = params.stream || {
      width: 20,
      //   direction: "right",
      //   range: 300,
    };
  }

  update(time) {
    for (let i = 0; i < this.createInMoment; i++)
      if (this.particles.length < this.particlesAmmount)
        this.createParticle({ creationTime: time });
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      this.changeColor(particle, time);
      if (time - particle.creationTime > particle.lifeTime) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  createParticle({
    x = null,
    y = null,
    radius = null,
    direction = null,
    lifeTime = null,
    color = null,
    creationTime = 0,
    system = false,
  }) {
    let obj = {
      type: "particle",
      x:
        x ||
        this.position.x +
          Math.random() * this.stream.width -
          this.stream.width / 2,
      y:
        y ||
        this.position.y +
          Math.random() * this.stream.width -
          this.stream.width / 2,
      radius: radius || Math.random() * 5 + 2,
      direction: direction || this.stream.direction,
      lifeTime:
        lifeTime || Math.floor(this.particleLifeTime * Math.random()) + 300,
      color: color || "#000000",
      creationTime,
      system,
    };
    this.particles.push(obj);
  }

  changeColor(particle, time) {
    let percent = (time - particle.creationTime) / (particle.lifeTime / 100);
    if (percent < 2) {
      particle.color = "#ffffff";
    } else if (percent >= 7 && percent <= 21) {
      particle.color = "#fffc00";
    } else if (percent > 21 && percent <= 43) {
      particle.color = "#febc02";
    } else if (percent > 43 && percent <= 65) {
      particle.color = "#e4752b";
    } else if (percent > 65 && percent <= 88) {
      particle.color = "#ba957c";
    } else if (percent > 88) {
      particle.color = "#cfcfcf";
    }
  }
}
