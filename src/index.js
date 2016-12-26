var StopWordBO = require('./business/StopWordBO');
var WordBO = require('./business/WordBO');
var IndexerBO = require('./business/IndexerBO');

wordBO = new WordBO();
stopWordsBO = new StopWordBO();
var indexer = new IndexerBO();

indexer.createIndexing({
  systemInfoId: 'SSG',
  title: 'Notícia',
  reference: '100',
  url: '/noticia.asp?id=100',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis'
}, 'Pelo pelo pelo pelo pelo pelo projeto de reforma trabalhista apresentado nesta quinta-feira (22) pelo governo Temer, os acordos coletivos entre patrões e empregados podem mudar as regras da jornada de trabalho, desde que o total de horas não ultrapasse os limites já estipulados hoje em dia pelas leis trabalhistas.')
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '100');
    //process.exit(0);
});


indexer.createIndexing({
  systemInfoId: 'SSG',
  title: 'Notícia',
  reference: '1001',
  url: '/noticia.asp?id=1001',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis'
}, 'The Promise.all(iterable) method returns a promise that resolves when all of the promises in the iterable argument have resolved, or rejects with the reason of the first passed promise that rejects.')
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '1001');
    //process.exit(0);
});



indexer.createIndexing({
  systemInfoId: 'SSG',
  title: 'Notícia',
  reference: '1002',
  url: '/noticia.asp?id=1002',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis'
}, 'Locks implements locking/synchronization mechanisms that have traditionally been used for protecting shared memory between multiple threads. JavaScript is inherently single threaded and does not suffer from these security and stability issues. However, because of its asynchronous eventy nature JavaScript can still benefit from making particular operations wait for the completion of others.')
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '1002');
    //process.exit(0);
});
