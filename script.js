const screen = document.getElementById('screen');

// All Competencies Data (Categorized)
const allCompetencies = {
    'being': [
        'Flexible', 'Creative Confident', 'Self-learner', 'Original', 'Intrinsic motivation'
    ],
    'thinking': [
        'Strategies', 'Synthesis', 'Pragmatic Thinking', 'Critical Thinking', 'Conceptual Thinking', 
        'Micro/Meso/Macro', 'Kineasthetic', 'Spatial Thinking', 'Visual Thinking'
    ],
    'awareness': [
        'Situational awareness', 'Embodied awareness', 'Emotional awareness', 'Tangible awareness', 
        'Process awareness', 'Socio-Cultural Awareness'
    ],
    'creating': [
        '2D Design', 'Visual design development', 'Visualization techniques', 'Digital visualization techniques', '3D Design', 
        'Form development', 'Spatial Design Development', 'Fabrication techniques', 'Digital fabrication techniques', '4D Design', 
        'Interaction design', 'User experience design', 'Service design', 'Systems design', '5D Design', 
        'Creative coding', 'Data analysis', 'Systems integration', 'Physical computing'
    ],
    'managing': [
        'Communication', 'Communication using language & metaphor', 'Communicate using story telling', 'Communication and presentation', 
        'Collaboration', 'Interdiciplinary collaboration', 'Co-design collaboration process', 'Collaborate through facilitation', 
        'Collaborate across platforms', 'Managing collaboration', 'Process', 'Managing design process', 'Desiging design process', 
        'Managing complexity', 'Managing Context', 'Business context', 'Context of Business Stakeholders', 'Business processes', 
        'Context of global diversity'
    ]
};

// Current display data (starts with empty placeholders or initial set)
// Initially we track 24 slots. 
let displayData = Array.from({ length: 24 }, (_, i) => ({
    id: `item-${i + 1}`,
    label: '',
    level: 0,
    category: null
}));

// Initialize with some default items (or randomize immediately)
// For now, let's keep the user's previously requested first 24 items as logic if we want to preserve state, 
// but since the requirement is "Randomize... panel... remove", we'll rely on the randomize function.
// Let's run a randomization on start to fill it.


// 렌더링 함수
function renderCircles(data) {
    screen.innerHTML = ''; // 기존 내용 초기화

    data.forEach(item => {
        // 컨테이너 생성 (원 + 텍스트)
        const container = document.createElement('div');
        container.classList.add('grid-item');

        // 원 생성
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.id = item.id;          // 고유 ID 부여
        circle.dataset.level = item.level; // 레벨 데이터 속성 부여
        // 데이터 속성으로 카테고리 저장
        if (item.category) {
            circle.dataset.category = item.category;
        }

        // Hide visual elements if label is empty
        if (!item.label) {
            circle.classList.add('empty-slot');
        }
        
        // 텍스트 라벨 생성
        const label = document.createElement('div');
        label.classList.add('circle-label');
        label.textContent = item.label; // 라벨 텍스트 설정

        // 조립
        container.appendChild(circle);
        container.appendChild(label);
        screen.appendChild(container);
    });
}

// ---- UI Generation ----

function generateControlPanel() {
    const container = document.getElementById('competencies-list');
    container.innerHTML = '';

    for (const [category, items] of Object.entries(allCompetencies)) {
        // Group Container
        const group = document.createElement('div');
        group.className = 'category-group';

        // Header
        const header = document.createElement('div');
        header.className = 'category-header';

        const labelArea = document.createElement('div');
        labelArea.className = 'cat-label-area';

        // Category Label (Just Text)
        const catLabel = document.createElement('span');
        catLabel.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        catLabel.style.cursor = "pointer";
        catLabel.addEventListener('click', () => {
             const itemsCont = group.querySelector('.items-container');
             itemsCont.classList.toggle('expanded');
             expandBtn.textContent = itemsCont.classList.contains('expanded') ? '-' : '+';
        });

        labelArea.appendChild(catLabel);

        // Expand Button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.textContent = '+';
        expandBtn.addEventListener('click', () => {
             const itemsCont = group.querySelector('.items-container');
             itemsCont.classList.toggle('expanded');
             expandBtn.textContent = itemsCont.classList.contains('expanded') ? '-' : '+';
        });

        header.appendChild(labelArea);
        header.appendChild(expandBtn);
        group.appendChild(header);

        // Items Container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-container';
        // Add ID for easier selection if needed, though mostly using class query
        
        items.forEach(itemLabel => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';

            const itemCheckbox = document.createElement('input');
            itemCheckbox.type = 'checkbox';
            itemCheckbox.className = 'item-cb';
            // Initially unchecked until randomize syncs them
            itemCheckbox.checked = false; 
            itemCheckbox.dataset.label = itemLabel;
            itemCheckbox.dataset.category = category;
            
            // Individual item toggle
            itemCheckbox.addEventListener('change', (e) => {
                handleItemToggle(itemLabel, category, e.target.checked, e.target);
            });

            const lbl = document.createElement('label');
            lbl.textContent = itemLabel;
            lbl.addEventListener('click', () => {
                itemCheckbox.click(); // Trigger change event
            });

            itemRow.appendChild(itemCheckbox);
            itemRow.appendChild(lbl);
            itemsContainer.appendChild(itemRow);
        });

        group.appendChild(itemsContainer);
        container.appendChild(group);
    }
}

