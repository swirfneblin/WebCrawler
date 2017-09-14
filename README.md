## Web Crawler para download de ebooks

`node index.js` => Salva todas URLs de livros em `books.json`  
`node getinfo.js` => Coleta informações do nome do livro, categoria, link direto para download e salva `bookinfos.json`  
`node download.js` => Realiza o download dos arquivos

criar `process.env.URL_BASE=http://www.dominio.com`