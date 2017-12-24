var StopWordBO      = require('./business/StopWordBO');
var StopWordDAO     = require('./daos/StopWordDAO');
var DocumentBO      = require('./business/DocumentBO');
var DocumentDAO     = require('./daos/DocumentDAO');
var WordBO          = require('./business/WordBO');
var WordDAO         = require('./daos/WordDAO');
var IndexerBO       = require('./business/IndexerBO');
var IndexDAO        = require('./daos/IndexDAO');


var indexer = new IndexerBO({
  dao: new IndexDAO(),
  wordBO: new WordBO(new WordDAO()),
  stopWordBO: new StopWordBO(new StopWordDAO()),
  documentBO: new DocumentBO(new DocumentDAO())
});

indexer.buildIndex({
  systemInfoId: 'SSG',
  language: 'pt-br',
  title: 'Notícia',
  group: 'G1',
  reference: '100',
  url: '/noticia.asp?id=100',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis',
  contents: 'Pelo pelo pelo pelo pelo pelo projeto de reforma trabalhista apresentado nesta quinta-feira (22) pelo governo Temer, os acordos coletivos entre patrões e empregados podem mudar as regras da jornada de trabalho, desde que o total de horas não ultrapasse os limites já estipulados hoje em dia pelas leis trabalhistas.'
})
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '100');
    //process.exit(0);
});


indexer.buildIndex({
  systemInfoId: 'SSG',
  language: 'en-us',
  title: 'Notícia',
  reference: '1001',
  group: 'G1',
  url: '/noticia.asp?id=1001',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis',
  contents: 'The Promise.all(iterable) method returns a promise that resolves when all of the promises in the iterable argument have resolved, or rejects with the reason of the first passed promise that rejects.'
})
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '1001');
    //process.exit(0);
});



indexer.buildIndex({
  systemInfoId: 'SSG',
  title: 'Notícia',
  language: 'en-us',
  reference: '1002',
  group: 'G2',
  url: '/noticia.asp?id=1002',
  createdAt: new Date(),
  createdBy: 'Gleisson de Assis',
  modifiedAt: new Date(),
  modifiedBy: 'Gleisson de Assis',
  contents: 'Locks implements locking/synchronization mechanisms that have traditionally been used for protecting shared memory between multiple threads. JavaScript is inherently single threaded and does not suffer from these security and stability issues. However, because of its asynchronous eventy nature JavaScript can still benefit from making particular operations wait for the completion of others.'
})
.then(function(r) {
  //console.log(r);

  //process.exit(0);
}, function(e) {
  console.error(e, '1002');
    //process.exit(0);
});