// ---- State Management ----

/**
 * Extract currently active items from the grid to an array.
 * Useful for preserving order/levels when modifying the list.
 */
function extractActiveItems() {
    return displayData
        .filter(item => item.label && item.label !== '')
        .map(item => ({
            label: item.label,
            category: item.category,
            level: item.level
        }));
}

/**
 * Updates displayData with a new list of active items, 
 * packing them from the start (top-left) and leaving empty slots at the end.
 * @param {Array} items - Array of {label, category, level}
 */
function updateDisplay(items) {
    // Reset displayData
    displayData = Array.from({ length: 24 }, (_, i) => ({
        id: `item-${i + 1}`,
        label: '',
        level: 0,
        category: null
    }));

    // Fill with provided items
    items.forEach((item, i) => {
        if (i < 24) {
            displayData[i].label = item.label;
            displayData[i].category = item.category;
            displayData[i].level = item.level !== undefined ? item.level : 0;
        }
    });

    renderCircles(displayData);
}

// ---- Panel Logic (Sync) ----

function handleItemToggle(label, category, isChecked, checkboxElem) {
    let activeItems = extractActiveItems();
    
    if (isChecked) {
        if (activeItems.length >= 24) {
            alert("Maximum 24 items displayed. Please remove an item first.");
            checkboxElem.checked = false; // Revert check
            return;
        }
        // Add new item to the end of the packed list
        activeItems.push({
            label: label,
            category: category,
            level: 0
        });
    } else {
        // Remove item
        activeItems = activeItems.filter(item => item.label !== label);
    }
    
    updateDisplay(activeItems);
}

function syncCheckboxesWithDisplay() {
    // Get all current labels on screen
    const activeLabels = new Set(displayData.map(d => d.label).filter(l => l !== ''));
    
    // Update all checkboxes
    const allCheckboxes = document.querySelectorAll('.item-cb');
    allCheckboxes.forEach(cb => {
        cb.checked = activeLabels.has(cb.dataset.label);
    });
}

function deactivateAll() {
    updateDisplay([]);
    syncCheckboxesWithDisplay();
}

document.getElementById('btn-toggle-panel').addEventListener('click', () => {
    const panel = document.getElementById('panel');
    const btn = document.getElementById('btn-toggle-panel');
    panel.classList.toggle('hidden');
    btn.textContent = panel.classList.contains('hidden') ? 'Show Panel' : 'Hide Panel';
});

document.getElementById('btn-deactivate-all').addEventListener('click', deactivateAll);


// ---- Randomize Logic (Updated to Full Pool) ----

function getAllCompetenciesFlat() {
    let pool = [];
    for (const [cat, items] of Object.entries(allCompetencies)) {
        items.forEach(lbl => {
            pool.push({ label: lbl, category: cat });
        });
    }
    return pool;
}

function randomizeCompetencies() {
    const pool = getAllCompetenciesFlat();
    
    // Fisher-Yates Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Pick top 24 or fewer
    const count = Math.min(pool.length, 24);
    
    // Create list of items
    const selectedItems = [];
    for (let i = 0; i < count; i++) {
        selectedItems.push({
            label: pool[i].label,
            category: pool[i].category,
            level: 0
        });
    }

    updateDisplay(selectedItems);
    syncCheckboxesWithDisplay(); // Update UI to reflect new state
}


// Event Listeners for Controls
document.getElementById('btn-randomize').addEventListener('click', randomizeCompetencies);

// Initial Setup
generateControlPanel();
randomizeCompetencies();

// Interaction: Left Click to increment, Right Click to reset
screen.addEventListener('click', (e) => {
    const circle = e.target.closest('.circle');
    if (circle) {
        // Prevent interaction if empty
        const item = displayData.find(d => d.id === circle.id);
        if (!item || !item.label) return;

        let currentLevel = parseInt(circle.dataset.level || 0);
        // Loop: 0 -> 1 -> 2 -> 3 -> 0
        let nextLevel = (currentLevel + 1) % 4;
        
        // Update DOM
        circle.dataset.level = nextLevel;
        
        // Update Internal Data
        if (item) item.level = nextLevel;
    }
});

// Interaction: Right Click to reset to 0
screen.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent context menu
    const circle = e.target.closest('.circle');
    if (circle) {
        const item = displayData.find(d => d.id === circle.id);
        if (!item || !item.label) return;

        // Update DOM
        circle.dataset.level = 0;
        
        // Update Internal Data
        if (item) item.level = 0;
    }
});