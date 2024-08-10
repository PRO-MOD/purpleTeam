import React from 'react'
import HeaderFooter from './HeaderFooter'
import ReportConfigModal from './ReportConfigModal'
import ReportConfigTable from './ReportConfigTable'

const ConfigMain = ({ reportId }) => {
    return (
        <div>
            <ReportConfigTable reportId={reportId} />
        </div>
    )
}

export default ConfigMain