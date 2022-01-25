var router = require('express').Router();
// api call to test everything is working
router.get('/test', function(req, res, next){
  res.send('Hola mundo')
});

module.exports = router;