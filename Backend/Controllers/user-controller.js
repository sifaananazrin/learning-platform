const User = require('../model/User');
const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken")
const nodemailer=require('nodemailer')


var email;

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shifananazrin15@gmail.com",
      pass: "ynudgxldjsercxjs",
    },
  });
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;



// const signup = async (req,res,next)=>{
//     const{name,email,password} =req.body;
// let existingUser;
// try{
//     existingUser = await User.findOne({email: email})
// } catch(err){
//     console.log(err)
// }
// if(existingUser){
//     return res.status(400).json({message:"user already exists! Login Instead"})
// }
// const hashPassword= bcrypt.hashSync(password)

//     const user = new User({
//         // name:req.body.name,
//         // email:req.body.email,
//         // password:req.body.password
//         name,
//         email,
//         password:hashPassword,
//     })
//     try{
//       await user.save();
//     }catch(err){
//         console.log(err)
//     }

//     return res.status(201).json({message:user})
// }
const signup = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        res.send({user :true});
        return;
      }
  
    //   const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
      const mailDetails = {
        from: "Shifananazrin15@gmail.com",
        to: email,
        subject: "Learning ACCOUNT REGISTRATION",
        html: `<p>YOUR OTP FOR REGISTERING IN ECOMERCE IS ${OTP}</p>`,
      };
  
      if (password) {
        await mailTransporter.sendMail(mailDetails);
        console.log("Email Sent Successfully");
        res.send({email:true});
      }
    } catch (err) {
      console.log("Error Occurs: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  

  


const PostOtp = async (req, res) => {
    const {otp} = req.body;
  
    console.log(req.body);
    console.log(OTP);
  
    if (OTP == otp) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
  
      user.save().then(() => {
        res.send({success:true});
      });
    } else {
      console.log("otp error");
      res.send({OTP:"OTP ERROR"});
    }
  };
  

//user login

const login = async (req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email:email})
    }catch(err){
        return new Error(err)
    }
    if(!existingUser){
        return res.status(400).json({message:"User not found .Signup please"})
    }
   
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password)
if(!isPasswordCorrect){
    return res.status(400).json({message:'invalid Eamil/Password'})
}
// after password is correct we want generate a tocken
const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET_KEY,{
    expiresIn:"35s"
})







// we wantto verifythe tocken we want to create route for that

res.cookie(String(existingUser.id),token,{
    path:'/',
    expires:new Date(Date.now()+1000*30),
    httpOnly:true,
    sameSite:'lax'

})
res.status(200).json({message:'successfully Logged In',user:existingUser,token})

}


//verify token
const verifyTocken=(req,res,next)=>{
    const cookies = req.headers.cookie;
    const token =cookies.split("=")[1];
    console.log(token)
//     const headers =req.headers[`authorization`];
//     // console.log(headers)
//     const token =  headers.split(" ")[1]
    if(!token){
        res.status(404).json({message:"No tocken found"})
    }
    jwt.verify(String(token),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
        return   res.status(400).json({message:"invalid Tocken"})
        }
        console.log(user.id);
        req.id=user.id
    })
   next(); 

 }

const getUser =async(req,res,next)=>{
    const userId=req.id;
    let user;
    try{
        user =await User.findById(userId,"-password")
    }catch(err){
return new  Error(err) 
    }
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({user})

}

//verify token
const refreshToken=(req,res,next)=>{
    if (!req.headers.hasOwnProperty('cookie')) {
        return res.status(400).json({message: "Could not find cookie"});
    }
    const cookies = req.headers.cookie;
    const prevToken =cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({message:"couldnt find token"})
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication is failed"})
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] =" ";
        // it will clean prev token from cookie then generate new tocken
    
const token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY,{
    expiresIn:"30s"
})
//regenerate the cookie
res.cookie(String(user.id),token,{
    path:'/',
    expires:new Date(Date.now()+1000*30), //30 seconds
    httpOnly:true,
    sameSite:'lax'

})

req.id = user.id;  //attaching req.id to user.id
next()



    })
}

//otp

// const verifyOTP = async (req, res, next) => {
//     const otp = req.body.otp; // assuming the OTP is sent in the request body
//     const isValid = await otpService.verifyOTP(otp);
    
//     if (isValid) {
//       res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//       res.status(400).json({ message: 'Invalid OTP' });
//     }
// //   };





exports.signup = signup
exports.login = login
exports.verifyTocken=verifyTocken
exports.getUser=getUser
exports.refreshToken=refreshToken
// exports.verifyOTP=verifyOTP
exports.PostOtp=PostOtp