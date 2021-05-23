
// = 006 ======================================================================
// 005 でディレクショナルライトを用いて、平行光源でライティングを行いました。
// しかしこのときの描画結果を見てみると、暗い場所（光の当たりにくい箇所）が、異
// 様なくらい真っ黒になっています。
// これは現実世界とは違い、あくまでもロジカルに光を再現する 3DCG ならではの現象
// と言えます。光が一切当たらないのだから計算上は真っ黒になってしまう、というこ
// とですね。
// これを解消するには、やはりロジカルに、それっぽく見えるように（黒くならないよ
// うに）処理を行なってやることになります。
// ここでは異なるライトの種類としてアンビエントライトを追加し、質感向上に挑戦し
// てみましょう。
// ============================================================================

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

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let mainGeometry;   // ジオメトリ
    let subGeometry;   // マテリアル
    let particleGeometry;   // マテリアル
    let material1;   // マテリアル
    let material2;   // マテリアル
    let particleMesh;        // ボックスメッシュ
    let mainMesh;        // ボックスメッシュ
    let subMesh;        // ボックスメッシュ
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源）
    let ambientLight;     // アンビエントライト（環境光） @@@
    let particleArray = [];
    let time = 0;

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: 0.0,
        y: 2.0,
        z: 400.0,
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
        color: 0x3399ff,    // マテリアル自体の色
        specular: 0xffffff,
    };

    const MATERIAL_PARAM2 = {
        color: 0x3399ff,    // マテリアル自体の色
        wireframe: true
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
        intensity: 0.6,  // 光の強度
    };

    function init(){
        // シーン
        scene = new THREE.Scene();

        // レンダラ
        renderer = new THREE.WebGLRenderer({alpha: true});
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

        mainGeometry = new THREE.BoxGeometry(7, 7, 7);
        subGeometry = new THREE.BoxGeometry(14, 14 ,14, 10, 10, 10);
        particleGeometry = new THREE.BoxGeometry(1,1,1);
        material1 = new THREE.MeshPhongMaterial(MATERIAL_PARAM1);
        material2 = new THREE.MeshPhongMaterial(MATERIAL_PARAM2);


        for (let i = 0; i < 1000; i++) {
            particleMesh = new THREE.Mesh(particleGeometry, material1);
            particleMesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            particleMesh.position.multiplyScalar(90 + Math.random() * 700);
            particleMesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            particleArray.push(particleMesh);
            scene.add(particleMesh);
        };

        mainMesh = new THREE.Mesh(mainGeometry, material1);
        mainMesh.scale.set(10, 10, 10);
        scene.add(mainMesh);

        subMesh = new THREE.Mesh(subGeometry, material2);
        subMesh.scale.set(10, 10, 10);
        scene.add(subMesh);

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
    }

    function render(){
        time += 0.5;
        requestAnimationFrame(render);

        particleArray.forEach((particle) => {
            particle.rotation.x += 0.004;
            particle.rotation.y += 0.004;
        });

        mainMesh.rotation.y += 0.01;

        // 描画
        controls.update();
        renderer.render(scene, camera);
    }
})();

