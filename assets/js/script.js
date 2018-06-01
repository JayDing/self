(function() {
	const getScrollTop = () => {
		return window.pageYOffset
			|| document.documentElement.scrollTop
			|| document.body.scrollTop
			|| document.scrollingElement.scrollTop;
	}

	const isMobile = () => {
		// ref: https://www.opentechguides.com/how-to/article/javascript/98/detect-mobile-device.html
		const testExp = new RegExp('Android|webOS|iPhone|iPad|'
			+ 'BlackBerry|Windows Phone|'
			+ 'Opera Mini|IEMobile|Mobile'
			, 'i');

		return testExp.test(navigator.userAgent);
	}

	const isiOS = () => {
		const testExp = new RegExp('iPhone|iPad', 'i');
		return testExp.test(navigator.userAgent);
	}

	const isPageLink = (el) => {
		let pageUrl = window.location.hash ? stripHash(location.href) : window.location.href;

		function stripHash(url) {
			return url.slice(0, url.lastIndexOf('#'));
		}

		return el.hash.length > 0 && stripHash(el.href) === pageUrl
	}

	const hashExist = (el) => {
		return document.querySelectorAll(el.hash).length > 0;
	}

	const navActive = (target) => {
		const nav = document.querySelector(target);
		const navLinks = nav.querySelectorAll('a');

		function detectScrollTop () {
			let scrollTop = getScrollTop();
			let offset = (isMobile() || window.innerWidth <= 640) ? 42 : Math.round(window.innerHeight * 0.4);
			let detectLine = scrollTop + offset;

			Array.from(navLinks)
				.filter(isPageLink && hashExist)
				.forEach((item) => {
					const block = document.querySelector(item.hash);
					const blockTop = block.offsetTop;
					const blockBottom = blockTop + block.offsetHeight;

					if(detectLine >= blockTop && detectLine <= blockBottom) {
						item.classList.add('active');
					} else {
						item.classList.remove('active');
					}
				});
		}

		document.onscroll = detectScrollTop;
		document.body.onresize = detectScrollTop;

		detectScrollTop();
	}

	const copyText = (target) => {
		const btnCopy = document.querySelectorAll(target);

		btnCopy.forEach((item) => {
			item.onclick = (e) => {
				let textArea, range, selection, msg;
				
				textArea = document.createElement('textArea');
				textArea.value = e.currentTarget.dataset.copyText;

				e.currentTarget.appendChild(textArea);

				if(isiOS()) {
					range = document.createRange();
					range.selectNodeContents(textArea);

					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					
					textArea.setSelectionRange(0, 999999);
				} else {
					textArea.select();
				}

				msg = document.execCommand('copy') ? 'Text copied!' : 'Unable to copy!';
				e.currentTarget.removeChild(textArea);

				alert(msg);
			}
		});
	}

	const accordion = (target) => {
		const btnAccordionToggle = document.querySelectorAll(target);

		btnAccordionToggle.forEach((item) =>  {
			item.onclick = (e) => {
				if(e.currentTarget.classList.contains('active')) {
					e.currentTarget.classList.remove('active');
				} else {
					e.currentTarget.classList.add('active');
				}
			};
		});
	}

	const init = () => {
		navActive('#sec-profile nav');
		copyText('.copy');
		accordion('.accordion-toggle');
	}

	init();

})();