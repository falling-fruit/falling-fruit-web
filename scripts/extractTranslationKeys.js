/**
 * This script extracts all i18n_viz translation keys from a webpage.
 * It's designed to be run in the browser console on a page with i18n_viz enabled.
 * 
 * Usage:
 * 1. Navigate to the desired page in your browser
 * 2. Open the browser console
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run the script
 * 
 * The script will:
 * - Scan all visible elements in the main content area
 * - Simulate mouseover events to trigger i18n_viz tooltips
 * - Extract and collect unique translation keys
 * - Group keys by their top-level category
 * - Copy the grouped keys to the clipboard
 * - Log progress and results to the console
 * 
 * Note: This script assumes the presence of an i18n_viz tooltip with id 'i18n_viz_tooltip'.
 * Adjust the selector if your setup differs.
 */

async function copyAllTranslationKeys() {
    // Select only the main content area, adjust the selector if needed
    const mainContent = document.querySelector('#content');
    if (!mainContent) {
        console.error('Main content area not found');
        return;
    }

    const elements = mainContent.querySelectorAll('*');
    const keys = [];
    const totalElements = elements.length;

    console.log(`Starting to process ${totalElements} elements in the main content...`);

    for (let i = 0; i < totalElements; i++) {
        const element = elements[i];
        
        // Skip hidden elements
        if (element.offsetParent === null) continue;

        // Simulate mouseover event
        element.dispatchEvent(new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        }));

        // Wait a short time for any tooltips to appear
        await new Promise(resolve => setTimeout(resolve, 50));

        // Check for tooltip and extract key
        const tooltip = document.querySelector('#i18n_viz_tooltip');
        if (tooltip) {
            const key = tooltip.textContent.trim();
            if (key.includes('.') && !keys.includes(key)) {
                keys.push(key);
            }
        }

        // Log progress every 100 elements
        if (i % 100 === 0 || i === totalElements - 1) {
            console.log(`Processed ${i + 1}/${totalElements} elements. Found ${keys.length} unique keys so far.`);
        }
    }

    console.log(`Found ${keys.length} unique translation keys`);
    console.log('Keys found:', keys);

    // Group keys by their top-level category
    const groupedKeys = keys.reduce((acc, key) => {
        const category = key.split('.')[0];
        if (!acc[category]) acc[category] = [];
        acc[category].push(key);
        return acc;
    }, {});

    console.log('Grouped keys:', groupedKeys);

    if (keys.length > 0) {
        const keysText = Object.entries(groupedKeys)
            .map(([category, categoryKeys]) => `${category}:\n${categoryKeys.join('\n')}`)
            .join('\n\n');

        navigator.clipboard.writeText(keysText).then(() => {
            console.log('All translation keys copied to clipboard');
            console.log('Copied content:', keysText);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    } else {
        console.log('No translation keys found');
    }
}

// Uncomment the line below to run the function automatically when the script is pasted into the console
// copyAllTranslationKeys();
