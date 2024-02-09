 //Variables globales pouvant être utilisées dans les fonctions
var _img_id_;
var _titre_id;
var _artiste_id;
var _prix_id;
var _info_id;
var _lesSpans_id = [];

var lesInformations = [];
/*
Fonction appelée lorsque la page est chargée
*/

function Init() {
	_img_id_ = "peinture";
	_titre_id = "titre";
	_artiste_id = "artiste";
	_prix_id = "prix";
	_info_id = "info";

	_lesSpans_id = [_img_id_, _titre_id, _artiste_id, _prix_id];
}


function ChargerInfo(el) {
  var code = el.value;

  var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
		
			if(SelectFile() == "peintures.json") {
				DisplayJSONResponse(JSON.parse(xhr.responseText), code);
			}
			else
			{	
				DisplayXMLResponse(xhr.responseXML, code);
			}
		}
	}

	xhr.open("GET", "ajax/" + SelectFile(), true);
	xhr.send();
}


/*
Fonction qui affiche le résultat JSON dans la section <table>
*/
function DisplayJSONResponse(json, value) {
	ClearSpanMessage();

	var peinture = json.peinture;
	
	for (i = 0; i < peinture.length; i++) {
		if(peinture[i].code == value) {
			var image = peinture[i].image;

			//Pour chaque peinture on stocke ses informations dans un tableau, qui sera utilisé par la suite
			lesInformations = [peinture[i].image, peinture[i].titre, peinture[i].artiste, peinture[i].prix];

			for (j = 0; j < _lesSpans_id.length; j++) {

				if(j == 0){		//Pour l'image uniquement
						var img = document.getElementById(_lesSpans_id[0]);
							img.setAttribute("src", "img/" + lesInformations[0]);
				}
				else{
					document.getElementById(_lesSpans_id[j]).textContent = lesInformations[j];
				}
			}

			//Aller chercher les données pour le cellule "Information" dans le fichier txt correspondant
			DisplayTXTResponse(value);
	
		}
	}
}

/*
Fonction qui affiche le résultat XML dans la section <table>
*/

function DisplayXMLResponse(xml, value) {
	ClearSpanMessage();	//Toujous effacer ce qui est présent avant d'écrire ce que l'on souhaite

	var peinture = xml.getElementsByTagName("peinture");

	for (i = 0; i < peinture.length; i++) {
		if(value == peinture[i].getElementsByTagName("code")[0].firstChild.nodeValue)
		{
			lesInformations = [ peinture[i].getElementsByTagName("titre")[0].firstChild.nodeValue,
						  peinture[i].getElementsByTagName("artiste")[0].firstChild.nodeValue,
						  peinture[i].getElementsByTagName("prix")[0].firstChild.nodeValue,
						  peinture[i].getElementsByTagName("image")[0].firstChild.nodeValue,
						];

			for (j = 0; j < _lesSpans_id.length; j++) {
				if(j == 0){		//Pour l'image uniquement
						var img = document.getElementById(_lesSpans_id[0]);
							img.setAttribute("src", "img/" + lesInformations[3]);
				}
				else{
					document.getElementById(_lesSpans_id[j]).textContent = lesInformations[j - 1];
				}
			}

			//Aller cherhcher les données pour le cellule "Information" dans le fichier txt correspondant
			DisplayTXTResponse(value);
		}
	}
}


function DisplayTXTResponse(value) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var info = document.getElementById(_info_id);
			info.textContent = xhr.responseText;		//Cette ligne joue le role de la fonction ClearSpanMessage()
		}
	}
			xhr.open("GET", "ajax/" + value + ".txt", true);
  			xhr.send();
}

  
/*
Fonction qui efface le contenu de la section <div>
*/
function ClearSpanMessage() {
	for (i = 0; i < _lesSpans_id.length; i++) {
		 document.getElementById(_lesSpans_id[i]).textContent = "";
	}
}

//Fonction qui peremet de sélectionner le type de fichier choisi dans la liste déroulante
function SelectFile() {
  var select = document.getElementById("typefichier");

  var fichier = (select[0].selected == true) ? "peintures.json" : "peintures.xml";

  return fichier;

}