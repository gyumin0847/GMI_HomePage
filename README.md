# GMI 홈페이지

HTML / CSS / JavaScript로 만든 정적 홈페이지입니다. 별도 설치 없이 바로 열 수 있어요.

## 폴더 구조
```
index.html          메인 페이지 (메뉴, 슬라이드)
css/style.css       디자인 (색상은 맨 위 :root 에서 변경)
js/main.js          메뉴 동작, 슬라이드 자동 전환
images/photos/      메인 슬라이드 사진 넣는 곳
```

## 내 컴퓨터에서 보고 수정하기

### 1. 준비 (처음 한 번만)
- [VS Code](https://code.visualstudio.com/) 설치
- [Git](https://git-scm.com/downloads) 설치 (Windows는 설치 화면에서 계속 "Next"를 눌러도 됩니다)

### 2. 코드 내려받기
VS Code를 열고 **터미널 → 새 터미널**을 누른 뒤 아래를 입력합니다.
```bash
git clone https://github.com/gyumin0847/GMI_HomePage.git
```
그다음 **파일 → 폴더 열기**로 방금 생긴 `GMI_HomePage` 폴더를 엽니다.

> Git 없이 받으려면: GitHub 저장소 페이지에서 초록색 **Code → Download ZIP** 을 누르고 압축을 풀면 됩니다. (이 경우 아래 5번의 GitHub 올리기는 할 수 없어요.)

### 3. 화면 띄우기
- 폴더를 열면 오른쪽 아래에 **Live Server** 확장 설치 안내가 뜹니다. 설치를 누르세요.
- `index.html` 을 우클릭 → **Open with Live Server**
- 브라우저가 열리고, 코드를 고쳐서 저장(Ctrl+S)할 때마다 화면이 자동으로 새로고침됩니다.

(가장 간단하게는 `index.html` 파일을 더블클릭해도 브라우저에서 열립니다.)

### 4. 어디를 고치면 되나요?
| 바꾸고 싶은 것 | 파일 | 위치 |
|---|---|---|
| 메뉴 이름, 슬라이드 문구, 기관 이름 | `index.html` | 한글 문구를 찾아서 바로 수정 |
| 전체 색상, 글꼴 | `css/style.css` | 맨 위 `:root { ... }` |
| 슬라이드 넘어가는 시간 | `js/main.js` | 맨 위 `SLIDE_INTERVAL` (5000 = 5초) |
| 슬라이드 사진 | `images/photos/` | 아래 "슬라이드 사진 바꾸기" 참고 |

### 5. 고친 내용을 GitHub에 올리기
VS Code 왼쪽의 **소스 제어**(가지 모양 아이콘)에서 메시지를 적고 **커밋** → **변경 내용 동기화**를 누르면 됩니다.
또는 터미널에서:
```bash
git add .
git commit -m "슬라이드 문구 수정"
git push
```

## 슬라이드 사진 바꾸기
1. 사진을 `images/photos/` 폴더에 넣기 (예: `photo1.jpg`)
2. `index.html`에서 `<div class="slide" data-bg="">` 의 `data-bg` 에 경로 입력
   ```html
   <div class="slide" data-bg="images/photos/photo1.jpg">
   ```
3. 슬라이드 수를 늘리려면 `<div class="slide">...</div>` 블록을 복사
4. 전환 시간은 `js/main.js` 맨 위 `SLIDE_INTERVAL` 값 변경 (5000 = 5초)

## 배포 (Vercel)
GitHub에 코드를 올리면(push) Vercel이 자동으로 홈페이지를 다시 배포합니다. (보통 1분 안에 반영)
- 처음 한 번만: https://vercel.com 에서 GitHub로 가입 → **Add New → Project** → `GMI_HomePage` **Import** → **Deploy**
- 배포 상황과 주소는 Vercel 대시보드에서 확인할 수 있어요.
