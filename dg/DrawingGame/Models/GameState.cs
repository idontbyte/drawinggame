using System.Collections.Generic;

namespace DrawingGame.Models
{
    public class GameState
    {
        public List<Player> Players { get; set; }
        public List<Particle> Particles { get; set; } = new List<Particle>();
    }
}
