(() => {
    window.addEventListener('DOMContentLoaded', () => {
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        const loader = new THREE.TextureLoader();
        earthTexture = loader.load('../textures/earth.jpg', () => {
            // 月の画像がテクスチャとして生成できたら init を呼ぶ
            moonTexture = loader.load('../textures/moon.jpg', () => {
                sunTexture = loader.load('../textures/sun.jpg', init);
            });
        });
    }, false);

    let scene;
    let camera;
    let renderer;
    let controls;
    let axesHelper;

    let sunMaterial,
        moonMaterial,
        earthMaterial,
        sunTexture,
        moonTexture,
        earthTexture,
        geometry,
        pointLight,
        ambientLight,
        wrapper,
        startTime = 0,
        sun,
        moon,
        earth;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: 0.0,
        y: 0.0,
        z: 15.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };

    const RENDERER_PARAM = {
        clearColor: 0x000000,
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const POINT_LIGHT_PARAM = {
        color: 0xffffff,
        intensity: 2,
    };

    const AMBIENT_LIGHT_PARAM = {
        color: 0xcccccc,
        intensity: 1.0,
    };

    const MATERIAL_PARAM = {
        color: 0xffffff,
        opacity: 0.5
    }

    const EARTH_RANGE = 6

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

        geometry = new THREE.SphereGeometry(1.0, 64, 64);
        sunMaterial = new THREE.MeshBasicMaterial(MATERIAL_PARAM);
        earthMaterial = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        moonMaterial = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        sunMaterial.map = sunTexture;
        earthMaterial.map = earthTexture;
        moonMaterial.map = moonTexture;
        sun = new THREE.Mesh(geometry, sunMaterial);
        earth = new THREE.Mesh(geometry, earthMaterial);
        moon = new THREE.Mesh(geometry, moonMaterial);
        scene.add(sun);

        earth.scale.setScalar(0.3);
        moon.scale.setScalar(0.1);
        scene.add(earth);
        scene.add(moon);


        pointLight = new THREE.PointLight(
            POINT_LIGHT_PARAM.color,
            POINT_LIGHT_PARAM.intensity
        );
        pointLight.position.set(0, 0, 0)
        scene.add(pointLight);

        // ambientLight = new THREE.AmbientLight(
        //     AMBIENT_LIGHT_PARAM.color,
        //     AMBIENT_LIGHT_PARAM.intensity
        // );
        // scene.add(ambientLight);

        // 軸ヘルパー
        // axesHelper = new THREE.AxesHelper(5.0);
        // scene.add(axesHelper);
        startTime = Date.now()
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        render();
    }

    function render(){
        let sin, cos;
        requestAnimationFrame(render)
        earth.rotation.y += 0.3
        sun.rotation.y += 0.02
        controls.update();
        const nowTime = (Date.now() - startTime) / 1000;
        sin = Math.sin(nowTime / 5);
        cos = Math.cos(nowTime / 5);
        earth.position.set(EARTH_RANGE * sin, 0.0, EARTH_RANGE * cos);

        const vectorOfMoon = earth.position.clone();
        sin = Math.sin(nowTime * 3);
        cos = Math.cos(nowTime * 3);
        moon.position.set(vectorOfMoon.x + cos / 2, vectorOfMoon.y, vectorOfMoon.z + sin / 2);

        renderer.render(scene, camera);
    }
})();

