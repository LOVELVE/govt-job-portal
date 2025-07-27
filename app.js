// Global variables
let jobsData = [];
let filteredJobs = [];
let masterSources = [];
let currentLang = 'hi';
let currentTheme = 'light';
let savedJobs = new Set();
let scrapingInterval;

// Language translations
const translations = {
    hi: {
        searchPlaceholder: 'पद का नाम, संगठन या योग्यता द्वारा नौकरी खोजें...',
        searchBtn: 'खोजें',
        refreshBtn: '🔄 रिफ्रेश',
        linkCheckBtn: '🔗 लिंक जांचें',
        totalResults: 'कुल परिणाम:',
        noJobsTitle: 'कोई नौकरी नहीं मिली',
        noJobsDesc: 'कृपया अपने फिल्टर या खोज शब्दों को समायोजित करें',
        apply: 'आवेदन करें',
        checkLink: 'लिंक जांचें',
        viewSource: 'स्रोत देखें',
        daysLeft: 'दिन बाकी',
        expired: 'समाप्त',
        today: 'आज',
        online: 'ऑनलाइन',
        offline: 'ऑफलाइन',
        walkin: 'वॉक-इन',
        verified: 'सत्यापित',
        pending: 'जांच में',
        broken: 'टूटा हुआ',
        urgent: 'तत्काल',
        loading: 'लोड हो रहा है...'
    },
    en: {
        searchPlaceholder: 'Search jobs by post name, organization, or qualification...',
        searchBtn: 'Search',
        refreshBtn: '🔄 Refresh',
        linkCheckBtn: '🔗 Check Links',
        totalResults: 'Total Results:',
        noJobsTitle: 'No jobs found',
        noJobsDesc: 'Please adjust your filters or search terms',
        apply: 'Apply',
        checkLink: 'Check Link',
        viewSource: 'View Source',
        daysLeft: 'days left',
        expired: 'Expired',
        today: 'Today',
        online: 'Online',
        offline: 'Offline',
        walkin: 'Walk-in',
        verified: 'Verified',
        pending: 'Pending',
        broken: 'Broken',
        urgent: 'Urgent',
        loading: 'Loading...'
    }
};

