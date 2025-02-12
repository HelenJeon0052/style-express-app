const express=require('express')
const routers=express.Router({mergeParams:true})
const { checkAuthentication, checkAuthor }=require('../middleware/auth')

const Post=require('../models/posts.model')
const User=require('../models/users.model')

routers.get('/', checkAuthentication, (req, res)=>{
    /**
     * It searches for posts where the author.id field matches the id provided in the URL parameters (req.params.id). This assumes you have a Post schema with an author field that references a User document.
     * populate() is a Mongoose method that replaces the IDs in the comments field of each post with the actual comment documents.
     * res.render('profile', { posts: posts, user: user }): If both posts and user data are successfully fetched, it renders an EJS template called 'profile', passing the posts and user data to the template.
     */
    Post.find({ "author.id":req.params.id })
    .populate('comments')
    .sort({createdAt:-1})
    .exec((error, posts)=>{
        if(error) {
            console.log('profile router error:no post fetching')
            res.redirect('back')
        }
        else {
            User.findById(req.params.id,(error, user)=>{
                if(error || !user) {
                    console.log('profile router error:no user fetching')
                    res.status(404).json({ message: 'no fetching' });
                } else {
                    res.render('profile', {
                        posts:posts,
                        user:user
                    })
                }
            })
        }
    })
})

routers.get('/edit', checkAuthor, (req, res)=>{
    res.render('profile/edit', {
        users:req.user
    })
})

routers.put('/', checkAuthor, (req,res)=>{
    User.findByIdAndUpdate(req.params.id, req.body, (error, user)=>{
        if(error || !user) {
            console.log('profile router error:no update')
            res.redirect('back')
        } else {
            console.log('profile update')
            res.redirect(`/profile/${req.params.id}`)
        }
    })
    console.log(req.user)
})

module.exports=routers