define( function()
{
	var AssetManager = function AssetManager( path )
	{
		AssetManager.instance = this;
			
		this.path   = path;
		
		this.images   = new Array();
		this.sounds   = new Array();
		
		this.totalImages  = 0;
		this.loadedImages = 0;
		
		this.totalSounds  = 0;
		this.loadedSounds = 0;
		
		this.loadCircle = 0;
		
		this.frameCount   = 30;
		this.currentFrame = 0;
		
		this.isUpdateAudio = false;
		this.isSkipImages  = false;
		
		this.imageDirectories = [
			{ name : "decor/", files : [ "FondEtoiles720.png", "level1.png" ] },
			{ name : "", files : [ "captain.png" ] }
		];

		this.soundDirectories = [ 
						{ name : "", files : ["ingame.mp3","editor.mp3"] }
			];


		this.parentImagesDirectories = [
							{'images': this.imageDirectories, 'sounds' : this.soundDirectories}
		];
	
		this.cacheData(0);
	}

	AssetManager.prototype.cacheData = function(index)
	{
		var thisObj = this;
		if ( !this.isSkipImages )
		{
			var directory = this.parentImagesDirectories[index].images;
			for ( var i = 0; i < directory.length; i++ )
			{
				for ( var j = 0; j < directory[i].files.length; j++ )
				{	
					this.totalImages++;
					
					var image  = new Image();
					var imPath = this.path.img + directory[i].name + directory[i].files[j],
						imName = imPath.substring( imPath.lastIndexOf( '/' ) + 1, imPath.lastIndexOf( '.' ) );
					
					image.src  = imPath;
					image.name = imName;
					 
					image.isLoaded = false;
					var imLoadFunc = function(){ thisObj.loadedImages++; this.isLoaded = true; };
					if ( image.onloadeddata != undefined ) 
						image.onloadeddata = imLoadFunc;
					else
						image.onload = imLoadFunc;
					
					this.images[ imName ] = image;
				}
			}
		}
			
		directory = this.parentImagesDirectories[index].sounds;
		
		for ( i = 0; i < directory.length; i++ )
		{
			for ( j = 0; j < directory[i].files.length; j++ )
			{
				this.totalSounds++;
				
				var soundClip = new Audio();
				var soundPath = this.path.sound + directory[i].name + directory[i].files[j],
					soundName = soundPath.substring( soundPath.lastIndexOf( '/' ) + 1, soundPath.lastIndexOf( '.' ) );
					
				soundClip.src      = soundPath;
				soundClip.isLoaded = false;
				
				var soundLoadFunc = function()
				{ 
					thisObj.loadedSounds++;
				};
				
				if ( soundClip.onloadeddata != undefined )
					soundClip.onloadeddata = soundLoadFunc;
				else
					if ( !this.isUpdateAudio )
						this.isUpdateAudio = true;
				
				this.sounds[ soundName ] = soundClip;
			}
		}
	}
	
	AssetManager.prototype.isFinishedLoadingAssets = function()
	{
		if ( ( this.isSkipImages || this.loadedImages == this.totalImages ) && 
			   this.loadedSounds == this.totalSounds ) 
			return true;
			
		return false;
	}

	AssetManager.prototype.loading = function()
	{
		//check load audio files 
		if ( this.isUpdateAudio )
		{
			for ( var i = 0; i < this.soundDirectories.length; i++ )
				for ( var j = 0; j < this.soundDirectories[i].files.length; j++ )
				{
					var soundName = this.soundDirectories[i].files[j].substring( 0, this.soundDirectories[i].files[j].lastIndexOf( '.' ) );
					if ( !this.sounds[ soundName ].isLoaded && this.sounds[ soundName ].readyState == 4 )
						this.sounds[ soundName ].isLoaded = true;	
				}
				
			this.loadedSounds = 0;
			for ( i = 0; i < this.soundDirectories.length; i++ )
				for ( j = 0; j < this.soundDirectories[i].files.length; j++ )
				{
					var soundName = this.soundDirectories[i].files[j].substring( 0, this.soundDirectories[i].files[j].lastIndexOf( '.' ) );
					if ( this.sounds[ soundName ].isLoaded )
						this.loadedSounds++;
				}
		}
	}

	AssetManager.prototype.isLoadingAssets = function()
	{
		if ( !this.isFinishedLoadingAssets() )
		{
			this.loading();		
			return true;
		}

		return false;
	}
	
	AssetManager.prototype.constructor = AssetManager;
	
	return AssetManager;
});