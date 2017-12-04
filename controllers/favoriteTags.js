const mongoose = require('mongoose');
const FavoriteTag = mongoose.model('FavoriteTag');
const User = mongoose.model('User');

module.exports = {
  /**
  * @description - Creates a new favorite tag and adds to the user
  * @param {array} request - an array containing the favorite tags
  * @param {object} response - response object served to the client
  * @returns {json} favorite tag - new favorite tag
  */
  get(req,res,next) {
    User.findById(req.payload.id).then(function(user){
      if(!user){ return res.sendStatus(401); }
      FavoriteTag
        .find({ owner: user._id})
        .exec(function (err, favoriteTags) {
          if (err) return next(err);
          return res.json({favoriteTags: favoriteTags})
        })
       }).catch(next);
  }
}
