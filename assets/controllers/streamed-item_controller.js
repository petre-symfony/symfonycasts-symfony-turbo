import {Controller} from 'stimulus';

export default class extends Controller {
	static values = {
		className: String
	}

	connect() {
		this.element.classList.add(this.classNameValue)

		setTimeout(() => {
			this.element.classList.add('fade-background')
			this.element.classList.remove(this.classNameValue)
		}, 5000)
	}
}