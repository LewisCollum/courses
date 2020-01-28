function drawTriangle() {
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    var gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    // Enter array set up code here
    
    
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    
    
    
    // Create shader program, needs vertex and fragment shader code
    // in GLSL to be written in HTML file
    
    
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    
    
    
    
    // Force a draw of the triangle using the
    // 'drawArrays()' call
    
}

