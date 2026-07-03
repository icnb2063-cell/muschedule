공연 일정표 Cloudflare D1 배포 안내

이 패키지는 처음 제공한 HTML 파일을
GitHub → Cloudflare Workers 및 Pages → D1 SQLite 데이터베이스
구조로 배포할 수 있게 수정한 버전입니다.

[파일 구조]
index.html
functions/api/shows.js
schema.sql
README.txt

[1] GitHub 업로드
압축을 푼 뒤, 위 파일들이 GitHub 저장소의 맨 위에 바로 보이도록 업로드합니다.
폴더째 한 번 더 감싸서 올리면 안 됩니다.

올바른 예:
index.html
functions/api/shows.js
schema.sql
README.txt

잘못된 예:
musical_schedule_d1_clean/index.html
musical_schedule_d1_clean/functions/api/shows.js

[2] Cloudflare 연결
Cloudflare → Workers 및 Pages → 응용 프로그램 생성 → GitHub 저장소 연결 → 배포합니다.

[3] D1 데이터베이스 만들기
Cloudflare 왼쪽 메뉴 → 스토리지 및 데이터베이스 → D1 SQLite 데이터베이스
새 데이터베이스를 만듭니다.
예: muscheddb

[4] D1 바인딩 연결
Cloudflare → 해당 프로젝트 → 바인딩 또는 설정의 바인딩/변수 메뉴
D1 데이터베이스 바인딩을 추가합니다.

변수 이름: DB
D1 데이터베이스: 방금 만든 DB 예: muscheddb

중요: 변수 이름은 반드시 DB입니다.

[5] schema.sql 실행
D1 데이터베이스 화면 → 콘솔 또는 쿼리 실행 화면에서
schema.sql 내용을 붙여넣고 실행합니다.

[6] 재배포
프로젝트 화면 → 배포 → 최신 배포 다시 배포
또는 GitHub에 커밋하면 자동 재배포됩니다.

[7] 테스트
배포 주소 접속 → 공연 추가 → 새로고침
다른 브라우저나 다른 기기에서 같은 주소로 접속했을 때 같은 공연 목록이 보이면 성공입니다.

[문제 해결]
- 'D1 binding DB가 연결되지 않았습니다.'
  → 프로젝트의 D1 바인딩 변수 이름이 DB인지 확인하세요.

- 'no such table: app_data'
  → schema.sql을 D1 콘솔에서 실행하지 않은 상태입니다.

- GitHub에는 있는데 화면이 빈 페이지
  → index.html이 저장소 맨 위에 있는지 확인하세요.
