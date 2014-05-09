define( [  ], function(  )
{
	var Vectors = function()
	{
		this.add = function(vA, vB)
		{
			return {"x" : vA.x + vB.x, "y" : vA.y + vB.y};
		},
		this.sub = function(vA, vB)
		{
			return {"x" : vA.x - vB.x, "y" : vA.y - vB.y};
		},
		this.mult = function(vA, m)
		{
			return {"x" : vA.x *m, "y" : vA.y * m};
		},
		this.magnitude = function(vA)
		{
			return Math.sqrt(vA.x*vA.x + vA.y*vA.y);
		},
		this.div = function(vA, m)
		{
			return {"x" : vA.x /m, "y" : vA.y / m};
		},
		this.limit = function(vA, max)
		{
			if(this.magnitude(vA) > max)
			{
				vA = this.normalize(vA);
				return this.mult(vA, max);
			}
			else
				return vA;
		},
		this.normalize = function(vA)
		{
			var m = this.magnitude(vA);
			return this.div(vA, m);
		}
	};

	return new Vectors();
});
