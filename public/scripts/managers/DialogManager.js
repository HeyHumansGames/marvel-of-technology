define( [ "Managers/AssetManager" ], function( AssetManager ) {
  var DialogManager = function() {
    this._dialogs = [];
    this._dialogIndex = 0;
    this._display = false;
  };

  DialogManager.prototype.render = function (context) {
    if (this._display && this._dialogIndex >= 0) {
      var cD = this._dialogs[this._dialogIndex];
      context.drawImage( AssetManager.instance.images[cD.portrait], 64, 64 );

      var x = 448;
      var y = 64;
      var width = 768;
      var height = 640;
      var radius = 10;
      var offset = 0;
      
      context.fillStyle = "rgba(0,0,0,0.75)"
      context.beginPath()
      context.moveTo(x + offset + radius, y)
      context.lineTo(x + offset + width - radius, y)
      context.quadraticCurveTo(x  + offset + width, y, x + offset + width, y + radius)
      context.lineTo(x + offset + width, y + height - radius)
      context.quadraticCurveTo(x + offset + width, y + height, x + offset + width - radius, y + height)
      context.lineTo(x + offset + radius, y + height)
      context.quadraticCurveTo(x + offset, y + height, x + offset, y + height - radius)
      
      // context.lineTo(x + offset,  y + height + radius + @pointerOffset.y)
      // context.lineTo(x,           y + height + radius + @pointerOffset.y - @pointerOffset.h)
      // context.lineTo(x + offset,  y + height + radius + @pointerOffset.y - @pointerOffset.h)

      context.lineTo(x + offset, y  + radius)
      context.quadraticCurveTo(x + offset, y, x + offset + radius, y)
      context.fill()
      context.closePath()

      context.fillStyle = "#FFF";
      context.font = '48pt "Architects Daughter"';
      context.textAlign = "left";
      this.wrapText(context, cD.text, x + 64, y + 96, width - 128, 64);
    }

  };

  DialogManager.prototype.next = function () {
    this._dialogIndex += 1;
    if (this._dialogIndex > this._dialogs.length - 1)
      this._display = false;
  };

  DialogManager.prototype.add = function (portrait, text) {
    this._dialogs.push({
      'portrait': portrait,
      'text': text
    });
  };

  DialogManager.prototype.display = function () {
    this._display = true;
  };

  DialogManager.prototype.hide = function () {
    this._display = false;
  };

  DialogManager.prototype.wrapText = function (context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  };

  return DialogManager;
});