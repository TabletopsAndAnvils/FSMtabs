//import { registerSettings } from "../streamMod/scripts/settings";

var stream = new Howl({
    src: ['http://s3.yesstreaming.net:7062/stream'],
    ext: ['mp3'],
    autoplay: true,
    html5: true
});


function openStream() {
    sound.play(stream);
}

function openStream() {
    AudioHelper.play({src: "http://s3.yesstreaming.net:7062/stream", volume: 0.15, autoplay: true, loop: false}, true);
}

openStream();
