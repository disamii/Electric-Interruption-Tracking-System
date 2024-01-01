

# PowerShell Script: Realistic 1500 commits for Ethiopian Electric Interruption Tracking System
# File to modify (dummy or project file)
$commitFile = "dummy.txt"

# Ensure the file exists
if (!(Test-Path $commitFile)) {
    New-Item -Path $commitFile -ItemType File
}

# Total commits
$totalCommits = 1500

# Date range for 2024
$startDate = Get-Date "2024-01-01"
$endDate   = Get-Date "2024-12-31"
$daysInYear = ($endDate - $startDate).Days

# Sample modules and actions
$modules = @("User Interface", "Backend API", "Database", "Notification Service", "Logging", "Scheduler", "Analytics", "Authentication", "Error Handling", "Electricity Data Parser", "Admin Dashboard", "User Management", "Chat System", "Report Generation", "Graph Visualization", "Interruption Logging", "Theme Toggle", "Note Taking", "Password Management", "Sidebar Navigation", "Express Line Detail", "Feeder Line Tracking", "Data Summary", "Six Month Report", "Bar Chart Renderer", "Line Graph Trends", "User Profile View", "Data Upload Table", "Entity Relationship", "System Architecture", "Class Diagram", "Methodology Docs", "Stakeholder Feedback", "Docker Container", "Git Version Control", "MySQL Schema", "Django Endpoints", "React Components", "Tailwind Styling", "Predictive Insights", "Automated Alerts", "Network Integration", "LAN Configuration", "WAN Setup", "Internship Report", "Power Outage Tracker", "Manual Data Migration", "Real Time Collection", "Operational Efficiency", "User Friendly Interface", "Event Logging Module", "Duration Calculator", "Frequency Analyzer", "Recurring Issue Detector", "Scalability Enhancer", "Adaptability Layer", "Proactive Maintenance", "Service Reliability Booster", "Web Based Solution", "Data Flow Designer", "Access Level Controller", "Frontend Builder", "API Development", "Data Storage Manager", "Code Change Tracker", "Isolated Environment Creator", "Feedback Collector", "Iteration Improver", "Challenge Documenter", "Solution Implementer", "User Guide Writer", "Hardware Specifier", "Internet Connector", "Software Installer", "Version Manager", "Container Orchestrator", "Primary Actor Handler", "Employee Uploader", "Account Creator", "Username Generator", "Password Assigner", "Report Submitter", "Profile Viewer", "Data Communicator", "System Manager", "Account Deleter", "Password Resetter", "Data Aligner", "Standards Enforcer", "Periodic Reporter", "Performance Analyzer", "Improvement Identifier", "Note Taker", "Notification Receiver", "Update Notifier", "Issue Reporter", "UML Entity Mapper", "Association Definer", "Login Page Renderer", "Secure Access Gate", "Credential Validator", "Theme Switcher", "Visibility Enhancer", "Readability Improver", "Contrast Booster", "Screenshot Highlighter", "Graph Detailer", "Text Clarifier", "Eye Strain Reducer", "Digital Screen Optimizer", "Summary Viewer", "Trend Visualizer", "Metric Card Displayer", "Notification Summarizer", "User Count Tracker", "Suspension Monitor", "Navigation Linker", "Detail Page Router", "Table Lister", "Dropdown Actioner", "Delete Option Provider", "Reset Function Adder", "Info Viewer", "Account Setup Streamliner", "Report Page Builder", "Graph Side By Sider", "Monthly Distributor", "Card Metric Highlighter", "Total Interruption Counter", "Duration Recorder", "Line Frequency Identifier", "Pattern Comparer", "Distribution Bar Creator", "Frequency Comparator", "Downtime Table Generator", "Analysis Detailer", "In Depth Viewer", "Feeder Breaker Downer", "Reason Chart Builder", "Insight Comparer", "Incident Lister", "Record Editor", "Deletion Handler", "Data Manager", "Communication Facilitator", "Issue Reporter UI", "Question Asker", "Response Receiver", "Interaction Seamlesser", "Resolution Quickener", "Observation Documenter", "Action Recorder", "Reminder Setter", "Insight Linker", "Info Tracker", "Follow Up Actioner", "Prompt Popper", "Security Measurer", "Personalizer", "Info Safeguarder", "Feature Linker", "Submission Former", "Upload Lister", "Contact Optioner", "Experience User Friendlier", "Navigation Easier", "Detail Submitter", "Field Filler", "Line Affecter", "Time Durator", "Outage Reasoner", "Data Capturer", "Tracker Effectiver", "Submission Viewer", "Glancer", "Request Deleter", "Edit Requester", "Oversight Maintainer", "Support Enhancer", "Environment Collaborator", "Concern Addresser", "Info Sharer", "Experience Deepener", "Configuration Participant", "Integration Crucialer", "Exchange Seamlesser", "Entry Real Timer", "Efficiency Improver", "Insight Provider", "Cause Frequency Insight", "Disruption Optimizer", "Reliability Contributor", "Skill Deepener", "Knowledge Acquirer", "Application Practicaler", "Sector Utility Tech", "Feature Integrator", "Alert Automator", "Analytics Predictor", "Point Failure Identifier", "Data Historical Baser", "Trainer Ongoing", "Principle Understandinger", "Upgrade Investor", "Reliability Improver", "Performance Booster", "Branch Remote Connector", "Tool Analyzer Advancer", "Insight Deeper Deriver", "Decision Informer", "Delivery Service Maintainer", "Routine Establisher", "Performance Optimalizer", "Challenge Proactive Addresser", "Feedback Gatherer", "Improvement Identifier Stakeholder", "Efficiency Operational Enhancer", "Reliability Service Improver", "Need Customer Meeter", "Background Company Referencer", "Vision Mission Stater", "Guideline Internship Follower", "Handbook Report Writer", "Engineering Computer Departmenter", "Firewall Configurer Cisco", "Device Manual User Huawei", "Communication Computer Data Referencer", "Concept Setup LAN WAN", "Library JS Interface Builder React", "Doc Django Foundation Software", "Doc CSS Tailwind Lab", "Methodology Testing Software Art", "Standard IEEE Network Area", "Manual Technical Operational EEU")
$actions = @("Update", "Fix", "Refactor", "Add", "Improve", "Optimize", "Document", "Test", "Deploy", "Configure", "Implement", "Enhance", "Integrate", "Modularize", "Streamline", "Enable", "Auto-generate", "Placeholder", "Validate", "Render", "Migrate", "Secure", "Visualize", "Analyze", "Log", "Schedule", "Notify", "Parse", "Authenticate", "Handle", "Suspend", "Reset", "Edit", "Delete", "Create", "Query", "Backup", "Restore", "Scale", "Debug", "Profile", "Benchmark", "Design", "Develop", "Build", "Structure", "Automate", "Capture", "Calculate", "Identify", "Facilitate", "Provide", "Enable Note Taking", "Support Customizable", "Consult Initial", "Engage Mentor", "Gain Insights", "Identify Problems", "Conduct Discussions", "Hold Meetings", "Understand Limitations", "Gather Data", "Interview Staffs", "Review Historical", "Define Roles", "Design Interface", "Flow Data", "Develop Frontend", "Style With Tailwind", "Logic Server Side", "Develop API", "Store Data", "Manage Database", "Track Changes", "Collaborate Code", "Create Isolated", "Deploy Environment", "Collect Feedback", "Iterate Adjustments", "Document Process", "Face Challenges", "Implement Solutions", "Write Guides", "Specify Hardware", "Connect Internet", "Install Software", "Control Version", "Orchestrate Containers", "Handle Actors", "Upload Employee", "Generate Username", "Assign Password", "Submit Reports", "View Profile", "Communicate Via Chat", "Manage Overall", "Create Accounts", "Delete Users", "Edit Profiles", "Reset Pass", "Align Data", "Enforce Standards", "Report Periodic", "Analyze Performance", "Identify Areas", "Take Notes", "Receive Notifs", "Notify Updates", "Report Issues", "Map Entities", "Define Associations", "Render Login", "Validate Credentials", "Switch Themes", "Enhance Visibility", "Improve Readability", "Boost Contrast", "Highlight Screenshots", "Detail Graphs", "Clarify Text", "Reduce Strain", "Optimize Screens", "View Summary", "Visualize Trends", "Display Cards", "Summarize Notifs", "Track Counts", "Monitor Suspensions", "Link Navigations", "Route Details", "List Tables", "Action Dropdowns", "Provide Deletes", "Add Resets", "View Infos", "Streamline Setups", "Build Reports", "Side Graphs", "Distribute Monthly", "Highlight Metrics", "Count Totals", "Record Durations", "Identify Frequencies", "Compare Patterns", "Create Bars", "Compare Frequencies", "Generate Tables", "Detail Analyses", "View Depths", "Break Feeders", "Build Charts", "Compare Insights", "List Incidents", "Edit Records", "Handle Deletions", "Manage Datas", "Facilitate Comms", "Report UIs", "Ask Questions", "Receive Responses", "Seamless Interact", "Quicken Resolutions", "Document Obs", "Record Actions", "Set Reminders", "Link Insights", "Track Infos", "Action Follow Ups", "Pop Prompts", "Measure Security", "Personalize Passes", "Safeguard Infos", "Link Features", "Form Submissions", "List Uploads", "Option Contacts", "Friendlier Experiences", "Easier Navs", "Submit Details", "Fill Fields", "Affect Lines", "Duration Times", "Reason Outages", "Capture Datas", "Effective Trackers", "View Submissions", "Glance Views", "Delete Requests", "Edit Requests", "Maintain Oversights", "Enhance Supports", "Collaborate Envs", "Address Concerns", "Share Infos", "Deepen Experiences", "Participate Configs", "Crucial Integrate", "Seamless Exchange", "Timer Entries", "Improve Efficiencies", "Provide Insights", "Insight Causes", "Optimize Disruptions", "Contribute Reliabilities", "Deepen Skills", "Acquire Knowledges", "Practicaler Apps", "Tech Sector Utility", "Integrate Features", "Automate Alerts", "Predict Analytics", "Identify Failures", "Base Historicals", "Ongoing Train", "Understand Principles", "Invest Upgrades", "Improve Reliabs", "Boost Performances", "Connect Branches", "Advance Analyzers", "Derive Deeper", "Inform Decisions", "Maintain Deliveries", "Establish Routines", "Optimalize Performs", "Address Proactives", "Gather Feedbacks", "Identify Improves", "Enhance Efficiencies", "Improve Reliabs", "Meet Needs", "Reference Backgrounds", "State Visions", "Follow Guidelines", "Write Handbooks", "Department Engineers", "Configure Firewalls", "User Manuals", "Reference Comms", "Setup Concepts", "Build Interfaces", "Foundation Docs", "Lab Docs", "Art Testings", "Standard Networks", "Manuals Operationals")
#
# Function to get next working day
function Get-NextWorkingDay($date) {
    do {
        $date = $date.AddDays(1)
    } while ($date.DayOfWeek -eq "Saturday" -or $date.DayOfWeek -eq "Sunday")
    return $date
}

for ($i = 1; $i -le $totalCommits; $i++) {

    # Pick a random module and action
    $module = $modules[(Get-Random -Minimum 0 -Maximum $modules.Count)]
    $action = $actions[(Get-Random -Minimum 0 -Maximum $actions.Count)]

    # Modify the file slightly (use normal hyphens)
    Add-Content $commitFile "$i - $action $module - Ethiopian Electric Interruption Tracking System"

    # Spread commit across the year
    $fraction = ($i - 1) / ($totalCommits - 1)
    $commitDate = $startDate.AddDays([math]::Floor($daysInYear * $fraction))

    # Ensure commit is on a working day
    $commitDate = Get-NextWorkingDay $commitDate

    # Prepare commit date string
    $commitDateStr = $commitDate.ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_COMMITTER_DATE = $commitDateStr

    # Make the commit
    git add $commitFile
    git commit --date="$commitDateStr" -m "$action $module - commit #$i"
}

# Clean up environment variable
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Completed $totalCommits commits spread across 2024!"
