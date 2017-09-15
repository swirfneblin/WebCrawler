"use strict"

var fs = require('fs')
var _ = require('lodash')
var download = require('download')
var request = require('request')
var http = require('https')
var Crawler = require("crawler")

var _root = './content/'
var _books = require('./bookinfos.json')

var _total = 0
var _loaded = 0

var c = new Crawler({
  maxConnections : 10,
  callback : function (error, res, done) {
        
      if(error){
          console.log(error);
      }else{
        

        _loaded++
        console.log('Downloading (%s %) => "'+ res.options.filename +'"', ((_loaded/_total)*100).toFixed(2).toString())
        fs.createWriteStream(res.options.filename).write(res.body);

        let pag = res.request.uri.href

        download(pag).then(data => {
            fs.writeFileSync(res.options.filename, data);
        });

      }
      done();
  }
})

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
      
      _books.forEach( function(book) {
        
         if(book.directlink != "/mobi")
          {
            let dir = _root + book.category
            let filename = _root + book.bookname + ".mobi"
            
            c.queue({
                uri: book.directlink,
                filename: filename,
                jQuery: false
            })
          }
      })


    }catch(e){
        console.log('start() - erro!')
        throw e
    }
}

start()