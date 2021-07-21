(() => {
    'use strict';
    const TWILIO_DOMAIN = location.host; //unique to user, will be website to visit for video app
    const ROOM_NAME = 'mask';
    const Video = Twilio.Video;
    let videoRoom, localStream;
    const video = document.getElementById("video");
    const noMaskButton = document.getElementById('noMaskButton');
    const maskButton = document.getElementById('maskButton');
    const incorrectMaskButton = document.getElementById('incorrectMaskButton');
    const amountOfLabel1Images = document.getElementById('numNoMaskImages');
    const amountOfLabel2Images = document.getElementById('numMaskImages');
    const amountOfLabel3Images = document.getElementById('numIncorrectMaskImages');
    const train = document.getElementById('train');
    const loss = document.getElementById('loss');
    const resSpan = document.getElementById('result');
    const conf = document.getElementById('confidence');
    const predictButton = document.getElementById('predict');
    const saveModelButton = document.getElementById('save');
    let classifier = null;
    let featureExtractor = ml5.featureExtractor('MobileNet'); 
    let totalLoss;
    // preview screen
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(vid => {
        video.srcObject = vid;
        localStream = vid;
    })
    // buttons
    const joinRoomButton = document.getElementById("button-join");
    const leaveRoomButton = document.getElementById("button-leave");
    var site = `https://${TWILIO_DOMAIN}/video-token`;
    console.log(`site ${site}`);
    joinRoomButton.onclick = () => {
        featureExtractor.load('model.json')
        // get access token
        axios.get(`https://${TWILIO_DOMAIN}/video-token`).then(async (body) => {
            const token = body.data.token;
            console.log(token);
            //connect to room
            Video.connect(token, { name: ROOM_NAME }).then((room) => {
                console.log(`Connected to Room ${room.name}`);
                videoRoom = room;

                room.participants.forEach(participantConnected);
                room.on("participantConnected", participantConnected);

                room.on("participantDisconnected", participantDisconnected);
                room.once("disconnected", (error) =>
                    room.participants.forEach(participantDisconnected)
                );
                joinRoomButton.disabled = true;
                leaveRoomButton.disabled = false;
                classifier = featureExtractor.classification(video);
                //buttons for when you need to build the model
                //no mask
                noMaskButton.onclick = () => { 
                    classifier.addImage('no');
                    amountOfLabel1Images.innerText = Number(amountOfLabel1Images.innerText) + 1;
                };
                maskButton.onclick = () => { //mask
                    classifier.addImage('yes');
                    amountOfLabel2Images.innerText = Number(amountOfLabel2Images.innerText) + 1;
                };
                incorrectMaskButton.onclick = () => { //incorrect mask
                    classifier.addImage('incorrect');
                    amountOfLabel3Images.innerText = Number(amountOfLabel3Images.innerText) + 1;
                };
                train.onclick = () => {
                    classifier.train((lossValue) => {
                        if (lossValue) {
                            totalLoss = lossValue;
                            loss.innerHTML = `Loss: ${totalLoss}`;
                        } 
                        else {
                            loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
                        }
                    });
                    //console.log(classifier);
                };
                const resultsFunc = (err, res) => {
                    if (err) {
                        console.error(err);
                    } 
                    else if (res && res[0]) {
                        resSpan.innerText = res[0].label;
                        conf.innerText = res[0].confidence;
                        classifier.classify(resultsFunc); // recall the classify function again
                        //console.dir(classifier);
                    }
                }
                predictButton.onclick = () => {
                    classifier.classify(resultsFunc);
                };
                saveModelButton.onclick = () => {
                    featureExtractor.save();
                }
            });
        });
    };
    // leave room
    leaveRoomButton.onclick = () => {
        videoRoom.disconnect();
        console.log(`Disconnected from Room ${videoRoom.name}`);
        joinRoomButton.disabled = false;
        leaveRoomButton.disabled = true;
    };
})();

// connect participant
const participantConnected = (participant) => {
    console.log(`Participant ${participant.identity} connected'`);

    const div = document.createElement('div'); //create div for new participant
    div.id = participant.sid;

    participant.on('trackSubscribed', track => trackSubscribed(div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);
  
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);
      }
    });
    document.body.appendChild(div);
}

const participantDisconnected = (participant) => {
    console.log(`Participant ${participant.identity} disconnected.`);
    document.getElementById(participant.sid).remove();
}

const trackSubscribed = (div, track) => {
    div.appendChild(track.attach());
}

const trackUnsubscribed = (track) => {
    track.detach().forEach(element => element.remove());
}
