// SPDX-License-Identifier: MIT

"use strict";

const fs = require("fs");
const readline = require("readline");

const chatbot = require("./chatbot.js");

const rulesFile = "./rules/rules.aiml";
const brainFile = "./brain.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getInput() {
  const inputString = await new Promise((resolve, reject) => {
    rl.question(`> `, (inputString) => {
      resolve(inputString);
    });
  });
  
  return inputString;
}

const isExitString = function (input) {
  const inputLowerCase = input.toLowerCase();

  if (inputLowerCase === "quit") {
    return true;
  } else if (inputLowerCase === "exit") {
    return true;
  }

  return false;
};

function loadHistory(brainFile) {
  if (fs.existsSync(brainFile)) {
    const rawdata = fs.readFileSync(brainFile);
    
    const history = JSON.parse(rawdata);
    let previousAnswer = "";

    if (history["previous-answer"] !== undefined) {
      previousAnswer = history["previous-answer"];
      delete history["previous-answer"];
    }

    return {history, previousAnswer};
  }

  const history = {};
  const previousAnswer = "";
  return {history, previousAnswer};
}

function saveHistory(brainFile, history, previousAnswer) {
  const stateToSave = history;
  stateToSave["previous-answer"] = previousAnswer;
  const data = JSON.stringify(stateToSave);

  fs.writeFileSync(brainFile, data);
}

async function main() {
  console.log("\n Use 'quit' or 'exit' to leave the bot\n");

  const {history, previousAnswer} = loadHistory(brainFile);
  let bot = new chatbot.Chatbot(rulesFile, history, previousAnswer);

  let done = false;
  while (!done) {
    const input = await getInput();

    done = isExitString(input);

    if (!done) {
      const response = await bot.process(input);

      console.log(response);
    }
  }

  const endingState = await bot.getState() ;
  const lastReply = await bot.getLastReply();
  saveHistory(brainFile, endingState, lastReply)

  rl.close();
}

main();
