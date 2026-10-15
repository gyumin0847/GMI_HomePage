// ===== 설정 =====
const SLIDE_INTERVAL = 5000; // 슬라이드가 바뀌는 시간 (밀리초, 5000 = 5초)

// ===== 메뉴 =====
const header = document.getElementById("header");
const gnb = document.getElementById("gnb");
const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;

// PC: 메뉴에 마우스를 올리면 하위 메뉴 전체 펼침
gnb.addEventListener("mouseenter", () => { if (!isMobile()) header.classList.add("open"); });
header.addEventListener("mouseleave", () => header.classList.remove("open"));

// 모바일: 햄버거 버튼 / 메뉴 클릭 시 하위 메뉴 열기
document.getElementById("menuBtn").addEventListener("click", () => {
  header.classList.toggle("mobile-open");
});
document.querySelectorAll(".gnb-list > li > a").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (!isMobile()) return;
    e.preventDefault();
    a.parentElement.classList.toggle("expanded");
  });
});

// ===== 메인 슬라이드 =====
const slides = document.querySelectorAll(".slide");
const dotsBox = document.getElementById("dots");
const pauseBtn = document.getElementById("pauseBtn");
let current = 0;
let timer = null;
let playing = true;

// data-bg에 사진 경로가 있으면 배경으로 적용
slides.forEach((slide, i) => {
  const bg = slide.dataset.bg;
  if (bg) slide.style.backgroundImage = `url("${bg}")`;

  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `${i + 1}번 슬라이드`);
  dot.addEventListener("click", () => { goTo(i); restart(); });
  dotsBox.appendChild(dot);
});
const dots = dotsBox.querySelectorAll("button");

function goTo(index) {
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

function start() { timer = setInterval(() => goTo(current + 1), SLIDE_INTERVAL); }
function stop() { clearInterval(timer); }
function restart() { if (playing) { stop(); start(); } }

document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); restart(); });
document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); restart(); });
pauseBtn.addEventListener("click", () => {
  playing = !playing;
  if (playing) { start(); pauseBtn.innerHTML = "&#10073;&#10073;"; }
  else { stop(); pauseBtn.innerHTML = "&#9654;"; }
});

goTo(0);
start();
