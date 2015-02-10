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

currentlyPlayingSong = null;

var albumCollection = [albumPicasso, albumMarconi, albumRPSound];

var createSongRow = function(songNumber, songName, songLength){
  var template =
     '<tr>'
   + '  <td class="song-number col-md-1" data-song-number="' +songNumber+ '">' + songNumber + '</td>'
   + '  <td class="col-md-9">' + songName + '</td>'
   + '  <td class="col-md-2">' + songLength + '</td>'
   + '</tr>'
   ;

  // Instead of returning the row immediately, we'll attach hover
  // functionality to it first.
  var $row = $(template);

  // Change from a song number to play button when the song isn't playing and we hover over the row.
  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-number');
    var songNumber = songNumberCell.data('song-number');
    if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-number');
    //Scoping??

    if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html(songNumber);
    }
  };

  var clickHandler = function(event){
    var songNumber = $(this).data('song-number');

    if (currentlyPlayingSong !== null) {
       // Revert to song number for currently playing song because user started playing new song.
       currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
       currentlyPlayingCell.html(currentlyPlayingSong);
     }
 
     if (currentlyPlayingSong !== songNumber) {
       // Switch from Play -> Pause button to indicate new song is playing.
       $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
       currentlyPlayingSong = songNumber;
     }
     else if (currentlyPlayingSong === songNumber) {
       // Switch from Pause -> Play button to pause currently playing song.
       $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
       currentlyPlayingSong = null;
     }
   };
  
  $row.find('.song-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var changeAlbumView = function(album){
 
    // Update the album title
    var $albumTitle = $('.album-title');
    $albumTitle.text(album.name);

    $('.album-title').text(album.name);

    // Update the album artist
    var $albumArtist = $('.album-artist');
    $albumArtist.text(album.artist);

    // Update the meta information
    var $albumMeta = $('.album-meta-info');
    $albumMeta.text(album.year + " on " + album.label);


    // Update the album image
    var $albumImage = $('.album-image img');
    $albumImage.attr('src', album.albumArtUrl);

    // Update the Song List
    var $songListing = $('.album-song-listing');

    $songListing.empty();

    var songs = album.songs;

    for(var i = 0; i<album.songs.length; i++){
      var song = songs[i]
      $songListing.append(createSongRow(i+1, song.name, song.length) );
    };

};

var currentAlbum = 0;
var swapAlbum = function(){
  if (currentAlbum == albumCollection.length -1){
    currentAlbum = 0;
  }
  else {
    currentAlbum++;
  }
  changeAlbumView(albumCollection[currentAlbum]);
};

//mine
var updateSeekPercentage = function($seekBar, event){
  //get mouse position

  var barWidth = $seekBar.width();

  var offsetX = event.pageX - $seekBar.offset().left;

  var offsetXPercent = offsetX / barWidth * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';

  $seekBar.find('.thumb').css({left: percentageString});
  $seekBar.find('.fill').width(percentageString);

  console.log('Mouse position: ' + event.pageX + ', ' + event.pageY);
};


var setupSeekBars = function(){

  var $seekBars = $('.player-bar .seek-bar'); //Do I not need to declare Var?

  $seekBars.click(function(event){
    updateSeekPercentage($(this), event); //use this rather than seekbar, since there are multiple seek bars (the actual seek bar and the volume control)
  });

  //on the thumb.click, bind mouse move

  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();

    $seekBar.addClass('no-animate');

    $(document).bind('mousemove.thumb', function(event){
      updateSeekPercentage($seekBar, event);

      $(document).bind('mouseup.thumb', function(event){

        $seekBar.removeClass('no-animate');

        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');

      });

    });

  });

};


if (document.URL.match(/\/album.html/)) {
   // Wait until the HTML is fully processed.
   $(document).ready(function() {

    changeAlbumView(albumCollection[0]);

    setupSeekBars();

    $(".album-image").click(swapAlbum);

   });
 }


