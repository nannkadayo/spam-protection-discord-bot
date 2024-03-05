# spam-protection-discord-bot


> [!NOTE]
> For instructions on how to use it, please check "Usage" below.  
> 使い方は、下の「Usage / 使い方」をご確認ください

グローバルbanと違反点数を管理して自動でglobal banしたりするもの

### Dependencies / 依存関係

[![discord.js v14.x\~]
## Files / ファイル

|File Name / ファイル名|Description / 説明|
|---|---|
|`bot.config.js`|environmental variables 環境変数|
|`package.json`|package metadata パッケージメタデータ|
|`LICENSE`|License (copyright information) ライセンス(著作権情報)|

## Script Commands / スクリプトコマンド

|Command / コマンド|Description / 説明|
|---|---|
|`npm start`|launch the bot ボットを起動します|

## environmental variables / 環境変数 (.env)

|variables name / 変数名|Description / 説明|
|---|---|
|`botdata.token`|bot token|
|`botdata.admin`|bot administrators (separated by commas) / ボット管理者(カンマ(,)で複数指定)|
|`color.success`|Coloring embedded messages in case of successes / successの時のembedのカラーリング|
|`color.fatal`|Coloring embedded messages in case of fatales / fatalの時のembedのカラーリング|
|`color.warn`|Coloring embedded messages in case of warnes / warnの時のembedのカラーリング|
|`botdata.log`|global banされた場合や、違反行為をした場合の通知先(カンマ(,)で複数指定|

## Usage / 使い方

### Setup / セットアップ

- run `npm install`
- edit `token` and `admin` and `owner` and `log` in file: `bot.config.js`

### Lunch / 起動

- run `npm start`

## Example / 例

### Slashcommand / スラッシュコマンド

|Command / コマンド|Description / 説明|
|---|---|
|`/point`|Change points|
|`/check`|Check user information|
|`/gban`|user global ban|
|`/pardon`|Remove the user's global ban|
|`/syncing`|ban syncing|
