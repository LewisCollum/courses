class LightSwitch {
    constructor(light) {
        this.light = light
        this.offColor = {
            ambient: [0.0, 0.0, 0.0],
            diffuse: [0.0, 0.0, 0.0],
            specular: [0.0, 0.0, 0.0]
        }
        this.turnOff()
   }

    turnOn() {
        this.isOn = true
        this.light.color = Object.assign({}, this.light.onColor)
    }

    turnOff() {
        this.isOn = false
        this.light.color = this.offColor
    }

    turnOffSpecular() {
        this.light.color.specular = [0.0, 0.0, 0.0]
    }

    turnOnSpecular() {
        if (this.isOn)
            this.light.color.specular = this.light.onColor.specular
    }    
}
