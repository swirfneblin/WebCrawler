"use strict"

"use strict"

var fs = require('fs')
var _ = require('lodash')
var mkdirp = require('mkdirp')
var mv = require('mv')

var _books = require('./bookinfos.json')

function listaCategorias(){
		
		// [ 'diversos',
		// 'romance',
		// 'literatura infanto juvenil',
		// 'policial',
		// 'literatura fantastica',
		// 'suspense e terror',
		// 'aventura',
		// 'religiao',
		// 'direito',
		// 'sociologia',
		// 'ficcao cientifica',
		// 'biografias',
		// 'economia',
		// 'administracao',
		// 'politica',
		// 'ciencias',
		// 'contos e cronicas',
		// 'filosofia',
		// 'poesias',
		// 'geral',
		// 'humor',

 	let categories = []
  _.each(_books, (i) => {
  	categories.push(i.category)
  })
  categories = _.uniq(categories)

	console.log(categories)
}

function listaFiltrados(cat){

	let filtrados = _.filter(_books, { 'category': cat })

  _.each(filtrados, (i) => { 
  	console.log("- ", i.bookname) 
  })
}

function removerFiltrados(){
	let catRemover =  [ 'diversos','romance','literatura infanto juvenil','policial', 'literatura fantastica', 'suspense e terror', 'aventura', 'religiao', 
	'direito','sociologia','ficcao cientifica','biografias','economia','administracao','politica','ciencias',
	'contos e cronicas','filosofia','poesias','geral','humor']

	_.each(_books, (i) => {
		 if((i.directlink != "/mobi") && (_.indexOf(catRemover, i.category) != -1))
		 {
		
		 		let dirCategoryCreate = './removidos/'+ i.category
		 		let origin = '/home/mrpegman/Documentos/ebooks/content/'+ i.bookname + '.mobi'
		 		let target = '/home/mrpegman/Documentos/ebooks/removidos/'+ i.category + '/'+ i.bookname + '.mobi'

				mkdirp(dirCategoryCreate)
				
				mv(origin, target, function(err) {
	  			if(err){}
				})

		 }
  })
}

function start(){	
  try{
  	let opt = {
  		listaCat: false,
  		filtro: false,
  		remover: true
  	}
		
		if(opt.listaCat)
 			listaCategorias()
 		
 		if(opt.filtro)
 			listaFiltrados('economia')

		if(opt.remover)
			removerFiltrados()

  }catch(e){
      console.log('start() - erro!')
      throw e
  }
}

start()