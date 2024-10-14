# chrome-dcredential-sample

ChromeでのDigital Credential APIの技術確認

## Google提供のデモアプリでのお試し

1. Android Studioを起動
2. サンプルアプリをインストール

```bash
adb install -t ./01_apk/appholder-wallet-debug.apk
```

## Emulatorの構築

```bash
# 作業ディレクトリに移動（移動先は任意）
cd /home/ssm-user/

apt update && apt upgrade -y
sudo apt-get install -y android-sdk python3.10-venv
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
sudo apt install -y cpu-checker nodejs npm

# Node.jsのインストール方法は注意（実行後リロードしてセッションをクリアする）
sudo npm install n -g
sudo n stable
sudo apt purge -y nodejs npm
sudo apt autoremove -y
```

Dockerをインストール

```bash
# Dockerのインストール
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo groupadd docker
sudo usermod -aG docker $USER

# docker-composeのインストール
apt install docker-compose 
```

※セットアップ時のバージョン

```bash
python3 --version
> Python 3.10.12

node -v
> v20.18.0

docker --version
> Docker version 27.3.1, build ce12230

docker-compose --version
> docker-compose version 1.29.2, build unknown
```

ライブラリがインストールされたことを確認

```bash
adb devices

# 出力例
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
```

emu-dockerのインストール・セットアップを行う

```bash
git clone https://github.com/google/android-emulator-container-scripts
cd android-emulator-container-scripts
source ./configure.sh
```

一部ライブラリの依存関係がずれているので修正する

```bash
python -m pip install markupsafe==2.0.1
pip install requests==2.31.0
```

# emu-dockerが起動することを確認

```bash
emu-docker list
```

エミュレーターをインストールし、起動する

```bash
# バージョンを指定する場合
curl -O 'https://dl.google.com/android/repository/emulator-linux_x64-12414864.zip'
curl -O 'https://dl.google.com/android/repository/sys-img/android/x86_64-30_r11.zip'
emu-docker create emulator-linux_x64-12414864.zip x86_64-30_r11.zip

# とりあえず安定版を入れる場合
emu-docker create stable "R android x86_64"
```

Webエミュレーターをセットアップし、起動する

```bash
# セットアップ
./create_web_container.sh

# ADBを有効にするオプションを加えて、実行する
docker-compose -f js/docker/docker-compose.yaml -f js/docker/development.yaml up
```

* リモートデスクトップからアクセス
  * https://zenn.dev/yamagile/articles/80843d9ae24abe
* ALB+Route53+ACMでgPRC接続
    https://zenn.dev/hsaki/books/golang-grpc-starting/viewer/awshost
```bash
```

## 参考

* [google/android-emulator-container-scripts](https://github.com/google/android-emulator-container-scripts)
* [開発メモ その298 Ubuntu 22.04.1 で Android Emulator を動かし GUI 表示する](https://taktak.jp/2022/08/27/4457/)
* [UbuntuにDockerを入れるメモ｜おれっち](https://note.com/__olender/n/n344a2a77b1cc)
* [Docker7.0.0でdocker-composeできなくなる話](https://zenn.dev/kanabun/articles/4560024768c2b9)
* [docker-compose fails with error "urllib3.exceptions.URLSchemeUnknown: Not supported URL scheme http+docker" - Stack Overflow](https://stackoverflow.com/questions/78518146/docker-compose-fails-with-error-urllib3-exceptions-urlschemeunknown-not-suppor)
