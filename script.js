// open source jeopardy game

// Canvas and context

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const viewPortWidth = getViewportSize().width;
const viewPortHeight = getViewportSize().height;

// Interaction

const ClickOwner = {
    TEXT_BOX: 0,
    PANEL: 1
}

let currentClickOwner = ClickOwner.TEXT_BOX;
let currentBoxClicked = null;

// Screen Metrics

let gameWidth = 1020;
let gameHeight = 880;

// Box Metrics

let boxWidth = 300;
let boxHeight = 130;
let startX = 40;
let startY = 120;
let boxSpacing = 20;

// Panel Metrics

let panelWidth = 800;
let panelHeight = 600;
let panelX = 80;
let panelY = 200;

// Font Metrics

let singleLineFontSize = 50;
let multiLineFontSize = 70;
let headerFontSize = 30;

// Configure Game Metrics

const hardMetrics = {
    gameWidth: 1020,
    gameHeight: 880,
    boxWidth: 300,
    boxHeight: 130,
    startX: 40,
    startY: 120,
    boxSpacing: 20,
    panelWidth: 800,
    panelHeight: 600,
    panelX: 80,
    panelY: 200,
    singleLineFontSize: 50,
    multiLineFontSize: 70,
    headerFontSize: 30
};

function updateMetricsBasedOnScreenSize() {
    const canvasAspectRatio =  hardMetrics.gameHeight / hardMetrics.gameWidth;
    const viewPortAspectRatio = (viewPortWidth / viewPortHeight) / canvasAspectRatio;
    gameWidth = viewPortWidth;
    gameHeight = viewPortWidth * canvasAspectRatio;

    boxWidth = hardMetrics.boxWidth * viewPortAspectRatio;
    boxHeight = hardMetrics.boxHeight * viewPortAspectRatio;

    startX = hardMetrics.startX * viewPortAspectRatio;
    startY = hardMetrics.startY * viewPortAspectRatio;
    boxSpacing = hardMetrics.boxSpacing * viewPortAspectRatio;
    panelWidth = hardMetrics.panelWidth * viewPortAspectRatio;
    panelHeight = hardMetrics.panelHeight * viewPortAspectRatio;
    panelX = hardMetrics.panelX * viewPortAspectRatio;
    panelY = hardMetrics.panelY * viewPortAspectRatio;
    singleLineFontSize = hardMetrics.singleLineFontSize * viewPortAspectRatio;
    multiLineFontSize = hardMetrics.multiLineFontSize * viewPortAspectRatio;
    headerFontSize = hardMetrics.headerFontSize * viewPortAspectRatio;  
}
        

function configureScreen() {
    //updateMetricsBasedOnScreenSize();
    canvas.width = gameWidth;
    canvas.height = gameHeight;    
}

// Colors and Styles

const backgroundColor = "MidnightBlue";
const labelColor = "snow";

const boxValueColor = "Blue";
const boxAnswerColor = "RoyalBlue";
const boxQuestionColor = "DodgerBlue";

const headerColor = "Gold";

const textFontName = "Trebuchet MS";

const headerTextStyle = `${headerFontSize}px ${textFontName}`;
const singleLineTextStyle = `${singleLineFontSize}px ${textFontName}`;
const multiLineTextStyle = `${multiLineFontSize}px ${textFontName}`;

// Game Data

const categories = [ "Best Practices We Do", "Benefits We Love", "Risk That Annoy Us" ];
const answerValues = [ 100, 200, 300, 400, 500 ];
const answers = [
    // Best Practices We Do
    "This is the practice of making your code easily understandable by others, which is crucial for Innersource projects.",
    "These individuals play a key role in Innersource projects by facilitating collaboration between teams and removing roadblocks.",
    "These software development methodologies helps Innersource projects by encouraging collaboration and rapid iteration.",
    "These communication tools allow developers from different teams to collaborate on Innersource projects more effectively.",
    "These practices ensures that code contributions are reviewed by others before they are merged, maintaining code quality.",
    // Benefits We Love
    "These benefits of Innersource allows organizations to save resources by reusing and sharing code.",
    "Innersource projects drives increased code quality with this benefit.",
    "By using Innersource, BUs can reuse tested, proven code to meet business needs",
    "This benefit of Innersource helps to retain and attract skilled developers by fostering a culture of learning and growth.",
    "Innersource can help break down organizational silos and improve this aspect of workplace culture.",
    // Risk That Annoy Us
    "This risk occurs when developers don't have a clear understanding of a library’s purpose or goals.",
    "This risk can arise when teams working on Innersource projects make local changes to a library without sharing their change with the community.",
    "In Innersource projects, this risk can result from teams not agreeing on how to manage code contributions.",
    "If not addressed, these risks can lead to a decline in code quality and increased technical debt in Innersource projects.",
    "Our innersource projects are at risk for being abandoned and unsupported."
];

