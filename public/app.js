(function() {
  var io = window.io
    , socket = io.connect()
    , canvas = document.getElementById('canvas')
    , context = canvas.getContext('2d')
    , drawInterval = setInterval(draw, 50)
    , botEntity
    , entities = {}

  socket.on('entity', function (newEntity) {
    botEntity = newEntity;
  });

  socket.on('entitySpawn', function (newEntity) {
    entities[newEntity.id] = newEntity;
  });

  socket.on('entityMoved', function (newEntity) {
    entities[newEntity.id] = newEntity;
  });

  socket.on('entityGone', function(oldEntity) {
    delete entities[oldEntity.id];
  });

  var white = '#ffffff'
    , black = '#000000'
    , imgArrow = new Image()
    , imgBlueArrow = new Image()
    , imgRedArrow = new Image()
    , w = canvas.width
    , h = canvas.height
    , centerX = w / 2
    , centerY = h / 2
    , xFromMc = w / 100
    , yFromMc = h / 100

  imgArrow.src = '/arrow.png';
  imgBlueArrow.src = '/arrow-blue.png';
  imgRedArrow.src = '/arrow-red.png';
  function draw() {
    if (! botEntity) return;
    // fill with black
    context.fillStyle = black;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // arrow in the middle that represents bot
    context.save();
    context.translate(centerX, centerY);
    context.rotate(1.5 * Math.PI - botEntity.yaw);
    context.drawImage(imgArrow, 0, 0, 12, 12, -6, -6, 12, 12);
    context.restore();

    // entities
    for (var player in entities) {
      var entity = entities[player];
      var x = centerX + xFromMc * (entity.position.x - botEntity.position.x);
      var y = centerY + yFromMc * (entity.position.z - botEntity.position.z);
      context.save();
      context.translate(x, y);
      context.rotate(1.5 * Math.PI - entity.yaw);
      context.drawImage(imgBlueArrow, 0, 0, 12, 12, -6, -6, 12, 12);
      context.restore();

      context.fillStyle = white;
      context.textBaseline = 'center';
      context.fillText(entityText(entity), x, y - 20);
    }
  }
}());
