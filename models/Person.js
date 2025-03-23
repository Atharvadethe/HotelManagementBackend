const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        required:true,
        type:String,

    },
    password:{
        required:true,
        type:String
    }
});

personSchema.pre('save', async function(next){
    const person = this;
    //hash the password only is it has been modified or new
    if(!person.isModified('password')) return next();
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        //update password in the document
        person.password = hashedPassword;
        next();
    }
    catch(error){
        console.error('Error hashing password:', error);
        next(error);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(error){
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

const Person = mongoose.model('Person', personSchema);

module.exports = Person;