const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;