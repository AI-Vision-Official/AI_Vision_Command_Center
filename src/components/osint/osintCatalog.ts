// Curated free / open-source OSINT resources. Add new entries here.
// Most sites block embedding, so every tool opens in a new tab.

export type OsintCategory =
  | 'webcams' | 'disasters' | 'warnings' | 'news' | 'factcheck'
  | 'maps' | 'aviation' | 'people' | 'images' | 'web' | 'conflict' | 'frameworks';

export interface OsintTool {
  name: string;
  url: string;
  category: OsintCategory;
  description: string;
  openSource?: boolean;
  credit?: string; // developer / organisation
}

export const osintCategories: { id: OsintCategory; label: string; hint: string }[] = [
  { id: 'disasters', label: 'Disaster Tracking', hint: 'Earthquakes, fires, floods, storms' },
  { id: 'warnings', label: 'Warnings & Alerts', hint: 'Official early-warning services' },
  { id: 'webcams', label: 'Live Webcams', hint: 'Public cameras worldwide' },
  { id: 'news', label: 'Independent News', hint: 'Investigative, non-profit journalism' },
  { id: 'factcheck', label: 'Fact-Checking', hint: 'Verify claims and media' },
  { id: 'conflict', label: 'Conflict Monitoring', hint: 'Crisis and conflict data' },
  { id: 'maps', label: 'Maps & Satellite', hint: 'Imagery and geolocation' },
  { id: 'aviation', label: 'Flights & Ships', hint: 'Live air and sea traffic' },
  { id: 'people', label: 'Usernames & Email', hint: 'Account and breach lookups' },
  { id: 'images', label: 'Image & Video', hint: 'Reverse search and metadata' },
  { id: 'web', label: 'Websites & Domains', hint: 'History, DNS, infrastructure' },
  { id: 'frameworks', label: 'Toolkits & Guides', hint: 'Directories and training' },
];

const x = (category: OsintCategory, name: string, url: string, description: string, credit?: string, openSource = false): OsintTool =>
  ({ category, name, url, description, credit, openSource });

