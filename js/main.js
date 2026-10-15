// ===== 설정 =====
const SLIDE_INTERVAL = 5000; // 슬라이드가 바뀌는 시간 (밀리초, 5000 = 5초)

// ===== 헤더 / 메뉴 =====
const header = document.getElementById("header");
const gnb = document.getElementById("gnb");
const menuBtn = document.getElementById("menuBtn");
const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;

// 스크롤하면 헤더를 흰색으로
const onScroll = () => header.classList.toggle("solid", window.scrollY > 10);
window.addEventListener("scroll", onScroll);
onScroll();

// PC: 메뉴에 마우스를 올리면 하위 메뉴 전체 펼침
gnb.addEventListener("mouseenter", () => { if (!isMobile()) header.classList.add("open"); });
header.addEventListener("mouseleave", () => header.classList.remove("open"));
gnb.addEventListener("focusin", () => { if (!isMobile()) header.classList.add("open"); });
header.addEventListener("focusout", (e) => { if (!header.contains(e.relatedTarget)) header.classList.remove("open"); });

// 모바일: 햄버거 버튼으로 전체 화면 메뉴 열기, 메뉴 누르면 하위 메뉴 펼치기
menuBtn.addEventListener("click", () => {
  const open = header.classList.toggle("mobile-open");
  menuBtn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
document.querySelectorAll(".gnb-list > li > a").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (!isMobile()) return;
    e.preventDefault();
    const li = a.parentElement;
    document.querySelectorAll(".gnb-list > li.expanded").forEach((x) => { if (x !== li) x.classList.remove("expanded"); });
    li.classList.toggle("expanded");
  });
});

// ===== 메인 슬라이드 =====
const slides = document.querySelectorAll(".slide");
const curNum = document.getElementById("curNum");
const bar = document.getElementById("progressBar");
const pauseBtn = document.getElementById("pauseBtn");
const pad = (n) => String(n).padStart(2, "0");
let current = 0;
let timer = null;
let playing = true;

document.getElementById("totalNum").textContent = pad(slides.length);

// data-bg에 적힌 사진을 배경으로 넣기
slides.forEach((slide) => {
  const bg = document.createElement("div");
  bg.className = "slide-bg";
  if (slide.dataset.bg) bg.style.backgroundImage = `url("${slide.dataset.bg}")`;
  slide.prepend(bg);
});

function runBar() {
  bar.style.transition = "none";
  bar.style.width = "0";
  if (!playing) return;
  bar.offsetWidth; // 애니메이션 다시 시작
  bar.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
  bar.style.width = "100%";
}

function goTo(index) {
  slides[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  curNum.textContent = pad(current + 1);
  restart();
}

function restart() {
  clearTimeout(timer);
  runBar();
  if (playing) timer = setTimeout(() => goTo(current + 1), SLIDE_INTERVAL);
}

document.getElementById("prevBtn").addEventListener("click", () => goTo(current - 1));
document.getElementById("nextBtn").addEventListener("click", () => goTo(current + 1));
pauseBtn.addEventListener("click", () => {
  playing = !playing;
  pauseBtn.classList.toggle("paused", !playing);
  pauseBtn.setAttribute("aria-label", playing ? "일시정지" : "재생");
  restart();
});

// 휴대폰에서 좌우로 밀어서 넘기기
let startX = null;
const hero = document.getElementById("hero");
hero.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  startX = null;
});

goTo(0);
