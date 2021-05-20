using DrawingGame.Models;
using System.Collections.Generic;
using System.Linq;

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
    }
}