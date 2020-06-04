const multiplier = 100;
var screenSize = new THREE.Vector2(0.9, 0.9);
var border;
var random = [];
// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
var parent = document.createElement("div");
body.append(parent);
parent.style.position = "absolute";
parent.style.backgroundColor = "blue";

body.style.overflowY= "hidden";
body.style.overflowX= "hidden";
var chosen;
var animationX=0;
var animation;


var mouseDown = false;
/*
document.addEventListener( 'mousedown', OnMouseDown, false );
document.addEventListener( 'mouseup', OnMouseUp, false );
document.addEventListener( 'mousemove', OnMouseMove, false );
*/



var currentSound = 0;
var sounds = [];
CreateAudios();

var texts = [];
CreateTexts();


var sprite = [];
var images = [];
CreateImages();

const optionsAmount = Math.min(6, sprite.length);

ChooseRandom();
Resize();


window.onload = function()
{
    window.onresize = Resize;
}

function Resize()
{
    //renderer.setSize( window.innerWidth * screenSize.x, window.innerHeight * screenSize.y );


    const w = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const wSize = new THREE.Vector2(w.x, w.y).multiply(screenSize);
    border = new THREE.Vector2(1 - screenSize.x, 1 - screenSize.y)
    border.multiply(w);
    border.divideScalar(2);

    parent.style.width = wSize.x; 
    parent.style.height = wSize.y;
    parent.style.left = border.x;
    parent.style.top = border.y;

    const maxCell = optionsAmount;
    const lines = parent.offsetWidth < parent.offsetHeight ? 2 : 1;
    const columns = Math.min(sprite.length, maxCell) / lines;
    const size = new THREE.Vector2(100 / (columns + 1) - 1, 50);
    const wholeSpace = 104;
    var spaceY = 0;

    var plusY = 0;

    if(lines % 2 == 0){
        spaceY = wholeSpace / 2;
        plusY=1;
    }


    const test = Math.min(columns,sprite.length - columns)

    for(o = 0; o < lines; o++)
    {
        var spaceX = 0;

        var plusX = 0;

        if(columns % 2 == 0){
            spaceX = wholeSpace / 2;
            plusX=1;
        }

        var multiplierY = ((o + plusY) % 2 == 0 ? 1 : -1);
        for(i = 0; i < columns; i++)
        {
            var num = i + o * columns;
            var multiplierX = ((i + plusX) % 2 == 0 ? 1 : -1);


            ImageScale(random[num], new THREE.Vector2(40,40), sprite);
            ImagePosition(random[num], new THREE.Vector2(50,25), sprite);


            ImageScale(random[num], size, texts);
            const imageSize = texts[random[num]].offsetWidth / parent.offsetWidth;
            var testing = new THREE.Vector2( 50 + (spaceX * imageSize * multiplierX), 75 + (spaceY * imageSize * multiplierY));
            ImagePosition(random[num], testing, texts);
            EditText(texts[random[num]]);

            if((i + plusX) % 2 == 0){
                spaceX += wholeSpace;
            }
        }
        if((o + plusY) % 2 == 0){
            spaceY += wholeSpace;
        }
    }
}

function ImageScale(i, percentage, array, newSize)
{
    if(newSize == null)
    {
        newSize = new THREE.Vector2(parent.offsetWidth, parent.offsetHeight);
        newSize.multiply(percentage);
        newSize.divideScalar(multiplier);
    }

    var imageSize = new THREE.Vector2(images[i].width, images[i].height);
    var aspectRatio = new THREE.Vector2(imageSize.y / imageSize.x, imageSize.x / imageSize.y);
    var aspectSize = new THREE.Vector2(0, 0);


    aspectSize.y = aspectRatio.x * newSize.x;
    aspectSize.x = aspectRatio.y * newSize.y;


    if (aspectSize.x > newSize.x)
    {
        newSize.y = aspectSize.y;
    }
    else if (aspectSize.y > newSize.y)
    {
        newSize.x = aspectSize.x;
    }

    array[i].style.width = newSize.x + "px";
    array[i].style.height = newSize.y + "px";
}

