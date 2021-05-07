let colorpallettes;
let root = document.documentElement;

let dotColor = root.style.getPropertyValue('--memo-bg-color')

async function fetchColors(){
    const pallettes = await fetch('https://cdn.jsdelivr.net/npm/nice-color-palettes@3.0.0/1000.json');
    colorpallettes = await pallettes.json();
    return colorpallettes;
}

fetchColors().then(pallettes => {
    colorpallettes = pallettes[Math.floor(Math.random() * pallettes.length)];
    console.log(colorpallettes)
    root.style.setProperty('--main-bg-color', colorpallettes[0]);
    root.style.setProperty('--border-color', colorpallettes[2]);
    root.style.setProperty('--memo-bg-color', colorpallettes[4]);
    dotColor = root.style.getPropertyValue('--border-color');
    drawGrid()
    
    }
)

