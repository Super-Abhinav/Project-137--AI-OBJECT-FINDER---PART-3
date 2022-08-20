Status = "";
objects = [];

function setup() {
    canvas = createCanvas(450,400);
    canvas.center();
    canvas.position(550,330);

    video = createCapture(VIDEO);
    video.size(450,400);
    video.hide();
}

function start() {
    objectDetector = ml5.objectDetector('cocossd',modelLoaded);
    document.getElementById("status").innerHTML = "Status : Objects Detecting";

    object_name = document.getElementById("input_id").value;
}

function modelLoaded() {
    console.log("Model Loaded!");
    Status = true;
}

function draw() {
    image(video, 0, 0, 450, 400);
    if(Status != ""){
        objectDetector.detect(video, gotResults);
        for(i = 0;i < objects.length;i++){
            document.getElementById("status").innerHTML = "Status : Object Detected";
            console.log(objects.length);
            fill("#ff0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%",objects[i].x + 15,objects[i].y + 15);
            noFill();
            stroke("#ff0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == object_name){
                video.stop();
                objectDetector.detect(gotResults);
                document.getElementById("object_found").innerHTML = object_name+" Found";
                var synth = window.speechSynthesis;
                var utterThis = new SpeechSynthesisUtterance(object_name + "Found");
                synth.speak(utterThis);
                synth.stop();
            }
            else{
                document.getElementById("object_found").innerHTML = object_name + " Not Found";
            }
        }
    }
}

function gotResults(error,results){
    if(error){
        console.error(error);
    }
    else{
        console.log(results);
        objects = results;
    }
}