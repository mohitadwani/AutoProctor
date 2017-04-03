'use strict';
(function() {
    angular.module('indexApp', []);
    angular.module('indexApp').controller('indexCtrl', function() {
        var vm = this;
        vm.hello = "asdjhfbsdhjf";

        var mediaSource = new MediaSource();
        var video = document.querySelector('video');
        var isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';
        var constraints = {
            audio: true,
            video: true
        };

		if (!isSecureOrigin) {
            alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' + '\n\nChanging protocol to HTTPS');
            location.protocol = 'HTTPS';
        }
        mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

        function handleSourceOpen(event) {
            console.log('MediaSource opened');
            sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
            console.log('Source buffer: ', sourceBuffer);
        }

        function handleSuccess(stream) {
            // recordButton.disabled = false;
            console.log('getUserMedia() got stream: ', stream);
            window.stream = stream;
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else {
                video.src = stream;
            }
        }

        function handleError(error) {
            console.log('navigator.getUserMedia error: ', error);
        }
    });
})();