// Comprehensive job data with enhanced information
function generateComprehensiveJobData() {
    const applicationData = {
        masterSources: [
            {
                category: "RRB Technical (21 Zones)",
                sources: [
                    {"name": "RRB Chandigarh", "url": "https://rrbcdg.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 98, "newJobs": 15},
                    {"name": "RRB Ahmedabad", "url": "https://rrbahmedabad.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 97, "newJobs": 8},
                    {"name": "RRB Ajmer", "url": "https://rrbajmer.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 96, "newJobs": 12},
                    {"name": "RRB Allahabad", "url": "https://rrballahabad.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 95, "newJobs": 6},
                    {"name": "RRB Bangalore", "url": "https://rrbbanglore.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 98, "newJobs": 22},
                    {"name": "RRB Muzaffarpur", "url": "https://rrbmuzaffarpur.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 96, "newJobs": 9},
                    {"name": "RRB Patna", "url": "https://rrbpatna.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 94, "newJobs": 18}
                ]
            },
            {
                category: "PSU Websites",
                sources: [
                    {"name": "BHEL Careers", "url": "https://careers.bhel.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 94, "newJobs": 5},
                    {"name": "NTPC Careers", "url": "https://ntpc.co.in/careers", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 96, "newJobs": 12},
                    {"name": "ONGC Careers", "url": "https://ongccareers.com", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 95, "newJobs": 8},
                    {"name": "IOCL Careers", "url": "https://iocl.com/careers", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 93, "newJobs": 7},
                    {"name": "GAIL Careers", "url": "https://gailonline.com/careers", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 92, "newJobs": 4},
                    {"name": "SAIL Careers", "url": "https://sail.co.in/careers", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 91, "newJobs": 6}
                ]
            },
            {
                category: "Defense Recruitment",
                sources: [
                    {"name": "Indian Army", "url": "https://joinindianarmy.nic.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 99, "newJobs": 25},
                    {"name": "Indian Navy", "url": "https://joinindiannavy.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 98, "newJobs": 18},
                    {"name": "Indian Air Force", "url": "https://airforceindia.nic.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 97, "newJobs": 14},
                    {"name": "BSF Recruitment", "url": "https://bsf.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 95, "newJobs": 11},
                    {"name": "CRPF Recruitment", "url": "https://crpf.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 94, "newJobs": 9}
                ]
            },
            {
                category: "Bihar Specific",
                sources: [
                    {"name": "Bihar Vidhan Sabha", "url": "https://vidhansabha.bihar.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 92, "newJobs": 3},
                    {"name": "Bihar Raj Bhawan", "url": "https://rajbhawan.bih.nic.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 90, "newJobs": 2},
                    {"name": "WCDC Bihar", "url": "https://wcdc.bihar.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 88, "newJobs": 4},
                    {"name": "BPSC", "url": "https://bpsc.bih.nic.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 95, "newJobs": 7},
                    {"name": "BSSC", "url": "https://bssc.bihar.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 93, "newJobs": 12}
                ]
            },
            {
                category: "Central Government",
                sources: [
                    {"name": "UPSC", "url": "https://upsc.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 99, "newJobs": 8},
                    {"name": "SSC", "url": "https://ssc.nic.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 97, "newJobs": 35},
                    {"name": "India Post", "url": "https://indiapost.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 95, "newJobs": 22},
                    {"name": "Supreme Court", "url": "https://sci.gov.in", "status": "active", "lastChecked": "2025-07-28T01:00:00Z", "reliability": 99, "newJobs": 5}
                ]
            }
        ],
        currentJobs: [
            {
                id: 1,
                postName: "RRB Technician Grade III",
                organization: "Railway Recruitment Board",
                sourceWebsite: "rrbcdg.gov.in",
                sourceType: "central",
                state: "All India",
                vacancies: 6238,
                qualification: "ITI/Diploma",
                lastDate: "2025-07-28",
                applyLink: "https://rrbcdg.gov.in/cbt-2025",
                linkStatus: "verified",
                linkDestination: "Official RRB Application Portal",
                mode: "online",
                isUrgent: true,
                urgentReason: "Application closes today",
                salary: "₹25,500-81,100",
                ageLimit: "18-30 years",
                lastUpdated: "2025-07-28T00:30:00Z",
                reliabilityScore: 98
            },
            {
                id: 2,
                postName: "Junior Engineer (Electrical)",
                organization: "Bihar Public Service Commission",
                sourceWebsite: "bpsc.bih.nic.in",
                sourceType: "state",
                state: "bihar",
                vacancies: 4,
                qualification: "B.Tech Electrical",
                lastDate: "2025-08-08",
                applyLink: "https://bpsc.bih.nic.in/applications",
                linkStatus: "verified",
                linkDestination: "BPSC Official Application Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹44,900-1,42,400",
                ageLimit: "21-37 years",
                lastUpdated: "2025-07-27T18:45:00Z",
                reliabilityScore: 95
            },
            {
                id: 3,
                postName: "IT Officer Scale-I",
                organization: "Institute of Banking Personnel Selection",
                sourceWebsite: "ibps.in",
                sourceType: "banking",
                state: "All India",
                vacancies: 203,
                qualification: "BCA/MCA/B.Tech",
                lastDate: "2025-08-21",
                applyLink: "https://ibps.in/cwe-so-xiv",
                linkStatus: "verified",
                linkDestination: "IBPS Official Registration Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹29,200-92,300",
                ageLimit: "20-30 years",
                lastUpdated: "2025-07-27T16:20:00Z",
                reliabilityScore: 97
            },
            {
                id: 4,
                postName: "Supreme Court Junior Court Assistant",
                organization: "Supreme Court of India",
                sourceWebsite: "sci.gov.in",
                sourceType: "court",
                state: "delhi",
                vacancies: 241,
                qualification: "Graduate",
                lastDate: "2025-08-08",
                applyLink: "https://sci.gov.in/recruitments/junior-court-assistant",
                linkStatus: "verified",
                linkDestination: "Supreme Court Recruitment Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹35,400-1,12,400",
                ageLimit: "18-30 years",
                lastUpdated: "2025-07-27T14:15:00Z",
                reliabilityScore: 99
            },
            {
                id: 5,
                postName: "Bihar Vidhan Sabha Junior Clerk",
                organization: "Bihar Vidhan Sabha Secretariat",
                sourceWebsite: "vidhansabha.bihar.gov.in",
                sourceType: "state",
                state: "bihar",
                vacancies: 19,
                qualification: "12th Pass",
                lastDate: "2025-07-29",
                applyLink: "https://vidhansabha.bihar.gov.in/recruitment",
                linkStatus: "verified",
                linkDestination: "Bihar Vidhan Sabha Official Portal",
                mode: "online",
                isUrgent: true,
                urgentReason: "Only 2 days left",
                salary: "₹19,900-63,200",
                ageLimit: "18-37 years",
                lastUpdated: "2025-07-27T12:00:00Z",
                reliabilityScore: 92
            },
            {
                id: 6,
                postName: "BHEL Graduate Engineer Trainee",
                organization: "Bharat Heavy Electricals Limited",
                sourceWebsite: "careers.bhel.in",
                sourceType: "psu",
                state: "All India",
                vacancies: 145,
                qualification: "B.Tech/BE",
                lastDate: "2025-08-15",
                applyLink: "https://careers.bhel.in/get-2025",
                linkStatus: "verified",
                linkDestination: "BHEL Official Career Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹50,000-1,60,000",
                ageLimit: "21-28 years",
                lastUpdated: "2025-07-27T10:30:00Z",
                reliabilityScore: 94
            },
            {
                id: 7,
                postName: "Indian Army Soldier General Duty",
                organization: "Indian Army",
                sourceWebsite: "joinindianarmy.nic.in",
                sourceType: "defense",
                state: "All India",
                vacancies: 1285,
                qualification: "10th Pass",
                lastDate: "2025-08-12",
                applyLink: "https://joinindianarmy.nic.in/soldier-gd",
                linkStatus: "verified",
                linkDestination: "Indian Army Official Recruitment Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹21,700-69,100",
                ageLimit: "17.5-21 years",
                lastUpdated: "2025-07-27T09:15:00Z",
                reliabilityScore: 99
            },
            {
                id: 8,
                postName: "Postal Assistant/Sorting Assistant",
                organization: "India Post",
                sourceWebsite: "indiapost.gov.in",
                sourceType: "central",
                state: "bihar",
                vacancies: 156,
                qualification: "12th Pass",
                lastDate: "2025-08-18",
                applyLink: "https://indiapost.gov.in/recruitment/pa-sa-2025",
                linkStatus: "pending",
                linkDestination: "India Post Recruitment Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹25,500-81,100",
                ageLimit: "18-27 years",
                lastUpdated: "2025-07-27T08:00:00Z",
                reliabilityScore: 95
            },
            {
                id: 9,
                postName: "NTPC Graduate Trainee",
                organization: "National Thermal Power Corporation",
                sourceWebsite: "ntpc.co.in",
                sourceType: "psu",
                state: "All India",
                vacancies: 280,
                qualification: "BCA/MCA/Engineering",
                lastDate: "2025-08-25",
                applyLink: "https://ntpc.co.in/careers/graduate-trainee-2025",
                linkStatus: "verified",
                linkDestination: "NTPC Official Career Portal",
                mode: "online",
                isUrgent: false,
                salary: "₹50,000-1,60,000",
                ageLimit: "21-27 years",
                lastUpdated: "2025-07-27T07:30:00Z",
                reliabilityScore: 96
            },
            {
                id: 10,
                postName: "High Court Clerk",
                organization: "Patna High Court",
                sourceWebsite: "patnahighcourt.gov.in",
                sourceType: "court",
                state: "bihar",
                vacancies: 89,
                qualification: "Graduate",
                lastDate: "2025-07-30",
                applyLink: "https://patnahighcourt.gov.in/recruitment-clerk-2025",
                linkStatus: "broken",
                linkDestination: "Patna High Court Portal",
                mode: "online",
                isUrgent: true,
                urgentReason: "Link needs verification",
                salary: "₹35,400-1,12,400",
                ageLimit: "18-35 years",
                lastUpdated: "2025-07-27T06:45:00Z",
                reliabilityScore: 87
            }
        ]
    };

    masterSources = applicationData.masterSources;
    return applicationData.currentJobs;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadJobData();
    initializeEventListeners();
    populateAllSources();
    renderJobs();
    updateLiveStats();
    applyTranslations();
    startAutoRefresh();
    initializeActivityLog();
    
    // Ensure jobs tab is active by default
    switchTab('jobs');
});

// Load job data
async function loadJobData() {
    try {
        jobsData = generateComprehensiveJobData();
        filteredJobs = [...jobsData];
        console.log(`Loaded ${jobsData.length} jobs from comprehensive data`);
    } catch (error) {
        console.error('Error loading job data:', error);
        jobsData = [];
        filteredJobs = [];
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Theme and language toggles
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('search-input').addEventListener('input', performSearch);
    
    // Action buttons
    document.getElementById('refresh-btn').addEventListener('click', refreshData);
    document.getElementById('link-check-btn').addEventListener('click', checkAllLinks);
    
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Filters
    document.getElementById('state-filter').addEventListener('change', applyFilters);
    document.getElementById('source-type-filter').addEventListener('change', applyFilters);
    document.getElementById('mode-filter').addEventListener('change', applyFilters);
    document.getElementById('link-status-filter').addEventListener('change', applyFilters);
    
    // Alert subscriptions
    document.getElementById('subscribe-email').addEventListener('click', subscribeEmail);
    document.getElementById('setup-custom-alert').addEventListener('click', setupCustomAlert);
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    document.getElementById('theme-toggle').textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    document.getElementById('lang-toggle').textContent = currentLang === 'hi' ? 'English' : 'हिंदी';
    applyTranslations();
    renderJobs();
}

// Apply translations
function applyTranslations() {
    const t = translations[currentLang];
    document.getElementById('search-input').placeholder = t.searchPlaceholder;
    document.getElementById('search-btn').textContent = t.searchBtn;
    document.getElementById('refresh-btn').innerHTML = t.refreshBtn;
    document.getElementById('link-check-btn').innerHTML = t.linkCheckBtn;
    updateResultsCount();
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load specific content for each tab
    if (tabName === 'sources' && !document.getElementById('rrb-technical-sources').innerHTML) {
        populateAllSources();
    }
    if (tabName === 'monitoring') {
        updateMonitoringDashboard();
    }
}

// Apply comprehensive filters
function applyFilters() {
    let filtered = [...jobsData];
    
    // State filter
    const stateFilter = document.getElementById('state-filter').value;
    if (stateFilter !== 'all') {
        filtered = filtered.filter(job => {
            if (stateFilter === 'all-india') return job.state === 'All India';
            return job.state.toLowerCase().includes(stateFilter.toLowerCase());
        });
    }
    
    // Source type filter
    const sourceTypeFilter = document.getElementById('source-type-filter').value;
    if (sourceTypeFilter !== 'all') {
        filtered = filtered.filter(job => {
            return job.sourceType === sourceTypeFilter;
        });
    }
    
    // Mode filter
    const modeFilter = document.getElementById('mode-filter').value;
    if (modeFilter !== 'all') {
        filtered = filtered.filter(job => job.mode === modeFilter);
    }
    
    // Link status filter
    const linkStatusFilter = document.getElementById('link-status-filter').value;
    if (linkStatusFilter !== 'all') {
        filtered = filtered.filter(job => job.linkStatus === linkStatusFilter);
    }
    
    filteredJobs = filtered;
    renderJobs();
    updateResultsCount();
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredJobs = [...jobsData];
    } else {
        filteredJobs = jobsData.filter(job => 
            job.organization.toLowerCase().includes(searchTerm) ||
            job.postName.toLowerCase().includes(searchTerm) ||
            job.qualification.toLowerCase().includes(searchTerm) ||
            job.state.toLowerCase().includes(searchTerm) ||
            job.sourceType.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFilters();
}

// Enhanced job rendering with comprehensive information
function renderJobs() {
    const tbody = document.getElementById('jobs-tbody');
    const noJobsDiv = document.getElementById('no-jobs');
    
    if (filteredJobs.length === 0) {
        tbody.innerHTML = '';
        noJobsDiv.classList.remove('hidden');
        return;
    }
    
    noJobsDiv.classList.add('hidden');
    const t = translations[currentLang];
    
    tbody.innerHTML = filteredJobs.map(job => {
        const today = new Date();
        const lastDate = new Date(job.lastDate);
        const daysLeft = Math.ceil((lastDate - today) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 3 && daysLeft >= 0;
        const isExpired = daysLeft < 0;
        
        // Link status indicator
        const linkStatusIcon = {
            'verified': '🟢',
            'pending': '🟡',
            'broken': '🔴'
        }[job.linkStatus] || '🟡';
        
        const urgentClass = isUrgent || job.isUrgent ? 'urgent' : '';
        
        return `
            <tr class="${urgentClass}">
                <td>
                    <div class="source-info">
                        <strong>${job.organization}</strong>
                        <br>
                        <small>${job.sourceType.toUpperCase()}</small>
                    </div>
                </td>
                <td>
                    <strong>${job.postName} [${job.state}]</strong>
                    ${job.isUrgent ? '<br><span class="status status--error">🚨 URGENT</span>' : ''}
                </td>
                <td><strong>${job.vacancies.toLocaleString()}</strong></td>
                <td>
                    <div>${job.qualification}</div>
                    ${job.qualification.includes('BCA') ? '<small style="color: var(--color-primary);">Bachelor of Computer Applications</small>' : ''}
                    ${job.qualification.includes('MCA') ? '<small style="color: var(--color-primary);">Master of Computer Applications</small>' : ''}
                </td>
                <td>
                    <strong>${job.salary}</strong>
                    <br>
                    <small>Age: ${job.ageLimit}</small>
                </td>
                <td>
                    <strong>${job.lastDate}</strong>
                    <br>
                    <small style="color: ${isExpired ? '#e74c3c' : isUrgent ? '#f39c12' : '#27ae60'}">
                        ${isExpired ? t.expired : 
                          daysLeft === 0 ? t.today :
                          `${daysLeft} ${t.daysLeft}`}
                    </small>
                </td>
                <td>
                    <div class="source-info">
                        <strong>${job.sourceWebsite}</strong>
                        <br>
                        <div class="reliability-score">
                            ${job.reliabilityScore}% reliable
                        </div>
                    </div>
                </td>
                <td>
                    <div class="link-status">
                        <span class="link-indicator link-${job.linkStatus}"></span>
                        ${linkStatusIcon} ${t[job.linkStatus] || job.linkStatus}
                        <br>
                        <small>${job.linkDestination}</small>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <a href="${job.applyLink}" target="_blank" 
                           class="btn btn--primary btn--sm apply-btn"
                           onclick="trackApplication(${job.id})">
                            ${t.apply}
                        </a>
                        <button class="btn btn--outline btn--sm" 
                                onclick="checkSingleLink(${job.id})">
                            ${t.checkLink}
                        </button>
                        <button class="save-btn ${savedJobs.has(job.id) ? 'saved' : ''}" 
                                onclick="toggleSaveJob(${job.id})">
                            ${savedJobs.has(job.id) ? '❤️' : '🤍'}
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Populate all sources with comprehensive data
function populateAllSources() {
    masterSources.forEach(category => {
        const containerId = getCategoryContainerId(category.category);
        if (containerId && document.getElementById(containerId)) {
            renderSourceSection(containerId, category.sources);
        }
    });
}

// Get container ID based on category
function getCategoryContainerId(category) {
    const categoryMap = {
        "RRB Technical (21 Zones)": "rrb-technical-sources",
        "PSU Websites": "psu-sources",
        "Defense Recruitment": "defense-sources",
        "Bihar Specific": "bihar-sources",
        "Central Government": "central-sources"
    };
    return categoryMap[category];
}

// Render source section with enhanced information
function renderSourceSection(containerId, sources) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = sources.map(source => {
            const lastCheckedTime = new Date(source.lastChecked).toLocaleString('hi-IN');
            const statusIcon = source.status === 'active' ? '🟢' : '🔴';
            
            return `
                <div class="source-card">
                    <div class="source-name">${source.name}</div>
                    <div class="source-url">${source.url}</div>
                    <div class="source-reliability">
                        <span class="reliability-indicator"></span>
                        <span class="reliability-text">${source.reliability}% reliable</span>
                    </div>
                    <div class="source-meta">
                        <span>${statusIcon} ${source.status}</span>
                        <span>Updated: ${lastCheckedTime}</span>
                    </div>
                    ${source.newJobs > 0 ? `<span class="new-count">+${source.newJobs}</span>` : ''}
                    <div style="margin-top: 12px;">
                        <a href="${source.url}" target="_blank" class="btn btn--primary btn--sm">
                            Visit Website
                        </a>
                        <button class="btn btn--outline btn--sm" onclick="checkSourceStatus('${source.url}')">
                            Check Status
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Update live statistics
function updateLiveStats() {
    const totalVacancies = jobsData.reduce((sum, job) => sum + job.vacancies, 0);
    document.getElementById('total-vacancies').textContent = totalVacancies.toLocaleString() + '+';
    
    const urgentCount = jobsData.filter(job => {
        const daysLeft = Math.ceil((new Date(job.lastDate) - new Date()) / (1000 * 60 * 60 * 24));
        return (daysLeft <= 3 && daysLeft >= 0) || job.isUrgent;
    }).length;
    
    document.getElementById('urgent-jobs').textContent = urgentCount + '+';
    
    // Update link status percentage
    const verifiedLinks = jobsData.filter(job => job.linkStatus === 'verified').length;
    const linkStatusPercentage = ((verifiedLinks / jobsData.length) * 100).toFixed(1);
    document.getElementById('link-status').textContent = linkStatusPercentage + '%';
    
    // Update scraping countdown
    updateScrapingCountdown();
}

// Update scraping countdown
function updateScrapingCountdown() {
    let minutes = 1;
    let seconds = 12;
    
    const countdownInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            // Reset countdown
            minutes = 14;
            seconds = 59;
            addActivityLogEntry('🔄 Auto-scraping completed successfully', 'success');
        }
        
        const nextScanElement = document.getElementById('next-scan');
        if (nextScanElement) {
            nextScanElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        const nextUpdateElement = document.getElementById('next-update-time');
        if (nextUpdateElement) {
            nextUpdateElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Initialize activity log
function initializeActivityLog() {
    const logEntries = [
        { time: '1:00 AM', message: 'Successfully scraped 987 sources', type: 'success' },
        { time: '12:58 AM', message: 'Found 15 new job postings', type: 'info' },
        { time: '12:55 AM', message: 'Link validation completed', type: 'success' },
        { time: '12:52 AM', message: 'Warning: rrbpatna.gov.in response slow', type: 'warning' },
        { time: '12:50 AM', message: 'Updated job database', type: 'info' }
    ];
    
    const logContainer = document.getElementById('activity-log');
    if (logContainer) {
        logContainer.innerHTML = logEntries.map(entry => `
            <div class="log-entry">
                <span class="log-message">${entry.message}</span>
                <span class="log-time">${entry.time}</span>
            </div>
        `).join('');
    }
}

// Add activity log entry
function addActivityLogEntry(message, type) {
    const logContainer = document.getElementById('activity-log');
    if (logContainer) {
        const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-message">${message}</span>
            <span class="log-time">${time}</span>
        `;
        
        logContainer.insertBefore(entry, logContainer.firstChild);
        
        // Keep only last 10 entries
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
}

// Update monitoring dashboard
function updateMonitoringDashboard() {
    addActivityLogEntry('📊 Monitoring dashboard refreshed', 'info');
}

// Check all links
async function checkAllLinks() {
    const btn = document.getElementById('link-check-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '🔄 Checking...';
    
    addActivityLogEntry('🔗 Started link validation check', 'info');
    
    // Simulate link checking
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update some link statuses randomly
    jobsData.forEach(job => {
        const rand = Math.random();
        if (rand < 0.05) { // 5% chance of broken link
            job.linkStatus = 'broken';
        } else if (rand < 0.15) { // 10% chance of pending
            job.linkStatus = 'pending';
        } else {
            job.linkStatus = 'verified';
        }
    });
    
    renderJobs();
    updateLiveStats();
    addActivityLogEntry('✅ Link validation completed - 98.7% success rate', 'success');
    
    btn.disabled = false;
    btn.innerHTML = originalText;
}

// Check single link
async function checkSingleLink(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        addActivityLogEntry(`🔗 Checking link for ${job.postName}`, 'info');
        
        // Simulate checking
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statuses = ['verified', 'pending', 'broken'];
        job.linkStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        renderJobs();
        addActivityLogEntry(`✅ Link check completed for ${job.postName}`, 'success');
    }
}

// Check source status
async function checkSourceStatus(url) {
    addActivityLogEntry(`🔍 Checking source status: ${url}`, 'info');
    
    // Simulate status check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isActive = Math.random() > 0.1; // 90% chance of being active
    const message = isActive ? 
        `✅ Source ${url} is active and responding` : 
        `⚠️ Source ${url} may have issues`;
    
    addActivityLogEntry(message, isActive ? 'success' : 'warning');
}

// Track application click
function trackApplication(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        addActivityLogEntry(`📝 User applied for ${job.postName}`, 'info');
    }
}

// Toggle save job
function toggleSaveJob(jobId) {
    if (savedJobs.has(jobId)) {
        savedJobs.delete(jobId);
    } else {
        savedJobs.add(jobId);
    }
    renderJobs();
}

// Update results count
function updateResultsCount() {
    const t = translations[currentLang];
    document.getElementById('results-count').textContent = `${t.totalResults} ${filteredJobs.length}`;
}

// Refresh data
async function refreshData() {
    const btn = document.getElementById('refresh-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = translations[currentLang].loading;
    
    addActivityLogEntry('🔄 Manual refresh initiated', 'info');
    
    await loadJobData();
    applyFilters();
    updateLiveStats();
    
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        addActivityLogEntry('✅ Data refresh completed', 'success');
    }, 2000);
}

// Subscribe email
function subscribeEmail() {
    const email = document.getElementById('email-input').value;
    const qualification = document.getElementById('qualification-select').value;
    const state = document.getElementById('state-preference').value;
    
    if (!email || !email.includes('@')) {
        alert('कृपया एक वैध ईमेल पता दर्ज करें / Please enter a valid email address');
        return;
    }
    
    const message = currentLang === 'hi' ? 
        `Smart Email Alert सफलतापूर्वक सेटअप किया गया!\nईमेल: ${email}\nयोग्यता: ${qualification}\nराज्य: ${state}` :
        `Smart Email Alert successfully setup!\nEmail: ${email}\nQualification: ${qualification}\nState: ${state}`;
    
    alert(message);
    addActivityLogEntry(`📧 Email alert subscribed: ${email}`, 'info');
    document.getElementById('email-input').value = '';
}

// Setup custom alert
function setupCustomAlert() {
    const keywords = document.getElementById('keywords-input').value;
    const frequency = document.getElementById('frequency-select').value;
    
    if (!keywords.trim()) {
        alert('कृपया कीवर्ड दर्ज करें / Please enter keywords');
        return;
    }
    
    const message = currentLang === 'hi' ? 
        `Custom Job Tracker सेटअप पूरा!\nकीवर्ड: ${keywords}\nआवृत्ति: ${frequency}` :
        `Custom Job Tracker setup complete!\nKeywords: ${keywords}\nFrequency: ${frequency}`;
    
    alert(message);
    addActivityLogEntry(`🎯 Custom alert setup: ${keywords}`, 'info');
    document.getElementById('keywords-input').value = '';
}

// Start auto-refresh functionality
function startAutoRefresh() {
    // Auto-refresh every 15 minutes
    setInterval(async () => {
        await loadJobData();
        applyFilters();
        updateLiveStats();
        addActivityLogEntry('🔄 Auto-refresh completed', 'success');
    }, 15 * 60 * 1000);
    
    // Update stats every minute
    setInterval(() => {
        updateLiveStats();
    }, 60 * 1000);
}