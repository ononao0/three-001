(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
        render();
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
    }, false);

    let scene;
    let camera;
    let renderer;
    let controls;
    let axesHelper;

    let wingGeometry,
        wingMaterial,
        box,
        ambientLight,
        wrapper,
        wingGroup,
        bodyGroup,
        time = 0;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: 0.0,
        y: 0.0,
        z: 35.0,
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
        x: 10.0,          // 光の向きを表すベクトルの X 要素
        y: 20.0,          // 光の向きを表すベクトルの Y 要素
        z: 100.0           // 光の向きを表すベクトルの Z 要素
    };

    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff,
        intensity: 0.2,
    };

    const MATERIAL_PARAM = {
        color: 0xffffff
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

        wingGroup = new THREE.Group();
        bodyGroup = new THREE.Group();
        scene.add(wingGroup);
        scene.add(bodyGroup);

        wingMaterial = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        wingGeometry = new THREE.BoxGeometry(1.5, 8, 0.5);
        const mesh1 = new THREE.Mesh(wingGeometry, wingMaterial);
        const mesh2 = new THREE.Mesh(wingGeometry, wingMaterial);
        const mesh3 = new THREE.Mesh(wingGeometry, wingMaterial);
        const mesh4 = new THREE.Mesh(wingGeometry, wingMaterial);
        mesh1.rotation.y = mesh2.rotation.y = mesh3.rotation.x = mesh4.rotation.x = 0.5
        mesh1.position.set(0, 5, 5);
        mesh2.position.set(0, -5, 5);
        mesh3.rotation.z = Math.PI / 2
        mesh4.rotation.z = Math.PI / 2
        mesh3.position.set(-5, 0, 5);
        mesh4.position.set(5, 0, 5);
        wingGroup.add(mesh1);
        wingGroup.add(mesh2);
        wingGroup.add(mesh3);
        wingGroup.add(mesh4);
        bodyGroup.add(wingGroup);

        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        // 軸ヘルパー
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        time += 0.1
        requestAnimationFrame(render)
        wingGroup.rotation.z = -time
        wingGroup.rotation.y = Math.cos(-time / 10) * 1.5
        // controls.update();
        renderer.render(scene, camera);
    }
})();

