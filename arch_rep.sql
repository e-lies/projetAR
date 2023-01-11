-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.27 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage de la structure de la table arch_rep. clubs
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pays` int NOT NULL,
  `nom` varchar(255) NOT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_team_name` (`nom`),
  KEY `ind_pays` (`id_pays`),
  CONSTRAINT `FK_team_pays` FOREIGN KEY (`id_pays`) REFERENCES `pays` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

-- Listage des données de la table arch_rep.clubs : ~7 rows (environ)
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` (`id`, `id_pays`, `nom`, `ville`, `logo`) VALUES
	(5, 6, 'FC Liverpool', 'Liverpool', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/54/Logo_FC_Liverpool.svg/1200px-Logo_FC_Liverpool.svg.png'),
	(6, 7, 'FC Barcelona', 'Barcelona', 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/a1/Logo_FC_Barcelona.svg/1200px-Logo_FC_Barcelona.svg.png'),
	(7, 7, 'Real Madrid', 'Madrid', 'https://upload.wikimedia.org/wikipedia/fr/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png'),
	(9, 8, 'Juventus Torino', 'Turin', 'https://upload.wikimedia.org/wikipedia/fr/thumb/9/9f/Logo_Juventus.svg/1200px-Logo_Juventus.svg.png'),
	(10, 8, 'AC Milano', 'Milan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/1200px-Logo_of_AC_Milan.svg.png'),
	(35, 6, 'Manchester City', 'Manchester', '/logos/Manchester City.jpg'),
	(36, 9, 'PSG', 'Paris', '/logos/PSG.jpg'),
	(37, 5, 'Bayern Munich', 'Munich', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/800px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png');
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;

-- Listage de la structure de la table arch_rep. matches
CREATE TABLE IF NOT EXISTS `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_guest` int NOT NULL,
  `id_visitor` int NOT NULL,
  `score_guest` int NOT NULL DEFAULT '0',
  `score_visitor` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ind_guest` (`id_guest`),
  KEY `ind_visitor` (`id_visitor`),
  CONSTRAINT `FK_matche_guest` FOREIGN KEY (`id_guest`) REFERENCES `clubs` (`id`),
  CONSTRAINT `FK_matche_visitor` FOREIGN KEY (`id_visitor`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

-- Listage des données de la table arch_rep.matches : ~0 rows (environ)
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` (`id`, `id_guest`, `id_visitor`, `score_guest`, `score_visitor`, `date`) VALUES
	(25, 6, 9, 0, 0, '2021-12-29');
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;

-- Listage de la structure de la table arch_rep. pays
CREATE TABLE IF NOT EXISTS `pays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `flag` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_pays` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Listage des données de la table arch_rep.pays : ~5 rows (environ)
/*!40000 ALTER TABLE `pays` DISABLE KEYS */;
INSERT INTO `pays` (`id`, `nom`, `flag`) VALUES
	(5, 'Allemagne', 'https://www.orientation-pour-tous.fr/local/cache-gd2/03/1526e1ad6a1bbd95be35a0e249c358.jpg?1598280717'),
	(6, 'Angleterre', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg'),
	(7, 'Espagne', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMT3-1bsoQZI-nd9OeLi6Pm2qADF5XmrBiZw&usqp=CAU'),
	(8, 'Italie', 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg'),
	(9, 'France', 'ae5ry54');
/*!40000 ALTER TABLE `pays` ENABLE KEYS */;

-- Listage de la structure de la table arch_rep. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `id_pays` int NOT NULL,
  `id_club` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','any') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_user_name` (`nom`),
  KEY `id_pays` (`id_pays`),
  KEY `ind_user_club` (`id_club`),
  CONSTRAINT `FK_user_club` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`),
  CONSTRAINT `FK_user_nation` FOREIGN KEY (`id_pays`) REFERENCES `pays` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Listage des données de la table arch_rep.users : ~0 rows (environ)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `nom`, `id_pays`, `id_club`, `password`, `role`) VALUES
	(1, 'ilyes', 7, 6, 'ige41', 'any'),
	(2, 'seddik', 6, 5, 'ige43', 'admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
