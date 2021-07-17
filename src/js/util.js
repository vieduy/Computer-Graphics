// ======================================= END TEAPOT ===============================
/**
 * Initialize the statistics domelement
 * 
 * @param {Number} type 0: fps, 1: ms, 2: mb, 3+: custom
 * @returns stats javascript object
 */
function initStats(type) {

    var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
    var stats = new Stats();

    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom);

    return stats;
}

/**
 * Initialize a simple default renderer and binds it to the "webgl-output" dom
 * element.
 * 
 * @param additionalProperties Additional properties to pass into the renderer
 */
function initRenderer(additionalProperties) {

    var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
    var renderer = new THREE.WebGLRenderer(props);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    return renderer;
}

/**
 * Initialize a simple default canvas renderer.
 * 
 */
function initCanvasRenderer() {

    var canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setClearColor(new THREE.Color(0x000000));
    canvasRenderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-output").appendChild(canvasRenderer.domElement);

    return canvasRenderer;
}

/**
 * Initialize a simple camera and point it at the center of a scene
 * 
 * @param {THREE.Vector3} [initialPosition]
 */
function initCamera(initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(50, 40, 50);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
}

function initDefaultLighting(scene, initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-10, 30, 40);
    // -10, 30, 40);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 15;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "spotLight"

    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    ambientLight.intensity = 1
    scene.add(ambientLight);
    return { spotLight, ambientLight };
}

function initDefaultDirectionalLighting(scene, initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(100, 200, 200);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.copy(position);
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.castShadow = true;

    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;

    scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

}

/**
 * Initialize trackball controls to control the scene
 * 
 * @param {THREE.Camera} camera 
 * @param {THREE.Renderer} renderer 
 */
function initTrackballControls(camera, renderer) {
    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];

    return trackballControls;
}

/**
 * Apply a simple standard material to the passed in geometry and return the mesh
 * 
 * @param {*} geometry 
 * @param {*} material if provided use this meshnormal material instead of creating a new material 
 *                     this material will only be used if it is a meshnormal material.
 */
var applyMeshStandardMaterial = function(geometry, material) {
    if (!material || material.type !== "MeshStandardMaterial") {
        var material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
        material.side = THREE.DoubleSide;
    }

    return new THREE.Mesh(geometry, material)
}

/**
 * Apply meshnormal material to the geometry, optionally specifying whether
 * we want to see a wireframe as well.
 * 
 * @param {*} geometry 
 * @param {*} material if provided use this meshnormal material instead of creating a new material 
 *                     this material will only be used if it is a meshnormal material.
 */
var applyMeshNormalMaterial = function(geometry, material) {
    if (!material || material.type !== "MeshNormalMaterial") {
        material = new THREE.MeshNormalMaterial();
        material.side = THREE.DoubleSide;
    }

    return new THREE.Mesh(geometry, material)
}

/**
 * Add a simple cube and sphere to the provided scene
 * 
 * @param {THREE.Scene} scene 
 */
function addDefaultCubeAndSphere(scene) {

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    // add the sphere to the scene
    scene.add(sphere);

    return {
        cube: cube,
        sphere: sphere
    };
}

/**
 * Add a simple ground plance to the provided scene
 * 
 * @param {THREE.Scene} scene 
 */
function addGroundPlane(scene) {
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}

/**
 * Add a simple ground plance to the provided scene
 * 
 * @param {THREE.Scene} scene 
 */
function addLargeGroundPlane(scene, useTexture) {

    var withTexture = (useTexture !== undefined) ? useTexture : false;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    if (withTexture) {
        var textureLoader = new THREE.TextureLoader();
        planeMaterial.map = textureLoader.load("../../assets/textures/general/floor-wood.jpg");
        planeMaterial.map.wrapS = THREE.RepeatWrapping;
        planeMaterial.map.wrapT = THREE.RepeatWrapping;
        planeMaterial.map.repeat.set(80, 80)
    }
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    // plane.rotation.z = -0.5* Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}

function addHouseAndTree(scene) {

    createBoundingWall(scene);
    createGroundPlane(scene);
    createHouse(scene);
    createTree(scene);

    function createBoundingWall(scene) {
        var wallLeft = new THREE.CubeGeometry(70, 2, 2);
        var wallRight = new THREE.CubeGeometry(70, 2, 2);
        var wallTop = new THREE.CubeGeometry(2, 2, 50);
        var wallBottom = new THREE.CubeGeometry(2, 2, 50);

        var wallMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0522d
        });

        var wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
        var wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
        var wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
        var wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

        wallLeftMesh.position.set(15, 1, -25);
        wallRightMesh.position.set(15, 1, 25);
        wallTopMesh.position.set(-19, 1, 0);
        wallBottomMesh.position.set(49, 1, 0);

        scene.add(wallLeftMesh);
        scene.add(wallRightMesh);
        scene.add(wallBottomMesh);
        scene.add(wallTopMesh);

    }

    function createGroundPlane(scene) {
        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(70, 50);
        var planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x9acd32
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane)
    }

    function createHouse(scene) {
        var roof = new THREE.ConeGeometry(5, 4);
        var base = new THREE.CylinderGeometry(5, 5, 6);

        // create the mesh
        var roofMesh = new THREE.Mesh(roof, new THREE.MeshPhongMaterial({
            color: 0x8b7213
        }));
        var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({
            color: 0xffe4c4
        }));

        roofMesh.position.set(25, 8, 0);
        baseMesh.position.set(25, 3, 0);

        roofMesh.receiveShadow = true;
        baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        scene.add(roofMesh);
        scene.add(baseMesh);
    }

    /**
     * Add the tree to the scene
     * @param scene The scene to add the tree to
     */
    function createTree(scene) {
        var trunk = new THREE.CubeGeometry(1, 8, 1);
        var leaves = new THREE.SphereGeometry(4);

        // create the mesh
        var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({
            color: 0x8b4513
        }));
        var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
            color: 0x00ff00
        }));

        // position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(-10, 4, 0);
        leavesMesh.position.set(-10, 12, 0);

        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        leavesMesh.receiveShadow = true;

        scene.add(trunkMesh);
        scene.add(leavesMesh);
    }
}

function createGhostTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    var ctx = canvas.getContext('2d');
    // the body
    ctx.translate(-81, -84);

    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(83, 116);
    ctx.lineTo(83, 102);
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    ctx.lineTo(111, 116);
    ctx.lineTo(106.333, 111.333);
    ctx.lineTo(101.666, 116);
    ctx.lineTo(97, 111.333);
    ctx.lineTo(92.333, 116);
    ctx.lineTo(87.666, 111.333);
    ctx.lineTo(83, 116);
    ctx.fill();

    // the eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(91, 96);
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
    ctx.moveTo(103, 96);
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
    ctx.fill();

    // the pupils
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
};

/**
 * Add a folder to the gui containing the basic material properties.
 * 
 * @param gui the gui to add to
 * @param controls the current controls object
 * @param material the material to control
 * @param geometry the geometry we're working with
 * @param name optionally the name to assign to the folder
 */
function addBasicMaterialSettings(gui, controls, material, name) {

    var folderName = (name !== undefined) ? name : 'THREE.Material';

    controls.material = material;

    var folder = gui.addFolder(folderName);
    // folder.add(controls.material, 'id');
    // folder.add(controls.material, 'uuid');
    // folder.add(controls.material, 'name');
    folder.add(controls.material, 'opacity', 0, 1, 0.01);
    folder.add(controls.material, 'transparent');
    // folder.add(controls.material, 'overdraw', 0, 1, 0.01);
    folder.add(controls.material, 'visible');
    // folder.add(controls.material, 'side', {FrontSide: 0, BackSide: 1, BothSides: 2}).onChange(function (side) {
    //     controls.material.side = parseInt(side)
    // });

    // folder.add(controls.material, 'colorWrite');
    // folder.add(controls.material, 'flatShading').onChange(function(shading) {
    //     controls.material.flatShading = shading;
    //     controls.material.needsUpdate = true;
    // });
    // folder.add(controls.material, 'premultipliedAlpha');
    // folder.add(controls.material, 'dithering');
    // folder.add(controls.material, 'shadowSide', {FrontSide: 0, BackSide: 1, BothSides: 2});
    folder.add(controls.material, 'vertexColors', { NoColors: THREE.NoColors, FaceColors: THREE.FaceColors, VertexColors: THREE.VertexColors }).onChange(function(vertexColors) {
        material.vertexColors = parseInt(vertexColors);
    });
    // folder.add(controls.material, 'fog');

    return folder;
}

function addSpecificMaterialSettings(gui, controls, material, name) {
    controls.material = material;

    var folderName = (name !== undefined) ? name : 'THREE.' + material.type;
    var folder = gui.addFolder(folderName);
    switch (material.type) {
        case "MeshNormalMaterial":
            folder.add(controls.material, 'wireframe');
            return folder;

        case "MeshPhongMaterial":
            controls.specular = material.specular.getStyle();
            folder.addColor(controls, 'specular').onChange(function(e) {
                material.specular.setStyle(e)
            });
            folder.add(material, 'shininess', 0, 100, 0.01);
            return folder;

        case "MeshStandardMaterial":
            controls.color = material.color.getStyle();
            folder.addColor(controls, 'color').onChange(function(e) {
                material.color.setStyle(e)
            });
            controls.emissive = material.emissive.getStyle();
            folder.addColor(controls, 'emissive').onChange(function(e) {
                material.emissive.setStyle(e)
            });
            folder.add(material, 'metalness', 0, 1, 0.01);
            folder.add(material, 'roughness', 0, 1, 0.01);
            folder.add(material, 'wireframe');

            return folder;
    }
}

function redrawGeometryAndUpdateUI(gui, scene, controls, geomFunction) {
    guiRemoveFolder(gui, controls.specificMaterialFolder);
    guiRemoveFolder(gui, controls.currentMaterialFolder);
    if (controls.mesh) scene.remove(controls.mesh)
    var changeMat = eval("(" + controls.appliedMaterial + ")")
    if (controls.mesh) {
        controls.mesh = changeMat(geomFunction(), controls.mesh.material);
    } else {
        controls.mesh = changeMat(geomFunction());
    }

    controls.mesh.castShadow = controls.castShadow;
    scene.add(controls.mesh)
    controls.currentMaterialFolder = addBasicMaterialSettings(gui, controls, controls.mesh.material);
    controls.specificMaterialFolder = addSpecificMaterialSettings(gui, controls, controls.mesh.material);
}

/**
 * Remove a folder from the dat.gui
 * 
 * @param {*} gui 
 * @param {*} folder 
 */
function guiRemoveFolder(gui, folder) {
    if (folder && folder.name && gui.__folders[folder.name]) {
        gui.__folders[folder.name].close();
        gui.__folders[folder.name].domElement.parentNode.parentNode.removeChild(gui.__folders[folder.name].domElement.parentNode);
        delete gui.__folders[folder.name];
        gui.onResize();
    }
}

/**
 * 
 * 
 * @param gui the gui to add to
 * @param controls the current controls object
 * @param material material for the meshes
 */
function addMeshSelection(gui, controls, material, scene) {
    var sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
    var cubeGeometry = new THREE.BoxGeometry(16, 16, 15);
    var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


    var sphere = new THREE.Mesh(sphereGeometry, material);
    var cube = new THREE.Mesh(cubeGeometry, material);
    var plane = new THREE.Mesh(planeGeometry, material);
    var newcube = new Cube(20, 20, 20, 0xfffff);
    var mycube = newcube.getMesh()
        // var newteapot = new Teapot(10);
        // var teapot = newteapot.getMesh() 

    sphere.position.x = 0;
    sphere.position.y = 11;
    sphere.position.z = 2;

    cube.position.y = 8;

    controls.selectedMesh = "cube";
    loadGopher(material).then(function(gopher) {

        gopher.scale.x = 5;
        gopher.scale.y = 5;
        gopher.scale.z = 5;
        gopher.position.z = 0
        gopher.position.x = -10
        gopher.position.y = 0

        gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher", "newcube"]).onChange(function(e) {

            scene.remove(controls.selected);

            switch (e) {
                case "cube":
                    scene.add(cube);
                    controls.selected = cube;
                    break;
                case "sphere":
                    scene.add(sphere);
                    controls.selected = sphere;
                    break;
                case "plane":
                    scene.add(plane);
                    controls.selected = plane;
                    break;
                case "gopher":
                    scene.add(gopher);
                    controls.selected = gopher;
                    break;
                case "newcube":
                    scene.add(mycube);
                    controls.selected = mycube;
                    break;
                    // case "teapot":
                    //     scene.add(teapot);
                    //     controls.selected = teapot;
                    //     break;
            }
        });
    });

    controls.selected = cube;
    scene.add(controls.selected);
}

