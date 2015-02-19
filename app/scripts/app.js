// require('./landing');
// require('./collection');
// require('./album');
// require('./profile');

//Example Album

var albumPicasso = {
 name: 'The Colors',
 artist: 'Pablo Picasso',
 label: 'Cubism',
 year: '1881',
 albumArtUrl: '/images/album-placeholder.png',
 songs: [
     { name: 'Blue', length: '4:26' },
     { name: 'Green', length: '3:14' },
     { name: 'Red', length: '5:01' },
     { name: 'Pink', length: '3:21'},
     { name: 'Magenta', length: '2:15'}
   ]
};

// Another Example Album
var albumMarconi = {
 name: 'The Telephone',
 artist: 'Guglielmo Marconi',
 label: 'EM',
 year: '1909',
 albumArtUrl: '/images/album-placeholder.png',
 songs: [
     { name: 'Hello, Operator?', length: '1:01' },
     { name: 'Ring, ring, ring', length: '5:01' },
     { name: 'Fits in your pocket', length: '3:21'},
     { name: 'Can you hear me now?', length: '3:14' },
     { name: 'Wrong phone number', length: '2:15'}
   ]
};

// Another Example Album
var albumRPSound = {
 name: 'Only God Forgives',
 artist: 'RP Sound',
 label: 'Jidsaw',
 year: '2002',
 albumArtUrl: '/images/album-placeholder.png',
 songs: [
     { name: 'What is Spain?', length: '1:01' },
     { name: 'He Gone', length: '6:01' },
     { name: 'To the Moon', length: '2:21'},
     { name: 'Delegate Orders', length: '3:14' },
     { name: 'Abstraction', length: '4:15'}
   ]
};


blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    controller: 'Landing.controller',
    templateUrl: '/templates/landing.html'
  });

  $stateProvider.state('collection', {
    url: '/collection',
    controller: 'Collection.controller',
    templateUrl: '/templates/collection.html'
  });

}]);
 

blocJams.controller('Landing.controller', ['$scope', function($scope) {

  $scope.subText = 'Turn the music up!';

  $scope.foo = function(){
    $scope.subText += '!';
  };

  $scope.albumURLs = [
   '/images/album-placeholders/album-1.jpg',
   '/images/album-placeholders/album-2.jpg',
   '/images/album-placeholders/album-3.jpg',
   '/images/album-placeholders/album-4.jpg',
   '/images/album-placeholders/album-5.jpg',
   '/images/album-placeholders/album-6.jpg',
   '/images/album-placeholders/album-7.jpg',
   '/images/album-placeholders/album-8.jpg',
   '/images/album-placeholders/album-9.jpg',
  ];

}]);

blocJams.controller('Collection.controller',['$scope', function($scope){

  $scope.hideOverlay = true;

  $scope.albums = [];
  for(var i = 0; i <33; i++){
    $scope.albums.push(angular.copy(albumPicasso));
  };
  
}]);