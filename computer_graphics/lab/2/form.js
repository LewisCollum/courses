const form = {};
(function(context) {
    context.Rotate = class {
        static noZ(radians) {
            return [[Math.cos(radians), -Math.sin(radians), 0, 0],
                    [Math.sin(radians), Math.cos(radians), 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]]
        }
    }


    context.Translate = class {
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


    context.Scale = class {
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
