import React from 'react'

function Alert(props) {
    const capitalize = (word)=>{
        if(word=== "danger"){
            word = "Error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{height: '50px'}}>
        {props.alert && <div className={`${props.alert.type == "danger" ? "bg-red-500" : "bg-blue-300"} p-4 fade show`} role="alert">
           <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg} 
        </div>}
        </div>
    )
}

export default Alert;