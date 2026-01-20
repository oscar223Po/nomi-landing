// Docs: https://www.npmjs.com/package/gsap
import Lenis from '@studio-freight/lenis'
import { gsap, ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

/* ----------
LENIS INIT
---------- */

const lenis = new Lenis({
	lerp: 0.08,
	smoothWheel: true,
	smoothTouch: false
})

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync Lenis → GSAP
lenis.on('scroll', () => {
	ScrollTrigger.update()
})

/* ----------
SCROLLTRIGGER PROXY
---------- */

ScrollTrigger.scrollerProxy(window, {
	scrollTop(value) {
		if (arguments.length) {
			lenis.scrollTo(value, { immediate: true })
		} else {
			return window.scrollY
		}
	},
	getBoundingClientRect() {
		return {
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight
		}
	}
})

/* ----------
WHOM ANIMATION
---------- */

const initWhomAnimations = () => {
	const mm = gsap.matchMedia()

	mm.add('(min-width: 991.98px)', () => {
		const whom = document.querySelector('.whom')
		if (!whom) return

		const sections = gsap.utils.toArray('.whom__section')

		// Base condition
		gsap.set(sections, {
			autoAlpha: 0,
			yPercent: 0,
			scale: 1,
			filter: 'blur(0px)',
			zIndex: 0
		})

		// First card
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
				scrub: 1,
				anticipatePin: 1
			}
		})

		// Pause on first screen
		tl.to({}, { duration: 0.6 })

		sections.forEach((section, i) => {
			if (i === 0) return

			const prev = sections[i - 1]

			// Prepare new card
			tl.set(section, {
				autoAlpha: 0,
				yPercent: 50,
				scale: 0.96,
				filter: 'blur(0px)',
				zIndex: i + 1
			})

			// From down
			tl.to(section, {
				autoAlpha: 1,
				yPercent: 0,
				scale: 1,
				duration: 0.9,
				ease: 'expo.out'
			})

			// Blure + Opacity
			tl.to(
				prev,
				{
					autoAlpha: 0,
					yPercent: -15,
					scale: 0.98,
					filter: 'blur(8px)',
					duration: 0.45,
					ease: 'power1.in'
				},
				'<'
			)

			// Pause
			tl.to({}, { duration: 1 })
		})

		ScrollTrigger.refresh()
	})
}

/* ----------
INIT
---------- */

window.addEventListener('load', () => {
	initWhomAnimations()
})
