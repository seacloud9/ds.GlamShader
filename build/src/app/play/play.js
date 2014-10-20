var camera, scene, rendererGL, postprocessor, stats, sound, soundAPI, webaudio, data, processingMat;
var mirrorParams, mirrorPass, clock = new THREE.Clock();
var object, light, scaleSound = 0;

function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
}


      function initGL() {
        

        rendererGL = new THREE.WebGLRenderer();
        rendererGL.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( rendererGL.domElement );
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 400;
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
        object = new THREE.Object3D();
        scene.add( object );
        

        scene.add( new THREE.AmbientLight( 0x222222 ) );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        // postprocessing

        postprocessor = new THREE.EffectComposer( rendererGL );
        postprocessor.addPass( new THREE.RenderPass( scene, camera ) );
        effectBloom = new THREE.BloomPass(30.25, 10, 5, 1024);
        effectBloom.enabled = false;
        postprocessor.addPass( effectBloom );
        effectBloom.renderToScreen = true;

        addSpaceJunk();

        

        mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );
        mirrorPass.uniforms[ "side" ].value = 1;
        postprocessor.addPass( mirrorPass );
        mirrorPass.renderToScreen = true;

        
        
        
        dotScreenPass = new THREE.ShaderPass( THREE.DotScreenShader );
        dotScreenPass.uniforms[ 'scale' ].value = 4;
        dotScreenPass.enabled = false;
        postprocessor.addPass( dotScreenPass );

    
        rGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader );
        rGBShiftPass.uniforms[ 'amount' ].value = 0.0015;
        rGBShiftPass.renderToScreen = true;
        rGBShiftPass.enabled = false;
        postprocessor.addPass( rGBShiftPass );
        //
        window.addEventListener( 'resize', onWindowResizePlay, false );
  }


      function addSpaceJunk(){
        var mesh;
        for ( var i = 0; i < 80; i ++ ) {
          if(i % 2 === 0){
            scale = getRandomArbitrary(1, 6);
            var geo = new THREE.SphereGeometry( 1, scale, scale );
            mesh = new THREE.Mesh( geo, processingMat );
          }else{

            scale = getRandomArbitrary(0.75, 2);
            var geo2 = new THREE.BoxGeometry( scale, scale, scale );
            mesh = new THREE.Mesh( geo2, processingMat );
          }
          wrapTexture();
          mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
          mesh.position.multiplyScalar( Math.random() * 400 );
          mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
          mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
          object.add( mesh );
        }
      }
      function wrapTexture(){
        canvas = document.getElementById('glam');
            texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            processingMat = new THREE.MeshBasicMaterial({
             overdraw:true, map:texture, side:THREE.DoubleSide, transparent: true
            });
             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }

      function onWindowResizePlay() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererGL.setSize( window.innerWidth, window.innerHeight );
      }

    function animateGL() {
        

        wrapTexture();

        for(var i=0; object.children.length > i; i++){
          object.children[i].material = processingMat;
        }

        var min   = 0;
        var max   = 1;
        var offset  = 0;
        var range = 1;
        var tweenFn = TWEEN.Easing.Linear.None;
        scaleSound  = soundAPI.amplitude();
        scaleSound    = Math.min(scaleSound, max);
        scaleSound    = Math.max(scaleSound, min);
        scaleSound    -= min;
        scaleSound    /= max == min ? 1 : max - min;
        scaleSound    = tweenFn(scaleSound);
        scaleSound    *= range;
        scaleSound    += offset;

        if(scaleSound > 0){
          object.rotation.x += 0.005 * scaleSound;
          object.rotation.y += 0.01 * scaleSound;
          object.scale.set(scaleSound, scaleSound, scaleSound);
        }

        if(scaleSound > 0.5){
          effectBloom.enabled = false;
          dotScreenPass.enabled = false;
          rGBShiftPass.enabled = false;
          
        }else if(scaleSound > 0.6){
          dotScreenPass.enabled = true;
          rGBShiftPass.enabled = true;
        }else{
          effectBloom.enabled = true;
          dotScreenPass.enabled = false;
          rGBShiftPass.enabled = false;
          object.rotation.x += 0.005;
          object.rotation.y += 0.01;
        }
        


        requestAnimationFrame( animateGL );

        

        postprocessor.render();


      }
      



angular.module( 'ngSoundCloudViz.play', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'play', {
    url: '/play',
    views: {
      "main": {
        controller: 'PlayCtrl',
        templateUrl: 'play/play.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'PlayCtrl', function PlayCtrl( $scope, soundCloudService, playIDService  ) {
    jQuery(rendererCSS.domElement).hide();
    $scope.soundID = playIDService.getID();


    currentMousePos = { x: -1, y: -1 };
          jQuery(document).mousemove(function(event) {
              currentMousePos.x = event.pageX;
              currentMousePos.y = event.pageY;
          });
        webaudio  = new WebAudio();
        // create a sound
        soundAPI  = webaudio.createSound();
          canvasCallback = jQuery.Callbacks();
          var prCodeInit = function(){
            $projDiv = jQuery('#glamProcessing');
            canvasRef = jQuery('<canvas id="glam"/>');
            $projDiv.append(canvasRef);
            p1 = new Processing.loadSketchFromSources('glam', ['vendor/scripts/glam.pde']);
             
            
          };

          var setup3JS = function(){
            setTimeout(function(){
              initGL();
              animateGL();
            }, 2000);
            
          };

          SC.initialize({
            client_id: 'b861cf4f67c435a1183dc13112b0f56f'
          });

          // stream track id 293
          SC.stream("/tracks/"+$scope.soundID, function(sound){
            soundAPI.load(sound.url, function(soundAPI){
              soundAPI.loop(true).play();
            });
          });
          canvasCallback.add(prCodeInit);
          canvasCallback.add(setup3JS);
          canvasCallback.fire('setup3JS');


    console.log( $scope.soundID );
});
