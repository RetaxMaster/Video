$(document).on("ready", function(){
  //Eventos
  document.addEventListener("fullscreenchange", eventFullScreen);
  document.addEventListener("webkitfullscreenchange", eventFullScreen);
  document.addEventListener("mozfullscreenchange", eventFullScreen);
  document.addEventListener("MSFullscreenChange", eventFullScreen);
  // Eventos del video
  $("video").on("play", function(){
    $(this).parent().children(".video-controlls").children(".playpause").children(".play").hide();
    $(this).parent().children(".video-controlls").children(".playpause").children(".pause").show();
    $(this).parent().children(".big-icon").hide();
    $(this).parent().children(".video-controlls").show();
  });

  $("video").on("pause", function(){
    $(this).parent().children(".video-controlls").children(".playpause").children(".play").show();
    $(this).parent().children(".video-controlls").children(".playpause").children(".pause").hide();
  });

  $("video").on("timeupdate", function(){
    // Establecer el tiempo cada que se actualice
    var currentTime = segundosMinutos(this.currentTime);
    $(this).parent().children(".video-controlls").children(".time").children().children(".currentTime").text(currentTime);
    // ->Establecer el tiempo cada que se actualice

    //Mover el slider a medida que se reproduce el video
    timeChange($(this).parent(), "timeupdate", null);
    //->Mover el slider a medida que se reproduce el video
  });

  $("video").on("loadeddata", function(){
    var videoTime = segundosMinutos(this.duration);
    $(this).parent().children(".video-controlls").children(".time").children().children(".duration").text(videoTime);
  });

  $("video").on("ended", function(){
    $(this).parent().children(".big-icon").children().children().children().children().children().attr("class", "icon-history");
    $(this).parent().children(".big-icon").show();
  });

  $("video").on("click", function(){
    if (this.paused) {
      this.play();
    }
    else {
      this.pause();
    }
  });

  $(window).resize(function() {
    var videoContainer = $(".video-container");
    for (var i = 0; i < videoContainer.length; i++) {
      timeChange($(videoContainer).children(".video"), "timeupdate", null);
    }
  });
  // ->Eventos del video

  //Eventos de los botones

  $(".full-screen").on("click", function() {
    var video = $(this).parent().parent().parent();
    setFullScreenMode(video);
  });

  $(".big-icon").on("click", function(){
    var parent = $(this).parent();
    PlayPauseVideo(parent, "play");
  });

  $(".reproduction-body").on("mousedown", function(e){
    var repBody = this;
    e.preventDefault();
    moveSliderX(e, repBody);
    $("html").on("mousemove", function(e){
      e.preventDefault();
      moveSliderX(e, repBody);
    }).on("mouseup", function(){
      $(this).off("mousemove");
    });
  });

  $(".reproduction-body").on("mousemove", function(e){
    var repBody = this;
    e.preventDefault();
    moveTimeGlobeX(e, repBody);
  }).on("mouseout", function(){
    $(this).children(".time-globe").hide();
  });

  $(".volume-body").on("mousedown", function(e){
    var volBody = this;
    e.preventDefault();
    moveSliderY(e, volBody);
    $("html").on("mousemove", function(e){
      e.preventDefault();
      moveSliderY(e, volBody);
    }).on("mouseup", function(){
      $(this).off("mousemove");
    });
  });

  $(".volume-body").on("mousemove", function(e){
    var volBody = this;
    e.preventDefault();
    moveTimeGlobeY(e, volBody);
  }).on("mouseout", function(){
    $(this).children(".time-globe").hide();
  });

  $(".play, .pause").on("click", function(){
    var parent = $(this).parent().parent().parent();

    if ($(this).hasClass("play")) {
      PlayPauseVideo(parent, "play");
    }
    else {
      PlayPauseVideo(parent, "pause");
    }
  });

  $(".icon-clickeable").on("click", function() {
    var elementParent = $(this).parent().parent().children(".element-parent");

    for (var i = 0; i < elementParent.length; i++) {

      var elementHidden = $(elementParent[i]).children(".element-hidden");

      if ($(this).parent().attr("class") != $(elementParent[i]).attr("class")) {

        if ($(elementHidden).css("display") != "none"){
          $(elementHidden).hide();
        }

      }

    }

    $(this).parent().children(".element-hidden").slideToggle();
  });

  $(".settings .setting-option").on("click", function() {
    var value = $(this).children().val();
    if (value != 0.5 && value != 1 && value != 1.5 && value != 2) {
      $($(this).parent().children()[1]).click();
    }
    else {
      $(this).parent().children(".active").removeClass("active");

      $(this).addClass("active");
      $(this).parent().parent().parent().parent().parent().children("video").get(0).playbackRate = value;
    }
  });
  //->Eventos de los botones
  //->Eventos

  //Funciones

  // FullScreen
  function CurrentlyInFullScreen() {
      return (document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement);
  }

  function eventFullScreen() {
    if (CurrentlyInFullScreen()) {
      var elementoActual = CurrentlyInFullScreen();
      $(elementoActual).addClass("video-fullScreen");
      $(elementoActual).children(".video-controlls").children(".video-options").children(".full-screen").children().attr("class", "icon-resize-small");
      timeChange(elementoActual, "timeupdate", null);
    }
    else {
      var elementoActual = $(".video-fullScreen");
      $(elementoActual).children(".video-controlls").children(".video-options").children(".full-screen").children().attr("class", "icon-resize-full");
      $(elementoActual).removeClass("video-fullScreen");
      timeChange(elementoActual, "timeupdate", null);
    }
  }

  function setFullScreenMode(video){

    var fullScreen = $(video).get(0);

  if ($(fullScreen).hasClass("video-fullScreen")) {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
  }
  else {

    if (fullScreen.requestFullscreen) {
      fullScreen.requestFullscreen();
    }
    else if (fullScreen.mozRequestFullScreen) {
      fullScreen.mozRequestFullScreen();
    }
    else if (fullScreen.webkitRequestFullScreen) {
      fullScreen.webkitRequestFullScreen();
    }
    else if (fullScreen.msRequestFullscreen) {
      fullScreen.msRequestFullscreen();
    }
  }

}

  // ->FullScreen

  function moveTimeGlobeX(e, element) {
    var pos = $(element).offset(),
    posX = e.pageX - pos.left;
    var parentVideo = $(element).parent().parent().parent(),
    video = $(parentVideo).children("video");

    if (posX >= 0 && posX <= $(element).outerWidth()) {
      //Calcular el tiempo del video
      var duration = $(parentVideo).children("video").get(0).duration,
          barSize = $(element).width();

       var currentTime = (posX * duration) / barSize;
    $(element).children(".time-globe").css("left", posX + "px");
    $(element).children(".time-globe").children().text(segundosMinutos(currentTime));
    $(element).children(".time-globe").show();
  }
  }

  function moveTimeGlobeY(e, element){
    var pos = $(element).offset(),
    posY = (pos.top + $(element).height()) - e.pageY;
    var parentVideo = $(element).parent().parent().parent().parent().parent();

    if (posY >= 0 && posY <= $(element).outerHeight()) {
      var altura = $(element).height();
       var volActual = Math.round(((posY / altura) * 100)) + "%";
       /*

       altura 100%
       volume X

       */
       $(element).children(".time-globe").css("bottom", posY + "px");
       $(element).children(".time-globe").children().text(volActual);
       $(element).children(".time-globe").show();
     }
  }

  function moveSliderX(e, element){
    var pos = $(element).offset(),
    posX = e.pageX - pos.left;
    var parentVideo = $(element).parent().parent().parent(),
    video = $(parentVideo).children("video");

    if (posX >= 0 && posX <= $(element).outerWidth()) {
      timeChange(parentVideo, "moveslider", posX + "px");
      //Calcular el tiempo del video
      var duration = $(parentVideo).children("video").get(0).duration,
          barSize = $(element).width(),
          repBarSize = $(element).children(".reproduction-played").width();

       var currentTime = (repBarSize * duration) / barSize;
         $(parentVideo).children("video").get(0).currentTime = currentTime;
          /*

         barSize   duration
         repBarSize   x

          */
      //->Calcular el tiempo del video
    }

    if ($(video).get(0).currentTime !=  $(video).get(0).duration) {
      $(parentVideo).children(".big-icon").hide();
    }
  }

  function moveSliderY(e, element){
    var pos = $(element).offset(),
    posY = (pos.top + $(element).height()) - e.pageY;
    var parentVideo = $(element).parent().parent().parent().parent().parent();

    if (posY >= 0 && posY <= $(element).outerHeight()) {
      $(element).children(".volume-actual").css("height", posY + "px");
      $(element).children(".circle-indicator").css("bottom", posY + "px");
      var altura = $(element).height();

       var volActual = posY / altura;

       var iconVol = $(element).parent().parent().children("i")
       if (volActual > 0.5) {
         $(iconVol).attr("class", "icon-volume-up icon-clickeable")
       }
       else if (volActual <= 0.5) {
         $(iconVol).attr("class", "icon-volume-down icon-clickeable")
       }
       else if (volActual == 0) {
         $(iconVol).attr("class", "icon-volume-off icon-clickeable")
       }

       $(parentVideo).children("video").get(0).volume = volActual;

      /*

      altura  1
      sizebar   x

      */
    }
  }

  function timeChange(videoParent, type, actualWidth) {
    var repCont = $(videoParent).children(".video-controlls").children(".reproduction-container");
    if (type == "timeupdate") {
      var width = $(repCont).children(".reproduction-body").width(),
      currentTime = $(videoParent).children("video").get(0).currentTime,
      duration = $(videoParent).children("video").get(0).duration;

      var actualWidth = ((width * currentTime) / duration) + "px";
    }


    $(repCont).children(".reproduction-body").children(".reproduction-played").css("width", actualWidth);
    $(repCont).children(".reproduction-body").children(".circle-indicator").css("left", actualWidth);

    /*

    Width   duration
            currentTime

    */
  }

  function segundosMinutos(duracion){//00:00
    var segundos = duracion,
        minutos = Math.floor(segundos / 60), //1
        seg = Math.round(segundos % 60); //

        if (minutos < 10) {
          minutos = "0" + minutos;
        }

        if (seg < 10) {
          seg = "0" + seg;
        }

        if (seg == 60) {
          minutos = parseInt(minutos) + 1;
          minutos = "0" + minutos;
          seg = "00";
        }

        duracionTotal = minutos + ":" + seg;
        return duracionTotal;
  }

  function PlayPauseVideo(parent, type) {
    if (type == "play") {
      if ($(parent).children("video").get(0).readyState == 4) {
        $(parent).children("video").get(0).play();
      }
    }
    else {
      $(parent).children("video").get(0).pause();
    }
  }

  //->Funciones



});