function ImagePosition(i, percentage, array)
{
    var animationSpeed=10;
    var newSize = new THREE.Vector2(parent.offsetWidth, parent.offsetHeight);

    var size = new THREE.Vector2(newSize.x, newSize.y);
    newSize.divideScalar(2);

    size.multiply(percentage).divideScalar(100);
    var newPosition = new THREE.Vector2(0, 0);

    newPosition.x = parent.offsetLeft + size.x;

    newPosition.y = parent.offsetTop + size.y;

    newPosition.x -= array[i].offsetWidth / 2;
    newPosition.y -= array[i].offsetHeight / 2;

    newPosition.x += animationX*animationSpeed;

    array[i].style.left = newPosition.x + "px";
    array[i].style.top = newPosition.y + "px";
}

/*
function OnMouseDown()
{
    mouseDown = true;
    Raycast("rgb(0,255,0)");
}

function OnMouseUp()
{
    var i = Raycast("rgb(255, 0, 0)");
    mouseDown = false;

    if(i >- 1)
    {
        sounds[i].play();

        currentSound++;
        if(currentSound >= sounds.length){
            currentSound = 0;
        }
    }
}

function OnMouseMove()
{
    Raycast("rgb(255, 0, 0)");
}*/

function CreateText(i){
    var button = document.createElement("button");
    button.innerHTML = sentences[i];
    button.style.fontSize = 40;

    body.appendChild(button);
    button.style.position = "absolute";

    AddHandler(button, i, false);

    return button;
}

function EditText(text){
    text.style.fontSize = text.offsetHeight/4.5;
}

function ButtonPress(i, isImage)
{
    sounds[i].play();

    if(!isImage){
        if(chosen == i){
            animation = setInterval(Animation, 1);
        }
    }
}



function CreateAudios()
{

    for(i = 0; i < audios.length; i++)
    {
        CreateAudio(i, audios);
    }
}

function CreateAudio(i, audios)
{
    sounds[i] = document.createElement("audio");
    sounds[i].src = audios[i];
}

function CreateTexts(){
    for(i = 0; i < sentences.length; i++){
        texts.push(CreateText(i));
    }
}

function CreateImages()
{
    for(i = 0; i < spriteMap.length; i++)
    {
        var button = document.createElement("input");

        button.type = "image";

        body.appendChild(button);
        button.style.position = "absolute";
        button.style.width = 100 + "px";
        button.style.height = 100 + "px";

        button.src = spriteMap[i]; 

        AddHandler(button, i, true);

        sprite[i] = button;

        var newImg = new Image();
        newImg.src = spriteMap[i];
        images[i] = newImg;
    }
}

function MousePosition()
{
    var size = renderer.getSize(new THREE.Vector2);
    mouse.x = ( (event.clientX - border.x) /  size.x) * 2 - 1;
    mouse.y = -( (event.clientY - border.y) / size.y ) * 2 + 1;
    return mouse;
}

function ChooseRandom()
{
    for(i = 0; i < sprite.length; i++){
        sprite[i].style.display = "none";
        texts[i].style.display = "none";
    }

    random = [];
    for(i = 0; i < optionsAmount; i++){
        var num = -1
        do{
            num = Math.floor(Math.random() * sprite.length);
        }while(random.includes(num));
        random[i] = num;
        texts[num].style.display = "block";
    }

    chosen = random[Math.floor(Math.random() * random.length)];
    sprite[chosen].style.display = "block";
}

function AddHandler(button, i, isImage)
{
    button.addEventListener ("click", function() {
        ButtonPress(i, isImage);
    });
}

var times = 0;
const maxTimes=300;
var animationDone = false;
function Animation(){
    times++;
    animationX -= Math.sin(times/maxTimes);
    Resize();
    if(times>maxTimes){
        if(!animationDone){
            animationDone=true;
            animationX*=-1;
            ChooseRandom();
        }else{
            animationDone=false;
            clearInterval(animation);
            ButtonPress(chosen, true);
        }
        times = 0;
    }
}