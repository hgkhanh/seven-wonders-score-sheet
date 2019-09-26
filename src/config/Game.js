/**
 * Schema for new game object
 */
const Game = {
    players: [{
        name: 'p1',
        score: [0,0,0,0,0,0,0,0,0,0]
    }],
    playing: true,
    room: '',
    time: ''
}
export default Game;
