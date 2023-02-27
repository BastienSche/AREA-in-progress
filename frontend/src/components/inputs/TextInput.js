import { useState } from "react";

const TextInput = ({ id, key, type, gridSize, initialValue, labelValue, labelInline }) => {

    const [inputValue, setInputValue] = useState(initialValue);

    return (
        <div
            id={ id + "-type-" + labelValue }
            key={ key + "-type-" + labelValue }
            className={ "input-div size-" + gridSize + (labelInline ? " label-inline" : "") }>
                { labelValue !== "" && <p>{ labelValue }</p> }
                <input onChange={ (e) => setInputValue(e.target.value) } className="flex-input" type={ type } value={ inputValue } />
        </div>
    );
}
 
export default TextInput;