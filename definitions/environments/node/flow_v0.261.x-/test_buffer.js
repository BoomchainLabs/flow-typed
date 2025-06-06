/* @flow */

let boolean: boolean = false;
let buffer: Buffer = new Buffer(0);
let num: number = 0;
let maybeNum: ?number;

// Uint8Array properties. All of these should type check ok.
buffer.length;
buffer.buffer;
buffer.byteOffset;
buffer.byteLength;
buffer[1];

// A few Uint8Array instance methods. All of these should type check ok.
buffer.copyWithin(0, 0);
buffer.copyWithin(0, 0, 0);

const it1: Iterator<[number, number]> = buffer.entries();

boolean = buffer.every((element: number) => false);
boolean = buffer.every((element: number) => false, buffer);

buffer = buffer.fill(1);
buffer = buffer.fill(1, 0, 0);
buffer = buffer.fill("a");
buffer = buffer.fill("a", 0, 0);
buffer = buffer.fill("a", 0, 0, "utf8");
buffer = buffer.fill("a", "utf8");

maybeNum = buffer.find((element: number, index: number, array:Uint8Array) => false);
maybeNum = buffer.find((element: number, index: number, array:Uint8Array) => false, buffer);

num = buffer.findIndex((element: number, index: number, array:Uint8Array) => false);
num = buffer.findIndex((element: number, index: number, array:Uint8Array) => false, buffer);

buffer.forEach((value: number) => console.log(value), buffer);
buffer.forEach((value: number, index:number, array:Uint8Array) => console.log(value), buffer);

boolean = buffer.includes(3);
boolean = buffer.includes(3, 4);

num = buffer.indexOf(3);
num = buffer.indexOf(3, 4);

// static methods
buffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
const typedArray = new Uint8Array([0x34]);
buffer = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
buffer = Buffer.from(new Buffer(0));
buffer = Buffer.from("foo", "utf8");

// This call to from() used to type check ok, but should not. Buffer
// extends Uint8Array but gets rid of this signature to .from(). Understandably,
// flow didn't used to support a subclass hiding a superclass member, so this
// used to check out as ok, even though it is not correct.
// $FlowExpectedError[incompatible-call]
buffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72], (a:number) => a + 1, {}); // error

// Explicitly importing Buffer is rarely needed, but correct.
let ImportedBuffer = require("buffer").Buffer;
buffer = new ImportedBuffer(0);
