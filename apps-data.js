// =============================================
// diLA Tech — Shared App Data Manager
// All pages read from MySQL via api.php.
// Admin panel writes to MySQL via api.php.
// =============================================

const API_URL = 'api.php';

const DEFAULT_APPS = [];

const DEFAULT_PREMIUM = {
    monthly: '0.00',
    yearly: '0.00',
    discount: '0',
    features: []
};

const DEFAULT_STATS = {
    apps: '0',
    downloads: '0',
    rating: '0.0',
    activeUsers: '0'
};

const DEFAULT_REVIEWS = [];

// ---- Public API (Async) ----

async function getApps() {
    try {
        const res = await fetch(`${API_URL}?action=get_apps`);
        const data = await res.json();
        return (data && data.length > 0) ? data : DEFAULT_APPS;
    } catch (e) {
        console.error("Failed to fetch apps:", e);
        return DEFAULT_APPS;
    }
}

async function getAppById(id) {
    const apps = await getApps();
    return apps.find(a => a.id === id) || null;
}

async function saveApps(apps) {
    try {
        await fetch(`${API_URL}?action=save_apps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apps)
        });
    } catch (e) { console.error("Save failed:", e); }
}

async function deleteApp(id) {
    const apps = await getApps();
    const filtered = apps.filter(a => a.id !== id);
    await saveApps(filtered);
}

async function upsertApp(app) {
    const apps = await getApps();
    const idx = apps.findIndex(a => a.id === app.id);
    if (idx >= 0) apps[idx] = app;
    else apps.push(app);
    await saveApps(apps);
}

function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ---- Premium Settings ----

async function getPremiumSettings() {
    try {
        const res = await fetch(`${API_URL}?action=get_site_data&key=premium_settings`);
        const data = await res.json();
        return data || DEFAULT_PREMIUM;
    } catch (e) { return DEFAULT_PREMIUM; }
}

async function savePremiumSettings(settings) {
    await fetch(`${API_URL}?action=save_site_data&key=premium_settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
}

// ---- Site Statistics ----

async function getSiteStats() {
    try {
        const res = await fetch(`${API_URL}?action=get_site_data&key=site_stats`);
        const data = await res.json();
        return data || DEFAULT_STATS;
    } catch (e) { return DEFAULT_STATS; }
}

async function saveSiteStats(stats) {
    await fetch(`${API_URL}?action=save_site_data&key=site_stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
    });
}

// ---- Reviews ----

async function getReviews() {
    try {
        const res = await fetch(`${API_URL}?action=get_site_data&key=reviews`);
        const data = await res.json();
        return data || DEFAULT_REVIEWS;
    } catch (e) { return DEFAULT_REVIEWS; }
}

async function saveReviews(reviews) {
    await fetch(`${API_URL}?action=save_site_data&key=reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviews)
    });
}

const ICON_OPTIONS = [
    { value: 'ui-notes|bx-wallet-alt',    label: '💰 Finance / Wallet' },
    { value: 'ui-fitness|bx-book-open',   label: '📖 Education / Book' },
    { value: 'ui-finance|bx-conversation',label: '💬 Chat / Conversation' },
    { value: 'ui-notes|bx-edit',          label: '✏️ Notes / Edit' },
    { value: 'ui-fitness|bx-dumbbell',    label: '💪 Fitness / Health' },
    { value: 'ui-finance|bx-heart',       label: '❤️ Health / Wellness' },
    { value: 'ui-notes|bx-music',         label: '🎵 Music / Audio' },
    { value: 'ui-fitness|bx-camera',      label: '📷 Photo / Camera' },
    { value: 'ui-finance|bx-map',         label: '🗺️ Travel / Maps' },
    { value: 'ui-notes|bx-game',          label: '🎮 Games / Fun' },
    { value: 'ui-fitness|bx-code-alt',    label: '💻 Tools / Productivity' },
    { value: 'ui-finance|bx-store-alt',   label: '🛍️ Shopping / Store' },
];
