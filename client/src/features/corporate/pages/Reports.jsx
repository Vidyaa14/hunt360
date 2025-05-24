/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
//responsive tailwindcss
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';
import { useEffect, useRef, useState } from 'react';

const baseURL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/corporate`
    : 'http://localhost:3000/api/corporate';

function NewReportForm({
    onClose,
    leadStatusData,
    communicationStatusData,
    cityLeadData,
    stateBdData,
}) {
    const leadStatusChartRef = useRef(null);
    const communicationStatusChartRef = useRef(null);
    const cityLeadChartRef = useRef(null);
    const stateBdChartRef = useRef(null);

    const leadStatusChartInstance = useRef(null);
    const communicationStatusChartInstance = useRef(null);
    const cityLeadChartInstance = useRef(null);
    const stateBdChartInstance = useRef(null);

    useEffect(() => {
        if (leadStatusData && leadStatusData.length > 0) {
            if (leadStatusChartInstance.current) {
                leadStatusChartInstance.current.destroy();
            }
            leadStatusChartInstance.current = new Chart(
                leadStatusChartRef.current.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: leadStatusData.map(
                            (item) => item.lead_status || 'Unknown'
                        ),
                        datasets: [
                            {
                                label: 'Lead Count',
                                data: leadStatusData.map((item) => item.count),
                                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Lead Status Distribution',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Count' },
                            },
                            x: {
                                title: { display: true, text: 'Lead Status' },
                            },
                        },
                    },
                }
            );
        }
    }, [leadStatusData]);

    useEffect(() => {
        if (communicationStatusData && communicationStatusData.length > 0) {
            if (communicationStatusChartInstance.current) {
                communicationStatusChartInstance.current.destroy();
            }
            communicationStatusChartInstance.current = new Chart(
                communicationStatusChartRef.current.getContext('2d'),
                {
                    type: 'pie',
                    data: {
                        labels: communicationStatusData.map(
                            (item) => item.communication_status || 'Unknown'
                        ),
                        datasets: [
                            {
                                label: 'Communication Count',
                                data: communicationStatusData.map(
                                    (item) => item.count
                                ),
                                backgroundColor: [
                                    '#f28b82',
                                    '#81e6d9',
                                    '#facc15',
                                    '#60a5fa',
                                    '#ff99ac',
                                ],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Communication Status Overview',
                            },
                            legend: { display: false },
                        },
                    },
                }
            );
        }
    }, [communicationStatusData]);

    useEffect(() => {
        if (cityLeadData && cityLeadData.length > 0) {
            if (cityLeadChartInstance.current) {
                cityLeadChartInstance.current.destroy();
            }
            cityLeadChartInstance.current = new Chart(
                cityLeadChartRef.current.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: cityLeadData.map(
                            (item) => item.location || 'Unknown'
                        ),
                        datasets: [
                            {
                                label: 'Lead Count',
                                data: cityLeadData.map((item) => item.count),
                                backgroundColor: 'rgba(153, 102, 255, 0.7)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'location-wise Lead Count',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Count' },
                            },
                            x: { title: { display: true, text: 'location' } },
                        },
                    },
                }
            );
        }
    }, [cityLeadData]);

    useEffect(() => {
        if (stateBdData && stateBdData.length > 0) {
            if (stateBdChartInstance.current) {
                stateBdChartInstance.current.destroy();
            }
            stateBdChartInstance.current = new Chart(
                stateBdChartRef.current.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: stateBdData.map(
                            (item) => item.state || 'Unknown'
                        ),
                        datasets: [
                            {
                                label: 'Activity Count',
                                data: stateBdData.map((item) => item.count),
                                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'State-wise BD Activities',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Count' },
                            },
                            x: { title: { display: true, text: 'State' } },
                        },
                    },
                }
            );
        }
    }, [stateBdData]);

    const handleDownloadPdf = () => {
        const element = document.getElementById('report-preview');

        const convertCanvasToImage = async (canvasId) => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                return new Promise((resolve) => {
                    const dataUrl = canvas.toDataURL('image/png');
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = () => resolve(img);
                });
            }
            return null;
        };

        Promise.all([
            convertCanvasToImage('modal-leadStatusChart'),
            convertCanvasToImage('modal-communicationStatusChart'),
            convertCanvasToImage('modal-cityLeadChart'),
            convertCanvasToImage('modal-stateBdChart'),
        ]).then(([leadStatusImg, commStatusImg, cityLeadImg, stateBdImg]) => {
            const opt = {
                margin: 0.5,
                filename: 'report_preview.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait',
                },
            };

            const pdfStyles = `
        <style>
          .pdf-report-header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #6a0080; 
            padding-bottom: 10px; 
          }
          .pdf-report-header h1 { 
            font-size: 24px; 
            color: #4c1d95; 
            margin: 0; 
          }
          .pdf-report-header p { 
            font-size: 14px; 
            color: #666; 
            margin: 5px 0 0; 
          }
          .pdf-chart-section { 
            background: #fff; 
            padding: 15px; 
            border: 1px solid #e0e0e0; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); 
            margin-bottom: 20px; 
            page-break-inside: avoid; 
            width: 100%; 
            overflow: hidden; 
          }
          .pdf-chart-section img { 
            max-width: 100%; 
            height: 250px !important; 
            margin: 0 auto; 
            display: block; 
          }
          .pdf-pie-chart-container { 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: space-between; 
          }
          .pdf-pie-chart-container img { 
            width: 250px !important; 
            height: 250px !important; 
          }
          .pdf-chart-legend { 
            margin-top: 10px; 
            display: flex; 
            flex-direction: column; 
            gap: 5px; 
            padding-left: 10px; 
          }
          .pdf-legend-item { 
            display: flex; 
            align-items: center; 
            font-size: 12px; 
            color: #333; 
            line-height: 1.5; 
          }
          .pdf-legend-item .pdf-legend-color { 
            width: 12px; 
            height: 12px; 
            display: inline-block; 
            margin-right: 8px; 
            border-radius: 2px; 
          }
          .pdf-legend-item.pending-call .pdf-legend-color { background-color: #f28b82; }
          .pdf-legend-item.unknown .pdf-legend-color { background-color: #81e6d9; }
          .pdf-legend-item.follow-up-needed .pdf-legend-color { background-color: #facc15; }
          .pdf-legend-item.not-interested .pdf-legend-color { background-color: #60a5fa; }
          .pdf-legend-item.interested .pdf-legend-color { background-color: #ff99ac; }
          .pdf-watermark { 
            position: absolute; 
            bottom: 10px; 
            right: 10px; 
            font-size: 16px; 
            color: #6a0080; 
            opacity: 0.3; 
            transform: rotate(-45deg); 
          }
        </style>
      `;

            const pdfContent = document.createElement('div');
            pdfContent.innerHTML = `
        ${pdfStyles}
        <div class="pdf-report-header">
          <h1>Talent Corner Corporate Data Search Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="pdf-chart-section">
          ${leadStatusImg ? `<img src="${leadStatusImg.src}" alt="Lead Status Distribution" />` : '<p>Chart not available</p>'}
        </div>
        <div class="pdf-chart-section pdf-pie-chart-container">
          ${commStatusImg ? `<img src="${commStatusImg.src}" alt="Communication Status Overview" />` : '<p>Chart not available</p>'}
          <div class="pdf-chart-legend">
            <div class="pdf-legend-item pending-call">
              <span class="pdf-legend-color"></span>
              Pending Call
            </div>
            <div class="pdf-legend-item unknown">
              <span class="pdf-legend-color"></span>
              Unknown
            </div>
            <div class="pdf-legend-item follow-up-needed">
              <span class="pdf-legend-color"></span>
              Follow-up needed
            </div>
            <div class="pdf-legend-item not-interested">
              <span class="pdf-legend-color"></span>
              Not Interested
            </div>
            <div class="pdf-legend-item interested">
              <span class="pdf-legend-color"></span>
              Interested
            </div>
          </div>
        </div>
        <div class="pdf-chart-section">
          ${cityLeadImg ? `<img src="${cityLeadImg.src}" alt="location-wise Lead Count" />` : '<p>Chart not available</p>'}
        </div>
        <div class="pdf-chart-section">
          ${stateBdImg ? `<img src="${stateBdImg.src}" alt="State-wise BD Activities" />` : '<p>Chart not available</p>'}
        </div>
        <div class="pdf-watermark">talent<br />corner</div>
      `;

            html2pdf()
                .set(opt)
                .from(pdfContent)
                .save()
                .then(() => {
                    onClose();
                });
        });
    };

    return (
        <div className="fixed inset-0 w-full bg-black/50 flex justify-center items-center z-[1000]">
            <div className="bg-white p-3 sm:p-4 rounded-lg w-full max-w-[95%] sm:max-w-[900px] shadow-[0_6px_20px_rgba(0,0,0,0.15)] relative overflow-y-auto max-h-[90vh] font-arial">
                <button
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-transparent border-none text-xl sm:text-2xl cursor-pointer text-[#666] hover:text-[#333] transition-colors duration-200"
                    onClick={onClose}
                >
                    ×
                </button>
                <h3 className="text-lg sm:text-[1.75rem] text-[#4c1d95] mb-1 sm:mb-2 text-center bg-[#f3e8ff] p-1 sm:p-2 border-b-2 border-[#6a0080] rounded font-semibold">
                    Report Preview
                </h3>
                <p className="text-xs sm:text-[0.9rem] text-[#666] text-center mb-4 sm:mb-8">
                    Overview of Key Metrics and Trends
                </p>
                <div className="Rreport-preview-area" id="report-preview">
                    <div className="Rgraph-container report-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                        <div className="chart-section report-panel bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Lead Status Distribution
                            </h4>
                            <canvas
                                id="modal-leadStatusChart"
                                ref={leadStatusChartRef}
                                className="max-w-full h-[250px] sm:h-[300px]"
                            ></canvas>
                        </div>
                        <div className="chart-section report-panel pie-chart-container bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px] flex flex-col items-center justify-center h-[300px] sm:h-[350px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Communication Status Overview
                            </h4>
                            <canvas
                                id="modal-communicationStatusChart"
                                ref={communicationStatusChartRef}
                                className="w-[250px] sm:w-[300px] h-[250px] sm:h-[300px]"
                            ></canvas>
                            <div className="chart-legend mt-2 sm:mt-0">
                                <div className="legend-item pending-call flex items-center text-xs sm:text-sm">
                                    <span className="legend-color w-3 h-3 sm:w-4 sm:h-4 inline-block mr-2 rounded-sm bg-[#f28b82]"></span>
                                    Pending Call
                                </div>
                                <div className="legend-item unknown flex items-center text-xs sm:text-sm">
                                    <span className="legend-color w-3 h-3 sm:w-4 sm:h-4 inline-block mr-2 rounded-sm bg-[#81e6d9]"></span>
                                    Unknown
                                </div>
                                <div className="legend-item follow-up-needed flex items-center text-xs sm:text-sm">
                                    <span className="legend-color w-3 h-3 sm:w-4 sm:h-4 inline-block mr-2 rounded-sm bg-[#facc15]"></span>
                                    Follow-up needed
                                </div>
                                <div className="legend-item not-interested flex items-center text-xs sm:text-sm">
                                    <span className="legend-color w-3 h-3 sm:w-4 sm:h-4 inline-block mr-2 rounded-sm bg-[#60a5fa]"></span>
                                    Not Interested
                                </div>
                                <div className="legend-item interested flex items-center text-xs sm:text-sm">
                                    <span className="legend-color w-3 h-3 sm:w-4 sm:h-4 inline-block mr-2 rounded-sm bg-[#ff99ac]"></span>
                                    Interested
                                </div>
                            </div>
                        </div>
                        <div className="chart-section report-panel bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Location-wise Lead Count
                            </h4>
                            <canvas
                                id="modal-cityLeadChart"
                                ref={cityLeadChartRef}
                                className="max-w-full h-[250px] sm:h-[300px]"
                            ></canvas>
                        </div>
                        <div className="chart-section report-panel bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                State-wise BD Activities
                            </h4>
                            <canvas
                                id="modal-stateBdChart"
                                ref={stateBdChartRef}
                                className="max-w-full h-[250px] sm:h-[300px]"
                            ></canvas>
                        </div>
                    </div>
                </div>
                <div className="Rdownload-options mt-4 sm:mt-6">
                    <h4 className="text-base sm:text-lg font-semibold text-[#4c1d95] mb-2">
                        Download Options
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                        <button
                            className="bg-[#6a0080] text-white py-2 sm:py-[0.6rem] px-4 sm:px-6 rounded-md font-medium text-sm sm:text-base hover:bg-[#4e005c] w-full sm:w-[180px]"
                            onClick={handleDownloadPdf}
                        >
                            Download as PDF
                        </button>
                        <button
                            className="bg-[#e53e3e] text-white py-2 sm:py-[0.6rem] px-4 sm:px-6 rounded-md font-medium text-sm sm:text-base hover:bg-[#c53030] w-full sm:w-[180px]"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="Rtips-section mt-4 sm:mt-6">
                    <h4 className="text-base sm:text-lg font-semibold text-[#4c1d95] mb-2">
                        Tips for Best Results
                    </h4>
                    <p className="text-xs sm:text-[0.9rem] text-[#666]">
                        Ensure all data is up to date before downloading. For
                        large reports, allow extra time for conversion.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Reports() {
    const leadStatusChartRef = useRef(null);
    const communicationStatusChartRef = useRef(null);
    const cityLeadChartRef = useRef(null);
    const stateBdChartRef = useRef(null);

    const leadStatusChartInstance = useRef(null);
    const communicationStatusChartInstance = useRef(null);
    const cityLeadChartInstance = useRef(null);
    const stateBdChartInstance = useRef(null);

    const [leadStatusData, setLeadStatusData] = useState([]);
    const [communicationStatusData, setCommunicationStatusData] = useState([]);
    const [cityLeadData, setCityLeadData] = useState([]);
    const [stateBdData, setStateBdData] = useState([]);

    const [filters, setFilters] = useState({
        name: '',
        location: '',
        communication_status: '',
        lead_status: '',
        bd_name: '',
        state: '',
    });

    const [isReportFormVisible, setIsReportFormVisible] = useState(false);

    const [summary, setSummary] = useState({
        hrContacts: 0,
        campaigns: 0,
        recordsEdited: 0,
    });
    const [latestCommunication, setLatestCommunication] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchAllChartData();
    };

    const handleClear = () => {
        setFilters({
            name: '',
            location: '',
            communication_status: '',
            lead_status: '',
            bd_name: '',
            state: '',
        });
        fetchAllChartData();
    };

    const fetchAllChartData = () => {
        const params = new URLSearchParams(filters).toString();

        axios
            .get(`${baseURL}/lead-status-distribution?${params}`)
            .then((res) => setLeadStatusData(res.data.chartData))
            .catch((err) =>
                console.error('Failed to fetch lead status data:', err)
            );

        axios
            .get(`${baseURL}/communication-status-overview?${params}`)
            .then((res) => setCommunicationStatusData(res.data.chartData))
            .catch((err) =>
                console.error('Failed to fetch communication status data:', err)
            );

        axios
            .get(`${baseURL}/location-wise-lead-count?${params}`)
            .then((res) => setCityLeadData(res.data.chartData))
            .catch((err) =>
                console.error('Failed to fetch location lead data:', err)
            );

        axios
            .get(`${baseURL}/state-wise-bd-activities?${params}`)
            .then((res) => setStateBdData(res.data.chartData))
            .catch((err) =>
                console.error('Failed to fetch state BD data:', err)
            );
    };

    useEffect(() => {
        axios
            .get(`${baseURL}/report-summary`)
            .then((res) => setSummary(res.data))
            .catch((err) =>
                console.error('Failed to load report summary:', err)
            );

        axios
            .get(`${baseURL}/latest-communication`)
            .then((res) => setLatestCommunication(res.data))
            .catch((err) =>
                console.error('Failed to fetch latest communication:', err)
            );

        fetchAllChartData();
    }, []);

    useEffect(() => {
        if (!leadStatusData || leadStatusData.length === 0) {
            if (leadStatusChartInstance.current) {
                leadStatusChartInstance.current.destroy();
                leadStatusChartInstance.current = null;
            }
            return;
        }

        if (leadStatusChartInstance.current) {
            leadStatusChartInstance.current.destroy();
        }

        leadStatusChartInstance.current = new Chart(
            leadStatusChartRef.current.getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: leadStatusData.map(
                        (item) => item.lead_status || 'Unknown'
                    ),
                    datasets: [
                        {
                            label: 'Lead Count',
                            data: leadStatusData.map((item) => item.count),
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Lead Status Distribution',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Count' },
                        },
                        x: { title: { display: true, text: 'Lead Status' } },
                    },
                },
            }
        );
    }, [leadStatusData]);

    useEffect(() => {
        if (!communicationStatusData || communicationStatusData.length === 0) {
            if (communicationStatusChartInstance.current) {
                communicationStatusChartInstance.current.destroy();
                communicationStatusChartInstance.current = null;
            }
            return;
        }

        if (communicationStatusChartInstance.current) {
            communicationStatusChartInstance.current.destroy();
        }

        communicationStatusChartInstance.current = new Chart(
            communicationStatusChartRef.current.getContext('2d'),
            {
                type: 'pie',
                data: {
                    labels: communicationStatusData.map(
                        (item) => item.communication_status || 'Unknown'
                    ),
                    datasets: [
                        {
                            label: 'Communication Count',
                            data: communicationStatusData.map(
                                (item) => item.count
                            ),
                            backgroundColor: [
                                '#f28b82',
                                '#81e6d9',
                                '#facc15',
                                '#60a5fa',
                                '#ff99ac',
                            ],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Communication Status Overview',
                        },
                        legend: { display: false },
                    },
                },
            }
        );
    }, [communicationStatusData]);

    useEffect(() => {
        if (!cityLeadData || cityLeadData.length === 0) {
            if (cityLeadChartInstance.current) {
                cityLeadChartInstance.current.destroy();
                cityLeadChartInstance.current = null;
            }
            return;
        }

        if (cityLeadChartInstance.current) {
            cityLeadChartInstance.current.destroy();
        }

        cityLeadChartInstance.current = new Chart(
            cityLeadChartRef.current.getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: cityLeadData.map(
                        (item) => item.location || 'Unknown'
                    ),
                    datasets: [
                        {
                            label: 'Lead Count',
                            data: cityLeadData.map((item) => item.count),
                            backgroundColor: 'rgba(153, 102, 255, 0.7)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'location-wise Lead Count',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Count' },
                        },
                        x: { title: { display: true, text: 'location' } },
                    },
                },
            }
        );
    }, [cityLeadData]);

    useEffect(() => {
        if (!stateBdData || stateBdData.length === 0) {
            if (stateBdChartInstance.current) {
                stateBdChartInstance.current.destroy();
                stateBdChartInstance.current = null;
            }
            return;
        }

        if (stateBdChartInstance.current) {
            stateBdChartInstance.current.destroy();
        }

        stateBdChartInstance.current = new Chart(
            stateBdChartRef.current.getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: stateBdData.map((item) => item.state || 'Unknown'),
                    datasets: [
                        {
                            label: 'Activity Count',
                            data: stateBdData.map((item) => item.count),
                            backgroundColor: 'rgba(255, 159, 64, 0.7)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'State-wise BD Activities',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Count' },
                        },
                        x: { title: { display: true, text: 'State' } },
                    },
                },
            }
        );
    }, [stateBdData]);

    const handleGenerateReportClick = () => {
        setIsReportFormVisible(true);
    };

    const handleCloseReportForm = () => {
        setIsReportFormVisible(false);
    };

    return (
        <div className="bg-[#f9f9fc] text-[#1a202c] pt-8 sm:pt-[50px] p-4 sm:p-8 overflow-x-hidden">
            <main className="max-w-full sm:max-w-[1200px] mx-auto w-full flex flex-col">
                <h1 className="text-2xl sm:text-[32px] font-bold pl-2 sm:pl-[12px] mb-2 sm:mb-4">
                    Reports
                </h1>
                <h2 className="text-[#4c1d95] mb-3 sm:mb-4 text-xl sm:text-[24px] font-bold pl-2 sm:pl-[12px]">
                    Reports Overview
                </h2>
                <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-[10px] mb-6 sm:mb-8 flex-nowrap pl-2 sm:pl-[12px] overflow-x-auto mt-3 sm:mt-[16px]">
                    <div className="bg-[#f3e8ff] mt-3 sm:mt-[16px] border-l-6 border-[#6a0080] rounded-[12px] p-4 sm:p-[20px] w-full max-w-[300px] min-w-[250px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-left flex flex-col justify-between transition-transform duration-200 hover:-translate-y-[5px] gap-1 sm:gap-[6px]">
                        <h4 className="m-0 text-xs sm:text-[0.95rem] text-[#6a0080] uppercase tracking-[0.5px] font-[700]">
                            HR
                        </h4>
                        <h3 className="my-1 sm:my-[0.4rem] mt-0 mb-0 text-lg sm:text-[20px] font-[700] text-black">
                            Contacts Added
                        </h3>
                        <p className="text-xs sm:text-[0.95rem] my-1 sm:my-[0.4rem] mb-2 sm:mb-4 text-[#555]">
                            {summary.hrContacts} total HR contacts
                        </p>
                    </div>
                    <div className="bg-[#f3e8ff] mt-3 sm:mt-[16px] border-l-6 border-[#6a0080] rounded-[12px] p-4 sm:p-[20px] w-full max-w-[300px] min-w-[250px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-left flex flex-col justify-between transition-transform duration-200 hover:-translate-y-[5px] gap-1 sm:gap-[6px]">
                        <h4 className="m-0 text-xs sm:text-[0.95rem] text-[#6a0080] uppercase tracking-[0.5px] font-[700]">
                            Marketing
                        </h4>
                        <h3 className="my-1 sm:my-[0.4rem] mt-0 mb-0 text-lg sm:text-[20px] font-[700] text-black">
                            Campaigns Sent
                        </h3>
                        <p className="text-xs sm:text-[0.95rem] my-1 sm:my-[0.4rem] mb-2 sm:mb-4 text-[#555]">
                            {summary.campaigns} campaigns completed
                        </p>
                    </div>
                    <div className="bg-[#f3e8ff] mt-3 sm:mt-[16px] border-l-6 border-[#6a0080] rounded-[12px] p-4 sm:p-[20px] w-full max-w-[300px] min-w-[250px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-left flex flex-col justify-between transition-transform duration-200 hover:-translate-y-[5px] gap-1 sm:gap-[6px]">
                        <h4 className="m-0 text-xs sm:text-[0.95rem] text-[#6a0080] uppercase tracking-[0.5px] font-[700]">
                            Data Edits
                        </h4>
                        <h3 className="my-1 sm:my-[0.4rem] mt-0 mb-0 text-lg sm:text-[20px] font-[700] text-black">
                            Records Updated
                        </h3>
                        <p className="text-xs sm:text-[0.95rem] my-1 sm:my-[0.4rem] mb-2 sm:mb-4 text-[#555]">
                            {summary.recordsEdited} records edited
                        </p>
                    </div>
                </div>
                <div
                    className="flex flex-wrap gap-x-4 sm:gap-x-5 gap-y-3 items-end mb-4 sm:mb-5 pl-2 sm:pl-[12px]"
                    style={{ wordSpacing: '0.2rem' }}
                >
                    <div className="flex-1 basis-[150px] max-w-[200px] gap-1 sm:gap-[6px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            Industry
                        </label>
                        <input
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white pl-2 sm:pl-[12px] gap-1 sm:gap-[6px]"
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleChange}
                            placeholder="Enter Industry name"
                        />
                    </div>
                    <div className="flex-1 basis-[150px] max-w-[200px] gap-1 sm:gap-[6px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            Location
                        </label>
                        <input
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white gap-1 sm:gap-[6px]"
                            type="text"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="Enter city or location"
                        />
                    </div>
                    <div className="flex-1 basis-[150px] max-w-[200px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            Communication Status
                        </label>
                        <select
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white gap-1 sm:gap-[6px]"
                            name="communication_status"
                            value={filters.communication_status}
                            onChange={handleChange}
                        >
                            <option value="">-- Select --</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">
                                Not Interested
                            </option>
                            <option value="Follow-up needed">
                                Follow-up needed
                            </option>
                            <option value="Pending call">Pending call</option>
                        </select>
                    </div>
                    <div className="flex-1 basis-[150px] max-w-[200px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            Lead Status
                        </label>
                        <select
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white gap-1 sm:gap-[6px]"
                            name="lead_status"
                            value={filters.lead_status}
                            onChange={handleChange}
                        >
                            <option value="">-- Select --</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="flex-1 basis-[150px] max-w-[200px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            BD Name
                        </label>
                        <input
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white gap-1 sm:gap-[6px]"
                            type="text"
                            name="bd_name"
                            value={filters.bd_name}
                            onChange={handleChange}
                            placeholder="Enter BD name"
                        />
                    </div>
                    <div className="flex-1 basis-[150px] max-w-[200px]">
                        <label className="block mb-1 text-xs sm:text-[13px] font-medium text-[#333] mt-3 sm:mt-[16px] gap-1 sm:gap-[6px]">
                            State
                        </label>
                        <input
                            className="w-full py-1 sm:py-[6px] px-2 text-xs sm:text-sm border border-[#d3cce3] rounded-md box-border bg-white gap-1 sm:gap-[6px]"
                            type="text"
                            name="state"
                            value={filters.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[10px] mt-2 sm:mt-[10px] items-center pl-2 sm:pl-[12px]">
                    <button
                        className="bg-[#6a1b9a] pl-2 sm:pl-[12px] text-white border-none rounded-lg py-1 sm:py-[2px] px-3 sm:px-[10px] cursor-pointer font-bold text-xs sm:text-sm w-full sm:w-[150px] h-8 sm:h-[35px] hover:bg-[#6a1b9a]"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <button
                        className="bg-[#f4f1fa] pl-2 sm:pl-[12px] text-black border border-[#d3cce3] rounded-lg py-1 sm:py-1 px-3 sm:px-[10px] cursor-pointer font-bold text-xs sm:text-sm w-full sm:w-[100px] h-8 sm:h-[35px] hover:bg-[#eae4f4]"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
                <div className="Ractivity-trends-container mt-4 sm:mt-6">
                    <h3 className="text-[#4c1d95] mb-3 sm:mb-4 pl-2 sm:pl-[12px] text-lg sm:text-[20px] font-[700] mt-3 sm:mt-[12px]">
                        Activity Trends
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 bg-white rounded-xl p-3 sm:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-x-hidden">
                        <div className="bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Lead Status Distribution
                            </h4>
                            <canvas
                                className="max-w-full h-[250px] sm:h-[300px]"
                                id="leadStatusChart"
                                ref={leadStatusChartRef}
                            ></canvas>
                        </div>
                        <div className="bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px] flex flex-col items-center justify-center h-[300px] sm:h-[350px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Communication Status Overview
                            </h4>
                            <canvas
                                className="w-[250px] sm:w-[300px] h-[250px] sm:h-[300px]"
                                id="communicationStatusChart"
                                ref={communicationStatusChartRef}
                            ></canvas>
                        </div>
                        <div className="bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                Location-wise Lead Count
                            </h4>
                            <canvas
                                className="max-w-full h-[250px] sm:h-[300px]"
                                id="cityLeadChart"
                                ref={cityLeadChartRef}
                            ></canvas>
                        </div>
                        <div className="bg-white p-2 sm:p-[15px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative min-w-[280px] sm:min-w-[320px]">
                            <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-[#4c1d95]">
                                State-wise BD Activities
                            </h4>
                            <canvas
                                className="max-w-full h-[250px] sm:h-[300px]"
                                id="stateBdChart"
                                ref={stateBdChartRef}
                            ></canvas>
                        </div>
                    </div>
                </div>
                <div>
                    <h3
                        className="text-[#4c1d95] mb-3 sm:mb-4 pl-2 sm:pl-[12px] font-[700] mt-4 sm:mt-[16px] text-lg sm:text-[20px]"
                        style={{ wordSpacing: '0.2rem' }}
                    >
                        Latest Communication
                    </h3>
                    <div className="overflow-x-auto">
                        <table
                            className="w-full mt-3 sm:mt-[16px] border-collapse mb-8 sm:mb-16 bg-white rounded-lg overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.05)] min-w-[600px]"
                            style={{ wordSpacing: '0.2rem' }}
                        >
                            <thead className="pl-2 sm:pl-[12px]">
                                <tr>
                                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] bg-[#f1e4ff] text-[#4c1d95] font-semibold pl-2 sm:pl-[12px] text-xs sm:text-sm">
                                        BD Name
                                    </th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] bg-[#f1e4ff] text-[#4c1d95] font-semibold pl-2 sm:pl-[12px] text-xs sm:text-sm">
                                        Company Name
                                    </th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] bg-[#f1e4ff] text-[#4c1d95] font-semibold pl-2 sm:pl-[12px] text-xs sm:text-sm">
                                        Date
                                    </th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] bg-[#f1e4ff] text-[#4c1d95] font-semibold pl-2 sm:pl-[12px] text-xs sm:text-sm">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestCommunication.slice(0, 3).map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] text-xs sm:text-sm">
                                            {item.bd_name}
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] text-xs sm:text-sm">
                                            {item.company_name}
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] text-xs sm:text-sm">
                                            {new Date(
                                                item.date
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-left border-b border-[#e2e8f0] text-xs sm:text-sm">
                                            {item.communication_status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-[16px] mt-4 sm:mt-[16px]">
                    <button
                        className="py-2 sm:py-[0.6rem] px-4 sm:px-6 text-sm sm:text-base font-medium border-none rounded-md cursor-pointer w-full sm:w-[180px] text-center text-white bg-[#6a0080] hover:bg-[#4e005c]"
                        onClick={handleGenerateReportClick}
                    >
                        Generate Report
                    </button>
                    <button
                        className="py-2 sm:py-[0.6rem] px-4 sm:px-6 text-sm sm:text-base font-medium border-none rounded-md cursor-pointer w-full sm:w-[180px] text-center text-white bg-[#e53e3e] hover:bg-[#c53030]"
                        onClick={handleClear}
                    >
                        Reset Filters
                    </button>
                </div>
                {isReportFormVisible && (
                    <NewReportForm
                        onClose={handleCloseReportForm}
                        leadStatusData={leadStatusData}
                        communicationStatusData={communicationStatusData}
                        cityLeadData={cityLeadData}
                        stateBdData={stateBdData}
                    />
                )}
            </main>
        </div>
    );
}

export default Reports;
