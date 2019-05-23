var Account = require("../../model/Account.model");

module.exports.createAccount = function(msg){
    console.log(" [x] creating Account: " + msg.content.toString());
    var account = JSON.parse(msg.content.toString());

    var new_account = new Account({
        id: account.id,
        name: account.name,
        adress: account.adress,
        postalcode: account.postalcode,
        city: account.city,
        email: account.email,
        phone: account.phone,
        type: account.type
    });

    new_account.save(function(err, task) {
        if (err){
        console.log(err);
        }
    });
};

module.exports.updateAccount = function(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;

    Account.updateOne({ id: id },{ $set : 
      {
        id: account.id,
        name: account.name,
        password: account.password,
        adress: account.adress,
        postalcode: account.postalcode,
        city: account.city,
        email: account.email,
        phone: account.phone,
        type: account.type
      } }).then(function (newAccount){
        console.log(newAccount);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.deleteAccount = function(msg){
    var deleted = JSON.parse(msg.content.toString());
    var id = deleted.id;

    Account.remove({ id: id }).catch((error) => {
        console.log(error);
    });
}