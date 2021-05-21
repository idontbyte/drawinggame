using System;
using System.Collections.Generic;

namespace DrawingGame.Models
{
    public class GameState
    {
        public List<Player> Players { get; set; }
        public string Particles { get; set; }

        public int Drawing { get; set; } = 1; // 1 = head, 2 = body, 3 = legs

        private string HeadParticles { get; set; }
        private string BodyParticles { get; set; }
        private string LegsParticles { get; set; }
    }
}
