const multiplier = 100;
var screenSize = new THREE.Vector2(0.9, 0.9);
var border;
var random = [];
// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
var parent = document.createElement("div");
var animationOn = false;
var thumb;
var thumbOrigin;
var thumbSize = 0;
var thumbRotation = 0;
var thumbAnim;
const baseButtonClass = "w3-button w3-round-large ";
body.append(parent);
parent.style.position = "absolute";
//parent.style.backgroundColor = "rgba(0,255,0,0.2)";

body.style.overflowY = "hidden";
body.style.overflowX = "hidden";
var chosen;
var animationX = 0;
var animation;
var pressed = [];

var language = -1;
var subject = -1;


var mouseDown = false;
/*
document.addEventListener( 'mousedown', OnMouseDown, false );
document.addEventListener( 'mouseup', OnMouseUp, false );
document.addEventListener( 'mousemove', OnMouseMove, false );
*/



var currentSound = 0;
var sounds = [];
var feedbackSound = [];


var texts = [];


var sprite = [];
var images = [];

var optionsAmount;



function Start() {
    LoadParameters();
    var correctSounds = GetSounds(language, subject);
    CreateAudios(correctSounds, sounds);
    var correctFeedback = GetFeedback(language);
    CreateAudios(correctFeedback, feedbackSound)
    CreateImages();
    CreateTexts();
    CreateThumb();
    Usables();
    optionsAmount = Math.min(6, sprite.length);

    ChooseRandom();

    window.onresize = Resize;

    setTimeout(function () {
        Resize();
    },100);
}

function CreateThumb(){
    thumb = document.createElement("IMG");
    thumb.src = "Art/Pelit/thumbup.png"
    body.appendChild(thumb);
    thumb.style.position = "absolute";

    thumbOrigin = new Image();
    thumbOrigin.src = thumb.src;
    thumb.style.width = 0;
    thumb.style.height = 0;
}

