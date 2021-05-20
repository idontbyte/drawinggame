using System;

namespace DrawingGame.Models
{
    public class Player
    {
        public Player(string playerName)
        {
            PlayerName = playerName;
        }
        public string PlayerName { get; set;  }
        public DateTime LastUpdate { get; set; } = DateTime.Now;
        public bool RemoveMe { get; set; } = false;
    }
}
