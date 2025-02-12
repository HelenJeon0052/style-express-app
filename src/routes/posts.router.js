const express=require('express')
const multer=require('multer')
const routers=express.Router()

const {checkAuthentication,checkPostOwnership }=require('../middleware/auth')
//dbase object
const Post=require('../models/posts.model')
const Comments=require('../models/comments.model')
const path=require('path')
const { error } = require('console')

const storageEngine=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,'../public/images'))
    },
    filename:(req,file,callback)=>{
        callback(null, file.originalname)
    }
})

const upload=multer({storage:storageEngine}).single('avartar')

//try-catch
//route handler
routers.post('/',checkAuthentication, upload, (req, res, next)=>{

    let desc = req.body.desc;
    let image = req.file ? req.file.filename : "";

    Post.create({
        image: image,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        },
    }, (err, _) => {
        if (err) {
            res.location(req.get("Referer") || "/")

            // next(err);
        } else {
            req.flash('success_msg', '포스트를 성공적으로 생성했어요');
            res.redirect("back");
        }
    })

})

//try-catch
routers.get('/', checkAuthentication, (req,res)=>{

    Post.find()
        .populate('comments')
        .sort({ createdAt: -1 })
        .exec((err, posts) => {
            if (err) {
                console.log(err);
            } else {
                console.log('exec ok')
                res.render('posts', {
                    posts: posts,
                    currentUser:req.user
                });
            }
        })
    
})

routers.get('/:id/edit', checkPostOwnership,(req, res, next)=>{
    res.render('posts/edit', {
        post:req.post
    })
})

routers.get('/:id/delete', checkPostOwnership,(req, res, next)=>{
    res.render('posts/delete', {
        post:req.post
    })
})

routers.put('/:id',checkPostOwnership, (req, res)=>{
    Post.findByIdAndUpdate(req.params.id, req.body, (err, _) => {
        console.log('put')
        if (err) {
            req.flash('error', '게시물을 수정하는데 오류가 발생했어요.');
            res.redirect('/posts');
        } else {
            req.flash('success', '게시물 수정을 완료했어요.');
            res.redirect('/posts');
        }
    })
})

routers.delete('/:id/delete', checkPostOwnership, (req, res)=>{
    Post.findByIdAndDelete(req.params.id, (error, post)=>{
        if(error){
            console.error('error.message')
        } else {
            console.log('delete post')
        }
        res.redirect('/posts')
    })
})

module.exports=routers