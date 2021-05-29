(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
        render();
        window.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('touchmove', onDocumentMouseMove, false);

        window.addEventListener('resize', () => {
            composer.setSize( window.innerWidth, window.innerHeight );
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
    }, false);

    let scene;
    let camera;
    let renderer;
    let composer;

    let frameGeometry,
        planeGeometry,
        geometry,
        material,
        lineMaterial,
        box,
        planeMesh,
        axesHelper,
        ambientLight,
        boxArray,
        wrapper,
        edges,
        line,
        groups = new Array(2),
        glitchPass,
        time = 0;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const xgrid = 7;
    const ygrid = 3;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: -4.0,
        y: 0.0,
        z: 6.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };

    const RENDERER_PARAM = {
        clearColor: 0x000000,
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
    };

    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff,
    };

    const MATERIAL_PARAM = {
        color: 0xffffff,
        wireframe: true,
    }

    function init(){
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);

        frameGeometry = new THREE.BoxGeometry(10, 10, 10)
        edges = new THREE.EdgesGeometry(frameGeometry);
        lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff })
        line = new THREE.LineSegments(edges,  lineMaterial);
        scene.add(line)

        planeGeometry = new THREE.PlaneGeometry(10, 10, 30, 30)
        planeMesh = new THREE.Mesh(planeGeometry, material)
        planeMesh.rotation.x = Math.PI / 2
        planeMesh.position.y = -2.5
        scene.add(planeMesh)

        groups[0] = new THREE.Group();
        scene.add(groups[0]);

        for (let x = 0; x <= xgrid; x++) {
            for (let y = 0; y <= ygrid; y++) {

                geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
                material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);

                box = new THREE.Mesh(geometry, material);
                box.position.set(
                    (x - xgrid / 2) * 1.3,
                    (y - ygrid / 2) * 1.3
                );
                groups[0].add(box);
                box.dx = 0.01 * (0.5 - Math.random());
                box.dy = 0.01 * (0.5 - Math.random());
            }
        }

        groups[1] = new THREE.Group();
        scene.add(groups[1]);

        for (let i = 0; i < 100; i++) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.3, 0.3, 0.3)
            const radian = (i / 100) * Math.PI * 2;
            mesh.position.set(
                30 * Math.cos(radian), // X座標
                15, // Y座標
                30 * Math.sin(radian) // Z座標
            );
            groups[1].add(mesh);
        }

        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        glitchPass = new THREE.GlitchPass();
        composer.addPass( glitchPass );

        // 軸ヘルパー
        // axesHelper = new THREE.AxesHelper(5.0);
        // scene.add(axesHelper);
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function onDocumentMouseMove(event) {
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = - (y / window.innerHeight) * 2 + 1;
    }

    function render(){
        time++
        requestAnimationFrame(render)

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(groups[0].children);
        groups[0].children.forEach((box) => {
            box.position.z = Math.sin(time * box.dx) - 0.5
            if (intersects.length > 0 && box === intersects[0].object) {
                wrapper.style.cursor = 'pointer'
                box.material.color.setHex(0xff0000);
                box.touched = true
            } else {
                box.material.color.setHex(0xffffff);
            }
        });

        groups[1].children.forEach((box, i) => {
            box.position.y = 15 + (Math.abs(Math.sin(time * 0.0005 * i)) - 0.5) * 5
        });

        if (intersects.length <= 0) {
            wrapper.style.cursor = 'auto'
        }
        // controls.update();
        composer.render(scene, camera);
    }
})();

