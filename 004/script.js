
(() => {
    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let particleGeometry;   // マテリアル
    let material1;   // マテリアル
    let material2;   // マテリアル
    let particleMesh;        // ボックスメッシュ
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源）
    let ambientLight;     // アンビエントライト（環境光） @@@
    let particleArray = [];
    let time = 0;
    let height = 10;

    window.addEventListener('DOMContentLoaded', () => {
        WINDOW_WIDTH = window.innerWidth;
        WINDOW_HEIGHT = window.innerHeight;
        init();
        render();
        window.addEventListener('resize', () => {
            WINDOW_WIDTH = window.innerWidth;
            WINDOW_HEIGHT = window.innerHeight;
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
    }, false);

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000.0,
        x: 0.0,
        y: 0.0,
        z: height,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x666666,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // マテリアルに関するパラメータ
    const MATERIAL_PARAM1 = {
        color: 0xfff100,    // マテリアル自体の色
        specular: 0xffffff,
    };
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
    // アンビエントライトに関するパラメータの定義 @@@
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
    };

    function init(){
        // シーン
        scene = new THREE.Scene();

        // レンダラ
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor), 0.0);
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        renderer.autoClear = false;
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        // カメラ
        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        particleGeometry = new THREE.BoxGeometry(1,1,1);
        material1 = new THREE.MeshPhongMaterial(MATERIAL_PARAM1);


        for (let i = 0; i < 50; i++) {
            particleMesh = new THREE.Mesh(particleGeometry, material1);
            particleMesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
            particleMesh.scale.set(0.1, 0.1, 0.1);
            particleArray.push(particleMesh);
            scene.add(particleMesh);
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
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        console.log(WINDOW_HEIGHT)
    }

    function render(){
        time++
        requestAnimationFrame(render);

        const radian = time * Math.PI / 180;

        particleArray.forEach((particle) => {
            particle.rotation.x += 0.004;
            particle.rotation.y += 0.004;
            particle.position.x += Math.cos(radian) * 0.01;
            particle.position.y += 0.01;

            if (particle.position.y > height / 2 + height) {
                particle.position.y = height / 2 - height;
            }
        });

        // 描画
        controls.update();
        renderer.render(scene, camera);
    }
})();

