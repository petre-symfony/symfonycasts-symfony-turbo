import { Controller } from "stimulus"
import { Toast } from 'bootstrap'

export default class extends Controller {
	connect() {
		const toastContainer = document.getElementById('toast-container')
		toastContainer.appendChild(this.element)
		
		const toast = new Toast(this.element)
		toast.show()
	}
}