const express=require('express')
const routers=express.Router()
const { checkAuthentication } = require('../middleware/auth')

const Post=require('../models/posts.model')

routers.put('/posts/:id/like', checkAuthentication, (req, res)=>{
    Post.findById(req.params.id, (error, post)=>{
        if(error || !post) {
            console.log('like router error:no post')
            res.redirect('back')
        } else {
            if(post.likes.find(like=>like===req.user._id.toString())) {
                const filterUser=post.likes.filter(like=>like!==req.user._id.toString())
                
                Post.findByIdAndUpdate(post._id, {
                    likes:filterUser
                }, (error, post)=>{
                    if(error) {
                        console.log('like router error:filter')
                        res.redirect('back')
                    } else {
                        console.log(req.user._id)
                        console.log('unlike done')
                        res.redirect('back')
                    }
                })
            } else {
                Post.findByIdAndUpdate(post._id, {
                    likes:post.likes.concat([req.user._id])
                },(error, _)=>{
                    if(error) {
                        console.log('like router error:filter')
                        res.redirect('back')
                    } else {
                        console.log(post.likes + 'hello ' + post.likes.concat([req.user._id]))
                        console.log('like done')
                        res.redirect('back')
                    }
                })
            }
        }
    })
})

module.exports=routers