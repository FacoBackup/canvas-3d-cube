import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import useMesh from "./hooks/useMesh";
import useCameraMovement from "./hooks/useCameraMovement";

export default function Canvas(props) {
    const [width, setWidth] = useState(500)
    const [height, setHeight] = useState(500)
    let resizeObs
    const target = useRef()
    const callback = () => {
        setWidth(target.current.parentNode.offsetWidth)
        setHeight(target.current.parentNode.offsetHeight)
    }
    const camera = useCameraMovement(target.current?.parentNode)
    const engine = useMesh(props.modelFile, target.current)


    useEffect(() => {

        resizeObs = new ResizeObserver(callback)
        resizeObs.observe(target.current.parentNode)
    }, [])

    useEffect(() => {
        if (engine) {
            engine.camera = camera
            engine.draw(true)
            let targetAngle = 0.001

            const step = () => {

                engine.meshes.forEach(el => {
                    // el.rotate('x', targetAngle)
                    el.rotate('y', targetAngle)
                    el.rotate('z', targetAngle/2)
                })
                engine.draw()
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step)
        }
    }, [engine, camera])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            overflow: 'hidden',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <canvas width={width} height={height} ref={target} style={{border: 'blue 2px solid'}}/>
        </div>
    )
}

Canvas.propTypes = {
    modelFile: PropTypes.string
}