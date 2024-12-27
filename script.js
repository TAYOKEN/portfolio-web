// Sélectionner toutes les images et ajouter un événement 'click'
document.querySelectorAll('.image').forEach(function(image) {
    image.addEventListener('click', function() {
      var textId = image.getAttribute('data-text');  // Récupérer l'ID du texte associé
      var text = document.getElementById(textId);   // Sélectionner le texte correspondant
  
      // Vérifier si le texte est actuellement visible
      if (text.style.display === 'block') {
        text.style.display = 'none';  // Si visible, le cacher
      } else {
        text.style.display = 'block'; // Sinon, l'afficher
      }
    });
  });
  