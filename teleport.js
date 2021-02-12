/**
 * wrapper to cleanly inject the code and pass the gameSpace context to the developer
 */
function wrapper(fn) {
  const tmp = gameSpace.__proto__.keyE
  gameSpace.__proto__.keyE=function(){fn(this)}
  document.body.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'}))
  gameSpace.__proto__.keyE = tmp
}

/**
 * teleports the user to the designated location
 */
function teleport(x, y, space) {
  wrapper((gameSpace) => {
    if(!space) space = gameSpace.mapId || undefined; // set space to current space if undefined
    gameSpace.teleport(x,y,space)
  })
}

/**
 * Get the current possiton as an object of the form
 * {
 *  x: int,
 *  y: int
 * }
 */
function position() {
  wrapper((gameSpace) => {
    const currentState = gameSpace.gameState[gameSpace.id]
    return {x: currentState.x, y: currentState.y}
  })
}

/**
 * Get the current map
 */
function getMap() {
  let map
  wrapper((gameSpace) => {
    map = gameSpace.mapId
  })
  return map
}

/* returns the maps available
 * returns the map ids and their dimensions
 * {
 *   <mapName>:{
 *      id: <mapId>
 *      sizeX: <X size>
 *      sizeY: <Y size>
 *   }
 * }
 */
function getMaps() {
  let maps
  wrapper((gameSpace) => {
    maps = gameSpace.maps
  })
  maps = Object.values(maps)
      .map(m=>({id:m.id, sizeX: m.dimensions[0], sizeY: m.dimensions[1]}))
      .reduce((acc,cur)=>({...acc,[cur.id]:cur}),{})
  return maps
}

/**
 * lists the maps available 
 * lists the map ids, their dimensions
 */
function listMaps() {
  console.table(getMaps())
}

/* returns an array of players online
 * [
 *   {
 *      id: <player id>
 *      name: <player name>
 *      map: <player current map name>
 *      x: <position X>
 *      y: <position Y>
 *   }
 * ]
 */
function getPlayers() {
  let players = []
  wrapper((gameSpace) => {
    players = Object.keys(gameSpace.gameState)
      .map(id => {
        const p = gameSpace.gameState[id]
        return {
          id,
          name: p.name,
          map: p.map,
          x: p.x,
          y: p.y,
        }
      })
  })
  return players
}

/**
 * teleports the user to the players name or id if it exists
 */
function teleportToPlayer(name) {
  const players = getPlayers()
  const selectedPlayer = players.find(p => p.id === name) || players.find(p => p.name === name)
  if (!selectedPlayer) console.error(`Cannot find player ${name}`)
  teleport(selectedPlayer.x, selectedPlayer.y, selectedPlayer.map)
}

/**
 * lists online players in console
 */
function listPlayers() {
  console.table(getPlayers())
}
