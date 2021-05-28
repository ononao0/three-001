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

    let geometry,
        material,
        box,
        texture,
        axesHelper,
        ambientLight,
        wrapper,
        group,
        controls,
        time = 0;

    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000.0,
        x: -3.0,
        y: -3.0,
        z: 15.0,
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

    function init(){
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor), 0.0);
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


        const texture = new THREE.TextureLoader().load( '../textures/flag.png' );

        const MATERIAL_PARAM = {
            color: 0xffffff,
            map: texture,
        }

        let step = 1,
            yNum = 10,
            xNum = 20;

        let ox, oy;
        const ux = 1 / xNum;
        const uy = 1 / yNum;

        for (let x = 0; x <= xNum; x++) {
            for (let y = 0; y <= yNum; y++) {
                ox = x;
                oy = y;
                geometry = new THREE.BoxGeometry(1, 1, 0.5, 5, 5, 5)
                material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
                change_uvs(geometry, ux, uy, ox, oy)
                box = new THREE.Mesh(geometry, material);
                box.position.set(
                    (x - xNum / 2) * step + 3,
                    (y - yNum / 2) * step
                );
                group.add(box);
            }
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

    function change_uvs( geometry, unitx, unity, offsetx, offsety ) {
        const uvs = geometry.attributes.uv.array;
        for ( let i = 0; i < uvs.length; i += 2 ) {
            uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
            uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;
        }

    }

    function render(){
        time += 0.03
        requestAnimationFrame(render)
        group.children.forEach((box, i) => {
            const waveX = Math.sin(box.position.x / 10 * 2 + time) * 0.2
            const waveX2 = Math.sin(box.position.x / 10 * 3 + time * 2) * 0.5
            const waveY = Math.sin(box.position.y / 10 + time) * 0.5
            gsap.to(box.position, {
                z: waveX + waveX2 + waveY,
                ease: 'Power3.easeOut',
            })
        })
        // controls.update();
        renderer.render(scene, camera);
    }
})();

