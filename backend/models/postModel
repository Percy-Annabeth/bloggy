const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "A post without a Title doesn't accounts for much!"],
      maxLength: [200, "title should not exceed 200 characters"],
      minLength: [1, "Title should not be empty!"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    favourited_by:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    }],
    likes:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    }],
    dislikes:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    }],
    views:{
        type:Number,
        default:0,
    },
    tags:[{
        type:String,
    }],
    content:[{
        para:{
            type:String,
            default:null,
            font:{
                type:String,
                default:"calibri"
            },
            size:{
                type:Number,
                default:16
            },
            para_bgcolor:{
                type:String,
                default:"white"
            },
        },
        image:{
            image_url:{
                type:String,
                default:null,
            },
            image_position:{
                type:String,
                default:"center"
            },
            image_bgcolor:{
                type:String,
                default:"White",
            },
            image_size:{
                type:Number,
                default:200,
            },
        },
        video:{
            video_url:{
                type:String,
                default:null,
            },
            video_position:{
                type:String,
                default:"center"
            },
            video_bgcolor:{
                type:String,
                default:"White",
            },
            video_size:{
                type:Number,
                default:200,
            },
        },
    }],
});
postSchema.pre("save", function(next){
    if(!this.tags.includes(this.title)){
        this.tags.push(this.title);
    }
    next();
});



module.exports = mongoose.model('Post', postSchema);














// const mongoose = require("mongoose");


// const postSchema = new mongoose.Schema({
//     title: {
//       type: String,
//       required: [true, "A post without a Title doesn't accounts for much!"],
//       maxLength: [200, "title should not exceed 200 characters"],
//       minLength: [1, "Title should not be empty!"],
//     },
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     comments: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment",
//     }],
//     favourited_by:[{
//         user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//         },
//     }],
//     likes:[{
//         user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//         },
//     }],
//     dislikes:[{
//         user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//         },
//     }],
//     views:{
//         type:Number,
//         default:0,
//     },
//     tags:[{
//         type:String,
//     }],
//     content: [
//         {
//             type: {
//                 type: String,
//                 enum: ["text", "image", "video"],
//                 required: true
//             },
//             content: {
//                 para: { type: String }, // For text content
//                 image_url: { type: String }, // For image content
//                 video_url: { type: String } // For video content
//             }
//         }
//     ]    
// });
// postSchema.pre("save", function(next){
//     if(!this.tags.includes(this.title)){
//         this.tags.push(this.title);
//     }
//     next();
// });



// module.exports = mongoose.model('Post', postSchema);
