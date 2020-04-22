frameEventDispatcher = {};
(function(context) {
    context.handlers = [] 
    context.renderingHandlers = []

    context.addEventListener = function(listeningFunction) {
        this.handlers.push(listeningFunction)
    }
    
    context.addRenderingListener = function(listeningFunction) {
        this.renderingHandlers.push(listeningFunction)
    }
    
    context.dispatchEvent = function(event) {
        this.handlers.forEach(handler => handler(event))
        this.renderingHandlers.forEach(handler => handler(event))
    }

    context.lastMillis = 0    
    context.currentMillis = 0
    context.updateMillis = 0
    context.increaseUpdateMillis = function(millis) {
        context.updateMillis += millis
    }

    context.dt = function() {
        return context.currentMillis - context.lastMillis
    }
    
    context.onFrameEvent = function(millis) {
        context.currentMillis = millis
        if (context.dt() > context.updateMillis) {
            frameEventDispatcher.dispatchEvent()
            context.lastMillis = context.currentMillis            
        }
        requestAnimFrame(context.onFrameEvent)
    }
})(frameEventDispatcher);
