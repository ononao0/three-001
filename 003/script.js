(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
        render();
        window.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('touchmove', onDocumentMouseMove, false);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);
    }, false);

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let geometry;   // ジオメトリ
    let material;   // マテリアル
    let box;        // ボックスメッシュ
    let axesHelper; // 軸ヘルパーメッシュ
    let ambientLight;     // アンビエントライト（環境光） @@@
    let boxArray;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100.0,
        x: 0.0,
        y: 0.0,
        z: 15.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x000000,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // マテリアルに関するパラメータ
    const MATERIAL_PARAM = {
        color: 0xffffff,    // マテリアル自体の色
        specular: 0xffffff,
        wireframe: true
    };
    // ライトに関するパラメータの定義
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
    // アンビエントライトに関するパラメータの定義 @@@
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff,
    };

    function init(){
        // シーン
        scene = new THREE.Scene();

        // レンダラ
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
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

        geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);

        boxArray = [];
        let step = 1.3,
            num = 9;
        for (let x = 0; x <= num; x++) {
            for (let y = 0; y <= num; y++) {
                material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
                box = new THREE.Mesh(geometry, material);
                box.position.set(
                    (x - num / 2) * step,
                    (y - num / 2) * step
                );
                boxArray.push(box);
                scene.add(box);
                box.dx = 0.01 * (0.5 - Math.random());
                box.dy = 0.01 * (0.5 - Math.random());
            }
        }
        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        // 軸ヘルパー
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);
    }

    function onDocumentMouseMove(event) {
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = - (y / window.innerHeight) * 2 + 1;
    }

    function render(){
        requestAnimationFrame(render)

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(boxArray);
        boxArray[0].material.color.setHex(0xff0000);
        boxArray.map((box, i) => {
            if (intersects.length > 0 && box === intersects[0].object) {
                box.material.color.setHex(0xff0000);
                box.rotation.x += box.dx * 10
                box.rotation.y += box.dy * 10
            } else {
                box.rotation.x = 0
                box.rotation.y = 0
                box.material.color.setHex(0xffffff);
            }
        });
        renderer.render(scene, camera);
    }
})();

