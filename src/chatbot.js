// SPDX-License-Identifier: MIT

"use strict";

const rulesBased = require("./rules.js");

class Chatbot {
    constructor(rulesFile, history, previousAnswer) {
        this.rulesBased = new rulesBased.RulesBased(rulesFile, history, previousAnswer);  
    }

    emptyReply(reply)   {   
        const empotyReply = ((reply === "") || (reply === undefined));
        return empotyReply;
    }

    async process(input) {  
        const reply = await this.rulesBased.process(input);

        return reply;
    }  

    async getState() {
        const endingState = this.rulesBased.getState();

        return endingState;
    }

    async getLastReply() {
        const lastReply = this.rulesBased.getLastReply();

        return lastReply;
    }
};

exports.Chatbot = Chatbot;