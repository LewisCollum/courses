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

    context.currentMillis = 0
    context.updateMillis = 0
    context.increaseUpdateMillis = function(millis) {
        context.updateMillis += millis
    }
    
    context.onFrameEvent = function(millis) {
        if (millis > context.currentMillis + context.updateMillis) {
            context.currentMillis = millis
            frameEventDispatcher.dispatchEvent()
        }
        requestAnimFrame(context.onFrameEvent)
    }
})(frameEventDispatcher);
