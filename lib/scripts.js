var assert = require('assert')
var Script = require('./script')
var ops = require('./opcodes')

// {signature} {pubKey}
function pubKeyHashInput(signature, pubKey) {
  assert(Buffer.isBuffer(signature))

  return Script.fromChunks([signature, pubKey.toBuffer()])
}

function pubKeyHashOutput(hash) {
  assert(Buffer.isBuffer(hash))

  return Script.fromChunks([
    ops.OP_DUP,
    ops.OP_HASH160,
    hash,
    ops.OP_EQUALVERIFY,
    ops.OP_CHECKSIG
  ])
}

function nullDataOutput(data) {
  assert(Buffer.isBuffer(data))

  return Script.fromChunks([
    ops.OP_RETURN,
    data
  ])
}

module.exports = {
  pubKeyHashInput: pubKeyHashInput,
  pubKeyHashOutput: pubKeyHashOutput,
  nullDataOutput: nullDataOutput
}
