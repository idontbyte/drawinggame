function Particle(left, top) {
    this.Left = (left * 4) + 12;
    this.Top = (top * 4) + 20;
    this.Sent = false;
    
    var template = document.getElementById('particle-template');
    var particleElement = document.importNode(template.content, true);
    particleElement.querySelector('particle').style.left = this.Left + 'px';
    particleElement.querySelector('particle').style.top = this.Top + 'px';
    ζ.Game.Element_GameContainer.appendChild(particleElement);
}