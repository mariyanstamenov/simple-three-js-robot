const initPlane = (scene) => {
    const planeGeometry = new THREE.PlaneGeometry(40, 30, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x6381b8 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 15;

    scene.add(plane);
};

const initRenderer = (renderer) => {
    renderer.setClearColor(0xbdbdbd, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
};

const initLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 20, 50);
    spotLight.castShadow = true;
    scene.add(spotLight);
};

const initCamera = (camera, scene) => {
    camera.position.x = 0;
    camera.position.y = 15;
    camera.position.z = 55;
    camera.lookAt(scene.position);
};

const createRobot = () => {
    const geometry = new THREE.BoxGeometry(4, 8, 1.2);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });

    const body = new THREE.Mesh(geometry, material);
    body.castShadow = true;
    body.position.x = 0;
    body.position.y = 4;
    body.position.z = 20;

    const bodyParts = createBodyParts();

    body.add(bodyParts.head);
    body.add(bodyParts.rightShoulder);
    body.add(bodyParts.leftShoulder);

    return { body, ...bodyParts };
};

const createBodyParts = () => {
    const head = createHead(0, 5.3, 0);

    const leftShoulder = createJoint(-2.5, 3.6, 0, 0.6);

    const leftUpperArm = createArm(0, -1.1, 0);
    leftShoulder.add(leftUpperArm);

    const leftElbow = createJoint(0, -1.5, 0, 0.6);
    leftUpperArm.add(leftElbow);

    const leftUnderArm = createUnderArm(0, -1.5, 0);
    leftElbow.add(leftUnderArm);

    const rightShoulder = createJoint(2.5, 3.6, 0, 0.6);

    const rightUpperArm = createArm(0, -1.1, 0);
    rightShoulder.add(rightUpperArm);

    const rightElbow = createJoint(0, -1.5, 0, 0.6);
    rightUpperArm.add(rightElbow);

    const rightUnderArm = createUnderArm(0, -1.5, 0);
    rightElbow.add(rightUnderArm);

    return {head, leftShoulder, rightShoulder, rightUpperArm, rightUnderArm, leftUpperArm, leftElbow, rightElbow }
}

const createHead = (_x, _y, _z, _color = 0x7777ff) => {
    const sphereGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: _color });
    const head = new THREE.Mesh(sphereGeometry, sphereMaterial);
    head.castShadow = true;
    head.position.x = _x;
    head.position.y = _y;
    head.position.z = _z;

    const leftEye = createEye(-0.4, 0.3, 1, 0x253655);
    const rightEye = createEye(0.4, 0.3, 1, 0x253655);
    const nose = createNose(0, 0, 1.2, 0x253655);

    head.add(leftEye);
    head.add(rightEye)
    head.add(nose);

    return head;
};

const createEye = (_x, _y, _z, _color) => {
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: _color });
    const eye = new THREE.Mesh(sphereGeometry, sphereMaterial);
    eye.castShadow = true;
    eye.position.x = _x;
    eye.position.y = _y;
    eye.position.z = _z;

    return eye;
}

const createNose = (_x, _y, _z, _color) => {
    const sphereGeometry = new THREE.ConeGeometry(0.5, 3, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: _color });
    const nose = new THREE.Mesh(sphereGeometry, sphereMaterial);
    nose.rotation.x = 0.5 * Math.PI;
    nose.castShadow = true;
    nose.position.x = _x;
    nose.position.y = _y;
    nose.position.z = _z;

    return nose;
}

const createJoint = (_x, _y, _z, _radius = 0.2, _color = 0x7777ff) => {
    const sphereGeometry = new THREE.SphereGeometry(_radius, 32, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: _color });
    const joint = new THREE.Mesh(sphereGeometry, sphereMaterial);
    joint.castShadow = true;
    joint.position.x = _x;
    joint.position.y = _y;
    joint.position.z = _z;

    return joint;
};

const createArm = (_x, _y, _z, _color = 0x7777ff) => {
    const geometry = new THREE.BoxGeometry(1, 3, 1.2);
    const material = new THREE.MeshLambertMaterial({ color: _color });
    const arm = new THREE.Mesh(geometry, material);
    arm.castShadow = true;
    arm.position.x = _x;
    arm.position.y = _y;
    arm.position.z = _z;

    return arm;
}


const createUnderArm = (_x, _y, _z, _color = 0x32a852) => {
    const geometry = new THREE.BoxGeometry(1, 3, 1.2);
    const material = new THREE.MeshLambertMaterial({ color: _color });
    const underArm = new THREE.Mesh(geometry, material);
    underArm.castShadow = true;
    underArm.position.x = _x;
    underArm.position.y = _y;
    underArm.position.z = _z;

    return underArm;
};

const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    initRenderer(renderer);
    initPlane(scene);
    initCamera(camera, scene);
    initLight(scene);

    const robot = createRobot(scene);
    scene.add(robot.body);

    const controls = createControls(camera);
    initGUI(controls);

    document.getElementById("webgl").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    render();

    function render() {
        robot.leftShoulder.rotation.z = controls.leftArm * -1;
        robot.rightShoulder.rotation.z = controls.rightArm;
        robot.leftElbow.rotation.z = controls.leftUnderArm * -1;
        robot.rightElbow.rotation.z = controls.rightUnderArm;

        robot.body.position.x = controls.bodyXAxis;
        robot.body.position.y = controls.bodyYAxis;
        robot.body.position.z = controls.bodyZAxis;
        robot.body.rotation.y = controls.robotRotateY;

        camera.position.x = controls.cameraX;
        camera.position.y = controls.cameraY;
        camera.position.z = controls.cameraZ;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
};

const initGUI = (controls) => {
    const gui = new dat.GUI();

    gui.add(controls, 'cameraX', -90, 180);
    gui.add(controls, 'cameraY', -90, 180);
    gui.add(controls, 'cameraZ', 0, 280);
    gui.add(controls, 'leftArm', 0, 3);
    gui.add(controls, 'rightArm', 0, 3);
    gui.add(controls, 'leftUnderArm', -2, 2);
    gui.add(controls, 'rightUnderArm', -2, 2);
    gui.add(controls, 'bodyXAxis', -20, 20);
    gui.add(controls, 'bodyYAxis', -20, 20);
    gui.add(controls, 'bodyZAxis', 0, 40);
    gui.add(controls, 'robotRotateY', 0, 7);
};

const createControls = (camera) => new function () {
    this.cameraX = camera.position.x;
    this.cameraY = camera.position.y;
    this.cameraZ = camera.position.z;
    this.leftArm = 0;
    this.rightArm = 0;
    this.leftUnderArm = 0;
    this.rightUnderArm = 0;
    this.bodyXAxis = 0;
    this.bodyYAxis = 4;
    this.bodyZAxis = 20;
    this.robotRotateY = 0;
};

window.onload = init;
