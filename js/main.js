(function(){
	// Mobile nav toggle
	const navToggle = document.getElementById('nav-toggle');
	const siteNav = document.getElementById('site-nav');
	navToggle && navToggle.addEventListener('click', ()=> siteNav.classList.toggle('open'));

	// Close mobile nav on link click and smooth scroll offset for sticky header
	document.querySelectorAll('.nav-link').forEach(link=>{
		link.addEventListener('click', (e)=>{
			e.preventDefault();
			const id = link.getAttribute('href').slice(1);
			const target = document.getElementById(id);
			if(target){
				const headerOffset = document.querySelector('.site-header').offsetHeight;
				const topPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 10;
				window.scrollTo({top: topPos, behavior:'smooth'});
			}
			siteNav.classList.remove('open');
		});
	});

	// IntersectionObserver for reveal-on-scroll (about team photos)
	const io = new IntersectionObserver((entries)=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting) entry.target.classList.add('in-view');
		});
	},{threshold:0.15});
	document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

	// Ensure hero image plays fade-in on load (already CSS animation, but ensure visible)
	window.addEventListener('load', ()=> {
		document.querySelectorAll('.hero-image').forEach(img=>{
			img.style.opacity = ''; // allow CSS animation
		});
	});

	// ----------------------------
	// Reviews horizontal autoplay
	// ----------------------------
	const reviewsWrap = document.querySelector('.reviews-wrap');
	if(reviewsWrap){
		const track = reviewsWrap.querySelector('.reviews-track');
		const cards = Array.from(track.querySelectorAll('.review-card'));
		let idx = 0;
		let timer = null;
		const interval = 3500;

		// center card in view
		function scrollToIndex(i){
			if(!cards[i]) return;
			const card = cards[i];
			// compute left to center the card within the visible wrap
			const left = card.offsetLeft - (reviewsWrap.clientWidth - card.clientWidth) / 2;
			reviewsWrap.scrollTo({left: left, behavior: 'smooth'});
		}

		function next(){
			idx = (idx + 1) % cards.length;
			scrollToIndex(idx);
		}

		function start(){
			stop();
			timer = setInterval(next, interval);
		}
		function stop(){
			if(timer){ clearInterval(timer); timer = null; }
		}

		// start after small delay to allow layout calculations
		setTimeout(()=>{
			scrollToIndex(0);
			start();
		}, 400);

		// pause on hover/focus
		reviewsWrap.addEventListener('mouseenter', stop);
		reviewsWrap.addEventListener('mouseleave', start);
		reviewsWrap.addEventListener('focusin', stop);
		reviewsWrap.addEventListener('focusout', start);

		// pause when out of view
		const rIO = new IntersectionObserver((entries)=>{
			entries.forEach(en=>{
				if(!en.isIntersecting) stop();
				else start();
			});
		},{threshold:0.3});
		rIO.observe(reviewsWrap);

		// handle resize (recenter)
		window.addEventListener('resize', ()=> scrollToIndex(idx));
	}
})();
