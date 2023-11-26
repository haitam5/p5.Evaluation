let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));
  pursuer1.maxSpeed = 100

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // On cree un obstalce au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacle = new Obstacle(width / 2, height / 2, 100);
  obstacles.push(obstacle);
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  });
  let targetMouse = createVector(mouseX, mouseY);
  let targetPrevious;
  for (let i = 0; i < vehicules.length; i++) {
    if (i == 0) {
      vehicules[i].applyBehaviors(targetMouse, obstacles, vehicules);
    } else {
      let vehiculePrecedent = vehicules[i - 1];
      let pointDerriere = vehiculePrecedent.vel.copy();
      pointDerriere.normalize();
      pointDerriere.mult(-30);
      pointDerriere.add(vehiculePrecedent.pos);

      vehicules[i].applyBehaviors(pointDerriere, obstacles, vehicules);

      if (
        vehicules[i].pos.dist(pointDerriere) < 20 &&
        vehicules[i].vel.mag() < 0.01
      ) {
        vehicules[i].weightArrive = 0;
        vehicules[i].weightObstacle = 0;
        vehicules[i].vel.setHeading(
          p5.Vector.sub(vehiculePrecedent.pos, vehicules[i].pos).heading()
        );
        console.log("stop");
      } else {
        vehicules[i].weightArrive = 0.3;
        vehicules[i].weightObstacle = 0.9;
        console.log("nonstop");
      }
    }

    vehicules[i].update();
    vehicules[i].show();
  }
  
}

function mousePressed() {
  obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
  obstacles.push(obstacle);
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }

  if (key == "f") {
    const nbMissiles = 10;

    // On tire des missiles !
    for(let i=0; i < nbMissiles; i++) {
      let x = 20+random(10);
      let y = random(height/2-5, random(height/2+5));

      let v = new Vehicle(x, y);
      vehicules.push(v);
    }
  }
}