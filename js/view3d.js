import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { FlyControls } from '../jsm/controls/FlyControls.js';
import { PLYLoader } from '../jsm/loaders/PLYLoader.js';
import { XYZLoader } from '../jsm/loaders/XYZLoader.js';
import { Lut } from '../jsm/math/Lut.js';

export function view3draw(path) {
    const loader = new PLYLoader();
    loader.load( path , function ( geometry ) {

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 10 );
        camera.lookAt( 0, 0, 0 );
        const scene = new THREE.Scene();

        const material = new THREE.PointsMaterial( { color: 0x888888, size:0.010 } );
        const points = new THREE.Points( geometry, material );
        scene.add( points );

        const controls = new FlyControls(camera, renderer.domElement)
        controls.movementSpeed = 10;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 6;
        controls.autoForward = false;
        controls.dragToLook = false;

        const animate = function () {
            requestAnimationFrame( animate );
            controls.update(0.01);
            renderer.render( scene, camera );
        };

        animate();

    }, undefined, function ( error ) {

        console.error( error );

    } );
}

export function view3draw_orbit(path) {
    const loader = new PLYLoader();
    loader.load( path , function ( geometry ) {

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 10 );
        camera.lookAt( 0, 0, 0 );
        const scene = new THREE.Scene();

        var colors = [];
        var n = geometry.attributes.position.count;
        var minZ = geometry.attributes.position.getZ(0);
        var maxZ = minZ;
        for ( let i = 0; i < n; i ++ ) {
            var d = geometry.attributes.position.getZ(i)
            if (d < minZ) {
                minZ = d
            }
            if (d > maxZ) {
                maxZ = d;
            }
        }
        console.log('min and max value for z:');
        console.log(minZ);
        console.log(maxZ);

        var dsin;
        var dcos;
        var d;
        const lut = new Lut( 'rainbow', 512 );
        for ( let i = 0; i < n; i ++ ) {
            d = geometry.attributes.position.getZ(i)
            if (maxZ - minZ > 0.000001) {
                d = (d - minZ) / (maxZ - minZ);
            }
            const c = lut.getColor( d );
            colors.push( c.r, c.g, c.b);
        }

        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        const material = new THREE.PointsMaterial( { color: 0x888888, size:0.010 , vertexColors : true} );
        const points = new THREE.Points( geometry, material );
        scene.add( points );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0.5, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
    
        const animate = function () {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        };

        animate();
    }, undefined, function ( error ) {

        console.error( error );

    } );
}

