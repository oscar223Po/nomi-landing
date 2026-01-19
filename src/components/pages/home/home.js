document.addEventListener('DOMContentLoaded', () => {
	// --- КОНФИГУРАЦИЯ ---
	const config = {
		startDelay: 2000, // 2 сек пауза перед стартом (и при повторе)
		scrollSpeed: 800, // Увеличили длительность для плавности (было 1000)
		animSpeed: 1500, // Увеличили длительность трансформации (было 500)
		pauseEnd: 2000, // Пауза в конце перед сбросом
		scrollOffset: 50 // Не доходя 50px до элемента
	}

	// --- ЭЛЕМЕНТЫ ---
	const wrapper = document.querySelector('.phone-mockup__wrapper')

	// Активные группы
	const itemGroup1 = document.querySelector('.change-items-one')
	const itemGroup2 = document.querySelector('.change-items-two')

	// Соседние элементы для scale (находим их относительно групп)
	// no-act-03 идет сразу после change-items-one
	const neighborImg1 = itemGroup1.nextElementSibling
	// no-act-07 идет сразу после change-items-two (проверьте верстку, если там есть пробелы/текст, лучше использовать классы)
	const neighborImg2 = itemGroup2.nextElementSibling

	// Картинки на столе
	const tableImages = document.querySelectorAll('.table-mockup__img-change')

	// Метка "Десерты"
	const allSpans = Array.from(
		wrapper.querySelectorAll('.phone-mockup__block > span')
	)
	const dessertsLabel = allSpans.find(
		span => span.textContent.trim() === 'Дессерты'
	) // Обратите внимание на написание "Дессерты" как в вашем HTML

	// --- ФУНКЦИИ ---

	const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

	const setTableActive = index => {
		tableImages.forEach((img, i) => {
			if (i === index) img.classList.add('change-active')
			else img.classList.remove('change-active')
		})
	}

	// Функция плавного скролла (JS-анимация для полного контроля времени)
	// Стандартный behavior: 'smooth' не позволяет задать точное время в секундах, поэтому пишем простую функцию
	const smoothScrollTo = (target, duration) => {
		const start = wrapper.scrollTop
		const change = target - start
		const startTime = performance.now()

		return new Promise(resolve => {
			const animateScroll = currentTime => {
				const timeElapsed = currentTime - startTime

				if (timeElapsed < duration) {
					// Функция плавности (easeInOutQuad)
					let val = timeElapsed / (duration / 2)
					let move = 0
					if (val < 1) {
						move = (change / 2) * val * val + start
					} else {
						val--
						move = (-change / 2) * (val * (val - 2) - 1) + start
					}

					wrapper.scrollTop = move
					requestAnimationFrame(animateScroll)
				} else {
					wrapper.scrollTop = target
					resolve()
				}
			}
			requestAnimationFrame(animateScroll)
		})
	}

	// --- ЦИКЛ ---

	const runAnimationCycle = async () => {
		// 0. Сброс в начало (мгновенно)
		wrapper.scrollTop = 0
		itemGroup1.classList.remove('is-active')
		itemGroup2.classList.remove('is-active')
		if (neighborImg1) neighborImg1.classList.remove('is-scaled-neighbor')
		if (neighborImg2) neighborImg2.classList.remove('is-scaled-neighbor')
		setTableActive(0)

		// 1. Пауза перед стартом (2 секунды)
		await wait(config.startDelay)

		// --- ЭТАП 1: Скролл до "Десерты" (минус отступ) ---
		let dessertsPos = 0
		if (dessertsLabel) {
			// offsetTop родителя заголовка + сам заголовок - отступ
			// Учитываем sticky header (примерно 50px) + желаемый отступ (50px)
			// Если header перекрывает, можно увеличить вычитаемое число
			const stickyHeaderHeight = 0
			dessertsPos =
				dessertsLabel.parentElement.offsetTop -
				config.scrollOffset -
				stickyHeaderHeight
			if (dessertsPos < 0) dessertsPos = 0
		}

		// Используем кастомный скролл для контроля "плавности" (скорости)
		await smoothScrollTo(dessertsPos, config.scrollSpeed)

		// --- ЭТАП 2 (Триггер 1) ---
		itemGroup1.classList.add('is-active')
		if (neighborImg1) neighborImg1.classList.add('is-scaled-neighbor') // Scale 0.85
		setTableActive(1)

		await wait(config.animSpeed + 500) // Ждем завершения анимации + небольшая пауза

		// --- ЭТАП 3: Скролл в низ ---
		// Скроллим так, чтобы было видно самый низ (scrollHeight - clientHeight)
		const maxScroll = wrapper.scrollHeight - wrapper.clientHeight
		await smoothScrollTo(maxScroll, config.scrollSpeed)

		// --- ЭТАП 4 (Триггер 2) ---
		itemGroup2.classList.add('is-active')
		if (neighborImg2) neighborImg2.classList.add('is-scaled-neighbor') // Scale 0.85
		setTableActive(2)

		await wait(config.animSpeed)

		// --- ФИНАЛ ---
		await wait(config.pauseEnd)

		// Перезапуск (рекурсия)
		runAnimationCycle()
	}

	// Запуск
	if (wrapper && dessertsLabel) {
		// На всякий случай сбрасываем стандартный css-scroll-behavior, чтобы не конфликтовал с JS
		wrapper.style.scrollBehavior = 'auto'
		runAnimationCycle()
	}
})
