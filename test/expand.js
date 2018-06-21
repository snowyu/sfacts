/* global describe before it */
import LevelDB from 'nosql-leveldb';
import should from 'should';
import facts from '../src/system';

let gFacts;

const data = ['./test/data/concepts_sm.top'];

describe('Expand', () => {
  before((done) => {
    facts.load({name: 'expandDB', db:LevelDB, destroy: LevelDB.destroy.bind(LevelDB)}, data, false, (err, sfacts) => {
      if (err) {
        return done(err);
      }
      gFacts = sfacts;
      done();
    });
  });

  after((done) => {
    facts.clean(gFacts.level, (err) => {
      if (err) {
        return done(err);
      }
      return done();
    })
  })

  it('should create a user database.', () => {
    gFacts.createUserDB('SOME_USER_ID');
  });

  it('should create a user database with data', (done) => {
    const files = ['./test/data/names.top'];
    gFacts.createUserDBWithData('ANOTHER_USER_ID', files, (err, db) => {
      done(err);
    });
  });
});
