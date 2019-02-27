// Copyright (c) 2018, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const request = require('request-promise-native')
const util = require('util')

var QwertyCoindRPC = function (opts) {
  opts = opts || {}
  if (!(this instanceof QwertyCoindRPC)) return new QwertyCoindRPC(opts)
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 8197
  this.timeout = opts.timeout || 2000
  this.ssl = opts.ssl || false
}

QwertyCoindRPC.prototype.getBlocks = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.height) return reject(new Error('must specify height'))

    this._post('f_blocks_list_json', {
      height: opts.height
    }).then((result) => {
      return resolve(result.blocks)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlock = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('f_block_json', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result.block)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('f_transaction_json', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getTransactionPool = function () {
  return new Promise((resolve, reject) => {
    this._post('f_on_transactions_pool_json').then((result) => {
      return resolve(result.transactions)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlockCount = function () {
  return new Promise((resolve, reject) => {
    this._post('getblockcount').then((result) => {
      return resolve(result.count)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlockHash = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.height) return reject(new Error('must specify height'))

    this._post('on_getblockhash', [
      opts.height
    ]).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlockTemplate = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.reserveSize) return reject(new Error('must specify reserveSize'))
    if (!opts.walletAddress) return reject(new Error('must specify walletAddress'))

    this._post('getblocktemplate', {
      reserve_size: opts.reserveSize,
      wallet_address: opts.walletAddress
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.submitBlock = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.blockBlob) return reject(new Error('must specify blockBlob'))
    this._post('submitblock', [
      opts.blockBlob
    ]).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getLastBlockHeader = function () {
  return new Promise((resolve, reject) => {
    this._post('getlastblockheader').then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlockHeaderByHash = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('getblockheaderbyhash', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getBlockHeaderByHeight = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.height) return reject(new Error('must specify height'))

    this._post('getblockheaderbyheight', {
      height: opts.height
    }).then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getCurrencyId = function () {
  return new Promise((resolve, reject) => {
    this._post('getcurrencyid').then((result) => {
      return resolve(result.currency_id_blob)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getHeight = function () {
  return this.height()
}

QwertyCoindRPC.prototype.height = function () {
  return new Promise((resolve, reject) => {
    this._get('getheight').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getInfo = function () {
  return this.info()
}

QwertyCoindRPC.prototype.info = function () {
  return new Promise((resolve, reject) => {
    this._get('getinfo').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.feeInfo = function () {
  return this.fee()
}

QwertyCoindRPC.prototype.fee = function () {
  return new Promise((resolve, reject) => {
    return reject(new Error('Not implemented'))
  })
}

QwertyCoindRPC.prototype.getTransactions = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hashes) return reject(new Error('must specify transaction hashes'))

    this._rawPost('gettransactions', {
      txs_hashes: opts.hashes
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.getPeers = function () {
  return this.peers()
}

QwertyCoindRPC.prototype.peers = function () {
  return new Promise((resolve, reject) => {
    this._get('getpeers').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype.sendRawTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    return reject(new Error('Not implemented'))
  })
}

QwertyCoindRPC.prototype._get = function (method) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('no method supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, method),
      method: 'GET',
      json: true,
      timeout: this.timeout
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype._post = function (method, params) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('no method supplied'))
    params = params || {}

    var body = {
      jsonrpc: '2.0',
      method: method,
      params: params
    }

    this._rawPost('json_rpc', body).then((result) => {
      if (!result.error) {
        return resolve(result.result)
      } else {
        return reject(result.error.message)
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}

QwertyCoindRPC.prototype._rawPost = function (endpoint, body) {
  return new Promise((resolve, reject) => {
    if (endpoint.length === 0) return reject(new Error('no endpoint supplied'))
    if (body === undefined) return reject(new Error('no body supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, endpoint),
      method: 'POST',
      body: body,
      json: true,
      timeout: this.timeout
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

module.exports = QwertyCoindRPC
