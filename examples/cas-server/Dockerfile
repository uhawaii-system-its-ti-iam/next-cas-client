FROM apereo/cas:7.0.8

RUN keytool -genkeypair -alias cas -keyalg RSA -keypass changeit \
    -storepass changeit -keystore /etc/cas/thekeystore \
    -dname "CN=cas.example.org,OU=Example,OU=Org,C=AU" \
    -ext SAN="dns:example.org,dns:localhost,ip:127.0.0.1"
