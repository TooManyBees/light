var get = document.getElementById.bind(document);

CanvasRenderingContext2D.prototype.at = function(x, y, radians, fn) {
  this.save();
  this.translate(x, y);
  this.rotate(-radians);
  fn();
  this.restore();
}

var api = (function() {
  var plugin = get("wtPlugin");
  return function() { return plugin.penAPI }
})();

function pluginLoaded() {
  console.log(api());
  initCanvas();
  // window.requestAnimationFrame(debugTablet);
}

var canvas = get("canvas");
function initCanvas() {
  var ctx = canvas.getContext("2d");
  drawCanvas(ctx);

  canvas.addEventListener("mousedown", function(event) {
    canvas.classList.add("touching");
    canvas.addEventListener("mousemove", drag);
  });

  canvas.addEventListener("mouseup", function(event) {
    canvas.classList.remove("touching");
    canvas.removeEventListener("mousemove", drag);
  });
}

function drawCanvas(ctx) {
  ctx.fillStyle = "rgb(11,15,5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCone(ctx, length) {
  length = length || 1
  var p1 = {y: 0, x: -12};
  var c1 = {y: 16, x: -10};
  var c2 = {y: 24, x: 0};
  var p2 = {y: 24 + length * 40, x: length * 160};  

  ctx.beginPath();
  // var gradient = ctx.createLinearGradient(length * 10, 0, length * 80, 0);
  var gradient = ctx.createRadialGradient(0, 0, length * 0, 0, 0, length * 160);
  gradient.addColorStop(0, "rgba(255, 249, 191, 0.8)");
  gradient.addColorStop(1, "rgba(255, 167, 47, 0)");
  ctx.fillStyle = gradient;
  ctx.moveTo(p2.x, -p2.y);
  ctx.bezierCurveTo(c2.x, -c2.y, c1.x, -c1.y, p1.x, -p1.y);
  ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
  ctx.closePath();
  ctx.fill();
}

function angleFromCoords(x,y) {
  var a = Math.atan(y/x);
  if (x < 0) a += Math.PI;
  return a;
}

function drag(event) {
  var x = event.clientX - canvas.offsetLeft;
  var y = event.clientY - canvas.offsetTop; 
  var angle = angleFromCoords(api().tiltX, api().tiltY);
  var ctx = canvas.getContext("2d");

  drawCanvas(ctx);
  ctx.at(x, y, angle+Math.PI, function() {
    drawCone(ctx, api().pressure);
  })
}
