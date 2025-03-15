import React from "react";
import './Error.css'

const MsgBox = ({ message, onClose, onCancel }) => {
    return (
        <div className="error-modal">
            <div className="error-modal-content">
                <h2>Error</h2>
                <p>{message}</p>
                <div className="error-modal-buttons">
                    <button onClick={onClose}>OK</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default MsgBox;