// open source jeopardy game

// Canvas and context

const canvas = document.getElementById("canvas");
canvas.width = 1920;
canvas.height = 1080;

const ctx = canvas.getContext("2d");

// Box Metrics

const boxWidth = 300;
const boxHeight = 130;
const startX = 40;
const startY = 100;
const boxSpacing = 20;

// Colors and Styles

const backgroundColor = "DarkBlue";
const labelColor = "Snow";
const boxColor = "RoyalBlue";
const headerColor = "Gold";

const textFontName = "Trebuchet MS";
const singleLineFontSize = 50;
const multiLineFontSize = 20;
const headerFontSize = 30;

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

class TextBoxState {
    constructor(open, showingAnswer, answered, answerValue, answer, question) {
        this.open = open;
        this.showingAnswer = showingAnswer;
        this.aswered = answered;

        this.answerValue = answerValue;
        this.answer = answer;
        this.question = question;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

// Create 15 TextBoxStates, one for each box
const textBoxStates = [];
for (let i = 0; i < 15; i++) {
    textBoxStates.push(new TextBoxState(false, false, false, answerValues[i%5], answers[i], questions[i]));
}

// Drawing

function drawRoundedRect(ctx, x, y, width, height, radius, color) {
    ctx.fillStyle = color;
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
    ctx.fill();
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

function drawTextBox(ctx, x, y, width, height, radius, text) {

    // draw box
    const boxCenterX = x + width / 2;
    const boxCenterY = y + height / 2;
    drawRoundedRect(ctx, x, y, width, height, radius, boxColor);

    // draw text
    ctx.font = multiLineTextStyle;
    const textWidth = ctx.measureText(text).width;

    if (textWidth > width) {
        ctx.font = multiLineTextStyle;
        const lines = splitStringIntoLines(text, width - 10);
        // draw each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const textHeight = multiLineFontSize;
            const leading = 5
            const textCenterY = (boxCenterY - ((lines.length - 1) * (textHeight / 2)) + (i * (textHeight + leading)));
            drawText(ctx, x + 10, textCenterY, line, labelColor, multiLineTextStyle);
        }
    } else {
        // draw single line
        ctx.font = singleLineTextStyle;
        const textWidth = ctx.measureText(text).width;    
        const textHeight = singleLineFontSize;
        const textCenterY = boxCenterY + textHeight / 2;
        drawTextCentered(ctx, boxCenterX, textCenterY, text, labelColor, singleLineTextStyle);  
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
    return x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight;
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
    const boxClicked = getBoxClicked(mouseX, mouseY);
    console.log(`Box clicked: ${boxClicked}`);
  });  

// animation

function update(deltaTime) {
    // TODO: update game state
}

function render() {
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

    // draw a box for each category and answer value in columns and rows
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < answerValues.length; j++) {
            const textBoxState = textBoxStates[i * answerValues.length + j];

            var boxLabel = "";

            if (textBoxState.open) {
                if (textBoxState.showingAnswer) {
                    boxLabel = textBoxState.answer;
                } else {
                    boxLabel = textBoxState.question;
                }
            } else {
                boxLabel = textBoxState.answerValue;
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
                boxLabel
            );

            textBoxState.x = boxX;
            textBoxState.y = boxY;
            textBoxState.width = boxWidth;
            textBoxState.height = boxHeight;
        }
    }
}

function animate(timestamp) {

    // update timing
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update and render
    update(deltaTime);
    render();

    // request next frame
    requestAnimationFrame(animate);
}

// start game

let lastTime = 0;
animate(0);



