var WordBO      = require('../../src/business/WordBO');
var WordDAO     = require('../../src/daos/WordDAO');
var chai        = require('chai');
var sinon       = require('sinon');
var expect      = chai.expect;

describe('business > WordBO', function(){
  it('should save a list of words', function() {
    var wordDAO = new WordDAO();

    var saveWordStub = sinon.stub(wordDAO, 'saveWord');
    saveWordStub
      .withArgs({
        word: 'word 1',
        systemInfoId: 'SYSTEM_ID',
        language: 'en-us'
      })
      .returns(Promise.resolve({
        id: 'ID_WORD_1',
        word: 'word 1',
        systemInfoId: 'SYSTEM_ID',
        language: 'en-us'
      }));
    saveWordStub
      .withArgs({
        word: 'word 2',
        systemInfoId: 'SYSTEM_ID',
        language: 'en-us'
      })
      .returns(Promise.resolve({
        id: 'ID_WORD_2',
        word: 'word 1',
        systemInfoId: 'SYSTEM_ID',
        language: 'en-us'
      }));

    var wordBO = new WordBO(wordDAO);

    return wordBO.saveDictionary(['word 1', 'word 2'], 'SYSTEM_ID', 'en-us')
      .then(function() {
        expect(saveWordStub.callCount).to.be.equal(2);
      });
  });
});
