(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
        render();
        setScroll();
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
        axesHelper,
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

        geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);

        group = new THREE.Group();
        scene.add(group);

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
                    group.add(box);
                }
            }
        }

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

    function setScroll() {
        const mathMax = 3
        group.children.forEach((box, i) => {
            gsap.to(box.position, {
                x: Math.max(Math.min(box.position.x * mathMax), box.position.x * mathMax),
                y: Math.max(Math.min(box.position.y * mathMax), box.position.y * mathMax),
                z: Math.max(Math.min(box.position.z * mathMax), box.position.z * mathMax),
                duration: 0.4,
                ease: 'Power3.easeInOut',
                scrollTrigger: {
                    trigger: ".box-1",
                    start: "bottom bottom",
                    end: "bottom top",
                    scrub: 0.7
                }
            })
        });

        group.children.forEach((box, i) => {
            gsap.to(box.rotation, {
                x: box.rotation.x += Math.PI * 2,
                y: Math.PI * 2,
                z: Math.PI * 2,
                duration: 0.4,
                ease: 'Power3.easeInOut',
                scrollTrigger: {
                    trigger: ".box-2",
                    start: "bottom bottom",
                    end: "bottom top",
                    scrub: 0.7
                }
            })
        });
    }

    function render(){
        time++
        requestAnimationFrame(render)
        group.rotation.x += 0.01
        group.rotation.y += 0.01
        // controls.update();
        renderer.render(scene, camera);
    }
})();

