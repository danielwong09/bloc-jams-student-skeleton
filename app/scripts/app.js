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
      { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: 105.66 , audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
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
  
  SongPlayer.onTimeUpdate(function(event, time){
     $scope.$apply(function(){
       $scope.playTime = time;
     });
 });
  
  $scope.volumeClass = function() {
     return {
       'fa-volume-off': SongPlayer.volume == 0,
       'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
       'fa-volume-up': SongPlayer.volume > 70
     }
   }

}]);

blocJams.service('SongPlayer', ['$rootScope',function($rootScope) {
  var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
  };

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
    volume: 90,
    volumeCache:0,
    currentSoundFile: null,

    play: function() {
      this.playing = true;
      this.currentSoundFile.play();

    },
    pause: function() {
      this.playing = false;
      this.currentSoundFile.pause();
    },
    seek: function(time) {
       // Checks to make sure that a sound file is playing before seeking.
       if(this.currentSoundFile) {
         // Uses a Buzz method to set the time of the song.
         this.currentSoundFile.setTime(time);
       }
     },
    
    onTimeUpdate: function(callback) {
      return $rootScope.$on('sound:timeupdate', callback);
    },
    
    setVolume: function(volume) {
      if(this.currentSoundFile){
        this.currentSoundFile.setVolume(volume);
      }
      this.volume = volume;
    },
    toggleMute: function() {

      if(this.volume !== 0){
        this.volumeCache = this.volume;
        if(this.currentSoundFile){
          this.currentSoundFile.setVolume(0);
        }
        
        this.volume = 0;
      }
      else{
        if(this.currentSoundFile){
          this.currentSoundFile.setVolume(this.volumeCache);
        }
        this.volume = this.volumeCache;
        
      }
      
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
      
      this.currentSoundFile.setVolume(this.volume);
      
      this.currentSoundFile.bind('timeupdate', function(e){
        $rootScope.$broadcast('sound:timeupdate', this.getTime());
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
}]);

blocJams.directive('slider', ['$document', function($document){

  calculateSliderPercentFromMouseEvent = function($seekBar, event){
    //get mouse position
    
    var barWidth = $seekBar.width();
    var offsetX = event.pageX - $seekBar.offset().left;
    var offsetXPercent = offsetX / barWidth;
    offsetXPercent = Math.max(0, offsetXPercent);   
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
  };
  
  //Note, bloc has this after the link function?
  var numberFromValue = function(value, defaultValue) {
     if (typeof value === 'number') {
       return value;
     }
 
     if(typeof value === 'undefined') {
       return defaultValue;
     }
 
     if(typeof value === 'string') {
       return Number(value);
     }
   }
 

  function link(scope, element, attributes) {
    scope.value = 0;
    scope.max = 100;
    var $seekBar = $(element);
    
    console.log(attributes);
    
    attributes.$observe('value', function(newValue) {
      scope.value = numberFromValue(newValue, 0);
    });

    attributes.$observe('max', function(newValue) {
      scope.max = numberFromValue(newValue, 100) || 100;
    });
    
    scope.onClickSlider = function(event) {
         var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
         scope.value = percent * scope.max;
        notifyCallback(scope.value);
       }
    
    var percentString = function () {
      var value = scope.value || 0;
      var max = scope.max || 100;
      percent = value / max * 100;
      return percent + "%";
    }
    
    
    scope.fillStyle = function(){
      return {width: percentString()};
    }
    
    scope.thumbStyle = function(){     
      return {left: percentString()};
    }
    
    scope.trackThumb = function() {
         $document.bind('mousemove.thumb', function(event){
           var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
           scope.$apply(function(){
             scope.value = percent * scope.max;
             notifyCallback(scope.value);
           });
         });
 
         //cleanup
         $document.bind('mouseup.thumb', function(){
           $document.unbind('mousemove.thumb');
           $document.unbind('mouseup.thumb');
         });
       };
    
    var notifyCallback = function(newValue) {
         if(typeof scope.onChange === 'function') {
           scope.onChange({value: newValue});
         }
       };

  };//end link function

  return {
    link: link,
    restrict: 'E',
    replace: true,
    templateUrl: '/templates/directives/slider.html',
    scope: {
      onChange: '&'
    },
  }
}]);//end directive

blocJams.filter('timecode', function(){
  return function(seconds) {
    seconds = Number.parseFloat(seconds);

    // Returned when no time is provided.
    if (Number.isNaN(seconds)) {
     return '-:--';
    }

    // make it a whole number
    var wholeSeconds = Math.floor(seconds);

    var minutes = Math.floor(wholeSeconds / 60);

    remainingSeconds = wholeSeconds % 60;

    var output = minutes + ':';

    // zero pad seconds, so 9 seconds should be :09
    if (remainingSeconds < 10) {
     output += '0';
    }

    output += remainingSeconds;

    return output;
  }
});