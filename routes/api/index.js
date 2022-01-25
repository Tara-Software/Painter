var router = require('express').Router();

router.use('/', require('./test'));
//In case of error throws validation error (lo he visto en el tutorial pero ahora mismo no nos hace falta xD)
router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;