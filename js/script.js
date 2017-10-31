(function() {

    var scene, camera, renderer;
    var particleArray = new THREE.Object3D();

    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;

    var loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = '';

    loader.load('https://i.imgur.com/X35NZCl.png',

        function(texture1) { 

            loader.load('https://i.imgur.com/2a1hCTI.png',

                function(texture2) {

                    loader.load('https://i.imgur.com/Gsnyfcr.png',

                        function(texture3) {
                           
                           loader.load('https://i.imgur.com/P19L7K9.png',

                                function(texture4) {

                                    loader.load('https://i.imgur.com/h7s5hbO.png',

                                        function(texture5) {
                                            init(texture1, texture2, texture3, texture4, texture5);
                                            animate(texture1, texture2, texture3, texture4, texture5);

                                        },
                                        function(xhr) {},
                                        function(xhr) {},
                                        function(xhr) {},
                                        function(xhr) {},
                                        function(xhr) {}
                                    );

                                },
                                function(xhr) {},
                                function(xhr) {},
                                function(xhr) {},
                                function(xhr) {},
                                function(xhr) {}
                            );

                        },
                        function(xhr) {},
                        function(xhr) {},
                        function(xhr) {},
                        function(xhr) {},
                        function(xhr) {}

                    );

                },
                function(xhr) {},
                function(xhr) {},
                function(xhr) {},
                function(xhr) {},
                function(xhr) {}
            );

        },
        function(xhr) {},
        function(xhr) {},
        function(xhr) {},
        function(xhr) {},
        function(xhr) {},

    );



    function init(texture1, texture2, texture3, texture4, texture5) {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 3000;


        cameraZ = farPlane / 100;
       // fogHex = 0x000000;
        fogDensity = 0.0007;

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry();

        particleCount = 2000;

        for (i = 0; i < particleCount; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 500 - 250;
            vertex.y = Math.random() * 500 - 250;
            vertex.z = Math.random() * 500 - 250;
            geometry.vertices.push(vertex);
        }

        // parameters = [
        //     [
        //         [22.99, 10, 1.0], 10
        //     ],

        //     [
        //         [0.95, 1, 0.5], 4
        //     ],

        //     [
        //         [0.90, 10, 0.5], 3
        //     ],

        //     [
        //         [0.85, 1, 0.5], 2
        //     ],

        //     [
        //         [0.80, 1, 0.5], 1
        //     ]
        // ];

        parameters = [
            [
                100000
            ],

            [
                4
            ],

            [
                3
            ],

            [
                2
            ],

            [
                1
            ]
        ];




        parameterCount = parameters.length;

        for (i = 0; i < parameterCount; i++) {

            size = 5;

            if (i % 5 == 0) {
                textu = texture2;
            } else if (i % 4 == 0) {
                textu = texture3;
            } else if (i % 3 == 0) {
                textu = texture4;
            } else if (i % 2 == 0) {
                textu = texture5;
            }

            materials[i] = new THREE.PointCloudMaterial({
                size: size,
                map: textu,
                transparent: true
            });

            particles = new THREE.PointCloud(geometry, materials[i]);
            particles.geometry.verticesNeedUpdate = true;

            particles.rotation.x = Math.random() * 1;
            particles.rotation.y = Math.random() * 1;
            particles.rotation.z = Math.random() * 1;

            particleArray.add(particles);
        }

        particleArray.name = "cloud";
        scene.add(particleArray);
        var object = scene.getObjectByName("cloud");


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);

        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);

    }

    function animate(texture) {

        requestAnimationFrame(animate);
        render(texture);

        //stats.update();
    }

    function render(texture) {
        var time = Date.now() * 0.0005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.lookAt(scene.position);

        for (i = 0; i < scene.children.length; i++) {

            var object = scene.children[i];

            if (object instanceof THREE.PointCloud) {

                object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
                //object.rotation.y = time * (i % 2.4 * i > 7 -(i + 1));
            }
        }

        renderer.render(scene, camera);
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    function onDocumentTouchStart(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
})();