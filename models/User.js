const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'please provide name'],
        maxlength:50,
        minlenght:50,
    },
    email:{
        type:String,
        require:[true,'please provide email'],
        unique:true,
        validate:{
            validator:validate.isEmail,
            message:'Please provide valid email'
        }
    },
    password:{
        type:String,
        require:[true,'please provide password'],
        minlenght:6,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }

});
UserSchema.pre('save',async function (){
    if(!this.isModified('password')){
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})
UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword,this.password);
  return isMatch;
}

module.exports = mongoose.model('User',UserSchema);