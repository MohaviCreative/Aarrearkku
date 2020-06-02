var scene = new THREE.Scene();
var multiplier = 100;
var screenSize = new THREE.Vector2(0.9, 0.9);
var camera = new THREE.OrthographicCamera( 0, 0, 0, 0, 1, 1000 );
var resizeImages = true;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var canvas = document.getElementById("canvas");
var renderer = new THREE.WebGLRenderer( { canvas: canvas } );
var border;
scene.background = new THREE.Color( "rgb(255, 228, 225)" );
document.body.appendChild( renderer.domElement );


var mouseDown = false;
document.addEventListener( 'mousedown', OnMouseDown, false );
document.addEventListener( 'mouseup', OnMouseUp, false );
document.addEventListener( 'mousemove', OnMouseMove, false );
var text;
CreateText();

var listener = new THREE.AudioListener();
camera.add( listener );


var currentSound = 0;
var sounds = [];
CreateAudios();



camera.position.z = 5;

window.onresize = Resize;

var sprite = [];

var spriteMap = [
    new THREE.TextureLoader().load( "Art/Eläimet/Hämähäkki_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Hamsteri_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Hevonen_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Hiiri_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Käärme_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Kala_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Kani_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Kissa_väri.jpg" )/*,
    new THREE.TextureLoader().load( "Art/Eläimet/Koira_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Lintu_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Lisko_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Marsu_väri.jpg" ),
    new THREE.TextureLoader().load( "Art/Eläimet/Rotta_väri.jpg" )*/
]

for(i = 0; i < spriteMap.length; i++)
{
    sprite.push(new THREE.Sprite(new THREE.SpriteMaterial( { map: spriteMap[i] } )));
    sprite[i].scale.set(2, 2, 1);
    sprite[i].position.set(0, 0, 0);
    scene.add( sprite[i] );
}

animate();
Resize();

function Resize()
{
    resizeImages = true;
    //renderer.setSize( window.innerWidth * screenSize.x, window.innerHeight * screenSize.y );


    var w = new THREE.Vector2(window.innerWidth, window.innerHeight);
    var wSize = new THREE.Vector2(w.x, w.y).multiply(screenSize);
    border = new THREE.Vector2(1 - screenSize.x, 1 - screenSize.y)
    border.multiply(w);
    border.divideScalar(2);

    renderer.setSize( wSize.x, wSize.y,false );
    canvas.style.position = "absolute";
    canvas.style.left = border.x;
    canvas.style.top = border.y;

    camera.left = window.innerWidth / -multiplier;
    camera.right = window.innerWidth / multiplier;
    camera.top = window.innerHeight / multiplier;
    camera.bottom = window.innerHeight / -multiplier;

    camera.updateProjectionMatrix ();
}

