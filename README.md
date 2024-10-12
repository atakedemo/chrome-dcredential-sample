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
apt update && apt upgrade -y
sudo apt-get install -y android-sdk python3.10-venv nodejs npm

sudo groupadd docker
sudo usermod -aG docker $USER
wget -qO- https://get.docker.com | sh
```

ライブラリがインストールされたことを確認

```bash
adb devices

# 出力例
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
```

エミュレーターの構築

```bash
# 作業ディレクトリに移動（移動先は任意）
cd /home/ssm-user/

git clone https://github.com/google/android-emulator-container-scripts
cd android-emulator-container-scripts
git checkout 94592e7dbb46d28ec46497c0bdd00c3a95afe1cc
source ./configure.sh
```

emu-dockerをインストールする

```bash
python -m pip install markupsafe==2.0.1

# emu-dockerが起動することを確認
emu-docker
```

Dcokerの起動

```bash
dockerd
```

エミュレーターをインストールする

```bash
emu-docker create stable "R android x86_64"
```

## 参考

* [google/android-emulator-container-scripts](https://github.com/google/android-emulator-container-scripts)
* [開発メモ その298 Ubuntu 22.04.1 で Android Emulator を動かし GUI 表示する](https://taktak.jp/2022/08/27/4457/)