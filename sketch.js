let inputBox;
let images = {};       // key 可以是：单字“人” 或词组“日出/春天/好朋友”
let currentImgs = [];

// 画布尺寸（你可改）
const CANVAS_W = 1200;
const CANVAS_H = 520;

// 输入框左右留白（越大留白越多；越小越“占满”）
const INPUT_PADDING = 140;

// 图案行占画布宽度比例（越大越铺满）
const FILL_RATIO = 0.88;

// 支持的“最长词组长度”（2字/3字/4字都可改）
const MAX_TOKEN_LEN = 3;

function preload() {
  // ===== 单字（示例，按你的真实文件名改）=====
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
  const c = createCanvas(CANVAS_W, CANVAS_H);
  c.parent("container");

  // 输入框
  inputBox = createInput("");
  inputBox.parent("container");

  // 样式（极简）
  inputBox.style("font-size", "18px");
  inputBox.style("padding", "8px 10px");
  inputBox.style("border", "none");
  inputBox.style("border-bottom", "1px solid #000");
  inputBox.style("outline", "none");
  inputBox.style("background", "transparent");
  inputBox.style("text-align", "center");

  layoutInput();
}

function draw() {
  background(248, 247, 245);

  // 提示文字
  fill(160);
  textAlign(CENTER);
  textSize(12);
  text("输入文字（支持1-3字词组），生成对应的视觉符号", width / 2, 34);

  // 1) 解析输入：最长匹配分词（3字→2字→1字）
  const textInput = inputBox.value();
  const tokens = tokenizeLongestMatch(textInput, MAX_TOKEN_LEN);

  // 2) tokens -> 图片数组
  currentImgs = [];
  for (const t of tokens) {
    if (images[t]) currentImgs.push(images[t]);
  }

  // 3) 绘制：尽量铺满一行 + 不拉伸
  drawRowFill(currentImgs);
}

// —— 最长匹配分词：优先3字，其次2字，最后1字 —— //
function tokenizeLongestMatch(str, maxLen = 3) {
  const tokens = [];
  let i = 0;

  while (i < str.length) {
    // 跳过空格
    if (str[i] === " ") {
      i++;
      continue;
    }

    let matched = null;

    for (let len = maxLen; len >= 1; len--) {
      const part = str.slice(i, i + len);
      if (images[part]) {
        matched = part;
        break;
      }
    }

    if (matched) {
      tokens.push(matched);
      i += matched.length;
    } else {
      // 没匹配到（字典里没有），跳过这个字符
      i++;
    }
  }

  return tokens;
}

// —— 把图片“铺满一行”：根据数量自动算尺寸 + 等比缩放 —— //
function drawRowFill(imgArr) {
  const n = imgArr.length;
  if (n === 0) return;

  const availableW = width * FILL_RATIO;

  // gap 初值
  let gap = 20;

  // 先算 iconSize
  let iconSize = (availableW - (n - 1) * gap) / n;

  // gap 联动，更协调
  gap = iconSize * 0.2;
  iconSize = (availableW - (n - 1) * gap) / n;

  // 限制最大高度（防止太大）
  iconSize = min(iconSize, height * 0.42);

  const totalW = n * iconSize + (n - 1) * gap;
  const startX = width / 2 - totalW / 2 + iconSize / 2;
  const y = height / 2 + 10;

  imageMode(CENTER);
  noSmooth(); // 像素图更清晰（如果你是矢量风可去掉）

  for (let i = 0; i < n; i++) {
    const img = imgArr[i];

    // 等比缩放，不拉伸
    const s = min(iconSize / img.width, iconSize / img.height);
    const w = img.width * s;
    const h = img.height * s;

    image(img, startX + i * (iconSize + gap), y, w, h);
  }
}

// —— 输入框：占满画布宽度（左右留白 INPUT_PADDING） —— //
function layoutInput() {
  const w = width - INPUT_PADDING * 2;
  inputBox.size(w, 38);

  // DOM 元素最稳妥居中方式：block + auto margin
  inputBox.style("display", "block");
  inputBox.style("margin", "18px auto 0 auto");
}
