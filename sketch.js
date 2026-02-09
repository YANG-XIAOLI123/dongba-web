let inputBox;
let renImg;

function preload() {
  // 加载“人”的图片
  renImg = loadImage("ren.png");
}

function setup() {
  createCanvas(400, 400);

  // 创建输入框
  inputBox = createInput("");
  inputBox.position(20, height + 20);
}

function draw() {
  background(240);

  // 如果输入的是“人”
  if (inputBox.value() === "人") {
    imageMode(CENTER);
    image(renImg, width / 2, height / 2, 200, 200);
  }
}