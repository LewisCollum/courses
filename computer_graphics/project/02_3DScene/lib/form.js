const form = {};
(function(context) {
    context.rotate = class {
        static noZ(radians) {
            return [[Math.cos(radians), -Math.sin(radians), 0, 0],
                    [Math.sin(radians), Math.cos(radians), 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]]
        }

        static x(radians) {
            return [[1, 0, 0, 0],
                    [0, Math.cos(radians), -Math.sin(radians), 0],
                    [0, Math.sin(radians), Math.cos(radians), 0],
                    [0, 0, 0, 1]]
        }

        static y(radians) {
            return [[Math.cos(radians), 0, Math.sin(radians), 0],
                    [0, 1, 0, 0],
                    [-Math.sin(radians), 0, Math.cos(radians), 0],
                    [0, 0, 0, 1]]
        }

        static z(radians) {
            return [[Math.cos(radians), -Math.sin(radians), 0, 0],
                    [Math.sin(radians), Math.cos(radians), 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]]
        }
    }


    context.translate = class {
        static x(translation) {return this.each(translation, 0, 0)}
        static y(translation) {return this.each(0, translation, 0)}
        static z(translation) {return this.each(0, 0, translation)}
        static all(translation) {return this.each(translation, translation, translation)}
        
        static each(x, y, z) {
            return [[1, 0, 0, x],
                    [0, 1, 0, y],
                    [0, 0, 1, z],
                    [0, 0, 0, 1]]
        }

    }


    context.scale = class {
        static x(value) {
            return [[value, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]]
        }

        static y(value) {
            return [[1, 0, 0, 0],
                    [0, value, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]]
        }

        static y(value) {
            return [[1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, value, 0],
                    [0, 0, 0, 1]]
        }
        
        static each(x, y, z) {
            return [[x, 0, 0, 0],
                    [0, y, 0, 0],
                    [0, 0, z, 0],
                    [0, 0, 0, 1]]
        }    
        
        static all(scale) {
            return [[scale, 0, 0, 0],
                    [0, scale, 0, 0],
                    [0, 0, scale, 0],
                    [0, 0, 0, 1]]
        }
    }
})(form)
