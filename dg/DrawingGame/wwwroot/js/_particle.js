function Particle(id, left, top) {
    this.Id = id;
    this.Left = left + 12;
    this.Top = top + 20;
    this.Sent = false;
    
    var template = document.getElementById('particle-template');
    var particleElement = document.importNode(template.content, true);
    particleElement.querySelector('particle').setAttribute('id', this.Id);
    particleElement.querySelector('particle').style.left = this.Left + 'px';
    particleElement.querySelector('particle').style.top = this.Top + 'px';
    ζ.Game.Element_GameContainer.appendChild(particleElement);
}