'use strict';
(function() {
    angular.module('indexApp', []);
    angular.module('indexApp').controller('indexCtrl', function() {
        var vm = this;
        var mediaSource = new MediaSource();
        var isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';
        /*var constraints = { // constraints for webrtc
            audio: true,
            video: true
        };*/
        var constraints = {
            video: {
                // mozMediaSource: "screen",
                mediaSource: "screen"
            },
        };
        var video = document.getElementById('video');
        // var canvas = document.getElementById('canvas'); //to draw the face rect
        // var context = canvas.getContext('2d');
        // var trackedObjects = new tracking.ObjectTracker('face');
        // trackedObjects.setInitialScale(3);
        // trackedObjects.setStepSize(2);
        // trackedObjects.setEdgesDensity(0.1);
        // var gui = new dat.GUI(); 

        var handleSourceOpen = handleSourceOpen;
        var handleSuccess = handleSuccess;
        var handleError = handleError;
        var objectOnTrack = objectOnTrack;
        window.onblur = windowOnblur;
        window.onfocus = windowOnfocus;

        // trackedObjects.on('track',objectOnTrack);
        /*Shows a control to change the three settings*/
        // gui.add(trackedObjects, 'edgesDensity', 0.1, 0.5).step(0.01);
        // gui.add(trackedObjects, 'initialScale', 1.0, 10.0).step(0.1);
        // gui.add(trackedObjects, 'stepSize', 1, 5).step(0.1);

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
            // tracking.track('#video', trackedObjects, { camera: true });
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

        function windowOnblur() {
            // console.log('window on blur');
        }

        function windowOnfocus() {
            // console.log('window on focus');
        }

        function objectOnTrack(event) {
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
        }
    });
})();
