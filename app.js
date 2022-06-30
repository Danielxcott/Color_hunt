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
//For localstorage
let savePalette=[];

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

//Implement Save to palette and localstorage 
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save"); 
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");
//Event Listener
saveBtn.addEventListener("click",openPalette);
closeSave.addEventListener("click",closePalette);
submitSave.addEventListener("click",savedPalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);
//Function
function openPalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active")
    popup.classList.add("active");
}

function closePalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active")
    popup.classList.remove("active");
}

function openLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
  }

function closeLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
  }

//To local storage
function savedPalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active")
    popup.classList.remove("active");
    const colors =[];
    const name = saveInput.value;
    hexText.forEach((text)=>{
        colors.push(text.innerText);
    });
    let paletteNr = savePalette.length;
    const paletteObj = {name,colors,num:paletteNr};
    savePalette.push(paletteObj);
    // savetoLocal(paletteObj);
    saveInput.value="";

    //Generate the palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.colors.forEach((smColor)=>{
        const smallDiv = document.createElement("div");
        smallDiv.style.background = smColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.num);
    paletteBtn.innerText = 'Select';

    paletteBtn.addEventListener("click",(e)=>{
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        inititalColors=[];
        savePalette[paletteIndex].colors.forEach((color,index)=>{
            inititalColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0];
            checkTextContrast(color,text);
            updateTextUI(index);
        })
    })

    //Append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
}

// function savetoLocal(obj){
//     let localPalettes;
//     if(localStorage.getItem("palettes") === null){
//         localPalettes=[];
//     }else{
//         localPalettes = JSON.parse(localStorage.getItem("palettes"));
//     }
//     localPalettes.push(obj);
//     localStorage.setItem('palettes',JSON.stringify(localPalettes));
// }