const questions = [
    // Best Practices We Do
    "What is writing clear and concise documentation and linking it to Backstage?",
    "Who are trusted maintainers, contributors, and community members?",
    "What are Agile, Scrum, and PI Planning?",
    "What are GitHub, Slack, and Backstage?",
    "What are pull requests and code reviews?",
    // Benefits We Love
    "What do well maintained code libraries that solve business problems and can be reused in almost any project give us?",
    "What are more, diverse eyes on every line of code?",
    "What creates more stories per sprint and faster time to market?",
    "What is increased employee satisfaction from collaborating within a community of their peers?",
    "What is cross-business unit sharing, collaboration, and communication?",
    // Risk That Annoy Us
    "What is lack of cleanly designed code that does one thing and does it well?",
    "What are similar libraries with minor incompatible variations?",
    "What is conflict over code ownership and governance?",
    "What is a lack of unit, integration, functional, performance, security, usability, and regression tests?",
    "What happens to innersource without executive leadership commitment and without middle management buy-in?"
];

const BoxDisplayState = {
    SHOWING_VALUE: 0,
    SHOWING_NOTHING: 3
};

const PanelDisplayState = {
    SHOWING_NOTHING: 0,
    SHOWING_ANSWER: 1,
    SHOWING_QUESTION: 2
}

class PanelState {
    constructor(panelDisplayState) {
        this.panelDisplayState = panelDisplayState;

        const gameWidth = startX + (boxWidth + boxSpacing) * (categories.length);
        const gameHeight = startY + (boxSpacing * 4) + (boxHeight + boxSpacing) * (answerValues.length);

        this.x = (gameWidth / 2) - (panelWidth / 2);
        this.y = (gameHeight / 2) - (panelHeight / 2);
        this.width = panelWidth;
        this.height = panelHeight;
    }

    onClick() {
        switch (this.panelDisplayState) {
            case PanelDisplayState.SHOWING_ANSWER:
                this.panelDisplayState = PanelDisplayState.SHOWING_QUESTION;
                currentClickOwner = ClickOwner.PANEL;
                break;
            case PanelDisplayState.SHOWING_QUESTION:
                this.panelDisplayState = PanelDisplayState.SHOWING_NOTHING;
                currentClickOwner = ClickOwner.TEXT_BOX;
                break;
            case PanelDisplayState.SHOWING_NOTHING:
                this.panelDisplayState = PanelDisplayState.SHOWING_NOTHING;
                break;
        }
    }
}

class TextBoxState {
    constructor(boxDisplayState, answerValue, answer, question) {
        this.boxDisplayState = boxDisplayState;

        this.answerValue = answerValue;
        this.answer = answer;
        this.question = question;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    onClick() {
        switch (this.boxDisplayState) {
            case BoxDisplayState.SHOWING_VALUE:
                this.boxDisplayState = BoxDisplayState.SHOWING_NOTHING;
                currentClickOwner = ClickOwner.PANEL;
                panelState.panelDisplayState = PanelDisplayState.SHOWING_ANSWER;
                break;
            case BoxDisplayState.SHOWING_NOTHING:
                this.boxDisplayState = BoxDisplayState.SHOWING_NOTHING;
                break;
           }
    }
}

// Create 15 TextBoxStates, one for each box
const textBoxStates = [];
for (let i = 0; i < 15; i++) {
    textBoxStates.push(new TextBoxState(BoxDisplayState.SHOWING_VALUE, answerValues[i%5], answers[i], questions[i]));
}

// create one PanelState
const panelState = new PanelState(PanelDisplayState.SHOWING_NOTHING);

// Drawing

function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius, color, drawBorder) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);

    // fill
    ctx.fillStyle = color;
    ctx.fill();

    // stroke
    if (drawBorder) {
        ctx.strokeStyle = "Gold";
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

function drawText(ctx, x, y, text, color, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
}

function drawTextCentered(ctx, x, y, text, color, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function drawTextBox(ctx, x, y, width, height, radius, text, color, drawBorder) {

    // draw box
    const boxCenterX = x + width / 2;
    const boxCenterY = y + height / 2;
    drawRoundedRect(ctx, x, y, width, height, radius, color, drawBorder);

    // draw text
    ctx.font = multiLineTextStyle;
    const textWidth = ctx.measureText(text).width;

    if (textWidth > width) {
        ctx.font = multiLineTextStyle;
        const lines = splitStringIntoLines(text, width - 40);
        // draw each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const textHeight = multiLineFontSize;
            const leading = 5
            const textCenterY = (boxCenterY - ((lines.length - 1) * (textHeight / 2)) + (i * (textHeight + leading)));
            drawText(ctx, x + 40, textCenterY, line, labelColor, multiLineTextStyle);
        }
    } else {
        // draw single line
        ctx.font = singleLineTextStyle;
        const textHeight = singleLineFontSize;
        const textCenterY = boxCenterY + textHeight / 2;
        drawTextCentered(ctx, boxCenterX , textCenterY, text, labelColor, singleLineTextStyle);  
    }
}

// text manipulation

function splitStringIntoLines(str, maxLineWidth) {
    const boxTextStyle = multiLineTextStyle;
    ctx.font = boxTextStyle;

    const words = str.split(" ");
    const lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lineWidth = ctx.measureText(line + " " + word).width;
        if (lineWidth <= maxLineWidth) {
            line += word + " ";
        } else {
            lines.push(line);
            line = word + " ";
        }
    }
    lines.push(line);
    return lines;
}

