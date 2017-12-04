var mongoose = require('mongoose');

var FavoriteTagsSchema = new mongoose.Schema({
  favoriteTag: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

mongoose.model('FavoriteTag', FavoriteTagsSchema);
