const screen = document.getElementById('screen');

// 데이터가 들어올 자리 (나중에 이 배열을 수정하면 됩니다)
// 예시로 24개의 데이터를 생성합니다.
const circleData = [
    // Row 1 (Top Row)
    { id: 'item-1', label: 'Communication skill', level: 2 },
    { id: 'item-2', label: 'CS Integration', level: 3 },
    { id: 'item-3', label: 'Prototyping Speed', level: 4 },
    { id: 'item-4', label: 'Project Management', level: 2 },
    { id: 'item-5', label: 'CAD Modelling', level: 4 },
    { id: 'item-6', label: 'Skill Experiment', level: 4 },
    
    // Row 2
    { id: 'item-7', label: 'Product Visualization', level: 4 },
    { id: 'item-8', label: 'User Journey Mapping', level: 2 },
    { id: 'item-9', label: 'Client Consulting', level: 1 },
    { id: 'item-10', label: 'KPIs Research', level: 1 },
    { id: 'item-11', label: 'Touchpoint Analysis', level: 2 },
    { id: 'item-12', label: 'Client Presentation', level: 1 },
    
    // Remaining placeholders (Rows 3-4)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `item-${i + 13}`,
        label: '',
        level: 1
    }))
];

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

// 초기 렌더링
renderCircles(circleData);

// 테스트용: 클릭 시 레벨이 올라가는 기능 (데이터 연결 전 테스트)
/*
screen.addEventListener('click', (e) => {
    if (e.target.classList.contains('circle')) {
        let currentLevel = parseInt(e.target.dataset.level);
        let nextLevel = currentLevel >= 4 ? 1 : currentLevel + 1;
        e.target.dataset.level = nextLevel;
    }
});
*/