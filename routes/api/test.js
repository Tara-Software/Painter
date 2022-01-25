var router = require('express').Router();

router.get('/test', function(req, res, next){
  res.send('Hola mundo')
});

module.exports = router;