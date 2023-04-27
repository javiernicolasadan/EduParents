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
            maxlength: 500,
            required: true,
        },
        link: {
            type: String, 
            validate:{
                validator: function(v) {
                return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(v);   
                }
            }
       }
    },
      {
       timestamps: true,
      },
    );
    
    const Article = model("Article", articleSchema);
    
    module.exports = Article;