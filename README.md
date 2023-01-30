# Projet Applications Web : Casino

### Exécuter l'application localement
- Installer les dépendances de chaque fichier package.json en tapant `npm install`
- Dans un premier terminal, se rendre dans le dossier /server et taper la commande `npm start`
- Dans un second terminal, se rendre dans le dossier /react-ui et taper la commande `npm start`

### Description
Casino en ligne, reprenant le jeu de la roulette. Le jeu est tiré en temps réel, les joueurs, une fois inscrits et connectés, peuvent miser la somme qu'ils souhaitent sur trois couleurs différentes (violet, noir et rose), si le numéro tiré est de la même couleur que leur mise, alors ils remportent un bénéfice variant entre le double de leur mise ou dix fois leur mise en fonction de la couleur choisie. Un chat est disponible sur leur gauche afin de discuter avec les autres joueurs en ligne. L'application est responsive, il est donc possible de jouer à la fois sur ordinateur et mobile.

------------
### Technologies utilisées

##### Serveur
- [x] Express
- [x] Socket IO

##### Base de données
- [x] MongoDB Atlas

##### Interface utilisateur
- [x] React
- [x] Bootstrap

------------
### Cheat code
Pour utiliser un cheat code, il suffit de le taper dans la barre de chat de l'application.
- Incrémenter le solde du compte: /get_money montant
