using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DrawingGame.Models
{
    public class Particle
    {
        public long Id { get; set; }
        public int Left { get; set; }
        public int Top { get; set; }
        public bool Remove { get; set; }
    }
}
