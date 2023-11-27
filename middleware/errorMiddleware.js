export const errorMiddleware = (err,req,res) => {
  if(!err.statusCode){
      err.statusCode = 500;
  }
  if(!err.message){
      err.message = 'Internal server error!'
  }
  res.status(err.statusCode);
  res.json({message: err.message})
}