// test splitting a string into lines
//const lines = splitStringIntoLines("This is a test of the emergency broadcast system. This is only a test.", 240);
//console.log(lines);

// Interactivity

function clickedInsideBox(x, y, boxX, boxY, boxWidth, boxHeight) {
    const gotClick =  x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight;
    return gotClick;
}

function getBoxClicked(mouseX, mouseY) {
    for (let i = 0; i < textBoxStates.length; i++) {
        const boxClicked = clickedInsideBox(
            mouseX, 
            mouseY,
            textBoxStates[i].x, 
            textBoxStates[i].y, 
            textBoxStates[i].width, 
            textBoxStates[i].height);
        if (boxClicked) {
            return i;
        }
    }
    return null;
}

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    switch (currentClickOwner) {
        case ClickOwner.TEXT_BOX:
            const boxClicked = getBoxClicked(mouseX, mouseY);
            if (boxClicked === null) {
                return;
            }
            currentBoxClicked = boxClicked;
            textBoxStates[boxClicked].onClick();
            console.log(`Box clicked: ${boxClicked}`);
            break;
        case ClickOwner.PANEL:
            panelState.onClick(mouseX, mouseY);
            break;
        }
  });  

// animation

function update(deltaTime) {
    // TODO: update game state
}

function drawCategories(ctx) {
    // draw a label for each category above the boxes
    for (let i = 0; i < categories.length; i++) {
        drawTextCentered(
            ctx,
            startX + i * (boxWidth + boxSpacing) + boxWidth / 2,
            startY - boxSpacing,
            categories[i],
            headerColor,
            headerTextStyle
        );
    }
}

function drawTextBoxes(ctx) {
    // draw a box for each category and answer value in columns and rows
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < answerValues.length; j++) {
            const textBoxState = textBoxStates[i * answerValues.length + j];

            var boxLabel = "";
            var boxColor = "";
            var drawBorder = false;

            switch (textBoxState.boxDisplayState) {
                case BoxDisplayState.SHOWING_VALUE:
                    boxLabel = textBoxState.answerValue;
                    boxColor = boxValueColor;
                    drawBorder = false;
                    break;
                case BoxDisplayState.SHOWING_NOTHING:
                    boxLabel = "";
                    boxColor = backgroundColor;
                    drawBorder = false;
                    break;
                }
    
            let boxX = startX + i * (boxWidth + boxSpacing);
            let boxY = startY + j * (boxHeight + boxSpacing);

            drawTextBox(
                ctx, 
                boxX, 
                boxY, 
                boxWidth, 
                boxHeight, 
                10,  
                boxLabel,
                boxColor,
                drawBorder
            );

            textBoxState.x = boxX;
            textBoxState.y = boxY;
            textBoxState.width = boxWidth;
            textBoxState.height = boxHeight;
        }
    }    
}

function drawPanel(ctx) {
    // draw panel if there is something to show

    let label = "";
    let color = "RoyalBlue";
    let drawBorder = true;

    switch (panelState.panelDisplayState) {
        case PanelDisplayState.SHOWING_NOTHING:
            return;
        case PanelDisplayState.SHOWING_ANSWER:
            label = textBoxStates[currentBoxClicked].answer;
            color = "rgba(0, 0, 255, 0.80)";
            break;
        case PanelDisplayState.SHOWING_QUESTION:
            label = textBoxStates[currentBoxClicked].question;
            color = "rgba(0, 0, 255, 0.80)";
            break;
    }

    ctx.shadowBlur = 100;
    ctx.shadowColor = "black";

    drawTextBox(
        ctx, 
        panelState.x, 
        panelState.y, 
        panelState.width, 
        panelState.height, 
        10,  
        label,
        color,
        drawBorder
    );

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

}

function render() {
    drawCategories(ctx);
    drawTextBoxes(ctx);
    drawPanel(ctx);
}

function animate(timestamp) {

    // update timing
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // clear canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // update and render
    update(deltaTime);
    render();

    // request next frame
    requestAnimationFrame(animate);
}


// start game

let lastTime = 0;
configureScreen();
animate(0);



