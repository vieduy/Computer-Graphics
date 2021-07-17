// const { dat } = require("../../../libs/util/dat.gui"); 

function init() {

    // use the defaults
    var stats = initStats();
    const canvas = document.querySelector('#webgl-output');
    // deufaul renderer
    var renderer = initRenderer(canvas);
    // default camera: perspective camera
    var camera = initCamera();
    // var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var usetexture = true
        // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();
    // default ground Plane
    var groundPlane = addLargeGroundPlane(scene, usetexture)
    groundPlane.position.y = -10;

    // init mouse
    var mouse = {
        x: 0,
        y: 0
    };
    var onDrag = true

    var option = new Option()

    var shaperPick = new ShapePicker()
    var modePick = new ModePicker()
    var globalState = new GlobalState()
        //=============================== GRID ============================
        // grid
    var grid = new THREE.GridHelper(window.innerWidth, window.innerHeight);
    grid.position.y = -10;
    scene.add(grid);
    //====================================init light==========================
    // init light
    // add ambient lighting
    var ambientLight = new THREE.AmbientLight("#ffffff", 1);
    scene.add(ambientLight);
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-30, 40, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    //============================================================================

    var lights = []
    lights[0] = new THREE.PointLight(0xffffff);
    lights[1] = new THREE.AmbientLight(0xffffff, 0.2);
    //set default lighting positions
    lights[0].position.set(3, 3, 3);
    // scene.add(lights[1]);

    var sphereSize = 0.2;
    var pointLightHelper = new THREE.PointLightHelper(lights[0], sphereSize);
    scene.add(pointLightHelper);

    //=============================================================
    // call the render function
    var shapeContainer = document.getElementById('moveGUI')
    var optionContainer = document.getElementById('optionGUI')
    var modeContainer = document.getElementById('modeGUI')
    var step = 0;
    var scalingStep = 0;
    var material = new THREE.MeshPhysicalMaterial({ color: 0x7777ff })

    //=============================================================
    //update point light
    function updateLighting() {
        lights[1].intensity = controls.ambientLightIntensity
        if (controls.lighting) {
            scene.add(lights[0])
        } else {
            scene.remove(lights[0])
        }

        if (controls.lightsource) {
            lights[0].position.set(3, 3, 2);
        } else {
            lights[0].position.set(controls.lightingPosX, controls.lightingPosY, controls.lightingPosZ)
        }

        if (controls.shadow) {
            lights[0].castShadow = true
        } else {
            lights[0].castShadow = false
        }

    }
    //==========================update camera==============
    function updateCamera() {
        camera.far = controls.perspectiveZFar
        camera.near = controls.perspectiveZNear
        camera.fov = controls.perspectiveFovy
        camera.aspect = controls.perspectiveAspectX / controls.perspectiveAspectY
        camera.position.set(controls.lookAtEyeX, controls.lookAtEyeY, controls.lookAtEyeZ)
        camera.lookAt(controls.lookAtCenterX, controls.lookAtCenterY, controls.lookAtCenterZ)
        camera.up.set(controls.lookAtUpX, controls.lookAtUpY, controls.lookAtUpZ)
        camera.updateProjectionMatrix();
    }

    //======================== mouse handle ===============
    window.onmousemove = function(event) {

        //COPY AND PASTE CODE, PROCEED WITH CAUTION
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (controls.lightsource) {
            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            var dir = vector.sub(camera.position).normalize();
            var distance = -camera.position.z / dir.z;
            var pos = camera.position.clone().add(dir.multiplyScalar(distance));
            //mouseMesh.position.copy(pos);

            lights[0].position.copy(new THREE.Vector3(pos.x, pos.y, controls.lightingPosZ));
            controls.lightingPosX = pos.x
            controls.lightingPosY = pos.y
            for (var j in pointLightFolder.__controllers) {
                pointLightFolder.__controllers[j].updateDisplay()
            }
        }

        if (!onDrag) return
        if (controls.enablePositionDragging && onDrag) {
            controls.positionX = mouse.x * 5;
            controls.positionY = mouse.y * 5;
            for (var j in positionFolder.__controllers) {
                positionFolder.__controllers[j].updateDisplay()
            }
        }
        if (controls.enableRotationDragging && onDrag) {
            controls.rotationX += mouse.y * 5;
            if (controls.rotationX < -180) controls.rotationX += 360
            else if (controls.rotationX > 180) controls.rotationX -= 360
            controls.rotationY += mouse.x * 5;
            if (controls.rotationY < -180) controls.rotationY += 360
            else if (controls.rotationY > 180) controls.rotationY -= 360
            for (var j in rotationFolder.__controllers) {
                rotationFolder.__controllers[j].updateDisplay()
            }
        }
        if (controls.enableScaleDragging && onDrag) {
            controls.scaleX = Math.abs(mouse.x * 5);
            controls.scaleY = Math.abs(mouse.y * 5);
            for (var j in scaleFolder.__controllers) {
                scaleFolder.__controllers[j].updateDisplay()
            }
        }

        // requestAnimationFrame(render);
        // renderer.render(scene, camera);
    }
    window.onmousedown = function(event) {
        onDrag = true
    }

    window.onmouseup = function(event) {
        onDrag = false
    }


    //====================================================================
    scene.add(globalState.activeMesh)
        //==============================================================

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
    // add controls
    var controls = setupControls();


    // call the render function



    function setupControls() {
        var controls = new function() {

            this.color = material.color.getStyle();
            this.emissive = material.emissive.getStyle();
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.intensity = ambientLight.intensity;
            this.ambientColor = ambientLight.color.getStyle();
            this.lighting = true;
            this.lightingPosX = 3;
            this.lightingPosY = 3;
            this.lightingPosZ = 2;
            this.lightsource = false;
            this.shadow = false;
            this.disableSpotlight = false;
            this.Axesvisible = false;
            this.Gridvisible = false;
            this.usetexture = false;

            this.perspectiveFovy = 75;
            this.perspectiveAspectX = 1;
            this.perspectiveAspectY = 0.49;
            this.perspectiveZNear = 0.1;
            this.perspectiveZFar = 1000;

            this.lookAtEyeX = -30;
            this.lookAtEyeY = 40;
            this.lookAtEyeZ = 30;

            this.lookAtCenterX = -30;
            this.lookAtCenterY = 40;
            this.lookAtCenterZ = 30;

            this.lookAtUpX = 0;
            this.lookAtUpY = 1;
            this.lookAtUpZ = 0;

            this.enablePositionDragging = false;
            this.enableScaleDragging = false;
            this.enableRotationDragging = false;

            this.positionX = 0;
            this.positionY = 4;
            this.positionZ = 0;

            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scale = 1;

            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;

            this.visible = true;

            this.translate = function() {

                controls.selected.translateX(controls.translateX);
                controls.selected.translateY(controls.translateY);
                controls.selected.translateZ(controls.translateZ);

                globalState.activeMesh.translateX(controls.translateX);
                globalState.activeMesh.translateY(controls.translateY);
                globalState.activeMesh.translateZ(controls.translateZ);

                controls.positionX = controls.selected.position.x;
                controls.positionY = controls.selected.position.y;
                controls.positionZ = controls.selected.position.z;

                controls.positionX = globalState.activeMesh.position.x;
                controls.positionY = globalState.activeMesh.position.y;
                controls.positionZ = globalState.activeMesh.position.z;
            }


            this.useTexture = false;
            this.textureColor = 0xff0000
            this.textureData = undefined
            this.textureFile = undefined
                //dummy field to open texture browser
            this.dummyBrowser = function() {}

            this.isAnimateBouncing = false;
            this.isAnimateRotating = false;
            this.isAnimateScaling = false;

            this.fileSelect = function(cb) {
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
            };

        };


        return controls;
    }
    //=======================================================================
    var gui = new dat.GUI({ autoPlace: true });
    gui.domElement.id = 'gui';

    var movegui = new dat.GUI({ autoPlace: true });
    movegui.domElement.id = 'moveGUI'

    var controlgui = new dat.GUI({ autoPlace: true });
    controlgui.domElement.id = 'modeGUI'

    var cameraFolder = gui.addFolder("Camera");

    var perspectiveFolder = cameraFolder.addFolder("Perspective");
    perspectiveFolder.add(controls, "perspectiveFovy", -180, 180).step(1).name("fovy").onChange(updateCamera);
    perspectiveFolder.add(controls, "perspectiveAspectX", 0.001, 1).step(0.001).name("Aspect X").onChange(updateCamera);
    perspectiveFolder.add(controls, "perspectiveAspectY", 0.001, 1).step(0.001).name("Aspect Y").onChange(updateCamera);
    perspectiveFolder.add(controls, "perspectiveZNear", 0, 10).step(0.01).name("Z Near").onChange(updateCamera);
    perspectiveFolder.add(controls, "perspectiveZFar", 0, 10000).step(1).name("Z Far").onChange(updateCamera);

    var lookAtEyeFolder = cameraFolder.addFolder("Look At (Eyes)");
    lookAtEyeFolder.add(controls, "lookAtEyeX", -100, 100).step(1).name("X").onChange(updateCamera);
    lookAtEyeFolder.add(controls, "lookAtEyeY", -100, 100).step(1).name("Y").onChange(updateCamera);
    lookAtEyeFolder.add(controls, "lookAtEyeZ", -100, 100).step(1).name("Z").onChange(updateCamera);

    var lookAtCenterFolder = cameraFolder.addFolder("Look At (Center)")
    lookAtCenterFolder.add(controls, "lookAtCenterX", -100, 100).step(0.1).name("X").onChange(updateCamera);
    lookAtCenterFolder.add(controls, "lookAtCenterY", -100, 100).step(0.1).name("Y").onChange(updateCamera);
    lookAtCenterFolder.add(controls, "lookAtCenterZ", -100, 100).step(0.1).name("Z").onChange(updateCamera);

    var lookAtUpFolder = cameraFolder.addFolder("Look At (Up)");
    lookAtUpFolder.add(controls, "lookAtUpX", -1, 1).step(0.01).name("X").onChange(updateCamera);
    lookAtUpFolder.add(controls, "lookAtUpY", -1, 1).step(0.01).name("Y").onChange(updateCamera);
    lookAtUpFolder.add(controls, "lookAtUpZ", -1, 1).step(0.01).name("Z").onChange(updateCamera);


    var lightgui = gui.addFolder('Lighting', { autoPlace: true })
        // lightgui.domElement.id = 'modeGUI'
    var amnientlight = lightgui.addFolder('AmbientLight')
    amnientlight.add(controls, 'intensity', 0, 3, 0.1).onChange(function(e) {
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
    });
    // ambientLightFolder.add(controls, "ambientLightIntensity", 0, 1).step(0.01).name("Ambient").onChange(updateLighting)
    amnientlight.addColor(controls, 'ambientColor').onChange(function(e) {
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
    });

    pointLightFolder = lightgui.addFolder("Point Light")
    pointLightFolder.add(controls, "lighting").name("Enable").onChange(updateLighting)
    pointLightFolder.add(controls, "lightsource").name("Enable Mouse").onChange(updateLighting)
    pointLightFolder.add(controls, "lightingPosX", -10, 10).step(0.1).name("X").onChange(updateLighting)
    pointLightFolder.add(controls, "lightingPosY", -10, 10).step(0.1).name("Y").onChange(updateLighting)
    pointLightFolder.add(controls, "lightingPosZ", -10, 10).step(0.1).name("Z").onChange(updateLighting)
    pointLightFolder.add(controls, "shadow").name("Enable Shadow").onChange(updateLighting)

    lightgui.add(controls, 'disableSpotlight').onChange(function(e) {
        spotLight.visible = !e;
    });

    gui.add(controls, 'Axesvisible').onChange(function(e) {
        axes.visible = !e;
    });
    gui.add(controls, 'Gridvisible').onChange(function(e) {
        grid.visible = !e;
    });

    gui_prop = gui.addFolder("Properties");
    // scale
    guiScale = gui_prop.addFolder('scale');
    guiScale.add(controls, 'scaleX', 0, 5);
    guiScale.add(controls, 'scaleY', 0, 5);
    guiScale.add(controls, 'scaleZ', 0, 5);

    // tịnh tiến
    guiPosition = gui_prop.addFolder('position');
    var contX = guiPosition.add(controls, 'positionX', -50, 50);
    var contY = guiPosition.add(controls, 'positionY', -4, 20);
    var contZ = guiPosition.add(controls, 'positionZ', -20, 20);

    contX.listen();
    contX.onChange(function(value) {
        controls.selected.position.x = controls.positionX;
        globalState.activeMesh.position.x = controls.positionX
            // cube.children[1].position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function(value) {
        controls.selected.position.y = controls.positionY;
        globalState.activeMesh.position.y = controls.positionY
    });

    contZ.listen();
    contZ.onChange(function(value) {
        controls.selected.position.z = controls.positionZ;
        globalState.activeMesh.position.z = controls.positionZ
    });

    // rotation
    guiRotation = gui_prop.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    // translate
    guiTranslate = gui_prop.addFolder('translate');

    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    // gui_prop.add(controls, 'visible'); // visible



    // addBasicMaterialSettings(movegui, controls, material);
    // addMeshSelection(movegui, controls, material, scene);
    controls.selected = globalState.activeMesh
    controls.selected.position.y = 4;
    controls.selected.castShadow = true;
    //   gui_prop.addColor(controls, 'emissive').onChange(function(e) {

    //     material.emissive = new THREE.Color(e);
    //     // globalState.activeMesh.material.emissive = new THREE.color(e);
    // });

    //   var gui;
    // var positionFolder;
    // var rotationFolder;
    // var scaleFolder;
    // var pointLightFolder;
    var shape_picker = movegui.addFolder("Chang Shape")
    shape_picker.add(shaperPick, "toCube").name("Cube").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toCylinder").name("Cylinder").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toCone").name("Cone").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toSphere").name("Sphere").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toIcosahedron").name("Icosahedron").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toTorus").name("Torus").onFinishChange(updateShape)
    shape_picker.add(shaperPick, "toTeapot").name("Teapot").onFinishChange(updateShape)

    var mode_picker = controlgui.addFolder("Change Render Mode")
    mode_picker.add(modePick, "toSolid").name("Solid").onFinishChange(updateMode)
    mode_picker.add(modePick, "toLine").name("Wireframe").onFinishChange(updateMode)
    mode_picker.add(modePick, "toPoint").name("Point").onFinishChange(updateMode)


    var textureFolder = gui.addFolder("Texture")
    textureFolder.addColor(controls, "textureColor").name("Color").onFinishChange(updateTexture)
    textureFolder.add(controls, "useTexture").name("Enable File").onChange(updateTexture)
    textureFolder.add(controls, "dummyBrowser").name("Browse...").onChange(changeFilePath)
    var animationFolder = gui.addFolder("Animation")
    animationFolder.add(controls, "isAnimateRotating").name("Auto Rotate")
    animationFolder.add(controls, "isAnimateBouncing").name("Bouncy")
    animationFolder.add(controls, "isAnimateScaling").name("Scaling")
        // scene.add(globalState.activeMesh)
        //================================ Axis helper ===========================
        //Function to create/draw Axis helpers
    drawAxisHelpers = function(params) {
        var geometryArrow, meshXArrow, geometryXAxis, materialXAxis, meshXAxis,
            meshYArrow, geometryYAxis, materialYAxis, meshYAxis, meshZArrow,
            geometryZAxis, materialZAxis, meshZAxis;

        // This function allows for the changing of parameters for all the axis helpers. I have used .2 as radius
        // and 10 for height for this assignment because it makes the helpers the most visible for my scene
        if (params == null) {
            params = {};
        }
        params.radius = params.radius || 0.20;
        params.height = params.height || 10;
        params.scene = params.scene || scene;
        geometryArrow = new THREE.CylinderGeometry(0, 2 * params.radius, params.height / 5);

        // This part defines and adds the X axis helper
        materialXAxis = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });
        geometryXAxis = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
        meshXAxis = new THREE.Mesh(geometryXAxis, materialXAxis);
        meshXArrow = new THREE.Mesh(geometryArrow, materialXAxis);
        meshXAxis.add(meshXArrow);
        meshXArrow.position.y += params.height / 2;
        meshXAxis.rotation.z -= 90 * Math.PI / 180;
        meshXAxis.position.x += params.height / 2;
        // params.scene.add(meshXAxis);

        // This part defines and adds the Y axis helper
        materialYAxis = new THREE.MeshBasicMaterial({
            color: 0x00FF00
        });
        geometryYAxis = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
        meshYAxis = new THREE.Mesh(geometryYAxis, materialYAxis);
        meshYArrow = new THREE.Mesh(geometryArrow, materialYAxis);
        meshYAxis.add(meshYArrow);
        meshYArrow.position.y += params.height / 2;
        meshYAxis.position.y += params.height / 2;
        // params.scene.add(meshYAxis);

        // This part defines and adds the Z axis helper
        materialZAxis = new THREE.MeshBasicMaterial({
            color: 0x0000FF
        });
        geometryZAxis = new THREE.CylinderGeometry(params.radius, params.radius, params.height);
        meshZAxis = new THREE.Mesh(geometryZAxis, materialZAxis);
        meshZArrow = new THREE.Mesh(geometryArrow, materialZAxis);
        meshZAxis.add(meshZArrow);
        meshZAxis.rotation.x += 90 * Math.PI / 180;
        meshZArrow.position.y += params.height / 2;
        meshZAxis.position.z += params.height / 2;
        var axes = new THREE.Object3D();
        axes.add(meshXAxis)
        axes.add(meshYAxis)
        axes.add(meshZAxis)
            // return params.scene.add(meshZAxis);
        return axes
    };
    // Run the function to add/draw the axis helpers
    axes = drawAxisHelpers()
        // x.visible = true;
    scene.add(axes)
    render();

    function render() {
        stats.update();

        if (controls.selected) {
            controls.selected.rotation.y = step += 0.01;
            globalState.activeMesh.rotation.y = step += 0.01
        }

        globalState.activeMesh.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
        globalState.activeMesh.visible = controls.visible;

        controls.selected.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
        controls.selected.visible = controls.visible;

        controls.selected.rotation.x = controls.rotationX;
        controls.selected.rotation.y = controls.rotationY;
        controls.selected.rotation.z = controls.rotationZ;

        globalState.activeMesh.rotation.x = controls.rotationX;
        globalState.activeMesh.rotation.y = controls.rotationY;
        globalState.activeMesh.rotation.z = controls.rotationZ;


        if (controls.isAnimateBouncing) {
            step += 0.02;
            globalState.activeMesh.position.x = 20 + (10 * (Math.cos(step)));
            globalState.activeMesh.position.y = 2 + (10 * Math.abs(Math.sin(step)));
            globalState.activeMesh.position.z = 2 + (10 * Math.abs(Math.sin(step)));
        }
        step += 0.02;
        if (controls.isAnimateRotating) {

            globalState.activeMesh.rotation.x += step;
            globalState.activeMesh.rotation.y += step;
            // globalState.activeMesh.rotation.z += step;
        }
        // scale the cylinder
        scalingStep += 0.2
        if (controls.isAnimateScaling) {
            var scaleX = Math.abs(Math.sin(scalingStep / 4));
            var scaleY = Math.abs(Math.cos(scalingStep / 5));
            var scaleZ = Math.abs(Math.sin(scalingStep / 7));
            globalState.activeMesh.scale.set(scaleX, scaleY, scaleZ);
        }

        trackballControls.update(clock.getDelta());
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    //======================= Update function=======================
    //================update camera ====================

    function updateCamera() {
        camera.far = controls.perspectiveZFar
        camera.near = controls.perspectiveZNear
        camera.fov = controls.perspectiveFovy
        camera.aspect = controls.perspectiveAspectX / controls.perspectiveAspectY
        camera.position.set(controls.lookAtEyeX, controls.lookAtEyeY, controls.lookAtEyeZ)
        camera.lookAt(controls.lookAtCenterX, controls.lookAtCenterY, controls.lookAtCenterZ)
        camera.up.set(controls.lookAtUpX, controls.lookAtUpY, controls.lookAtUpZ)
        camera.updateProjectionMatrix();
    }

    //update shape when selected shape change
    function updateShape() {
        globalState.updateShape(shaperPick.shape, modePick.renderMode)
        if (globalState.prevMesh !== undefined) {
            scene.remove(globalState.prevMesh)
            scene.add(globalState.activeMesh)
                //to sync new model's texture with the current texture setting
            updateTexture()
                //to sync new model's transform with the current transform setting
            updateMesh()
        }
    }

    //update mesh when transform parameter change
    function updateMesh() {
        globalState.activeMesh.rotation.x = controls.rotationX / 180 * Math.PI
        globalState.activeMesh.rotation.y = controls.rotationY / 180 * Math.PI
        globalState.activeMesh.rotation.z = controls.rotationZ / 180 * Math.PI
        globalState.activeMesh.scale.x = controls.scaleX
        globalState.activeMesh.scale.y = controls.scaleY
        globalState.activeMesh.scale.z = controls.scaleZ
        globalState.activeMesh.position.x = controls.positionX
        globalState.activeMesh.position.y = controls.positionY
        globalState.activeMesh.position.z = controls.positionZ
    }

    function updateCamera() {
        camera.far = controls.perspectiveZFar
        camera.near = controls.perspectiveZNear
        camera.fov = controls.perspectiveFovy
        camera.aspect = controls.perspectiveAspectX / controls.perspectiveAspectY
        camera.position.set(controls.lookAtEyeX, controls.lookAtEyeY, controls.lookAtEyeZ)
        camera.lookAt(controls.lookAtCenterX, controls.lookAtCenterY, controls.lookAtCenterZ)
        camera.up.set(controls.lookAtUpX, controls.lookAtUpY, controls.lookAtUpZ)
        camera.updateProjectionMatrix();
    }

    function updateTexture() {
        //console.log(option.textureData)
        if (controls.useTexture) {
            if (controls.textureData === undefined) {
                alert('You haven\'t picked a texture source file yet')
                return;
            }
            globalState.activeTexture = new THREE.TextureLoader().load(controls.textureData)
        } else {
            globalState.activeTexture = undefined
            globalState.activeShape.color = controls.textureColor
        }
        globalState.updateTexture()
            //please work.....
        scene.remove(globalState.prevMesh)
        scene.add(globalState.activeMesh)
        updateMesh()
    }

    globalState.updateTexture()
    scene.remove(globalState.prevMesh)
    scene.add(globalState.activeMesh)
        //update rendering mode
    function updateMode() {
        globalState.updateRenderMode(modePick.renderMode)
        if (globalState.prevMesh !== undefined) {
            scene.remove(globalState.prevMesh)
            scene.add(globalState.activeMesh)
            updateMesh()
        }
    }

    function changeFilePath() {
        controls.fileSelect(() => {
            updateTexture()
        })
    }


} // function init