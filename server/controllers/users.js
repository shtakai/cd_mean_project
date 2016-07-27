

const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  login: (req, res) => {
    User.findOne({name: req.body.name}, function(err, user) {
      if(err){
        res.json({status:false, errors:err})
      } else if(!user){
        // user not found
        let _user = new User(req.body)
        _user.save((err,_u) => {
          if(err){
            res.json({status:false, errors:err})
          } else {
            // new user created
            req.session['user_info'] = {
              id: _u._id,
              name: _u.name
            }
            res.json({status:true, user: req.session['user_info']})
          }
        })
      }else {
        // found
        req.session['user_info'] = {
          id: user._id,
          name: user.name
        }
        res.json({status:true, user: req.session['user_info']})
      }
    })
  }, // end login
  session: (req, res) => {
     let userInfo = req.session['user_info']
     if(req.session['user_info']){
       res.json({status:true, user: req.session['user_info'] })
     }else {
       res.json({status:false, errors:['user not found']})
     }
  }, //end session
  logout: (req, res) => {
     req.session.destroy((err) => {
     res.json({status:true, message:'logout'})
     })
  }
}
