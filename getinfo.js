"use strict"

var Crawler = require("crawler")
var fs = require("fs")
var _ = require('lodash')

var _books = []
var _format = ["mobi"]

var _total = 0
var _loaded = 0

var c = new Crawler({
  maxConnections : 10,
  callback : function (error, res, done) {
        
      if(error){
          console.log(error);
      }else{
        let pag = res.request.uri.href
        let $ = res.$;
        
        let _category = _.toLower(_.lowerCase($("ol.breadcrumb li:nth-child(2) a").text()))
        let _bookname = _.lowerCase($("div.container  h1").text())
        let _link = $(".mt-2 .btn-group:nth-child(1) .dropdown-menu a:nth-child(3)").attr('href')

        _.forEach(_format, function(format){
            _link = _.replace(_link, '/download/', '/dl/') + "/" + format

            let book = {
                page: pag,
                category: _.isEmpty(_category) ? "geral" : _category,
                directlink: _link,
                bookname: _.isEmpty(_bookname) ? "semnome" : _bookname
            }
            // console.log(book)
            _books.push(book)
        })

        _loaded++
        console.log('Coletando informações %s % ...', ((_loaded/_total)*100).toFixed(2).toString())
      }
      done();
  }
})

c.on('drain', saveBookInfos)

function saveBookInfos(){
  try{
    
    if(!_books.length)
      return 
    
    fs.writeFileSync('bookinfos.json', JSON.stringify(_books));
    
  }catch(e){
    console.log('saveBookInfos() - erro')
    throw e
  }
}


function start(){

    try{
        let _links = require('./books.json')
        _total = _links.length

        _.forEach(_links, function(link) {
            c.queue(link)
        })
    }catch(e){
        console.log('start() - erro!')
        throw e
    }
}

start()