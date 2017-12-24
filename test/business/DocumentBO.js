var DocumentBO  = require('../../src/business/DocumentBO');
var DocumentDAO = require('../../src/daos/DocumentDAO');
var chai        = require('chai');
var sinon       = require('sinon');
var expect      = chai.expect;

describe('business > DocumentBO', function(){
  it('should create a document when it does not exist', function() {
    var documentDAO = new DocumentDAO();

    var createDocumentStub = sinon.stub(documentDAO, 'createDocument');
    var updateDocumentStub = sinon.stub(documentDAO, 'updateDocument');
    var getByReferenceStub = sinon.stub(documentDAO, 'getByReference');

    getByReferenceStub
      .withArgs('SYSTEM_ID', 'Document Group', 'DOCUMENT_ID')
      .returns(Promise.resolve(null));

    var expectedDocument = {
      systemInfoId: 'SYSTEM_ID',
      title: 'Title of the document',
      group: 'Document Group',
      language: 'en-us',
      reference: 'DOCUMENT_ID',
      url: '/relative/path/to/document?id=DOCUMENT_ID',
      createdAt: new Date(),
      createdBy: 'Document Author',
      modifiedAt: new Date(),
      modifiedBy: 'Document Modifier',
      contents: 'This is a content of the document',
      hash: 'ff40a631d07c10ff24f8dc8ce6d3721b'
    };
    var resultDocument = expectedDocument;
    resultDocument.id = 'DOCUMENT_ID';

    createDocumentStub
      .withArgs(expectedDocument)
      .returns(Promise.resolve(resultDocument));

    var documentBO = new DocumentBO(documentDAO);

    return documentBO.saveDocument(expectedDocument)
      .then(function(r) {
        expect(r.id).to.be.equal('DOCUMENT_ID');
        expect(createDocumentStub.callCount).to.be.equal(1);
        expect(getByReferenceStub.callCount).to.be.equal(1);
        expect(updateDocumentStub.callCount).to.be.equal(0);
      });
  });

  it('should update a document when it exists', function() {
    var documentDAO = new DocumentDAO();

    var createDocumentStub = sinon.stub(documentDAO, 'createDocument');
    var updateDocumentStub = sinon.stub(documentDAO, 'updateDocument');
    var getByReferenceStub = sinon.stub(documentDAO, 'getByReference');

    var expectedDocument = {
      systemInfoId: 'SYSTEM_ID',
      title: 'Title of the document',
      group: 'Document Group',
      language: 'en-us',
      reference: 'DOCUMENT_ID_2',
      url: '/relative/path/to/document?id=DOCUMENT_ID_2',
      createdAt: new Date(),
      createdBy: 'Document Author',
      modifiedAt: new Date(),
      modifiedBy: 'Document Modifier',
      contents: 'Content of the document',
      hash: '120EA8A25E5D487BF68B5F7096440019'
    };
    var resultDocument = expectedDocument;
    resultDocument.id = 'DOCUMENT_ID';

    getByReferenceStub
      .withArgs('SYSTEM_ID', 'Document Group', 'DOCUMENT_ID_2')
      .returns(Promise.resolve(resultDocument));

    updateDocumentStub
      .withArgs(resultDocument)
      .returns(Promise.resolve(resultDocument));

    var documentBO = new DocumentBO(documentDAO);

    return documentBO.saveDocument(expectedDocument)
      .then(function(r) {
        expect(r.id).to.be.equal('DOCUMENT_ID');
        expect(createDocumentStub.callCount).to.be.equal(0);
        expect(getByReferenceStub.callCount).to.be.equal(1);
        expect(updateDocumentStub.callCount).to.be.equal(1);
      });
  });
});
