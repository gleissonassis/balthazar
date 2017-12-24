var IndexerBO       = require('../../src/business/IndexerBO');
var WordBO          = require('../../src/business/WordBO');
var DocumentBO      = require('../../src/business/DocumentBO');
var StopWordBO      = require('../../src/business/StopWordBO');
var SystemInfoBO    = require('../../src/business/SystemInfoBO');
var IndexDAO        = require('../../src/daos/IndexDAO');
var chai            = require('chai');
var sinon           = require('sinon');
var expect          = chai.expect;

describe('business > IndexerBO', function(){
  var indexDAO = null,
      wordBO = null,
      documentBO = null,
      stopWordBO = null,
      systemInfoBO = null,
      indexerBO = null;

  var expectedDocument = {
    systemInfoId: 'SYSTEM_ID',
    title: 'Title of the document',
    group: 'GROUP',
    language: 'en-us',
    reference: 'DOCUMENT_ID',
    url: '/relative/path/to/document?id=DOCUMENT_ID',
    createdAt: new Date('2017-12-23T16:40:34.003Z'),
    createdBy: 'Document Author',
    modifiedAt: new Date('2017-12-23T16:40:34.003Z'),
    modifiedBy: 'Document Modifier',
    contents: 'This is a content of the document',
    hash: 'ff40a631d07c10ff24f8dc8ce6d3721b'
  };
  var resultDocument = expectedDocument;
  resultDocument.id = 'DOCUMENT_ID';

  afterEach(function(done) {
    done();
  });

  beforeEach(function(done) {
    indexDAO = new IndexDAO();
    wordBO = new WordBO();
    documentBO = new DocumentBO();
    stopWordBO = new StopWordBO();
    systemInfoBO = new SystemInfoBO();

    indexerBO = new IndexerBO({
       dao: indexDAO,
       wordBO: wordBO,
       documentBO: documentBO,
       stopWordBO: stopWordBO,
       systemInfoBO: systemInfoBO
     });
    done();
  });

  it('should build a index for a document', function() {
    var getAllStub = sinon.stub(stopWordBO, 'getAll');
    getAllStub
      .withArgs('en-us')
      .returns(Promise.resolve(
        [
          {
            word: 'of'
          },
          {
            word: 'the'
          },
          {
            word: 'a'
          }
        ]
      ));

    var getByIdStub = sinon.stub(systemInfoBO, 'getById');
    getByIdStub
      .withArgs('SYSTEM_ID')
      .returns(Promise.resolve({id:'SYSTEM_ID'}));

    var getByHashStub = sinon.stub(documentBO, 'getByHash');
    getByHashStub
      .withArgs('SYSTEM_ID',
        'GROUP',
        'DOCUMENT_ID',
        'ff40a631d07c10ff24f8dc8ce6d3721b')
      .returns(Promise.resolve(null));

    var getDictionaryStub = sinon.stub(wordBO, 'getDictionary');
    getDictionaryStub
      .withArgs('SYSTEM_ID', 'en-us')
      .returns(Promise.resolve([{
        id: 1,
        word: 'title',
        systemInfoId: 'SYSTEM_ID'
      },]));

    var saveDictionaryStub = sinon.stub(wordBO, 'saveDictionary');
    saveDictionaryStub
      .withArgs(['document', 'this', 'is', 'content'], 'SYSTEM_ID', 'en-us')
      .returns(Promise.resolve([{
        id: 2,
        word: 'document',
        systemInfoId: 'SYSTEM_ID'
      },,{
        id: 3,
        word: 'this',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 4,
        word: 'is',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 5,
        word: 'content',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 6,
        word: 'document',
        systemInfoId: 'SYSTEM_ID'
      }]));

    var saveDocumentStub = sinon.stub(documentBO, 'saveDocument');
    saveDocumentStub
      .withArgs(expectedDocument)
      .returns(Promise.resolve(resultDocument));

    var clearIndexingStub = sinon.stub(indexDAO, 'clearIndexing');
    clearIndexingStub
      .withArgs('DOCUMENT_ID')
      .returns(Promise.resolve());

    var saveIndexingStub = sinon.stub(indexDAO, 'saveIndexing');
    saveIndexingStub
      .withArgs([{
        position: 0,
        wordId: 1,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 1,
        wordId: 2,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 2,
        wordId: 3,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 3,
        wordId: 4,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 4,
        wordId: 5,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 5,
        wordId: 2,
        documentId: 'DOCUMENT_ID',
      }])
      .returns(Promise.resolve([
        {
          wordId: 1,
          position: 0,
          documentId: 'SYSTEM_ID',
          id: 1
        },
        {
          wordId: 2,
          position: 1,
          documentId: 'SYSTEM_ID',
          id: 2
        },
        {
          wordId: 3,
          position: 2,
          documentId: 'SYSTEM_ID',
          id: 3
        },
        {
          wordId: 4,
          position: 3,
          documentId: 'SYSTEM_ID',
          id: 4
        },
        {
          wordId: 5,
          position: 4,
          documentId: 'SYSTEM_ID',
          id: 5
        },
        {
          wordId: 2,
          position: 5,
          documentId: 'SYSTEM_ID',
          id: 6
        },
      ]));

    return indexerBO.buildIndex(expectedDocument)
      .then(function(r) {
        expect(r.document).to.deep.equal({
          id: 'DOCUMENT_ID',
          systemInfoId: 'SYSTEM_ID',
          title: 'Title of the document',
          group: 'GROUP',
          language: 'en-us',
          reference: 'DOCUMENT_ID',
          url: '/relative/path/to/document?id=DOCUMENT_ID',
          createdAt: new Date('2017-12-23T16:40:34.003Z'),
          createdBy: 'Document Author',
          modifiedAt: new Date('2017-12-23T16:40:34.003Z'),
          modifiedBy: 'Document Modifier',
          contents: 'This is a content of the document',
          hash: 'ff40a631d07c10ff24f8dc8ce6d3721b'
        });
        expect(r.index).to.deep.equal([
          {
            wordId: 1,
            position: 0,
            documentId: 'SYSTEM_ID',
            id: 1
          },
          {
            wordId: 2,
            position: 1,
            documentId: 'SYSTEM_ID',
            id: 2
          },
          {
            wordId: 3,
            position: 2,
            documentId: 'SYSTEM_ID',
            id: 3
          },
          {
            wordId: 4,
            position: 3,
            documentId: 'SYSTEM_ID',
            id: 4
          },
          {
            wordId: 5,
            position: 4,
            documentId: 'SYSTEM_ID',
            id: 5
          },
          {
            wordId: 2,
            position: 5,
            documentId: 'SYSTEM_ID',
            id: 6
          },
        ]);
        expect(indexerBO.getLocker().isLocked, false);
      });
  });

  it('should build a index for a document even if all the words are in database dictionary', function() {
    var getAllStub = sinon.stub(stopWordBO, 'getAll');
    getAllStub
      .withArgs('en-us')
      .returns(Promise.resolve(
        [
          {
            word: 'of'
          },
          {
            word: 'the'
          },
          {
            word: 'a'
          }
        ]
      ));

    var getByIdStub = sinon.stub(systemInfoBO, 'getById');
    getByIdStub
      .withArgs('SYSTEM_ID')
      .returns(Promise.resolve({id:'SYSTEM_ID'}));

    var getByHashStub = sinon.stub(documentBO, 'getByHash');
    getByHashStub
      .withArgs('SYSTEM_ID',
        'GROUP',
        'DOCUMENT_ID',
        'ff40a631d07c10ff24f8dc8ce6d3721b')
      .returns(Promise.resolve(null));

    var getDictionaryStub = sinon.stub(wordBO, 'getDictionary');
    getDictionaryStub
      .withArgs('SYSTEM_ID', 'en-us')
      .returns(Promise.resolve([{
        id: 1,
        word: 'title',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 2,
        word: 'document',
        systemInfoId: 'SYSTEM_ID'
      },,{
        id: 3,
        word: 'this',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 4,
        word: 'is',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 5,
        word: 'content',
        systemInfoId: 'SYSTEM_ID'
      },{
        id: 6,
        word: 'document',
        systemInfoId: 'SYSTEM_ID'
      }]));

    var saveDocumentStub = sinon.stub(documentBO, 'saveDocument');
    saveDocumentStub
      .withArgs(expectedDocument)
      .returns(Promise.resolve(resultDocument));

    var clearIndexingStub = sinon.stub(indexDAO, 'clearIndexing');
    clearIndexingStub
      .withArgs('DOCUMENT_ID')
      .returns(Promise.resolve());

    var saveIndexingStub = sinon.stub(indexDAO, 'saveIndexing');
    saveIndexingStub
      .withArgs([{
        position: 0,
        wordId: 1,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 1,
        wordId: 2,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 2,
        wordId: 3,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 3,
        wordId: 4,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 4,
        wordId: 5,
        documentId: 'DOCUMENT_ID',
      },
      {
        position: 5,
        wordId: 2,
        documentId: 'DOCUMENT_ID',
      }])
      .returns(Promise.resolve([
        {
          wordId: 1,
          position: 0,
          documentId: 'SYSTEM_ID',
          id: 1
        },
        {
          wordId: 2,
          position: 1,
          documentId: 'SYSTEM_ID',
          id: 2
        },
        {
          wordId: 3,
          position: 2,
          documentId: 'SYSTEM_ID',
          id: 3
        },
        {
          wordId: 4,
          position: 3,
          documentId: 'SYSTEM_ID',
          id: 4
        },
        {
          wordId: 5,
          position: 4,
          documentId: 'SYSTEM_ID',
          id: 5
        },
        {
          wordId: 2,
          position: 5,
          documentId: 'SYSTEM_ID',
          id: 6
        },
      ]));

    return indexerBO.buildIndex(expectedDocument)
      .then(function(r) {
        expect(r.document).to.deep.equal({
          id: 'DOCUMENT_ID',
          systemInfoId: 'SYSTEM_ID',
          title: 'Title of the document',
          group: 'GROUP',
          language: 'en-us',
          reference: 'DOCUMENT_ID',
          url: '/relative/path/to/document?id=DOCUMENT_ID',
          createdAt: new Date('2017-12-23T16:40:34.003Z'),
          createdBy: 'Document Author',
          modifiedAt: new Date('2017-12-23T16:40:34.003Z'),
          modifiedBy: 'Document Modifier',
          contents: 'This is a content of the document',
          hash: 'ff40a631d07c10ff24f8dc8ce6d3721b'
        });
        expect(r.index).to.deep.equal([
          {
            wordId: 1,
            position: 0,
            documentId: 'SYSTEM_ID',
            id: 1
          },
          {
            wordId: 2,
            position: 1,
            documentId: 'SYSTEM_ID',
            id: 2
          },
          {
            wordId: 3,
            position: 2,
            documentId: 'SYSTEM_ID',
            id: 3
          },
          {
            wordId: 4,
            position: 3,
            documentId: 'SYSTEM_ID',
            id: 4
          },
          {
            wordId: 5,
            position: 4,
            documentId: 'SYSTEM_ID',
            id: 5
          },
          {
            wordId: 2,
            position: 5,
            documentId: 'SYSTEM_ID',
            id: 6
          },
        ]);
        expect(indexerBO.getLocker().isLocked, false);
      });
  });

  it('should skip a document already indexed', function() {
    var getByIdStub = sinon.stub(systemInfoBO, 'getById');
    getByIdStub
      .withArgs('SYSTEM_ID')
      .returns(Promise.resolve({id:'SYSTEM_ID'}));

    var getByHashStub = sinon.stub(documentBO, 'getByHash');
    getByHashStub
      .withArgs('SYSTEM_ID',
        'GROUP',
        'DOCUMENT_ID',
        'ff40a631d07c10ff24f8dc8ce6d3721b')
      .returns(Promise.resolve(resultDocument));

    return indexerBO.buildIndex(expectedDocument)
      .then(function(r) {
        expect(r.document).to.deep.equal({
          id: 'DOCUMENT_ID',
          systemInfoId: 'SYSTEM_ID',
          title: 'Title of the document',
          group: 'GROUP',
          language: 'en-us',
          reference: 'DOCUMENT_ID',
          url: '/relative/path/to/document?id=DOCUMENT_ID',
          createdAt: new Date('2017-12-23T16:40:34.003Z'),
          createdBy: 'Document Author',
          modifiedAt: new Date('2017-12-23T16:40:34.003Z'),
          modifiedBy: 'Document Modifier',
          contents: 'This is a content of the document',
          hash: 'ff40a631d07c10ff24f8dc8ce6d3721b'
        });
        expect(r.index).to.deep.equal([]);
        expect(indexerBO.getLocker().isLocked, false);
      });
  });

  it('should not lock when a error occurrs getting system information', function() {
    var getByIdStub = sinon.stub(systemInfoBO, 'getById');
    getByIdStub
      .withArgs('SYSTEM_ID')
      .returns(Promise.reject());

    return indexerBO.buildIndex(expectedDocument)
      .catch(function() {
        expect(indexerBO.getLocker().isLocker, false);
      });
  });

  it('should release the locker when a error occurrs in the chain', function() {
    var getByIdStub = sinon.stub(systemInfoBO, 'getById');
    getByIdStub
      .withArgs('SYSTEM_ID')
      .returns(Promise.resolve({id:'SYSTEM_ID'}));

    var getByHashStub = sinon.stub(documentBO, 'getByHash');
    getByHashStub
      .withArgs('SYSTEM_ID',
        'GROUP',
        'DOCUMENT_ID',
        'ff40a631d07c10ff24f8dc8ce6d3721b')
      .returns(Promise.resolve(null));

    var getAllStub = sinon.stub(stopWordBO, 'getAll');
    getAllStub
      .withArgs('en-us')
      .returns(Promise.reject('An error generated by the unit tests'));

    return indexerBO.buildIndex(expectedDocument)
      .catch(function() {
        expect(indexerBO.getLocker().isLocker, false);
      });
  });
});
