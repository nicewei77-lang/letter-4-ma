// 연도별 편지 데이터
const letterData = {
    2025: {
        date: '2025년',
        typed: `엄마, 생일 축하해요! 💕<br><br>
올해도 정말 고생 많으셨어요. 엄마의 사랑과 희생이 없었다면 
저는 지금 여기 없었을 거예요.<br><br>
항상 건강하시고 행복하세요. 사랑해요!`,
        handwritten: 'images/handwritten.jpg',
        photos: [
            'images/photos/photo1.jpg',
            'images/photos/photo2.jpg',
            'images/photos/photo3.jpg'
        ]
    },
    2026: {
        date: '2026년',
        typed: `엄마, 생일 축하해요! 💕<br><br>
올해도 정말 고생 많으셨어요.<br><br>
항상 건강하시고 행복하세요. 사랑해요!`,
        handwritten: 'images/handwritten.jpg',
        photos: [
            'images/photos/photo1.jpg',
            'images/photos/photo2.jpg',
            'images/photos/photo3.jpg'
        ]
    }
};

let currentYear = null;
const PASSWORD = '7135';

// 편지 펼쳐지기
const envelope = document.getElementById('envelope');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const letterContent = document.getElementById('letterContent');
const paperSound = document.getElementById('paperSound');
const yearSelector = document.getElementById('yearSelector');
const passwordWrapper = document.getElementById('passwordWrapper');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');

let isOpened = false;

// 비밀번호 확인
function checkPassword() {
    const input = passwordInput.value.trim();
    
    if (input === PASSWORD) {
        // 비밀번호 맞음
        passwordError.textContent = '';
        passwordWrapper.style.display = 'none';
        yearSelector.style.display = 'flex';
        
        // 로컬 스토리지에 저장 (선택사항)
        localStorage.setItem('letterAuthenticated', 'true');
    } else {
        // 비밀번호 틀림
        passwordError.textContent = '비밀번호가 올바르지 않습니다.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Enter 키로 비밀번호 입력
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// 페이지 로드 시 인증 확인
window.addEventListener('DOMContentLoaded', function() {
    // 로컬 스토리지 확인
    const authenticated = localStorage.getItem('letterAuthenticated');
    
    if (authenticated === 'true') {
        // 이미 인증됨
        passwordWrapper.style.display = 'none';
        yearSelector.style.display = 'flex';
    } else {
        // 비밀번호 입력 필요
        passwordWrapper.style.display = 'flex';
        yearSelector.style.display = 'none';
        passwordInput.focus();
    }
});

envelope.addEventListener('click', function() {
    if (isOpened) return;
    
    isOpened = true;
    
    // 소리 재생 (파일이 있으면)
    if (paperSound) {
        paperSound.play().catch(e => {
            console.log('소리 재생 실패 (선택사항):', e);
        });
    }
    
    // 편지 펼쳐지는 애니메이션
    envelope.classList.add('opening');
    
    // 애니메이션 후 내용 표시
    setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        letterContent.classList.add('show');
        
        // 스크롤 애니메이션 시작
        initScrollAnimations();
        
        // 사진 갤러리 초기화 (데이터가 있는 경우만)
        const data = letterData[currentYear];
        if (data && data.photos && data.photos.length > 0) {
            initPhotoGallery();
        }
        
        // 하트 효과 시작
        startHearts();
    }, 800);
});

// 스크롤 페이드인 애니메이션
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// 사진 갤러리
let photoIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

function initPhotoGallery() {
    const slider = document.getElementById('photoSlider');
    const dotsContainer = document.getElementById('photoDots');
    const slides = slider.querySelectorAll('.photo-slide');
    
    // 도트 생성
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToPhoto(index));
        dotsContainer.appendChild(dot);
    });
    
    // 터치 이벤트
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && photoIndex < slides.length - 1) {
                goToPhoto(photoIndex + 1);
            } else if (diff < 0 && photoIndex > 0) {
                goToPhoto(photoIndex - 1);
            }
        }
    });
    
    // 마우스 드래그 지원 (선택사항)
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        slider.style.cursor = 'grabbing';
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
    });
    
    slider.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        slider.style.cursor = 'grab';
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && photoIndex < slides.length - 1) {
                goToPhoto(photoIndex + 1);
            } else if (diff < 0 && photoIndex > 0) {
                goToPhoto(photoIndex - 1);
            }
        }
    });
    
    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });
}

function goToPhoto(index) {
    photoIndex = index;
    const slider = document.getElementById('photoSlider');
    const dots = document.querySelectorAll('.dot');
    
    slider.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// 떨어지는 하트
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = ['💕', '💖', '💗', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
    heart.style.animationDelay = Math.random() * 0.5 + 's';
    
    const container = document.querySelector('.hearts-container');
    if (container) {
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
}

function startHearts() {
    // 편지가 펼쳐진 후에만 하트 시작
    setInterval(createHeart, 600);
}

// 연도 선택
document.querySelectorAll('.year-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const year = parseInt(this.dataset.year);
        selectYear(year);
    });
});

function selectYear(year) {
    currentYear = year;
    const data = letterData[year];
    
    if (!data) {
        console.error('해당 연도의 데이터가 없습니다.');
        return;
    }
    
    // 연도 선택 화면 숨기기
    yearSelector.style.display = 'none';
    
    // 편지 봉투에 연도 표시
    const envelopeYear = document.getElementById('envelopeYear');
    if (envelopeYear) {
        envelopeYear.textContent = data.date;
    }
    
    // 편지 봉투 화면 표시
    envelopeWrapper.style.display = 'flex';
    
    // 편지 내용 미리 로드
    loadLetterContent(year);
    
    // 편지가 다시 열 수 있도록 초기화
    isOpened = false;
    envelope.classList.remove('opening');
    letterContent.classList.remove('show');
}

function loadLetterContent(year) {
    const data = letterData[year];
    if (!data) return;
    
    // 타이핑 편지
    const typedLetter = document.getElementById('typedLetter');
    if (typedLetter) {
        typedLetter.innerHTML = data.typed;
    }
    
    // 손편지 이미지
    const handwrittenImage = document.getElementById('handwrittenImage');
    const handwrittenSection = document.getElementById('handwrittenSection');
    if (handwrittenImage && data.handwritten) {
        handwrittenImage.src = data.handwritten;
    } else if (handwrittenSection && !data.handwritten) {
        handwrittenSection.style.display = 'none';
    }
    
    // 사진 갤러리
    const photoSlider = document.getElementById('photoSlider');
    if (photoSlider && data.photos && data.photos.length > 0) {
        photoSlider.innerHTML = '';
        data.photos.forEach((photo, index) => {
            const slide = document.createElement('div');
            slide.className = 'photo-slide';
            slide.innerHTML = `<img src="${photo}" alt="사진 ${index + 1}">`;
            photoSlider.appendChild(slide);
        });
    } else {
        const gallerySection = document.getElementById('gallerySection');
        if (gallerySection) {
            gallerySection.style.display = 'none';
        }
    }
}

// 뒤로 가기 버튼
function goBack() {
    // 편지 내용 숨기기
    letterContent.classList.remove('show');
    
    // 편지 봉투 숨기기
    envelopeWrapper.style.display = 'none';
    
    // 연도 선택 화면 다시 표시
    yearSelector.style.display = 'flex';
    
    // 상태 초기화
    isOpened = false;
    currentYear = null;
    envelope.classList.remove('opening');
    
    // 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

