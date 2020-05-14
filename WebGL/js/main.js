var scene = new THREE.Scene();
var multiplier=100;
var camera = new THREE.OrthographicCamera( 0,0,0,0, 1, 1000 );
var resizeImages=true;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color( "rgb(255,228,225)" );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
var mouseDown=false;
document.addEventListener( 'mousedown', OnMouseDown, false );
document.addEventListener( 'mouseup', OnMouseUp, false );
document.addEventListener( 'mousemove', OnMouseMove, false );

var listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
var sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/villager.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setVolume( 0.5 );
	sound.autoplay=true;
});

var sounds=[];
for(i = 0; i < 6; i++){
    sounds.push(Object.assign({},sound));
}
console.log(sounds.length);
var currentSound=0;

camera.position.z = 5;

window.onresize = Resize;
var sprite =[];
var spriteMap = [
    new THREE.TextureLoader().load( "images/Valkoinen.png" ),
    new THREE.TextureLoader().load( "images/Valkoinen.png" ),
    new THREE.TextureLoader().load( "images/Valkoinen.png" ),
    new THREE.TextureLoader().load( "images/Valkoinen.png" ),
    new THREE.TextureLoader().load( "images/Valkoinen.png" ),
    new THREE.TextureLoader().load( "images/Valkoinen.png" )
]
for(i = 0; i < spriteMap.length; i++){
    sprite.push(new THREE.Sprite(new THREE.SpriteMaterial( { map: spriteMap[i] } )));
    sprite[i].scale.set(2,2,1);
    sprite[i].position.set(0, 0, 0);
    scene.add( sprite[i] );
}

animate();
Resize();

function Resize(){
    
    resizeImages=true;
    
    camera.left=window.innerWidth /-multiplier;
    camera.right=window.innerWidth/multiplier;
    camera.top=window.innerHeight/multiplier;
    camera.bottom=window.innerHeight /-multiplier;
    
    camera.updateProjectionMatrix ();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    if(resizeImages){
        resizeImages=false;
        var position=100/(spriteMap.length+1);
        for(i = 0; i < spriteMap.length; i++){
            if(spriteMap[i].image){
                ImageScale(sprite[i], new THREE.Vector2(position-1,50));
                ImagePosition(sprite[i],new THREE.Vector2(position*(i+1),50));
            }else{
                resizeImages=true;
                break;
            }
        }
    }
    
    
	requestAnimationFrame( animate );
	cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}

function ImageScale(image, percentage, newSize){
    
    if(newSize==null){
        newSize=new THREE.Vector2(window.innerWidth,window.innerHeight).multiply(percentage).divideScalar(50).divideScalar(multiplier);
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
    
    image.scale.set(newSize.x,newSize.y);
}

function ImagePosition(image, percentage, dynamicPivot){
    var test=multiplier;
    
        var positions = new THREE.Vector4(-window.innerWidth,window.innerWidth, -window.innerHeight, window.innerHeight).divideScalar(test);
        var size=new THREE.Vector2(window.innerWidth, window.innerHeight).divideScalar(multiplier/2);

        var normalizedSize = new THREE.Vector2(size.x, size.y).multiply(percentage).divideScalar(100);
        var newPosition = new THREE.Vector2(0,0);
        
        newPosition.x = normalizedSize.x+positions.x;
            
        newPosition.y = normalizedSize.y+positions.z;
        
        if(dynamicPivot){
            var normalizedSomething = normalizedSize.divide(size);
            var newPivot = new THREE.Vector2(normalizedSomething.x, normalizedSomething.y);

            image.center.set(newPivot.x,newPivot.y);
        }
        
        image.position.set(newPosition.x,newPosition.y,0);
}

function Raycast(color){
    if(!mouseDown){
        return;
    }
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse.clone(), camera );   
    
    var objects = raycaster.intersectObjects(sprite);
    
    for(i=0; i < sprite.length; i++){
        sprite[i].material.color.set("white");
    }
    
    for(i = 0; i < objects.length; i++){
        objects[ i ].object.material.color.set( color );
    }
}

function OnMouseDown(){
    mouseDown=true;
    Raycast("rgb(255,0,0)");
}
function OnMouseUp(){
    Raycast("rgb(255,255,255)");
    mouseDown=false;
	sounds[currentSound].play();
	console.log(sounds.length);
	
	currentSound++;
	if(currentSound>=sounds.length){
	    currentSound=0;
	}
}
function OnMouseMove(){
    
    Raycast("rgb(255,0,0)");
}