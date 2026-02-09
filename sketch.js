let inputBox;
let images = {};       // key: 单字“人” 或词组“日出/春天/好朋友”
let currentImgs = [];

// 自适应参数
const MAX_CANVAS_W = 1200;
const MAX_CANVAS_H = 700;

const MAX_TOKEN_LEN = 3; // 支持最长 3 字指令
const FILL_RATIO = 0.88; // 图案行占画布宽度比例

function preload() {
   images["太阳"] = loadImage("ri.png");
 images["爸爸"] = loadImage("baba.png");
 images["眼睛"] = loadImage("yanjing.png");
 images["妈妈"] = loadImage("mama.png");
 images["花"] = loadImage("hua.png");
 images["秋天"] = loadImage("qiutian.png");
 images["冬天"] = loadImage("dongtian.png");
 images["男人"] = loadImage("ren.png");
 images["女人"] = loadImage("nvren.png");
 images["月亮"] = loadImage("yue.png");
 images["牛"] = loadImage("niu.png");
 images["笑"] = loadImage("xiao.png");
 images["叫"] = loadImage("jiao.png");
 images["雪山"] = loadImage("xueshan.png");
 images["扇子"] = loadImage("shanzi.png");
 images["洗"] = loadImage("xi.png");
 images["左"] = loadImage("zuo.png");
 images["右"] = loadImage("you.png");
 images["果实"] = loadImage("zhongzi.png");
 images["商议"] = loadImage("jiaotan.png");
}

function setup() {
  const c = createCanvas(getCanvasWidth(), getCanvasHeight());
  c.parent("container");

  inputBox = createInput("");
  inputBox.parent("container");

  styleInput();
  layoutInput();
}

function draw() {
  background(248, 247, 245);

  // 顶部提示
  fill(160);
  textAlign(CENTER);
  textSize(isMobile() ? 12 : 13);
  text("输入文字（支持1-3字词组），生成对应的视觉符号", width / 2, 34);

  // 1) 最长匹配分词（3→2→1）
  const tokens = tokenizeLongestMatch(inputBox.value(), MAX_TOKEN_LEN);

  // 2) tokens -> 图片数组
  currentImgs = [];
  for (const t of tokens) {
    if (images[t]) currentImgs.push(images[t]);
  }

  // 3) 绘制输出（尽量铺满一行 + 不拉伸）
  drawRowFill(currentImgs);
}

// ---------- 自适应：窗口变化 ----------
function windowResized() {
  resizeCanvas(getCanvasWidth(), getCanvasHeight());
  layoutInput();
}

// ---------- 画布尺寸策略（电脑/手机自适应） ----------
function isMobile() {
  return windowWidth < 768;
}

function getCanvasWidth() {
  // 画布宽度：跟屏幕走，但上限 MAX_CANVAS_W
  return min(windowWidth * 0.95, MAX_CANVAS_W);
}

function getCanvasHeight() {
  // 手机更“竖”，给更高比例；电脑略低一些
  const h = isMobile() ? windowHeight * 0.62 : windowHeight * 0.60;
  // 高度也限制一个上限，避免超大屏太空
  return min(h, MAX_CANVAS_H);
}

// ---------- 输入框样式 ----------
function styleInput() {
  inputBox.style("font-size", isMobile() ? "18px" : "18px");
  inputBox.style("padding", "8px 10px");
  inputBox.style("border", "none");
  inputBox.style("border-bottom", "1px solid #000");
  inputBox.style("outline", "none");
  inputBox.style("background", "transparent");
  inputBox.style("text-align", "center");
  inputBox.style("display", "block");
}

// 输入框宽度随画布变化（左右留白按比例）
function layoutInput() {
  const padding = width * (isMobile() ? 0.06 : 0.10); // 手机留白小一点
  const w = max(160, width - padding * 2);

  inputBox.size(w, 40);
  inputBox.style("margin", (isMobile() ? "14px" : "16px") + " auto 0 auto");
}

// ---------- 最长匹配分词：优先3字，其次2字，最后1字 ----------
function tokenizeLongestMatch(str, maxLen = 3) {
  const tokens = [];
  let i = 0;

  while (i < str.length) {
    if (str[i] === " ") { i++; continue; }

    let matched = null;
    for (let len = maxLen; len >= 1; len--) {
      const part = str.slice(i, i + len);
      if (images[part]) { matched = part; break; }
    }

    if (matched) {
      tokens.push(matched);
      i += matched.length;
    } else {
      // 字典里没有就跳过该字符
      i++;
    }
  }
  return tokens;
}

// ---------- 输出绘制：铺满一行 + 不拉伸 ----------
function drawRowFill(imgArr) {
  const n = imgArr.length;
  if (n === 0) return;

  const availableW = width * FILL_RATIO;

  let gap = 20;
  let iconSize = (availableW - (n - 1) * gap) / n;

  gap = iconSize * 0.20;
  iconSize = (availableW - (n - 1) * gap) / n;

  // 手机端限制更严格，避免太大顶到上下
  iconSize = min(iconSize, isMobile() ? height * 0.32 : height * 0.42);

  const totalW = n * iconSize + (n - 1) * gap;
  const startX = width / 2 - totalW / 2 + iconSize / 2;
  const y = height / 2 + (isMobile() ? 8 : 12);

  imageMode(CENTER);
  noSmooth(); // 像素图更清晰（如果你是高清非像素，可注释掉）

  for (let i = 0; i < n; i++) {
    const img = imgArr[i];

    // 等比缩放，不拉伸
    const s = min(iconSize / img.width, iconSize / img.height);
    const w = img.width * s;
    const h = img.height * s;

    image(img, startX + i * (iconSize + gap), y, w, h);
  }
}