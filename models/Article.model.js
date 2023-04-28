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
            validator: function(v) {
                if (!v) { 
                  return true; 
                }
                return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*?$/.test(v); 
            }  
        },
        
        
        
    },
      {
       timestamps: true,
      },
    );
    
    const Article = model("Article", articleSchema);
    
    module.exports = Article;