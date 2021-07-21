![gif of mask detection](twiliovideomask.gif)
<ol>
<li>Make a Twilio video application ie <a href = "https://www.twilio.com/blog/build-a-video-app-javascript-twilio-cli-quickly" target="_blank">this one in 9 minutes</a></li>

<li>All the <a href = "https://ml5js.org/" target="_blank">ml5.js</a>code is in <em>assets/index.js</em>. ml5.js is a handy ML library in the browser built on top of TensorFlow.js which does most of the heavy-lifting and low-level tasks with regard to ML. The <em>Assets</em> folder also has the model I trained to recognize myself wearing a mask or not. </li>
</ol>

In ML, there are two popular tasks: classification and regression. This project explores the classification problem: given an input of an image, the machine classifies the class/category of an image.

This project uses the [pre-trained model](https://youtu.be/yNkAuWz5lnY?t=33)[MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) to recognize the content of certain images.

This project also uses Feature Extractor, which utilizes the last layer of a neural network, mapping it to the new classes/categories (ie. a person wearing a mask or not). With Feature Extractor, we don’t need to care much about how the model should be trained, the hyperparameters should be adjusted, etc: this is Transfer Learning, which ml5 makes easy for us.

### Code
Commented-out code in `assets/video.html` adds labels and buttons so the user can add images to the ML model: the first category is for no mask, the second is for having a mask. There's also a `train` button to train the model once you've added enough data, and a `save` button to save the model for later if you'd like. Lastly, there is a button to begin detecting/running the model so it is not done automatically. This code is commented-out because I already made and trained a model that the app can use--comment out the code if you want to train your own model with your own face!

`assets/index.js` gets the video source from the Twilio Video feed, makes a FeatureExtractor object from the MobileNet model, and from that FeatureExtractor object, we make a Classification object with the video element as input source. With ml5, `classifier.addImage('no')` adds no-mask images, and `classifier.addImage('yes')` adds mask images to the training set so the model will recognize a video image of you wearing a mask from video frames and not just static images. (This code is currently commented out because I saved a model I trained once, I will edit the code to have multiple forks but I had git issues.)

After clicking the `train` button, the screen shows the `lossValue` which decreases to eventually reach zero: the lower the loss, the more accurate the model is, and training is done when `lossValue` is null.

If the trained model is good at detecting mask or no mask, you can use `featureExtractor.save()` saves the model and can be loaded next time with `featureExtractor.load('model.json')`. 
