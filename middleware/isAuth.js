import jwt from "jsonwebtoken";

const isAuth = (req,res,next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader){
      const error = new Error('No header present');
      error.statusCode = 401;
      throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try{
      decodedToken = jwt.verify(token, process.env.JSECRET);

  }
  catch (e) {
      e.statusCode = 500;
      throw e
  }
  if(!decodedToken){
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error
  }
  req.userInfo = decodedToken;
  next()
}
export default isAuth;