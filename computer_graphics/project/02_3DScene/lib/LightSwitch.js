class LightSwitch {
    constructor(light) {
        this.light = light
        this.onColor = this.copyColors(light.colors)
        this.offColor = {
            ambient: [0.0, 0.0, 0.0],
            diffuse: [0.0, 0.0, 0.0],
            specular: [0.0, 0.0, 0.0]
        }
        this.turnOff()
   }

    turnOn() {
        this.isOn = true
        Object.assign(this.light.colors, this.onColor)
    }

    turnOff() {
        this.isOn = false
        Object.assign(this.light.colors, this.offColor)
    }

    turnOffSpecular() {
        this.light.colors.specular = [0, 0, 0]
    }

    turnOnSpecular() {
        if (this.isOn)
            this.light.colors.specular = [...this.onColor.specular]
    }

    copyColors(colors) {
        return {
            ambient: [...colors.ambient],
            diffuse: [...colors.diffuse],
            specular: [...colors.specular]
        }
    }
}
