const canvas = document.querySelector('canvas')


canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')



window.addEventListener('resize', function() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
})

Branch = function(x, y, radius, generation, id, angle, spdY, color) {
  this.id = id
  this.x = x
  this.y = y
  this.radius = radius
  this.speedX = canvas.width / 500
  this.speedY = spdY
  this.superAngle = angle
  this.angle = Math.PI / this.superAngle
  this.generation = generation
  this.distance = 0
  this.color = color
  this.lastX = x
  this.lastY = y

  this.update = function() {
    this.draw()
    this.math()
    this.split()
  }

  this.draw = function() {
    ctx.beginPath()
    ctx.shadowColor = this.color
    ctx.shadowBlur = 10
    ctx.strokeStyle = this.color
    ctx.fillStyle = this.color
    ctx.moveTo(this.x, this.y)
    ctx.arc(this.x, this.y, this.radius, 1.5, .5 * Math.PI, true)
    ctx.closePath()
    ctx.fill()
  }

  this.math = function() {
    this.lastX = this.x
    this.lastY = this.y
    this.x += this.speedX * Math.cos(this.angle)
    this.y += this.speedY * Math.sin(this.angle)
    this.radius *= (0.992 - this.generation / (canvas.width / 3))
    let deltaDistance = Math.sqrt(Math.abs(this.lastX - this.x) + Math.abs(this.lastY - this.y))
    this.distance += deltaDistance
    this.angle += Math.random() / 5 - 1 / 5 / 3
    if (this.speed > this.radius * 2) {
      this.speed = this.radius * 2
    }

    if (this.radius < 1.25) {
      let color = "rgba(240,109,48,1)"
      if (this.color === "rgba(0,0,0,1)") {
        color = "rgba(71,59,240,1)"
      }
      let x = this.x
      let y = this.y
      let fId = flowerNum
      FLOWER_LIST[flowerNum] = new Flower(x, y, fId, color)
      flowerNum++

      delete BRANCH_LIST[this.id]

    }
  }
  this.split = function() {
    let splitChance = 0
    if (this.generation == 0)
      splitChance = (this.distance - canvas.width / 100) / 100
    else if (this.generation < 3)
      splitChance = (this.distance - canvas.height / 6) / 100
    else if (this.generation < 5) {
      splitChance = (this.distance - canvas.height / 1) / 100
    }
    if (Math.random() < splitChance) {
      let n = 2 + Math.round(Math.random() * 2.5)
      for (let i = 0; i < n; i++) {
        branchNum++
        let x = this.x
        let y = this.y
        let radius = this.radius * 0.9
        let generation = this.generation++
          let angle = this.superAngle
        let spdY = this.speedY
        let color = this.color
        BRANCH_LIST[branchNum] = new Branch(x, y, radius, generation, branchNum, angle, spdY, color)
      }
    }
  }

}

function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key))
      return false
  }
  return true
}

const flowerDir = [.3, -.3, 0]


Flower = function(x, y, id, color) {
  this.id = id
  this.x = x
  this.y = y
  this.x2 = x
  this.y2 = y
  this.radius = .1
  this.dirY = flowerDir[(Math.floor(Math.random() * 3))]
  this.dirX = flowerDir[(Math.floor(Math.random() * 2))]
  this.growing = true
  this.color = color
  this.dirY2 = flowerDir[(Math.floor(Math.random() * 3))]
  this.dirX2 = flowerDir[(Math.floor(Math.random() * 2))]

  this.update = function() {
    if (this.radius >= 3) {
      this.growing = false
    }
    if (this.growing === true) {
      this.radius += .2
    } else {
      this.radius -= .150
    }
    if (this.radius <= .3 && this.growing === false) {
      delete FLOWER_LIST[this.id]
    }
    this.draw()
  }

  this.draw = function() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.x + this.radius / 2, this.y + this.radius / 2)
    ctx.lineTo(this.x - this.radius / 2, this.y - this.radius / 2)
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fill()

    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.x2 + this.radius / 2, this.y2 + this.radius / 2)
    ctx.lineTo(this.x2 - this.radius / 2, this.y2 - this.radius / 2)
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(this.x2, this.y2, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fill()
    ctx.fillStyle = "black"

    ctx.shadowBlur = 0

    this.x += this.dirX
    this.y += this.dirY
    this.x2 -= this.dirX2
    this.y2 -= this.dirY2
  }
}




let FLOWER_LIST = {}
let flowerNum = 0
let BRANCH_LIST = {}
let branchNum = 0
let grd = ctx.createLinearGradient(0, 0, canvas.width, 0)
grd.addColorStop(0.4, "rgba(0,0,0,1)")
grd.addColorStop(.6, "rgba(255,255,255,0)")

function init() {
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.shadowColor = "rgba(0,0,0,1)"
  ctx.shadowBlur = 1000
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.fillRect(0, 0, canvas.width * .3, canvas.height)

  branchNum = 0
  flowerNum = 0
  BRANCH_LIST = {}
  FLOWER_LIST = {}

  let x = canvas.width
  let y = canvas.height / 2
  let radius = canvas.width / 30
  let generation = 0
  let angle = 1.35
  let spdY = -canvas.width / 500
  let color = "rgba(0,0,0,1)"
  BRANCH_LIST[branchNum] = new Branch(x, y, radius, generation, branchNum, angle, spdY, color)
  branchNum++
  x = -canvas.width / 40
  y = canvas.height / 2
  angle = -3.9
  spdY = canvas.width / 500
  color = "rgba(255,255,255,1)"
  BRANCH_LIST[branchNum] = new Branch(x, y, radius, generation, branchNum, angle, spdY, color)
}



function animate() {
  requestAnimationFrame(animate)
  // ctx.clearRect(0, 0, innerWidth, innerHeight)
  if (isEmpty(BRANCH_LIST)) {
    for (let i in FLOWER_LIST) {
      FLOWER_LIST[i].update()
    }
  } else {
    for (let i in BRANCH_LIST) {
      BRANCH_LIST[i].update()
    }
  }
  if (isEmpty(FLOWER_LIST) && isEmpty(BRANCH_LIST)) {
    // ctx.font = "50px Arial"
    // ctx.textAlign = "center"
    // ctx.strokeStyle = grd
    // ctx.strokeText("Job Smith",canvas.width/2,canvas.height/2)
  }
}


init()
animate()
