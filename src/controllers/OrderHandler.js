var Order = require("../../model/Order.model");
var Product = require("../../model/Product.model");

module.exports.createOrder = function(msg){
    console.log(" [x] creating Order: " + msg.content.toString());
    var order = JSON.parse(msg.content.toString());

    var new_order = new Order({
        id: order.id,
        buyer: order.buyer,
        status: order.status,
        products: [],
        totalPrice: order.totalPrice
    });

    new_order.save(function(err, task) {
        if (err){
        console.log(err);
        }
    });

    order.ProductIds.forEach(productId => {
        Product.find({id: productId}).then(()=>{
            
        })
    });
};

module.exports.updateOrder = function(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;

    Order.updateOne({ id: id },{ $set : 
      {
        buyer : update.newValue.buyer,
        status: update.newValue.status,
        description : update.newValue.description,
        price: update.newValue.price
      } }).then(function (newProduct){
        console.log(newProduct);
    }).catch((error) => {
        console.log(error);
    });

    for(var i =0;i >= update.products.length;i++){
        Product.findOne({id: update.product[i]}).then((product)=>{
            Order.updateOne({
                query: { id: id },
                update: { $push : { products : product} }
            }).then(function (Order){
                  console.log(Order);
              }).catch((error) => {
                  console.log(error);
              });
        })
    }
}

module.exports.deleteOrder = function(msg){
    var deleted = JSON.parse(msg.content.toString());
    var id = deleted.id;

    Order.remove({ id: id }).catch((error) => {
        console.log(error);
    });
}