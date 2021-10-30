import { Modal } from 'bootstrap'
import * as Turbo from "@hotwired/turbo";

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
			this.reenableSubmitButtons()
		})

		document.addEventListener('turbo:submit-start', event => {
			const submitter = event.detail.formSubmission.submitter
			submitter.toggleAttribute('disabled', true)
			submitter.classList.add('turbo-submit-disabled')
		})

		document.addEventListener('turbo:before-fetch-request', (event) => {
			this.beforeFetchRequest(event)
		})

		document.addEventListener('turbo:before-fetch-response', (event) => {
			this.beforeFetchResponse(event)
		})

		this.initializeTranzitions()
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

	isPreviewRendered() {
		return document.documentElement.hasAttribute('data-turbo-preview')
	}

	initializeTranzitions() {
		document.addEventListener('turbo:visit', () => {
			// fade out the old body
			document.body.classList.add('turbo-loading')
		})

		document.addEventListener('turbo:before-render', (event) => {
			if (this.isPreviewRendered()) {
				// this is a preview that has been instantly swapped
				// remove .turbo-loading so the preview starts fully opaque
				event.detail.newBody.classList.remove('turbo-loading');
				// start fading out 1 frame later after opacity starts full
				requestAnimationFrame(() => {
					document.body.classList.add('turbo-loading');
				});
			} else {
				const isRestoration = event.detail.newBody.classList.contains('turbo-loading');
				if (isRestoration) {
					// this is a restoration (back button). Remove the class
					// so it simply starts with full opacity
					event.detail.newBody.classList.remove('turbo-loading');
					return;
				}
				// when we are *about* to render a fresh page
				// we should already be faded out, so start us faded out
				event.detail.newBody.classList.add('turbo-loading');
			}
		});

		document.addEventListener('turbo:render', () => {
			if (!this.isPreviewRendered()) {
				// if this is a preview, then we do nothing: stay faded out
				// after rendering the REAL page, we first allow the .turbo-loading to
				// instantly start the page at lower opacity. THEN remove the class
				// one frame later, which allows the fade in
				requestAnimationFrame(() => {
					document.body.classList.remove('turbo-loading');
				});
			}
		});
	}

	reenableSubmitButtons(){
		document.querySelectorAll('.turbo-submit-disabled').forEach((button) => {
			button.toggleAttribute('disabled', false)
			button.classList.remove('turbo-submit-disabled')
		})
	}

	beforeFetchResponse(event) {
		const fetchResponse = event.detail.fetchResponse
		if (!fetchResponse.succeeded || !fetchResponse.redirected){
			return;
		}

		if (!this.getCurrentFrame() || !this.getCurrentFrame().dataset.turboFormRedirect){
			return;
		}


		event.preventDefault()
		Turbo.clearCache()
		Turbo.visit(fetchResponse.location)
	}

	beforeFetchRequest(event) {
		console.log(event)
	}

	getCurrentFrame() {
		return document.querySelector('turbo-frame[busy]')
	}
}

export default new TurboHelper()