export const osintTools: OsintTool[] = [
  // Disasters
  x('disasters', 'USGS Earthquakes', 'https://earthquake.usgs.gov/earthquakes/map/', 'Live global earthquake map', 'U.S. Geological Survey'),
  x('disasters', 'NASA FIRMS', 'https://firms.modaps.eosdis.nasa.gov/map/', 'Active fires from satellites, near real time', 'NASA'),
  x('disasters', 'NASA EONET', 'https://eonet.gsfc.nasa.gov/', 'Natural events tracker (storms, volcanoes, ice)', 'NASA'),
  x('disasters', 'GDACS', 'https://www.gdacs.org/', 'Global disaster alerts & coordination', 'UN / European Commission'),
  x('disasters', 'ReliefWeb', 'https://reliefweb.int/disasters', 'Humanitarian disaster reports', 'UN OCHA'),
  x('disasters', 'Zoom Earth', 'https://zoom.earth/', 'Live weather & storm satellite map'),
  x('disasters', 'Windy', 'https://www.windy.com/', 'Wind, rain and storm forecasts'),
  x('disasters', 'Volcano Discovery', 'https://www.volcanodiscovery.com/earthquakes/today.html', 'Volcanic activity and quakes'),
  x('disasters', 'Copernicus EMS', 'https://emergency.copernicus.eu/mapping/', 'Satellite emergency mapping', 'EU Copernicus'),
  // Warnings
  x('warnings', 'Meteoalarm', 'https://meteoalarm.org/', 'Official weather warnings for Europe', 'EUMETNET'),
  x('warnings', 'NOAA NWS Alerts', 'https://www.weather.gov/alerts', 'US weather warnings', 'NOAA'),
  x('warnings', 'Tsunami.gov', 'https://www.tsunami.gov/', 'Tsunami warning centers', 'NOAA'),
  x('warnings', 'NL-Alert', 'https://www.nl-alert.nl/', 'Dutch government emergency alerts', 'Government of NL'),
  x('warnings', 'Crisis.nl', 'https://www.crisis.nl/', 'Dutch crisis information'),
  x('warnings', 'Safecast', 'https://map.safecast.org/', 'Open radiation measurement map', 'Safecast', true),
  x('warnings', 'WHO Outbreak News', 'https://www.who.int/emergencies/disease-outbreak-news', 'Disease outbreak notices', 'WHO'),
  x('warnings', 'SpaceWeatherLive', 'https://www.spaceweatherlive.com/', 'Solar storms and aurora alerts'),
  // Webcams
  x('webcams', 'Windy Webcams', 'https://www.windy.com/webcams', 'Thousands of public cams on a map'),
  x('webcams', 'EarthCam', 'https://www.earthcam.com/', 'Landmark live cams'),
  x('webcams', 'Skyline Webcams', 'https://www.skylinewebcams.com/', 'HD city & nature cams'),
  x('webcams', 'Insecam directory', 'https://www.webcamtaxi.com/', 'Webcam Taxi public camera directory'),
  x('webcams', 'Explore.org', 'https://explore.org/livecams', 'Nature & wildlife live cams (non-profit)'),
  x('webcams', 'ALERTWildfire', 'https://www.alertwildfire.org/', 'Wildfire detection cameras', 'Univ. of Nevada et al.'),
  // Independent news
  x('news', 'Bellingcat', 'https://www.bellingcat.com/', 'Open-source investigations', 'Bellingcat'),
  x('news', 'ProPublica', 'https://www.propublica.org/', 'Non-profit investigative journalism'),
  x('news', 'OCCRP', 'https://www.occrp.org/', 'Organized crime & corruption reporting'),
  x('news', 'ICIJ', 'https://www.icij.org/', 'Intl. consortium of investigative journalists'),
  x('news', 'Follow the Money', 'https://www.ftm.eu/', 'Dutch/EU investigative platform'),
  x('news', 'The Bureau of Investigative Journalism', 'https://www.thebureauinvestigates.com/', 'Independent UK investigations'),
  x('news', 'Democracy Now!', 'https://www.democracynow.org/', 'Independent daily news'),
  x('news', 'The Intercept', 'https://theintercept.com/', 'Adversarial investigative journalism'),
  x('news', 'Global Voices', 'https://globalvoices.org/', 'Citizen media from around the world'),
  x('news', 'Ground News', 'https://ground.news/', 'Compare bias across news sources'),
  x('news', 'AllSides', 'https://www.allsides.com/', 'Left, center and right side by side'),
  // Fact-checking
  x('factcheck', 'Google Fact Check Explorer', 'https://toolbox.google.com/factcheck/explorer', 'Search published fact-checks'),
  x('factcheck', 'Snopes', 'https://www.snopes.com/', 'Rumor & claim checking'),
  x('factcheck', 'Full Fact', 'https://fullfact.org/', 'Independent UK fact-checking charity'),
  x('factcheck', 'EUvsDisinfo', 'https://euvsdisinfo.eu/', 'Disinformation database'),
  x('factcheck', 'InVID / WeVerify', 'https://www.invid-project.eu/tools-and-services/invid-verification-plugin/', 'Video verification browser plugin', 'AFP & partners', true),
  x('factcheck', 'Media Bias / Fact Check', 'https://mediabiasfactcheck.com/', 'Source reliability ratings'),
  // Conflict
  x('conflict', 'Liveuamap', 'https://liveuamap.com/', 'Live conflict news map'),
  x('conflict', 'ACLED', 'https://acleddata.com/', 'Armed conflict event data'),
  x('conflict', 'Crisis Group CrisisWatch', 'https://www.crisisgroup.org/crisiswatch', 'Monthly conflict tracker'),
  x('conflict', 'GDELT', 'https://www.gdeltproject.org/', 'Global event & news database', 'GDELT Project', true),
  // Maps
  x('maps', 'Sentinel Hub EO Browser', 'https://apps.sentinel-hub.com/eo-browser/', 'Free satellite imagery', 'Sinergise / ESA'),
  x('maps', 'NASA Worldview', 'https://worldview.earthdata.nasa.gov/', 'Daily global satellite imagery', 'NASA', true),
  x('maps', 'OpenStreetMap', 'https://www.openstreetmap.org/', 'Open community map', 'OSM contributors', true),
  x('maps', 'Overpass Turbo', 'https://overpass-turbo.eu/', 'Query map features', 'Martin Raifer', true),
  x('maps', 'SunCalc', 'https://www.suncalc.org/', 'Sun position for photo geolocation'),
  x('maps', 'Mapillary', 'https://www.mapillary.com/app', 'Open street-level imagery'),
  // Aviation & ships
  x('aviation', 'ADS-B Exchange', 'https://globe.adsbexchange.com/', 'Unfiltered flight tracking'),
  x('aviation', 'OpenSky Network', 'https://opensky-network.org/', 'Open air-traffic research data', 'OpenSky', true),
  x('aviation', 'Flightradar24', 'https://www.flightradar24.com/', 'Live flight map'),
  x('aviation', 'MarineTraffic', 'https://www.marinetraffic.com/', 'Live ship positions'),
  x('aviation', 'VesselFinder', 'https://www.vesselfinder.com/', 'Free vessel tracking'),
  // People
  x('people', 'Sherlock', 'https://github.com/sherlock-project/sherlock', 'Find usernames across 400+ sites', 'Sherlock Project · MIT', true),
  x('people', 'Maigret', 'https://github.com/soxoj/maigret', 'Username dossier builder', 'soxoj · MIT', true),
  x('people', 'WhatsMyName', 'https://whatsmyname.app/', 'Web username enumeration', 'WebBreacher · MIT', true),
  x('people', 'Holehe', 'https://github.com/megadose/holehe', 'Check where an email is registered', 'megadose · GPL-3.0', true),
  x('people', 'Have I Been Pwned', 'https://haveibeenpwned.com/', 'Breach check for email', 'Troy Hunt'),
  x('people', 'PhoneInfoga', 'https://github.com/sundowndev/phoneinfoga', 'Phone number intelligence', 'sundowndev · GPL-3.0', true),
  // Images
  x('images', 'TinEye', 'https://tineye.com/', 'Reverse image search'),
  x('images', 'Google Lens', 'https://lens.google.com/', 'Visual search'),
  x('images', 'Yandex Images', 'https://yandex.com/images/', 'Strong face/place reverse search'),
  x('images', 'FotoForensics', 'https://fotoforensics.com/', 'Error-level image analysis'),
  x('images', 'ExifTool', 'https://exiftool.org/', 'Read photo metadata', 'Phil Harvey · GPL/Artistic', true),
  x('images', 'Forensically', 'https://29a.ch/photo-forensics/', 'Browser photo forensics', 'Jonas Wagner'),
  // Web
  x('web', 'Wayback Machine', 'https://web.archive.org/', 'Archived web pages', 'Internet Archive'),
  x('web', 'archive.today', 'https://archive.ph/', 'Snapshot any page'),
  x('web', 'urlscan.io', 'https://urlscan.io/', 'Safely scan a suspicious link'),
  x('web', 'VirusTotal', 'https://www.virustotal.com/', 'Scan files and URLs'),
  x('web', 'crt.sh', 'https://crt.sh/', 'Certificate transparency search'),
  x('web', 'DNSDumpster', 'https://dnsdumpster.com/', 'DNS reconnaissance'),
  x('web', 'Shodan', 'https://www.shodan.io/', 'Internet-connected devices'),
  x('web', 'SpiderFoot', 'https://github.com/smicallef/spiderfoot', 'Automated OSINT scanner', 'smicallef · MIT', true),
  x('web', 'theHarvester', 'https://github.com/laramies/theHarvester', 'Emails, subdomains, hosts', 'laramies · GPL-2.0', true),
  // Frameworks
  x('frameworks', 'OSINT Framework', 'https://osintframework.com/', 'Tree of free OSINT tools', 'jnordine · MIT', true),
  x('frameworks', 'Bellingcat Toolkit', 'https://bellingcat.gitbook.io/toolkit', 'Investigators’ tool list', 'Bellingcat'),
  x('frameworks', 'Awesome OSINT', 'https://github.com/jivoi/awesome-osint', 'Huge curated GitHub list', 'jivoi · CC0', true),
  x('frameworks', 'IntelTechniques Tools', 'https://inteltechniques.com/tools/', 'Search tool collection', 'Michael Bazzell'),
  x('frameworks', 'First Draft / Verification Handbook', 'https://datajournalism.com/read/handbook/verification-3', 'Free verification guide', 'EJC'),
];