/**
 * Load a gopher, and apply the material
 * @param material if set apply this material to the gopher
 * @returns promise which is fullfilled once the goher is loaded
 */
function loadGopher(material) {
    var loader = new THREE.OBJLoader();
    var mesh = null;
    var p = new Promise(function(resolve) {
        loader.load('../../assets/models/gopher/gopher.obj', function(loadedMesh) {
            // this is a group of meshes, so iterate until we reach a THREE.Mesh
            mesh = loadedMesh;
            if (material) {
                // material is defined, so overwrite the default material.
                computeNormalsGroup(mesh);
                setMaterialGroup(material, mesh);
            }
            resolve(mesh);
        });
    });

    return p;
}

function setMaterialGroup(material, group) {
    if (group instanceof THREE.Mesh) {
        group.material = material;
    } else if (group instanceof THREE.Group) {
        group.children.forEach(function(child) { setMaterialGroup(material, child) });
    }
}

function computeNormalsGroup(group) {
    if (group instanceof THREE.Mesh) {
        var tempGeom = new THREE.Geometry();
        tempGeom.fromBufferGeometry(group.geometry)
        tempGeom.computeFaceNormals();
        tempGeom.mergeVertices();
        tempGeom.computeVertexNormals();

        tempGeom.normalsNeedUpdate = true;

        // group = new THREE.BufferGeometry();
        // group.fromGeometry(tempGeom);
        group.geometry = tempGeom;

    } else if (group instanceof THREE.Group) {
        group.children.forEach(function(child) { computeNormalsGroup(child) });
    }
}
//===========================Camera Helper============================
class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min; // this will call the min setter
    }
}

//========================================================

class Shape {
    // position = {
    //     x: 0,
    //     y: 0,
    //     z: 0
    // }
    // rotation = {
    //     x: 0,
    //     y: 0,
    //     z: 0,
    // }
    // scale = {
    //     x: 1,
    //     y: 1,
    //     z: 1,
    // }
    constructor(color, renderMode) {
        this.color = color
            //0 - Solid, 1 - Wireframe, 2 - Point
        this.renderMode = renderMode
        this.texture = undefined
    }
}

