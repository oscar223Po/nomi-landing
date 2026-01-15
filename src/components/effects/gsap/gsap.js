// Підключення функціоналу "Чертоги Фрілансера"
// Docs: https://www.npmjs.com/package/gsap
import { gsap, ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const initWhomAnimations = () => {
	const mm = gsap.matchMedia()
	mm.add('(min-width: 991.98px)', () => {
		const whom = document.querySelector('.whom')
		if (!whom) return

		const sections = gsap.utils.toArray('.whom__section')

		// BASIC condition of all sections
		gsap.set(sections, {
			autoAlpha: 0,
			yPercent: 0,
			scale: 1,
			zIndex: 0
		})

		// The first section is immediately visible
		gsap.set(sections[0], {
			autoAlpha: 1,
			zIndex: 1
		})

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: whom,
				start: 'top top',
				end: () => `+=${sections.length * 100}%`,
				pin: true,
				scrub: 0.6,
				anticipatePin: 1
			}
		})

		// Pause for the user to read the first screen.
		tl.to({}, { duration: 0.6 })

		sections.forEach((section, i) => {
			if (i === 0) return

			const prevSection = sections[i - 1]

			// 1. We are preparing the next section
			tl.set(section, {
				autoAlpha: 1,
				yPercent: 50,
				scale: 0.97,
				zIndex: i + 1
			})

			// 2. Floating a new section from below
			tl.to(section, {
				yPercent: 0,
				scale: 1,
				duration: 0.7,
				ease: 'expo.out'
			})

			// 3. Gentle care of the previous section
			tl.to(
				prevSection,
				{
					autoAlpha: 0,
					yPercent: -20,
					scale: 0.98,
					duration: 0.35,
					ease: 'power1.in'
				},
				'<'
			)

			// Pause between screens
			tl.to({}, { duration: 0.9 })
		})
	})
}

/* ----- Initialisation ----- */
window.addEventListener('load', () => {
	initWhomAnimations()
})
