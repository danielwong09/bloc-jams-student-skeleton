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
       { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
       { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
       { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
       { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
       { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
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

  $stateProvider.state('album', {
    url: '/album',
    controller: 'Album.controller',
    templateUrl: '/templates/album.html'
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

blocJams.controller('Collection.controller', ['$scope','SongPlayer', '$state', function($scope, SongPlayer, $state) {
  $scope.hideOverlay = true;

  $scope.albums = [];
  for(var i = 0; i <33; i++){
    $scope.albums.push(angular.copy(albumPicasso));
  };

  $scope.playAlbum = function(album){
    //Race condition?
    SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
    $state.go('album');

  }
  
}]);

blocJams.controller('Album.controller',['$scope', 'SongPlayer', function($scope, SongPlayer) {

  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;

  $scope.onHoverSong = function(song){
    hoveredSong = song;
  };

  $scope.offHoverSong = function(song){
    hoveredSong = null;
  };

  $scope.getSongState = function(song) {
    if (song === SongPlayer.currentSong && SongPlayer.playing) {
      return 'playing';
    }
    else if (song === hoveredSong) {
      return 'hovered';
    }
    return 'default';
  };

  $scope.playSong = function(song) {
    SongPlayer.setSong($scope.album, song);
  };

  $scope.pauseSong = function(song) {
    SongPlayer.pause();
  };

  
}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;

}]);
 
blocJams.service('SongPlayer', function() {
  var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
  };

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
    currentSoundFile: null,

    play: function() {
      this.playing = true;
      this.currentSoundFile.play();

    },
    pause: function() {
      this.playing = false;
      this.currentSoundFile.pause();
    },
    setSong: function(album, song) {
      if (this.currentSoundFile) {
        this.currentSoundFile.stop();
      }
      this.currentAlbum = album;
      this.currentSong = song;
      this.currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: [ "mp3" ],
        preload: true
      });
   
      this.play();
    },
    previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         currentTrackIndex = this.currentAlbum.songs.length - 1;
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
     },
    next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
         currentTrackIndex = 0;
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
     },
  };
});

blocJams.directive('slider', function(){

  updateSeekPercentage = function($seekBar, event){
    //get mouse position
    
    var barWidth = $seekBar.width();
    
    var offsetX = event.pageX - $seekBar.offset().left;

    var offsetXPercent = offsetX / barWidth * 100;
    offsetXPercent = Math.max(0, offsetXPercent);   
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';

    $seekBar.find('.thumb').css({left: percentageString});
    $seekBar.find('.fill').width(percentageString);
  };

  function link(scope, element, attrs) {
    var $seekBar = $(element);

    scope.seekBarClick = function(event){
      updateSeekPercentage($(event.target),event);
    };

    scope.fillBarClick = function(event){
      updateSeekPercentage($(event.target).parent(),event);
    };

    $seekBar.find('.thumb').mousedown(function(event){
      $seekBar.addClass('no-animate');

      $(document).bind('mousemove.thumb', function(event){
        updateSeekPercentage($seekBar, event);
      });

      //cleanup
      $(document).bind('mouseup.thumb', function(){
        $seekBar.removeClass('no-animate');
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
      });

    });

  };//end link function

  return {
    link: link,
    restrict: 'E',
    replace: true,
    templateUrl: '/templates/directives/slider.html'
  }
});//end directive


blocJams.directive('clickMe', function(){
  return {
    restrict: 'E',
    replace: true,
    template: "<div ng-click='clickMe()'>Click me.</div>",
    link: function(scope, element, attributes) {
      scope.clickMe = function(){
        alert('You clicked me!' + element);
      };
    }
  }
});

blocJams.directive('countHoverTime', function(){
  return {
    restrict: 'A',
    link: function(scope, element) {
      
      var hoverDuration = 0;
      var timeOutID;

      var incrementTimer = function(){
        hoverDuration++;
        passTheTime();
      };
      
      var passTheTime = function(){
        timeOutID = window.setTimeout(incrementTimer,1000);
      };

      var onHoverElement = function(){
        console.log('Starting hover timer');
        hoverDuration =0;
        passTheTime();
      };

      var offHoverElement = function(){
        console.log('Hovered seconds: ' + hoverDuration);
        window.clearTimeout(timeOutID);
      };
      
      //find the item, attach on hover event handler
      $(element).hover(onHoverElement, offHoverElement);
      
    }
  }
});
/*

blocJams.directive('classify', function(){
  return {
    restrict: 'AEC',
    link: function(scope,element,attr){
      //pull element text
      var newClass = element.textContent;
      //put element text into the class attr
      element.className = element.className + " " + newClass;
    }
  }
});
*/