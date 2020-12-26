import { l, load } from './helpers.js';
import R from 'ramda';

import antlr4 from 'antlr4'
import Grammar19Lexer from './Grammar19Lexer.js'
import Grammar19Parser from './Grammar19Parser.js'
import Grammar19Listener from './Grammar19Listener.js'

const errorListener = {
    syntaxError: () => {throw Error},
    reportAmbiguity: () => {throw Error},
    reportAttemptingFullContext: () => {throw Error},
    reportContextSensitivity: () => {throw Error},
}

async function main() {
  const [rules, input] = await load('19-1.txt', '\n\n')
  const strings = input.split('\n')

  let validCount = 0;
  for (const input of strings) {
    const chars = new antlr4.InputStream(input)
    const lexer = new Grammar19Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new Grammar19Parser(tokens)
    parser.buildParseTrees = true;
    parser.addErrorListener(errorListener)

    try {
      const tree = parser.a0();
      if (tree.stop.stop === input.length - 1) {
        validCount += 1;
      }
    } catch {
    }
  }
  console.log("valid: ", validCount);
}

main();