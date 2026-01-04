const Datastore = require('nedb');
const path = require('path');

const db = new Datastore({
    filename: path.join(__dirname, '../data/users.db'),
    autoload: true
});

// Ensure email index for uniqueness
db.ensureIndex({ fieldName: 'email', unique: true }, (err) => {
    if (err) console.error('Error creating index:', err);
});

class User {
    static create(userData) {
        return new Promise((resolve, reject) => {
            const user = {
                nome: userData.nome,
                email: userData.email,
                senha: userData.senha,
                dataCriacao: new Date(),
                ativo: true
            };
            
            db.insert(user, (err, newDoc) => {
                if (err) reject(err);
                else resolve(newDoc);
            });
        });
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.findOne({ email: email }, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.findOne({ _id: id }, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });
    }
}

module.exports = User;
