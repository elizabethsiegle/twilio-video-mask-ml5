const video = document.getElementById("video");
const resSpan = document.getElementById('result');
const conf = document.getElementById('confidence');
const saveModelButton = document.getElementById('save');
const noMaskButton = document.getElementById('noMaskButton');
const maskButton = document.getElementById('maskButton');
const amountOfLabel1Images = document.getElementById('numNoMaskImages');
const amountOfLabel2Images = document.getElementById('numMaskImages');
const predictButton = document.getElementById('predict');
const featureExtractor = ml5.featureExtractor('MobileNet'); 
const classifier = featureExtractor.classification(video);
let localStream, totalLoss;
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(vid => {
        video.srcObject = vid;
        localStream = vid;
    })
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
                