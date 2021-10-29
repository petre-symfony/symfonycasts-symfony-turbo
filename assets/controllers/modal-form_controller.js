import {Controller} from 'stimulus';
import {Modal} from 'bootstrap';
import * as Turbo from '@hotwired/turbo'

export default class extends Controller {
	static targets = ['modal'];
	modal = null;

	connect() {
		document.addEventListener('turbo:before-fetch-response', event => {
			console.log(event)
			if (!this.modal || !this.modal._isShown) {
				return
			}

			const fetchResponse = event.detail.fetchResponse
			if (fetchResponse.succeeded && fetchResponse.redirected){
				event.preventDefault()
				Turbo.visit(fetchResponse.location)
			}
		})
	}

	async openModal(event) {
		this.modal = new Modal(this.modalTarget);
		this.modal.show();
	}
}
