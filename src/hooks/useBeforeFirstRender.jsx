import React, {useState, useEffect} from 'react'

export default (func) => {
    const [hasRendered, setHasRendered] = useState(false);
    useEffect(() => setHasRendered(true), [hasRendered])

    if(!hasRendered){
        func()
    }

}
 
