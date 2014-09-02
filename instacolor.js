'use strict'

var fs = require('fs')
var request = require('request')
var _ = require('lodash')
var gm = require('gm')
var color = require('onecolor')
var util = require('util')

var options = {
  url : 'https://api.instagram.com/v1/users/1482797532/media/recent',
  qs : {
    client_id : '370eb8cb9ec547f7b6f556af684ea93d'
  }
}

request.get(options, function (err, res) {
  var latestImage = _.first(JSON.parse(res.body).data)
  gm(latestImage.images.thumbnail.url)
  .setFormat('ppm')
  .resize(1, 1)  
  .toBuffer(function (err, buffer) {    
    var r = buffer.readUInt8(buffer.length - 3)
    var g = buffer.readUInt8(buffer.length - 2)
    var b = buffer.readUInt8(buffer.length - 1)    
 
    var hexVal = color(util.format('rgb(%s, %s, %s)', r, g, b)).hex()    

    request({
      url : 'http://10.0.1.19:8088/image',
      qs : {
        color : hexVal
      }
    }, function (err, res) {
      console.log(util.format('Sent color %s!', hexVal))
    })
  })
  
})
