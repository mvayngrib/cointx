var assert = require('assert')
var CoinKey = require('coinkey')
var Transaction = require('../').Transaction
var txUtils = require('./lib/txutils')

describe('description', function() {
  it('should', function() {
    var txHex = "010000000169cbba1722608074e0600c1738b809e6630aec8d4a544fb76127b5d03ca52a65010000006b483045022100ce96756aed0432873b6b3b1dae450f3f5d08233408d0e7992a42b31714193da702200e7e58e4b77a843031312f88ea2a10a846be7da4c554f060d5be7c1056377024012102f37bff81542809fea71e75f1f21b1985c1338687ade277c898e70832a154440fffffffff02404b4c00000000001976a9146e018d22eb8aa16a5314453c27c90bbe4d1e888b88ac10037d01000000001976a914b07008378a22d1203bc45bbbfb2a27757231c1d088ac00000000"
    var receiverAddress = "mqYcUwd2N3Er9ckDR1ReJRB2WMqv9isM4v"
    var amountBits = 50000
    var amountSatoshis = amountBits * 100
    var feeSatoshis = 10000 //100 bits

    var walletData = {
      "privateKey": "cUvkjZWCDrawsNvcmoh2mZ1Br3gXh9P4pQfCMo9jDVGQkHCUWC1o",
      "address": "mwbsRwdjkWNZYc3WhXi4Y6U4yB9xj2GJzd"
    }

    var unspents = [
      {
        "confirmations": 137,
        "blockHeight": 309256,
        "txHash": "652aa53cd0b52761b74f544a8dec0a63e609b838170c60e07480602217bacb69",
        "index": 1,
        "scriptPubKey": "76a914b07008378a22d1203bc45bbbfb2a27757231c1d088ac",
        "type": "pubkeyhash",
        "value": 29980000,
        "hash160": "b07008378a22d1203bc45bbbfb2a27757231c1d0",
        "address": "mwbsRwdjkWNZYc3WhXi4Y6U4yB9xj2GJzd"
      }
    ]

    var key = new CoinKey.fromWif(walletData.privateKey)
    var walletBalance = unspents.reduce(function(amount, unspent) { return unspent.value + amount }, 0)
    var tx = new Transaction()

    unspents.forEach(function(unspent) {
      tx.addInput(unspent.txHash, unspent.index)
    })
      
    tx.addOutput(txUtils.addressToOutputScript(receiverAddress), amountSatoshis)
    tx.addOutput(txUtils.addressToOutputScript(walletData.address), walletBalance - amountSatoshis - feeSatoshis)

    tx.ins.forEach(function(input, index) {
      txUtils.sign(tx, index, key)
    })

    assert.strictEqual(tx.toHex(), txHex)
  })
})
