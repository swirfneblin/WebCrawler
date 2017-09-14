"use strict"

var fs = require('fs')
var _ = require('lodash')
var download = require('download')

var _root = './content/'
var _books = require('./bookinfos.json')

var _total = 0
var _loaded = 0

var unlink = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        unlink(filePath);
    }

  if(_root != dirPath.toString())
    fs.rmdirSync(dirPath);
}

function start(){

    try{
        unlink(_root)
         _total = _books.length

        _.forEach(_books.slice(0,50), function(book) {
           
        	download(book.directlink).then(data => {
              _loaded++
              console.log('Coletando informações %s % ...', ((_loaded/_total)*100).toFixed(2).toString())
					    fs.writeFileSync(_root + book.category + "/"+ book.bookname, data);
					})
        })
    }catch(e){
        console.log('start() - erro!')
        throw e
    }
}

start()

