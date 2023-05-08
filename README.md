# PP-Undo

**〜概要〜**

- デジタル手書きにおける筆圧をUndo/Redoの軸とした新たなUndo手法

**システム構成**

- 開発環境
  - Docker
    - Docker上でReact + TypeScript，Go，MySQL，PHPMyAdminを動かしてる
- フロントエンド
  - [React](https://react.dev/)
    - vite使用
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- バックエンド
  - [Go](https://golang.org/)
    - フレームワーク：[Echo](https://echo.labstack.com/)
- データベース
  - MySQL
    - 実験用とその他でテーブルを変える可能性あり

### 設定ファイル
- `./.env`
  - ```
    MYSQL_USER=ppundo
    MYSQL_PASSWORD=ppundo++1234 // 本番環境ではここを変更
    MYSQL_ROOT_PASSWORD=ppundo++1234 // 本番環境ではここを変更
    MYSQL_HOST=tcp(mysql:3306)
    MYSQL_DATABASE=ppundo_db
    PMA_HOST=mysql
    PMA_USER=ppundo // 本番環境ではこの行を書かない
    PMA_PASSWORD=ppundo++1234 // 本番環境ではこの行を書かない
    MODE=exam // 実験用はexam
    ```

- `./client/.env`
  - ```
    VITE_API_URL=http://localhost:7151 // APIのURL
    ```

### 開発で使用するポート一覧

|     | port | 説明                           | docker container 名 |
| :-: | ---- | :----------------------------- | ------------------- |
|     | 7150 | クライアント, React            | ppundo-client       |
|     | 7151 | API, Go                        | ppundo-api          |
|     | 7152 | データベース，   MySQL         | ppundo-mysql        |
|     | 7153 | データベースの操作, PHPMyAdmin | ppundo-phpmyadmin   |

> 今は開発環境ではクライアントは`npm run dev`を実行してdocker上では実行しない方法の方がいいかも