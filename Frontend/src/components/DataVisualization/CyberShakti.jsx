import React from "react";

const CyberShakti = () => {
  return (
    <div className="bg-gray-100 h-screen w-screen flex items-center justify-center">
       <iframe
        style={{
          background: "#F1F5F4",
          border: "none",
          borderRadius: "2px",
          boxShadow: "0 2px 10px 0 rgba(70, 76, 79, 0.2)",
          width: "100vw",
          height: "100vh",
        }}
        src="https://charts.mongodb.com/charts-cybershakti_scores-sohldsj/embed/dashboards?id=fd838a12-8b6f-4ff9-bd24-727a8693cf77&theme=light&autoRefresh=true&maxDataAge=60&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
        title="MongoDB Charts Dashboard"
      />
      </div>
  );
};

export default CyberShakti;
