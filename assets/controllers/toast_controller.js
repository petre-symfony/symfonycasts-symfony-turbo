import { Controller } from "stimulus"
import { Toast } from 'bootstrap'

export default class extends Controller {
	connect() {
		const toast = new Toast(this.element)
		toast.show()
	}
}