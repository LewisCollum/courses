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
})(frameEventDispatcher);
