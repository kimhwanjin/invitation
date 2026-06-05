// ==========================================
// 1. D-DAY COUNTDOWN TIMER
// ==========================================
const targetDate = new Date("2026-07-04T12:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const ddayTextEl = document.getElementById("dday-text");

  if (distance < 0) {
    // 결혼식이 이미 시작되었거나 지났을 때
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    ddayTextEl.innerHTML = "저희의 결혼식을 축하해주셔서 감사합니다! 💕";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // 자릿수 맞춤 (두 자리)
  const formatNum = (num) => (num < 10 ? `0${num}` : num);

  // 실시간으로 변하는 숫자의 텍스트 업데이트
  daysEl.textContent = formatNum(days);
  hoursEl.textContent = formatNum(hours);
  minutesEl.textContent = formatNum(minutes);
  secondsEl.textContent = formatNum(seconds);

  // D-Day 문구 업데이트
  ddayTextEl.innerHTML = `Gene Kim과 Jean Kim의 결혼식이 <span>${days}일 ${hours}시간</span> 남았습니다.`;
}

// 1초마다 카운트다운 함수 실행
setInterval(updateCountdown, 1000);
updateCountdown(); // 초기 실행


// ==========================================
// 2. SCROLL FADE-IN EFFECT (스크롤 애니메이션)
// ==========================================
const fadeElements = document.querySelectorAll(".fade-in");

const observerOptions = {
  root: null, // 뷰포트 기준
  rootMargin: "0px",
  threshold: 0.1 // 요소가 10% 이상 보일 때 감지
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // 한 번 나타난 후에는 관찰을 해제해 성능 최적화
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));


// ==========================================
// 3. IMAGE GALLERY SLIDER (모바일 터치 스와이프 지원)
// ==========================================
let currentSlide = 0;
const sliderWrapper = document.getElementById("slider-wrapper");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const dotsContainer = document.getElementById("slider-dots");

// 슬라이더 닷(Dots) 동적 생성
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll(".dot");

function updateSliderPosition() {
  sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  // 닷 활성화 상태 업데이트
  dots.forEach((dot, idx) => {
    if (idx === currentSlide) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function moveSlide(direction) {
  currentSlide += direction;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1; // 첫 장에서 이전 누르면 마지막으로
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0; // 마지막 장에서 다음 누르면 첫 장으로
  }
  updateSliderPosition();
}

function goToSlide(index) {
  currentSlide = index;
  updateSliderPosition();
}

// --- 모바일 터치 스와이프 로직 추가 ---
let touchStartX = 0;
let touchEndX = 0;

sliderWrapper.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderWrapper.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50; // 최소 드래그 거리 (픽셀)
  if (touchStartX - touchEndX > swipeThreshold) {
    // 왼쪽으로 스와이프 -> 다음 슬라이드
    moveSlide(1);
  } else if (touchEndX - touchStartX > swipeThreshold) {
    // 오른쪽으로 스와이프 -> 이전 슬라이드
    moveSlide(-1);
  }
}


// ==========================================
// 4. CONTACT MODAL (전화/문자 팝업)
// ==========================================
const contactModal = document.getElementById("contact-modal");
const contactModalTitle = document.getElementById("contact-modal-title");
const contactCall = document.getElementById("contact-call");
const contactSms = document.getElementById("contact-sms");

// 가상 전화번호
const groomPhone = "01012345678"; // Gene Kim
const bridePhone = "01098765432"; // Jean Kim

function openContactModal(target) {
  if (target === "groom") {
    contactModalTitle.textContent = "신랑 Gene Kim에게 연락하기";
    contactCall.href = `tel:${groomPhone}`;
    contactSms.href = `sms:${groomPhone}`;
  } else if (target === "bride") {
    contactModalTitle.textContent = "신부 Jean Kim에게 연락하기";
    contactCall.href = `tel:${bridePhone}`;
    contactSms.href = `sms:${bridePhone}`;
  }
  contactModal.classList.add("active");
}

function closeContactModal(e) {
  // 모달 영역 클릭이나 닫기 버튼으로 닫힘
  contactModal.classList.remove("active");
}


// ==========================================
// 5. IMAGE LIGHTBOX (사진 확대 보기)
// ==========================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(imagePath) {
  lightboxImg.src = imagePath;
  lightbox.classList.add("active");
}

function closeLightbox() {
  lightbox.classList.remove("active");
}


// ==========================================
// 6. ACCOUNT ACCORDION (축의금 아코디언 토글)
// ==========================================
function toggleAccordion(id) {
  const item = document.getElementById(id);
  const content = item.querySelector(".accordion-content");
  
  if (item.classList.contains("active")) {
    item.classList.remove("active");
    content.style.maxHeight = null;
  } else {
    // 다른 활성화된 아코디언 닫기 (선택사항)
    document.querySelectorAll(".accordion-item").forEach(otherItem => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".accordion-content").style.maxHeight = null;
    });

    item.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  }
}


// ==========================================
// 7. COPY ACCOUNT TO CLIPBOARD (계좌 복사 및 토스트)
// ==========================================
function copyAccount(accountNumber) {
  // 브라우저 클립보드 API 지원 여부 확인
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        showToast("계좌번호가 복사되었습니다. 😊");
      })
      .catch(err => {
        fallbackCopyText(accountNumber);
      });
  } else {
    fallbackCopyText(accountNumber);
  }
}

// Clipboard API를 지원하지 않는 브라우저를 위한 대체 복사 로직
function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  // 모바일에 화면에 보이지 않도록 처리
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast("계좌번호가 복사되었습니다. 😊");
    } else {
      showToast("복사 실패. 계좌번호를 확인해 주세요.");
    }
  } catch (err) {
    showToast("복사에 실패했습니다.");
  }

  document.body.removeChild(textArea);
}

// 토스트 메시지 띄우기
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // 2.5초 뒤에 닫기
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
