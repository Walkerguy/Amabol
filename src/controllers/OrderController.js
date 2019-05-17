const Order = require('../model/order')

// All order CRUD operations.
module.exports = {

    create(req,res,next){
        const newOrder = req.body;
        Order.create(newOrder)
        .then(order => res.send(order))
        .catch(next);
    },

    read(req,res,next){
        Order.find({})
        .then((orders) => res.status(200).send(orders))
        .catch(next);
    },
    
    readById(req,res,next){
        const orderId = req.params.id;
        Order.findById({_id: orderId})
        .then((order) => res.status(200).send(order))
        .catch(next);
    },

    edit(req,res,next){
        const orderId = req.params.id;
        const updatedOrder = req.body;
        Order.findOneAndUpdate({_id:orderId}, updatedOrder)
        .then(() => Order.findById({_id:orderId}))
        .then(order => res.send(order))
        .catch(next);
    },

    delete(req,res,next){
        const orderId = req.params.id;
        Order.findOneAndDelete({_id: orderId})
        .then(order => res.status(204).send(order))
        .catch(next);
    },

    // Special functions.
    addThread(req,res,next){
        const orderId = req.params.id;
        const threadId = req.body.threadId;

        console.log(orderId + " - " + threadId);

        Order.findByIdAndUpdate({ _id: orderId },
          { $push: { threads: threadId } })
        .then((order) => res.status(200).send(order))
        .catch(next);
    }
}