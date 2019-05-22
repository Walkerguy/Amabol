var Shoppingcart = require("../../model/Shoppingcart.model");
var Product = require("../../model/Product.model");

module.exports.createShoppingcart = function(msg){
    console.log(" [x] creating Shoppingcart: " + msg.content.toString());
    var shoppingcart = JSON.parse(msg.content.toString());

    var new_shoppingcart = new Shoppingcart({
        id: shoppingcart.id,
        name: shoppingcart.name,
        description: shoppingcart.description,
        amount: shoppingcart.amount,
        price: shoppingcart.price
    });

    new_shoppingcart.save(function(err, task) {
        if (err){
        console.log(err);
        }
    });
};

module.exports.addToShoppingcart = function(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;
    var product_id = update.product_id;

    Product.find({id: product_id}).then((product)=>{
        Shoppingcart.findOneAndUpdate({
            query :{ id: id },
            update: { $push :  { Products : product,} }
            })
            .then(()=>{
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: product.price } }
                }).then((updatedShoppingcart)=>{
                    console.log(updatedShoppingcart);
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
    })
}

module.exports.removeFromShoppingcart = function(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;
    var product_id = update.product_id;

    Product.find({id: product_id}).then((product)=>{
        Shoppingcart.findOneAndUpdate({
            query :{ id: id },
            update: { $pull :  { Products : product,} }
            })
            .then(()=>{
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: -product.price } }
                }).then((updatedShoppingcart)=>{
                    console.log(updatedShoppingcart);
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
    }).catch((error) => {
        console.log(error);
    });
}

module.exports.deleteShoppingcart = function(msg){
    var deleted = JSON.parse(msg.content.toString());
    var id = deleted.id;

    Shoppingcart.remove({ id: id }).catch((error) => {
        console.log(error);
    });
}