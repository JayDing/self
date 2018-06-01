(function(window, document, navigator) {
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

		function detectScrollTop () {
			const navLinks = nav.querySelectorAll('a');
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

	const smoothScroll = (target) => {
		// ref: https://github.com/cferdinandi/smooth-scroll/blob/master/dist/smooth-scroll.js
		const header = document.querySelector(target);
		const scrollTrigger = header.querySelectorAll('a');

		function smoothScrollTo(e) {
			const anchor = document.querySelector(e.currentTarget.hash);
			let duration = 500;
			let frame = 40;
			let startY = getScrollTop();
			let endY = anchor.offsetTop;
			let distance = endY - startY;
			let step = Math.round(distance / duration) * frame;
			let next = startY + step;
			let startTime, progress;

			function loop(timestamp) {
				if(!startTime) { startTime = timestamp; }

				if((distance > 0 && next > endY) || (distance < 0 && next < endY)) {
					next = endY;
				}

				window.scrollTo(0, next);

				if(getScrollTop() == endY) { 
					return; 
				} else {
					next += step;
				}

				progress = timestamp - startTime;
				if(progress < duration) {
					window.requestAnimationFrame(loop);
				}
			}

			e.preventDefault();
			window.requestAnimationFrame(loop);
		}

		Array.from(scrollTrigger)
			.filter(isPageLink && hashExist)
			.forEach((item) => {
				item.onclick = smoothScrollTo;
			});
	}

	const copyText = (target) => {
		const btnCopy = document.querySelectorAll(target);
		let textArea, range, selection, msg;

		function createTextContainer(text) {
			textArea = document.createElement('textArea');
			textArea.style = "position: absolute; top: -99999px;  left: -99999px;"
			textArea.value = text;

			document.body.appendChild(textArea);
		}
		
		function isiOS() {
			const testExp = new RegExp('iPhone|iPad', 'i');
			return testExp.test(navigator.userAgent);
		}

		function textSelect() {
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
		}

		function exexCopy() {
			msg = document.execCommand('copy') ? 'Text copied!' : 'Unable to copy!';
			document.body.removeChild(textArea);
			alert(msg);
		}

		function clickHandle(e) {
			let copyText = e.currentTarget.dataset.copyText;

			e.preventDefault();
			createTextContainer(copyText);
			textSelect();
			exexCopy();
		}

		btnCopy.forEach((item) => {
			item.onclick = clickHandle;
		});
	}

	const accordion = (target) => {
		const btnAccordionToggle = document.querySelectorAll(target);

		function toggleActive(e) {
			e.preventDefault();

			if(e.currentTarget.classList.contains('active')) {
				e.currentTarget.classList.remove('active');
			} else {
				e.currentTarget.classList.add('active');
			}
		}

		btnAccordionToggle.forEach((item) =>  {
			item.onclick = toggleActive;
		});
	}

	const init = () => {
		navActive('#sec-profile nav');
		smoothScroll('.smooth-scroll');

		copyText('.copy');
		accordion('.accordion-toggle');
	}

	init();

})(window, document, navigator);