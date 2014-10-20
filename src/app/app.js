
rendererCSS = null;
init = function(){

      if(rendererCSS == null){
        init3JS();
        animate();
      }
          
};

init3JS = function(){

        rendererCSS = new THREE.CSS3DRenderer();
        rendererCSS.setSize( window.innerWidth, window.innerHeight );
        rendererCSS.domElement.style.position = 'absolute';
        rendererCSS.domElement.style.top  = 0;
        rendererCSS.domElement.style.margin = 0;
        rendererCSS.domElement.style.padding  = 0;
        document.body.appendChild( rendererCSS.domElement );

       jQuery(window).on('mousewheel', function(event) {
          event.preventDefault();
            for(var si=0; si < soundPlaneDiv.length; si++){
                new TWEEN.Tween( soundPlaneDiv[si].position )
                .to( {  z: soundPlaneDiv[si].position.z + (event.deltaY * 20)  }, 500 )
                .easing( TWEEN.Easing.Exponential.Out )
                .start();
              }
        });
        buildPlanes();

};

window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
    });


buildPlanes = function(){
       soundPlane = [];
       soundPlaneDiv = [];
       cssScene  = new THREE.Scene();
       if(soundPlaneDiv.length > 0){
          for(var x=0; x < soundPlaneDiv.length; x++){
              cssScene.remove(soundPlaneDiv[x]);
          }   
        }

       jQuery(rendererCSS.domElement).append('<div class="soundContainer"></div>');
       cssObjectContainer = new THREE.CSS3DObject(jQuery('.soundContainer')[0]);
       cssScene.add(cssObjectContainer);
       for(var i=0; i < jQuery('.soundCloudCard').length; i++){
          var element = jQuery('.soundCloudCard')[i];
          var cssObject = new THREE.CSS3DObject( element );
          cssObject.position.y = -90;
          cssObject.position.z = -70 + -(i * 300);
          cssScene.add(cssObject);
          soundPlaneDiv.push(cssObject);
        }
        cssCam = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1 , 100000);
        cssScene.add(cssCam);
        cssCam.position.z = 196;
        rendererCSS.render( cssScene, cssCam);
};


animate = function() {
  rendererCSS.render( cssScene, cssCam);
  TWEEN.update();
  requestAnimationFrame( animate );
};


statInit = function(){
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );
};

var ngSoundCloudService = angular.module( 'ngSoundCloudViz', [
  'templates-app',
  'templates-common',
  'ngSoundCloudViz.home',
  'ngSoundCloudViz.play',
  'ui.router'
]);




ngSoundCloudService.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
});

ngSoundCloudService.service('playIDService', function() {
    var playID = 17100989;
    var trackSearch = 'st. vincent';
    
    return {
        getID: function() {
            return playID;
        },
        setID: function(value) {
            playID = value;
        },
        setTrackSearch: function(value) {
            trackSearch = value;
        },
        getTrackSearch: function() {
            return trackSearch;
        }
    };
})


.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, soundCloudService, playIDService ) {
  $scope.go = function ( path ) {
        $location.path( path );
  };  

  $scope.submit = function($value) {
        $scope.go('/home');
        $scope.$broadcast('grabSound', $value);
  };

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngSoundCloudViz' ;
    }

   
  });

})

;

