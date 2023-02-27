import PropTypes from 'prop-types';
import TextInput from './TextInput';

const Input = ({ inputs, justifyContent="flex-start", alignItems="flex-start" }) => {
    return (
        <div className={ "input-container justify-" + justifyContent + " align-" + alignItems }>
            { inputs?.map((input, ) => {
                switch (input?.type) {

                    case 'text':
                        return (
                            <TextInput
                                id={ input?.id }
                                type={ input?.type }
                                gridSize={ input?.gridSize }
                                initialValue={ input?.initialValue }
                                labelValue={ input?.labelValue }
                                labelInline={ input?.labelInline }
                            />
                        );

                    // case 'paragraph':
                        
                    //     return (
                    //         <div className={"input-cont size-" + input?.gridSize}>
                    //             <input type={input?.type}>

                    //             </input>
                    //         </div>
                    //     );

                    case 'password':
                        return (
                            <TextInput
                                id={ input?.id }
                                type={ input?.type }
                                gridSize={ input?.gridSize }
                                initialValue={ input?.initialValue }
                                labelValue={ input?.labelValue }
                                labelInline={ input?.labelInline }
                            />
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

Input.propTypes = {
    inputs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        gridSize: PropTypes.number.isRequired,
        initialValue: PropTypes.string.isRequired,
        labelValue: PropTypes.string.isRequired,
        labelInline: PropTypes.bool.isRequired,
    })).isRequired,
};

Input.defaultProps = {
    inputs: [
        {
            id: 1,
            type: 'text',
            gridSize: 12, 
            initialValue: '', 
            labelValue: '',
            labelInline: false, 
        }
    ]
};

export default Input;