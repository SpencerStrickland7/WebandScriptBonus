const { data } = require('jquery')
let mongoose = require('mongoose')
let passportlocalMongoose = require('passport-local-mongoose')

let user = new mongoose.Schema({
    username:
    {
        type:String,
        default:"",
        trim:true,
        required:'Username is required'
    },
    displayname:
    {
        type:String,
        default:"",
        trim:true,
        required:'Display Name is required'
    },
    email:
    {
        type:String,
        default:"",
        trim:true,
        required:'email is required'
    },
    created:
    {
        type:Date,
        default:Date.now
    },
    update:
    {
        type:Date,
        default:Date.now
    }
    
},
{
    collection: "user"
}
)
let options =({MissingPasswordError:'Wrong/Missing Password'})
user.plugin(passportlocalMongoose,options)
module.exports.user = mongoose.model('user',user)