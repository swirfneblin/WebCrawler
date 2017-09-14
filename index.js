"use strict"

require('dotenv').config()

var fs = require('fs')
var Crawler = require('crawler')
var _ = require('lodash')

var _urlbase = process.env.URL_BASE
var _file = 'books.json'
let _links = []

var c = new Crawler({
  maxConnections : 10,
  callback : function (error, res, done) {
  		
      if(error){
          console.log(error);
      }else{
				let pag = res.request.uri.href
        let $ = res.$;
        
        $(".card-block").each((i, el) => { 
        	let linkname = $(el).find('a').attr('href')
        	_links.push(linkname)
        })

        console.log('Links em %s = (%s)', pag, $(".card-block").length)
      }
      done();
  }
})

c.on('drain', saveBookLinks)

function saveBookLinks(){
	try{
		
		if(!_links.length)
			return 

		console.log('total links: %s', _links.length)

		fs.appendFile(_file, JSON.stringify(_links), (e) => {
		  if (e) {
				console.log('append() - erro!')
		  	throw e
		  }
		})

	}catch(e){
		console.log('saveBookLinks() - erro')
		throw e
	}
}

function unlink(){
	try{
		fs.exists(_file, function(e){
			if(e) fs.unlink(_file)
		})
	}catch(e){
		console.log('unlink() - erro!')
		throw e
	}
}

function start(){

	try{
		
		if(_.isEmpty(_urlbase))
			throw new Error("URL base nao definida")

		unlink()

		for(let i = 1; i <= 468; i++){
			let urlactual = _urlbase + "?p="+i
			c.queue(urlactual)
		}		
	}catch(e){
		console.log('start() - erro!')
		throw e
	}
}

// start()