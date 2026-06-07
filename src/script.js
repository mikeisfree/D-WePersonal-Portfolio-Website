import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
})

gsap.to('.img-container', {
  scale: 52,
  ease: 'ease',
  scrollTrigger: {
    trigger: '.video-section',
    scrub: 1,
    start: 'top top',
    end: 'bottom',
    pin: true,
  },
})

gsap.to('.right', {
  autoAlpha: 0,
  x: 500,
  duration: 1.5,
  scrollTrigger: {
    start: 1,
  },
})
gsap.to('.left', {
  autoAlpha: 0,
  x: -500,
  duration: 1.5,
  scrollTrigger: {
    start: 1,
  },
})

gsap.to('.txt-bottom', {
  autoAlpha: 0,
  letterSpacing: -10,
  duration: 2,
  scrollTrigger: {
    start: 2,
  },
})

const tl = gsap.timeline()

tl.from('.left-side div', {
  y: 150,
  opacity: 0,
  stagger: {
    amount: 0.4,
  },
  delay: 0.5,
})
  .from('.right-side', { opacity: 0, duration: 2 }, 0.5)
  .to('.wrapper', { x: -window.innerWidth })

ScrollTrigger.create({
  animation: tl,
  trigger: '.wrapper',
  start: 'top top',
  end: '+=600',
  scrub: 1,
  pin: true,
  ease: 'ease',
})

gsap.utils.toArray('.col').forEach((image) => {
  gsap.fromTo(
    image,
    {
      opacity: 0.3,
      x: 0,
    },
    {
      opacity: 1,
      x: -50,
      scrollTrigger: {
        trigger: image,
        start: '10%',
        stagger: {
          amount: 0.4,
        },
      },
    }
  )
})

const timeline = gsap.timeline()

timeline
  .from('.title span', {
    y: 150,
    skewY: 7,
    duration: 3,
  })
  .from('.txt-bottom', {
    letterSpacing: -10,
    opacity: 0,
    duration: 3,
  })

const newTl = gsap.timeline({ delay: 1.75 })

gsap.set('.counter p', { y: 35 })

newTl.to(
  '.counter p',
  {
    y: -40,
    opacity: 1,
    duration: 0.5,
    ease: 'power3.out',
  },
  '-=0.5'
)

newTl.to('.counter p', {
  y: -80,
  opacity: 1,
  duration: 0.5,
  ease: 'power3.out',
  delay: 0.5,
})

newTl.to('.counter p', {
  y: -150,
  opacity: 1,
  duration: 0.5,
  ease: 'power3.out',
  delay: 0.5,
})

newTl.to('.counter p', {
  y: -200,
  opacity: 1,
  duration: 0.5,
  ease: 'power3.out',
  delay: 0.5,
})

newTl.to(
  '.block',
  {
    clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
    duration: 0.5,
    stagger: {
      amount: 0.5,
      from: 'random',
      ease: 'power3.out',
    },
  },
  '<'
)

const video = document.querySelector('.video-section video')
video.defaultPlaybackRate = 1.0
video.play()
video.playbackRate = 0.8

class Petal {
  constructor(config) {
    this.customClass = config.customClass || ''
    this.x = config.x || 0
    this.y = config.y || 0
    this.z = config.z || 0
    this.xSpeedVariation = config.xSpeedVariation || 0
    this.ySpeed = config.ySpeed || 0
    this.rotation = {
      axis: 'X',
      value: 0,
      speed: 0,
      x: 0,
    }
    if (config.rotation && typeof config.rotation === 'object') {
      this.rotation.axis = config.rotation.axis || this.rotation.axis
      this.rotation.value = config.rotation.value || this.rotation.value
      this.rotation.speed = config.rotation.speed || this.rotation.speed
      this.rotation.x = config.rotation.x || this.rotation.x
    }
    this.el = document.createElement('div')
    this.el.className = 'petal  ' + this.customClass
    this.el.style.position = 'absolute'
    this.el.style.backfaceVisibility = 'visible'
  }
}

class BlossomScene {
  constructor(config) {
    let container = document.getElementById(config.id)
    if (container === null) {
      throw new Error('[id] provided was not found in document')
    }
    this.container = container
    this.placeholder = document.createElement('div')
    this.petals = []
    this.numPetals = config.numPetals || 20
    this.petalsTypes = config.petalsTypes
    this.gravity = config.gravity || 0.8
    this.windMaxSpeed = config.windMaxSpeed || 4
    this.windMagnitude = 0.2
    this.windDuration = 0
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.timer = 0
    this.container.style.overflow = 'hidden'
    this.placeholder.style.transformStyle = 'preserve-3d'
    this.placeholder.style.width = this.container.offsetWidth + 'px'
    this.placeholder.style.height = this.container.offsetHeight + 'px'
    this.container.appendChild(this.placeholder)
    this.createPetals()
    requestAnimationFrame(this.updateFrame.bind(this))
  }

