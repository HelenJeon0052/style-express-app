const express=require('express')
const routers=express.Router()


const { checkAuthentication } = require('../middleware/auth')
const User = require('../models/users.model')

routers.get('/', checkAuthentication, (req, res, next)=>{
    User.find({}, (error, users)=>{
        if(error) {
            console.log('followers router error:no user')
            res.redirect('back')
        } else {
            //console.log(users)
            res.render('followers',{
                user_s:users
            })
        }
    })
})

routers.put('/:id/send-follow-request', checkAuthentication, (req, res)=>{
    
    
    //follower id : req.params.id
    User.findById(req.params.id, (error, user)=>{
        console.log(req.params.id)
        if(error || !user) {
            console.log('follower router error:no user')
            res.redirect('back')
        } else {
            User.findByIdAndUpdate(user._id, {
                followRequest:user.followRequest.concat([req.user._id])
            }, (error, user)=>{
                if(error) {
                    console.log('follower router error:fetching')
                    res.redirect('back')
                } else {
                    //console.log(user.followRequest)
                    console.log('send follow')
                }
                res.redirect('back')
            })
        }
    })
})

routers.put('/:firstId/cancle-request/:secondId', checkAuthentication, (req, res)=>{
    User.findById(req.params.firstId, (error, user)=>{
        console.log(req.params.firstId)
        if(error || !user) {
            console.log('follower router error:no data fetching')
            res.redirect('back')
        } else {
            const filteredFollowRequest=user.followRequest.filter(followId=>followId!==req.params.secondId)

            User.findByIdAndUpdate(user._id, {
                followRequest:filteredFollowRequest
            },(error,_)=>{
                if(error) {
                    console.log('follower router error:no follow fetching')
                } else {
                    console.log('cancle request')
                }
                res.redirect('back')
            })
        }
    })
})

routers.put('/:id/accept-request', checkAuthentication, (req,res)=>{
    User.findById(req.params.id, (error, senderUser)=>{
        if(error || !senderUser) {
            console.log('follower router error:no sender')
            res.redirect('back')
        } else {
            User.findByIdAndUpdate(senderUser._id,{
                senderUser:senderUser.followers.concat([req.user._id])
            }, (error, _)=>{
                if(error) {
                    console.log('follower router error:no data fetching')
                    res.redirect('back')
                } else {
                    User.findByIdAndUpdate(req.user._id, {
                        followers:req.user.followers.concat([senderUser._id]),
                        followRequest:req.user.followRequest.filter(followId=>followId!==senderUser._id.toString())
                    }, (error, _)=>{
                        if(error) {
                            console.log('follower router error:no add request')
                            res.redirect('back')
                        } else {
                            console.log('add request')
                            res.redirect('back')
                        }
                    })
                }
            })
        }
    })
})

routers.put('/:id/remove-follow', checkAuthentication, (req, res)=>{
    User.findById(req.params.id, (error, user)=>{
        if(error || !user) {
            console.log('follower router error:no user')
            res.redirect('back')
        } else {
            User.findByIdAndUpdate(user._id, {
                followers:user.followers.filter(followId=>followId!==req.user._id.toString())
            },(error, _)=>{
                if(error) {
                    console.log('follow router error:no remove follow-check your list')
                    res.redirect('back')
                } else {
                    console.log('update followers array to remove the ID of current user')
                    User.findByIdAndUpdate(req.user._id, {
                        followers:req.user.followers.filter(followId=>followId!==req.params.id.toString())
                    }, (error, user)=>{
                        if(error) {
                            console.log('follow router error:no remove follow-contact your follow')
                            res.redirect('back')
                        } else {
                            console.log('update current users followers array to remove the IDs of users they are not following')
                            res.redirect('back')
                        }
                    })
                }
            })
        }
    })
})

module.exports=routers