import {Controller} from 'stimulus';
import {Modal} from 'bootstrap';

export default class extends Controller {
	static targets = ['modal'];
	modal = null;

	connect() {
		this.element.addEventListener('turbo:submit-end', event => {
			console.log(event)
		})
	}
	
	async openModal(event) {
		this.modal = new Modal(this.modalTarget);
		this.modal.show();
	}
}
