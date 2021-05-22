
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
        keyEvent();
    }, false);

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let geometry;   // ジオメトリ
    let material;   // マテリアル
    let box;        // ボックスメッシュ
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源）
    let ambientLight;     // アンビエントライト（環境光） @@@
    let boxArray;
    let orgBoxArray;
    let mathMax = 3;

    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100.0,
        x: 0.0,
        y: 2.0,
        z: 15.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x666666,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // マテリアルに関するパラメータ
    const MATERIAL_PARAM = {
        color: 0x3399ff,    // マテリアル自体の色
        specular: 0xffffff, // スペキュラ成分（反射光）の色
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
        color: 0xffffff, // 光の色
        intensity: 0.2,  // 光の強度
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

        geometry = new THREE.BoxGeometry(1,1,1);
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

        boxArray = [];
        let step = 1,
            num = 5;
        for (let x = 0; x <= num; x++) {
            for (let y = 0; y <= num; y++) {
                for (let z = 0; z <= num; z ++) {
                    box = new THREE.Mesh(geometry, material);
                    box.position.set(
                        (x - num / 2) * step,
                        (y - num / 2) * step,
                        (z - num / 2) * step
                    );
                    boxArray.push(box);
                    scene.add(box);
                }
            }
        }
        orgBoxArray = boxArray.map((box) => {
            return {
                x: box.position.x,
                y: box.position.y,
                z: box.position.z,
            }
        })

        // ディレクショナルライト
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        // - 環境光、つまりアンビエントライトを追加する -----------------------
        // アンビエントライトは日本語ではよく環境光という言い方をされます。
        // その名前からもわかるとおり、このライトは環境全体が持つ複雑な光の反射
        // や屈折を再現するためのライトです。
        // 初期化の方法は基本的にディレクショナルライトのときと同じです。
        // 第二引数には強さを指定することができますが、まず最初は小さめの値で試
        // してみましょう。
        // --------------------------------------------------------------------
        // アンビエントライト @@@
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

    function keyEvent() {
        window.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                boxArray.forEach((box, i) => {
                    gsap.to(box.position, {
                        x: Math.max(Math.min(orgBoxArray[i].x * mathMax), orgBoxArray[i].x * mathMax),
                        y: Math.max(Math.min(orgBoxArray[i].y * mathMax), orgBoxArray[i].y * mathMax),
                        z: Math.max(Math.min(orgBoxArray[i].z * mathMax), orgBoxArray[i].z * mathMax),
                        duration: 0.4,
                        ease: 'Power3.easeInOut',
                    })
                });
            }
        }, false);
        window.addEventListener('keyup', (event) => {
            boxArray.forEach((box, i) => {
                gsap.to(box.position, {
                    x: orgBoxArray[i].x,
                    y: orgBoxArray[i].y,
                    z: orgBoxArray[i].z,
                    duration: 0.4,
                    ease: 'Power3.easeInOut',
                })
            });
        }, false);
    }

    function render(){
        requestAnimationFrame(render)
        // 描画
        controls.update();
        renderer.render(scene, camera);
    }
})();

