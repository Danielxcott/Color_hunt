//Global variables and selections
const colorDivs = document.querySelectorAll(".color");
const hexText = document.querySelectorAll(".color h2");
const slider = document.querySelectorAll("input[type=range]");

//Function

//Color Generator
function generateHex(){
    // let letter ="0123456789ABCDEF";
    // let hash = "#";
    // for(let i = 0 ; i < 6 ; i++){
    //     hash += letter[Math.floor(Math.random()*16)];
    // }
    // return hash;

    const hexColor = chroma.random();
    return hexColor;
}

function randomColor(){
    colorDivs.forEach((div,index)=>{
        let text = div.children[0];
        let randomColor = generateHex();

        text.innerText = randomColor;
        div.style.backgroundColor = randomColor;
    })
}
randomColor();