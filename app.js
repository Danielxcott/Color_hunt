//Global variables and selections
const colorDivs = document.querySelectorAll(".color");
const hexText = document.querySelectorAll(".color h2");
const slider = document.querySelectorAll("input[type=range]");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjusts = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
const sliderContainersClose = document.querySelectorAll(".close");
const lockBtn = document.querySelectorAll(".lock");
const generateBtn = document.querySelector(".generate");
let inititalColors;

//Event Listener
slider.forEach((slide) => {
  slide.addEventListener("input", hslControls);
});

colorDivs.forEach((div,index)=>{
    div.addEventListener("change",()=>{
        updateTextUI(index)
    });
})

hexText.forEach((text)=>{
    text.addEventListener("click",()=>{
        copyClipboard(text);
    })
})

adjustBtn.forEach((button,index)=>{
    button.addEventListener("click",()=>{
        openAdjustPanel(index);
    })
})

sliderContainersClose.forEach((closeBtn,index)=>{
    closeBtn.addEventListener("click",()=>{
        closeAdjustPanel(index);
    })
})

lockBtn.forEach((lock,index)=>{
    lock.addEventListener("click",(e)=>{
        lockFeature(e,index);
    })
})

generateBtn.addEventListener("click",randomColor);

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
    inititalColors=[];
  colorDivs.forEach((div, index) => {
    let text = div.children[0];
    let randomColor = generateHex();

    if(div.classList.contains('locked')){
        inititalColors.push(text.innerText);
        return; //during a locked state, the color will not change and the following code won't be excuted
    }else{
        inititalColors.push(chroma(randomColor).hex());
    }

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
  resetInput();
  
//   adjustBtn.forEach((btn,index)=>{
//     checkTextContrast(inititalColors[index],lockBtn[index]);
//     checkTextContrast(inititalColors[index],adjustBtn[index])
//   })
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

  let text = inititalColors[index];
  let colors = chroma(text)
  .set("hsl.s", saturate.value)
  .set("hsl.l", bright.value)
    .set("hsl.h", hue.value)

    colorDivs[index].style.backgroundColor = colors;
    colorsSlide(colors,hue,bright,saturate);
}

//Update Text 
function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const text = activeDiv.querySelector("h2");
    const color = chroma(activeDiv.style.backgroundColor);
    const icons = activeDiv.querySelectorAll(".controls button");
    text.innerText = color.hex();
    checkTextContrast(color,text);
    // for(icon of icons){
    //     checkTextContrast(color,icon)
    // }
} 

//ResetSlider;
function resetInput(){
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach((slide)=>{
        if(slide.name === "hue"){
            const hueColor = inititalColors[slide.getAttribute("data-hue")];
            const huevalue = chroma(hueColor).hsl()[0];//0 for h 1 for s and 2 for l
            slide.value = Math.floor(huevalue);

        }else if(slide.name === "saturation"){
            const satColor = inititalColors[slide.getAttribute("data-sat")];
            const satvalue = chroma(satColor).hsl()[1];
            slide.value = satvalue.toFixed(2);

        }else if(slide.name === "brightness"){
            const brightColor = inititalColors[slide.getAttribute("data-bright")];
            const brightvalue = chroma(brightColor).hsl()[2]; 
            slide.value = brightvalue.toFixed(2);
        }

    })
}

//Copy to clipboard;
function copyClipboard(text){
    const el = document.createElement("textarea");
    el.innerText = text.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    const popup = document.querySelector(".copy-container");

    popup.classList.add('active');
    popup.children[0].classList.add("active");

    setTimeout(()=>{
        popup.classList.remove('active');
        popup.children[0].classList.remove("active");
    },680)
}

//Open Adjustment Panel
function openAdjustPanel(index){
    sliderContainers[index].classList.toggle("active");
}

//Close Adjustment Panel
function closeAdjustPanel(index){
    sliderContainers[index].classList.remove("active");
}

//Lock Feature
function lockFeature(e,index){
const lockSVG = e.target.children[0];
lockBtn[index].parentElement.parentElement.classList.toggle("locked")
if(lockSVG.classList.contains('fa-lock-open')){
    e.target.innerHTML = '<i class="fas fa-lock"></i>';
} else {
  e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
}
}
