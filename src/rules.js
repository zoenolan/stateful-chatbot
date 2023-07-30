// SPDX-License-Identifier: MIT

"use strict";

const AimlHigh = require("aiml-high");

const findAnswerPromise = (interpreter, ...args) => {
  return new Promise((resolve, reject) => {
    interpreter.findAnswer(...args, (answer, wildCardArray, input) => {
      resolve(answer);
    });
  });
};

class RulesBased {
    constructor(rulesFile, history, previousAnswer) {
      this.interpreter = new AimlHigh({}, history, previousAnswer);
      this.interpreter.loadFiles([rulesFile]);
    }

    async process(input) {  
        const reply = await findAnswerPromise(this.interpreter, input).then((answer) => {
          return answer;
        });
  
        return reply;
    }  
};

exports.RulesBased = RulesBased;