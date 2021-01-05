//= include ./custom-scripts.js

$(document).ready(function () {
	initSlickCarousel('.section-master__slider');
	initSlickCarousel('.section-works-gallery__slider-inner', 2, 4);
	new Splide( '.splide', {
		type   : 'loop',
		perPage: 3,
		focus  : 'center',
		breakpoints: {
			990: {
				perPage: 1,
				focus: 0
			},
		}
	} ).mount();
	initScrollAnchor();
	initHeaderFixed();
	initMobileSlideMenu();
	
	function initSendForm(){
		async function sendForm(url, form){
			let newForm = new FormData(form);
			let obj = {};
			
			newForm.forEach((item, index)=>{
				obj[index] = item;
			});
	
			console.log(obj);
			return await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify(obj)
			});
		}
	
		$(".form").validate({
			messages: {
				name: "Введите имя",
				phone: "Введите телефон"
			},
			submitHandler: function submitHandler(form) {
				sendForm('/inc/form/send.php', form).then((response)=>{
					$('.c-modal.--success').fadeIn().delay(2000).fadeOut();
				}).catch((error)=>{
					$('.c-modal.--error').fadeIn().delay(2000).fadeOut();
	
				})
			}
		});
	}
	
});

