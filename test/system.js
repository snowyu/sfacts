/* global describe before it */
import LevelDB from 'nosql-leveldb';
import facts from '../src/system';

describe('System', () => {
  it('should create a database.', (done) => {
    facts.create({name: 'systemDB2', db:LevelDB, destroy: LevelDB.destroy.bind(LevelDB)}, false, (err, factSystem) => {
      if (err) return done(err);
      facts.clean(factSystem.level, (err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
    });
  });

  it('should clean database.', (done) => {
    const data = ['./test/data/concepts_sm.top', './test/data/animals.tbl'];
    facts.load({name:'systemDB3', db: LevelDB}, data, false, (err, factSystem) => {
      if (err) {
        return done(err);
      }
      facts.clean(factSystem.level, (err2) => {
        if (err2) {
          return done(err2);
        }
        return done();
      });
    });
  });
});
