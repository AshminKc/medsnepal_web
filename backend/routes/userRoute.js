import express from 'express';
import User from '../models/userModel';
import { getToken, isAdmin, isAuth } from '../util';


const bcryptjs=require('bcryptjs');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found.' });
  }
});

router.put('/:id', isAuth,  async (req, res) => {
 
  const userId = req.params._id;
  const user = await User.findById(userId);
  
  if (user) {
  
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    
    const updatedUser = await user.save();
    if (updatedUser) {
      return res
        .status(200)
        .send({message: 'User Updated', data: updatedUser});
        
    }
  }
  return res.status(500).send({ message: ' Error in Updating User.' })
}
// catch{
//   res.status(400).send()
// }
  // if (user) {
  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;
  //   user.password =  req.body.password ||  user.password;
  // //  user.password =await bcryptjs.hash(req.body.password,10);

  //   const updatedUser = await user.save();
  //   res.send({
  //     _id: updatedUser.id,
  //     name: updatedUser.name,
  //     email: updatedUser.email,
  //     isAdmin: updatedUser.isAdmin,
  //     token: getToken(updatedUser)
    
    
  //   });
  // } else {
    
  //   res.status(404).send({ message: 'User Not Found' });
  
);


router.post('/signin', async (req, res) => {
    
  const signinUser = await User.findOne({email: req.body.email})
  
  if (signinUser) {
    if(await bcryptjs.compare(req.body.password, signinUser.password)){
      res.send({
        _id: signinUser.id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: getToken(signinUser),
        message: 'User Loggedin Successfully',
      });
    } else{
      res.status(401).send({ message: 'Invalid Email or Password.' });
    }  
  }
});

router.post('/register', async (req, res) => {
  
  const Hashpassword= await bcryptjs.hash(req.body.password,10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: Hashpassword,
  });
  
  const newUser = await user.save();

  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
      message: 'User registered Successfully',
    });
  } else {
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    
    const user = new User({
      name: 'Ashmin',
      email: 'Ashmin@gmail.com',
      password: await bcryptjs.hash('123456',10),
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;