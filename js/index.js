'use strict';
(function() {
    window.onload = function() {
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var trackedObjects = new tracking.ObjectTracker('face');
        // trackedObjects.setInitialScale(3);
        // trackedObjects.setStepSize(2);
        // trackedObjects.setEdgesDensity(0.1);
        trackedObjects.on('track', function(event) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (event.data.length === 0) {
                console.log('Not Detected');
            } else {
                console.log(event.data);
                event.data.forEach(function(rect) {
                    context.strokeStyle = '#a64ceb';
                    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    context.font = '11px Helvetica';
                    context.fillStyle = "#fff";
                    context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                    context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                });
            }
        });
        tracking.track('#video', trackedObjects, { camera: true });
        var gui = new dat.GUI();
        gui.add(trackedObjects, 'edgesDensity', 0.1, 0.5).step(0.01);
        gui.add(trackedObjects, 'initialScale', 1.0, 10.0).step(0.1);
        gui.add(trackedObjects, 'stepSize', 1, 5).step(0.1);
    };
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
