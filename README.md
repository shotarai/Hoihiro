# teamA

## リモートリポジトリのクローンからプッシュまでの流れ

### 1. リモートリポジトリのクローン

まず、リモートリポジトリをローカルにクローンする。リポジトリのURLを使用して次のコマンドを実行する。

```
git clone git@github.com:shotarai/teamA.git
```

### 2. 現在のリポジトリを確認
*のところが現在のブランチ

```
git branch
```

```
  demo
* develop
  main
```

### 3. 新しいブランチを切りだし

```
git checkout -b {your-feature-branch}
```

### 4. 変更をリモートに反映

```
git add .
git commit -m "メッセージを書いて下さい！"
git push
```

### 4. リモートのブランチをローカルへ落とし込む(ローカルにbranch1がない)
```
git fetch origin
git checkout -b branch1 origin/branch1
```
### 5. リモートのブランチをローカルのブランチに反映(ローカルにbranch1がある)
```
git fetch origin
git checkout branch1
git merge origin/branch1
```
