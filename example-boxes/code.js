var createScene = async function () {
    var scene = new BABYLON.Scene(engine);


    // Create matrial 

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.0;

    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 50, new BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var ground = BABYLON.Mesh.CreateGround("ground", 500, 500, 10, scene);
    // Note the ground plane breaks realism in AR because it occludes
    // objects in the real world. However, it is required for the scene to
    // work. After creating it, we can make it invisible
    ground.isVisible = false;

    // Wrap the box spawning code in functions so that they can be reused
    function spawnRedBox() {
        var box = BABYLON.Mesh.CreateBox("box_" + BABYLON.Tools.RandomId(), 0.25, scene);
        box.position.y = 0.125;
        box.position.z = 0.5;
        box.scaling.x = 2;
        var mat = new BABYLON.StandardMaterial("matBox", scene);
        mat.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
        box.material = mat;
        box.isPickable = true;
        console.log(box.position);
    }

    function spawnBlueBox() {
        var box2 = BABYLON.Mesh.CreateBox("box2_" + BABYLON.Tools.RandomId(), 0.5, scene);
        box2.position = new BABYLON.Vector3(0, 0.25, 1);
        var mat2 = new BABYLON.StandardMaterial("matBox2", scene);
        mat2.diffuseColor = new BABYLON.Color3(0.1, 0.1, 1.0);
        box2.material = mat2;
    }


    // spawn the initial boxes
    spawnRedBox();
    spawnBlueBox();


    //  const environment = scene.createDefaultEnvironment();

    // // XR
    // const xrHelper = await scene.createDefaultXRExperienceAsync({
    //     floorMeshes: [ground]
    // });

    const xrHelper = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
    });



    let mesh;

    xrHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'left') {
                const xr_ids = motionController.getComponentIds();

                let xbuttonComponent = motionController.getComponent(xr_ids[3]);//x-button
                xbuttonComponent.onButtonStateChangedObservable.add(() => {
                    if (xbuttonComponent.pressed) {
                        spawnBlueBox();
                    }
                });

                let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                triggerComponent.onButtonStateChangedObservable.add(() => {
                    if (triggerComponent.changes.pressed) {
                        // is it pressed?
                        if (triggerComponent.pressed) {
                            mesh = scene.meshUnderPointer;
                            console.log(mesh && mesh.name);
                            if (xrHelper.pointerSelection.getMeshUnderPointer) {
                                mesh = xrHelper.pointerSelection.getMeshUnderPointer(controller.uniqueId);
                            }
                            console.log(mesh && mesh.name);
                            if (mesh === ground) {
                                return;
                            }
                            mesh && mesh.setParent(motionController.rootMesh);
                        } else {
                            mesh && mesh.setParent(null);
                        }
                    }
                });
            }
            // 
            else if (motionController.handness === 'right') {
                const xr_ids = motionController.getComponentIds();

                let abuttonComponent = motionController.getComponent(xr_ids[3]);//a-button
                abuttonComponent.onButtonStateChangedObservable.add(() => {
                    if (abuttonComponent.pressed) {
                        spawnRedBox();
                    }
                });

                let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                triggerComponent.onButtonStateChangedObservable.add(() => {
                    if (triggerComponent.changes.pressed) {
                        // is it pressed?
                        if (triggerComponent.pressed) {
                            mesh = scene.meshUnderPointer;
                            console.log(mesh && mesh.name);
                            if (xrHelper.pointerSelection.getMeshUnderPointer) {
                                mesh = xrHelper.pointerSelection.getMeshUnderPointer(controller.uniqueId);
                            }
                            console.log(mesh && mesh.name);
                            if (mesh === ground) {
                                return;
                            }
                            mesh && mesh.setParent(motionController.rootMesh);
                        } else {
                            mesh && mesh.setParent(null);
                        }
                    }
                });
            }

        })
    });



    return scene;
}