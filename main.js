/* TODO
- add shadows
- add materials
+ add aspect ratio for the camera
- use projection matrix function in right way
- find the way to embed font to the main.js file (script should be the single file)
- find the way to embed three.js classes to the single file
- add reaction to resize window event
- change dom element name
*/

var renderer, camera, scene;
var textGeo, textMesh1;
var group;
var materials;


var text = "three.js";

var textController = {
    size: 1
    , font: ''
    , height: 20
    , curveSegments: 4

}


var cameraController = {
    left: window.innerWidth/-2
    , right: window.innerWidth/2
    , top: window.innerHeight/2
    , bottom: window.innerHeight/-2
    , near: 0
    , far: 200
}

var cameraPositionController = {
    x: 0
    ,y: 0
    ,z: 200
}

//debug enviroment
var activeCamera;
var cameraHelper;
var stats;
var debugCamera = new THREE.PerspectiveCamera( 50, 0.5 * window.innerWidth / window.innerHeight, 1, 10000 );
debugCamera.position.z = 500;
debugCamera.position.x = -1000;
debugCamera.position.y = 0;

init()
animate()

function init() {
    //scene
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Camera

    camera = new THREE.OrthographicCamera();
    //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 0;



    // Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    // LIGHTS
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);


    //

    materials = [
        new THREE.MeshBasicMaterial({ color: 0x000000 }), // front
        new THREE.MeshBasicMaterial({ color: 0x000000 }) // side
    ];
    group = new THREE.Group();
    group.position.y = 100;
    scene.add(group);


    loadFont();

    applySettings();

    if (debug) {
        var axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);
        cameraHelper = new THREE.CameraHelper(camera);
        scene.add( cameraHelper );

        gui = new dat.GUI();
        //add camera frustrum options
        var cameraSettings = gui.addFolder('camera');
        var textSettings = gui.addFolder('text')
        Object.keys(cameraController).forEach(keyName => {
            cameraSettings.add(cameraController, keyName, -3000, 3000, 5).onChange(applySettings);
        });
        Object.keys(cameraPositionController).forEach(keyName => {
            cameraSettings.add(cameraPositionController, keyName, -3000, 3000, 5).onChange(applySettings);
        });
        Object.keys(textController).forEach(keyName => {
            if (keyName == 'font') return;
            textSettings.add(textController, keyName, 0, 100, 1).onChange(refreshText);
        });       
    }

    

    /*document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);*/
    window.addEventListener('keypress', keyPress, false);
    activeCamera = camera;
}

function applyController(controller, target) {
    Object.keys(controller).forEach(keyName => {
        target[keyName] = controller[keyName];
    });
}

function keyPress(e) {
    if (e.key == 'q') {
        console.log("debug camera active")
        activeCamera = debugCamera;
    }
    if (e.key == 'w') {
        console.log("main camera active")
        activeCamera = camera;
    }
}

function applySettings () {
    //cameraoptions
    applyController(cameraController, camera);
    
    applyController(cameraPositionController, camera.position);
};

function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/test_font.json', function (response) {
        textController.font = response;
        refreshText();
    });
}

function createText() {
    textGeo = new THREE.TextGeometry(text, textController);
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.position.x = centerOffset;
    textMesh1.position.y = 0;
    textMesh1.position.z = 0;
    textMesh1.rotation.x = 0;
    group.add(textMesh1);
}

function refreshText() {
    group.remove(textMesh1);
    if (!text) return;
    createText();
}

function animate() {
    requestAnimationFrame(animate);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    
    if (debug) {
        debugCamera.lookAt(scene.position);
        cameraHelper.update();
        cameraHelper.isVisible = true;
        renderer.render(scene, activeCamera);
    }
    else {
        renderer.render(scene, camera);
    }
    
}