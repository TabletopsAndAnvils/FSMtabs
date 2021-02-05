// demo music url http://s3.yesstreaming.net:7062/stream 

function streamPlay() {

}

Hooks.on("ready", function () {  
  streamDialog();
  });
  
  function streamDialog() {
  $('.dialog').css({width: '350px'});
  let streamPlayer = new Dialog({
      title: `Underhill's Stream Audio`,
      content: `<audio controls="controls">
      <source src="http://radio.tabletopsandanvils.com:8000/radio.mp3" type="audio/mpeg" />
    </audio>`,
      buttons: {},
      close: (html) => {
          console.log(html);
      }
    });
    streamPlayer.options.width = 316;
    streamPlayer.position.width = 316;
    streamPlayer.render(true)
  }
