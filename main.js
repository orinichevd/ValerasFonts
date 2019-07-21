var renderer, camera, scene;
var stats;
var textGeo, textMesh1;
var group;
var materials;
var text = "three.js", height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelEnabled = true
    ;

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

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    
    camera.position.z = 700;
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
        new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0x000000 }) // side
    ];
    group = new THREE.Group();
    group.position.y = 100;
    scene.add(group);


    loadFont();

   /* var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000),
        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
    );
    plane.position.y = 100;
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);*/

    //helpers

    var axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );

    /*document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);*/
}

function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/test_font.json', function (response) {
        font = response;
        refreshText();
    });
}

function createText() {
    textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    var centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
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

    camera.lookAt(scene.position);
    renderer.render(scene, camera);

    //if (debug) stats.update();
}