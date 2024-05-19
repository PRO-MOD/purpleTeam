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
                width: '98vw',
                height: '100vh',
            }}
                src="https://charts.mongodb.com/charts-cyber_suraksha-ibxyqpa/embed/dashboards?id=42dac8e8-7a9a-4355-ac47-e56e5d842866&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed&attribution=false">
            </iframe>
        </div>
    )
}

export default AdminDataVisualization