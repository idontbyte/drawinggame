using System;

namespace DrawingGame.Models
{
    public class Player
    {
        public Player(string playerName)
        {
            PlayerName = playerName;
        }
        public Guid Id { get; set; }
        public string PlayerName { get; }
    }
}
