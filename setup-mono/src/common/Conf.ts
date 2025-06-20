
export class Conf {
    static KEY_SERVER = 'hkp://keyserver.ubuntu.com:80' ;
    static RECV_KEYS = '3FA7E0328081BFF6A14DA29AA6A19B38D3D831' ;
    static DOWNLOAD_URL = 'https://download.mono-project.com/repo/ubuntu' ;
    static ETC_CONFIG = '/etc/apt/sources.list.d/mono-official.list' ;
    // 
    static URL_1 = `sudo apt-key adv --keyserver <KEY_SERVER> --recv-keys <RECV_KEYS>`;
    static URL_2 = `echo "deb <DOWNLOAD_URL> stable-focal/snapshots/<MONO_VERSION> main" | sudo tee <ETC_CONFIG>` ;
}