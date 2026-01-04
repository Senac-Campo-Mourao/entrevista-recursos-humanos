const Datastore = require('nedb');
const path = require('path');

const db = {
    users: new Datastore({ 
        filename: path.join(__dirname, '../data/users.db'),
        autoload: true 
    }),
    entrevistas: new Datastore({ 
        filename: path.join(__dirname, '../data/entrevistas.db'),
        autoload: true 
    })
};

// Create indexes
db.users.ensureIndex({ fieldName: 'email', unique: true });

module.exports = db;
