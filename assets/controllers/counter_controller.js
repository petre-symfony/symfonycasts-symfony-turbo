import {Controller} from 'stimulus';
import * as Turbo from '@hotwired/turbo';

export default class extends Controller {
	count = 0;
	static targets = ['count'];

	increment() {
		this.count++;
		this.countTarget.innerText = this.count;

		if (this.count === 10){
			Turbo.visit('/you-won');
		}
	}
}
