1. Make a Twilio video application (ie [this one in 9 minutes](https://www.twilio.com/blog/build-a-video-app-javascript-twilio-cli-quickly))

2.All the [ml5](https://twitter.com/ml5js) code is in 'assets/index.js'. ml5.js is the ML  library in the browser. It is built on top of tensorflow.js which does all the heavy-lifting or low-level tasks with regard to ML. 'Assets' also has the model I trained to recognize myself wearing a mask or not. 

In ML, there are two popular tasks: classification and regression. This project explores the classification problem: given an input of an image, the machine classifies the class/category of an image.

This project uses a [pre-trained model](https://youtu.be/yNkAuWz5lnY?t=33) called [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)  trained to recognize the content of certain images.

This will use Feature Extractor:we use the last layer of a neural network, mapping it to the new classes/categories (ie. a person wearing a mask or not). With Feature Extractor, we don’t need  to care much about how the model should be trained, the hyperparameters should be adjusted, etc: this is Transfer Learning, which ml5 makes easy for us.

### Code
Commented code in `assets/video.html` adds labels and buttons so the user can add images to the ML model: the first category is for no mask, the second is for having a mask. There's also a `train` button to train the model once you've added enough data, and a `save` button to save the model for later if you'd like. Lastly, there is a button to begin detecting/running the model so it is not done automatically.

`assets/index.js` gets the video source from the Twilio Video feed, makes a FeatureExtractor object from the MobileNet model, and from that FeatureExtractor object, we make a Classification object with the video element as input source. With ml5, `classifier.addImage('no')` adds no-mask images, and `classifier.addImage('yes') adds mask images to the training set so the model will recognize a video image of you wearing a mask from video frames and not just static images. (This code is currently commented out because I saved a model I trained once, I will edit the code to have multiple forks but I had git issues.)

After clicking the `train` button, the screen shows the `lossValue` which decreases to eventually reach zero: the lower the loss, the more accurate the model is, and training is done when `lossValue` is null.

If the trained model is good, `featureExtractor.save()` saves the model and can be loaded next time with `featureExtractor.load('model.json')`. 
