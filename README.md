# GMI 홈페이지

HTML / CSS / JavaScript로 만든 정적 홈페이지입니다. 별도 설치 없이 바로 열 수 있어요.

## 폴더 구조
```
index.html          메인 페이지 (메뉴, 슬라이드)
css/style.css       디자인 (색상은 맨 위 :root 에서 변경)
js/main.js          메뉴 동작, 슬라이드 자동 전환
images/slides/      메인 슬라이드 사진 넣는 곳
```

## VS Code로 보기
1. 저장소 받기: `git clone https://github.com/gyumin0847/GMI_HomePage.git`
2. VS Code에서 **파일 → 폴더 열기** 로 `GMI_HomePage` 폴더 열기
3. 오른쪽 아래에 추천 확장 **Live Server** 설치 안내가 뜨면 설치
4. `index.html` 우클릭 → **Open with Live Server** → 브라우저에서 자동으로 열림 (저장할 때마다 자동 새로고침)

(Live Server 없이 `index.html`을 더블클릭해서 브라우저로 열어도 됩니다.)

## 슬라이드 사진 바꾸기
1. 사진을 `images/slides/` 폴더에 넣기 (예: `photo1.jpg`)
2. `index.html`에서 `<div class="slide" data-bg="">` 의 `data-bg` 에 경로 입력
   ```html
   <div class="slide" data-bg="images/slides/photo1.jpg">
   ```
3. 슬라이드 수를 늘리려면 `<div class="slide">...</div>` 블록을 복사
4. 전환 시간은 `js/main.js` 맨 위 `SLIDE_INTERVAL` 값 변경 (5000 = 5초)
