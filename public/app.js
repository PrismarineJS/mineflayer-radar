(function() {
  var io = window.io
    , socket = io.connect()
    , canvas = document.getElementById('canvas')
    , context = canvas.getContext('2d')
    , drawInterval = setInterval(draw, 50)
    , botEntity
    , entities = {}

  // add tabindex property to canvas so that it can receive keyboard input
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', onKeyDown, false);
  canvas.addEventListener('keyup', onKeyUp, false);
  canvas.addEventListener('mousedown', onMouseDown, false);

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

    // outer circle
    context.strokeStyle = white;
    context.beginPath();
    context.arc(centerX, centerY, centerX, 0, 2 * Math.PI);
    context.stroke();

    // arrow in the middle that represents bot
    context.save();
    context.translate(centerX, centerY);
    context.rotate(1.5 * Math.PI - botEntity.yaw);
    context.drawImage(imgArrow, 0, 0, 12, 12, -6, -6, 12, 12);
    context.restore();

    // entities
    for (var entityId in entities) {
      var entity = entities[entityId];
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

    // debug
    context.fillStyle = white;
    context.textBaseline = "top";
    context.fillText("yaw: " + botEntity.yaw, 0, 0);
  }

  function entityText(entity) {
    return entity.username || entity.mobType || entity.objectType || entity.type;
  }

  function onKeyDown(event) {
    return onKeyEvent(event, true);
  }

  function onKeyUp(event) {
    return onKeyEvent(event, false);
  }

  function onKeyEvent(event, value) {
    var key = event.which;
    if (key === 37 || key === 65) {
      socket.emit('controlState', { name: 'left', value: value });
    } else if (key === 38 || key === 87) {
      socket.emit('controlState', { name: 'forward', value: value });
    } else if (key === 39 || key === 68) {
      socket.emit('controlState', { name: 'right', value: value });
    } else if (key === 40 || key === 83) {
      socket.emit('controlState', { name: 'back', value: value });
    } else if (key === 32) {
      socket.emit('controlState', { name: 'jump', value: value });
    }
    event.preventDefault();
    return false;
  }

  function onMouseDown(event) {
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    var startYaw = botEntity.yaw;
    var startPitch = botEntity.pitch;
    var startX = event.offsetX == null ?
      (event.pageX - event.target.offsetLeft) : event.offsetX;
    var startY = event.offsetY == null ?
      (event.pageY - event.target.offsetTop) : event.offsetY;

    function onMouseUp(event) {
      canvas.removeEventListener('mouseup', onMouseUp, false);
      canvas.removeEventListener('mousemove', onMouseMove, false);
    }

    function onMouseMove(event) {
      var x = event.offsetX == null ?
        (event.pageX - event.target.offsetLeft) : event.offsetX;
      var y = event.offsetY == null ?
        (event.pageY - event.target.offsetTop) : event.offsetY;
      var deltaYaw = (x - startX) * Math.PI * 2 / w;
      var deltaPitch = (y - startY) * Math.PI * 2 / h;
      socket.emit('look', {
        yaw: startYaw + deltaYaw,
        pitch: startPitch + deltaPitch,
      });
    }
  }

}());
