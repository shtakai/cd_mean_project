


const mongoose = require('mongoose')
const Poll = mongoose.model('Poll')
const Option = mongoose.model('Option')
const User = mongoose.model('User')
mongoose.Promise = global.Promise;

module.exports = {
  index: (req, res) => {
    if(!req.session['user_info']){
      res.json({status: false, errors: ['not login'], login_required:true})
    }else{

      let query = Poll.find({})
      query.sort({created_at: -1})
      query.populate('answers')
      query.populate('_user')

      query.exec( (err, polls) => {
        if(err){
          res.json({status: false, errors:err})
        } else{
          res.json({status: true, polls: polls})
        }
      } )
    }
  }, //end index
  create: (req, res) => {
    if(!req.session['user_info']){
      res.json({status: false, errors: ['not login'], login_required:true})
    }else{
      let poll = new Poll(req.body)
      poll.question = req.body.question
      req.body.option1 = req.body.option1 || ''
      req.body.option2 = req.body.option2 || ''
      req.body.option3 = req.body.option3 || ''
      req.body.option4 = req.body.option4 || ''
      let option1 = new Option()
      let option2 = new Option()
      let option3 = new Option()
      let option4 = new Option()
      option1.option = req.body.option1
      option2.option = req.body.option3
      option3.option = req.body.option3
      option4.option = req.body.option4
      let user_id = req.session['user_info'].id

      // using promise
      // option doesn't add poll becauseof no need of reverse tracking
      // NOTE: last of then, use return ...
      User.findOne({_id: user_id})
        .then((user) => {
          poll._user = user
          user.polls.push(poll)
          return user.save()
        })
        .then(() => {
          poll.option1 = option1
          return option1.save()
        })
        .then( ()=> {
          poll.option2 = option2
          return option2.save()
        } )
        .then( ()=> {
          poll.option3 = option3
          return option3.save()
        } )
        .then( ()=> {
          poll.option4 = option4
          return option4.save()
        } )
        .then( () => {
          // TODO: revove options when poll creations failed
          poll.save()
          res.json({status:true, poll: poll})
        } )
        .catch( (err) => {
          res.json({status:false, errors: err})
        } )

    }
  }, //end create
  show: (req, res) => {
    if(!req.session['user_info']){
      res.json({status: false, errors: ['not login'], login_required:true})
    }else{
      let query = Poll.findOne({_id: req.params.id})
      query.populate('_user')
      query.populate('option1')
      query.populate('option2')
      query.populate('option3')
      query.populate('option4')
      query.exec((err, poll) => {
        if(err){
          res.json({status:false, errors:err})
        }else {
          res.json({status:true, poll:poll})
        }
      })
    }
  }, // end show

  destroy: (req, res) => {
    if(!req.session['user_info']){
      res.json({status: false, errors: ['not login'], login_required:true})
    }else{
      Poll.remove({_id: req.params.id})
        .then((promise)=>{
          res.json({status:true, poll_id: req.params.id})
        }).catch((err) => {
          res.json({status:false, errors:err})
        })
    }
  }, //end destroy

  vote: (req, res) => {
    if(!req.session['user_info']){
      res.json({status: false, errors: ['not login'], login_required:true})
    }else{
      Option.findOne({_id: req.params.id})
        .then((option)=>{
          option.vote += 1
          return option.save()
        })
        .then((option) => {
          res.json({status:true, option_id: req.params.id, votes: option.vote})
        })
        .catch((err) => {
          res.json({status:false, errors:err})
        })
    }
  }
}
