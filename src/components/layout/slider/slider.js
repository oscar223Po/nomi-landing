/*
Документация по работе в шаблоне:
Документация слайдера: https://swiperjs.com/
Сниппет (HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера,
// указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
/*
Основные модули слайдера:
Navigation, Pagination, Autoplay,
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Подключение базовых стилей
import './slider.scss'
// Полный набор стилей из node_modules
// import 'swiper/css/bundle';

// =====================================================
// ПЕРЕМЕННЫЕ
// =====================================================

// Экземпляр decide-слайдера
let decideSlider = null

// Брейкпоинт только для decide-слайдера
const decideBreakpoint = window.matchMedia('(max-width: 767.98px)')

// =====================================================
// ИНИЦИАЛИЗАЦИЯ ОБЫЧНЫХ СЛАЙДЕРОВ
// (ЗДЕСЬ БУДУТ ВСЕ ОСТАЛЬНЫЕ СЛАЙДЕРЫ)
// =====================================================
function initSliders() {
	// Пример: другие слайдеры работают всегда
	if (document.querySelector('.work__slider')) {
		new Swiper('.work__slider', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 2.5,
			spaceBetween: 15,
			speed: 800,
			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1.2,
					spaceBetween: 10
				},
				768: {
					slidesPerView: 2.3,
					spaceBetween: 15
				}
			}
		})
	}
}

// =====================================================
// DECIDE SLIDER (ТОЛЬКО >= 768px)
// =====================================================
function initDecideSlider() {
	if (!decideSlider && document.querySelector('.decide__slider')) {
		decideSlider = new Swiper('.decide__slider', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1.3,
			spaceBetween: 10,
			//autoHeight: true,
			speed: 800,

			//touchRatio: 0,
			//simulateTouch: false,
			//loop: true,
			//preloadImages: false,
			//lazy: true,

			/*
			// Эффекты
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			*/

			// Пагинация
			/*
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			*/

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки «влево / вправо»
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next'
			},

			/*
			// Брейкпоинты
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/

			// События
			on: {}
		})
	}
}

function destroyDecideSlider() {
	if (decideSlider) {
		// Полностью уничтожаем слайдер и очищаем inline-стили
		decideSlider.destroy(true, true)
		decideSlider = null
	}
}

function decideBreakpointChecker() {
	if (decideBreakpoint.matches) {
		initDecideSlider()
	} else {
		destroyDecideSlider()
	}
}

// =====================================================
// INIT
// =====================================================
document.querySelector('[data-fls-slider]')
	? window.addEventListener('load', () => {
			// 1. Инициализируем ВСЕ обычные слайдеры
			initSliders()

			// 2. Отдельная логика ТОЛЬКО для decide-слайдера
			decideBreakpointChecker()
			decideBreakpoint.addEventListener('change', decideBreakpointChecker)
		})
	: null
