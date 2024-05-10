import React from 'react'

function AdminDataVisualization() {
    return (
        <div className=''>
            <iframe 
            style={{
                background: '#F1F5F4',
                border: 'none',
                borderRadius: '2px',
                boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
                width: '100vw',
                height: '100vh',
            }}
                src="https://charts.mongodb.com/charts-hacktify_internship-ttsqd/embed/dashboards?id=72796993-2e4e-43ba-9453-3a5334723e61&theme=light&autoRefresh=true&maxDataAge=60&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed">
            </iframe>
        </div>
    )
}

export default AdminDataVisualization