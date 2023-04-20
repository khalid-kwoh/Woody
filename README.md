# node toy-project

# 1
기본 환경 설정

# 2
[데이터 대상](https://github.com/lunasoft-org/rnd-socket-io-redis-adapter)를 참고하여 Express, MySQL 패키지를 이용하셔서 CRUD 구성

# 3
1. 아이디는 domains.domain으로 사용하고, 비밀번호는 domains.api_key으로 사용하여 login은 기능을 구현하라. 만약 로그인에 성공했다면 만료가 30분인 session_key를 생성해서 response하라.
2. udpate api_token 제작  response.session_key, request.api_token 입력받아 데이터 업데이트
3. 업데이트 전에 발급한 session_key가 해당 domain이 맞는지 그리고 로그인 상태인지 확인 

# 4
1. session_key 를 jwt.io를 참고해서 생성하세오.
2. payload:data 는 필수적으로 domain값을 포함하도록 해주세요.
3. api_toekn을 갱신할때 session_key가 맞는지 (기존로직 개선), 검증된 payload의 값이 요청받은 domain과 같은지 비교
