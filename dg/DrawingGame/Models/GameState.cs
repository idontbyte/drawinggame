using System;
using System.Collections.Generic;

namespace DrawingGame.Models
{
    public class GameState
    {
        public List<Player> Players { get; set; }
        public string Particles { get; set; }

        public int Drawing { get; set; } = 1; // 1 = head, 2 = body, 3 = legs

        internal virtual string HeadParticles { get; set; }
        internal virtual string BodyParticles { get; set; }
        internal virtual string LegsParticles { get; set; }
    }
}
