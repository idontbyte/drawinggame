using System;

namespace DrawingGame.Models
{
    public class Player
    {
        private bool v;

        public Player(string playerName)
        {
            PlayerName = playerName;
        }

        public Player(string playerName, bool myDraw) : this(playerName)
        {
            MyDraw = myDraw;
        }

        public string PlayerName { get; set; }
        public DateTime LastUpdate { get; set; } = DateTime.Now;
        public bool RemoveMe { get; set; } = false;
        public bool MyDraw { get; set; } = false;
    }
}
