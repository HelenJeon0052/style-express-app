const Post=require('../models/posts.model')
const Comments=require('../models/comments.model')
const User=require('../models/users.model')

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/posts');
    }
    next();
}

function checkPostOwnership(req, res, next) {
    if(req.isAuthenticated()){
        //id check
        Post.findById(req.params.id, (error, post)=>{
            if(error || !post) {
                console.error(error)
                res.redirect('back')
            }
            else {
                //check post and push to the next middleware
                if(post.author.id.equals(req.user._id)){
                    req.post=post
                    next()
                } else {
                    console.error(error)
                    res.redirect('back')
                }
            }

        })

    } else {
        //req.flash('login')
        res.redirect('/login')
    }
}

function checkCommentOwnership (req, res, next) {
    if(req.isAuthenticated()) {
        console.log(req.params)
        Comments.findById(req.params.commentId, (error, comment)=>{
            if(error||!comment) {
                console.log('no commentId:auth.js')
                res.redirect('back')
            } else {
                if(comment.author.id.equals(req.user._id)) {
                    req.comment=comment
                    next()
                } else {
                    console.log('commentId no authorization:auth.js')
                    res.redirect('back')
                }
            }
        })
    } else {
        console.log('comment ownership error')
        res.redirect('')
    }

}

async function checkAuthor(req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          console.log('middleware error: no user');
          // Redirect if user not found
          return res.redirect(`/profile/${req.params.id}`);
        }
  
        if (user._id.equals(req.user.id)) {
          next();
        } else {
          console.log('middleware error: no authorization');
          return res.status(403).send('Forbidden');
        }
      } catch (error) {
        console.error('Error in checkAuthor middleware:', error);
        return res.status(500).send('Internal Server Error');
      }
    } else {
      res.redirect(`/profile/${req.params.id}`);
    }
  }

module.exports = {
    checkAuthentication,
    checkNotAuthentication,
    checkPostOwnership,
    checkCommentOwnership,
    checkAuthor
}