function Usables(){
    var test = [texts, sprite, images, sounds];
    for(i = 0; i < sprite.length; i++){
        for(o = 0; o < test.length; o++){
            if(test[o][i] === undefined || test[o][i] === null){
                for(e = 0; e < test.length; e++){
                    if(e != 2 && test[e][i] !== undefined && test[e][i] !== null){
                        test[e][i].parentNode.removeChild(test[e][i]);
                    }
                    test[e].splice(i, 1);
                }

                i--;
                break;
            }
        }
    }

    for(i = 0; i < sounds.length; i++){
        console.log(sprite[i].src);
    }
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
        plusY = 1;
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


            ImageScales(random[num], new THREE.Vector2(40,40), texts);
            ImagePositions(random[num], new THREE.Vector2(50,25), texts);


            ImageScales(random[num], size, sprite);
            const imageSize = sprite[random[num]].offsetWidth / parent.offsetWidth;
            var testing = new THREE.Vector2( 50 + (spaceX * imageSize * multiplierX), 
                                            75 + (spaceY * imageSize * multiplierY));
            ImagePositions(random[num], testing, sprite);
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

function LoadParameters(){
    const params = new URLSearchParams(window.location.search);
    language = params.get("l");
    subject = params.get("g");

    if(language === undefined || subject === null)
        language = 0;

    if(subject === undefined || subject === null)
        subject = 0;
}

function ImageScales(i, percentage, array, newSize){
    ImageScale(array[i], images[i], percentage, newSize);
}

function ImageScale(image, originImage, percentage, newSize)
{
    if(newSize == null)
    {
        newSize = new THREE.Vector2(parent.offsetWidth, parent.offsetHeight);
        newSize.multiply(percentage);
        newSize.divideScalar(multiplier);
    }

    var imageSize = new THREE.Vector2(originImage.width, originImage.height);
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

    image.style.width = newSize.x + "px";
    image.style.height = newSize.y + "px";
}

function ImagePositions(i, percentage, array){
    ImagePosition(array[i], percentage, true);
}

function ImagePosition(image, percentage, useAnim)
{
    var animationSpeed = 10;
    var newSize = new THREE.Vector2(parent.offsetWidth, parent.offsetHeight);

    var size = new THREE.Vector2(newSize.x, newSize.y);
    newSize.divideScalar(2);

    size.multiply(percentage).divideScalar(100);
    var newPosition = new THREE.Vector2(0, 0);

    newPosition.x = parent.offsetLeft + size.x;

    newPosition.y = parent.offsetTop + size.y;

    newPosition.x -= image.offsetWidth / 2;
    newPosition.y -= image.offsetHeight / 2;

    if(useAnim)
        newPosition.x += animationX*animationSpeed;

    image.style.left = newPosition.x + "px";
    image.style.top = newPosition.y + "px";
}

function ButtonPress(i, isImage)
{
    if(isImage && pressed[i] || animationOn){
        return;
    }

    if(isImage){
        pressed[i] = true;
        if(chosen == i){
            PlaySound(feedbackSound,0);
            animationOn = true;
            thumbAnim = setInterval(ThumbAnim, 1);
            setTimeout(function () {
                animation = setInterval(Animation, 1);
            }, feedbackSound[0].duration * 1000);
        }else{
            PlaySound(feedbackSound, 1);
            sprite[i].className = baseButtonClass + "w3-red";
            sprite[i].disabled = true;
        }
    }else{
        PlaySound(sounds, i);
    }
}

function CreateTexts(){
    for(i = 0; i < sprite.length; i++){
        texts[i] = CreateText(i);
    }
}

function CreateText(i){
    var button = document.createElement("input");
    button.style.fontSize = 40;

    body.appendChild(button);
    button.style.position = "absolute";
    button.type="image";
    button.style.display = "none";
    button.src = "Art/Pelit/Speaker_Icon.svg"

    AddHandler(button, i, false);

    return button;
}

function EditText(text){
    text.style.fontSize = text.offsetHeight/4.5;
}

function CreateAudios(usedAudios, putAudios)
{
    for(i = 0; i < usedAudios.length; i++)
    {
        putAudios[i] = CreateAudio(i, usedAudios[i]);
    }
}

function CreateAudio(i, source)
{
    if(source === undefined || source === null)
        return undefined;

    var theSound = document.createElement("audio");
    theSound.src = source;

    return theSound;
}

function CreateImages()
{
    var spriteMap = GetImages(subject);
    for(i = 0; i < spriteMap.length; i++)
    {
        if(spriteMap[i] === undefined || sounds[i] === undefined)
        {
            spriteMap.splice(i, 1);
            sounds.splice(i, 1);
            i--;
            continue;
        }

        var button = document.createElement("input");

        button.type = "image";

        body.appendChild(button);
        button.style.position = "absolute";
        button.style.width = 100 + "px";
        button.style.height = 100 + "px";
        button.className = baseButtonClass;

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
        pressed[num] = false;
        sprite[num].style.display = "block";
        sprite[num].disabled = false;
        sprite[num].className = baseButtonClass;
    }

    chosen = random[Math.floor(Math.random() * random.length)];
    texts[chosen].style.display = "block";
    texts[chosen].className = baseButtonClass + "w3-light-grey";
}

function AddHandler(button, i, isImage)
{
    button.addEventListener ("click", function() {
        ButtonPress(i, isImage);
    });
}

var times = 0;
const maxTimes = 300;
var animationDone = false;

function Animation(){
    times++;
    animationX -= Math.sin(times / maxTimes);
    Resize();
    if(times > maxTimes)
    {
        if(!animationDone)
        {
            animationDone = true;
            animationX *= -1;
            ChooseRandom();
        }
        else
        {
            animationDone = false;
            clearInterval(animation);
            animationOn = false;
            ButtonPress(chosen, false);
        }
        times = 0;
    }
}

var thumbTimes = 0;
const thumbMax = [150,250,150];
var thumbState = 0; 
function ThumbAnim(){
    thumbTimes++;
    var currentTimes = thumbTimes / thumbMax[thumbState];

    switch(thumbState){
        case 0:
            thumbRotation = 360 * currentTimes;
            thumbSize = 50 * currentTimes;
            break;
        case 2:
            thumbRotation = 360 * (1 - currentTimes);
            thumbSize = 50 * (1 - currentTimes);
            break;
    }

    if(thumbTimes>= thumbMax[thumbState]){
        thumbTimes = 0;
        thumbState = (thumbState + 1) % 3;
        console.log(thumbState);

        if(thumbState == 0){
            clearInterval(thumbAnim);
        }
    }

    ImagePosition(thumb, new THREE.Vector2(50,50), false);
    ImageScale(thumb, thumbOrigin, new THREE.Vector2(thumbSize,thumbSize));

    thumb.style.webkitTransform = 'rotate('+thumbRotation+'deg)'; 
    thumb.style.mozTransform    = 'rotate('+thumbRotation+'deg)'; 
    thumb.style.msTransform     = 'rotate('+thumbRotation+'deg)'; 
    thumb.style.oTransform      = 'rotate('+thumbRotation+'deg)'; 
    thumb.style.transform       = 'rotate('+thumbRotation+'deg)'; 
}

function PlaySound(array, i){
    if(array.length > i && array[i] !== null && array[i] !== undefined)
    {
        array[i].play();
    }
}

function GoToPage(i, o){
    if(o === undefined || o === -1)
        o = language;
    if(o === -1)
        o = 0;
    if(i === undefined || i === -1)
        i = subject;
    if(i === -1)
        i = 0;

    window.location.href = '?l=' + o + '&g=' + i;
}