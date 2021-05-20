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

        internal void PlayerCheckIn(string lobbyName, string playerName)
        {
            var lobby = GetLobby(lobbyName);
            lobby.LastUpdate = DateTime.Now;
            lobby.State.Players.Where(p => p.PlayerName == playerName).Single().LastUpdate = DateTime.Now;
        }
    }
}