import levelUp from 'levelup';
// import mongoDown from 'mongodown';
// import mongojs from 'mongojs';
// import LevelDB from 'nosql-leveldb';
import levelGraph from 'levelgraph';
import levelGraphRecursive from 'levelgraph-recursive';

import expand from './expand';

let destroyDB = function(){};

const clean = function clean(dbName, cb) {
  // const db = LevelDB(dbName);
  if (dbName instanceof levelUp) {
    dbName.close((err)=>{if (err) console.log('close error',err)})
    dbName = dbName.location
  }
  destroyDB(dbName, (err) => {
    cb(err);
  });
};

const create = function create(dbName, cleanDb, cb) {
  let options;

  if (typeof dbName !== 'string') {
    options = dbName
    dbName = dbName.name
    if (typeof options.destroy === 'function') {
      destroyDB = options.destroy
    } else if (options.db && typeof options.db.destroy === 'function') {
      destroyDB = options.db.destroy.bind(options.db)
    }
  }
  else {
    options = {db: LevelDB}
    destroyDB = LevelDB.destroy.bind(LevelDB)
  }

  const postClean = () => levelUp(dbName, options, (err, leveldb) => {
    if (err) {
      return cb(err);
    }
    const db = levelGraphRecursive(levelGraph(leveldb));
    return cb(err, expand(db, leveldb));
  });

  if (cleanDb) {
    return clean(dbName, (err) => {
      if (err) {
        return cb(err);
      }
      return postClean();
    });
  }
  return postClean();
};

// Same as create except you can load additional data into the system
const load = function load(dbName, files, cleanDb, cb) {
  create(dbName, cleanDb, (err, db) => {
    if (err) {
      return cb(err);
    }
    return db.loadFiles(files, (err2) => {
      cb(err2, db);
    });
  });
};

export default {
  clean,
  create,
  load,
};
