// Generated from Grammar19.g4 by ANTLR 4.9
// jshint ignore: start
import antlr4 from 'antlr4';



const serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786",
    "\u5964\u0002\u0004\u000b\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003",
    "\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0002\u0002\u0004\u0003",
    "\u0003\u0005\u0004\u0003\u0002\u0002\u0002\n\u0002\u0003\u0003\u0002",
    "\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0003\u0007\u0003\u0002",
    "\u0002\u0002\u0005\t\u0003\u0002\u0002\u0002\u0007\b\u0007c\u0002\u0002",
    "\b\u0004\u0003\u0002\u0002\u0002\t\n\u0007d\u0002\u0002\n\u0006\u0003",
    "\u0002\u0002\u0002\u0003\u0002\u0002"].join("");


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class Grammar19Lexer extends antlr4.Lexer {

    static grammarFileName = "Grammar19.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'a'", "'b'" ];
	static symbolicNames = [  ];
	static ruleNames = [ "T__0", "T__1" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    get atn() {
        return atn;
    }
}

Grammar19Lexer.EOF = antlr4.Token.EOF;
Grammar19Lexer.T__0 = 1;
Grammar19Lexer.T__1 = 2;



