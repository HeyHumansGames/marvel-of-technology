
module.exports = function(app) 
{   
    app.get('/', function(req, res) {     
		res.render( 'index.html' );
    });

    app.get('/inputscene', function(req, res) {     
		res.render( 'inputscene.html' );
    });
};


