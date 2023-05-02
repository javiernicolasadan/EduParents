const { Schema, model } = require("mongoose");



const articleSchema = new Schema(
    {
        title: {
            type: String, 
            required: true,
        },
        ageRange: {
            type: String, 
            enum: ['Pregnancy', 'Birth-1Month', '2-6Months', '7-12Months', '13-18Months', '19-24Months'],
        },
        content: {
            type: String, 
            maxlength: 1000,
            required: true,
        },
        link: {
            type: String, 
            required: false,
            validator: function(link) {
                if (typeof link === 'undefined') { 
                    console.log(link)
                    // Si el valor del enlace es nulo o indefinido, lo consideramos válido (retornamos true)
                    return true; 
                } else {
                    console.log(link)
                    // Si el valor del enlace existe, lo validamos con la expresión regular
                    let linkRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*?$/;
                    return linkRegex.test(link);
                }
            }  
        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        imageUrl: {
            type: String,
            
        },
    },
      {
       timestamps: true,
      },
    );
    
    const Article = model("Article", articleSchema);
    
    module.exports = Article;