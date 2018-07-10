//use local db or mlab db

if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://<jackma>:<jackma123>@ds233061.mlab.com:33061/vidjot-prod'}
}else{
  module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
}
