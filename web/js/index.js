/*
	C.Arévalo
	index.js.  Control de vista index.html, Mayo/2025
*/
"use strict";						// Nivel elevado de control de errores
import { photoRenderer } from '/js/renderers/photos.js'; // Renderizador de fotos
import { messageRenderer } from '/js/renderers/messages.js'; // Renderizador de mensajes
import { photosAPI_auto } from './api/_photos.js'; // Controlador API de photos
import { photoswithtagsAPI_auto } from './api/_photoswithtags.js'; // Controlador API de la vista photosWithTags
import { sessionManager } from "/js/utils/session.js";

async function main() {//Punto de entrada principal, haciéndolo asíncrono para poder llamar AJAX
	try { // Acceso con éxito a las fotos
		let photos = await photosAPI_auto.getAll(); // Todos los pbjetos photo, tengan o no photoTags
		let photosTags = await photoswithtagsAPI_auto.getAll(); // photos con photoTags, incluyendo además datos de cada tag
		let photoContainer = document.querySelector("#divGallery"); /* Contenedor para photos */
		for (let photo of photos) {
			if (sessionManager.isLogged() && sessionManager.getLoggedId() !== "root") {
				if (photo.visibility == "Private" && (photo.userId == sessionManager.getLoggedId())) {
					photoContainer.appendChild(photoRenderer.asCard(photo, photosTags));
				}
			} else {
				photoContainer.appendChild(photoRenderer.asCard(photo, photosTags)); // Añade card con photo y sus photoTags
			}
		}
		for (let tag of photosTags) {
			let deleteBtn = document.getElementById(`button-delete-${tag.photoTagId}`);
			if (deleteBtn) {
				deleteBtn.onclick = function () {
					handleDelete(tag.photoTagId);
				};
			}
		}
	}
	catch (err) { // Renderiza error
		console.log(err);
		messageRenderer.showErrorMessage(JSON.stringify(err.response.data));
	};
};

document.addEventListener("DOMContentLoaded", async function () {
	changeTagHeader();
});

function changeTagHeader() {
	let hideHeaderTitleIndex = document.getElementById("pageTitle");
	let showHeaderUserLogged = document.getElementById("pageTitleLogged");
	let showHeaderUserRoot = document.getElementById("pageTitleRoot");
	let hideHeaderBook1 = document.getElementById("book1");
	let hideHeaderBook2 = document.getElementById("book2");
	let hideHeaderBook3 = document.getElementById("book3");
	if (sessionManager.isLogged() && sessionManager.getLoggedId() !== "root") {
		hideHeaderTitleIndex.style.display = "none";
		showHeaderUserRoot.style.display = "none";
		hideHeaderBook1.style.display = "none";
		hideHeaderBook3.style.display = "none";
	} else if (sessionManager.isLogged()) {
		hideHeaderTitleIndex.style.display = "none";
		showHeaderUserLogged.style.display = "none";
		hideHeaderBook1.style.display = "none";
		hideHeaderBook2.style.display = "none";
	} else {
		showHeaderUserLogged.style.display = "none";
		showHeaderUserRoot.style.display = "none";
		hideHeaderBook2.style.display = "none";
		hideHeaderBook3.style.display = "none";
	}
}

async function handleDelete(photoTagId) {
	let answer = confirm("Do you really want to delete this tag?");
	if (answer) {
		try {
			await photoswithtagsAPI_auto.delete(photoTagId);
			window.location = "/index.html";
		} catch (err) {
			messageRenderer.showErrorMessage(err.response.data.message);
		}
	}
}


document.addEventListener("DOMContentLoaded", main); // Manejador de eventos para documento cargado