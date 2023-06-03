//login Logic /verify password new file hain ya
//Data base type

const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');



//req,res ke alava kuch bhi function main nahi dala to callback use hota hain.isliye Done function use huva hain
function intialize (passport,getUserbyEmail,getUserbyId){
    const authenticatedUser = async function(email,password,done){
        const user = getUserbyEmail(email);
        //user nahi mil raha
        if(user == null){
            return done(null,false,{message:"No user with this UserName & Email"});
        }
        try{
            //login ksrtanacha password ani database madhla password
            if( await bcrypt.compare(password,user.password)){
                return done(null ,user);
            }else{
                return done(null,false,{message:"UserName Or Password Incorrect"})
            }
            
        }catch(e){
            return done(e);
        }

    }

    //is passport ko batana padega ki hum local statergy use kar rahain hain isliye
    //unique leta hain userNamefield
    passport.use(new localStrategy({usernameField : 'email'},authenticatedUser));
    //session ke under data ayega jagega seri & deseri remove dese
    passport.serializeUser((user,done)=>done(null,user.id));
    passport.deserializeUser((id,done)=>{
        return done(null,getUserbyId(id));
    })


    


}

module.exports = intialize;
        

        

        
    
