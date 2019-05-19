/**
 * Created by Wallaard on 16-5-2019.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  testTitle: {type: String, required: true},
})

const TestModel = mongoose.model('testmodel', TestSchema);
module.exports = TestModel;