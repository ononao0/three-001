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

    let geometry,
        material,
        box,
        ambientLight,
        wrapper,
        group,
        time = 0;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: 0.0,
        y: 0.0,
        z: 100.0,
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
        color: 0xffffff,
        transparent: true,
        opacity: 0
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

        group = new THREE.Group();
        scene.add(group);

        for (let i = 0; i < 150; i++) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
            const mesh = new THREE.Mesh(geometry, material);
            const radian = (i / 150) * Math.PI * 2;
            mesh.position.set(
                70 * Math.cos(radian), // X座標
                -10, // Y座標
                70 * Math.sin(radian) // Z座標
            );
            group.add(mesh);
        }

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
        // axesHelper = new THREE.AxesHelper(5.0);
        // scene.add(axesHelper);
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        time += 0.03
        requestAnimationFrame(render)
        // const tl = gsap.timeline()
        group.children.forEach((box, i) => {
            gsap.to(box.material, {
                opacity: 1,
                duration: 1,
                delay: i * 0.03,
                ease: 'Power3.easeOut'
            })
            gsap.to(box.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 1,
                delay: i * 0.03,
                ease: 'Power3.easeOut'
            })
        })
        // controls.update();
        renderer.render(scene, camera);
    }
})();

