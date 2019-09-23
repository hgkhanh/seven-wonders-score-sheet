/**
 * Schema for new game object
 */
const Game = {
    expansions: {
        armada: false,
        city: false,
        leader: true,
    },
    players: [{
        name: 'p1',
        score: [0,0,0,0,0,0,0,0,0,0]
    }],
    playing: true,
    room: '',
    time: ''
}
export default Game;
