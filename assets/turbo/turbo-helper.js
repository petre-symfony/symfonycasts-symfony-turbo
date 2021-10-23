import { Modal } from 'bootstrap'

const TurboHelper = class {
	constructor() {
		const findCacheControlMeta = () => {
			return document.querySelector('meta[name="turbo-cache-control"]');
		}

		document.addEventListener('show.bs.modal', () => {
			if (findCacheControlMeta()) {
				// don't modify an existing one
				return;
			}

			const meta = document.createElement('meta');
			meta.name = 'turbo-cache-control';
			meta.content = 'no-cache';
			meta.dataset.removable = true;
			document.querySelector('head').appendChild(meta);
		});


		document.addEventListener('hidden.bs.modal', () => {
			const meta = findCacheControlMeta();
			// only remove it if we added it
			if (!meta || !meta.dataset.removable) {
				return;
			}

			meta.remove();
		});

		document.addEventListener('turbo:before-cache', () => {
			this.closeModal()
			this.closeSweetAlert()
		})

		document.addEventListener('turbo:render', () => {
			this.initializeWeatherWidget()
		})

		document.addEventListener('turbo:visit', () => {
			// fade out the old body
			document.body.classList.add('turbo-loading')
		})

		document.addEventListener('turbo:before-render', (event) => {
			// when we are *about* to render, start us faded out
			event.detail.newBody.classList.add('turbo-loading');
		});

		document.addEventListener('turbo:render', () => {
			// after rendering, we first allow the turbo-loading class to set the low opacity
			// THEN, one frame later, we remove the turbo-loading class, which allows the fade in
			requestAnimationFrame(() => {
				document.body.classList.remove('turbo-loading');
			});
		});
	}

	closeModal(){
		if (document.body.classList.contains('modal-open')) {
			const modalEl = document.querySelector('.modal.show')
			const modal = Modal.getInstance(modalEl)
			modalEl.classList.remove('fade')
			modal._backdrop._config.isAnimated = false
			modal.hide()
			modal.dispose()
		}
	}

	closeSweetAlert(){
		// internal way to see if sweetalert2 has been imported yet
		if (__webpack_modules__[require.resolveWeak('sweetalert2')]) {
			// because we know it's been imported, this will run synchronously
			import('sweetalert2').then((Swal) => {
				if (Swal.default.isVisible()) {
					Swal.default.getPopup().style.animationDuration = '0ms'
					Swal.default.close()
				}
			})
		}
	}

	initializeWeatherWidget(){
		__weatherwidget_init()
	}
}

export default new TurboHelper()