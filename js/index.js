(function() {
    angular.module('indexApp', []);
    angular.module('indexApp').controller('indexCtrl', function() {
        var vm = this;
        /*WebRTC related variables*/
        var video = document.getElementById('video');
        var isSecureOrigin;
        var constraints = { // constraints for webrtc
            audio: true,
            video: true
        };
        // var constraints = {
        //     video: {
        //         mozMediaSource: "screen",
        //         mediaSource: "screen"
        //     },
        // };
        var recordedBlobs;
        var mediaRecorder;
        /*Head tracker related variables*/
        var canvas = document.getElementById('canvas'); //to draw the face rect
        var context = canvas.getContext('2d');
        var trackedObjects = new tracking.ObjectTracker('face');
        // var gui = new dat.GUI();
        /*Screen related variables*/
        var screen = new Screen();
        var screenVideoElem = document.getElementById('screen');

        vm.startRecording = startRecording;
        vm.stopRecording = stopRecording;
        vm.download = download;

        var init = init;
        /*WebRTC related functions*/
        var handleSourceOpen = handleSourceOpen;
        var handleSuccess = handleSuccess;
        var handleError = handleError;
        var handleStop = handleStop;
        var handleDataAvailable = handleDataAvailable;

        var objectOnTrack = objectOnTrack; // head track listenes
        window.onblur = windowOnblur;
        window.onfocus = windowOnfocus;

        init();

        function init() {
            isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';
            if (!isSecureOrigin) {
                alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' + '\n\nChanging protocol to HTTPS');
                location.protocol = 'HTTPS';
            }
            // mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
            navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

            trackedObjects.on('track', objectOnTrack);
            trackedObjects.setInitialScale(1);
            trackedObjects.setStepSize(2);
            trackedObjects.setEdgesDensity(0.1);

            /*Shows a control to change the three settings for head tracker*/
            // gui.add(trackedObjects, 'edgesDensity', 0.1, 0.5).step(0.01);
            // gui.add(trackedObjects, 'initialScale', 1.0, 10.0).step(0.1);
            // gui.add(trackedObjects, 'stepSize', 1, 5).step(0.1);

            screen.onaddstream = function(e) {
                screenVideoElem.src = e.stream;
                if (window.URL) {
                    screenVideoElem.src = window.URL.createObjectURL(e.stream);
                } else {
                    screenVideoElem.src = e.stream;
                }
            };
            screen.check();
            screen.share();
        }

        function handleSourceOpen(event) {
            console.log('MediaSource opened');
            sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
            console.log('Source buffer: ', sourceBuffer);
        }

        function handleSuccess(stream) {
            console.log('getUserMedia() got stream: ', stream);
            tracking.track('#video', trackedObjects, { camera: true });
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

        function startRecording() {
            recordedBlobs = [];
            var options = { mimeType: 'video/webm;codecs=vp9' };
            try {
                mediaRecorder = new MediaRecorder(window.stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder: ' + e);
                alert('Exception while creating MediaRecorder: ' + e + '. mimeType: ' + options.mimeType);
                return;
            }
            mediaRecorder.onstop = handleStop;
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start(10); // collect 10ms of data
            console.log('recording started');
        }

        function handleStop(event) {

        }

        function handleDataAvailable(event) {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        function stopRecording() {
            mediaRecorder.stop();
            console.log('Recorded Blobs: ', recordedBlobs);
            // recordedVideo.controls = true;
        }

        function download() {
            var blob = new Blob(recordedBlobs, { type: 'video/webm' });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'test.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        }
    });
})();
