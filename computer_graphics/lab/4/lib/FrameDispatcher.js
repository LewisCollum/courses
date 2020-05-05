FrameDispatcher = {};
(function(context) {
    listeners = [] 
    renderingListeners = []
    lastMillis = 0    
    currentMillis = 0
    updateMillis = 0    

    context.setUpdateMillis = function(millis) {
        updateMillis = millis
    }
    
    context.addListener = function(listeningFunction) {
        listeners.push(listeningFunction)
    }
    
    context.addRenderingListener = function(listeningFunction) {
        renderingListeners.push(listeningFunction)
    }
    
    dispatch = function(event) {
        listeners.forEach(listener => listener(event))
        renderingListeners.forEach(listener => listener(event))
    }

    context.dt = function() {
        return currentMillis - lastMillis
    }

    context.millis = function() {
        return currentMillis
    }

    context.begin = function() {
        onFrame()
    }    
    
    onFrame = function(millis) {
        currentMillis = millis
        if (context.dt() > updateMillis) {
            dispatch()
            lastMillis = currentMillis            
        }
        requestAnimFrame(onFrame)
    }
})(FrameDispatcher);
