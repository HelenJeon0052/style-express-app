const express=require('express')
const routers=express.Router({mergeParams:true})
const Post=require('../models/posts.model')

const Comments=require('../models/comments.model')
const {checkAuthentication,checkCommentOwnership }=require('../middleware/auth')

routers.post("/", checkAuthentication, (req, res)=>{
    console.log(req.params.id)
    Post.findById(req.params.id, (error, post)=>{
        if(error||!post) {
            console.log('comment router error:no post')
            res.redirect('back')
        } else {
            Comments.create(req.body, (error, comment)=>{
                if(error) {
                    console.log('comment router error:creating comment')
                    res.redirect('back')
                } else {
                    console.log(req.params.id)
                    comment.author.id=req.user._id
                    comment.author.username=req.user.username
                    comment.save()

                    post.comments.push(comment)
                    post.save()
                    console.log('put comment to post')
                    res.redirect('back')
                }
            })
        }
    })
})

routers.delete('/:commentId', checkCommentOwnership, (req, res)=>{
    console.log(req.params.commentId)
    Comments.findByIdAndDelete(req.params.commentId, (error, _)=>{
        if(error) {
            console.log('comment router error:no comment')
            res.redirect('back')
        } else {
            console.log(req.params.commentId)
            console.log('delete comment')
        }
        res.redirect('back')
    })
})

routers.get('/:commentId/edit', checkCommentOwnership, (req, res)=>{
    Post.findById(req.params.id, (error, post)=>{
        if(error) {
            console.log('comment router error:no post')
            res.redirect('back')
        } else {
            res.render('comments/edit', {
                post:post,
                comments:req.comment
            })
        }
    })
})

routers.put('/:commentId', checkCommentOwnership, (req, res)=>{
    Comments.findByIdAndUpdate(req.params.commentId, req.body, (error, _)=>{
        if(error) {
            console.log('comment router error:no matching commentId')
            res.redirect('back')
        } else {
            console.log('comment edited')
            res.redirect('/posts')
        }
    })
})

module.exports=routers