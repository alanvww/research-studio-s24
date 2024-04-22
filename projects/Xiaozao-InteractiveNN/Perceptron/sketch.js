// Neural Networks
let perceptron;
let lr = 0.1;

// data field
let current_class = 'A';
let dataField;
let data_points = [];

// error field
let errorArr = [];
let trainCount = 0;

// interactive buttons
let AButton, BButton, stepButton, tweakButton;

// currently focusing on...
let highlighted; // data point
let selected_node;

let step_currentState = 0; // 0, 1, 2, 3, 4
  
  
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    perceptron = new Perceptron(2, 500, windowHeight/2);
    dataField = new DataField(100, windowHeight/2-100, 200, 200);
    AButton = new Button(100, windowHeight/2-120, 40, 20, 'A');
    BButton = new Button(140, windowHeight/2-120, 40, 20, 'B');
    stepButton = new Button(440, 250, 50, 25, 'Step');
    tweakButton = new Button(500, 250, 50, 25, 'Tweak');
    
}

function draw() {
    background(255);
    reactToHover();

    perceptron.draw();

    dataField.draw();
    for (let i = 0; i < data_points.length; i ++) {
        data_points[i].drawIn(dataField);
    }
    if (highlighted) {
        highlighted.highlightIn(dataField);
    }

    // TODO: selected node

    AButton.drawButton();
    BButton.drawButton();
    stepButton.drawButton();
    tweakButton.drawButton();

    // tentative error field
    noFill();
    stroke(0);
    rect(700, windowHeight/2-100, 200, 200);
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    text(`lr: ${lr}`, 700, windowHeight/2+120);
    drawError();


}


function drawError() {
    let gap = 200 / errorArr.length;
    beginShape();
    noFill();
    stroke(0);
    strokeWeight(1);
    for (let i = 0; i < errorArr.length; i++) {
        let x = 700 + i * gap;
        let y = (windowHeight/2+100) - abs(errorArr[i]) * 200;
        vertex(x, y);
    }
    endShape();
}


function reactToHover() {
    if (AButton.isUnder(mouseX, mouseY)) {
        AButton.highlighted = true;
    } else {
        AButton.highlighted = false;
    }

    if (BButton.isUnder(mouseX, mouseY)) {
        BButton.highlighted = true;
    } else {
        BButton.highlighted = false;
    }
}

function mousePressed() {


    if (dataField.isUnder(mouseX, mouseY)) {
        let label = current_class === 'A' ? 1 : 0;
        let dataPoint = new DataPoint(dataField, mouseX, mouseY, label);
        data_points.push(dataPoint);
        console.log(data_points);
    }



    if (AButton.isUnder(mouseX, mouseY)) {
        current_class = 'A';
        console.log(`Current class: ${current_class}`);

    }

    if (BButton.isUnder(mouseX, mouseY)) {
        current_class = 'B';
        console.log(`Current class: ${current_class}`);
    }

    if (stepButton.isUnder(mouseX, mouseY)) {
        console.log(`Current state: ${step_currentState}`);
        if (step_currentState == 0) {
            let idx = Math.floor(Math.random() * data_points.length);
            highlighted = data_points[idx];
            dataField.drawDataInfo(data_points[idx]);
            perceptron.currentData = data_points[idx];
            perceptron.state = 0;
        } else {
            perceptron.proceed(step_currentState, highlighted);
        }

        step_currentState += 1;
        if (step_currentState > 3) {
            step_currentState = 0;
        }

    }

    if (tweakButton.isUnder(mouseX, mouseY)) {
        console.log('Tweak');
        perceptron.train();
    }

}

function keyPressed() {
    if (keyCode == ENTER) {
        if (data_points.length > 0) {
            if (errorArr.length < 150) {
            setInterval(train, 1);
            trainCount = 0;
            console.log('Finished training');
            }
    }
}


function train() {
        // console.log('Train one');
        trainCount += 1;
        if (trainCount < 10) {
            let idx = Math.floor(Math.random() * data_points.length);
            perceptron.currentData = data_points[idx];
            perceptron.feedforward(data_points[idx]);
        }
    

       
    }
}