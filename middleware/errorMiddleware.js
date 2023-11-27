export const errorMiddleware = (err,req,res, next) => {
  if(!err.statusCode){
      err.statusCode = 500;
  }
  if(!err.message){
      err.message = 'Internal server error!'
  }
  console.error(err)
  res.status(err.statusCode);
  res.json({message: err.message})
}