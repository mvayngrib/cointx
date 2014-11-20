var cs = require('coinstring')
var ci = require('coininfo')
var ecdsa = require('ecdsa')
var scripts = require('../../').scripts
var Script = require('../../').Script
var Transaction = require('../../').Transaction

function addressToOutputScript(address) {
  var pubKeyHash = cs.decode(address, ci('BTC-TEST').versions.public)
  return scripts.pubKeyHashOutput(new Buffer(pubKeyHash, 'hex'))
}

function sign(tx, index, keyPair) {
  var prevOutScript = scripts.pubKeyHashOutput(keyPair.publicHash)
  var hash = tx.hashForSignature(index, prevOutScript, Transaction.SIGHASH_ALL)
  var signature = ecdsa.serializeSig(ecdsa.sign(new Buffer(hash), keyPair.privateKey))
  signature.push(Transaction.SIGHASH_ALL)
  tx.setInputScript(index, Script.fromChunks([new Buffer(signature), keyPair.publicKey]))
}

module.exports = {
  addressToOutputScript: addressToOutputScript,
  sign: sign
}