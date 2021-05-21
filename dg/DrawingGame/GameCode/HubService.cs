using DrawingGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DrawingGame.GameCode
{
    public class HubService
    {
        private readonly HubState _hubState;

        public HubService(HubState hubState)
        {
            _hubState = hubState;
        }

        internal void RemoveDeadLobbies()
        {
            _hubState.Lobbies = _hubState.Lobbies.Where(x => x.RemoveMe == false).ToList();
        }

        internal void RemoveDeadPlayers()
        {
            foreach (var lobby in _hubState.Lobbies)
            {
                lobby.State.Players = lobby.State.Players.Where(x => x.RemoveMe == false).ToList();
            }
        }

        internal List<Lobby> GetLobbies()
        {
            return _hubState.Lobbies;
        }

        public HubState GetHubState()
        {
            return _hubState;
        }

        internal void AddPlayer(string name)
        {
            _hubState.Players.Add(name);
        }

        internal void AddLobby(Lobby lobby)
        {
            _hubState.Lobbies.Add(lobby);
        }

        internal Lobby GetLobby(string lobbyName)
        {
            return _hubState.Lobbies.Where(l => l.Name == lobbyName).Single();
        }

        internal void PlayerCheckIn(string lobbyName, string playerName, string particles)
        {
            var lobby = GetLobby(lobbyName);
            lobby.LastUpdate = DateTime.Now;
            lobby.State.Players.Where(p => p.PlayerName == playerName).Single().LastUpdate = DateTime.Now;
            lobby.State.Particles = particles;
        }

        internal void PlayerCheckIn(string lobbyName, string playerName)
        {
            var lobby = GetLobby(lobbyName);
            lobby.LastUpdate = DateTime.Now;
            lobby.State.Players.Where(p => p.PlayerName == playerName).Single().LastUpdate = DateTime.Now;
        }

        internal void FinishedDraw(string lobbyName, string playerName, string particles)
        {
            var lobby = GetLobby(lobbyName);
            lobby.LastUpdate = DateTime.Now;
            var player = lobby.State.Players.Where(p => p.PlayerName == playerName).Single();
            player.LastUpdate = DateTime.Now;
            lobby.State.Particles = particles;
            switch (lobby.State.Drawing)
            {
                case 1:
                    lobby.State.HeadParticles = particles;
                    break;

                case 2:
                    lobby.State.BodyParticles = particles;
                    break;

                case 3:
                    lobby.State.LegsParticles = particles;
                    // finish
                    break;
            }
            lobby.State.Drawing++;
            player.MyDraw = false;
            var playerIndex = lobby.State.Players.IndexOf(player);
            if (playerIndex == lobby.State.Players.Count())
            {
                lobby.State.Players[0].MyDraw = true;
            } else
            {
                lobby.State.Players[playerIndex + 1].MyDraw = true;
            }
        }
    }
}