const createMap = (
  GS,
  name,
  mapData,
  tileset,
  images,
  mapScreen,
  playerSpawnPoint,
  playerDefaultX,
  playerDefaultY
) => {
  mapScreen.width = mapData.width * mapData.tilewidth;
  mapScreen.height = mapData.height * mapData.tileheight;
  const mapContext = mapScreen.getContext("2d");
  //const hitboxes = [];
  const spawnPoints = [];
  let row, col;
  mapData.layers.forEach((layer) => {
    if (layer.type === "tilelayer") {
      row = 0;
      col = 0;
      layer.data.forEach((index) => {
        if (index > 0) {
          mapContext.drawImage(
            images[tileset.imageName],
            tileset.getSourceX(index),
            tileset.getSourceY(index),
            mapData.tilewidth,
            mapData.tileheight,
            col * mapData.tilewidth,
            row * mapData.tileheight,
            mapData.tilewidth,
            mapData.tileheight
          );
        }
        col++;
        if (col > mapData.width - 1) {
          col = 0;
          row++;
        }
      });
    }
    if (layer.type === "objectgroup") {
      //hitboxes.push(...layer.objects.map(obj => ({ x1: obj.x, x2: obj.x + obj.width, y1: obj.y, y2: obj.y + obj.height })));
      spawnPoints[layer.name] = [
        ...layer.objects.map((obj) => ({ x: obj.x, y: obj.y })),
      ];
    }
  });

  images[name] = mapScreen;
  // return new TileMap({
  //     imageName: name,
  //     sourceX: 0,
  //     sourceY: 0,
  //     width: mapScreen.width,
  //     height: mapScreen.height,
  //     hitboxes: hitboxes
  // });

  return {
    body: {
      x: this.mapX,
      y: this.mapY,
    },
    image: mapScreen,
    width: mapScreen.width * GS,
    height: mapScreen.height * GS,
    spawnPoints: spawnPoints,
  };
};
