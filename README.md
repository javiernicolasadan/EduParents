### eduParents

[Deployment Link](https://eduparents.onrender.com/)  
[Demo](https://www.loom.com/share/7564be8ae9984e44826bdebaa6ae551f?sid=b493add4-86ca-45c1-87be-a0b818949de1)


## Description

"eduParents" is a web where people that are parentes can open a profile and share their experiences that the have with their babys and childrens with other parents. They can categorize by age son they can read the articles that are related with the age of their babay.


## MVP 
- user can register, log in and log out
- can write an article, update and delete it, and have to categorize by age range
- can upload a picture when write, update or delete it
- articles are categorized by age range and user can see articles by category
- user can see own created articles
- user is avaible to choose the articles that like the most and have his favorite collection 
- can go to the profile and see the sections by age range
- can see the own created articles
- articles are sorted by create date
- articles have to possibility of having a link
- use of CSS technics to adapt to differents screen's size


## Backlog
- style the articles with page breaks
- check the links for validation
- responsive


## ROUTES
- GET /
    - render the homepage
- GET /register
    - render register form 
- POST / register
    - render register form and message if email already exist
    - render register form and message if username already exist
    - render register form and message if password is not good enought
    - render register form
- GET / login
    - render log in form
- POST / login
    - render register form and message if user doesnt exist
    - render login form and message if password itnt correct
    - redirect profile 
- GET / profile
    - render profile if user is logged in
- GET / logout
    - redirect homepage  
- GET / create
    - render create article form if user is logged in
- POST / create
    - redirect to created article inside the ageRange route 
    - use a picture by default if user doesnt upload anyone     
- POST / fav:articleId
    - redirect to profile with favorite article added
- POST / fav/:articleId/remove
    - redirect to profile with favorite article removed
- GET / edit-article/:articleId
    - render to edite the article if user is logged in
- POST / edit-article/:ageRange/:articleId
    - redirect to article edited in the route by age range categorie and article Id.
- GET /:ageRange
    -  render to articles categorized by age range
- GET /:articleId/delete
    - redirect to profile after user delete an article
- GET /:ageRange/:articleId
    -  render the article     



## Models
User model
- email: String
- username: String
- passwordHash: String
- articles: [ObjecId<Article>]
- favorites: [ObjectId<Articles>]

Article model
- title: String
- ageRange: String
- content: String
- link: String
- createdBy: [ObjectId<User>]
- imageUrl: String


## Links

[Wireframe](https://wireframepro.mockflow.com/view/MRaGnBDLHh)  
[Slides Link](https://docs.google.com/presentation/d/1pm14WBY6rZ-zvkQ9VUd_mQN10QVGytGkzA8_jyk5NQM/edit?usp=sharing)  
[GitHub repo link](https://github.com/eliexme/EduParents)  
[Deployment Link](https://eduparents.onrender.com/)  
