import { Controller } from 'stimulus'
import { addFadeTransition } from '../util/add-transition'

export default class extends Controller {
	static values = {
		className: String,
		removeElement: Boolean
	}

	connect() {
		addFadeTransition(this, this.element, {
			transitioned: true
		})

		this.element.classList.add(this.classNameValue)

		setTimeout(() => {
			if (this.removeElementValue) {
				this.leave()
			} else {
				this.element.classList.add('fade-background')
				this.element.classList.remove(this.classNameValue)
			}
		}, 5000)
	}
}