function animate() 
{
    if(resizeImages)
    {
        resizeImages = false;

        var maxCell = 6;
        var rows = Math.ceil(spriteMap.length/maxCell);
        var columns = Math.ceil(spriteMap.length/rows);
        var size = new THREE.Vector2(100/(columns+1)-1, 100/(rows+1)-1);

        for( o = 0; o < rows; o++)
        {
            var test = Math.min(columns,spriteMap.length - (o * columns))
            var position = new THREE.Vector2(100 / (test + 1), 100 / (rows + 1));

            for(i = 0; i < columns; i++)
            {
                if(spriteMap[columns * o + i] && spriteMap[columns * o + i].image)
                {
                    ImageScale(sprite[columns * o + i], size);
                    var testing = new THREE.Vector2(i+1, rows-o);
                    testing.multiply(position);
                    ImagePosition(sprite[columns * o + i], testing);
                }
                else
                {
                    resizeImages = true;
                    break;
                }
            }
        }
    }
    
    if(text!==undefined&&text.material.color!==undefined)
        RaycastText(text);

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function ImageScale(image, percentage, newSize)
{

    if(newSize == null)
    {
        newSize = new THREE.Vector2(window.innerWidth,window.innerHeight).multiply(percentage);
        newSize.divideScalar(50).divideScalar(multiplier);
    }

    var imageSize = new THREE.Vector2(image.material.map.image.width, image.material.map.image.height);
    var aspectRatio = new THREE.Vector2(imageSize.y / imageSize.x, imageSize.x / imageSize.y);
    var aspectSize =new THREE.Vector2(0,0);


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

    image.scale.set(newSize.x, newSize.y);
}

function ImagePosition(image, percentage, dynamicPivot)
{
    var test = multiplier;

    var positions = new THREE.Vector4(-window.innerWidth, window.innerWidth, -window.innerHeight, window.innerHeight).divideScalar(test);
    var size = new THREE.Vector2(window.innerWidth, window.innerHeight).divideScalar(multiplier/2);

    var normalizedSize = new THREE.Vector2(size.x, size.y).multiply(percentage).divideScalar(100);
    var newPosition = new THREE.Vector2(0, 0);

    newPosition.x = normalizedSize.x + positions.x;

    newPosition.y = normalizedSize.y + positions.z;

    if(dynamicPivot)
    {
        var normalizedSomething = normalizedSize.divide(size);
        var newPivot = new THREE.Vector2(normalizedSomething.x, normalizedSomething.y);

        image.center.set(newPivot.x, newPivot.y);
    }

    image.position.set(newPosition.x, newPosition.y,0);
}

function Raycast(color)
{
    MousePosition();
    raycaster.setFromCamera( mouse.clone(), camera );   

    var objects = raycaster.intersectObjects(sprite);
    var num = -1;

    for(i=0; i < sprite.length; i++)
    {
        sprite[i].material.color.set("white");
    }

    for(i = 0; i < objects.length; i++)
    {
        objects[i].object.material.color.set( color );

        for(o = 0; o < sprite.length; o++)
        {
            if(objects[i].object.id == sprite[o].id)
            {
                num = o;
            }
        }
    }

    return num;
}

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
}

function CreateText(){
    var loader = new THREE.FontLoader();
    loader.load( 'Fonts/helvetiker_regular.typeface.json', function ( font ) {

        var geometry = new THREE.TextGeometry( 'Hello three.js!', 
                                              {
            font: font,
            size: 1,
            height: 0.5,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.05,
            bevelSegments: 3
        } ); 
        geometry.center();
        var material = new THREE.MeshBasicMaterial();
        material.color.set("white");
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        text=mesh;

    } );
}

function EditText(text){

}

function CreateAudios()
{
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    var audios=
        [
            'Sounds/English/Animals/ENhamahakki.mp3',
            'Sounds/English/Animals/ENmarso.mp3',
            'Sounds/English/Animals/ENhevonen.mp3',
            'Sounds/English/Animals/ENhiiri.mp3',
            'Sounds/English/Animals/ENkarme.mp3',
            'Sounds/English/Animals/ENkala.mp3',
            'Sounds/English/Animals/ENkani.mp3'
        ]

    for(i = 0; i < audios.length; i++)
    {
        CreateAudio(i, audios, audioLoader);
    }
}

function CreateAudio(i, audios, audioLoader)
{
    sounds[i] = new THREE.Audio( listener );

    audioLoader.load( audios[i], function( buffer ) 
                     {
        sounds[i].setBuffer( buffer );
    });
}

function RaycastText(geo){
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
    //for example textGeo is the textGeometry
    inverseMatrix.getInverse(geo.matrixWorld);
    ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

    if(geo.geometry.boundingBox !== null){
        if(ray.intersectsBox(geo.geometry.boundingBox) === true){
            geo.material.color.set("rgb(255,0,0)"); 
        }
    }
}

function MousePosition(){
    var size = renderer.getSize(new THREE.Vector2);
    mouse.x = ( (event.clientX - border.x) /  size.x) * 2 - 1;
    mouse.y = -( (event.clientY - border.y) / size.y ) * 2 + 1;
    return mouse;
}