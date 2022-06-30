//Global variables and selections
const colorDivs = document.querySelectorAll(".color");
const hexText = document.querySelectorAll(".color h2");
const slider = document.querySelectorAll("input[type=range]");

//Event Listener
slider.forEach((slide) => {
  slide.addEventListener("input", hslControls);
});

//Function

//Color Generator
function generateHex() {
  // let letter ="0123456789ABCDEF";
  // let hash = "#";
  // for(let i = 0 ; i < 6 ; i++){
  //     hash += letter[Math.floor(Math.random()*16)];
  // }
  // return hash;

  const hexColor = chroma.random();
  return hexColor;
}

function randomColor() {
  colorDivs.forEach((div, index) => {
    let text = div.children[0];
    let randomColor = generateHex();

    text.innerText = randomColor;
    div.style.backgroundColor = randomColor;
    checkTextContrast(randomColor, text);

    //grab a slider on each div
    const colorSlide = div.querySelectorAll(".sliders input");
    const color = chroma(randomColor);
    const hue = colorSlide[0];
    const bright = colorSlide[1];
    const saturate = colorSlide[2];
    colorsSlide(color, hue, bright, saturate);
  });
}
randomColor();

//check contrast
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

//colorsSlide
function colorsSlide(color, hue, bright, saturate) {
  //scale for saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scale = chroma.scale([noSat, color, fullSat]);
  //scale for brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //sliders
  saturate.style.backgroundImage = `linear-gradient(to right,${scale(
    0
  )},${scale(1)})`;

  bright.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)},${scaleBright(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

//hslControl
function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");
  let sliders = e.target.parentElement.querySelectorAll("input[type=range]");

  const hue = sliders[0];
  const bright = sliders[1];
  const saturate = sliders[2];

  let text = colorDivs[index].querySelector("h2").innerText;
  let colors = chroma(text)
  .set("hsl.s", saturate.value)
  .set("hsl.l", bright.value)
    .set("hsl.h", hue.value)

    colorDivs[index].style.backgroundColor = colors;
}
