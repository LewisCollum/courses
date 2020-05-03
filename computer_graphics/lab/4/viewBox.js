function orthographicFromViewBox(viewBox) {
    const width = viewBox.right - viewBox.left
    const midWidth = (viewBox.right + viewBox.left)/width
    const height = viewBox.top - viewBox.bottom
    const midHeight = (viewBox.top + viewBox.bottom)/height
    const depth = viewBox.far - viewBox.near
    const midDepth = (viewBox.far + viewBox.near)/depth
    
    return [[2/width, 0, 0, -midWidth],
            [0, 2/height, 0, -midHeight],
            [0, 0, -2/depth, -midDepth],
            [0, 0, 0, 1]]
}

function perspectiveFromViewBox(viewBox) {
    const width = viewBox.right - viewBox.left
    const midWidth = (viewBox.right + viewBox.left)/width
    const height = viewBox.top - viewBox.bottom
    const midHeight = (viewBox.top + viewBox.bottom)/height
    const depth = viewBox.far - viewBox.near
    const midDepth = (viewBox.far + viewBox.near)/depth
        
    return [[2*viewBox.near/width, 0, midWidth, 0],
            [0, 2*viewBox.near/height, midHeight, 0],
            [0, 0, -midDepth, -2*viewBox.far*viewBox.near/depth],
            [0, 0, -1, 0]]
}