  resetPetal(petal) {
    petal.x = this.width * 2 - Math.random() * this.width * 1.75
    petal.y = petal.el.offsetHeight * -1
    petal.z = Math.random() * 200
    if (petal.x > this.width) {
      petal.x = this.width + petal.el.offsetWidth
      petal.y = (Math.random() * this.height) / 2
    }
    petal.rotation.speed = Math.random() * 10
    let randomAxis = Math.random()
    if (randomAxis > 0.5) {
      petal.rotation.axis = 'X'
    } else if (randomAxis > 0.25) {
      petal.rotation.axis = 'Y'
      petal.rotation.x = Math.random() * 180 + 90
    } else {
      petal.rotation.axis = 'Z'
      petal.rotation.x = Math.random() * 360 - 180
      petal.rotation.speed = Math.random() * 3
    }
    petal.xSpeedVariation = Math.random() * 0.8 - 0.4
    petal.ySpeed = Math.random() + this.gravity
    return petal
  }

  calculateWindSpeed(t, y) {
    let a =
      ((this.windMagnitude / 2) * (this.height - (2 * y) / 3)) / this.height
    return (
      a *
        Math.sin(
          ((2 * Math.PI) / this.windDuration) * t + (3 * Math.PI) / 2
        ) +
      a
    )
  }

  updatePetal(petal) {
    let petalWindSpeed = this.calculateWindSpeed(this.timer, petal.y)
    let xSpeed = petalWindSpeed + petal.xSpeedVariation
    petal.x -= xSpeed
    petal.y += petal.ySpeed
    petal.rotation.value += petal.rotation.speed
    let t =
      'translateX( ' +
      petal.x +
      'px ) translateY( ' +
      petal.y +
      'px ) translateZ( ' +
      petal.z +
      'px )  rotate' +
      petal.rotation.axis +
      '( ' +
      petal.rotation.value +
      'deg )'
    if (petal.rotation.axis !== 'X') {
      t += ' rotateX(' + petal.rotation.x + 'deg)'
    }
    petal.el.style.transform = t
    if (petal.x < -10 || petal.y > this.height + 10) {
      this.resetPetal(petal)
    }
  }

  updateWind() {
    this.windMagnitude = Math.random() * this.windMaxSpeed
    this.windDuration =
      this.windMagnitude * 50 + (Math.random() * 20 - 10)
  }

  createPetals() {
    for (let i = 0; i < this.numPetals; i++) {
      let tmpPetalType =
        this.petalsTypes[
          Math.floor(Math.random() * (this.petalsTypes.length - 1))
        ]
      let tmpPetal = new Petal({ customClass: tmpPetalType.customClass })
      this.resetPetal(tmpPetal)
      this.petals.push(tmpPetal)
      this.placeholder.appendChild(tmpPetal.el)
    }
  }

  addPetals(count = 1) {
    for (let i = 0; i < count; i++) {
      let tmpPetalType =
        this.petalsTypes[
          Math.floor(Math.random() * (this.petalsTypes.length - 1))
        ]
      let tmpPetal = new Petal({ customClass: tmpPetalType.customClass })
      this.resetPetal(tmpPetal)
      this.petals.push(tmpPetal)
      this.placeholder.appendChild(tmpPetal.el)
    }
  }

  updateFrame() {
    if (this.timer === this.windDuration) {
      this.updateWind()
      this.timer = 0
    }
    let petalsLen = this.petals.length
    for (let i = 0; i < petalsLen; i++) {
      this.updatePetal(this.petals[i])
    }
    this.timer++
    requestAnimationFrame(this.updateFrame.bind(this))
  }
}

const petalsTypes = [
  new Petal({ customClass: 'petal-style1' }),
  new Petal({ customClass: 'petal-style2' }),
  new Petal({ customClass: 'petal-style3' }),
  new Petal({ customClass: 'petal-style4' }),
]

const scene = new BlossomScene({
  id: 'blossom_container',
  petalsTypes,
})

document.addEventListener('click', (e) => {
  const container = document.getElementById('blossom_container')
  const rect = container.getBoundingClientRect()
  const isVisible = rect.bottom > 0 && rect.top < window.innerHeight
  if (isVisible) {
    scene.addPetals(3)
  }
})
