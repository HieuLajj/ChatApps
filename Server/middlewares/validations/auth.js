const jwt = require('jsonwebtoken');
const User = require('../../models/user');

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!!!' });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: 'unauthorized access2!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    if(!req.headers)
     {res.json({ success: false, message: 'unauthorized access req.headers!' })};
    if(!req.headers.authorization){
      console.log(req.headers)
      {res.json({ success: false, message: 'unauthorized access req.headers.authorization!' })}
    }
  }
};