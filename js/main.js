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
function setMobileMenu(open) {
  header.classList.toggle("mobile-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMobileMenu(!header.classList.contains("mobile-open")));
document.querySelectorAll(".gnb-list > li > a").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (!isMobile()) return;
    e.preventDefault();
    const li = a.parentElement;
    document.querySelectorAll(".gnb-list > li.expanded").forEach((x) => { if (x !== li) x.classList.remove("expanded"); });
    li.classList.toggle("expanded");
  });
});
// 하위 메뉴를 누르면 메뉴 닫기
document.querySelectorAll(".sub a").forEach((a) => {
  a.addEventListener("click", () => { setMobileMenu(false); header.classList.remove("open"); });
});
// 모바일 메뉴를 연 채로 화면이 PC 크기가 되면 닫기 (스크롤 잠김 방지)
window.matchMedia("(max-width: 1024px)").addEventListener("change", (e) => { if (!e.matches) setMobileMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { setMobileMenu(false); header.classList.remove("open"); }
});

// 아직 페이지가 없는 링크(href="#")는 눌러도 맨 위로 튀지 않게
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault();
});

// ===== 메인 슬라이드 (메인 페이지에만 있음) =====
const hero = document.getElementById("hero");
if (hero) {
  const slides = document.querySelectorAll(".slide");
  const tabsEl = document.getElementById("heroTabs");
  const pauseBtn = document.getElementById("pauseBtn");
  const pad = (n) => String(n).padStart(2, "0");
  let current = 0;
  let timer = null;
  let playing = true;

  // 슬라이드마다 선택 탭 만들기 (번호 + data-tab 제목 + 진행선)
  const tabs = [...slides].map((slide, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button"><i class="ht-bar"><b></b></i><span class="ht-num">${pad(i + 1)}</span><span class="ht-label">${slide.dataset.tab || ""}</span></button>`;
    const btn = li.querySelector("button");
    btn.setAttribute("aria-label", `${i + 1}번 슬라이드: ${slide.dataset.tab || ""}`);
    btn.addEventListener("click", () => goTo(i));
    tabsEl.appendChild(li);
    return btn;
  });

  // data-bg에 적힌 사진을 배경으로 넣기
  slides.forEach((slide) => {
    const bg = document.createElement("div");
    bg.className = "slide-bg";
    if (slide.dataset.bg) bg.style.backgroundImage = `url("${slide.dataset.bg}")`;
    slide.prepend(bg);
  });

  // 지금 탭의 선이 다음 슬라이드까지 차오름 (일시정지면 꽉 찬 채로 멈춤)
  function runBar() {
    tabs.forEach((t) => { const b = t.querySelector(".ht-bar b"); b.style.transition = "none"; b.style.width = "0"; });
    const bar = tabs[current].querySelector(".ht-bar b");
    if (!playing) { bar.style.width = "100%"; return; }
    bar.offsetWidth; // 애니메이션 다시 시작
    bar.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
    bar.style.width = "100%";
  }

  function goTo(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    tabs.forEach((t, i) => {
      t.classList.toggle("on", i === current);
      t.setAttribute("aria-current", i === current ? "true" : "false");
    });
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
  hero.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  goTo(0);
}

// ===== 소개 페이지 목차 탭: 지금 보고 있는 영역 표시 =====
const tabLinks = document.querySelectorAll(".sub-tabs:not(.gallery-filter) a");
if (tabLinks.length) {
  const targets = [...tabLinks].map((a) => document.querySelector(a.getAttribute("href")));
  const markTab = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let idx = 0;
    targets.forEach((t, i) => { if (t && t.offsetTop <= y) idx = i; });
    tabLinks.forEach((a, i) => a.classList.toggle("on", i === idx));
  };
  window.addEventListener("scroll", markTab, { passive: true });
  markTab();
}

// ===== 포토갤러리: 분류 탭 =====
const filterLinks = document.querySelectorAll(".gallery-filter a");
if (filterLinks.length) {
  const albums = document.querySelectorAll(".album");
  const applyFilter = () => {
    const h = location.hash.slice(1);
    const cat = ["field", "school", "forum", "event"].includes(h) ? h : "all";
    albums.forEach((a) => { a.hidden = cat !== "all" && a.dataset.cat !== cat; });
    // 보이는 앨범이 없는 연도는 제목과 바로가기까지 숨김
    document.querySelectorAll(".year-group").forEach((g) => {
      g.hidden = !g.querySelector(".album:not([hidden])");
      const link = document.querySelector(`.year-nav a[href="#${g.id}"]`);
      if (link) link.hidden = g.hidden;
    });
    filterLinks.forEach((l) => l.classList.toggle("on", l.dataset.filter === cat));
  };
  filterLinks.forEach((l) => l.addEventListener("click", (e) => {
    e.preventDefault();
    history.replaceState(null, "", l.dataset.filter === "all" ? location.pathname : "#" + l.dataset.filter);
    applyFilter();
    document.querySelector(".gallery-page").scrollIntoView({ behavior: "smooth" });
  }));
  window.addEventListener("hashchange", applyFilter);
  applyFilter();

  // 연도 바로가기: 분류 선택은 유지한 채 해당 연도로 이동
  document.querySelectorAll(".year-nav a").forEach((l) => l.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(l.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
  }));
}

// ===== 포토갤러리: 사진 크게 보기 =====
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImg = lightbox.querySelector("img");
  let list = [];
  let idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    lbImg.src = a.getAttribute("href");
    lbImg.alt = a.querySelector("img").alt;
    lightbox.querySelector(".lb-title").textContent = a.closest(".album").querySelector("h3").textContent;
    lightbox.querySelector(".lb-cap").textContent = a.dataset.caption || "";
    lightbox.querySelector(".lb-count").textContent = `${idx + 1} / ${list.length}`;
  };
  const close = () => { lightbox.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; };
  document.querySelectorAll(".album-grid a").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    list = [...a.closest(".album-grid").querySelectorAll("a")];
    show(list.indexOf(a));
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }));
  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  let sx = null;
  lightbox.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
}
