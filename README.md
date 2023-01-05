## 📍&nbsp;&nbsp;Getting Stated

- git clone 명령어

```jsx
mkdir photolog_server
cd photolog_server
git clone https://github.com/Elice-SW-Engineer-Project-2/Photolog_Server_Repository.git .
npm install
vi .env.dev
vi .env.staging

```

- Backend local env 파일 (.env.dev)

```jsx
DB_TYPE="mysql"
DB_HOST="localhost"
DB_PORT=3306
DB_USERNAME="root"
DB_PASSWORD= {YOUR LOCALHOST ROOT PASSWORD}
DB_DATABASE= "photolog"
```

- Backend staging env 파일 (.env.staging)

```jsx
DB_TYPE="mysql"
DB_HOST= {YOUR_RDS_HOST_NAME}
DB_PORT=3306
DB_USERNAME="admin"
DB_PASSWORD= {YOUR_RDS_PASSWORD}
DB_DATABASE= {YOUR_RDS_DATABASENAME}
```

- Backend env 공통 요소

```jsx
PORT={YOUR_NESTJS_PORT}

PASSWORD_HASH_SALT= {YOUR_BCRYPT_HASH_SALT}

S3_ACCESS_KEY_ID= {YOUR_S3_ACCESS_KEY_ID}
S3_SECRET_ACCESS_KEY= {YOUR_SECRET_ACCESS_KEY}
S3_BUCKET_NAME= {YOUR_S3_BUCKET_NAME}
S3_PRESIGNED_EXPIRES= {YOUR_PRESIGNED_EXPIRES_SECOND}
S3_IMAGE_LIMIT_CAPA= {YOUR_IMAGE_CAPABILITY_MB}

ACCESS_SECRET= {YOUR_JWT_ACCESS_SECRET}
REFRESH_SECRET= {YOUR_JWT_REFRESH_SECRET}

AUTH_GMAIL_FROM = {YOUR_GMAIL_ACCOUNT_NAME}
AUTH_GMAIL_PASSWORD = {YOUR_GMAIL_ACCESS_TOKEN}
```
