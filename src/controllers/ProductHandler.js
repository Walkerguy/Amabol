var Product = require("../../model/Product.model");

module.exports.createProduct = function(msg){
    console.log(" [x] creating Product: " + msg.content.toString());
    var product = JSON.parse(msg.content.toString());

    var new_product = new Product({
        id: product.id,
        name: product.name,
        description: product.description,
        amount: product.amount,
        price: product.price
    });

    new_product.save(function(err, task) {
        if (err){
        console.log(err);
        }
    });
};

module.exports.updateProduct = function(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;

    Product.updateOne({ id: id },{ $set : 
      {
        amount : update.newValue.amount,
        name: update.newValue.name,
        description : update.newValue.description,
        price: update.newValue.price
      } }).then(function (newProduct){
        console.log(newProduct);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.deleteProduct = function(msg){
    var deleted = JSON.parse(msg.content.toString());
    var id = deleted.id;

    Product.remove({ id: id }).catch((error) => {
        console.log(error);
    });
}