class Cube extends Shape {
    constructor(height, width, depth, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            h: height,
            w: width,
            d: depth
        }
        this.mesh = undefined
        this.SEGMENT_RATE = 12
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.BoxGeometry(
            this.size.w,
            this.size.h,
            this.size.d,
            Math.max(parseInt(this.size.w * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.h * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.d * this.SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.BoxGeometry(
            this.size.w,
            this.size.h,
            this.size.d,
            Math.max(parseInt(this.size.w * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.h * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.d * this.SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.BoxGeometry(
            this.size.w,
            this.size.h,
            this.size.d,
            1, //Segment at 1 to render only real vertices
            1, //Segment at 1 to render only real vertices
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
            return this.mesh
        }
        //Add getPointMesh
        //Add getLineMesh
}


class Cone extends Shape {
    constructor(radius, height, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius,
            h: height
        }
        this.mesh = undefined
        this.HEIGHT_SEGMENT_RATE = 12
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.ConeGeometry(
            this.size.r,
            this.size.h,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.ConeGeometry(
            this.size.r,
            this.size.h,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.ConeGeometry(
            this.size.r,
            this.size.h,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

class Cylinder extends Shape {
    constructor(radiusBottom, radiusTop, height, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            rt: radiusTop,
            rb: radiusBottom,
            h: height
        }
        this.mesh = undefined
        this.HEIGHT_SEGMENT_RATE = 12
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt,
            this.size.rb,
            this.size.h,
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt,
            this.size.rb,
            this.size.h,
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt,
            this.size.rb,
            this.size.h,
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2),
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

class Sphere extends Shape {
    constructor(radius, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius
        }
        this.mesh = undefined
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.SphereGeometry(
            this.size.r,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.SphereGeometry(
            this.size.r,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.SphereGeometry(
            this.size.r,
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2),
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

class Torus extends Shape {
    constructor(radius, tube, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius,
            t: tube
        }
        this.mesh = undefined
        this.TUBULAR_SEGMENT_RATE = 32
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

class Teapot extends Shape {
    constructor(radius, tube, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius,
            t: tube
        }
        this.mesh = undefined
        this.TUBULAR_SEGMENT_RATE = 32
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.TeapotBufferGeometry(
            teapotSize,
            tess,
            effectController.bottom,
            effectController.lid,
            effectController.body,
            effectController.fitLid, !effectController.nonblinn
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.TeapotBufferGeometry(
            teapotSize,
            tess,
            effectController.bottom,
            effectController.lid,
            effectController.body,
            effectController.fitLid, !effectController.nonblinn
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.TeapotBufferGeometry(
            teapotSize,
            tess,
            effectController.bottom,
            effectController.lid,
            effectController.body,
            effectController.fitLid, !effectController.nonblinn
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.attributes.position.array.length; i++) {
            geo.vertices.push(new THREE.Vector3(geometry.attributes.position.array[i * 3], geometry.attributes.position.array[i * 3 + 1], geometry.attributes.position.array[i * 3 + 2]));
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 1 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

class Icosahedron extends Shape {
    constructor(radius, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius
        }
        this.mesh = undefined
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({ map: texture })
        } else material = new THREE.MeshLambertMaterial({ color: this.color })
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial({ color: this.color, linewidth: 1 });
        return new THREE.LineSegments(geo, mat);
    }

    setPointMesh() {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({ color: this.color, size: 0.01 })
        let particles = new THREE.Points(geo, mat);
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch (this.renderMode) {
            case 0:
                this.mesh = this.setSolidMesh(texture);
                break;
            case 1:
                this.mesh = this.setWiredMesh();
                break;
            case 2:
                this.mesh = this.setPointMesh();
                break;
            default:
                console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

var effectController = {

    shininess: 40.0,
    ka: 0.17,
    kd: 0.51,
    ks: 0.2,
    metallic: true,

    hue: 0.121,
    saturation: 0.73,
    lightness: 0.66,

    lhue: 0.04,
    lsaturation: 0.01, // non-zero so that fractions will be shown
    llightness: 1.0,

    // bizarrely, if you initialize these with negative numbers, the sliders
    // will not show any decimal places.
    lx: 0.32,
    ly: 0.39,
    lz: 0.7,
    newTess: 15,
    bottom: true,
    lid: true,
    body: true,
    fitLid: false,
    nonblinn: false,
    newShading: "glossy"
};

var tess = -1;
var teapotSize = 10;
// var teapotGeometry = new THREE.TeapotBufferGeometry(teapotSize);
// var teapot = new THREE.Mesh(
//     teapotGeometry);

//=================== globalstate======
class GlobalState {
    constructor() {
        this.prevMesh = undefined
        this.activeShape = new Cube(10, 10, 10, 0xff0000)
        this.activeMesh = this.activeShape.getMesh()
        this.activeTexture = undefined
        this.onDrag = false
        this.speed = 0;
        this.accelaretion = 0.001;
    }

    updateShape(shape, renderMode = 0, callback) {
        this.prevMesh = this.activeMesh
            //NOTE: dat.gui is really weird with string-number alias option, its assigned value is not a string nor number so without parseInt renderMode value pass will fail
        renderMode = parseInt(renderMode)
        switch (shape) {
            case 'Cube':
                this.activeShape = new Cube(10, 10, 10, 0xff0000, renderMode)
                break;
            case 'Cone':
                this.activeShape = new Cone(10, 20, 0xff0000, renderMode)
                break;
            case 'Cylinder':
                this.activeShape = new Cylinder(10, 10, 20, 0xff0000, renderMode)
                break;
            case 'Sphere':
                this.activeShape = new Sphere(10, 0xff0000, renderMode)
                break;
            case 'Icosahedron':
                this.activeShape = new Icosahedron(10, 0xff00000, renderMode)
                break;
            case 'Torus':
                this.activeShape = new Torus(10, 3, 0xff0000, renderMode)
                break;
            case 'Teapot':
                this.activeShape = new Teapot()
                break;
            default:
        }
        this.activeMesh = this.activeShape.getMesh()
    }

    updateTexture() {
        this.prevMesh = this.activeMesh
        this.activeShape.setMesh(this.activeTexture)
        this.activeMesh = this.activeShape.getMesh()
    }

    updateRenderMode(renderMode = 0) {
        this.prevMesh = this.activeMesh
            //NOTE: dat.gui is really weird with string-number alias option, its assigned value is not a string nor number so without parseInt renderMode value pass will fail
        this.activeShape.renderMode = parseInt(renderMode)
        this.activeShape.setMesh(this.activeTexture)
        this.activeMesh = this.activeShape.getMesh()
    }
}

//=========option ===============================================

class Option {
    constructor() {

        //lighting
        this.ambientLightIntensity = 0.2;
        this.lighting = true;
        this.lightingPosX = 3;
        this.lightingPosY = 3;
        this.lightingPosZ = 2;
        this.lightsource = false;
        this.shadow = false;
        //transformation
        this.enablePositionDragging = false;
        this.enableScaleDragging = false;
        this.enableRotationDragging = false;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        //texture
        this.useTexture = false;
        this.textureColor = 0xff0000
        this.textureData = undefined
        this.textureFile = undefined
            //dummy field to open texture browser
        this.dummyBrowser = function() {}
            //camera
        this.lookAtEyeX = -30
        this.lookAtEyeY = 40
        this.lookAtEyeZ = 30
        this.lookAtCenterX = -30
        this.lookAtCenterY = 40
        this.lookAtCenterZ = 30
        this.lookAtUpX = 0
        this.lookAtUpY = 1
        this.lookAtUpZ = 0
        this.perspectiveFovy = 75
        this.perspectiveAspectX = (window.innerWidth > window.innerHeight) ? 1 : window.innerWidth / window.innerHeight
        this.perspectiveAspectY = (window.innerWidth < window.innerHeight) ? 1 : window.innerHeight / window.innerWidth
        this.perspectiveZNear = 0.1
        this.perspectiveZFar = 1000
            //animation
        this.isAnimateBouncing = false;
        this.isAnimateRotating = false;
    }

    fileSelect(cb) {
        let fileDialog = document.getElementById("file-input")
        fileDialog.click()
        fileDialog.onchange = (e) => {
            if (e.target.files.length < 1) {
                alert('Please at least choose one file')
                return
            }

            let reader = new FileReader()
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = (e) => {
                var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
                if (match == null) {
                    throw 'Could not parse result'; // should not happen
                }
                this.textureData = e.target.result
                cb()
            }
        }
    }
}


class ShapePicker {
    constructor() {
        this.shape = "Cube"

        this.toCube = function() { this.shape = "Cube" }
        this.toSphere = function() { this.shape = "Sphere" }
        this.toCylinder = function() { this.shape = "Cylinder" }
        this.toCone = function() { this.shape = "Cone" }
        this.toIcosahedron = function() { this.shape = "Icosahedron" }
        this.toTorus = function() { this.shape = "Torus" }
        this.toTeapot = function() { this.shape = "Teapot" }
    }
}

class ModePicker {
    constructor() {
        //0 - Solid, 1 - Wireframe, 2 - Point
        this.renderMode = 0

        this.toSolid = function() { this.renderMode = 0 }
        this.toLine = function() { this.renderMode = 1 }
        this.toPoint = function() { this.renderMode = 2 }
    }
}
// =========================== TEAPOT ==================================================
THREE.TeapotBufferGeometry = function(size, segments, bottom, lid, body, fitLid, blinn) {

    "use strict";

    // 32 * 4 * 4 Bezier spline patches
    var teapotPatches = [
        /*rim*/
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        3, 16, 17, 18, 7, 19, 20, 21, 11, 22, 23, 24, 15, 25, 26, 27,
        18, 28, 29, 30, 21, 31, 32, 33, 24, 34, 35, 36, 27, 37, 38, 39,
        30, 40, 41, 0, 33, 42, 43, 4, 36, 44, 45, 8, 39, 46, 47, 12,
        /*body*/
        12, 13, 14, 15, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        15, 25, 26, 27, 51, 60, 61, 62, 55, 63, 64, 65, 59, 66, 67, 68,
        27, 37, 38, 39, 62, 69, 70, 71, 65, 72, 73, 74, 68, 75, 76, 77,
        39, 46, 47, 12, 71, 78, 79, 48, 74, 80, 81, 52, 77, 82, 83, 56,
        56, 57, 58, 59, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
        59, 66, 67, 68, 87, 96, 97, 98, 91, 99, 100, 101, 95, 102, 103, 104,
        68, 75, 76, 77, 98, 105, 106, 107, 101, 108, 109, 110, 104, 111, 112, 113,
        77, 82, 83, 56, 107, 114, 115, 84, 110, 116, 117, 88, 113, 118, 119, 92,
        /*handle*/
        120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135,
        123, 136, 137, 120, 127, 138, 139, 124, 131, 140, 141, 128, 135, 142, 143, 132,
        132, 133, 134, 135, 144, 145, 146, 147, 148, 149, 150, 151, 68, 152, 153, 154,
        135, 142, 143, 132, 147, 155, 156, 144, 151, 157, 158, 148, 154, 159, 160, 68,
        /*spout*/
        161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176,
        164, 177, 178, 161, 168, 179, 180, 165, 172, 181, 182, 169, 176, 183, 184, 173,
        173, 174, 175, 176, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
        176, 183, 184, 173, 188, 197, 198, 185, 192, 199, 200, 189, 196, 201, 202, 193,
        /*lid*/
        203, 203, 203, 203, 204, 205, 206, 207, 208, 208, 208, 208, 209, 210, 211, 212,
        203, 203, 203, 203, 207, 213, 214, 215, 208, 208, 208, 208, 212, 216, 217, 218,
        203, 203, 203, 203, 215, 219, 220, 221, 208, 208, 208, 208, 218, 222, 223, 224,
        203, 203, 203, 203, 221, 225, 226, 204, 208, 208, 208, 208, 224, 227, 228, 209,
        209, 210, 211, 212, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
        212, 216, 217, 218, 232, 241, 242, 243, 236, 244, 245, 246, 240, 247, 248, 249,
        218, 222, 223, 224, 243, 250, 251, 252, 246, 253, 254, 255, 249, 256, 257, 258,
        224, 227, 228, 209, 252, 259, 260, 229, 255, 261, 262, 233, 258, 263, 264, 237,
        /*bottom*/
        265, 265, 265, 265, 266, 267, 268, 269, 270, 271, 272, 273, 92, 119, 118, 113,
        265, 265, 265, 265, 269, 274, 275, 276, 273, 277, 278, 279, 113, 112, 111, 104,
        265, 265, 265, 265, 276, 280, 281, 282, 279, 283, 284, 285, 104, 103, 102, 95,
        265, 265, 265, 265, 282, 286, 287, 266, 285, 288, 289, 270, 95, 94, 93, 92
    ];

    var teapotVertices = [
        1.4, 0, 2.4,
        1.4, -0.784, 2.4,
        0.784, -1.4, 2.4,
        0, -1.4, 2.4,
        1.3375, 0, 2.53125,
        1.3375, -0.749, 2.53125,
        0.749, -1.3375, 2.53125,
        0, -1.3375, 2.53125,
        1.4375, 0, 2.53125,
        1.4375, -0.805, 2.53125,
        0.805, -1.4375, 2.53125,
        0, -1.4375, 2.53125,
        1.5, 0, 2.4,
        1.5, -0.84, 2.4,
        0.84, -1.5, 2.4,
        0, -1.5, 2.4, -0.784, -1.4, 2.4, -1.4, -0.784, 2.4, -1.4, 0, 2.4, -0.749, -1.3375, 2.53125, -1.3375, -0.749, 2.53125, -1.3375, 0, 2.53125, -0.805, -1.4375, 2.53125, -1.4375, -0.805, 2.53125, -1.4375, 0, 2.53125, -0.84, -1.5, 2.4, -1.5, -0.84, 2.4, -1.5, 0, 2.4, -1.4, 0.784, 2.4, -0.784, 1.4, 2.4,
        0, 1.4, 2.4, -1.3375, 0.749, 2.53125, -0.749, 1.3375, 2.53125,
        0, 1.3375, 2.53125, -1.4375, 0.805, 2.53125, -0.805, 1.4375, 2.53125,
        0, 1.4375, 2.53125, -1.5, 0.84, 2.4, -0.84, 1.5, 2.4,
        0, 1.5, 2.4,
        0.784, 1.4, 2.4,
        1.4, 0.784, 2.4,
        0.749, 1.3375, 2.53125,
        1.3375, 0.749, 2.53125,
        0.805, 1.4375, 2.53125,
        1.4375, 0.805, 2.53125,
        0.84, 1.5, 2.4,
        1.5, 0.84, 2.4,
        1.75, 0, 1.875,
        1.75, -0.98, 1.875,
        0.98, -1.75, 1.875,
        0, -1.75, 1.875,
        2, 0, 1.35,
        2, -1.12, 1.35,
        1.12, -2, 1.35,
        0, -2, 1.35,
        2, 0, 0.9,
        2, -1.12, 0.9,
        1.12, -2, 0.9,
        0, -2, 0.9, -0.98, -1.75, 1.875, -1.75, -0.98, 1.875, -1.75, 0, 1.875, -1.12, -2, 1.35, -2, -1.12, 1.35, -2, 0, 1.35, -1.12, -2, 0.9, -2, -1.12, 0.9, -2, 0, 0.9, -1.75, 0.98, 1.875, -0.98, 1.75, 1.875,
        0, 1.75, 1.875, -2, 1.12, 1.35, -1.12, 2, 1.35,
        0, 2, 1.35, -2, 1.12, 0.9, -1.12, 2, 0.9,
        0, 2, 0.9,
        0.98, 1.75, 1.875,
        1.75, 0.98, 1.875,
        1.12, 2, 1.35,
        2, 1.12, 1.35,
        1.12, 2, 0.9,
        2, 1.12, 0.9,
        2, 0, 0.45,
        2, -1.12, 0.45,
        1.12, -2, 0.45,
        0, -2, 0.45,
        1.5, 0, 0.225,
        1.5, -0.84, 0.225,
        0.84, -1.5, 0.225,
        0, -1.5, 0.225,
        1.5, 0, 0.15,
        1.5, -0.84, 0.15,
        0.84, -1.5, 0.15,
        0, -1.5, 0.15, -1.12, -2, 0.45, -2, -1.12, 0.45, -2, 0, 0.45, -0.84, -1.5, 0.225, -1.5, -0.84, 0.225, -1.5, 0, 0.225, -0.84, -1.5, 0.15, -1.5, -0.84, 0.15, -1.5, 0, 0.15, -2, 1.12, 0.45, -1.12, 2, 0.45,
        0, 2, 0.45, -1.5, 0.84, 0.225, -0.84, 1.5, 0.225,
        0, 1.5, 0.225, -1.5, 0.84, 0.15, -0.84, 1.5, 0.15,
        0, 1.5, 0.15,
        1.12, 2, 0.45,
        2, 1.12, 0.45,
        0.84, 1.5, 0.225,
        1.5, 0.84, 0.225,
        0.84, 1.5, 0.15,
        1.5, 0.84, 0.15, -1.6, 0, 2.025, -1.6, -0.3, 2.025, -1.5, -0.3, 2.25, -1.5, 0, 2.25, -2.3, 0, 2.025, -2.3, -0.3, 2.025, -2.5, -0.3, 2.25, -2.5, 0, 2.25, -2.7, 0, 2.025, -2.7, -0.3, 2.025, -3, -0.3, 2.25, -3, 0, 2.25, -2.7, 0, 1.8, -2.7, -0.3, 1.8, -3, -0.3, 1.8, -3, 0, 1.8, -1.5, 0.3, 2.25, -1.6, 0.3, 2.025, -2.5, 0.3, 2.25, -2.3, 0.3, 2.025, -3, 0.3, 2.25, -2.7, 0.3, 2.025, -3, 0.3, 1.8, -2.7, 0.3, 1.8, -2.7, 0, 1.575, -2.7, -0.3, 1.575, -3, -0.3, 1.35, -3, 0, 1.35, -2.5, 0, 1.125, -2.5, -0.3, 1.125, -2.65, -0.3, 0.9375, -2.65, 0, 0.9375, -2, -0.3, 0.9, -1.9, -0.3, 0.6, -1.9, 0, 0.6, -3, 0.3, 1.35, -2.7, 0.3, 1.575, -2.65, 0.3, 0.9375, -2.5, 0.3, 1.125, -1.9, 0.3, 0.6, -2, 0.3, 0.9,
        1.7, 0, 1.425,
        1.7, -0.66, 1.425,
        1.7, -0.66, 0.6,
        1.7, 0, 0.6,
        2.6, 0, 1.425,
        2.6, -0.66, 1.425,
        3.1, -0.66, 0.825,
        3.1, 0, 0.825,
        2.3, 0, 2.1,
        2.3, -0.25, 2.1,
        2.4, -0.25, 2.025,
        2.4, 0, 2.025,
        2.7, 0, 2.4,
        2.7, -0.25, 2.4,
        3.3, -0.25, 2.4,
        3.3, 0, 2.4,
        1.7, 0.66, 0.6,
        1.7, 0.66, 1.425,
        3.1, 0.66, 0.825,
        2.6, 0.66, 1.425,
        2.4, 0.25, 2.025,
        2.3, 0.25, 2.1,
        3.3, 0.25, 2.4,
        2.7, 0.25, 2.4,
        2.8, 0, 2.475,
        2.8, -0.25, 2.475,
        3.525, -0.25, 2.49375,
        3.525, 0, 2.49375,
        2.9, 0, 2.475,
        2.9, -0.15, 2.475,
        3.45, -0.15, 2.5125,
        3.45, 0, 2.5125,
        2.8, 0, 2.4,
        2.8, -0.15, 2.4,
        3.2, -0.15, 2.4,
        3.2, 0, 2.4,
        3.525, 0.25, 2.49375,
        2.8, 0.25, 2.475,
        3.45, 0.15, 2.5125,
        2.9, 0.15, 2.475,
        3.2, 0.15, 2.4,
        2.8, 0.15, 2.4,
        0, 0, 3.15,
        0.8, 0, 3.15,
        0.8, -0.45, 3.15,
        0.45, -0.8, 3.15,
        0, -0.8, 3.15,
        0, 0, 2.85,
        0.2, 0, 2.7,
        0.2, -0.112, 2.7,
        0.112, -0.2, 2.7,
        0, -0.2, 2.7, -0.45, -0.8, 3.15, -0.8, -0.45, 3.15, -0.8, 0, 3.15, -0.112, -0.2, 2.7, -0.2, -0.112, 2.7, -0.2, 0, 2.7, -0.8, 0.45, 3.15, -0.45, 0.8, 3.15,
        0, 0.8, 3.15, -0.2, 0.112, 2.7, -0.112, 0.2, 2.7,
        0, 0.2, 2.7,
        0.45, 0.8, 3.15,
        0.8, 0.45, 3.15,
        0.112, 0.2, 2.7,
        0.2, 0.112, 2.7,
        0.4, 0, 2.55,
        0.4, -0.224, 2.55,
        0.224, -0.4, 2.55,
        0, -0.4, 2.55,
        1.3, 0, 2.55,
        1.3, -0.728, 2.55,
        0.728, -1.3, 2.55,
        0, -1.3, 2.55,
        1.3, 0, 2.4,
        1.3, -0.728, 2.4,
        0.728, -1.3, 2.4,
        0, -1.3, 2.4, -0.224, -0.4, 2.55, -0.4, -0.224, 2.55, -0.4, 0, 2.55, -0.728, -1.3, 2.55, -1.3, -0.728, 2.55, -1.3, 0, 2.55, -0.728, -1.3, 2.4, -1.3, -0.728, 2.4, -1.3, 0, 2.4, -0.4, 0.224, 2.55, -0.224, 0.4, 2.55,
        0, 0.4, 2.55, -1.3, 0.728, 2.55, -0.728, 1.3, 2.55,
        0, 1.3, 2.55, -1.3, 0.728, 2.4, -0.728, 1.3, 2.4,
        0, 1.3, 2.4,
        0.224, 0.4, 2.55,
        0.4, 0.224, 2.55,
        0.728, 1.3, 2.55,
        1.3, 0.728, 2.55,
        0.728, 1.3, 2.4,
        1.3, 0.728, 2.4,
        0, 0, 0,
        1.425, 0, 0,
        1.425, 0.798, 0,
        0.798, 1.425, 0,
        0, 1.425, 0,
        1.5, 0, 0.075,
        1.5, 0.84, 0.075,
        0.84, 1.5, 0.075,
        0, 1.5, 0.075, -0.798, 1.425, 0, -1.425, 0.798, 0, -1.425, 0, 0, -0.84, 1.5, 0.075, -1.5, 0.84, 0.075, -1.5, 0, 0.075, -1.425, -0.798, 0, -0.798, -1.425, 0,
        0, -1.425, 0, -1.5, -0.84, 0.075, -0.84, -1.5, 0.075,
        0, -1.5, 0.075,
        0.798, -1.425, 0,
        1.425, -0.798, 0,
        0.84, -1.5, 0.075,
        1.5, -0.84, 0.075
    ];

    THREE.BufferGeometry.call(this);

    this.type = 'TeapotBufferGeometry';

    this.parameters = {
        size: size,
        segments: segments,
        bottom: bottom,
        lid: lid,
        body: body,
        fitLid: fitLid,
        blinn: blinn
    };

    size = size || 50;

    // number of segments per patch
    segments = segments !== undefined ? Math.max(2, Math.floor(segments) || 10) : 10;

    // which parts should be visible
    bottom = bottom === undefined ? true : bottom;
    lid = lid === undefined ? true : lid;
    body = body === undefined ? true : body;

    // Should the lid be snug? It's not traditional, but we make it snug by default
    fitLid = fitLid === undefined ? true : fitLid;

    // Jim Blinn scaled the teapot down in size by about 1.3 for
    // some rendering tests. He liked the new proportions that he kept
    // the data in this form. The model was distributed with these new
    // proportions and became the norm. Trivia: comparing images of the
    // real teapot and the computer model, the ratio for the bowl of the
    // real teapot is more like 1.25, but since 1.3 is the traditional
    // value given, we use it here.
    var blinnScale = 1.3;
    blinn = blinn === undefined ? true : blinn;

    // scale the size to be the real scaling factor
    var maxHeight = 3.15 * (blinn ? 1 : blinnScale);

    var maxHeight2 = maxHeight / 2;
    var trueSize = size / maxHeight2;

    // Number of elements depends on what is needed. Subtract degenerate
    // triangles at tip of bottom and lid out in advance.
    var numTriangles = bottom ? (8 * segments - 4) * segments : 0;
    numTriangles += lid ? (16 * segments - 4) * segments : 0;
    numTriangles += body ? 40 * segments * segments : 0;

    var indices = new Uint32Array(numTriangles * 3);

    var numVertices = bottom ? 4 : 0;
    numVertices += lid ? 8 : 0;
    numVertices += body ? 20 : 0;
    numVertices *= (segments + 1) * (segments + 1);

    var vertices = new Float32Array(numVertices * 3);
    var normals = new Float32Array(numVertices * 3);
    var uvs = new Float32Array(numVertices * 2);

    // Bezier form
    var ms = new THREE.Matrix4();
    ms.set(-1.0, 3.0, -3.0, 1.0,
        3.0, -6.0, 3.0, 0.0, -3.0, 3.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 0.0);

    var g = [];
    var i, r, c;

    var sp = [];
    var tp = [];
    var dsp = [];
    var dtp = [];

    // M * G * M matrix, sort of see
    // http://www.cs.helsinki.fi/group/goa/mallinnus/curves/surfaces.html
    var mgm = [];

    var vert = [];
    var sdir = [];
    var tdir = [];

    var norm = new THREE.Vector3();

    var tcoord;

    var sstep, tstep;
    var vertPerRow, eps;

    var s, t, sval, tval, p, dsval, dtval;

    var normOut = new THREE.Vector3();
    var v1, v2, v3, v4;

    var gmx = new THREE.Matrix4();
    var tmtx = new THREE.Matrix4();

    var vsp = new THREE.Vector4();
    var vtp = new THREE.Vector4();
    var vdsp = new THREE.Vector4();
    var vdtp = new THREE.Vector4();

    var vsdir = new THREE.Vector3();
    var vtdir = new THREE.Vector3();

    var mst = ms.clone();
    mst.transpose();

    // internal function: test if triangle has any matching vertices;
    // if so, don't save triangle, since it won't display anything.
    var notDegenerate = function(vtx1, vtx2, vtx3) {

        // if any vertex matches, return false
        return !(((vertices[vtx1 * 3] === vertices[vtx2 * 3]) &&
                (vertices[vtx1 * 3 + 1] === vertices[vtx2 * 3 + 1]) &&
                (vertices[vtx1 * 3 + 2] === vertices[vtx2 * 3 + 2])) ||
            ((vertices[vtx1 * 3] === vertices[vtx3 * 3]) &&
                (vertices[vtx1 * 3 + 1] === vertices[vtx3 * 3 + 1]) &&
                (vertices[vtx1 * 3 + 2] === vertices[vtx3 * 3 + 2])) ||
            ((vertices[vtx2 * 3] === vertices[vtx3 * 3]) &&
                (vertices[vtx2 * 3 + 1] === vertices[vtx3 * 3 + 1]) &&
                (vertices[vtx2 * 3 + 2] === vertices[vtx3 * 3 + 2])));

    };


    for (i = 0; i < 3; i++) {

        mgm[i] = new THREE.Matrix4();

    }

    var minPatches = body ? 0 : 20;
    var maxPatches = bottom ? 32 : 28;

    vertPerRow = segments + 1;

    eps = 0.0000001;

    var surfCount = 0;

    var vertCount = 0;
    var normCount = 0;
    var uvCount = 0;

    var indexCount = 0;

    for (var surf = minPatches; surf < maxPatches; surf++) {

        // lid is in the middle of the data, patches 20-27,
        // so ignore it for this part of the loop if the lid is not desired
        if (lid || (surf < 20 || surf >= 28)) {

            // get M * G * M matrix for x,y,z
            for (i = 0; i < 3; i++) {

                // get control patches
                for (r = 0; r < 4; r++) {

                    for (c = 0; c < 4; c++) {

                        // transposed
                        g[c * 4 + r] = teapotVertices[teapotPatches[surf * 16 + r * 4 + c] * 3 + i];

                        // is the lid to be made larger, and is this a point on the lid
                        // that is X or Y?
                        if (fitLid && (surf >= 20 && surf < 28) && (i !== 2)) {

                            // increase XY size by 7.7%, found empirically. I don't
                            // increase Z so that the teapot will continue to fit in the
                            // space -1 to 1 for Y (Y is up for the final model).
                            g[c * 4 + r] *= 1.077;

                        }

                        // Blinn "fixed" the teapot by dividing Z by blinnScale, and that's the
                        // data we now use. The original teapot is taller. Fix it:
                        if (!blinn && (i === 2)) {

                            g[c * 4 + r] *= blinnScale;

                        }

                    }

                }

                gmx.set(g[0], g[1], g[2], g[3], g[4], g[5], g[6], g[7], g[8], g[9], g[10], g[11], g[12], g[13], g[14], g[15]);

                tmtx.multiplyMatrices(gmx, ms);
                mgm[i].multiplyMatrices(mst, tmtx);

            }

            // step along, get points, and output
            for (sstep = 0; sstep <= segments; sstep++) {

                s = sstep / segments;

                for (tstep = 0; tstep <= segments; tstep++) {

                    t = tstep / segments;

                    // point from basis
                    // get power vectors and their derivatives
                    for (p = 4, sval = tval = 1.0; p--;) {

                        sp[p] = sval;
                        tp[p] = tval;
                        sval *= s;
                        tval *= t;

                        if (p === 3) {

                            dsp[p] = dtp[p] = 0.0;
                            dsval = dtval = 1.0;

                        } else {

                            dsp[p] = dsval * (3 - p);
                            dtp[p] = dtval * (3 - p);
                            dsval *= s;
                            dtval *= t;

                        }

                    }

                    vsp.fromArray(sp);
                    vtp.fromArray(tp);
                    vdsp.fromArray(dsp);
                    vdtp.fromArray(dtp);

                    // do for x,y,z
                    for (i = 0; i < 3; i++) {

                        // multiply power vectors times matrix to get value
                        tcoord = vsp.clone();
                        tcoord.applyMatrix4(mgm[i]);
                        vert[i] = tcoord.dot(vtp);

                        // get s and t tangent vectors
                        tcoord = vdsp.clone();
                        tcoord.applyMatrix4(mgm[i]);
                        sdir[i] = tcoord.dot(vtp);

                        tcoord = vsp.clone();
                        tcoord.applyMatrix4(mgm[i]);
                        tdir[i] = tcoord.dot(vdtp);

                    }

                    // find normal
                    vsdir.fromArray(sdir);
                    vtdir.fromArray(tdir);
                    norm.crossVectors(vtdir, vsdir);
                    norm.normalize();

                    // if X and Z length is 0, at the cusp, so point the normal up or down, depending on patch number
                    if (vert[0] === 0 && vert[1] === 0) {

                        // if above the middle of the teapot, normal points up, else down
                        normOut.set(0, vert[2] > maxHeight2 ? 1 : -1, 0);

                    } else {

                        // standard output: rotate on X axis
                        normOut.set(norm.x, norm.z, -norm.y);

                    }

                    // store it all
                    vertices[vertCount++] = trueSize * vert[0];
                    vertices[vertCount++] = trueSize * (vert[2] - maxHeight2);
                    vertices[vertCount++] = -trueSize * vert[1];

                    normals[normCount++] = normOut.x;
                    normals[normCount++] = normOut.y;
                    normals[normCount++] = normOut.z;

                    uvs[uvCount++] = 1 - t;
                    uvs[uvCount++] = 1 - s;

                }

            }

            // save the faces
            for (sstep = 0; sstep < segments; sstep++) {

                for (tstep = 0; tstep < segments; tstep++) {

                    v1 = surfCount * vertPerRow * vertPerRow + sstep * vertPerRow + tstep;
                    v2 = v1 + 1;
                    v3 = v2 + vertPerRow;
                    v4 = v1 + vertPerRow;

                    // Normals and UVs cannot be shared. Without clone(), you can see the consequences
                    // of sharing if you call geometry.applyMatrix( matrix ).
                    if (notDegenerate(v1, v2, v3)) {

                        indices[indexCount++] = v1;
                        indices[indexCount++] = v2;
                        indices[indexCount++] = v3;

                    }
                    if (notDegenerate(v1, v3, v4)) {

                        indices[indexCount++] = v1;
                        indices[indexCount++] = v3;
                        indices[indexCount++] = v4;

                    }

                }

            }

            // increment only if a surface was used
            surfCount++;

        }

    }

    this.setIndex(new THREE.BufferAttribute(indices, 1));
    this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    this.computeBoundingSphere();

};


THREE.TeapotBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
THREE.TeapotBufferGeometry.prototype.constructor = THREE.TeapotBufferGeometry;

THREE.TeapotBufferGeometry.prototype.clone = function() {

    var bufferGeometry = new THREE.TeapotBufferGeometry(
        this.parameters.size,
        this.parameters.segments,
        this.parameters.bottom,
        this.parameters.lid,
        this.parameters.body,
        this.parameters.fitLid,
        this.parameters.blinn
    );

    return bufferGeomet
}