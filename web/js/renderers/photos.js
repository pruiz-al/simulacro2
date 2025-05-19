/*
	C.Arévalo, Mayo/2025
	photos.js.  Renderización de Fotos y photosTags (Solución de partida, en bruto)
*/
"use strict";
import { parseHTML } from "/js/utils/parseHTML.js"; // Crea elementos del DOM a partir de fuente html
const photoRenderer = { 
	asCard: function (photo, photosTags) { // Renderiza un objeto photo como card y a continuación todos sus photoTags como texto en bruto
		let thisPhoto_photosTags=photosTags.filter(item=>item.photoId==photo.photoId); // Extrae photoTags del objeto photo renderizado en cada card
		let html=`<div class="card col-sm-3 p-1 mb-1 text-center">
					<h5>#${photo.photoId} ${photo.title} ${photo.visibility} </h5>
					<img src="${photo.url}" class="img-fluid w-100">
				`; 
		/* 	El alumno tiene que renderizar adecuadamente conforme a los requisitos de los apartados (1, 2 y 3)
		   	A continuación se muestra el array JSON de cada photo como texto en bruto (método stringify)
		*/
/* 		html += `	<div class="fw-light photosTags mt-1"> ` 
			 +			JSON.stringify(thisPhoto_photosTags, ["photoTagId","name"]) 
  			 +	`	</div>`
			; */
		thisPhoto_photosTags.forEach(tag => {
			html += `<span class="badge bg-secondary">
			 			<span class="badge rounded-pill bg-light text-dark">${tag.photoTagId}</span>
						${tag.name}
			 	</span> `;
			html += `<button id="button-delete-${tag.photoId}" class="btn btn-danger">Delete this tag</button>`;
			}); 
	 	return parseHTML (html);
	},
};
export { photoRenderer };